import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

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
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    // Ensure public files (including _redirects) are copied to dist
    assetsInclude: ['**/*.html', '**/*.svg', '**/*.png', '**/*.jpg', 'public/_redirects'],
    outDir: 'dist',
    emptyOutDir: true
  },
  publicDir: 'public' // Explicitly specify public directory
})