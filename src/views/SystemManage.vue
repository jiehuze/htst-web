<template>
  <div class="system-manage-container">
    <h2>系统管理</h2>
    
    <!-- 标签页切换 -->
    <div class="tabs">
      <button 
        class="tab-btn"
        :class="{ active: activeTab === 'users' }"
        @click="activeTab = 'users'"
      >
        用户管理
      </button>
      <button 
        class="tab-btn"
        :class="{ active: activeTab === 'roles' }"
        @click="activeTab = 'roles'"
      >
        角色管理
      </button>
    </div>
    
    <!-- 用户管理 -->
    <div v-if="activeTab === 'users'" class="tab-content">
      <!-- 添加用户表单 -->
      <div class="add-user-section">
        <div class="section-header">
          <h3>添加用户</h3>
          <button 
            class="toggle-btn"
            @click="toggleAddUserForm"
            title="{{ isAddUserFormCollapsed ? '展开添加用户表单' : '折叠添加用户表单' }}"
          >
            {{ isAddUserFormCollapsed ? '▼' : '▲' }}
          </button>
        </div>
        
        <div 
          class="form-container"
          :class="{ collapsed: isAddUserFormCollapsed }"
        >
          <form @submit.prevent="handleAddUser" class="add-user-form">
            <div class="form-row">
              <div class="form-item">
                <label for="newUsername">用户名</label>
                <input 
                  type="text" 
                  id="newUsername" 
                  v-model="newUser.username" 
                  placeholder="请输入用户名" 
                  required
                >
              </div>
              <div class="form-item password-field">
                <label for="newPassword">密码</label>
                <div class="password-input-wrapper">
                  <input 
                    :type="isNewPasswordVisible ? 'text' : 'password'" 
                    id="newPassword" 
                    v-model="newUser.password" 
                    placeholder="请输入密码，不少于6位" 
                    required
                    minlength="6"
                    pattern=".{6,}"
                    title="密码长度不能少于6位"
                  >
                  <button 
                    type="button" 
                    class="password-toggle-btn"
                    @click="toggleNewPasswordVisibility"
                    title="{{ isNewPasswordVisible ? '隐藏密码' : '显示密码' }}"
                  >
                    {{ isNewPasswordVisible ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
              </div>
              <div class="form-item">
                <label for="newRole">角色</label>
                <select 
                  id="newRole" 
                  v-model="newUser.roles" 
                  required
                >
                  <option value="admin">管理员</option>
                  <option value="user">普通用户</option>
                </select>
              </div>
              <div class="form-item">
                <label for="newDescription">用户描述</label>
                <input 
                  type="text" 
                  id="newDescription" 
                  v-model="newUser.description" 
                  placeholder="请输入用户描述"
                >
              </div>
              <div class="form-item form-actions">
                <button type="submit" class="add-btn">添加用户</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <!-- 用户列表 -->
      <div class="user-list-section">
        <div class="user-list-header">
          <h3>用户列表</h3>
          <div class="user-list-actions">
            <button 
              class="refresh-btn"
              @click="fetchUsers"
              title="刷新用户列表"
            >
              🔄
            </button>
            <div class="user-count">共 {{ totalUsers }} 条记录</div>
          </div>
        </div>
        <table class="user-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>用户名</th>
              <th>角色</th>
              <th>描述</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.id">
              <td>{{ index + 1 }}</td>
              <td>{{ user.username }}</td>
              <td>
                <span 
                  class="role-tag" 
                  :class="user.roles === 'admin' ? 'role-admin' : 'role-user'"
                >
                  {{ user.roles === 'admin' ? '管理员' : '普通用户' }}
                </span>
              </td>
              <td>{{ user.description || '-' }}</td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td class="user-actions">
                <button 
                  class="edit-btn"
                  @click="openEditModal(user)"
                >
                  编辑
                </button>
                <!-- 非admin用户显示删除按钮 -->
                <button 
                  v-if="user.username !== 'admin'"
                  class="delete-btn"
                  @click="handleDeleteUser(user.id)"
                >
                  删除
                </button>
              </td>
            </tr>
            <!-- 无数据提示 -->
            <tr v-if="users.length === 0">
              <td colspan="6" class="no-data">暂无数据</td>
            </tr>
          </tbody>
        </table>
        
        <!-- 分页控件 -->
        <div class="pagination" v-if="totalUsers > 0">
          <div class="pagination-info">
            <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
          </div>
          <div class="pagination-controls">
            <button 
              class="page-btn"
              :disabled="currentPage === 1"
              @click="goToPage(1)"
            >
              首页
            </button>
            <button 
              class="page-btn"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              上一页
            </button>
            <button 
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              下一页
            </button>
            <button 
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(totalPages)"
            >
              末页
            </button>
          </div>
          <div class="page-size-selector">
            <label for="pageSize">每页显示：</label>
            <select 
              id="pageSize"
              v-model="pageSize"
              @change="onPageSizeChange"
            >
              <option value="10">10条</option>
              <option value="20">20条</option>
              <option value="50">50条</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 角色管理 -->
    <div v-else class="tab-content">
      <h3>角色管理</h3>
      <div class="role-list">
        <div v-for="role in roles" :key="role.id" class="role-item">
          <div class="role-info">
            <h4>{{ role.name }}</h4>
            <p>{{ role.description }}</p>
          </div>
          <div class="role-actions">
            <button class="edit-btn" disabled>编辑权限</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 编辑用户弹窗 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑用户</h3>
          <button class="close-btn" @click="closeEditModal">×</button>
        </div>
        <form @submit.prevent="handleUpdateUser" class="edit-user-form">
          <div class="form-item">
            <label for="editUsername">用户名</label>
            <input 
              type="text" 
              id="editUsername" 
              v-model="editingUser.username" 
              disabled
            >
          </div>
          <div class="form-item password-field">
            <label for="editPassword">新密码（可选）</label>
            <div class="password-input-wrapper">
              <input 
                :type="isEditPasswordVisible ? 'text' : 'password'" 
                id="editPassword" 
                v-model="editingUser.password" 
                placeholder="留空则不修改密码，修改则不少于6位"
                minlength="6"
                pattern=".{6,}"
                title="密码长度不能少于6位"
              >
              <button 
                type="button" 
                class="password-toggle-btn"
                @click="toggleEditPasswordVisibility"
                title="{{ isEditPasswordVisible ? '隐藏密码' : '显示密码' }}"
              >
                {{ isEditPasswordVisible ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          <div class="form-item">
            <label for="editRole">角色</label>
            <select 
              id="editRole" 
              v-model="editingUser.roles" 
              required
            >
              <option value="admin">管理员</option>
              <option value="user">普通用户</option>
            </select>
          </div>
          <div class="form-item">
            <label for="editDescription">用户描述</label>
            <input 
              type="text" 
              id="editDescription" 
              v-model="editingUser.description" 
              placeholder="请输入用户描述"
            >
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeEditModal">取消</button>
            <button type="submit" class="save-btn">保存</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsersListApi, createUserApi, deleteUserApi, updateUserApi } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'

// 标签页
const activeTab = ref('users')

// 用户数据
const users = ref([])
// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)
const totalPages = ref(1)

// 获取用户列表
const fetchUsers = async () => {
  try {
    // 调用API获取用户列表，传递分页参数
    const response = await getUsersListApi({
      page: currentPage.value,
      page_size: pageSize.value
    })
    
    // 处理API返回的数据格式
    users.value = response.list || []
    totalUsers.value = response.total || 0
    totalPages.value = Math.ceil(totalUsers.value / pageSize.value)
    
    console.log('获取用户列表成功:', users.value)
    console.log('分页信息:', { page: response.page, page_size: response.page_size, total: response.total })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    // 显示错误提示
    if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('获取用户列表失败，请重试')
    }
  }
}

// 页面加载时获取用户列表
onMounted(() => {
  fetchUsers()
})

// 角色数据
const roles = ref([
  {
    id: 1,
    name: '管理员',
    description: '拥有全部系统权限',
    permissions: ['read', 'write', 'delete', 'manage']
  },
  {
    id: 2,
    name: '普通用户',
    description: '仅拥有查看权限',
    permissions: ['read']
  }
])

// 新用户表单
const newUser = ref({
  username: '',
  password: '',
  roles: 'user',
  description: ''
})

// 添加用户表单折叠状态
const isAddUserFormCollapsed = ref(true)

// 切换添加用户表单折叠状态
const toggleAddUserForm = () => {
  isAddUserFormCollapsed.value = !isAddUserFormCollapsed.value
}

// 密码显示状态
const isNewPasswordVisible = ref(false)
const isEditPasswordVisible = ref(false)

// 切换新密码显示状态
const toggleNewPasswordVisibility = () => {
  isNewPasswordVisible.value = !isNewPasswordVisible.value
}

// 切换编辑密码显示状态
const toggleEditPasswordVisibility = () => {
  isEditPasswordVisible.value = !isEditPasswordVisible.value
}

// 编辑用户相关
const showEditModal = ref(false)
const editingUser = ref({})

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 添加用户
const handleAddUser = async () => {
  try {
    // 调用API添加用户
    await createUserApi({
      username: newUser.value.username,
      password: newUser.value.password,
      roles: newUser.value.role,
      status: 1,
      description: `${newUser.value.username}的用户描述`
    })
    
    // 重新获取用户列表
    await fetchUsers()
    
    // 重置表单
    newUser.value = {
      username: '',
      password: '',
      role: 'user'
    }
    
    // 显示成功提示
    ElMessage.success('添加用户成功')
  } catch (error) {
    console.error('添加用户失败:', error)
    // 显示错误提示，包含具体失败原因
    if (error.message) {
      ElMessage.error(`添加用户失败: ${error.message}`)
    } else {
      ElMessage.error('添加用户失败，请重试')
    }
  }
}

// 打开编辑弹窗
const openEditModal = (user) => {
  // 复制用户数据，但不包含密码字段
  const userCopy = JSON.parse(JSON.stringify(user))
  delete userCopy.password
  editingUser.value = userCopy
  showEditModal.value = true
}

// 关闭编辑弹窗
const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = {}
}

// 更新用户
const handleUpdateUser = async () => {
  try {
    // 准备更新数据，过滤掉空值字段
    const updateData = {}
    
    // 必须包含id字段
    updateData.id = editingUser.value.id
    
    // 只添加有值的字段
    if (editingUser.value.username) {
      updateData.username = editingUser.value.username
    }
    
    // 密码为空则不更新
    if (editingUser.value.password) {
      updateData.password = editingUser.value.password
    }
    
    if (editingUser.value.roles) {
      updateData.roles = editingUser.value.roles
    }
    
    if (editingUser.value.status !== undefined) {
      updateData.status = editingUser.value.status
    }
    
    if (editingUser.value.description) {
      updateData.description = editingUser.value.description
    }
    
    // 调用更新用户API
    await updateUserApi(updateData)
    
    // 更新成功后重新获取用户列表
    await fetchUsers()
    
    // 关闭编辑弹窗
    closeEditModal()
    
    // 显示更新成功提示
    ElMessage.success('用户更新成功')
  } catch (error) {
    console.error('更新用户失败:', error)
    // 显示错误提示
    if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('更新用户失败，请重试')
    }
  }
}

// 删除用户
const handleDeleteUser = async (id) => {
  try {
    // 查找要删除的用户信息
    const user = users.value.find(u => u.id === id)
    
    // 检查是否是admin用户，不允许删除
    if (user && user.username === 'admin') {
      ElMessage.warning('管理员用户不允许删除')
      return
    }
    
    const username = user ? user.username : '未知用户'
    
    // 使用Element Plus的确认弹窗，显示要删除的用户信息，优化样式配置
    await ElMessageBox.confirm(
      `<div style="text-align: center; padding: 10px 0;"><strong>确定要删除用户 "${username}" 吗？</strong></div>`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true,
        confirmButtonClass: 'el-button--danger',
        cancelButtonClass: 'el-button--default',
        customClass: 'custom-confirm-modal'
      }
    )
    
    // 调用删除用户API
    await deleteUserApi(id)
    
    // 删除成功后重新获取用户列表
    await fetchUsers()
    
    // 显示删除成功提示
    ElMessage.success(`用户 "${username}" 删除成功`)
  } catch (error) {
    // 如果用户取消操作，不显示错误提示
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      // 显示错误提示
      if (error.message) {
        ElMessage.error(error.message)
      } else {
        ElMessage.error('删除用户失败，请重试')
      }
    }
  }
}

// 跳转到指定页面
const goToPage = (page) => {
  // 确保页码在有效范围内
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchUsers()
  }
}

// 每页显示条数改变
const onPageSizeChange = () => {
  // 重置到第一页
  currentPage.value = 1
  fetchUsers()
}
</script>

<style scoped>
.system-manage-container {
  width: 100%;
}

.system-manage-container h2 {
  margin-bottom: 24px;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 标签页 */
.tabs {
  display: flex;
  margin-bottom: 0;
  border-bottom: 2px solid #e4e7ed;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 0 20px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  padding: 14px 28px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 15px;
  color: #606266;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  margin-right: 4px;
  position: relative;
  z-index: 1;
}

.tab-btn.active {
  color: white;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  border-bottom-color: transparent;
  transform: translateY(-2px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.tab-content {
  margin-top: 0;
  background-color: white;
  padding: 24px;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e4e7ed;
  border-top: none;
}

/* 添加用户区域 */
.add-user-section {
  margin-bottom: 30px;
  background: linear-gradient(135deg, white 0%, #f8fafc 100%);
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

/* 折叠功能相关样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 28px;
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 50%, #67c23a 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px 8px 0 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.section-header:hover {
  background: linear-gradient(90deg, #66b1ff 0%, #7dd3fc 50%, #85ce61 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.section-header h3 {
  margin: 0;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-header h3::before {
  background-color: white;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  backdrop-filter: blur(10px);
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.2) rotate(90deg);
  border-color: rgba(255, 255, 255, 0.5);
}

.toggle-btn:active {
  transform: scale(0.95);
}

.form-container {
  padding: 25px;
  max-height: 500px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.form-container.collapsed {
  padding: 0;
  max-height: 0;
  opacity: 0;
  visibility: hidden;
}

.add-user-form {
  margin-top: 0;
}

.add-user-section:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.add-user-section h3 {
  margin-bottom: 20px;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-user-section h3::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background-color: #409eff;
  border-radius: 2px;
}

.add-user-form {
  margin-top: 20px;
}

.form-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: end;
  max-width: 100%;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 240px;
  flex: 1;
}

.form-item label {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-item label::after {
  content: '*';
  color: #f56c6c;
  margin-left: 4px;
}

.form-item:last-of-type label::after,
.form-item:nth-last-of-type(2) label::after {
  content: '';
}

.form-item input,
.form-item select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: white;
  height: 42px;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 密码字段样式 */
.password-field .password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.password-field input {
  padding-right: 52px;
  border-radius: 8px 0 0 8px;
  border-right: none;
  width: 100%;
  border: 2px solid #e2e8f0;
  height: 42px;
}

.password-toggle-btn {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 42px;
  background: white;
  border: 2px solid #e2e8f0;
  border-left: none;
  color: #909399;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  border-radius: 0 8px 8px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.password-toggle-btn:hover {
  color: #409eff;
  background-color: #f0f9ff;
  border-color: #c6e2ff;
}

.password-toggle-btn:active {
  background-color: #ecf5ff;
  transform: scale(0.98);
}

/* 确保聚焦时的样式协调 */
.password-field input:focus {
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1), 0 0 0 1px rgba(64, 158, 255, 0.3);
}

.password-field input:focus + .password-toggle-btn {
  border-color: #409eff;
  background-color: #f0f9ff;
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.3);
}

.form-item input:focus,
.form-item select:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.12), 0 4px 12px rgba(64, 158, 255, 0.15);
  background-color: white;
  transform: translateY(-1px);
}

.form-item input::placeholder,
.form-item select::placeholder {
  color: #c0c4cc;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  min-width: 120px;
}

.add-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 600;
  height: 42px;
  box-sizing: border-box;
  box-shadow: 0 3px 12px rgba(64, 158, 255, 0.3);
  min-width: 100px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.add-btn:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #7dd3fc 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.45);
}

.add-btn:active {
  transform: translateY(0);
}

.add-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

/* 美化添加用户区域的整体视觉效果 */
.add-user-section {
  position: relative;
  overflow: hidden;
}

.add-user-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  border-radius: 8px 8px 0 0;
}

/* 用户列表 */
.user-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-list-section h3 {
  margin-bottom: 0;
  color: #333;
  font-size: 18px;
}

.user-list-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-count {
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #bae6fd;
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #bae6fd;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 18px;
  color: #0ea5e9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.refresh-btn:hover {
  background: linear-gradient(135deg, #bae6fd 0%, #7dd3fc 100%);
  border-color: #38bdf8;
  color: white;
  transform: rotate(180deg) scale(1.1);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.refresh-btn:active {
  transform: rotate(180deg) scale(0.95);
}

.refresh-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
}

/* 无数据提示 */
.no-data {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}

/* 角色标签样式 */
.role-tag {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 24px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* 管理员角色样式 */
.role-admin {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border: 1px solid #409eff;
  box-shadow: 0 3px 6px rgba(64, 158, 255, 0.3);
}

/* 普通用户角色样式 */
.role-user {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  border: 1px solid #67c23a;
  box-shadow: 0 3px 6px rgba(103, 194, 58, 0.3);
}

/* 角色标签悬停效果 */
.role-tag:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 20px 0;
  border-top: 1px solid #e4e7ed;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 0 0 10px 10px;
  margin: 24px -24px -24px -24px;
  padding-left: 24px;
  padding-right: 24px;
}

.pagination-info {
  color: #606266;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.page-btn {
  padding: 8px 14px;
  background-color: white;
  color: #606266;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-btn:hover:not(:disabled) {
  background-color: #f0f9ff;
  color: #409eff;
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.2);
}

.page-btn:disabled {
  background-color: #f5f7fa;
  color: #c0c4cc;
  border-color: #e4e7ed;
  cursor: not-allowed;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
}

.page-size-selector select {
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: white;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-size-selector select:hover {
  border-color: #c6e2ff;
}

.page-size-selector select:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.user-table th,
.user-table td {
  padding: 14px 16px;
  text-align: center;
  border-bottom: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.user-table th {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  font-weight: 600;
  color: white;
  font-size: 14px;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.user-table td {
  color: #606266;
  font-size: 14px;
  vertical-align: middle;
  transition: all 0.3s ease;
}

.user-row {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-left: 4px solid transparent;
}

.user-row:hover {
  background-color: #f0f9ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #409eff;
  z-index: 1;
}

.user-row:hover td {
  color: #303133;
  font-weight: 500;
}

.user-actions {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.edit-btn {
  padding: 6px 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0 2px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-btn:hover {
  background-color: #66b1ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.3);
}

.edit-btn:active {
  transform: translateY(0);
}

/* 禁用状态的编辑按钮样式 */
.edit-btn:disabled {
  background-color: #e4e7ed;
  color: #c0c4cc;
  border-color: #dcdfe6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.edit-btn:disabled:hover {
  background-color: #e4e7ed;
  transform: none;
  box-shadow: none;
}

.delete-btn {
  padding: 6px 12px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0 2px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
  background-color: #f78989;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(245, 108, 108, 0.3);
}

.delete-btn:active {
  transform: translateY(0);
}

/* 角色管理 */
.role-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.role-item {
  padding: 24px;
  background: linear-gradient(135deg, white 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.role-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: #409eff;
}

.role-info h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.role-info p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: linear-gradient(135deg, white 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 28px;
  width: 90%;
  max-width: 550px;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-40px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.modal-header h3 {
  margin: 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-header h3::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 20px;
  background-color: #409eff;
  border-radius: 2px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #909399;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #f5f7fa;
  color: #606266;
  transform: rotate(90deg);
}

.edit-user-form {
  margin-top: 16px;
}

.edit-user-form .form-item {
  margin-bottom: 24px;
  gap: 10px;
}

.edit-user-form .form-item label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.edit-user-form .form-item label::after {
  content: '*';
  color: #f56c6c;
  margin-left: 4px;
}

.edit-user-form .form-item:nth-of-type(1) label::after,
.edit-user-form .form-item:nth-of-type(2) label::after {
  content: '';
}

.edit-user-form .form-item input,
.edit-user-form .form-item select {
  padding: 10px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: white;
  height: 40px;
  box-sizing: border-box;
}

.edit-user-form .form-item input:focus,
.edit-user-form .form-item select:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
  background-color: #f0f9ff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.cancel-btn,
.save-btn {
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  box-sizing: border-box;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: #606266;
  border: 2px solid #cbd5e1;
  font-weight: 600;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  border-color: #409eff;
  color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.2);
}

.save-btn {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  border: none;
  box-shadow: 0 3px 12px rgba(64, 158, 255, 0.3);
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.save-btn:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #7dd3fc 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.45);
}

.save-btn:active {
  transform: translateY(0);
}

.save-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}
/* 自定义确认弹窗样式 */
:deep(.custom-confirm-modal .el-message-box__header) {
  background: linear-gradient(90deg, #f56c6c, #e6a23c);
  border-radius: 8px 8px 0 0;
  padding: 16px 20px;
}

:deep(.custom-confirm-modal .el-message-box__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

:deep(.custom-confirm-modal .el-message-box__close) {
  color: white;
  font-size: 24px;
  opacity: 0.8;
}

:deep(.custom-confirm-modal .el-message-box__close:hover) {
  opacity: 1;
}

:deep(.custom-confirm-modal .el-message-box__content) {
  padding: 24px;
  font-size: 16px;
}

:deep(.custom-confirm-modal .el-message-box__btns) {
  padding: 16px 20px;
  background-color: #fafafa;
  border-radius: 0 0 8px 8px;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.custom-confirm-modal .el-button--danger) {
  background-color: #f56c6c;
  border-color: #f56c6c;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.custom-confirm-modal .el-button--danger:hover) {
  background-color: #f78989;
  border-color: #f78989;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
}

:deep(.custom-confirm-modal .el-button--default) {
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.custom-confirm-modal .el-button--default:hover) {
  background-color: #f5f7fa;
  border-color: #c6e2ff;
  color: #409eff;
  transform: translateY(-2px);
}
</style>