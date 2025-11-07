// File: fetch-quest/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // NEW: Add server proxy configuration
  server: {
    proxy: {
      // string shorthand: '/foo' -> 'http://localhost:4567/foo'
      '/api': {
        target: 'http://localhost:8000', // Your backend server URL
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // Set to false if your backend is not using HTTPS
      },
    }
  }
})