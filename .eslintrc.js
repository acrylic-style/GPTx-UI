module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  plugins: [
    "@typescript-eslint"
  ],
}
