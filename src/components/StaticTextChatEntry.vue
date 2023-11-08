<template>
  <div class="message">
    <v-icon class="message-author-icon" :icon="getIconForRole(role)"></v-icon>
    <p>{{ role.substring(0, 1).toUpperCase() + role.substring(1) }}:</p>
    <div v-html="compile()"></div>
    <div class="flex-row">
      <v-btn
        icon="mdi-clipboard"
        @click="copyToClipboard()"
      ></v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {marked} from "marked";
import * as DOMPurify from 'isomorphic-dompurify'
import hljs from 'highlight.js'

marked.use({
  gfm: true
})

const props = defineProps<{
  role: 'system' | 'user' | 'assistant'
  text: string
}>()

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
  return DOMPurify.sanitize(marked(props.text))
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.text)
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
