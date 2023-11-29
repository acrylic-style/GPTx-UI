<template>
  <v-app>
    <mode-list @set-screen="s => screen = s" />
    <v-overlay
      :model-value="screen !== 'ok'"
      :persistent="screen !== 'usage'"
      transition="fade-transition"
      class="align-center justify-center"
      @after-leave="screen = 'ok'"
    >
      <v-progress-circular v-if="screen === 'loading' || screen === 'ok'" indeterminate></v-progress-circular>
      <login-screen v-else-if="screen === 'login'" />
      <invite-code-screen v-else-if="screen === 'invite-code'" />
      <stripe-screen v-else-if="screen === 'stripe'" />
      <stripe2-screen v-else-if="screen === 'stripe2'" />
      <usage-screen v-else-if="screen === 'usage'" @set-screen="s => screen = s" />
    </v-overlay>
  </v-app>
</template>

<script lang="ts" setup>
import ModeList from "@/components/ChatApp.vue";
import {onMounted, ref} from "vue";
import {apiUrl} from "@/util/util";
import LoginScreen from "@/components/LoginScreen.vue";
import InviteCodeScreen from "@/components/InviteCodeScreen.vue";
import StripeScreen from "@/components/StripeScreen.vue";
import UsageScreen from "@/components/UsageScreen.vue";
import Stripe2Screen from "@/components/Stripe2Screen.vue";

const screen = ref('loading')

onMounted(async () => {
  const response = await fetch(apiUrl('me'), {credentials: 'include'})
  if (response.status === 401) {
    // not logged in
    screen.value = 'login'
  } else if (response.status === 200) {
    const json: any = await response.json()
    if (!json.active) {
      // requires invite code
      screen.value = 'invite-code'
    } else if (!json.stripe_customer_id) {
      // requires subscription to be purchased
      screen.value = 'stripe'
    } else if (json.stripe.not_subscribed.length >= 1) {
      // requires new subscription to be purchased
      screen.value = 'stripe2'
    } else {
      // everything is ok
      screen.value = 'ok'
    }
  }
})
</script>

<style>
.half {
  width: 50%;
  max-width: 50%;
}
</style>
