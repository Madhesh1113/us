import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the repo under /<repo-name>/, so the base path
  // must match your repo name exactly. Update this before deploying.
  base: '/us/',
})
