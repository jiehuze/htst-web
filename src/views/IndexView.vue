<template>
  <div class="index-view">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <h1 class="welcome-title">🎉 欢迎使用护理科研管理平台</h1>
      <p class="welcome-subtitle">中国人民解放军联勤保障部队第981医院</p>
    </div>
    
    <!-- 功能模块卡片 -->
    <div class="modules-container">
      <router-link to="/home/process/policy" class="module-card process-guide">
        <div class="module-icon">📝</div>
        <h3>流程指引</h3>
        <p>政策与流程、工具模板库、方法论指导</p>
      </router-link>
      <router-link to="/home/info/projects" class="module-card info-sync">
        <div class="module-icon">📢</div>
        <h3>信息同步</h3>
        <p>课题立项动态、学术交流动态</p>
      </router-link>
      <!-- 只有管理员显示系统管理模块 -->
      <router-link 
        v-if="isAdmin" 
        to="/home/system" 
        class="module-card system-manage"
      >
        <div class="module-icon">⚙️</div>
        <h3>系统管理</h3>
        <p>用户管理、角色管理、权限控制</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 首页组件 - 调试版本
console.log('IndexView组件已渲染')

// 引入用户store
import { computed } from 'vue'
import { useUserStore } from '../stores/user'

// 获取用户store实例
const userStore = useUserStore()

// 判断是否为管理员
const isAdmin = computed(() => {
  return userStore.userInfo?.roles === 'admin' || false
})
</script>

<style scoped>
/* 确保背景充满整个页面 */
.index-view {
  padding: 25px 15px;
  height: calc(100vh - 60px); /* 减去顶部导航栏高度 */
  background-color: #fff;
  background-image: url('/src/assets/htst-bk.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  text-align: center;
  overflow-y: hidden;
  overflow-x: hidden;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

/* 隐藏滚动条 - Webkit浏览器 */
.index-view::-webkit-scrollbar {
  display: none;
}

/* 调整背景遮罩层 */
.index-view::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: -1;
}

/* 欢迎横幅 */
.welcome-banner {
  margin-bottom: 50px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.6) 0%, rgba(64, 158, 255, 0.5) 100%);
  padding: 35px 15px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 欢迎标题样式 */
.welcome-title {
  color: white;
  font-size: 40px;
  margin-bottom: 15px;
  margin-top: 0;
  font-weight: 800;
  animation: fadeInDown 0.6s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1.2;
}

.welcome-subtitle {
  color: white;
  font-size: 20px;
  margin: 0;
  font-weight: 600;
  animation: fadeInUp 0.6s ease 0.2s both;
  opacity: 0.95;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 模块容器 */
.modules-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 60px;
  flex-wrap: wrap;
  animation: fadeInUp 0.6s ease 0.4s both;
}

/* 模块卡片通用样式 */
.module-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.75) 100%);
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  padding: 30px 20px;
  width: 280px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-sizing: border-box;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  min-height: 200px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.module-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.18);
  border-color: #409eff;
}

/* 模块图标 */
.module-icon {
  font-size: 56px;
  color: #409eff;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.module-card h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.module-card p {
  color: #34495e;
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  text-align: center;
}

/* 流程指引模块样式 */
.process-guide {
  background: linear-gradient(135deg, rgba(240, 249, 235, 0.8) 0%, rgba(230, 247, 255, 0.75) 100%);
  border-color: rgba(179, 225, 157, 0.5);
}

.process-guide h3 {
  color: #67c23a;
}

.process-guide .module-icon {
  color: #67c23a;
}

/* 信息同步模块样式 */
.info-sync {
  background: linear-gradient(135deg, rgba(254, 240, 240, 0.8) 0%, rgba(255, 242, 204, 0.75) 100%);
  border-color: rgba(251, 196, 171, 0.5);
}

.info-sync h3 {
  color: #e6a23c;
}

.info-sync .module-icon {
  color: #e6a23c;
}

/* 系统管理模块样式 */
.system-manage {
  background: linear-gradient(135deg, rgba(236, 245, 255, 0.8) 0%, rgba(240, 245, 255, 0.75) 100%);
  border-color: rgba(173, 198, 255, 0.5);
}

.system-manage h3 {
  color: #409eff;
}

.system-manage .module-icon {
  color: #409eff;
}

/* 动画效果 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .index-view {
    padding: 20px;
  }
  
  .welcome-title {
    font-size: 28px;
  }
  
  .stat-card {
    width: 100%;
    max-width: 300px;
  }
  
  .module-card {
    width: 100%;
    max-width: 300px;
  }
  
  .quick-links {
    flex-direction: column;
    align-items: center;
  }
  
  .quick-link {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style>