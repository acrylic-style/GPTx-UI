<template>
  <div class="message">
    <v-icon class="message-author-icon" :icon="getIconForRole(content.role)"></v-icon>
    <p>{{ content.role.substring(0, 1).toUpperCase() + content.role.substring(1) }}:</p>
    <v-expansion-panels v-if="getToolCalls().length > 0 || content.run?.instructions">
      <v-expansion-panel
        v-if="content.run?.instructions"
        title="命令 (Instructions)"
        :text="content.run.instructions"
      ></v-expansion-panel>
      <v-expansion-panel
        v-for="(value, index) in getToolCalls()"
        :key="index"
      >
        <v-expansion-panel-title>
          ステップを表示 {{ getToolCalls().length > 1 ? `(${index + 1})` : '' }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-expansion-panels v-if="value.step_details.tool_calls.length > 0">
            <v-expansion-panel
              v-for="(call, index) in value.step_details.tool_calls"
              :key="index"
              @click="scheduleHighlight()"
            >
              <v-expansion-panel-title>
                コードを表示 {{ value.step_details.tool_calls.length > 1 ? `(${index + 1})` : '' }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <template v-if="call.type === 'code_interpreter'">
                  <p>Pythonコード:</p>
                  <pre><code class="language-python">{{ call.code_interpreter.input }}</code></pre>
                  <div
                    v-for="(output, index) in call.code_interpreter.outputs"
                    :key="index"
                  >
                    <p>結果:</p>
                    <pre v-if="output.type === 'logs'"><code class="language-python">{{ output.logs }}</code></pre>
                    <v-img
                      v-else-if="output.type === 'image'"
                      alt="Image"
                      :src="apiUrl(`files/${output.image.file_id}/content`)"
                      max-width="100%"
                    />
                  </div>
                </template>
                <template v-else-if="call.type === 'retrieval'">
                  <p>Retrieval: {{ call.id }}</p>
                </template>
                <template v-else-if="call.type === 'function'">
                  <p>Function:</p>
                  <p>名前: {{ call.function.name }}</p>
                  <p>引数:</p>
                  <pre><code class="language-json">{{ call.function.arguments }}</code></pre>
                  <template v-if="call.function.output.length < 10000">
                    <p>出力 ({{ call.function.output.length }}文字):</p>
                    <pre><code>{{ call.function.output }}</code></pre>
                  </template>
                  <template v-else>
                    <p>出力: {{ call.function.output.length }}文字</p>
                    <v-btn
                      icon="mdi-clipboard"
                      @click="copyToClipboard(call.function.output)"
                    ></v-btn>
                  </template>
                </template>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <div ref="message" v-html="compile(messageToString(content))"></div>
    <v-img
      v-for="image in getFiles()"
      max-height="600"
      :key="image.image_file.file_id"
      :src="apiUrl('files/' + image.image_file.file_id + '/content')"
    ></v-img>
    <v-expansion-panels v-if="content.files">
      <v-expansion-panel title="アップロードされたファイル">
        <v-expansion-panel-text>
          <ul>
            <li v-for="(file) in content.files" :key="file.id">{{ file.filename }}</li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="flex-row">
      <v-btn
        icon="mdi-math-integral"
        @click="mathJaxTypeSet()"
      ></v-btn>
      <v-btn
        icon="mdi-clipboard"
        @click="copyToClipboard(messageToString(content))"
      ></v-btn>
      <v-btn
        v-if="allowRemove"
        icon="mdi-delete"
        @click="emit('remove')"
      ></v-btn>
      <span v-if="getFiles().length !== 0">
        ({{ getFiles().length }} file{{ getFiles().length > 1 ? 's': '' }})
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {marked} from "marked";
import * as DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import {Message, MessageContentImageFile, messageToString} from "@/util/thread_history";
import {apiUrl} from "@/util/util";
import {onMounted, ref} from "vue";

const message = ref(null)

marked.use({
  gfm: true,
})

const props = defineProps<{
  content: Message
  allowRemove: boolean
}>()

const emit = defineEmits<{
  remove: []
}>()

const getToolCalls = () => {
  const calls = []
  const arr = props.content?.run?.steps || []
  arr.sort((a, b) => a.created_at - b.created_at)
  for (const value of arr) {
    if (value.type === 'message_creation') {
      if (value.step_details.message_creation.message_id === props.content.id) {
        return calls
      }
      calls.length = 0
    } else if (value.type === 'tool_calls') {
      calls.push(value)
    }
  }
  return calls
}

const getFiles = () => {
  return props.content.content.filter(e => e.type === 'image_file') as MessageContentImageFile[]
}

const getIconForRole = (role: 'system' | 'user' | 'assistant') => {
  if (role === 'system') {
    return 'mdi-play'
  } else if (role === 'user') {
    return 'mdi-account'
  } else {
    return 'mdi-clippy'
  }
}

const scheduleHighlight = () => {
  requestAnimationFrame(() => {
    hljs.highlightAll()
  })
}

const mathJaxTypeSet = () => {
  // eslint-disable-next-line no-undef
  MathJax.typeset([message.value])
}

const compile = (text: string): string => {
  scheduleHighlight()
  return DOMPurify.sanitize(marked(text))
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

onMounted(() => scheduleHighlight())
</script>

<style scoped>
.message {
  text-align: left;
  color: white;
  margin: 15px auto;
  width: 95%;
  border: solid #808080 1px;
  justify-content: left;
  border-radius: 3px;
  padding: 10px 45px;
  background-color: rgba(0, 0, 0, 0.5);
  display: grid;
}

.message-author-icon {
  left: -35px;
  bottom: -20px;
  line-height: 0;
  height: 0;
  width: 0;
}

pre {
  display: grid;
  text-wrap: inherit;
}
</style>
