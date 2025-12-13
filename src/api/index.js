// API服务层
import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/htst', // 使用相对路径，避免跨域问题
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // 允许携带凭证
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 导入Element Plus的ElMessage
import { ElMessage } from 'element-plus'

// 响应拦截器
api.interceptors.response.use(
  response => {
    const res = response.data
    
    // 检查返回的code值
    if (res.code !== 200) {
      // 非200状态码，显示错误信息
      ElMessage.error(res.msg || '操作失败')
      return Promise.reject(new Error(res.msg || '操作失败'))
    } else {
      // 200状态码，返回data中的内容
      return res.data
    }
  },
  error => {
    // 网络错误等其他错误
    ElMessage.error('网络错误，请稍后重试')
    return Promise.reject(error)
  }
)

// 登录API
export const loginApi = (username, password) => {
  return api.post('/users/login', {
    username,
    password
  })
}

// 获取用户列表API
export const getUsersListApi = (params = {}) => {
  return api.get('/users/list', { params })
}

// 添加用户API
export const createUserApi = (userData) => {
  return api.post('/users/create', userData)
}

// 删除用户API
export const deleteUserApi = (id) => {
  return api.delete(`/users/${id}`)
}

// 更新用户API
export const updateUserApi = (userData) => {
  return api.put('/users/update', userData)
}

// 获取信息列表API
export const infoListApi = (params = {}) => {
  return api.get('/info/list', { params })
}

// 增加信息API
export const infoAddApi = (formData) => {
  return api.post('/info/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除信息API
export const infoDeleteApi = (id) => {
  return api.delete(`/info/${id}`)
}

// 信息点击统计API
export const infoClickApi = (id) => {
  return api.get(`/info/click/${id}`)
}

export default api