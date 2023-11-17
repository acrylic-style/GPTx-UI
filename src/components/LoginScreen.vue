<template>
  <v-card>
    <v-card-text>
      <p>GPTxへようこそ！</p>
      <p>該当するアカウントで二段階認証をオンにしてからGitHubアカウントもしくはDiscordアカウントでログインしてください。</p>
      <p>GitHubのuserスコープは二段階認証の有無の確認のみに使用されます。</p>
    </v-card-text>
    <v-card-actions>
      <v-btn prepend-icon="mdi-github" @click="redirect(apiUrl('login/github'))">GitHubログイン</v-btn>
      <v-btn prepend-icon="mdi-message" @click="redirect(apiUrl('login/discord'))">Discordログイン</v-btn>
      <v-btn prepend-icon="mdi-book" @click="redirect(apiUrl('terms'))">利用規約</v-btn>
      <v-btn prepend-icon="mdi-book" @click="redirect(apiUrl('privacy-policy'))">プライバシーポリシー</v-btn>
      <v-btn prepend-icon="mdi-book" @click="redirect(apiUrl('sct'))">特定商取引法に基づく表記</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import {apiUrl} from "@/util/util";

const redirect = (url: string) => {
  location.href = url
}
</script>
