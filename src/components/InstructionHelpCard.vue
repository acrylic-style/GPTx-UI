<template>
  <v-card
      prepend-icon="mdi-robot"
      title="「命令」とは？"
  >
    <v-card-text>
      <p>「命令」を使用すると、たとえば口調を変更したり、他にもなにかしてほしいことを「命令」として記述することができます。</p>
      <p>「入力」を使用すると出力に影響することがありますが、「命令」を使用すると(基本的に)出力結果には影響することなく命令することができます。</p>
    </v-card-text>
    <v-card-actions>
      <v-btn
          prepend-icon="mdi-close"
          color="blue"
          @click="$emit('close')"
      >閉じる</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (event: 'close'): void
}>()
</script>
