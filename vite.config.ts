import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Soundbored',
        short_name: 'Soundbored',
        description: 'Soundboard Discord Bot Controller',
        theme_color: '#0c0e13',
        background_color: '#0c0e13',
        display: 'standalone',
        orientation: 'portrait',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^\/api\/sounds$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-sounds',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 300,
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
