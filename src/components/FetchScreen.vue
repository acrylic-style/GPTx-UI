<template>
  <v-card :title="title">
    <v-card-text>
      <v-progress-circular v-if="loading" indeterminate />
      <template v-else>
        <pre><code class="language-markdown">{{ compile(text) }}</code></pre>
      </template>
    </v-card-text>
    <v-card-actions v-if="!loading">
      <v-btn
        color="green"
        @click="$emit('close')"
      >閉じる</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import hljs from "highlight.js";

const loading = ref(true)
const text = ref('')

const { url } = defineProps<{
  title: string
  url: string
}>()

defineEmits<{
  close: []
}>()

const compile = (text: string): string => {
  requestAnimationFrame(() => {
    hljs.highlightAll()
  })
  return text
}

onMounted(async () => {
  text.value = await fetch(url).then(res => res.text())
  loading.value = false
})
</script>
