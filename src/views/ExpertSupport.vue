<template>
  <div class="expert-support-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">专家支持</h1>
      <p class="page-subtitle">汇聚各领域顶尖专家，为科研提供专业指导</p>
    </div>
    
    <!-- 专家列表 -->
    <div class="experts-grid">
      <!-- 添加专家入口 - 仅管理员可见 -->
      <div 
        v-if="isAdmin"
        class="expert-card add-expert-card"
        @click="showAddDialog = true"
      >
        <!-- 添加图标 -->
        <div class="add-expert-icon">+</div>
        
        <!-- 添加专家信息 -->
        <div class="add-expert-info">
          <h3 class="add-expert-name">添加专家</h3>
          <div class="add-expert-description">点击添加新的专家信息</div>
        </div>
      </div>
      
      <!-- 专家列表 -->
      <div 
        v-for="expert in experts" 
        :key="expert.id"
        class="expert-card"
        @click="toggleExpertDetail(expert.id)"
      >
        <!-- 删除按钮 - 仅管理员可见 -->
        <button 
          v-if="isAdmin"
          class="card-delete-btn"
          @click.stop="handleDeleteExpert(expert.id, expert.name)"
          title="删除专家"
        >
          <span class="delete-icon">🗑️</span>
          <span class="delete-text">删除专家</span>
        </button>
        
        <!-- 专家头像 -->
        <div class="expert-avatar-wrapper">
          <div class="expert-avatar" :style="{ backgroundImage: `url(${expert.avatarUrl})` }">
            <div v-if="!expert.avatarUrl" class="avatar-placeholder">
              {{ expert.name.charAt(0) }}
            </div>
          </div>
          <!-- 专家职称标签 -->
          <div class="expert-title-badge">
            {{ expert.title }}
          </div>
        </div>
        
        <!-- 专家基本信息 -->
        <div class="expert-info">
          <h3 class="expert-name">{{ expert.name }}</h3>
          <div class="expert-department">{{ expert.department }}</div>
          <div class="expert-education">{{ expert.education }}</div>
        </div>
        
        <!-- 专家简介 -->
        <div class="expert-bio">
          {{ expert.bio.length > 100 ? expert.bio.substring(0, 100) + '...' : expert.bio }}
        </div>
        
        <!-- 展开/收起按钮 -->
        <button 
          class="expand-btn"
          @click.stop="toggleExpertDetail(expert.id)"
        >
          {{ expandedExpertId === expert.id ? '收起详情' : '查看详情' }}
          <span class="expand-icon">{{ expandedExpertId === expert.id ? '▼' : '▶' }}</span>
        </button>
        
        <!-- 详细信息面板 -->
<div 
  v-if="expandedExpertId === expert.id" 
  class="expert-detail-panel"
>
  <div class="detail-section">
    <h4 class="detail-title">专家介绍</h4>
    <p class="detail-content">{{ expert.detailedBio || expert.bio }}</p>
  </div>
          
          <div class="detail-section">
            <h4 class="detail-title">专业领域</h4>
            <div class="expert-fields">
              <span 
                v-for="field in expert.fields" 
                :key="field"
                class="field-tag"
              >
                {{ field }}
              </span>
            </div>
          </div>
          
          <div v-if="expert.achievements && expert.achievements.length > 0" class="detail-section">
            <h4 class="detail-title">科研成果</h4>
            <ul class="achievements-list">
              <li v-for="(achievement, index) in expert.achievements" :key="index" class="achievement-item">
                <span class="achievement-number">{{ index + 1 }}.</span>
                <span class="achievement-content">{{ achievement }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加专家Dialog -->
    <div v-if="showAddDialog" class="dialog-overlay" @click="closeAddDialog">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h2 class="dialog-title">添加专家</h2>
          <button class="close-btn" @click="closeAddDialog">
            <span class="close-icon">✕</span>
          </button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="handleAddExpert" class="expert-form">
            <div class="form-row">
              <div class="form-group">
                <label for="expertName" class="form-label">姓名</label>
                <input 
                  type="text" 
                  id="expertName" 
                  v-model="addForm.name" 
                  required
                  placeholder="请输入专家姓名"
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label for="expertTitle" class="form-label">职称</label>
                <input 
                  type="text" 
                  id="expertTitle" 
                  v-model="addForm.title" 
                  required
                  placeholder="请输入专家职称"
                  class="form-input"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="expertDepartment" class="form-label">科室</label>
                <input 
                  type="text" 
                  id="expertDepartment" 
                  v-model="addForm.department" 
                  required
                  placeholder="请输入专家科室"
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label for="expertDegree" class="form-label">学历</label>
                <input 
                  type="text" 
                  id="expertDegree" 
                  v-model="addForm.degree" 
                  required
                  placeholder="请输入专家学历"
                  class="form-input"
                >
              </div>
            </div>
            
            <div class="form-group">
              <label for="expertAvatar" class="form-label">头像</label>
              <div class="file-upload">
                <input 
                  type="file" 
                  id="expertAvatar" 
                  ref="fileInput"
                  @change="handleFileChange"
                  accept="image/*"
                  style="display: none"
                >
                <button 
                  type="button" 
                  class="upload-btn"
                  @click="triggerFileInput"
                >
                  <span class="upload-icon">📁</span>
                  {{ selectedFile ? selectedFile.name : '选择头像' }}
                </button>
                <div v-if="selectedFile" class="file-info">
                  {{ formatFileSize(selectedFile.size) }}
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="expertIntroduction" class="form-label">简介</label>
              <textarea 
                id="expertIntroduction" 
                v-model="addForm.introduction" 
                required
                placeholder="请输入专家简介"
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="expertDetailedDesc" class="form-label">详细介绍</label>
              <textarea 
                id="expertDetailedDesc" 
                v-model="addForm.detailed_description" 
                placeholder="请输入专家详细介绍"
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="expertSpecialties" class="form-label">专业领域</label>
              <input 
                type="text" 
                id="expertSpecialties" 
                v-model="addForm.specialties" 
                required
                placeholder="请输入专业领域，用逗号分隔"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="expertAchievements" class="form-label">科研成果</label>
              <textarea 
                id="expertAchievements" 
                v-model="addForm.research_achievements"
                required
                placeholder='请输入科研成果，用换行分割，可以直接填"无"，将不显示科研成果'
                rows="5"
                class="form-textarea"
              ></textarea>
            </div>
            
            <div class="dialog-footer">
              <button type="button" class="cancel-btn" @click="closeAddDialog">取消</button>
              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="loading-spinner">⏳</span>
                {{ isSubmitting ? '提交中...' : '提交' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getExpertsListApi, addDoctorApi, deleteDoctorApi } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user'

// 获取用户store实例
const userStore = useUserStore()

// 判断是否为管理员
const isAdmin = computed(() => {
  // 添加调试信息
  console.log('用户信息:', userStore.userInfo)
  console.log('用户角色:', userStore.userInfo?.roles)
  
  // 灵活判断管理员：可以根据roles字段，或者是否有系统管理菜单
  return userStore.userInfo?.roles === 'admin' || 
         userStore.userInfo?.role === 'admin' || 
         userStore.userInfo?.username === 'admin' || 
         false
})

// 展开的专家ID
const expandedExpertId = ref(null)

// 专家数据
const experts = ref([])

// 添加专家Dialog状态
const showAddDialog = ref(false)

// 添加专家表单数据
const addForm = ref({
  name: '',
  title: '',
  department: '',
  degree: '',
  introduction: '',
  detailed_description: '',
  specialties: '',
  research_achievements: ''
})

// 选中的文件
const selectedFile = ref(null)

// 文件输入框ref
const fileInput = ref(null)

// 提交状态
const isSubmitting = ref(false)

// 获取专家列表
const fetchExperts = async () => {
  try {
    const data = await getExpertsListApi()
    // 将接口返回的数据转换为组件需要的格式
experts.value = data.map(expert => {
  // 处理科研成果，如果为"无"或只有空行，则返回空数组
  let achievements = [];
  if (expert.research_achievements && expert.research_achievements !== '无') {
    achievements = expert.research_achievements.split('\n').filter(item => item.trim());
  }
  
  return {
    id: expert.id,
    name: expert.name,
    avatarUrl: expert.avatar_url ? `/api/files/${expert.avatar_url}` : '',
    title: expert.title,
    department: expert.department,
    education: expert.degree,
    bio: expert.introduction,
    detailedBio: expert.detailed_description,
    fields: expert.specialties.split(',').map(field => field.trim()),
    achievements: achievements
  };
})
  } catch (error) {
    console.error('获取专家列表失败:', error)
    ElMessage.error('获取专家列表失败')
  }
}

// 页面加载时获取专家列表和用户信息
onMounted(() => {
  // 加载用户信息，确保管理员权限正确
  userStore.loadUserInfo()
  // 获取专家列表
  fetchExperts()
})

// 切换专家详情展开/收起状态
const toggleExpertDetail = (expertId) => {
  if (expandedExpertId.value === expertId) {
    expandedExpertId.value = null
  } else {
    expandedExpertId.value = expertId
  }
}

// 关闭添加专家Dialog
const closeAddDialog = () => {
  showAddDialog.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  addForm.value = {
    name: '',
    title: '',
    department: '',
    degree: '',
    introduction: '',
    detailed_description: '',
    specialties: '',
    research_achievements: '无'
  }
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

// 格式化文件大小
const formatFileSize = (size) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  }
}

// 处理添加专家
const handleAddExpert = async () => {
  try {
    isSubmitting.value = true
    
    // 构建FormData
    const formData = new FormData()
    
    // 添加表单字段
    formData.append('name', addForm.value.name)
    formData.append('title', addForm.value.title)
    formData.append('department', addForm.value.department)
    formData.append('degree', addForm.value.degree)
    formData.append('introduction', addForm.value.introduction)
    formData.append('detailed_description', addForm.value.detailed_description)
    formData.append('specialties', addForm.value.specialties)
    // 如果科研成果为空，默认设置为"无"
    formData.append('research_achievements', addForm.value.research_achievements || '无')
    
    // 添加文件
    if (selectedFile.value) {
      formData.append('file', selectedFile.value)
    }
    
    // 调用添加专家API
    await addDoctorApi(formData)
    
    // 关闭Dialog
    closeAddDialog()
    
    // 刷新专家列表
    await fetchExperts()
    
    // 显示成功消息
    ElMessage.success('添加专家成功')
  } catch (error) {
    console.error('添加专家失败:', error)
    ElMessage.error('添加专家失败')
  } finally {
    isSubmitting.value = false
  }
}

// 处理删除专家
const handleDeleteExpert = async (id, name) => {
  try {
    // 使用Element Plus的确认对话框
    await ElMessageBox.confirm(
      `确定要删除专家"${name}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }
    )
    
    // 调用删除专家API
    await deleteDoctorApi(id)
    
    // 刷新专家列表
    await fetchExperts()
    
    // 显示成功消息
    ElMessage.success('删除专家成功')
  } catch (error) {
    // 如果用户取消操作，不显示错误消息
    if (error !== 'cancel') {
      console.error('删除专家失败:', error)
      ElMessage.error('删除专家失败')
    }
  }
}
</script>

<style scoped>
/* 页面容器 */
.expert-support-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 页面标题 */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 添加专家卡片 */
.add-expert-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, rgba(103, 194, 58, 0.05) 0%, rgba(103, 194, 58, 0.08) 100%);
  border: 2px dashed #67c23a;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-expert-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(103, 194, 58, 0.2);
  border-color: #85ce61;
  background: linear-gradient(135deg, rgba(103, 194, 58, 0.1) 0%, rgba(103, 194, 58, 0.15) 100%);
}

/* 添加专家图标 */
.add-expert-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: white;
  font-size: 48px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
  transition: all 0.3s ease;
}

.add-expert-card:hover .add-expert-icon {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(103, 194, 58, 0.4);
  background: linear-gradient(135deg, #85ce61 0%, #a0d911 100%);
}

/* 添加专家信息 */
.add-expert-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 添加专家名称 */
.add-expert-name {
  font-size: 20px;
  font-weight: 700;
  color: #67c23a;
  margin: 0 0 12px 0;
  transition: all 0.3s ease;
}

.add-expert-card:hover .add-expert-name {
  color: #85ce61;
  transform: translateY(-2px);
}

/* 添加专家描述 */
.add-expert-description {
  font-size: 14px;
  color: #606266;
  margin: 0;
  transition: all 0.3s ease;
}

.add-expert-card:hover .add-expert-description {
  color: #409eff;
}

/* 页面标题 */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  animation: dialogSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

/* Dialog淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

/* 表单行 */
.form-row {
  display: flex;
  gap: 14px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

/* 表单组 */
.form-group {
  flex: 1;
  min-width: 320px;
  margin-bottom: 8px;
}

/* 表单标签 */
.form-label {
  display: block;
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
  padding: 12px 14px;
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
  min-height: 80px;
  line-height: 1.6;
}

/* 文件上传 */
.file-upload {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* 上传按钮 */
.upload-btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

/* 文件信息 */
.file-info {
  font-size: 13px;
  color: #64748b;
  background: #f1f5f9;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-weight: 500;
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
  padding: 12px 28px;
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
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
  padding: 12px 28px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: white;
  border: none;
  border-radius: 12px;
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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 滚动条样式 */
.dialog-content::-webkit-scrollbar {
  width: 8px;
}

.dialog-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.dialog-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.dialog-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 专家表单 */
.expert-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dialog-content {
    width: 95%;
    margin: 20px;
    border-radius: 16px;
  }
  
  .dialog-header {
    padding: 24px 20px;
    border-radius: 16px 16px 0 0;
  }
  
  .dialog-title {
    font-size: 20px;
  }
  
  .dialog-body {
    padding: 20px;
  }
  
  .dialog-footer {
    padding: 20px;
    border-radius: 0 0 16px 16px;
    flex-direction: column;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-group {
    min-width: 100%;
  }
  
  .form-input,
  .form-textarea {
    padding: 12px 14px;
    font-size: 14px;
  }
  
  .upload-btn {
    padding: 12px 20px;
    width: 100%;
    justify-content: center;
  }
  
  .cancel-btn,
  .submit-btn {
    padding: 12px 20px;
    width: 100%;
    justify-content: center;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
  
  .form-group {
    min-width: 100%;
  }
  
  .dialog-content {
    width: 95%;
    margin: 20px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
  font-weight: 500;
}

/* 专家网格布局 */
.experts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  justify-content: center;
}

/* 专家卡片 */
.expert-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  position: relative;
}

/* 卡片删除按钮 */
.card-delete-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  opacity: 0.8;
  z-index: 10;
}

.card-delete-btn:hover {
  opacity: 1;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

/* 删除图标 */
.delete-icon {
  font-size: 18px;
}

/* 删除文本 - 隐藏文本，只显示图标 */
.delete-text {
  display: none;
}

/* 卡片悬停效果 */
.expert-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

/* 卡片悬停时显示删除按钮更明显 */
.expert-card:hover .card-delete-btn {
  opacity: 0.8;
}

/* 专家头像包装 */
.expert-avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px auto;
}

/* 专家头像 */
.expert-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-color: #f3f4f6;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 头像占位符 */
.avatar-placeholder {
  font-size: 48px;
  font-weight: 700;
  color: #667eea;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 专家职称标签 */
.expert-title-badge {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  white-space: nowrap;
}

/* 卡片删除按钮 */
.card-delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #f56c6c 0%, #ef4444 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.card-delete-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(245, 108, 108, 0.4);
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}



/* 专家基本信息 */
.expert-info {
  text-align: center;
  margin-bottom: 16px;
}

/* 专家姓名 */
.expert-name {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

/* 专家科室 */
.expert-department {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
  font-weight: 500;
}

/* 专家学历 */
.expert-education {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

/* 专家简介 */
.expert-bio {
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 20px;
  text-align: justify;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

/* 展开/收起按钮 */
.expand-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  color: #667eea;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: auto;
}

.expand-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 展开图标 */
.expand-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

/* 专家详情面板 */
.expert-detail-panel {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e5e7eb;
  animation: slideDown 0.3s ease;
  position: relative;
}

/* 详情面板删除按钮 */
.detail-delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px 16px;
  background: linear-gradient(135deg, #f56c6c 0%, #ef4444 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
}

.detail-delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 108, 108, 0.4);
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* 详情部分 */
.detail-section {
  margin-bottom: 24px;
}

/* 详情标题 */
.detail-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

/* 详情内容 */
.detail-content {
  font-size: 14px;
  line-height: 1.7;
  color: #4b5563;
  margin: 0;
  text-align: justify;
}

/* 专家领域标签 */
.expert-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 领域标签 */
.field-tag {
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.field-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 科研成果列表 */
.achievements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 科研成果项 */
.achievement-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
}

/* 成果编号 */
.achievement-number {
  font-weight: 700;
  color: #667eea;
  flex-shrink: 0;
  margin-top: 2px;
}

/* 成果内容 */
.achievement-content {
  flex: 1;
  text-align: justify;
}

/* 下滑动画 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .experts-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .expert-support-container {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
  
  .experts-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .expert-card {
    padding: 20px;
  }
  
  .expert-avatar-wrapper {
    width: 100px;
    height: 100px;
  }
  
  .expert-avatar {
    width: 100px;
    height: 100px;
  }
  
  .avatar-placeholder {
    font-size: 40px;
  }
  
  .expert-name {
    font-size: 18px;
  }
}
</style>