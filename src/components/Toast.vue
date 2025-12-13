<template>
  <div class="toast-container" v-if="show">
    <div class="toast-content">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// 定义props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 3000
  }
})

// 定义emit
const emit = defineEmits(['close'])

// 监听show变化
watch(() => props.show, (newVal) => {
  if (newVal) {
    // 自动关闭
    setTimeout(() => {
      emit('close')
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  pointer-events: none;
}

.toast-content {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 12px 24px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-20px) translateX(-50%);
  }
  10% {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
  90% {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) translateX(-50%);
  }
}
</style>