import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from "@tailwindcss/vite";
// import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    // tailwindcss(),
  ],
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
