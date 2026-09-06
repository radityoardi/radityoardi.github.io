import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    proxy: {
      '/api/confluence': {
        target: 'https://radityoardi.atlassian.net',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/confluence/, '/wiki/rest/api/content')
      }
    }
  },
  preview: {
    proxy: {
      '/api/confluence': {
        target: 'https://radityoardi.atlassian.net',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/confluence/, '/wiki/rest/api/content')
      }
    }
  }
})
