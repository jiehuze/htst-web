import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: localStorage.getItem('token') || null,
    menuList: [
      {
        id: 0,
        name: '首页',
        icon: '🏠',
        path: '/home/index'
      },
      {
        id: 1,
        name: '流程指引',
        icon: '📋',
        path: '/home/process/policy',
        children: [
          {
            id: 11,
            name: '政策与流程模块',
            path: '/home/process/policy',
            type: '0101'
          },
          {
            id: 12,
            name: '工具模板库模块',
            path: '/home/process/templates',
            type: '0102'
          },
          {
            id: 13,
            name: '方法论指导模块',
            path: '/home/process/methodology',
            type: '0103'
          },
          {
            id: 14,
            name: '专家支持模块',
            path: '/home/process/experts',
            type: '0104'
          },
          {
            id: 15,
            name: '团队职责模块',
            path: '/home/process/team',
            type: '0105'
          },
          {
            id: 16,
            name: '教学培训模块',
            path: '/home/process/training',
            type: '0106'
          }
        ]
      },
      {
        id: 2,
        name: '信息同步',
        icon: '📢',
        path: '/home/info/projects',
        children: [
          {
            id: 21,
            name: '课题立项动态子板块',
            path: '/home/info/projects',
            type: '0201'
          },
          {
            id: 22,
            name: '学术交流动态子板块',
            path: '/home/info/academic',
            type: '0202'
          }
        ]
      },
      {
        id: 3,
        name: '系统管理',
        icon: '⚙️',
        path: '/home/system',
        children: [
          {
            id: 31,
            name: '用户管理',
            path: '/home/system'
          }
        ]
      }
    ]
  }),
  actions: {
    login(token, userInfo) {
      this.token = token
      this.userInfo = userInfo
      localStorage.setItem('token', token)
      localStorage.setItem('userinfo', JSON.stringify(userInfo))
    },
    logout() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userinfo')
    },
    loadUserInfo() {
      const userInfo = localStorage.getItem('userinfo')
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo)
      }
    }
  }
})