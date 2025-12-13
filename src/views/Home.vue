<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <header class="top-nav">
      <div class="nav-left">
        <img 
          src="/src/assets/htst.png" 
          alt="中国人民解放军联勤保障部队第九八一医院" 
          class="system-logo"
        >
        <div class="system-name">科研管理平台</div>
      </div>
      <div class="nav-right">
        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-icon">📞</span>
            <span>电话：XXX</span>
          </div>
          <div class="contact-divider">|</div>
          <div class="contact-item">
            <span class="contact-icon">✉️</span>
            <span>邮箱：XXX</span>
          </div>
          <div class="contact-divider">|</div>
          <div class="contact-item">
            <span class="contact-icon">🏢</span>
            <span>科教办</span>
          </div>
        </div>
        <div class="user-info">
          <div class="user-profile" @click="toggleUserMenu">
            <div class="user-details">
              <div class="username">{{ userStore.userInfo?.username || '系统管理员' }}</div>
              <div class="user-role" v-if="userStore.userInfo?.roles === 'admin'">
                <span class="role-badge">管理员</span>
              </div>
            </div>
            <div class="user-avatar-wrapper">
              <div class="user-avatar">
                {{ getUserInitials(userStore.userInfo?.username || '系统管理员') }}
              </div>
              <span class="avatar-arrow" :class="{ 'rotate': isUserMenuOpen }">▼</span>
            </div>
          </div>
          <div class="dropdown-menu" :class="{ 'show': isUserMenuOpen }">
            <div class="menu-header">
              <div class="menu-user-info">
                <div class="menu-username">{{ userStore.userInfo?.username || '系统管理员' }}</div>
                <div class="menu-role">{{ userStore.userInfo?.roles === 'admin' ? '管理员' : '普通用户' }}</div>
              </div>
              <div class="menu-avatar-large">
                {{ getUserInitials(userStore.userInfo?.username || '系统管理员') }}
              </div>
            </div>
            <div class="menu-divider"></div>
            <button class="dropdown-menu-item logout-item" @click="handleLogout">
              <span class="dropdown-menu-icon">🚪</span>
              <span class="dropdown-menu-text">登出</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <div class="main-content">
      <!-- 左侧菜单 -->
      <aside class="sidebar">
        <nav class="menu">
          <div 
            v-for="menu in filteredMenuList" 
            :key="menu.id" 
            class="menu-item"
          >
            <!-- 没有子菜单的菜单项直接使用router-link -->
            <router-link
              v-if="!menu.children"
              :to="menu.path"
              class="menu-title router-link"
              active-class="active"
            >
              <span class="menu-icon">{{ menu.icon }}</span>
              <span>{{ menu.name }}</span>
            </router-link>
            
            <!-- 有子菜单的菜单项 -->
            <template v-else>
              <div 
                class="menu-title"
                @click="toggleMenu(menu.id)"
              >
                <span class="menu-icon">{{ menu.icon }}</span>
                <span>{{ menu.name }}</span>
                <span class="menu-arrow">
                  {{ expandedMenus.includes(menu.id) ? '▼' : '▶' }}
                </span>
              </div>
              <div 
                class="submenu"
                v-if="expandedMenus.includes(menu.id)"
              >
                <router-link
                  v-for="submenu in menu.children" 
                  :key="submenu.id"
                  :to="submenu.path"
                  class="submenu-item"
                  active-class="active"
                  :exact="false"
                >
                  {{ submenu.name }}
                </router-link>
              </div>
            </template>
          </div>
        </nav>
      </aside>
      
      <!-- 右侧内容区 -->
      <section class="content">
        <!-- 面包屑导航 -->
        <div class="breadcrumb">
          <template v-for="(item, index) in breadcrumbItems" :key="index">
            <router-link :to="item.path" class="breadcrumb-link">{{ item.name }}</router-link>
            <span v-if="index < breadcrumbItems.length - 1" class="breadcrumb-separator"> &gt; </span>
          </template>
        </div>
        
        <!-- 内容区 -->
        <div class="content-body">
          <router-view />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 默认展开所有菜单
const expandedMenus = ref([1, 2, 3]) // 包含所有一级菜单的id
// 用户菜单状态
const isUserMenuOpen = ref(false) // 用户菜单展开状态

// 动态过滤菜单列表，根据用户角色显示不同菜单
const filteredMenuList = computed(() => {
  const menus = [...userStore.menuList]
  const userInfo = userStore.userInfo
  
  // 如果用户角色不是管理员，过滤掉系统管理菜单
  if (userInfo && userInfo.roles !== 'admin') {
    return menus.filter(menu => menu.id !== 3) // 系统管理菜单的id是3
  }
  
  return menus
})

// 监听用户信息变化，确保菜单会根据角色重新计算
watch(() => userStore.userInfo, () => {
  console.log('用户信息变化，重新计算菜单')
})

const toggleMenu = (menuId) => {
  if (expandedMenus.value.includes(menuId)) {
    expandedMenus.value = expandedMenus.value.filter(id => id !== menuId)
  } else {
    expandedMenus.value.push(menuId)
  }
}

// 切换用户菜单
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// 获取用户首字母作为头像
const getUserInitials = (username) => {
  if (!username) return '👤'
  // 如果是中文用户名，返回第一个汉字
  if (/^[\u4e00-\u9fa5]+$/.test(username)) {
    return username.charAt(0)
  }
  // 如果是英文用户名，返回第一个字母大写
  return username.charAt(0).toUpperCase()
}

// 点击外部关闭用户菜单
const handleClickOutside = (event) => {
  const userProfile = document.querySelector('.user-profile')
  const dropdownMenu = document.querySelector('.dropdown-menu')
  if (userProfile && dropdownMenu && !userProfile.contains(event.target) && !dropdownMenu.contains(event.target)) {
    isUserMenuOpen.value = false
  }
}

// 计算当前页面的面包屑
const breadcrumbItems = computed(() => {
  // 如果是首页
  if (route.path === '/home/index') {
    return [{ name: '首页', path: '/home/index' }]
  }
  
  try {
    // 查找当前路由对应的菜单层级
    for (const menu of filteredMenuList.value) {
      // 先检查子菜单，确保子菜单优先匹配
      if (menu.children) {
        for (const submenu of menu.children) {
          if (submenu.path === route.path) {
            return [{ name: menu.name, path: menu.path }, { name: submenu.name, path: submenu.path }]
          }
        }
      }
      
      // 再检查顶级菜单
      if (menu.path === route.path) {
        return [{ name: menu.name, path: menu.path }]
      }
    }
  } catch (error) {
    console.error('计算面包屑错误:', error)
  }
  
  // 默认返回空数组
  return []
})

// 计算当前页面标题
const currentTitle = computed(() => {
  // 优先从路由元信息获取标题
  if (route.meta.title) {
    return route.meta.title
  }
  
  // 从过滤后的菜单配置中获取标题
  for (const menu of filteredMenuList.value) {
    // 检查顶级菜单
    if (menu.path === route.path) {
      return menu.name
    }
    
    // 检查子菜单
    if (menu.children) {
      for (const submenu of menu.children) {
        if (submenu.path === route.path) {
          return submenu.name
        }
      }
    }
  }
  
  // 默认返回首页
  return '首页'
})

const handleLogout = () => {
  // 清除用户信息
  userStore.logout()
  
  // 直接跳转到登录页面，使用命名路由更可靠
  router.push({ name: 'login' })
}

onMounted(() => {
  userStore.loadUserInfo()
  // 添加点击外部关闭菜单事件监听
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  // 移除点击外部关闭菜单事件监听
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f7fa;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 10px 20px;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 60px;
  box-sizing: border-box;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.system-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-left: 16px;
  border-radius: 4px;
}

.system-name {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-left: 12px;
  line-height: 40px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 联系方式信息 */
.contact-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #606266;
  background-color: #f0f2f5;
  padding: 6px 15px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-weight: 500;
}

.contact-icon {
  font-size: 16px;
  color: #409eff;
  margin-right: 2px;
}

.contact-divider {
  color: #c0c4cc;
  font-size: 16px;
  font-weight: 300;
  padding: 0 2px;
}

/* 响应式设计，在小屏幕上隐藏联系方式 */
@media (max-width: 992px) {
  .contact-info {
    display: none;
  }
}

/* 用户信息样式 */
.user-info {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 60px;
  border-left: 1px solid #e4e7ed;
  color: #606266;
  cursor: pointer;
}

/* 用户资料卡片 */
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: transparent;
  border: 1px solid transparent;
}

.user-profile:hover {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-color: #bae6fd;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

/* 用户详情 */
.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.user-role {
  display: flex;
  align-items: center;
}

.role-badge {
  font-size: 11px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 用户头像包装 */
.user-avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
}

/* 用户头像 */
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid white;
}

.user-profile:hover .user-avatar {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
  background: linear-gradient(135deg, #66b1ff 0%, #91caff 100%);
}

/* 头像箭头 */
.avatar-arrow {
  font-size: 10px;
  color: #909399;
  transition: all 0.3s ease;
  display: inline-block;
}

.avatar-arrow.rotate {
  transform: rotate(180deg);
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  right: 8px;
  top: calc(100% + 12px);
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  min-width: 240px;
  padding: 0;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

/* 下拉菜单显示 */
.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* 下拉菜单头部 */
.menu-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-bottom: 1px solid #e4e7ed;
}

/* 菜单中的用户信息 */
.menu-user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-username {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.menu-role {
  font-size: 12px;
  color: #909399;
}

/* 大头像 */
.menu-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  border: 2px solid white;
}

/* 菜单分隔线 */
.menu-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #e4e7ed 50%, transparent 100%);
  margin: 4px 0;
}

/* 下拉菜单项 */
.dropdown-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

/* 下拉菜单项悬停 */
.dropdown-menu-item:hover {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #f56c6c;
  transform: translateX(4px);
}

/* 登出菜单项 */
.logout-item {
  color: #f56c6c;
}

/* 下拉菜单项图标 */
.dropdown-menu-item .dropdown-menu-icon {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
}

/* 下拉菜单项文本 */
.dropdown-menu-text {
  flex: 1;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* 确保菜单箭头动画 */
.avatar-arrow {
  transition: transform 0.3s ease;
}

/* 确保用户信息和下拉菜单的响应式设计 */
@media (max-width: 768px) {
  .username {
    max-width: 80px;
    font-size: 13px;
  }
  
  .dropdown-menu {
    right: 0;
    left: 0;
    min-width: auto;
    margin: 0 8px;
  }
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
}

/* 左侧菜单 */
.sidebar {
  width: 200px;
  background-color: #001529;
  color: white;
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.menu {
  padding: 15px 0;
}

.menu-item {
  margin-bottom: 5px;
}

.menu-title {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.menu-title:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.menu-icon {
  margin-right: 12px;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.menu-arrow {
  margin-left: auto;
  font-size: 12px;
  transition: transform 0.3s;
}

.submenu {
  background-color: rgba(255, 255, 255, 0.05);
  padding-left: 20px;
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s;
  font-size: 13px;
  position: relative;
}

.submenu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.submenu-item.active {
  background-color: #1890ff;
  color: white;
}

/* 确保所有子菜单激活样式一致 */
.router-link.active {
  background-color: #1890ff !important;
  color: white !important;
}

/* 右侧内容区 */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f5f7fa;
  width: calc(100% - 200px);
}

/* 面包屑导航 */
.breadcrumb {
  padding: 15px 20px;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  font-size: 14px;
  color: #606266;
}

/* 面包屑链接样式 */
.breadcrumb-link {
  color: #409eff;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.breadcrumb-separator {
  color: #909399;
  margin: 0 5px;
}

/* 内容区 */
.content-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: white;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  width: calc(100% - 40px);
  max-width: none;
}

/* 默认视图样式 */
.default-view {
  text-align: center;
  padding: 60px 20px;
  color: #606266;
}

.default-view h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #303133;
}

.default-view p {
  font-size: 16px;
  line-height: 1.6;
}

/* 首页样式 */
.index-view {
  text-align: center;
  padding: 100px 20px;
  color: #303133;
}

.index-view h2 {
  font-size: 28px;
  font-weight: 500;
  color: #303133;
  margin: 0;
  line-height: 1.5;
}
</style>