import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 发现新版本自动更新
      devOptions: {
        enabled: true // 允许你在 npm run dev 下测试 PWA
      },
      workbox: {
        // 缓存所有的核心文件
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        
        // 🌟 最核心的一步：让缓存匹配忽略所有的 URL 查询参数 (?share=xxx)
        ignoreURLParametersMatching: [/.*/], 
        
        // （可选）如果你想让拉取过的特定分享幻灯片数据也被缓存，可以加这个 API 拦截规则
        runtimeCaching: [
          {
            // 匹配你的获取项目接口，比如 /api/projects/1
            urlPattern: /\/api\/projects\/.*/i, 
            handler: 'NetworkFirst', // 有网时优先拉取最新 PPT，没网时使用缓存
            options: {
              cacheName: 'slidecraft-presentations',
              expiration: {
                maxEntries: 50, // 最多缓存 50 个别人的 PPT
                maxAgeSeconds: 60 * 60 * 24 * 30 // 缓存保留 30 天
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
