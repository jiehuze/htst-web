<template>
  <div class="confirm-modal-overlay" v-if="show">
    <div class="confirm-modal-content">
      <div class="confirm-modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="handleCancel">×</button>
      </div>
      <div class="confirm-modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="confirm-modal-actions">
        <button class="cancel-btn" @click="handleCancel">取消</button>
        <button class="confirm-btn" @click="handleConfirm">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 定义props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: '确定要执行此操作吗？'
  }
})

// 定义emit
const emit = defineEmits(['confirm', 'cancel', 'update:show'])

// 处理确认
const handleConfirm = () => {
  emit('confirm')
  emit('update:show', false)
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
  emit('update:show', false)
}
</script>

<style scoped>
.confirm-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.confirm-modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
  overflow: hidden;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.confirm-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fafafa;
}

.confirm-modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #909399;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.close-btn:hover {
  background-color: #f5f7fa;
  color: #606266;
}

.confirm-modal-body {
  padding: 20px;
  color: #606266;
  font-size: 15px;
  line-height: 1.5;
}

.confirm-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e4e7ed;
  background-color: #fafafa;
}

.cancel-btn, .confirm-btn {
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  border: 1px solid #dcdfe6;
}

.cancel-btn {
  background-color: white;
  color: #606266;
}

.cancel-btn:hover {
  background-color: #f5f7fa;
  border-color: #c6e2ff;
  color: #409eff;
}

.confirm-btn {
  background-color: #f56c6c;
  color: white;
  border-color: #f56c6c;
}

.confirm-btn:hover {
  background-color: #f78989;
  border-color: #f78989;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(245, 108, 108, 0.3);
}

.confirm-btn:active {
  transform: translateY(0);
}
</style>