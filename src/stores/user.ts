// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 保留原有接口，补充需要的字段（头像、简介、标签等）
export interface UserInfo {
  id: string
  username: string // 学号（复用username字段，避免改太多）
  avatar: string
  nickname: string
  bio?: string // 个人简介（对应之前的intro）
  role: 'student' | 'admin'
  tags?: string[] // 新增：兴趣标签
  isForbidden?: boolean // 新增：是否被封禁
}

export const useUserStore = defineStore('user', () => {
  // --- 保留原有 State ---
  const token = ref<string | null>(localStorage.getItem('token') || null)
  const userInfo = ref<UserInfo | null>(null)

  // --- 新增 State（登录/注册需要的交互） ---
  const rememberMe = ref<boolean>(localStorage.getItem('rememberMe') === 'true') // 记住我
  const showPwd = ref<boolean>(false) // 密码是否可见

  // --- 保留原有 Getters ---
  const isLoggedIn = computed(() => !!token.value)
  const displayName = computed(() => userInfo.value?.nickname || userInfo.value?.username || '游客')

  // --- 保留原有 Actions + 新增 Actions ---
  // 1. 保留原有：设置token
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 2. 保留原有：设置用户信息
  function setUserData(data: UserInfo) {
    userInfo.value = data
    // 记住我：同步存储用户信息到本地
    if (rememberMe.value) {
      localStorage.setItem('userInfo', JSON.stringify(data))
    } else {
      sessionStorage.setItem('userInfo', JSON.stringify(data))
    }
  }

  // 3. 保留原有：清空用户信息
  function clearUser() {
    token.value = null
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('rememberMe')
    sessionStorage.removeItem('userInfo')
  }

  // 4. 新增：编辑个人信息
  function editUserInfo(newInfo: Partial<UserInfo>) {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...newInfo }
      // 同步更新本地存储
      if (rememberMe.value) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      } else {
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      }
    }
  }

  // 5. 新增：初始化用户状态（页面刷新恢复）
  function initUser() {
    // 恢复“记住我”状态
    rememberMe.value = localStorage.getItem('rememberMe') === 'true'
    // 恢复用户信息
    const storedUser = rememberMe.value 
      ? localStorage.getItem('userInfo') 
      : sessionStorage.getItem('userInfo')
    
    if (storedUser) {
      userInfo.value = JSON.parse(storedUser)
      // 若原有token丢失，补一个临时token（避免isLoggedIn为false）
      if (!token.value) {
        token.value = 'temp-token-' + Date.now()
        localStorage.setItem('token', token.value)
      }
    }
  }

  // 6. 新增：登录（整合token+用户信息）
  function login(userData: UserInfo, autoToken = true) {
    // 自动生成临时token（真实项目替换为后端返回的token）
    if (autoToken) {
      const newToken = 'token-' + userData.username + '-' + Date.now()
      setToken(newToken)
    }
    // 存储用户信息
    setUserData(userData)
  }

  // 7. 新增：退出登录（复用clearUser）
  function logout() {
    clearUser()
    rememberMe.value = false
    showPwd.value = false
  }

  return {
    // 原有导出
    token,
    userInfo,
    isLoggedIn,
    displayName,
    setToken,
    setUserData,
    clearUser,
    // 新增导出
    rememberMe,
    showPwd,
    editUserInfo,
    initUser,
    login,
    logout
  }
})