<template>
  <div class="history">
    <v-btn
      :flat="true"
      :disabled="disabled"
      prepend-icon="mdi-plus"
      @click="selectedId = ''; emit('load', { id: '', title: '', prompt: '', images: [] })"
    >新しい会話</v-btn>
    <hr />
    <history-entry-button
      v-for="item in items"
      :key="item.id"
      :item="item"
      type='image'
      :selected="selectedId === item.id"
      :disabled="disabled"
      @click="selectedId = item.id; emit('load', item); update()"
    ></history-entry-button>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import HistoryEntryButton from "@/components/HistoryEntryButton.vue";
import {GeneratedImageHistoryEntry, loadAllHistory} from "@/util/history/image";

defineProps<{
  disabled: boolean
}>()

const emit = defineEmits<{
  load: [entry: GeneratedImageHistoryEntry]
}>()

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
