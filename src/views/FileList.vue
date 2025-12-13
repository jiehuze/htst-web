<template>
  <div class="file-list-container">
    <h2>{{ $route.meta.title }}</h2>
    
    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <div class="search-left">
        <select 
          class="search-select"
          v-model="searchType"
        >
          <option value="title">按名称</option>
          <option value="format">按格式</option>
          <option value="timeRange">按时间范围</option>
        </select>
        <!-- 按名称搜索输入框 -->
        <input 
          v-if="searchType === 'title'" 
          type="text" 
          class="search-input"
          placeholder="请输入内容"
          v-model="searchKeyword"
        >
        <!-- 按格式搜索下拉选择框 -->
        <select 
          v-else-if="searchType === 'format'" 
          class="search-select format-select"
          v-model="searchKeyword"
          placeholder="请选择格式"
        >
          <option value="">请选择格式</option>
          <option value="mp4">MP4</option>
          <option value="pdf">PDF</option>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="jpeg">JPEG</option>
          <option value="gif">GIF</option>
        </select>
        <!-- 时间范围选择 -->
        <div v-else class="time-range">
          <input 
            type="date" 
            class="time-input"
            placeholder="开始时间"
            v-model="startTime"
          >
          <span class="time-separator">至</span>
          <input 
            type="date" 
            class="time-input"
            placeholder="结束时间"
            v-model="endTime"
          >
        </div>
        <button class="search-btn" @click="handleSearch">查询</button>
        <button class="reset-btn" @click="handleReset">重置</button>
      </div>
      <div class="search-right">
        <button v-if="isAdmin" class="add-btn" @click="showAddDialog = true">增加</button>
        <button class="refresh-btn" @click="handleRefresh" title="刷新文件列表">🔄</button>
      </div>
    </div>
    
    <!-- 文件列表 -->
    <div class="file-table-wrapper">
      <table class="file-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>名称</th>
            <th>核心说明</th>
            <th>权限说明</th>
            <th>格式</th>
            <th>大小</th>
            <th>访问量</th>
            <th>备注</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(file, index) in fileList" 
            :key="file.id"
            class="file-row"
            @click="handleFileClick(file)"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ file.name }}</td>
            <td>{{ file.core_description }}</td>
            <td>{{ file.permission_note }}</td>
            <td class="file-format">
              <span 
                class="format-badge" 
                :class="`format-${file.format.toLowerCase()}`"
              >
                {{ formatIcon(file.format) }} {{ file.format.toUpperCase() }}
              </span>
            </td>
            <td>{{ formatSize(file.size) }}</td>
            <td>{{ file.count || 0 }}</td>
            <td>{{ file.remark }}</td>
            <td>
              <!-- MP4格式：显示播放和删除按钮（管理员） -->
              <template v-if="file.format === 'mp4'">
                <button 
                  class="action-btn"
                  @click.stop="handleFileClick(file)"
                >
                  播放
                </button>
                <!-- 管理员显示删除按钮 -->
                <button 
                  v-if="isAdmin"
                  class="action-btn delete-btn"
                  @click.stop="handleDeleteFile(file)"
                >
                  删除
                </button>
              </template>
              
              <!-- PDF和图片格式：显示查看、下载和删除按钮（管理员） -->
              <template v-else-if="['pdf', 'png', 'jpg', 'jpeg', 'gif'].includes(file.format.toLowerCase())">
                <button 
                  class="action-btn"
                  @click.stop="handleFileClick(file)"
                >
                  查看
                </button>
                <button 
                  class="action-btn download-btn"
                  @click.stop="downloadFile(file)"
                >
                  下载
                </button>
                <!-- 管理员显示删除按钮 -->
                <button 
                  v-if="isAdmin"
                  class="action-btn delete-btn"
                  @click.stop="handleDeleteFile(file)"
                >
                  删除
                </button>
              </template>
              
              <!-- 其他格式：显示下载和删除按钮（管理员） -->
              <template v-else>
                <button 
                  class="action-btn"
                  @click.stop="handleFileClick(file)"
                >
                  下载
                </button>
                <!-- 管理员显示删除按钮 -->
                <button 
                  v-if="isAdmin"
                  class="action-btn delete-btn"
                  @click.stop="handleDeleteFile(file)"
                >
                  删除
                </button>
              </template>
            </td>
          </tr>
          <tr v-if="fileList.length === 0">
            <td colspan="9" class="no-data">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页区域 -->
    <div class="pagination">
      <div class="pagination-info">
        共 {{ total }} 条
      </div>
      <div class="pagination-controls">
        <select 
          class="page-size-select"
          v-model="pageSize"
          @change="handlePageSizeChange"
        >
          <option value="10">10条/页</option>
          <option value="20">20条/页</option>
          <option value="50">50条/页</option>
        </select>
        <button 
          class="page-btn" 
          :disabled="currentPage === 1"
          @click="handleFirstPage"
        >
          首页
        </button>
        <button 
          class="page-btn" 
          :disabled="currentPage === 1"
          @click="handlePrevPage"
        >
          上一页
        </button>
        <span class="current-page">{{ currentPage }}</span>
        <button 
          class="page-btn" 
          :disabled="currentPage >= Math.ceil(total / pageSize)"
          @click="handleNextPage"
        >
          下一页
        </button>
        <button 
          class="page-btn" 
          :disabled="currentPage >= Math.ceil(total / pageSize)"
          @click="handleLastPage"
        >
          末页
        </button>
        <span class="page-info">共 {{ Math.ceil(total / pageSize) }} 页</span>
      </div>
    </div>
    
    <!-- 增加文件弹窗 -->
    <div v-if="showAddDialog" class="dialog-overlay">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>增加信息 - {{ currentMenuName }}</h3>
          <button class="close-btn" @click="showAddDialog = false" :disabled="isUploading">×</button>
        </div>
        
        <!-- 上传中遮罩 -->
        <div v-if="isUploading" class="uploading-overlay">
          <div class="uploading-content">
            <div class="uploading-spinner">⏳</div>
            <div class="uploading-text">文件上传中，请稍候...</div>
            <div class="uploading-hint">文件较大时可能需要较长时间</div>
          </div>
        </div>
        <form @submit.prevent="handleAddFile" class="add-file-form">
          <div class="form-item">
            <label for="addTitle">名称</label>
            <input 
              type="text" 
              id="addTitle" 
              v-model="addForm.title" 
              required
              placeholder="请输入名称"
            >
          </div>
        
          <div class="form-item">
            <label for="addCoreDescription">核心说明</label>
            <textarea 
              id="addCoreDescription" 
              v-model="addForm.core_description" 
              required
              placeholder="请输入核心说明"
              rows="3"
            ></textarea>
          </div>
          <div class="form-item">
            <label for="addPermissionNote">权限</label>
            <input 
              type="text" 
              id="addPermissionNote" 
              v-model="addForm.permission_note" 
              required
              placeholder="请输入权限"
            >
          </div>
          <div class="form-item">
            <label for="addRemark">备注</label>
            <input 
              type="text" 
              id="addRemark" 
              v-model="addForm.remark" 
              placeholder="请输入备注"
            >
          </div>
          <div class="form-item">
            <label for="addFile">文件</label>
            <div class="file-upload">
              <div class="file-upload-area" @click="handleUploadClick">
                <div class="upload-icon">☁️</div>
                <div class="upload-text">点击上传文件</div>
                <div class="upload-hint">支持PDF、MP4、PNG、JPG、JPEG、GIF格式</div>
              </div>
              <input 
                type="file" 
                ref="fileInput"
                @change="handleFileChange"
                required
                accept=".pdf,.mp4,.png,.jpg,.jpeg,.gif"
                style="display: none;"
              >
              <div class="file-name" v-if="selectedFile">
                <span class="file-icon">📄</span>
                <span class="file-text">{{ selectedFile.name }}</span>
                <button class="remove-file" @click.stop="selectedFile = null">×</button>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="showAddDialog = false" :disabled="isUploading">取消</button>
            <button type="submit" class="submit-btn" :disabled="isUploading">
              <span v-if="isUploading" class="loading-icon">⏳</span>
              <span v-else>提交</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { infoListApi, infoDeleteApi, infoClickApi, infoAddApi } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 搜索相关
const searchKeyword = ref('')
const searchType = ref('title')
const startTime = ref('')
const endTime = ref('')

// 导入用户store
const userStore = useUserStore()

// 文件列表数据
const fileList = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 增加文件弹窗状态
const showAddDialog = ref(false)

// 增加文件表单数据
const addForm = ref({
  title: '',
  core_description: '',
  permission_note: '',
  remark: ''
})

// 文件输入框ref
const fileInput = ref(null)

// 选中的文件
const selectedFile = ref(null)

// 判断用户是否为管理员
const isAdmin = computed(() => {
  return userStore.userInfo?.roles === 'admin' || false
})

// 获取当前二级菜单的名字
const currentMenuName = computed(() => {
  const path = route.path
  
  // 遍历所有菜单，找到当前路由对应的二级菜单名称
  for (const menu of userStore.menuList) {
    if (menu.children) {
      for (const submenu of menu.children) {
        if (submenu.path === path) {
          return submenu.name || ''
        }
      }
    }
  }
  
  return ''
})

// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

// 处理上传点击
const handleUploadClick = () => {
  // 使用Vue ref触发文件选择对话框
  fileInput.value.click()
}

// 处理增加文件
// 增加文件loading状态
const isUploading = ref(false)

const handleAddFile = async () => {
  try {
    // 检查是否选择了文件
    if (!selectedFile.value) {
      ElMessage.error('请选择要上传的文件')
      return
    }
    
    // 获取当前菜单的type值
    const type = getCurrentMenuType()
    if (!type) {
      ElMessage.error('未找到当前菜单类型')
      return
    }
    
    // 设置上传中状态
    isUploading.value = true
    
    // 构建FormData对象
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('title', addForm.value.title)
    formData.append('type', type) // 自动填入当前菜单的type值
    formData.append('core_description', addForm.value.core_description)
    formData.append('permission_note', addForm.value.permission_note)
    formData.append('remark', addForm.value.remark)
    
    // 调用API上传文件
    await infoAddApi(formData)
    
    // 关闭弹窗
    showAddDialog.value = false
    
    // 重置表单
    addForm.value = {
      title: '',
      core_description: '',
      permission_note: '',
      remark: ''
    }
    selectedFile.value = null
    
    // 刷新文件列表
    loadData()
    
    // 显示成功提示
    ElMessage.success('文件添加成功')
  } catch (error) {
    console.error('添加文件失败:', error)
    ElMessage.error('添加文件失败，请重试')
  } finally {
    // 无论成功失败，都重置上传状态
    isUploading.value = false
  }
}

// 根据当前路由获取对应的菜单type
const getCurrentMenuType = () => {
  const path = route.path
  
  // 遍历所有菜单，找到当前路由对应的type
  for (const menu of userStore.menuList) {
    if (menu.children) {
      for (const submenu of menu.children) {
        if (submenu.path === path) {
          return submenu.type || ''
        }
      }
    }
  }
  
  return ''
}

// 加载数据，支持所有搜索参数
const loadData = async (searchParams = {}) => {
  try {
    console.log('开始加载数据')
    console.log('当前路由:', route.path)
    
    const type = getCurrentMenuType()
    console.log('获取到的type:', type)
    
    if (!type) {
      console.error('未找到当前路由对应的菜单type')
      // 调试：显示所有菜单信息
      console.log('所有菜单:', JSON.stringify(userStore.menuList, null, 2))
      return
    }
    
    // 构建API请求参数，合并所有搜索参数
    const apiParams = {
      type: type,
      page: currentPage.value,
      page_size: pageSize.value,
      ...searchParams // 直接合并所有搜索参数
    }
    
    console.log('准备调用API:', apiParams)
    console.log('API请求URL:', `/htst/info/list?${new URLSearchParams(apiParams).toString()}`)
    
    // 调用API获取数据 - 直接传递所有参数，infoListApi会使用GET方法并将参数拼接到URL中
    const response = await infoListApi(apiParams)
    
    // 处理API返回的数据，将title映射为name，created_at映射为updateTime
    fileList.value = response.list.map(item => ({
      ...item,
      name: item.title,
      updateTime: item.created_at,
      coreDescription: item.core_description,
      permission: item.permission_note
    }))
    total.value = response.total || 0
  } catch (error) {
    console.error('获取文件列表失败:', error)
    ElMessage.error('获取文件列表失败，请重试')
  }
}

// 监听路由变化，重新加载数据
onMounted(() => {
  loadData()
})

// 监听路由变化，重新加载数据
watch(() => route.path, () => {
  // 路由变化时重置到第一页
  currentPage.value = 1
  loadData()
})

// 根据URL参数和搜索关键字过滤文件
const filteredFiles = computed(() => {
  const keyword = searchKeyword.value.toLowerCase()
  
  return fileList.value.filter(file => {
    let matchesKeyword = true
    if (keyword) {
      if (searchType.value === 'name') {
        matchesKeyword = file.name.toLowerCase().includes(keyword)
      } else {
        matchesKeyword = file[searchType.value]?.toString().toLowerCase().includes(keyword)
      }
    }
    return matchesKeyword
  })
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

// 根据文件格式返回对应的图标
const formatIcon = (format) => {
  const lowerFormat = format.toLowerCase()
  switch (lowerFormat) {
    case 'pdf':
      return '📄'
    case 'doc':
    case 'docx':
      return '📝'
    case 'excel':
    case 'xlsx':
    case 'xls':
      return '📊'
    case 'mp4':
      return '🎬'
    case 'png':
    case 'jpg':
    case 'jpeg':
      return '🖼️'
    case 'zip':
    case 'rar':
      return '📦'
    default:
      return '📎'
  }
}

// 处理搜索
const handleSearch = () => {
  // 构建搜索参数
  const searchParams = {}
  
  // 根据搜索类型添加相应的搜索参数
  if (searchType.value === 'title' && searchKeyword.value) {
    searchParams.title = searchKeyword.value
  }
  if (searchType.value === 'format' && searchKeyword.value) {
    searchParams.format = searchKeyword.value
  }
  
  // 添加时间范围参数
  if (startTime.value) {
    searchParams.start_time = startTime.value
  }
  if (endTime.value) {
    searchParams.end_time = endTime.value
  }
  
  // 调用loadData函数，传递搜索参数
  loadData(searchParams)
}

// 处理重置
const handleReset = () => {
  searchKeyword.value = ''
  searchType.value = 'title'
  startTime.value = ''
  endTime.value = ''
  // 重置后重新加载数据
  loadData()
}

// 处理刷新
const handleRefresh = () => {
  // 直接调用loadData函数刷新文件列表
  loadData()
}

// 分页相关方法
const handleFirstPage = () => {
  currentPage.value = 1
  loadData()
}

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadData()
  }
}

const handleNextPage = () => {
  const totalPages = Math.ceil(total.value / pageSize.value)
  if (currentPage.value < totalPages) {
    currentPage.value++
    loadData()
  }
}

const handleLastPage = () => {
  currentPage.value = Math.ceil(total.value / pageSize.value) || 1
  loadData()
}

const handlePageSizeChange = () => {
  currentPage.value = 1
  loadData()
}

// 处理文件点击统计
const handleFileClickStats = (file) => {
  // 调用点击统计API
  infoClickApi(file.id).catch(error => {
    console.error('点击统计失败:', error)
    // 不影响正常操作，仅在控制台输出错误
  })
}

// 处理文件点击事件
const handleFileClick = (file) => {
  // 调用点击统计API
  handleFileClickStats(file)
  
  // 构建完整的文件访问URL
  const fileUrl = `/api/files/${file.file_path}`
  
  if (file.format === 'mp4') {
    // MP4文件：跳转到视频播放页面
    router.push({
      path: `/video/${file.id}`,
      query: {
        name: file.name,
        file_path: file.file_path,
        size: file.size,
        update_time: file.updateTime,
        core_description: file.core_description,
        permission_note: file.permission_note,
        remark: file.remark
      }
    })
  } else if (file.format === 'pdf' || ['png', 'jpg', 'jpeg', 'gif'].includes(file.format.toLowerCase())) {
    // PDF和图片文件：在新标签页查看
    window.open(fileUrl, '_blank')
  } else if (file.format === 'doc' || file.format === 'docx') {
    // DOC/DOCX文件：使用在线文档查看服务
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=false`
    window.open(viewerUrl, '_blank')
  } else {
    // 其他文件：执行下载操作
    downloadFile(file)
  }
}

// 处理文件下载
const downloadFile = async (file) => {
  // 调用点击统计API
  handleFileClickStats(file)
  
  // 构建完整的文件下载URL，使用代理解决跨域问题
  const downloadUrl = `/api/files/${file.file_path}`
  
  try {
    // 使用fetch API获取文件内容，确保所有文件类型都能被下载
    const response = await fetch(downloadUrl)
    if (!response.ok) {
      throw new Error('文件下载失败')
    }
    
    // 将文件内容转换为blob
    const blob = await response.blob()
    
    // 创建一个blob URL
    const blobUrl = window.URL.createObjectURL(blob)
    
    // 创建一个临时链接，触发文件下载
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = file.name // 使用文件名作为下载文件名
    link.target = '_blank' // 确保在新窗口打开，避免影响当前页面
    
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 释放blob URL资源
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl)
    }, 100)
    
    ElMessage.success(`正在下载文件: ${file.name}`)
  } catch (error) {
    console.error('文件下载失败:', error)
    ElMessage.error(`文件下载失败: ${error.message}`)
    
    // 失败时的备选方案
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = file.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// 处理文件删除
const handleDeleteFile = async (file) => {
  try {
    // 确认删除
    await ElMessageBox.confirm(
      `确定要删除文件 "${file.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 调用删除API
    await infoDeleteApi(file.id)
    
    // 刷新文件列表
    loadData()
    
    // 显示成功提示
    ElMessage.success(`文件 "${file.name}" 删除成功`)
  } catch (error) {
    // 用户取消删除
    if (error === 'cancel') {
      return
    }
    // 其他错误
    console.error('删除文件失败:', error)
    ElMessage.error('删除文件失败，请重试')
  }
}
</script>

<style scoped>
.file-list-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  height: auto;
  box-sizing: border-box;
}

.file-list-container h2 {
  margin-bottom: 16px;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: left;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
  padding-left: 12px;
}

.file-table-wrapper {
  overflow-x: auto;
  width: 100%;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  max-width: 100%;
}

.file-table-wrapper:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.file-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: none;
  min-width: 800px;
}

.file-table th, .file-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid #f0f2f5;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.file-table th {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  font-weight: 600;
  color: white;
  font-size: 14px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.file-table td {
  color: #606266;
  font-size: 14px;
  text-align: center;
  vertical-align: middle;
  font-weight: 500;
}

/* 设置操作列宽度自适应 */
.file-table th:last-child,
.file-table td:last-child {
  width: auto;
  white-space: nowrap;
  min-width: 120px;
  text-align: center;
  padding: 16px 10px;
}

.file-row {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid #f0f2f5;
  position: relative;
  background-color: white;
}

/* 偶数行背景 */
.file-row:nth-child(even) {
  background-color: #fafbfe;
}

/* 鼠标悬停效果 - 重点显示 */
.file-row:hover {
  background-color: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-left: 5px solid #409eff;
  z-index: 1;
  border-radius: 8px;
  margin: 0 8px;
}

/* 增强悬停时的文字显示 */
.file-row:hover td {
  color: #303133;
  font-weight: 600;
}

/* 格式徽章悬停效果 - 保持原有样式 */
.file-row:hover .format-badge {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.action-btn {
  padding: 8px 16px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0 4px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.25);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-btn:hover {
  background: linear-gradient(135deg, #85ce61 0%, #a0d911 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(103, 194, 58, 0.4);
}

.action-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

/* 下载按钮样式 */
.download-btn {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  margin-left: 4px;
}

/* 下载按钮悬停效果 */
.download-btn:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #91caff 100%);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

/* 删除按钮样式 */
.delete-btn {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
  margin-left: 4px;
}

/* 删除按钮悬停效果 */
.delete-btn:hover {
  background: linear-gradient(135deg, #f78989 0%, #ef4444 100%);
  box-shadow: 0 6px 16px rgba(245, 108, 108, 0.4);
}

/* 操作按钮容器 */
.file-row td:last-child {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 16px 10px;
}

/* 搜索和筛选区域 */
.search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 100%;
}

.search-section:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.search-left {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-select {
  padding: 10px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: white;
  min-width: 140px;
  font-weight: 500;
  color: #303133;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-select:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
  transform: translateY(-1px);
}

/* 格式选择下拉框样式 */
.format-select {
  min-width: 160px;
}

.search-input {
  padding: 10px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 10px;
  font-size: 14px;
  width: 300px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-input::placeholder {
  color: #909399;
  font-weight: 400;
}

/* 时间范围样式 */
.time-range {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: white;
  padding: 8px 12px;
  border-radius: 10px;
  border: 2px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.time-input {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  min-width: 140px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f5f7fa;
}

.time-input:focus {
  outline: none;
  background-color: white;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.time-separator {
  color: #606266;
  font-weight: 600;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
  transform: translateY(-1px);
}

.search-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.search-btn:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #91caff 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4);
}

.search-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.reset-btn {
  padding: 12px 24px;
  background-color: white;
  color: #606266;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reset-btn:hover {
  background-color: #f5f7fa;
  border-color: #409eff;
  color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.reset-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-right {
  display: flex;
  gap: 16px;
  align-items: center;
}

.add-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  box-shadow: 0 6px 16px rgba(103, 194, 58, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn::before {
  content: '+';
  font-size: 18px;
  font-weight: 700;
}

.add-btn:hover {
  background: linear-gradient(135deg, #85ce61 0%, #a0d911 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(103, 194, 58, 0.4);
}

.add-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

/* 刷新按钮样式 */
.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #bae6fd;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 20px;
  color: #0ea5e9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.refresh-btn:hover {
  background: linear-gradient(135deg, #bae6fd 0%, #7dd3fc 100%);
  border-color: #38bdf8;
  color: white;
  transform: rotate(180deg) scale(1.15);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
}

.refresh-btn:active {
  transform: rotate(180deg) scale(0.95);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.refresh-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
}

/* 空数据样式 */
.no-data {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e4e7ed;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 100%;
}

.pagination:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.pagination-info {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-info::before {
  content: "📋";
  font-size: 18px;
  -webkit-background-clip: none;
  -webkit-text-fill-color: #409eff;
  background-clip: none;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-size-select {
  padding: 10px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 10px;
  font-size: 13px;
  background-color: white;
  font-weight: 500;
  color: #303133;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-size-select:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
  transform: translateY(-1px);
}

.page-btn {
  padding: 10px 18px;
  background-color: white;
  border: 2px solid #e4e7ed;
  color: #606266;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 80px;
}

.page-btn:hover:not(:disabled) {
  background-color: #f5f7fa;
  border-color: #409eff;
  color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
}

.page-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.page-btn:disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
  opacity: 0.6;
}

.current-page {
  padding: 10px 20px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  min-width: 50px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.page-info {
  font-size: 13px;
  color: #606266;
  font-weight: 600;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-info::before {
  content: "📄";
  font-size: 18px;
  -webkit-background-clip: none;
  -webkit-text-fill-color: #67c23a;
  background-clip: none;
}

/* 文件名样式 */
.file-name {
  font-weight: 600;
  color: #303133;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 4px;
}

.file-name:hover {
  background-color: #f0f9eb;
  color: #67c23a;
  transform: scale(1.02);
}

/* 文件格式样式 */
.file-format {
  text-align: center;
  padding: 4px 8px;
}

/* 格式徽章样式 */
.format-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 24px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
}

/* 不同格式的特殊样式 */
.format-pdf {
  background: linear-gradient(135deg, #e91e63 0%, #f06292 100%);
}

.format-doc,
.format-docx {
  background-color: #2196f3;
}

.format-excel,
.format-xlsx,
.format-xls {
  background-color: #4caf50;
}

.format-mp4 {
  background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
}

.format-png, .format-jpg, .format-jpeg, .format-gif {
  background: linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%);
}

.format-zip,
.format-rar {
  background-color: #795548;
}

/* 默认格式样式 */
.format-badge:not([class*="format-"]) {
  background-color: #607d8b;
}

/* 悬停效果 */
.format-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 弹窗样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(59, 130, 246, 0.3) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
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

.dialog-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  overflow: hidden;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #e4e7ed;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border-radius: 20px 20px 0 0;
}

.dialog-header h3 {
  margin: 0;
  color: white;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
}

.dialog-header h3::before {
  content: "📁";
  font-size: 24px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-size: 24px;
  cursor: pointer;
  color: white;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(180deg) scale(1.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 表单样式 */
.add-file-form {
  padding: 20px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  color: #303133;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-item input,
.form-item textarea {
  width: 100%;
  padding: 10px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  color: #303133;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.form-item input:focus,
.form-item textarea:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
  background: white;
}

.form-item textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.5;
}

/* 文件上传样式 */
.file-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 文件上传区域 */
.file-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  border: 3px dashed #e4e7ed;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 120px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.file-upload-area:hover {
  border-color: #409eff;
  background: linear-gradient(135deg, #ecf5ff 0%, #e0f2fe 100%);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* 上传图标 */
.upload-icon {
  font-size: 40px;
  margin-bottom: 10px;
  color: #909399;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.file-upload-area:hover .upload-icon {
  color: #409eff;
  transform: scale(1.1) rotate(5deg);
}

/* 上传文字 */
.upload-text {
  font-size: 16px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 8px;
}

/* 上传提示 */
.upload-hint {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  max-width: 300px;
}

/* 选中文件显示 */
.file-name {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: linear-gradient(135deg, #ecf5ff 0%, #e0f2fe 100%);
  border: 2px solid #d9ecff;
  border-radius: 12px;
  color: #303133;
  font-size: 14px;
  word-break: break-all;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.file-name:hover {
  background: linear-gradient(135deg, #d9ecff 0%, #bae6fd 100%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  border-color: #409eff;
}

/* 文件图标 */
.file-icon {
  font-size: 20px;
  margin-right: 12px;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
}

/* 文件名文本 */
.file-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

/* 移除文件按钮 */
.remove-file {
  background: none;
  border: 2px solid #e4e7ed;
  font-size: 20px;
  cursor: pointer;
  color: #909399;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 12px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.remove-file:hover {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-color: #f56c6c;
  color: #f56c6c;
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.2);
}

/* 上传中遮罩 */
.uploading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  animation: fadeIn 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 上传中内容 */
.uploading-content {
  text-align: center;
  padding: 50px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  max-width: 350px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

/* 上传中旋转图标 */
.uploading-spinner {
  font-size: 72px;
  margin-bottom: 20px;
  animation: spin 1s linear infinite;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 上传中文本 */
.uploading-text {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

/* 上传中提示 */
.uploading-hint {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

/* 加载图标 */
.loading-icon {
  display: inline-block;
  margin-right: 10px;
  animation: spin 1s linear infinite;
}

/* 按钮禁用状态 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* 禁用按钮悬停效果 */
button:disabled:hover {
  background-color: inherit !important;
  border-color: inherit !important;
  color: inherit !important;
}

/* 表单按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.cancel-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%);
  color: #606266;
  border: 2px solid #e4e7ed;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
}

.cancel-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-color: #409eff;
  color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.2);
}

.cancel-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.submit-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 8px 24px rgba(103, 194, 58, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #85ce61 0%, #a0d911 100%);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(103, 194, 58, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 6px 16px rgba(103, 194, 58, 0.3);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .file-table {
    font-size: 13px;
  }
  
  .file-table th,
  .file-table td {
    padding: 8px 10px;
  }
  
  .search-section {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .search-left,
  .search-right {
    justify-content: center;
  }
  
  .pagination {
    flex-direction: column;
    gap: 15px;
  }
  
  .pagination-controls {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .search-left {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .search-input {
    width: 100%;
  }
}
</style>