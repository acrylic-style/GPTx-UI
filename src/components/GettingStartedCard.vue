<template>
  <v-card
      title="GPTxの使い方"
  >
    <v-card-text class="usage">
      <div>
        <h3><v-icon color="green-lighten-2">mdi-message</v-icon>チャット＆アシスタント</h3>
        <p>GPTxは質問をすると一般的な情報をもとに答えることができます。</p>
        <p>GPTxの「チャット」モードではリアルタイムで会話が生成されるのを見ることができ、GPT-4 Visionでは画像を認識させることも可能です。(一度に最大10枚まで)</p>
        <p>「アシスタントモード」ではGPT-4 Turboを使用してファイルをアップロードして、そのファイルをもとに計算したりなどができます。(Code Interpreter及びRetrieval)</p>
      </div>
      <v-divider class="ms-3 ma-3" :vertical="true" />
      <div>
        <h3><v-icon color="yellow-darken-3">mdi-triangle</v-icon>情報の確認</h3>
        <p>GPTxはAIが知っている限り正確に返答するようになっていますが、時に間違った返答を返すことがあります。</p>
        <p>重要な事項については常にソースを確認するようにしてください。</p>
      </div>
      <v-divider class="ms-3 ma-3" :vertical="true" />
      <div>
        <h3><v-icon color="purple-accent-1">mdi-magnify</v-icon>センシティブな情報について</h3>
        <p>チャット履歴、チャットした内容、文字列はGPTxスタッフ及びOpenAIが閲覧することは<b>ありません</b>。</p>
        <p>チャット履歴はすべてブラウザに保存され、サーバーには全く保存されません。(ブラウザのIndexed DBに保存されています)</p>
        <p>センシティブではない利用状況(生成された・入力した文字数が含まれますが、文字自体は含みません)は収集され、サービスの向上に利用される可能性があります。</p>
      </div>
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
/* eslint-disable no-unused-vars */
defineEmits<{
  (event: 'close'): void
}>()
</script>

<style scoped>
.usage {
  display: flex;
}

.usage>div {
  width: 25vw;
}
</style>
