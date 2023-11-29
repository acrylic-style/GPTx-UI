import {defineConfig} from "electron-vite";
import {fileURLToPath, URL} from "node:url";
import topLevelAwait from "vite-plugin-top-level-await";
import vue from "@vitejs/plugin-vue";
import vuetify, {transformAssetUrls} from "vite-plugin-vuetify";
import ViteFonts from "unplugin-fonts/vite";

export default defineConfig({
  main: {
    // vite config options
  },
  preload: {
    // vite config options
  },
  renderer: {
    // vite config options
    root: './',
    build: {
      rollupOptions: {
        input: './index.html',
      }
    },
    plugins: [
      topLevelAwait({
        // The export name of top-level await promise for each chunk module
        promiseExportName: "__tla",
        // The function to generate import names of top-level await promise in each chunk module
        promiseImportName: i => `__tla_${i}`
      }),
      vue({
        template: { transformAssetUrls }
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/settings.scss',
        },
      }),
      ViteFonts({
        google: {
          families: [{
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          }],
        },
      }),
    ],
    define: { 'process.env': {} },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ],
    },
  },
})
