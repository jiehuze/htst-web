import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import IndexView from '../views/IndexView.vue'
import SystemManage from '../views/SystemManage.vue'
import FileList from '../views/FileList.vue'
import VideoPlayer from '../views/VideoPlayer.vue'
import ExpertSupport from '../views/ExpertSupport.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        // 默认重定向到首页
        {
          path: '',
          redirect: 'index'
        },
        // 首页路由
        {
          path: 'index',
          name: 'index',
          component: IndexView,
          meta: { title: '首页' }
        },
        // 流程指引相关路由 - 所有子菜单都使用FileList组件
        {
          path: 'process/policy',
          name: 'process-policy',
          component: FileList,
          meta: { title: '政策与流程模块' }
        },
        {
          path: 'process/templates',
          name: 'process-templates',
          component: FileList,
          meta: { title: '工具模板库模块' }
        },
        {
          path: 'process/methodology',
          name: 'process-methodology',
          component: FileList,
          meta: { title: '方法论指导模块' }
        },
        {          path: 'process/experts',          name: 'process-experts',          component: ExpertSupport,          meta: { title: '专家支持' }        },
        {
          path: 'process/team',
          name: 'process-team',
          component: FileList,
          meta: { title: '团队职责模块' }
        },
        {
          path: 'process/training',
          name: 'process-training',
          component: FileList,
          meta: { title: '教学培训模块' }
        },
        // 信息同步相关路由 - 所有子菜单都使用FileList组件
        {
          path: 'info/projects',
          name: 'info-projects',
          component: FileList,
          meta: { title: '课题立项动态子板块' }
        },
        {
          path: 'info/academic',
          name: 'info-academic',
          component: FileList,
          meta: { title: '学术交流动态子板块' }
        },
        // 系统管理相关路由
        {
          path: 'system',
          name: 'system',
          component: SystemManage
        }
      ]
    },
    {
      path: '/video/:id',
      name: 'video',
      component: VideoPlayer
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  try {
    const token = localStorage.getItem('token')
    console.log('路由守卫:', to.name, 'token:', !!token)
    
    // 检查是否需要登录
    if (to.name !== 'login' && !token) {
      console.log('需要登录，重定向到登录页面')
      next({ name: 'login' })
    } else {
      console.log('允许访问')
      next()
    }
  } catch (error) {
    console.error('路由守卫错误:', error)
    next()
  }
})

export default router