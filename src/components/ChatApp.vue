<template>
  <v-app-bar elevation="2">
    <v-app-bar-nav-icon variant="text" @click.stop="leftDrawer = !leftDrawer"></v-app-bar-nav-icon>
    <template v-slot:append>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
  <v-navigation-drawer
    v-model="rightDrawer"
    location="right"
    :temporary="true"
  >
    <v-list>
      <v-list-item @click="redirect(apiUrl('checkout/portal'))">
        <template v-slot:prepend>
          <v-icon icon="mdi-credit-card"></v-icon>
        </template>
        <v-list-item-title>Stripeポータル</v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('setScreen', 'usage')">
        <template v-slot:prepend>
          <v-icon icon="mdi-speedometer"></v-icon>
        </template>
        <v-list-item-title>使用量</v-list-item-title>
      </v-list-item>
      <v-list-item @click="redirect(apiUrl('login/discord'))">
        <template v-slot:prepend>
          <v-icon icon="mdi-link"></v-icon>
        </template>
        <v-list-item-title>Discord連携</v-list-item-title>
      </v-list-item>
      <v-list-item @click="redirect(apiUrl('logout'))">
        <template v-slot:prepend>
          <v-icon icon="mdi-logout"></v-icon>
        </template>
        <v-list-item-title>ログアウト</v-list-item-title>
      </v-list-item>
      <v-list-item @click="subScreen = 'pricing'">
        <template v-slot:prepend>
          <v-icon icon="mdi-book"></v-icon>
        </template>
        <v-list-item-title>料金</v-list-item-title>
      </v-list-item>
      <v-list-item @click="subScreen = 'terms'">
        <template v-slot:prepend>
          <v-icon icon="mdi-book"></v-icon>
        </template>
        <v-list-item-title>利用規約</v-list-item-title>
      </v-list-item>
      <v-list-item @click="subScreen = 'privacy-policy'">
        <template v-slot:prepend>
          <v-icon icon="mdi-book"></v-icon>
        </template>
        <v-list-item-title>プライバシーポリシー</v-list-item-title>
      </v-list-item>
      <v-list-item @click="subScreen = 'sct'">
        <template v-slot:prepend>
          <v-icon icon="mdi-book"></v-icon>
        </template>
        <v-list-item-title>特商法に基づく表記</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <normal-chat v-if="mode === 'chat'" v-model:left-drawer="leftDrawer" ref="chat">
    <template v-slot:mode-selector>
      <v-select
        label="モード"
        v-model="mode"
        :items="modes"
        item-title="title"
        item-value="value"
        @update:model-value="onModeChange()"
      ></v-select>
    </template>
  </normal-chat>
  <assistant-chat v-if="mode === 'assistant'" v-model:left-drawer="leftDrawer">
    <template v-slot:mode-selector>
      <v-select
        label="モード"
        v-model="mode"
        :items="modes"
        item-title="title"
        item-value="value"
        @update:model-value="onModeChange()"
      ></v-select>
    </template>
  </assistant-chat>
  <generate-image v-if="mode === 'generate_image'" v-model:left-drawer="leftDrawer">
    <template v-slot:mode-selector>
      <v-select
        label="モード"
        v-model="mode"
        :items="modes"
        item-title="title"
        item-value="value"
        @update:model-value="onModeChange()"
      ></v-select>
    </template>
  </generate-image>
  <v-overlay
    :model-value="subScreen !== ''"
    @after-leave="subScreen = ''"
    transition="fade-transition"
    class="align-center justify-center"
    style="overflow: initial; overflow-y: scroll; display: block;"
    scroll-strategy="none"
  >
    <fetch-screen v-if="subScreen === 'pricing'" title="料金" :url="apiUrl('pricing')" @close="subScreen = ''" />
    <fetch-screen v-if="subScreen === 'terms'" title="利用規約" :url="apiUrl('terms')" @close="subScreen = ''" />
    <fetch-screen v-if="subScreen === 'privacy-policy'" title="プライバシーポリシー" :url="apiUrl('privacy-policy')" @close="subScreen = ''" />
    <fetch-screen v-if="subScreen === 'sct'" title="特定商取引法に基づく表記" :url="apiUrl('sct')" @close="subScreen = ''" />
  </v-overlay>
</template>

<script lang="ts" setup>
import NormalChat from "@/components/NormalChat.vue";
import {onMounted, ref} from "vue";
import AssistantChat from "@/components/AssistantChat.vue";
import GenerateImage from "@/components/GenerateImage.vue";
import {apiUrl} from "@/util/util";
import FetchScreen from "@/components/FetchScreen.vue";

const modes = [
  {title: 'アシスタント', value: 'assistant'},
  {title: 'チャット', value: 'chat'},
  {title: '画像生成', value: 'generate_image'},
]
const mode = ref('chat')
const leftDrawer = ref(false)
const rightDrawer = ref(false)
const subScreen = ref('')

const chat = ref(null)

const onModeChange = () => {
  localStorage.setItem('mode', mode.value)
}

const redirect = (url: string) => {
  location.href = url
}

defineEmits<{
  setScreen: [string]
}>()

onMounted(() => {
  const savedMode = localStorage.getItem('mode')
  if (savedMode) {
    mode.value = savedMode
  }

  // @ts-ignore
  if (window.api) {
    // @ts-ignore
    window.api.onScreenshot((data: Array<string>) => {
      mode.value = 'chat'
      setTimeout(() => {
        chat.value.cropOptions = data.slice(1)
        chat.value.crop = data[0]
        chat.value.cropping = true
      }, 100)
    })
  }
})
</script>

<style>
body, select {
  font-family: "JetBrains Mono", 'monospace';
}

.v-main {
  display: flex;
}
</style>
