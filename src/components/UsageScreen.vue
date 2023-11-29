<template>
  <v-card title="モデルごとの使用量">
    <v-card-text>
      <v-progress-circular v-if="loading" indeterminate />
      <template v-else>
        <v-radio-group v-model="unit">
          <v-radio label="分" value="minute"></v-radio>
          <v-radio label="日" value="day"></v-radio>
        </v-radio-group>
        <!-- Workaround for close button being hidden in small window size -->
        <v-btn
          color="green"
          @click="$emit('setScreen', 'ok')"
        >閉じる</v-btn>
        <v-container
          v-for="(key) in Object.keys(me.used)"
          :key="key"
        >
          <p>{{ !modelNames[key] ? key : (modelNames[key].name || modelNames[key]) }}:
            {{ me.used[key][unit] }}/{{ me.limits[key] && me.limits[key][unit] !== null ? me.limits[key][unit] : 'Infinity' }}</p>
          <v-progress-linear
            v-if="me.limits[key] && me.limits[key][unit] !== null"
            :model-value="me.limits[key][unit] === 0 ? 100 : (me.used[key][unit]/me.limits[key][unit])*100"
            rounded
          />
        </v-container>
        <v-container
          v-for="(key) in Object.keys(me.image_used)"
          :key="key"
        >
          <p>{{ !modelNames[key] ? key : (modelNames[key].name || modelNames[key]) }}:
            {{ me.image_used[key][unit] }}/{{ me.image_limits[key] && me.image_limits[key][unit] !== null ? me.image_limits[key][unit] : 'Infinity' }}</p>
          <v-progress-linear
            v-if="me.image_limits[key] && me.image_limits[key][unit] !== null"
            :model-value="me.image_limits[key][unit] === 0 ? 100 : (me.image_used[key][unit]/me.image_limits[key][unit])*100"
            rounded
          />
        </v-container>
      </template>
    </v-card-text>
    <v-card-actions v-if="!loading">
      <v-btn
        color="green"
        @click="$emit('setScreen', 'ok')"
      >閉じる</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import {apiUrl} from "@/util/util";
import {onMounted, ref} from "vue";

const loading = ref(true)
const unit = ref<'day' | 'minute'>('day')
const me = ref<{
  allow_retrieval_tool: boolean,
  limits: { [model: string]: { minute: number | null, day: number | null } }
  image_limits: { [model: string]: { minute: number | null, day: number | null } }
  used: { [model: string]: { minute: number, day: number } },
  image_used: { [model: string]: { minute: number, day: number } },
}>(null)
const modelNames = ref({
  file: 'ファイル',
})

defineEmits<{
  setScreen: [string]
}>()

onMounted(async () => {
  me.value = await fetch(apiUrl('me'), { credentials: 'include' }).then(res => res.json())
  console.log(me.value)
  modelNames.value = {
    ...(await fetch(apiUrl('models')).then(res => res.json())),
    ...(await fetch(apiUrl('image_models')).then(res => res.json())),
  }
  loading.value = false
})
</script>
