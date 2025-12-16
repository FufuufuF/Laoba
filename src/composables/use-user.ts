// src/composables/useUser.ts
import { ref } from 'vue'
import { useUserStore, type UserInfo } from '@/stores/user' // 引入 Store
import { storeToRefs } from 'pinia' // 关键工具：解构 store 保持响应性

// 模拟 API 请求函数 (实际项目中你应该引入 api/auth.ts)
const mockLoginApi = (params: any) => {
  return new Promise<{ token: string; user: UserInfo }>((resolve, reject) => {
    setTimeout(() => {
      if (params.username === 'admin') {
        resolve({
          token: 'mock-token-123456',
          user: {
            id: '1',
            username: 'admin',
            nickname: '超级管理员',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            role: 'admin',
            bio: '我是系统的神'
          }
        })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 1000)
  })
}

export function useUser() {
  // 1. 获取 Store 实例
  const store = useUserStore()

  // 2. 解构数据 (Read-Only to Component)
  // ⚠️ 必须用 storeToRefs，否则解构出来的变量会失去响应性
  // 这样组件里直接用 isLoggedIn，而不用 store.isLoggedIn
  const { userInfo, isLoggedIn, displayName } = storeToRefs(store)

  // 3. 定义 UI 相关的状态 (Loading / Error)
  // 这些状态属于"交互"，不一定非要放进全局 Store，放在 hook 里正合适
  const isLoading = ref(false)
  const errorMsg = ref('')

  // 4. 业务逻辑 (Actions)
  const login = async (loginForm: { username: string; password: string }) => {
    isLoading.value = true
    errorMsg.value = ''

    try {
      // A. 调用 API
      const data = await mockLoginApi(loginForm)

      // B. 更新 Store (数据落地)
      store.setToken(data.token)
      store.setUserData(data.user)
      
      return true // 告诉组件操作成功
    } catch (e: any) {
      errorMsg.value = e.message || '登录失败，请重试'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    // 处理清理逻辑，比如清除本地缓存、断开 socket 等
    store.clearUser()
    // 甚至可以在这里处理路由跳转，或者让组件去跳
  }

  // 5. 暴露给组件的接口
  return {
    // Data (Refs)
    userInfo,
    isLoggedIn,
    displayName,
    
    // UI State
    isLoading,
    errorMsg,
    
    // Methods
    login,
    logout
  }
}