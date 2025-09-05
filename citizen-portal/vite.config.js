import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Civic Issue Reporter',
        short_name: 'CivicReporter',
        description: 'Report civic issues in your community',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'src/assets/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'src/assets/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/ymhbicqwpfxxoucuqrvd\.supabase\.co/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  base: process.env.NODE_ENV === 'production' ? '/citizen/' : '/',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5173
  }
})
