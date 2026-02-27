import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ssr: {
    external: ['mongoose', 'util', 'crypto', 'path', 'fs', 'dotenv']
  },
  optimizeDeps: {
    exclude: ['mongoose']
  }
})
