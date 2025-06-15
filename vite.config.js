import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: false // Ensure CSS modules aren't accidentally enabled
  },
  server: {
    hmr: {
      clientPort: 5173,
      protocol: 'ws',
      host: 'localhost'
    }
  },
  // ... other config
})