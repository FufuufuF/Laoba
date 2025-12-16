// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: string
  username: string
  avatar: string
  nickname: string
  bio?: string
  role: 'student' | 'admin'
}

export const useUserStore = defineStore('user', () => {
  // --- State ---
  const token = ref<string | null>(localStorage.getItem('token') || null)
  const userInfo = ref<UserInfo | null>(null)

  // --- Getters ---
  const isLoggedIn = computed(() => !!token.value)
  const displayName = computed(() => userInfo.value?.nickname || userInfo.value?.username || '游客')

  // --- Actions (只负责同步更新状态，不处理 API 调用) ---
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUserData(data: UserInfo) {
    userInfo.value = data
  }

  function clearUser() {
    token.value = null
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return { token, userInfo, isLoggedIn, displayName, setToken, setUserData, clearUser }
})