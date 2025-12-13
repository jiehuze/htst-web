import { ref } from 'vue'

// 创建全局Toast状态管理
const toastState = ref({
  show: false,
  message: '',
  duration: 3000
})

// Toast管理工具
const ToastManager = {
  // 显示Toast
  show(message, duration = 3000) {
    toastState.value.message = message
    toastState.value.duration = duration
    toastState.value.show = true
    
    // 自动关闭
    setTimeout(() => {
      toastState.value.show = false
    }, duration)
  },
  
  // 隐藏Toast
  hide() {
    toastState.value.show = false
  },
  
  // 获取Toast状态
  getState() {
    return toastState.value
  }
}

export default ToastManager