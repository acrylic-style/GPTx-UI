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
import {contentToString, HistoryEntry} from "@/util/history/text";
import {messageToString, ThreadHistoryEntry} from "@/util/history/thread";
import {GeneratedImageHistoryEntry} from "@/util/history/image";

const { type, item } = defineProps<{
  type: 'normal' | 'thread' | 'image'
  item: HistoryEntry | ThreadHistoryEntry | GeneratedImageHistoryEntry
  selected: boolean
  disabled: boolean
}>()

const getTitleForButton = (entry: HistoryEntry | ThreadHistoryEntry | GeneratedImageHistoryEntry) => {
  if (entry.title) return entry.title
  if (type === 'normal') {
    const content = contentToString((entry as HistoryEntry).messages.find(e => e.role === 'user'))
    return content.substring(0, Math.min(content.length, 250))
  } else if (type === 'thread') {
    const content = messageToString((entry as ThreadHistoryEntry).messages.find(e => e.role === 'user'))
    return content.substring(0, Math.min(content.length, 250))
  } else if (type === 'image') {
    const content = (entry as GeneratedImageHistoryEntry).prompt
    return content.substring(0, Math.min(content.length, 250))
  } else {
    throw new Error(type)
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
