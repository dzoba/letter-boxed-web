import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/letter-boxed-web/',
  build: {
    outDir: 'docs'
  },
  server: {
    host: true
  }
})