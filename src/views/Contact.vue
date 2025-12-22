<template>
  <div class="contact-container">
    <!-- 页面标题 -->
    <h2 class="page-title">联系方式</h2>
    
    <!-- 联系方式内容 -->
    <div class="contact-content">
      <!-- 无联系方式时显示添加按钮 -->
      <div v-if="!contactData" class="no-contact">
        <div class="no-contact-icon">📞</div>
        <h3 class="no-contact-title">暂无联系方式</h3>
        <p class="no-contact-description">请添加系统联系信息</p>
        <button 
          class="add-contact-btn" 
          @click="showAddDialog = true"
        >
          <span class="btn-icon">+</span>
          添加联系方式
        </button>
      </div>
      
      <!-- 有联系方式时显示详情 -->
      <div v-else class="contact-details">
        <div class="contact-card">
          <div class="contact-header">
            <h2 class="contact-name">{{ contactData.name }}</h2>
            <button 
              class="update-contact-btn" 
              @click="openUpdateDialog"
            >
              <span class="btn-icon">✏️</span>
              更新联系方式
            </button>
          </div>
          
          <div class="contact-info">
            <div class="info-item">
              <span class="info-icon">📱</span>
              <div class="info-content">
                <div class="info-label">电话</div>
                <div class="info-value">{{ contactData.phone }}</div>
              </div>
            </div>
            
            <div class="info-item">
              <span class="info-icon">📧</span>
              <div class="info-content">
                <div class="info-label">邮箱</div>
                <div class="info-value">{{ contactData.email }}</div>
              </div>
            </div>
            
            <div class="info-item">
              <span class="info-icon">📍</span>
              <div class="info-content">
                <div class="info-label">地址</div>
                <div class="info-value">{{ contactData.address }}</div>
              </div>
            </div>
          </div>
          
          <div class="contact-meta">
            <span class="meta-item">
              <span class="meta-label">创建时间：</span>
              <span class="meta-value">{{ formatDate(contactData.created_at) }}</span>
            </span>
            <span class="meta-item">
              <span class="meta-label">更新时间：</span>
              <span class="meta-value">{{ formatDate(contactData.updated_at) }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加联系方式对话框 -->
    <div v-if="showAddDialog" class="dialog-overlay" @click="showAddDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h2 class="dialog-title">添加联系方式</h2>
          <button class="close-btn" @click="showAddDialog = false">
            <span class="close-icon">✕</span>
          </button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="handleAddContact" class="contact-form">
            <div class="form-group">
              <label for="addName" class="form-label">姓名</label>
              <input 
                type="text" 
                id="addName" 
                v-model="addForm.name" 
                required
                placeholder="请输入姓名"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="addPhone" class="form-label">电话</label>
              <input 
                type="tel" 
                id="addPhone" 
                v-model="addForm.phone" 
                required
                placeholder="请输入电话"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="addEmail" class="form-label">邮箱</label>
              <input 
                type="email" 
                id="addEmail" 
                v-model="addForm.email" 
                required
                placeholder="请输入邮箱"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="addAddress" class="form-label">地址</label>
              <textarea 
                id="addAddress" 
                v-model="addForm.address" 
                required
                placeholder="请输入地址"
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>
            
            <div class="dialog-footer">
              <button type="button" class="cancel-btn" @click="showAddDialog = false">取消</button>
              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="loading-spinner">⏳</span>
                {{ isSubmitting ? '提交中...' : '提交' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 更新联系方式对话框 -->
    <div v-if="showUpdateDialog" class="dialog-overlay" @click="showUpdateDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h2 class="dialog-title">更新联系方式</h2>
          <button class="close-btn" @click="showUpdateDialog = false">
            <span class="close-icon">✕</span>
          </button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="handleUpdateContact" class="contact-form">
            <div class="form-group">
              <label for="updateName" class="form-label">姓名</label>
              <input 
                type="text" 
                id="updateName" 
                v-model="updateForm.name" 
                required
                placeholder="请输入姓名"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="updatePhone" class="form-label">电话</label>
              <input 
                type="tel" 
                id="updatePhone" 
                v-model="updateForm.phone" 
                required
                placeholder="请输入电话"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="updateEmail" class="form-label">邮箱</label>
              <input 
                type="email" 
                id="updateEmail" 
                v-model="updateForm.email" 
                required
                placeholder="请输入邮箱"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="updateAddress" class="form-label">地址</label>
              <textarea 
                id="updateAddress" 
                v-model="updateForm.address" 
                required
                placeholder="请输入地址"
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>
            
            <div class="dialog-footer">
              <button type="button" class="cancel-btn" @click="showUpdateDialog = false">取消</button>
              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="loading-spinner">⏳</span>
                {{ isSubmitting ? '更新中...' : '更新' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContactApi, addContactApi, updateContactApi } from '../api'
import { ElMessage } from 'element-plus'

// 联系方式数据
const contactData = ref(null)
// 添加对话框状态
const showAddDialog = ref(false)
// 更新对话框状态
const showUpdateDialog = ref(false)
// 提交状态
const isSubmitting = ref(false)

// 添加表单数据
const addForm = ref({
  name: '',
  phone: '',
  email: '',
  address: ''
})

// 更新表单数据
const updateForm = ref({
  name: '',
  phone: '',
  email: '',
  address: ''
})

// 获取联系方式
const fetchContact = async () => {
  try {
    const data = await getContactApi()
    // getContactApi已经处理了空数据情况，直接赋值
    contactData.value = data
  } catch (error) {
    console.error('获取联系方式失败:', error)
    // 不再显示重复的错误提示
  }
}

// 添加联系方式
const handleAddContact = async () => {
  try {
    isSubmitting.value = true
    await addContactApi(addForm.value)
    ElMessage.success('添加联系方式成功')
    showAddDialog.value = false
    fetchContact()
    resetAddForm()
  } catch (error) {
    console.error('添加联系方式失败:', error)
    // 不再显示重复的错误提示，因为API拦截器已经处理
  } finally {
    isSubmitting.value = false
  }
}

// 更新联系方式
const handleUpdateContact = async () => {
  try {
    isSubmitting.value = true
    await updateContactApi(updateForm.value)
    ElMessage.success('更新联系方式成功')
    showUpdateDialog.value = false
    fetchContact()
  } catch (error) {
    console.error('更新联系方式失败:', error)
    // 不再显示重复的错误提示，因为API拦截器已经处理
  } finally {
    isSubmitting.value = false
  }
}

// 重置添加表单
const resetAddForm = () => {
  addForm.value = {
    name: '',
    phone: '',
    email: '',
    address: ''
  }
}

// 打开更新对话框前填充表单
const openUpdateDialog = () => {
  if (contactData.value) {
    updateForm.value = {
      id: contactData.value.id,
      name: contactData.value.name,
      phone: contactData.value.phone,
      email: contactData.value.email,
      address: contactData.value.address
    }
    showUpdateDialog.value = true
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 组件挂载时获取数据
onMounted(() => {
  fetchContact()
})
</script>

<style scoped>
/* 页面容器 */
.contact-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 页面标题 */
.page-title {
  margin-bottom: 24px;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 联系方式内容 */
.contact-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* 无联系方式状态 */
.no-contact {
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 2px dashed #e2e8f0;
  max-width: 500px;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.no-contact:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.no-contact-icon {
  font-size: 64px;
  margin-bottom: 20px;
  color: #667eea;
}

.no-contact-title {
  font-size: 24px;
  font-weight: 700;
  color: #334155;
  margin: 0 0 12px 0;
}

.no-contact-description {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 24px 0;
}

.add-contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.add-contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.btn-icon {
  font-size: 18px;
  font-weight: bold;
}

/* 联系方式详情 */
.contact-details {
  width: 100%;
  max-width: 800px;
}

.contact-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.contact-name {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.update-contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.update-contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

/* 联系方式信息 */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-item:hover {
  background: #e0f2fe;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
}

.info-icon {
  font-size: 24px;
  color: #667eea;
  margin-top: 2px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

/* 联系方式元信息 */
.contact-meta {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  font-size: 14px;
  color: #64748b;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  gap: 6px;
}

.meta-label {
  font-weight: 600;
}

.meta-value {
  font-weight: 500;
}

/* Dialog遮罩层 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

/* Dialog内容 */
.dialog-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: dialogSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Dialog淡入动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Dialog滑动动画 */
@keyframes dialogSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Dialog头部 */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px 20px 0 0;
  color: white;
}

/* Dialog标题 */
.dialog-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

/* 关闭按钮 */
.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Dialog主体 */
.dialog-body {
  padding: 28px;
}

/* 联系方式表单 */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 表单组 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 表单标签 */
.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 表单输入框 */
.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  color: #1e293b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family: inherit;
}

/* 表单输入框聚焦效果 */
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

/* 文本域 */
.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

/* Dialog底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 28px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
}

/* 取消按钮 */
.cancel-btn {
  padding: 12px 24px;
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
}

.cancel-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #334155;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 提交按钮 */
.submit-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(103, 194, 58, 0.3);
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(103, 194, 58, 0.4);
  background: linear-gradient(135deg, #85ce61 0%, #a0d911 100%);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 加载动画 */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .contact-container {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .contact-card {
    padding: 24px;
  }
  
  .contact-name {
    font-size: 24px;
  }
  
  .contact-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .update-contact-btn {
    align-self: flex-end;
  }
  
  .contact-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .dialog-content {
    width: 95%;
    margin: 20px;
    border-radius: 16px;
  }
  
  .dialog-header {
    padding: 20px 16px;
    border-radius: 16px 16px 0 0;
  }
  
  .dialog-body {
    padding: 20px;
  }
  
  .dialog-footer {
    padding: 20px;
    border-radius: 0 0 16px 16px;
    flex-direction: column;
  }
  
  .cancel-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>