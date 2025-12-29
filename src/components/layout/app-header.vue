<template>
  <div class="app-header">
    <div class="header-content">
      <!-- Logo Area -->
      <div class="logo">
        <span class="logo-text">Campus Life</span>
      </div>

      <!-- Search Area -->
      <div class="search-container">
        <el-input
          v-model="searchText"
          placeholder="搜索动态、用户..."
          class="search-input"
          :prefix-icon="Search"
          clearable
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
        
        <!-- Not Logged In State (Mock logic) -->
        <div v-if="!isLogin" class="auth-buttons">
            <el-button link>登录</el-button>
            <el-button type="primary" round>注册</el-button>
        </div>
        
        <!-- Logged In State (Mock logic) -->
        <div v-else class="user-profile">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <span class="username">User123</span>
                    <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, ArrowDown, Moon, Sunny } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const searchText = ref('')
const isLogin = ref(true) // Mock login state
const themeStore = useThemeStore()
const { isDark, toggleTheme } = themeStore
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
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: var(--el-color-primary);
  cursor: pointer;
}

.search-container {
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
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
}
</style>

