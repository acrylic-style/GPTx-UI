<template>
  <v-main>
    <SideBar
      :disabled="generating"
      @load="onLoad"
      type="thread"
      ref="sidebar"
    ></SideBar>
    <v-container class="fill-height">
      <v-responsive class="text-center fill-height">
        <slot name="mode-selector" />
        <v-select
          v-model="model"
          :items="filterModels()"
          :hint="model"
          :persistent-hint="true"
          item-title="title"
          item-value="value"
          :disabled="filterModels().length < 1"
          :loading="filterModels().length < 1"
          :readonly="generating"
          @update:model-value="onModelChange()"
        ></v-select>
        <v-textarea
          label="命令 (System)"
          v-model="systemPrompt"
          :disabled="generating"
        ></v-textarea>
        <v-btn
          color="pink"
          prepend-icon="mdi-heart"
          @click="systemPrompt += 'あなたは「ずんだもん」というキャラクターのように話してください。ずんだもんは幼い女の子で、無邪気な性格をしており、口調は強気であり、「〜のだ」「〜なのだ」を語尾につけます。'"
          :disabled="generating"
        >ずんだもん</v-btn>
        <thread-chat-entry
          v-for="(item, index) in current.messages"
          :key="index"
          :content="item"
          :allow-remove="false"
          @remove="() => current.messages.splice(index, 1)"
        />
        <v-textarea
          label="入力 (User)"
          v-model="userPrompt"
          :auto-grow="true"
          :disabled="generating"
        ></v-textarea>
        <v-file-input
          v-model="files"
          :multiple="true"
          label="ファイル"
          :disabled="generating"
        ></v-file-input>
        <v-btn
          class="float-left"
          color="blue"
          prepend-icon="mdi-delete"
          :disabled="generating || !current.id || current.messages.length === 0"
          @click="deleteThread()"
        >削除</v-btn>
        <v-btn
          class="float-left"
          color="blue"
          prepend-icon="mdi-floppy"
          :disabled="generating || !current.id"
          @click="saveHistory(current)"
        >保存</v-btn>
        <v-btn
          class="float-left"
          color="blue"
          prepend-icon="mdi-refresh"
          :disabled="generating || !current.id"
          @click="updateCurrentThread()"
        >更新</v-btn>
        <v-btn
          style="margin: 10px"
          class="float-right"
          color="blue"
          append-icon="mdi-send"
          :disabled="generating || userPrompt.length === 0 || !isSelectedValidModel()"
          @click="generate()"
        >生成</v-btn>
        <v-checkbox
          :label="current.messages.length === 0 ? '自動保存（オン）' : '自動保存'"
          class="float-right"
          v-model="autoSave"
          :disabled="current.messages.length === 0"
        ></v-checkbox>
        <v-checkbox
          label="Code Interpreter"
          class="float-right"
          v-model="codeInterpreter"
          :disabled="generating"
        ></v-checkbox>
        <v-checkbox
          label="Retrieval"
          class="float-right"
          v-model="retrieval"
          :disabled="generating"
        ></v-checkbox>
      </v-responsive>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import SideBar from "@/components/ChatHistorySideBar.vue";
import {ref} from "vue";
import {apiUrl, SUMMARIZE_PROMPT} from "@/util/util";
import {deleteHistory, ThreadHistoryEntry, saveHistory, Message, Run} from "@/util/thread_history";
import ThreadChatEntry from "@/components/ThreadChatEntry.vue";

const models = ref(new Array<{ title: string, value: string }>())
const model = ref('')
const systemPrompt = ref('')
const userPrompt = ref('')
const files = ref<File[]>([])
const current = ref<ThreadHistoryEntry>({ id: '', title: '', messages: [] })
const generating = ref(false)
const autoSave = ref(true)
const codeInterpreter = ref(true)
const retrieval = ref(true)
const sidebar = ref(null)

const onModelChange = () => {
  localStorage.setItem('assistant-model', model.value)
}

const onLoad = (entry: ThreadHistoryEntry) => {
  current.value = entry
}

const resetCurrent = () => {
  current.value.id = ''
  current.value.title = ''
  current.value.messages = []
}

const deleteThread = () => {
  fetch(apiUrl(`threads/${current.value.id}`), {method: 'DELETE'})
  deleteHistory(current.value.id)
  resetCurrent()
  sidebar.value.update()
}

const updateCurrentThread = async () => {
  return await fetch(apiUrl(`threads/${current.value.id}/messages`))
    .then(res => res.json())
    .then(async res => {
      if (res.data) {
        await updateThreadWithMessages(res.data as Array<Message>)
      }
    })
}

const getRunSteps = (runId: string) =>
  fetch(apiUrl(`threads/${current.value.id}/runs/${runId}/steps`))
    .then(res => res.json())
    .then(res => {
      if (res.data) {
        return res.data
      } else {
        throw new Error('Invalid response: ' + JSON.stringify(res))
      }
    })

const getRun = (runId: string) =>
  fetch(apiUrl(`threads/${current.value.id}/runs/${runId}`))
    .then(res => res.json())
    .then((res: Run) => {
      if (res.status) {
        return res
      } else {
        throw new Error('Invalid response: ' + JSON.stringify(res))
      }
    })

const updateThreadWithMessages = async (messages: Array<Message>) => {
  for (const message of messages.sort((a, b) => a.created_at - b.created_at)) {
    const existingMessage = current.value.messages.find(e => e.id === message.id)
    if (existingMessage) {
      existingMessage.content = message.content
      if (existingMessage.file_ids && existingMessage.file_ids.length > 0 && !existingMessage.files) {
        existingMessage.files =
          (await Promise.all(existingMessage.file_ids.map(id => fetch(apiUrl('files/' + id)).then(res => res.json()))))
            .filter(e => e.filename)
      }
      if (existingMessage.run_id) {
        if (!existingMessage.run) {
          existingMessage.run = await getRun(existingMessage.run_id)
        } else if (!existingMessage.run.steps) {
          existingMessage.run.steps = await getRunSteps(existingMessage.run_id)
        }
      }
    } else {
      if (message.run_id) {
        message.run = await getRun(message.run_id)
        message.run.steps = await getRunSteps(message.run_id)
      }
      if (message.file_ids && message.file_ids.length > 0) {
        message.files =
          (await Promise.all(message.file_ids.map(id => fetch(apiUrl('files/' + id)).then(res => res.json()))))
            .filter(e => e.filename)
      }
      current.value.messages.push(message)
    }
  }
}

const awaitRun = (run: Run) => {
  return new Promise<Run>((resolve, reject) => {
    const interval = setInterval(() => {
      updateCurrentThread()
      fetch(apiUrl(`threads/${run.thread_id}/runs/${run.id}`))
        .then(res => res.json())
        .then((res: Run) => {
          if (!res.status) {
            clearInterval(interval)
            return reject(JSON.stringify(res))
          }
          if (res.status !== 'queued' && res.status !== 'in_progress') {
            clearInterval(interval)
            resolve(res)
          }
        })
        .catch(e => {
          clearInterval(interval)
          reject(e)
        })
    }, 1000)
  })
}

const buildToolsArray = () => {
  const arr = []
  if (codeInterpreter.value) {
    arr.push({ type: 'code_interpreter' })
  }
  if (retrieval.value) {
    arr.push({ type: 'retrieval' })
  }
  return arr
}

const generateFirst = async (): Promise<Run> => {
  const run: Run = await fetch(apiUrl('threads/create_and_run'), {
    method: 'POST',
    body: JSON.stringify({
      model: model.value,
      instructions: systemPrompt.value || null,
      messages: [{ role: 'user', content: userPrompt.value }],
      tools: buildToolsArray(),
      files: await Promise.all(files.value.map(async file => ({
        name: file.name,
        data: Array.from(new Int8Array(await file.arrayBuffer()))
      })))
    })
  }).then(res => res.json())
  if (!run.thread_id) throw new Error(`Received invalid response: ${JSON.stringify(run)}`)
  current.value.id = run.thread_id
  return run
}

const generateMore = async (): Promise<Run> => {
  const message: Message = await fetch(apiUrl(`threads/${current.value.id}/messages`), {
    method: 'POST',
    body: JSON.stringify({
      role: 'user',
      content: userPrompt.value,
    })
  }).then(res => res.json())
  if (!message.content) throw new Error(`Received invalid response: ${JSON.stringify(message)}`)
  current.value.messages.push(message)
  return await fetch(apiUrl(`threads/${current.value.id}/runs`), {
    method: 'POST',
    body: JSON.stringify({
      model: model.value,
      instructions: systemPrompt.value || null,
      tools: buildToolsArray(),
    })
  }).then(res => res.json())
}

const generate = async () => {
  generating.value = true
  try {
    let run: Run
    if (current.value.messages.length === 0) {
      run = await generateFirst()
    } else {
      run = await generateMore();
    }
    await awaitRun(run)
    await updateCurrentThread()
    const userPromptBackup = userPrompt.value
    userPrompt.value = ''
    files.value = []
    if (!current.value.title) {
      await fetch(apiUrl('generate'), {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          content: [
            {role: 'system', content: SUMMARIZE_PROMPT},
            {role: 'user', content: userPromptBackup},
          ]
        })
      }).then(res => res.text()).then(summary => {
        if ((summary.startsWith('"') && summary.endsWith('"')) || (summary.startsWith('「') && summary.endsWith('」'))) {
          summary = summary.substring(1, summary.length - 1)
        }
        current.value.title = summary
        saveHistory(current.value)
        sidebar.value.update()
      })
    } else if (autoSave.value) {
      saveHistory(current.value)
    }
  } finally {
    generating.value = false
  }
}

const filterModels = (): Array<{ title: string, value: string }> => {
  if (!models.value) return []
  if (retrieval.value) {
    return models.value.filter(e => e.value === 'gpt-4-1106-preview')
  } else {
    return models.value
  }
}

const isSelectedValidModel = () => filterModels().find(e => e.value === model.value)

fetch(apiUrl('models'))
  .then(res => res.json())
  .then(value => Object.keys(value).map(k => ({ value: k, title: value[k] })))
  .then(array => models.value = array)
  .then(() => model.value = 'gpt-4-1106-preview')
  .then(() => {
    const modelOnLocalStorage = localStorage.getItem('assistant-model')
    if (modelOnLocalStorage && models.value.find(e => e.value === modelOnLocalStorage)) {
      model.value = modelOnLocalStorage
    }
  })
</script>

<style scoped>
/*noinspection CssUnusedSymbol*/
.v-main {
  display: flex;
}
</style>
