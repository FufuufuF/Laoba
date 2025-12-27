<template>
  <div class="search-container">
    <div class="search-header">
      <h2>搜索结果: "{{ searchQuery }}"</h2>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="帖子" name="posts" />
        <el-tab-pane label="用户" name="users" />
      </el-tabs>
    </div>
    
    <div v-loading="loading" class="search-results">
      <!-- 空状态 -->
      <el-empty v-if="!loading && isEmpty" description="未找到相关结果" />
      
      <!-- 帖子结果 -->
      <template v-if="showPosts && posts.length > 0">
        <h3 v-if="activeTab === 'all'" class="section-title">帖子</h3>
        <div class="post-list">
          <post-card
            v-for="post in posts"
            :key="post.id"
            :post="post"
            @click="() => goToPostDetail(post.id)"
          />
        </div>
      </template>
      
      <!-- 用户结果 -->
      <template v-if="showUsers && users.length > 0">
        <h3 v-if="activeTab === 'all'" class="section-title">用户</h3>
        <div class="user-list">
          <div
            v-for="user in users"
            :key="user.id"
            class="user-card"
            @click="goToUserProfile(user.id)"
          >
            <el-avatar :size="48" :src="user.avatar || defaultAvatar" />
            <div class="user-info">
              <span class="user-name">{{ user.nickname }}</span>
              <span class="user-bio">{{ user.bio || '暂无简介' }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { search } from '@/api/search';
import type { SearchUserResult } from '@/api/search';
import type { PostResponse } from '@/api/post';
import PostCard from '@/components/post/post-card.vue';
import type { Post } from '@/types/post';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const activeTab = ref<'all' | 'posts' | 'users'>('all');
const posts = ref<Post[]>([]);
const users = ref<SearchUserResult[]>([]);

const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';

const searchQuery = computed(() => route.query.q as string || '');

const showPosts = computed(() => activeTab.value === 'all' || activeTab.value === 'posts');
const showUsers = computed(() => activeTab.value === 'all' || activeTab.value === 'users');
const isEmpty = computed(() => posts.value.length === 0 && users.value.length === 0);

const mapPostResponse = (item: PostResponse): Post => ({
  id: item.id,
  title: item.title,
  content: item.content || '',
  media: item.media || [],
  tags: item.tags || [],
  createAt: new Date(item.created_at).getTime(),
  updateAt: new Date(item.updated_at).getTime(),
  author: {
    id: item.author.user_id,
    name: item.author.nickname,
    avatar: item.author.avatar || '',
  },
  status: {
    commentCount: item.status.comment_count,
    likeCount: item.status.like_count,
    shareCount: item.status.share_count,
    isLiked: item.status.is_liked,
    isCollected: item.status.is_collected,
  },
});

const doSearch = async () => {
  if (!searchQuery.value) return;
  
  loading.value = true;
  try {
    const res = await search(searchQuery.value, activeTab.value);
    posts.value = (res.data.posts || []).map(mapPostResponse);
    users.value = res.data.users || [];
  } catch (e) {
    console.error('Search failed:', e);
  } finally {
    loading.value = false;
  }
};

const goToPostDetail = (postId: number) => {
  router.push(`/post/${postId}`);
};

const goToUserProfile = (userId: number) => {
  router.push(`/user/${userId}`);
};

// 监听搜索词和 Tab 变化
watch([searchQuery, activeTab], () => {
  doSearch();
}, { immediate: false });

onMounted(() => {
  doSearch();
});
</script>

<style scoped>
.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-header {
  margin-bottom: 20px;
}

.search-header h2 {
  margin: 0 0 16px;
  color: var(--el-text-color-primary);
}

.search-header :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.section-title {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  margin: 24px 0 12px;
}

.section-title:first-child {
  margin-top: 0;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-card:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.user-bio {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}
</style>
