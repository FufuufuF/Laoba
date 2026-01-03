<template>
  <div class="follow-page">
    <el-page-header @back="$router.back()" class="page-header">
      <template #content>
        <span class="page-title">{{ pageTitle }}</span>
      </template>
    </el-page-header>

    <div class="user-list" v-loading="isLoading">
      <!-- 空状态 -->
      <el-empty 
        v-if="!isLoading && list.length === 0" 
        :description="emptyText" 
      />

      <!-- 用户列表 -->
      <div
        v-for="user in list"
        :key="user.id"
        class="user-item"
        @click="goToUserProfile(user.id)"
      >
        <el-avatar 
          :size="48" 
          :src="user.avatar || defaultAvatar" 
          class="user-avatar"
        />
        <div class="user-info">
          <div class="nickname">{{ user.nickname || '未设置昵称' }}</div>
          <div class="bio">{{ user.bio || '这个人很懒，什么都没写~' }}</div>
        </div>
        <el-button
          v-if="showFollowButton(user)"
          :type="user.is_following ? 'default' : 'primary'"
          size="small"
          round
          @click.stop="handleToggleFollow(user.id)"
        >
          {{ user.is_following ? '已关注' : '关注' }}
        </el-button>
      </div>

      <!-- 加载更多 -->
      <div v-if="list.length > 0" class="load-more">
        <el-button 
          v-if="hasMore" 
          :loading="isLoading" 
          text 
          @click="loadMore"
        >
          {{ isLoading ? '加载中...' : '加载更多' }}
        </el-button>
        <span v-else class="no-more">没有更多了</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFollowList } from './composables/use-follow-list';
import { useUserStore } from '@/stores/user';
import type { FollowUserItem } from './api';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 从 query 获取类型，默认为 following
const listType = computed(() => {
  const type = route.query.type as string;
  return type === 'followers' ? 'followers' : 'following';
});

// 获取当前用户 ID（侧边栏点击时默认显示自己的关注/粉丝）
const currentUserId = computed(() => {
  const idFromQuery = route.query.userId as string;
  return idFromQuery ? Number(idFromQuery) : Number(userStore.userInfo?.id || 0);
});

// 页面标题
const pageTitle = computed(() => 
  listType.value === 'following' ? '我的关注' : '我的粉丝'
);

// 空状态文案
const emptyText = computed(() =>
  listType.value === 'following' ? '还没有关注任何人' : '还没有粉丝'
);

const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';

// 手动管理列表状态
const list = ref<FollowUserItem[]>([]);
const hasMore = ref(false);
const isLoading = ref(false);

// 创建一个变量来保存当前的 composable 实例
let currentFollowList: ReturnType<typeof useFollowList> | null = null;

// 获取列表函数
const refreshList = async () => {
  if (!currentUserId.value) return;
  
  // 每次切换时创建新的 composable 实例
  currentFollowList = useFollowList(
    currentUserId.value,
    listType.value
  );
  
  // 同步响应式状态
  list.value = [];
  isLoading.value = true;
  
  await currentFollowList.fetchList(true);
  
  list.value = currentFollowList.list.value;
  hasMore.value = currentFollowList.hasMore.value;
  isLoading.value = currentFollowList.isLoading.value;
};

// 加载更多
const loadMore = async () => {
  if (!currentFollowList || !hasMore.value || isLoading.value) return;
  
  isLoading.value = true;
  await currentFollowList.loadMore();
  
  list.value = currentFollowList.list.value;
  hasMore.value = currentFollowList.hasMore.value;
  isLoading.value = currentFollowList.isLoading.value;
};

// 关注/取消关注
const handleToggleFollow = async (userId: number) => {
  if (!currentFollowList) return;
  
  await currentFollowList.toggleFollow(userId);
  // 同步列表状态
  list.value = [...currentFollowList.list.value];
};

// 是否显示关注按钮（不显示自己）
const showFollowButton = (user: FollowUserItem) => {
  const myId = Number(userStore.userInfo?.id);
  return userStore.isLoggedIn && user.id !== myId;
};

// 跳转到用户主页
const goToUserProfile = (userId: number) => {
  router.push(`/user/${userId}`);
};

// 监听 listType 和 currentUserId 变化，重新请求数据
watch(
  [listType, currentUserId],
  () => {
    if (currentUserId.value) {
      refreshList();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.follow-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
}

.user-list {
  min-height: 200px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-item:hover {
  background-color: var(--el-fill-color-light);
}

.user-avatar {
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.nickname {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.bio {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.no-more {
  color: #909399;
  font-size: 14px;
}
</style>
