import 'dotenv/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { parsePort } from './server/config';

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
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname === '/api/sounds',
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
        target: `http://127.0.0.1:${parsePort(process.env.PORT)}`,
        changeOrigin: true,
      },
    },
  },
});
