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
      <v-list-item @click="redirect(apiUrl('logout'))">
        <template v-slot:prepend>
          <v-icon icon="mdi-logout"></v-icon>
        </template>
        <v-list-item-title>ログアウト</v-list-item-title>
      </v-list-item>
      <v-list-item @click="redirect(apiUrl('terms'))">
        <template v-slot:prepend>
          <v-icon icon="mdi-book"></v-icon>
        </template>
        <v-list-item-title>利用規約</v-list-item-title>
      </v-list-item>
      <v-list-item @click="redirect(apiUrl('privacy-policy'))">
        <template v-slot:prepend>
          <v-icon icon="mdi-book"></v-icon>
        </template>
        <v-list-item-title>プライバシーポリシー</v-list-item-title>
      </v-list-item>
      <v-list-item @click="redirect(apiUrl('sct'))">
        <template v-slot:prepend>
          <v-icon icon="mdi-book"></v-icon>
        </template>
        <v-list-item-title>特商法に基づく表記</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <normal-chat v-if="mode === 'chat'" v-model:left-drawer="leftDrawer">
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
</template>

<script lang="ts" setup>
import NormalChat from "@/components/NormalChat.vue";
import {onMounted, ref} from "vue";
import AssistantChat from "@/components/AssistantChat.vue";
import GenerateImage from "@/components/GenerateImage.vue";
import {apiUrl} from "@/util/util";

const modes = [
  {title: 'アシスタント', value: 'assistant'},
  {title: 'チャット', value: 'chat'},
  {title: '画像生成', value: 'generate_image'},
]
const mode = ref('chat')
const leftDrawer = ref(false)
const rightDrawer = ref(false)

const onModeChange = () => {
  localStorage.setItem('mode', mode.value)
}

const redirect = (url: string) => {
  location.href = url
}

defineEmits<{
  setScreen: string
}>()

onMounted(() => {
  const savedMode = localStorage.getItem('mode')
  if (savedMode) {
    mode.value = savedMode
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
