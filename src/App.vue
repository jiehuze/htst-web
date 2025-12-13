<script setup>
import { ref, onMounted } from 'vue'
import Toast from './components/Toast.vue'
import ToastManager from './utils/toast'

// 定义Toast状态
const toastShow = ref(false)
const toastMessage = ref('')
const toastDuration = ref(3000)

// 监听Toast状态变化
onMounted(() => {
  // 替换ToastManager的show方法，使其能更新当前组件的状态
  const originalShow = ToastManager.show
  ToastManager.show = (message, duration = 3000) => {
    toastMessage.value = message
    toastDuration.value = duration
    toastShow.value = true
    
    // 自动关闭
    setTimeout(() => {
      toastShow.value = false
    }, duration)
    
    originalShow(message, duration)
  }
})
</script>

<template>
  <router-view />
  <Toast 
    :show="toastShow" 
    :message="toastMessage" 
    :duration="toastDuration" 
    @close="toastShow = false" 
  />
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f7fa;
  color: #303133;
  line-height: 1.6;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

#app {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
