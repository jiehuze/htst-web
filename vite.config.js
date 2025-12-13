import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 将所有以/htst开头的请求代理到后端服务器
      '/htst': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      // 将所有以/api/files开头的请求代理到文件服务器，解决跨域问题
      '/api/files': {
        target: 'http://60.205.94.65:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/files/, '')
      }
    }
  }
})
