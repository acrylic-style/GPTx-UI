<template>
  <v-card>
    <v-card-text>
      <p>アカウントの作成に成功しました！</p>
      <p>次に、支払い方法の設定を行う必要があります。</p>
      <p>GPTxでは使用した分だけ毎月請求され、事前のコストは必要ありません。</p>
      <p>以下のボタンをクリックして支払い方法の設定に進んでください。</p>
      <v-btn color="blue" prepend-icon="mdi-credit-card-edit" @click="redirect()">進む</v-btn>
    </v-card-text>
    <v-card-actions>
      <v-btn color="black" prepend-icon="mdi-logout" @click="logout()">ログアウト</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import {apiUrl} from "@/util/util";

const logout = () => {
  location.href = apiUrl('logout')
}

const redirect = () => {
  location.href = apiUrl('checkout')
}
</script>
