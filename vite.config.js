import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), viteSingleFile()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 100000
  }
})
