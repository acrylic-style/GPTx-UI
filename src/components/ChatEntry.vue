<template>
  <div class="message">
    <v-icon class="message-author-icon" :icon="getIconForRole(content.role)"></v-icon>
    <p>{{ content.role.substring(0, 1).toUpperCase() + content.role.substring(1) }}:</p>
    <div v-html="compile()"></div>
    <v-img
      v-for="image in getFiles()"
      max-height="600"
      :key="image.image_url"
      :src="image.image_url"
    ></v-img>
    <div class="flex-row">
      <v-btn
        icon="mdi-clipboard"
        @click="copyToClipboard()"
      ></v-btn>
      <v-btn
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
import {contentToString, JsonContentImageUrl, JsonMessage, TextMessage} from "@/util/history";

marked.use({
  gfm: true
})

const props = defineProps<{
  content: JsonMessage | TextMessage
}>()

const emit = defineEmits<{
  remove: []
}>()

const getFiles = () => {
  if (typeof props.content.content === 'string') {
    return []
  } else {
    return props.content.content.filter(e => e.type === 'image_url') as JsonContentImageUrl[]
  }
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

const compile = (): string => {
  requestAnimationFrame(() => hljs.highlightAll())
  return (DOMPurify as any).default.sanitize(marked(contentToString(props.content)))
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(contentToString(props.content))
}
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
</style>
