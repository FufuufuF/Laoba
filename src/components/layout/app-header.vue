<template>
  <div class="app-header">
    <div class="header-content">
      <!-- Logo Area -->
      <div class="logo" @click="goHome">
        <span class="logo-text">Campus Life</span>
      </div>

      <!-- Navigation Menu -->
      <div class="nav-menu">
        <el-menu
          mode="horizontal"
          :default-active="activeMenu"
          :ellipsis="false"
          class="header-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- Search Area -->
      <div class="search-container">
        <el-input
          v-model="searchText"
          placeholder="搜索动态、用户..."
          class="search-input"
          :prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- User Actions Area -->
      <div class="user-actions">
        <!-- Theme Toggle Button -->
        <el-button 
          text 
          :icon="isDark ? Sunny : Moon" 
          @click="toggleTheme"
          circle
          class="theme-toggle"
        />

        <!-- Not Logged In State -->
        <div v-if="!isLoggedIn" class="auth-buttons">
          <el-button link @click="goToLogin">登录</el-button>
        </div>
        
        <!-- Logged In State -->
        <div v-else class="user-profile">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <el-avatar 
                :size="32" 
                :src="userAvatar" 
              />
              <span class="username">{{ displayName }}</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  设置
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  Search, 
  ArrowDown, 
  House, 
  Compass, 
  User, 
  Setting, 
  SwitchButton,
  Moon,
  Sunny
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { logout as logoutApi } from '@/api/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const themeStore = useThemeStore()

const searchText = ref('')

// 主题切换
const { isDark, toggleTheme } = themeStore

// 使用真实的用户状态
const isLoggedIn = computed(() => userStore.isLoggedIn)
const displayName = computed(() => userStore.displayName)
const userAvatar = computed(() => 
  userStore.userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
)

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 导航到首页
const goHome = () => {
  router.push('/home')
}

// 导航到登录页
const goToLogin = () => {
  router.push('/login')
}

// 菜单选择处理
const handleMenuSelect = (index: string) => {
  router.push(index)
}

// 搜索处理
const handleSearch = () => {
  if (searchText.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchText.value.trim() }
    });
  }
}

// 下拉菜单命令处理
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      if (userStore.userInfo?.id) {
        router.push(`/user/${userStore.userInfo.id}`)
      }
      break
    case 'settings':
      router.push('/setting')
      break
    case 'logout':
      try {
        await logoutApi()
        userStore.logout()
        ElMessage({
          message: '已退出登录',
          type: 'success',
          showClose: true,
          duration: 2000
        })
        router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error)
        // 即使 API 调用失败，也清除本地状态
        userStore.logout()
        router.push('/login')
      }
      break
  }
}
</script>

<style scoped>
.app-header {
  height: 60px;
  border-bottom: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: var(--el-color-primary);
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 0.8;
}

.nav-menu {
  display: flex;
  align-items: center;
}

.header-menu {
  border-bottom: none;
  background-color: transparent;
}

.header-menu .el-menu-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.search-container {
  flex: 1;
  max-width: 300px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-toggle {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.theme-toggle:hover {
  transform: rotate(20deg);
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.user-profile {
  cursor: pointer;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-regular);
  outline: none;
}

.el-dropdown-link:hover {
  color: var(--el-color-primary);
}

.username {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 响应式隐藏导航菜单 */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .search-container {
    max-width: 200px;
  }
}
</style>
