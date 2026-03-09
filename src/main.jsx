import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const updateSW = registerSW({
  onNeedRefresh() {
    // 可以在这里提示用户有新版本
  },
  onOfflineReady() {
    console.log('离线模式已准备就绪，断网也能秒开了！')
  },
})
