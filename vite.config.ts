import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host:true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Add this for SPA routing
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  base: './',
})
