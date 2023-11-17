<template>
  <v-card>
    <v-card-text>
      <p>このGPTxインスタンスは招待コードが必要です。</p>
      <v-text-field
        label="招待コード"
        type="password"
        prepend-icon="mdi-key"
        v-model="inviteCode"
        :rules="[() => !!inviteCode || 'このフィールドは必須です', () => !invalidCodes.includes(inviteCode) || 'このコードは使用できません']"
        :disabled="sending"
      ></v-text-field>
      <v-btn
        class="float-left"
        color="black"
        prepend-icon="mdi-logout"
        @click="logout()"
      >ログアウト</v-btn>
      <v-btn
        class="float-right"
        color="primary"
        prepend-icon="mdi-send"
        :disabled="!inviteCode"
        :loading="sending"
        @click="activate()"
      >送信</v-btn>
    </v-card-text>
  </v-card>
  <v-snackbar
    color="black"
    v-model="snackbar"
  >
    {{ snackbarText }}

    <template v-slot:actions>
      <v-btn
        color="pink"
        variant="text"
        @click="snackbar = false"
      >閉じる</v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {apiUrl} from "@/util/util";

const sending = ref(false)
const inviteCode = ref('')
const snackbar = ref(false)
const snackbarText = ref('')
const invalidCodes = ref(new Array<string>())

const logout = () => {
  location.href = apiUrl('logout')
}

const activate = async () => {
  sending.value = true
  try {
    const response = await fetch(apiUrl('activate_account?code=' + encodeURI(inviteCode.value)), {
      method: 'POST',
      credentials: 'include',
    })
    if (response.status === 403) {
      snackbar.value = true
      snackbarText.value = 'この招待コードは無効か、すでに使用制限に達しています。'
      invalidCodes.value.push(inviteCode.value)
    }
    if (response.status === 500) {
      snackbar.value = true
      snackbarText.value = '不明なエラーが発生しました。時間をおいてやり直してください。'
    }
    if (response.status === 200) {
      snackbar.value = true
      snackbarText.value = 'アカウントの有効化に成功しました！'
      setTimeout(() => {
        location.reload()
      }, 1500)
    }
  } catch (e) {
    snackbar.value = true
    snackbarText.value = '不明なエラーが発生しました。時間をおいてやり直してください。'
  } finally {
    sending.value = false
  }
}
</script>
