import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Honour an assigned PORT (preview tooling, containers); fall back to Vite's default.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    // En desarrollo el backend corre aparte; en producción lo enruta nginx.
    proxy: {
      '/api': {
        target: process.env.API_URL ?? 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
})
