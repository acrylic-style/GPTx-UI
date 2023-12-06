<template>
  <v-overlay
      :model-value="open"
      :persistent="true"
      class="align-center justify-center"
  >
    <getting-started-card @close="onClose()" />
  </v-overlay>
</template>

<script setup lang="ts">
import GettingStartedCard from "@/components/GettingStartedCard.vue";
import {ref} from "vue";

const open = ref(!localStorage.getItem('gptx-getting-started'))

const onClose = () => {
  open.value = false
  localStorage.setItem('gptx-getting-started', 'true')
}
</script>
