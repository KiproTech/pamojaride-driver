import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external access
    port: 5173, // match your dev server port
    strictPort: false,
    allowedHosts: ['fca6-154-159-237-243.ngrok-free.app'], // add your ngrok host here
  },
})
