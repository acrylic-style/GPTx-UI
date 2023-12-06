<template>
  <v-card>
    <v-card-text>
      <p>GPTxへようこそ！</p>
      <p>GPTxではGPT-3.5やGPT-4などのAIモデルを使用して、文章を生成することができます。</p>
      <p>該当するアカウントで二段階認証をオンにしてからGitHubアカウントもしくはDiscordアカウントでログインしてください。</p>
      <p>GitHubのuserスコープは二段階認証の有無の確認のみに使用されます。</p>
      <v-btn prepend-icon="mdi-book" @click="screen = 'pricing'">料金</v-btn>
      <v-btn prepend-icon="mdi-book" @click="screen = 'terms'">利用規約</v-btn>
      <v-btn prepend-icon="mdi-book" @click="screen = 'privacy-policy'">プライバシーポリシー</v-btn>
      <v-btn prepend-icon="mdi-book" @click="screen = 'sct'">特定商取引法に基づく表記</v-btn>
      <v-btn prepend-icon="mdi-link" @click="redirect(apiUrl('discord'))">Discordサーバー</v-btn>
    </v-card-text>
    <v-card-actions>
      <v-btn prepend-icon="mdi-github" @click="redirect(apiUrl('login/github'))">GitHubログイン</v-btn>
      <v-btn prepend-icon="mdi-message" @click="redirect(apiUrl('login/discord'))">Discordログイン</v-btn>
    </v-card-actions>
  </v-card>
  <v-overlay
    :model-value="screen !== ''"
    @after-leave="screen = ''"
    transition="fade-transition"
    class="align-center justify-center"
    style="overflow: initial; overflow-y: scroll; display: block;"
    scroll-strategy="none"
  >
    <fetch-screen v-if="screen === 'pricing'" title="料金" :url="apiUrl('pricing')" @close="screen = ''" />
    <fetch-screen v-if="screen === 'terms'" title="利用規約" :url="apiUrl('terms')" @close="screen = ''" />
    <fetch-screen v-if="screen === 'privacy-policy'" title="プライバシーポリシー" :url="apiUrl('privacy-policy')" @close="screen = ''" />
    <fetch-screen v-if="screen === 'sct'" title="特定商取引法に基づく表記" :url="apiUrl('sct')" @close="screen = ''" />
  </v-overlay>
</template>

<script lang="ts" setup>
import {apiUrl} from "@/util/util";
import {ref} from "vue";
import FetchScreen from "@/components/FetchScreen.vue";

const screen = ref('')

const redirect = (url: string) => {
  location.href = url
}
</script>
