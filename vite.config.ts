import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// La version viene de package.json y no se repite a mano: asi el numero que
// se ve en el pie del sitio nunca puede desincronizarse del que trae el build.
const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // sileo trae su propia copia de motion (v12). Sin esto el bundle carga dos
  // runtimes de animacion; con esto todo usa el motion de la raiz.
  resolve: { dedupe: ['motion', 'react', 'react-dom'] },
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
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
