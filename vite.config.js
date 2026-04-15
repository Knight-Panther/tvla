import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Cache the app shell + all audio files for offline play
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,mp3}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
      },
      manifest: {
        name: 'TVALE — რიცხვები',
        short_name: 'TVALE',
        description: 'ისწავლე რიცხვები 0-დან 20-მდე!',
        theme_color: '#4c1d95',
        background_color: '#1e1b4b',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/tvla/',
        scope: '/tvla/',
        icons: [
          {
            src: '/tvla/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/tvla/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  base: '/tvla/',
})
