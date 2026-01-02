<template>
  <div class="app-sidebar">
    <!-- User Info Card - Only show when logged in -->
    <div v-if="isLoggedIn" class="user-card" @click="goToProfile">
      <div class="user-header">
        <el-avatar :size="64" :src="userAvatar" />
        <div class="user-meta">
          <div class="nickname">{{ displayName }}</div>
          <div class="bio">{{ userBio }}</div>
        </div>
      </div>
      <div class="user-stats">
        <div class="stat-item" @click.stop="goToFollowList('following')">
          <div class="count">{{ userStats.following }}</div>
          <div class="label">关注</div>
        </div>
        <div class="stat-item" @click.stop="goToFollowList('followers')">
          <div class="count">{{ userStats.followers }}</div>
          <div class="label">粉丝</div>
        </div>
      </div>
    </div>

    <!-- Guest State Card -->
    <div v-else class="user-card guest-card">
      <div class="guest-content">
        <el-icon :size="32" class="guest-icon"><User /></el-icon>
        <p class="guest-text">登录后查看个人信息</p>
        <el-button type="primary" size="small" round @click="goToLogin">
          立即登录
        </el-button>
      </div>
    </div>

    <!-- Navigation Menu -->
    <el-menu
      :default-active="$route.path"
      class="nav-menu"
      router
    >
      <el-menu-item index="/home">
        <el-icon><HomeFilled /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item v-if="isLoggedIn" :index="profilePath">
        <el-icon><User /></el-icon>
        <span>我的</span>
      </el-menu-item>
      <el-menu-item v-if="isAdmin" index="/admin">
        <el-icon><Setting /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
    </el-menu>

    <!-- Create Post Button -->
    <div class="action-area">
        <el-button type="primary" size="large" round class="post-btn" @click="handleCreatePost">
            <el-icon class="el-icon--left"><Plus /></el-icon>
            分享新鲜事
        </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { HomeFilled, User, Plus, Setting } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { useLoginPrompt } from '@/composables/use-login-prompt';
import { apiClient } from '@/api/core/client';

const router = useRouter();
const userStore = useUserStore();
const { requireLogin } = useLoginPrompt();

// 用户状态
const isLoggedIn = computed(() => userStore.isLoggedIn);
const isAdmin = computed(() => userStore.userInfo?.role === 'admin');
const displayName = computed(() => userStore.displayName);
const userAvatar = computed(() => 
  userStore.userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
);
const userBio = computed(() => userStore.userInfo?.bio || '这个人很懒，什么都没写~');
const profilePath = computed(() => `/user/${userStore.userInfo?.id || ''}`);

// 用户统计数据
const userStats = ref({
  following: 0,
  followers: 0,
  likes: 0,
});

// 获取用户统计数据
const fetchUserStats = async () => {
  if (!isLoggedIn.value) return;
  
  try {
    const response = await apiClient.get<{
      code: number;
      data: {
        following_count: number;
        followers_count: number;
        likes_received: number;
      };
    }>('/api/v1/user/me');
    
    if (response.code === 0 && response.data) {
      userStats.value = {
        following: response.data.following_count || 0,
        followers: response.data.followers_count || 0,
        likes: response.data.likes_received || 0,
      };
    }
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
  }
};

// 初始化时获取数据
onMounted(fetchUserStats);

// 登录状态变化时重新获取
watch(isLoggedIn, (newVal) => {
  if (newVal) {
    fetchUserStats();
  } else {
    userStats.value = { following: 0, followers: 0, likes: 0 };
  }
});

// 跳转到个人主页
const goToProfile = () => {
  if (userStore.userInfo?.id) {
    router.push(`/user/${userStore.userInfo.id}`);
  }
};

// 跳转到登录页
const goToLogin = () => {
  router.push('/login');
};

// 跳转到关注/粉丝列表
const goToFollowList = (type: 'following' | 'followers') => {
  router.push(`/follow?type=${type}`);
};

// 发布动态（需要登录）
const handleCreatePost = async () => {
  const canProceed = await requireLogin(undefined, '请先登录后再发布动态');
  if (canProceed) {
    router.push('/post-create');
  }
};
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
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}

.user-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.guest-card {
  cursor: default;
}

.guest-card:hover {
  box-shadow: none;
  transform: none;
}

.guest-content {
  padding: 16px 0;
}

.guest-icon {
  color: var(--el-text-color-placeholder);
  margin-bottom: 8px;
}

.guest-text {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin: 8px 0 16px;
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

