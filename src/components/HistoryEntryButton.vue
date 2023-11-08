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
import {contentToString, HistoryEntry} from "@/util/history";
import {messageToString, ThreadHistoryEntry} from "@/util/thread_history";

const { type, item } = defineProps<{
  type: 'normal' | 'thread'
  item: HistoryEntry | ThreadHistoryEntry
  selected: boolean
  disabled: boolean
}>()

const getTitleForButton = (entry: HistoryEntry | ThreadHistoryEntry) => {
  if (entry.title) return entry.title
  if (type === 'normal') {
    const content = contentToString((entry as HistoryEntry).messages.find(e => e.role === 'user'))
    return content.substring(0, Math.min(content.length, 250))
  } else {
    const content = messageToString((entry as ThreadHistoryEntry).messages.find(e => e.role === 'user'))
    return content.substring(0, Math.min(content.length, 250))
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
