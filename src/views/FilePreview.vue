<template>
  <div class="file-preview-container">
    <div class="preview-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>{{ fileName }}</h2>
      <span class="file-type">{{ fileType.toUpperCase() }}</span>
    </div>
    
    <div class="preview-content">
      <!-- PDF文件预览 -->
      <div v-if="fileType === 'pdf'" class="pdf-preview">
        <iframe 
          :src="pdfViewerUrl" 
          class="preview-iframe"
          title="PDF预览"
        ></iframe>
      </div>
      
      <!-- DOC/DOCX文件预览 -->
      <div v-else-if="fileType === 'doc' || fileType === 'docx'" class="doc-preview">
        <iframe 
          :src="docViewerUrl" 
          class="preview-iframe"
          title="文档预览"
        ></iframe>
      </div>
      
      <!-- MP4视频预览 -->
      <div v-else-if="fileType === 'mp4'" class="video-preview">
        <video 
          class="video-player"
          controls
          autoplay
          :src="fileUrl"
        >
          您的浏览器不支持HTML5视频播放
        </video>
      </div>
      
      <!-- Excel文件预览 -->
      <div v-else-if="fileType === 'excel' || fileType === 'xls' || fileType === 'xlsx'" class="excel-preview">
        <iframe 
          :src="excelViewerUrl" 
          class="preview-iframe"
          title="Excel预览"
        ></iframe>
      </div>
      
      <!-- 其他文件类型 -->
      <div v-else class="other-preview">
        <div class="download-container">
          <div class="download-icon">📥</div>
          <h3>该文件类型不支持在线预览</h3>
          <p>请点击下方按钮下载文件</p>
          <button class="download-btn" @click="downloadFile">下载文件</button>
        </div>
      </div>
    </div>
    
    <!-- 文件信息 -->
    <div class="file-info">
      <h3>文件信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">文件名：</span>
          <span class="info-value">{{ fileName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">文件类型：</span>
          <span class="info-value">{{ fileType.toUpperCase() }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">文件大小：</span>
          <span class="info-value">{{ formatSize(fileSize) }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">访问地址：</span>
          <a :href="fileUrl" class="info-link" target="_blank">{{ fileUrl }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 从路由参数获取文件信息
const fileUrl = computed(() => route.query.url || '')
const fileName = computed(() => route.query.name || '未知文件')
const fileType = computed(() => (route.query.type || '').toLowerCase())
const fileSize = computed(() => parseInt(route.query.size) || 0)

// PDF查看器URL
const pdfViewerUrl = computed(() => {
  // 使用PDF.js在线查看器
  return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(fileUrl.value)}`
})

// DOC/DOCX查看器URL
const docViewerUrl = computed(() => {
  // 使用微软Office Online查看器
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl.value)}`
})

// Excel查看器URL
const excelViewerUrl = computed(() => {
  // 使用微软Office Online查看器
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl.value)}`
})

// 格式化文件大小
const formatSize = (size) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 下载文件
const downloadFile = () => {
  window.open(fileUrl.value, '_blank')
}
</script>

<style scoped>
.file-preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  overflow: hidden;
}

/* 预览头部 */
.preview-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 10;
}

.back-btn {
  padding: 8px 16px;
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.back-btn:hover {
  background-color: #e4e7ed;
  color: #303133;
}

.preview-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-type {
  background-color: #ecf5ff;
  color: #409eff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

/* 预览内容区 */
.preview-content {
  flex: 1;
  padding: 24px;
  overflow: auto;
  box-sizing: border-box;
}

/* iframe预览样式 */
.preview-iframe {
  width: 100%;
  height: 80vh;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: white;
}

/* 视频预览样式 */
.video-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-player {
  width: 100%;
  max-width: 1000px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 下载提示样式 */
.download-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.download-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #909399;
}

.download-container h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #606266;
}

.download-container p {
  margin: 0 0 24px 0;
  color: #909399;
  font-size: 14px;
}

.download-btn {
  padding: 12px 32px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.download-btn:hover {
  background-color: #85ce61;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

/* 文件信息区 */
.file-info {
  background-color: white;
  padding: 24px;
  border-top: 1px solid #e4e7ed;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
}

.file-info h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.info-label {
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
  width: 80px;
}

.info-value {
  color: #303133;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-link {
  color: #409eff;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-link:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .preview-header {
    padding: 12px 16px;
  }
  
  .preview-header h2 {
    font-size: 16px;
  }
  
  .preview-content {
    padding: 16px;
  }
  
  .preview-iframe {
    height: 60vh;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .file-info {
    padding: 16px;
  }
}
</style>