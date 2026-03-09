import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 自动更新缓存
      devOptions: {
        enabled: true // 开启开发环境下的 PWA 测试
      },
      workbox: {
        // 告诉 Service Worker 缓存所有的 js, css, html 和 图片
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            // 拦截所有对 API 的请求，如果你有本地 Mock 或只想忽略 API 报错，可以在这里配
            urlPattern: /^https:\/\/your-api-domain\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 缓存一年
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
