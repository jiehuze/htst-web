<template>
  <div class="video-player-container">
    <!-- 页面背景 -->
    <div class="page-background"></div>
    
    <!-- 视频头部和详情合并 -->
      <div class="video-header">
        <div class="header-content">
          <div class="title-row">
            <h2 class="video-title">{{ currentVideo.name }}</h2>
          </div>
          <div class="video-detail-info">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-icon">🎬</span>
                <span>{{ currentVideo.coreDescription || '-' }}</span>
              </div>
              <span class="detail-separator">|</span>
              <div class="detail-item">
                <span class="detail-icon">📊</span>
                <span>{{ formatSize(currentVideo.size) }}</span>
              </div>
              <span class="detail-separator">|</span>
              <div class="detail-item">
                <span class="detail-icon">📅</span>
                <span>{{ formatDate(currentVideo.updateTime) }}</span>
              </div>
              <span class="detail-separator">|</span>
              <div class="detail-item">
                <span class="detail-icon">🔒</span>
                <span>{{ currentVideo.permission || '-' }}</span>
              </div>
              <span v-if="currentVideo.remark" class="detail-separator">|</span>
              <div v-if="currentVideo.remark" class="detail-item remark-item">
                <span class="detail-icon">📝</span>
                <span>{{ currentVideo.remark }}</span>
              </div>
            </div>
          </div>
        </div>
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          <span class="back-text">返回</span>
        </button>
      </div>
    
    <!-- 视频内容区域 -->
    <div class="video-content">
      <!-- 视频播放器 -->
      <div class="video-player-wrapper">
        <!-- 视频加载指示器 -->
        <div v-if="isLoading" class="video-loading-overlay">
          <div class="loading-spinner"></div>
          <p class="loading-text">正在加载视频...</p>
        </div>
        
        <!-- 视频加载错误 -->
        <div v-else-if="hasError" class="video-error-overlay">
          <div class="error-icon">⚠️</div>
          <p class="error-text">{{ errorMessage }}</p>
          <button class="retry-btn" @click="location.reload()">重试</button>
        </div>
        
        <!-- 视频播放器 -->
        <video 
          v-else
          class="video-player"
          controls
          poster="/src/assets/htst.png"
          @loadeddata="handleVideoLoaded"
          @error="handleVideoError"
          preload="auto"
          playsinline
        >
          <!-- 提供多种视频格式支持 -->
          <source :src="currentVideo.url" type="video/mp4">
          <div class="video-fallback">
            <div class="fallback-icon">🎬</div>
            <p>您的浏览器不支持HTML5视频播放</p>
            <p>视频URL: {{ currentVideo.url }}</p>
          </div>
        </video>
        
        <!-- 视频播放信息 -->
        <div class="player-info-overlay">
          <div class="info-chip">
            <span class="chip-icon">📊</span>
            <span class="chip-text">{{ formatSize(currentVideo.size) }}</span>
          </div>
          <div class="info-chip">
            <span class="chip-icon">📅</span>
            <span class="chip-text">{{ formatDate(currentVideo.updateTime) }}</span>
          </div>
          <div class="info-chip">
            <span class="chip-icon">👁️</span>
            <span class="chip-text">访问中...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const videoId = parseInt(route.params.id)

// 视频加载状态
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

// 调试模式常量
const isDev = import.meta.env.DEV

// 从查询参数获取视频信息
const currentVideo = computed(() => {
  const query = route.query
  
  // 输出查询参数到控制台，以便调试（已注释）
  // console.log('查询参数:', query)
  
  // 构建完整的视频URL - 确保URL格式正确，没有多余的斜杠
  let filePath = query.file_path || ''
  // 移除file_path开头可能存在的斜杠
  if (filePath.startsWith('/')) {
    filePath = filePath.slice(1)
  }
  // 构建正确的视频URL，使用代理解决跨域问题
  const fileUrl = `/api/files/${filePath}`
  
  // 输出生成的视频URL到控制台，以便调试（已注释）
  // console.log('生成的视频URL:', fileUrl)
  
  return {
    id: videoId,
    name: query.name || '视频不存在',
    size: parseInt(query.size) || 0,
    updateTime: query.update_time || new Date(),
    coreDescription: query.core_description || '',
    permission: query.permission_note || '',
    remark: query.remark || '',
    url: fileUrl
  }
})

// 格式化文件大小
const formatSize = (size) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  }
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 处理视频加载完成
const handleVideoLoaded = () => {
  isLoading.value = false
  hasError.value = false
}

// 处理视频加载错误
const handleVideoError = (event) => {
  isLoading.value = false
  hasError.value = true
  // 输出详细错误信息到控制台，以便调试
  console.error('视频加载错误:', event)
  console.error('视频URL:', currentVideo.value.url)
  console.error('错误对象:', event.target.error)
  // 根据错误类型显示详细错误信息
  const error = event.target.error
  let errorMsg = '未知错误'
  if (error) {
    switch (error.code) {
      case error.MEDIA_ERR_ABORTED:
        errorMsg = '视频加载被中止'
        break
      case error.MEDIA_ERR_NETWORK:
        errorMsg = '网络错误导致视频加载失败'
        break
      case error.MEDIA_ERR_DECODE:
        errorMsg = '视频解码失败'
        break
      case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMsg = '视频格式不支持或URL无效'
        break
      default:
        errorMsg = error.message || '未知错误'
    }
  }
  errorMessage.value = `视频加载失败: ${errorMsg}`
}

// 键盘快捷键处理
const handleKeyDown = (event) => {
  // ESC键返回上一页
  if (event.key === 'Escape') {
    goBack()
  }
}

// 组件挂载时
onMounted(() => {
  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeyDown)
  
  // 检查URL并更新加载状态
  if (!currentVideo.value.url || currentVideo.value.url === 'http://60.205.94.65:8081/') {
    isLoading.value = false
    hasError.value = true
    errorMessage.value = '视频URL无效或为空'
  } else {
    // URL有效，开始加载视频
    isLoading.value = false
  }
})

// 组件卸载时
onBeforeUnmount(() => {
  // 移除键盘事件监听
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主容器 */
.video-player-container {
  width: 100%;
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 页面背景装饰 */
.page-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(64, 158, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(103, 194, 58, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* 视频头部 */
.video-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px 32px;
  background: linear-gradient(135deg, white 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
  border: 1px solid #e2e8f0;
  position: relative;
  z-index: 1;
  animation: slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

/* 视频头部装饰 */
.video-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(64, 158, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
}

/* 返回按钮 */
.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  align-self: center;
}

/* 头部内容 */
.header-content {
  flex: 1;
  min-width: 0;
}

.back-btn:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #7dd3fc 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.45);
}

.back-btn:active {
  transform: translateY(0);
}

.back-icon {
  font-size: 16px;
  font-weight: bold;
}

.back-text {
  font-size: 14px;
  letter-spacing: 0.5px;
}

/* 标题行 */
.title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

/* 视频标题 */
.video-title {
  margin: 0;
  color: #2c3e50;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
}

/* 视频类型徽章 */
.video-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 徽章图标 */
.badge-icon {
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 徽章文本 */
.badge-text {
  font-weight: 700;
}

/* 视频类型徽章悬停效果 */
.video-badge:hover {
  background: linear-gradient(135deg, #85ce61 0%, #a0d911 100%);
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
}

/* 视频类型徽章激活效果 */
.video-badge:active {
  transform: translateY(0) scale(1);
  box-shadow: 0 2px 6px rgba(103, 194, 58, 0.3);
}

/* 视频详情信息 */
.video-detail-info {
  margin-top: 8px;
  width: 100%;
  overflow: hidden;
}

/* 详情行 */
.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #64748b;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  width: 100%;
  overflow: hidden;
}

/* 详情分隔符 */
.detail-separator {
  color: #cbd5e1;
  margin: 0 2px;
  font-weight: 300;
  user-select: none;
}

/* 详情项 */
.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 8px;
}

.detail-item:hover {
  background: #ecf5ff;
  color: #409eff;
}

/* 备注项 */
.remark-item {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 详情图标 */
.detail-icon {
  font-size: 14px;
  color: #409eff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: transparent;
  border-radius: 50%;
  border: none;
  transition: all 0.3s ease;
}

.detail-item:hover .detail-icon {
  color: #66b1ff;
  transform: scale(1.1);
}

.video-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(103, 194, 58, 0.4);
}

/* 视频内容区域 */
.video-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  z-index: 1;
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  margin: 0;
  align-items: stretch;
}

/* 视频播放器包装器 */
.video-player-wrapper {
  background: white;
  border-radius: 20px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  width: 100%;
  backdrop-filter: blur(10px);
  animation: slideRight 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.video-player-wrapper:hover {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

/* 视频播放器 */
.video-player {
  width: 100%;
  height: auto;
  max-height: 700px;
  min-height: 500px;
  background-color: #0f172a;
  border-radius: 20px 20px 0 0;
  border: none;
  outline: none;
  transition: all 0.3s ease;
  object-fit: contain;
}

.video-player:focus {
  outline: 3px solid rgba(64, 158, 255, 0.3);
  outline-offset: 2px;
}

/* 视频回退内容 */
.video-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #0f172a;
  color: white;
  text-align: center;
  padding: 40px;
}

.fallback-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: pulse 2s ease-in-out infinite;
}

/* 视频加载覆盖层 */
.video-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 500px;
  max-height: 700px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  gap: 20px;
  border-radius: 20px 20px 0 0;
}

/* 加载旋转动画 */
.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.3);
}

/* 旋转动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 加载文本 */
.loading-text {
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInOut 1.5s ease-in-out infinite;
}

/* 淡入淡出动画 */
@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

/* 视频错误覆盖层 */
.video-error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 500px;
  max-height: 700px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(185, 28, 28, 0.9) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  gap: 20px;
  border-radius: 20px 20px 0 0;
  padding: 40px;
  text-align: center;
}

/* 错误图标 */
.error-icon {
  font-size: 64px;
  animation: shake 0.6s ease-in-out;
}

/* 摇晃动画 */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

/* 错误文本 */
.error-text {
  color: white;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
}

/* 重试按钮 */
.retry-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, white 0%, #f8fafc 100%);
  color: #dc2626;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.retry-btn:active {
  transform: translateY(0);
}

/* 播放器信息覆盖层 */
.player-info-overlay {
  display: flex;
  gap: 16px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

/* 信息芯片 */
.info-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  color: #64748b;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.info-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  border-color: #409eff;
  color: #409eff;
}

.chip-icon {
  font-size: 16px;
}

.chip-text {
  font-weight: 500;
}

/* 视频信息卡片 */
.video-info-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.video-info-card:hover {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

/* 卡片头部 */
.card-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
}

.card-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.card-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background: white;
  border-radius: 2px;
}

.card-divider {
  margin-top: 12px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, transparent 100%);
  border-radius: 1px;
}

/* 卡片内容 */
.card-content {
  padding: 24px;
}

/* 信息网格 */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 信息项 */
.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: #ecf5ff;
  border-color: #409eff;
  transform: translateX(4px);
}

/* 信息标签 */
.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.label-icon {
  font-size: 16px;
}

.label-text {
  flex: 1;
}

/* 信息值 */
.info-value {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  line-height: 1.5;
  word-break: break-word;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .video-content {
    gap: 24px;
  }
  
  .video-header {
    flex-wrap: wrap;
    justify-content: flex-start;
    text-align: left;
  }
  
  .video-title {
    text-align: left;
  }
  
  .detail-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 调试信息样式 */
.debug-info {
  padding: 16px 24px;
  background: linear-gradient(135deg, rgba(255, 255, 0, 0.1) 0%, rgba(255, 255, 0, 0.05) 100%);
  border-top: 1px solid rgba(255, 255, 0, 0.2);
  font-size: 12px;
  color: #64748b;
}

.debug-info h4 {
  margin: 0 0 8px 0;
  color: #eab308;
  font-size: 13px;
  font-weight: 700;
}

.debug-info p {
  margin: 4px 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .video-player-container {
    padding: 16px;
  }
  
  .video-header {
    padding: 16px;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .video-title {
    font-size: 20px;
  }
  
  .back-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .player-info-overlay {
    padding: 12px 16px;
    gap: 12px;
  }
  
  .card-content {
    padding: 16px;
  }
  
  .info-item {
    padding: 12px;
  }
  
  .debug-info {
    padding: 12px 16px;
  }
}
</style>