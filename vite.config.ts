import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // sileo trae su propia copia de motion (v12). Sin esto el bundle carga dos
  // runtimes de animacion; con esto todo usa el motion de la raiz.
  resolve: { dedupe: ['motion', 'react', 'react-dom'] },
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
