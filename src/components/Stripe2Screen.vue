<template>
  <v-card>
    <v-card-text>
      <p>GPTxへようこそ！</p>
      <p>新しいモードまたはモデルが追加されたため、サブスクリプションを更新する必要があります。</p>
      <p>下のボタンから次のページに進み、更新後のサブスクリプションを確認してください。</p>
      <v-btn color="blue" prepend-icon="mdi-credit-card-edit" @click="redirect()">進む</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import {apiUrl} from "@/util/util";

const redirect = () => {
  location.href = apiUrl('checkout')
}
</script>
