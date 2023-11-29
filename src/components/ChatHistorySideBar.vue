<template>
  <div class="history">
    <v-btn
      :flat="true"
      :disabled="disabled"
      prepend-icon="mdi-plus"
      @click="selectedId = ''; emit('load', { id: '', title: '', messages: [] })"
    >新しい会話</v-btn>
    <hr />
    <history-entry-button
      v-for="item in items"
      :key="item.id"
      :item="item"
      :type="type"
      :selected="selectedId === item.id"
      :disabled="disabled"
      @click="selectedId = item.id; emit('load', item); update()"
    ></history-entry-button>
  </div>
</template>

<script lang="ts" setup>
import {loadAllHistory as loadAllHistoryNormal} from "@/util/history/text";
import {loadAllHistory as loadAllHistoryThread} from "@/util/history/thread";
import HistoryEntryButton from "@/components/HistoryEntryButton.vue";
import {onMounted, ref} from "vue";

const { type } = defineProps<{
  type: 'normal' | 'thread'
  disabled: boolean
}>()

const emit = defineEmits<{
  load: [entry: { id: string, title?: string | null, messages: any[] }]
}>()

const loadAllHistory = () => {
  if (type === 'normal') {
    return loadAllHistoryNormal()
  } else {
    return loadAllHistoryThread()
  }
}

const selectedId = ref('')
const items = ref<Awaited<ReturnType<typeof loadAllHistory>>>([])

const update = async () => {
  items.value = await loadAllHistory()
}

onMounted(() => update())

defineExpose({update})

</script>

<style scoped>
.history {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: "JetBrains Mono", 'monospace';
}

.history>button {
  justify-content: left;
}

.selected {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
