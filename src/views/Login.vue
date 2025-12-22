<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Logo区域 -->
      <div class="login-logo">
        <img src="/src/assets/htst.png" alt="护理科研管理平台" class="logo-image">
      </div>
      <h1>护理科研管理平台</h1>
      <p class="login-subtitle">中国人民解放军联勤保障部队第981医院</p>
      <form @submit.prevent="handleLogin">
        <div class="form-item">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            placeholder="请输入用户名" 
            required
          >
        </div>
        <div class="form-item">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            placeholder="请输入密码" 
            required
          >
        </div>
        <button type="submit" class="login-btn">登录</button>
      </form>
      
      <!-- 联系方式区域 -->
      <div class="contact-info">
        <div class="contact-header" @click="toggleContact">
          <h3 class="contact-title">联系方式</h3>
          <span class="contact-toggle" :class="{ 'rotate': !isContactCollapsed }">
            {{ isContactCollapsed ? '▼' : '▲' }}
          </span>
        </div>
        <div 
          class="contact-details" 
          v-show="!isContactCollapsed"
          :class="{ 'expanded': !isContactCollapsed }"
        >
          <div class="contact-item">
            <span class="contact-icon">📞</span>
            <span class="contact-label">电话：</span>
            <span class="contact-value">{{ contactInfo?.phone || 'XXX-XXXXXXX' }}</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">✉️</span>
            <span class="contact-label">邮箱：</span>
            <span class="contact-value">{{ contactInfo?.email || 'example@xxx.com' }}</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">🏢</span>
            <span class="contact-label">部门：</span>
            <span class="contact-value">{{ contactInfo?.name || '科教办' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { loginApi, getContactApi } from '../api'
import Toast from '../utils/toast'

const router = useRouter()
const userStore = useUserStore()
const form = ref({
  username: '',
  password: ''
})
// 联系方式数据
const contactInfo = ref(null)
// 折叠状态，默认折叠
const isContactCollapsed = ref(true)

// 获取联系方式
const fetchContact = async () => {
  try {
    const data = await getContactApi()
    contactInfo.value = data
  } catch (error) {
    console.error('获取联系方式失败:', error)
  }
}

const handleLogin = async () => {
  try {
    // 调用真实登录API
    const userInfo = await loginApi(form.value.username, form.value.password)
    
    // 登录成功后保存用户信息和token
    // 注意：这里假设token是在响应头或其他地方返回的，暂时使用mock token
    const token = 'mock-token-' + Date.now()
    userStore.login(token, userInfo)
    // 跳转到首页
    router.push({ name: 'index' })
  } catch (error) {
    // 登录失败，只打印日志，不显示错误信息
    // 错误信息由响应拦截器统一处理
    console.error('登录失败:', error)
  }
}

// 切换折叠状态
const toggleContact = () => {
  isContactCollapsed.value = !isContactCollapsed.value
}

// 页面加载时获取联系方式
onMounted(() => {
  fetchContact()
})
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-image: url('/src/assets/htst-bk.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
}

/* 背景遮罩层 */
.login-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 1;
}

.login-box {
  width: 420px;
  padding: 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.75) 100%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  z-index: 2;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
}

.login-box h1 {
  text-align: center;
  margin: 20px 0 8px 0;
  color: #2c3e50;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.5px;
  animation: fadeIn 0.4s ease 0.2s both;
}

.login-subtitle {
  text-align: center;
  margin: 0 0 35px 0;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  animation: fadeIn 0.4s ease 0.3s both;
}

.form-item {
  margin-bottom: 24px;
  position: relative;
  animation: fadeIn 0.4s ease both;
}

.form-item:nth-child(1) {
  animation-delay: 0.4s;
}

.form-item:nth-child(2) {
  animation-delay: 0.5s;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.form-item input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  font-size: 15px;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: white;
  color: #303133;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-item input:hover {
  border-color: #c6e2ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-item input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.12), 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-1px);
  background-color: white;
}

.form-item input::placeholder {
  color: #c0c4cc;
  font-size: 14px;
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.35);
  letter-spacing: 0.5px;
  animation: fadeIn 0.4s ease 0.6s both;
  margin-top: 8px;
}

.login-btn:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #8ccaff 100%);
  box-shadow: 0 12px 32px rgba(64, 158, 255, 0.45);
  transform: translateY(-3px);
}

.login-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.login-btn:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.2), 0 8px 24px rgba(64, 158, 255, 0.35);
}

/* 登录Logo */
.login-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  animation: bounceIn 0.6s ease;
}

.logo-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  animation: pulse 2s ease-in-out infinite;
}

/* 动画效果 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0%, 20%, 40%, 60%, 80%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 联系方式区域样式 */
.contact-info {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(64, 158, 255, 0.2);
  animation: fadeIn 0.4s ease 0.7s both;
  border-radius: 12px;
  overflow: hidden;
}

/* 联系方式标题栏 */
.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
}

.contact-header:hover {
  background: rgba(64, 158, 255, 0.08);
}

.contact-title {
  margin: 0;
  color: #409eff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 折叠/展开图标 */
.contact-toggle {
  font-size: 12px;
  color: #409eff;
  font-weight: bold;
  transition: all 0.3s ease;
  display: inline-block;
  width: 20px;
  text-align: center;
}

.contact-toggle.rotate {
  transform: rotate(180deg);
}

/* 联系方式详情区域 */
.contact-details {
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  padding: 0 16px;
  transform: translateY(-10px);
}

.contact-details.expanded {
  max-height: 200px;
  opacity: 1;
  padding: 16px;
  transform: translateY(0);
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.3s ease both;
}

.contact-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 249, 255, 0.9) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12), 0 0 0 3px rgba(64, 158, 255, 0.1);
  border-color: rgba(64, 158, 255, 0.3);
}

/* 为每个联系项添加延迟动画 */
.contact-item:nth-child(1) {
  animation-delay: 0.1s;
}

.contact-item:nth-child(2) {
  animation-delay: 0.2s;
}

.contact-item:nth-child(3) {
  animation-delay: 0.3s;
}

.contact-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-label {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  min-width: 50px;
}

.contact-value {
  font-size: 14px;
  color: #303133;
  flex: 1;
  font-weight: 500;
}
</style>