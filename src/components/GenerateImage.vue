<template>
  <v-main>
    <generated-image-history-side-bar
      :disabled="generating"
      @load="onLoad"
      ref="sidebar"
    ></generated-image-history-side-bar>
    <v-container class="fill-height">
      <v-responsive class="text-center fill-height">
        <slot name="mode-selector" />
        <v-img
          v-for="(value, index) in current.images"
          :key="index"
          :src="'data:image/png;base64,' + value.b64_json"
        ></v-img>
        <v-select
          label="モデル"
          v-model="model"
          :items="models"
          :hint="model"
          :persistent-hint="true"
          :disabled="models.length === 0"
          :loading="models.length === 0"
          :readonly="generating"
          @update:model-value="onModelChange()"
        ></v-select>
        <v-select
          label="解像度"
          v-model="resolution"
          :items="models.find(e => e.value === model)?.resolutions || []"
          :readonly="generating"
        ></v-select>
        <v-textarea
          label="入力 (Prompt)"
          v-model="prompt"
          :auto-grow="true"
          :disabled="generating"
        ></v-textarea>
        <v-slider
          v-if="model === 'dall-e-2'"
          :label="'生成する数: ' + imageCount"
          v-model="imageCount"
          :min="1"
          :max="10"
          :step="1"
        ></v-slider>
        <v-switch
          v-if="model === 'dall-e-3'"
          v-model="hdQuality"
          :label="'画質: ' + (hdQuality ? 'HD' : 'Standard')"
          color="primary"
          :readonly="generating"
        ></v-switch>
        <v-switch
          v-if="model === 'dall-e-3'"
          v-model="naturalStyle"
          :label="'スタイル: ' + (naturalStyle ? 'Natural' : 'Vivid')"
          color="primary"
          :readonly="generating"
        ></v-switch>
        <v-btn
          class="float-left"
          color="blue"
          prepend-icon="mdi-delete"
          :disabled="generating || !current.id || current.images.length === 0"
          @click="deleteHistory(current.id); resetCurrent(); sidebar.update()"
        >削除</v-btn>
        <v-btn
          style="margin: 10px"
          class="float-right"
          color="blue"
          append-icon="mdi-send"
          :disabled="generating || prompt.length === 0 || models.find(e => e.value === model)?.resolutions?.includes(resolution) !== true"
          @click="generate()"
        >生成</v-btn>
      </v-responsive>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import GeneratedImageHistorySideBar from "@/components/GeneratedImageHistorySideBar.vue";
import {deleteHistory, GeneratedImageHistoryEntry, saveHistory} from "@/util/generated_image_history";
import {ref} from "vue";
import {apiUrl} from "@/util/util";

const sidebar = ref(null)
const models = ref([])
const model = ref('')
const prompt = ref('')
const resolution = ref('')
const hdQuality = ref(false)
const naturalStyle = ref(false)
const imageCount = ref(1)
const generating = ref(false)
const current = ref<GeneratedImageHistoryEntry>({ id: '', title: '', prompt: '', images: [] })

const onModelChange = () => {
  localStorage.setItem('generate_image_model', model.value)
}

const onLoad = (entry: GeneratedImageHistoryEntry) => {
  current.value = entry
}

const resetCurrent = () => {
  current.value.id = ''
  current.value.title = ''
  current.value.prompt = ''
  current.value.images = []
}

const generate = async () => {
  generating.value = true
  try {
    current.value.id = crypto.randomUUID()
    current.value.title = prompt.value
    const response = await fetch(apiUrl('generate_image'), {
      method: 'POST',
      body: JSON.stringify({
        prompt: prompt.value,
        model: model.value,
        n: model.value === 'dall-e-3' ? 1 : imageCount.value,
        quality: model.value === 'dall-e-3' ? (hdQuality.value ? 'hd' : 'standard') : undefined,
        size: resolution.value,
        style: model.value === 'dall-e-3' ? (naturalStyle.value ? 'natural' : 'vivid') : undefined,
      }),
    }).then(res => res.json())
    if (response.data) {
      current.value.images.push(...response.data)
      saveHistory(current.value)
      sidebar.value.update()
    } else {
      console.error('Invalid response', response)
    }
  } finally {
    generating.value = false
  }
}

fetch(apiUrl('image_models'))
  .then(res => res.json())
  .then(value => Object.keys(value).map(k => ({ value: k, title: value[k].name, resolutions: value[k].resolutions })))
  .then(array => models.value = array)
  .then(() => model.value = models.value[0].value)
  .then(() => {
    const modelOnLocalStorage = localStorage.getItem('generate_image_model')
    if (modelOnLocalStorage && models.value.find(e => e.value === modelOnLocalStorage)) {
      model.value = modelOnLocalStorage
    }
  })
</script>
