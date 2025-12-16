<template>
  <div class="app-sidebar">
    <!-- User Info Card (Mock Data) -->
    <div class="user-card">
      <div class="user-header">
        <el-avatar :size="64" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <div class="user-meta">
          <div class="nickname">User123</div>
          <div class="bio">热爱生活，热爱编程</div>
        </div>
      </div>
      <div class="user-stats">
        <div class="stat-item">
          <div class="count">128</div>
          <div class="label">关注</div>
        </div>
        <div class="stat-item">
          <div class="count">320</div>
          <div class="label">粉丝</div>
        </div>
        <div class="stat-item">
          <div class="count">1.2k</div>
          <div class="label">获赞</div>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <el-menu
      default-active="/"
      class="nav-menu"
    >
      <el-menu-item>
        <el-icon><HomeFilled /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item>
        <el-icon><ChatDotRound /></el-icon>
        <span>消息</span>
      </el-menu-item>
      <el-menu-item>
        <el-icon><User /></el-icon>
        <span>我的</span>
      </el-menu-item>
    </el-menu>

    <!-- Create Post Button -->
    <div class="action-area">
        <el-button type="primary" size="large" round class="post-btn">
            <el-icon class="el-icon--left"><Plus /></el-icon>
            分享新鲜事
        </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HomeFilled, ChatDotRound, User, Plus } from '@element-plus/icons-vue'
</script>

<style scoped>
.app-sidebar {
  width: 100%;
}

.user-card {
  padding: 20px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid var(--el-border-color-light);
}

.user-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.nickname {
  font-size: 18px;
  font-weight: 600;
  margin-top: 10px;
  color: var(--el-text-color-primary);
}

.bio {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.stat-item {
  cursor: pointer;
}

.stat-item:hover .count {
    color: var(--el-color-primary);
}

.count {
  font-size: 16px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.nav-menu {
  border-right: none;
  background-color: transparent;
  margin-bottom: 20px;
}

:deep(.el-menu-item) {
    border-radius: 8px;
    margin-bottom: 4px;
}
:deep(.el-menu-item.is-active) {
    background-color: var(--el-color-primary-light-9);
    font-weight: bold;
}
/* Dark mode adjustment for active item if needed, though Element Plus handles it well usually */
:deep(.dark .el-menu-item.is-active) {
    background-color: var(--el-color-primary-dark-2);
}

.action-area {
    padding: 0 10px;
}

.post-btn {
    width: 100%;
    font-weight: bold;
}
</style>

