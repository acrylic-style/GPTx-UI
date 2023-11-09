<template>
  <v-app>
    <normal-chat v-if="mode === 'chat'">
      <template v-slot:mode-selector>
        <v-select
          label="モード"
          v-model="mode"
          :items="modes"
          item-title="title"
          item-value="value"
          @update:model-value="onModeChange()"
        ></v-select>
      </template>
    </normal-chat>
    <assistant-chat v-if="mode === 'assistant'">
      <template v-slot:mode-selector>
        <v-select
          label="モード"
          v-model="mode"
          :items="modes"
          item-title="title"
          item-value="value"
          @update:model-value="onModeChange()"
        ></v-select>
      </template>
    </assistant-chat>
    <generate-image v-if="mode === 'generate_image'">
      <template v-slot:mode-selector>
        <v-select
          label="モード"
          v-model="mode"
          :items="modes"
          item-title="title"
          item-value="value"
          @update:model-value="onModeChange()"
        ></v-select>
      </template>
    </generate-image>
  </v-app>
</template>

<script setup>
import NormalChat from "@/components/NormalChat.vue";
import {onMounted, ref} from "vue";
import AssistantChat from "@/components/AssistantChat.vue";
import GenerateImage from "@/components/GenerateImage.vue";

const modes = [
  { title: 'アシスタント', value: 'assistant' },
  { title: 'チャット', value: 'chat' },
  { title: '画像生成', value: 'generate_image' },
]
const mode = ref('chat')

const onModeChange = () => {
  localStorage.setItem('mode', mode.value)
}

onMounted(() => {
  const savedMode = localStorage.getItem('mode')
  if (savedMode) {
    mode.value = savedMode
  }
})
</script>

<style>
body, select {
  font-family: "JetBrains Mono", 'monospace';
}

.v-main {
  display: flex;
}
</style>
