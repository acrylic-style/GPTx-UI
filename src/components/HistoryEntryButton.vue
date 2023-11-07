<template>
  <v-btn
    :flat="true"
    prepend-icon="mdi-message"
    :class="'history-btn' + (selected ? ' selected' : '')"
    :title="getTitleForButton(item)"
    :disabled="disabled"
  >{{ getTitleForButton(item) }}</v-btn>
</template>

<script lang="ts" setup>
import {HistoryEntry, JsonContent} from "@/util/history";

const { item } = defineProps<{
  item: HistoryEntry
  selected: boolean
  disabled: boolean
}>()

const getTitleForButton = (entry: HistoryEntry) => {
  const content = entry.title || entry.messages.find(e => e.role === 'user').content
  if (typeof content === 'string') {
    return content.substring(0, Math.min(content.length, 250))
  } else {
    const found = content.find(e => e.type === 'text') as unknown as JsonContent
    if (found.type !== 'text') return '<empty>'
    return found.text.substring(0, Math.min(found.text.length, 250))
  }
}
</script>

<style>
/*noinspection CssUnusedSymbol*/
.history-btn>.v-btn__content {
  justify-content: left;
  width: 100%;
  color: white;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-transform: none;
  letter-spacing: normal;
}
</style>
