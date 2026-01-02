<template>
  <div class="user-profile-page">
    <!-- 顶部背景图 -->
    <div 
      class="profile-background" 
      :style="{ backgroundImage: `url(${userInfo?.background || defaultBackground})` }"
    >
      <div class="background-overlay"></div>
    </div>

    <div class="profile-content">
      <!-- 用户信息区域 -->
      <div class="user-info-section">
        <div class="user-info-left">
          <el-avatar :size="120" :src="userInfo?.avatar" class="user-avatar" />
        </div>
        
        <div class="user-info-right">
          <div class="name-row">
            <h1 class="nickname">{{ userInfo?.nickname }}</h1>
            <div class="tags-row" v-if="userInfo?.tags">
              <el-tag 
                v-for="tag in userInfo.tags" 
                :key="tag" 
                size="small" 
                effect="plain" 
                round
                class="user-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
          
          <!-- <div class="user-id">小红书号：{{ userInfo?.username }}</div> -->
          
          <div class="user-bio">{{ userInfo?.bio || '这个人很懒，什么都没写~' }}</div>
          
          <div class="user-stats-row">
            <div class="stat-item">
              <span class="count">{{ userInfo?.following_count || 0 }}</span>
              <span class="label">关注</span>
            </div>
            <div class="stat-item">
              <span class="count">{{ userInfo?.followers_count || 0 }}</span>
              <span class="label">粉丝</span>
            </div>
            <div class="stat-item">
              <span class="count">{{ userInfo?.likeCount || 0 }}</span>
              <span class="label">获赞与收藏</span>
            </div>
          </div>
          
          <div class="action-buttons">
            <template v-if="isCurrentUser">
              <el-button type="primary" round @click="goToSetting">编辑资料</el-button>
            </template>
            <template v-else>
              <el-button 
                :type="userInfo?.is_following ? 'default' : 'primary'" 
                round 
                :icon="userInfo?.is_following ? 'Check' : 'Plus'"
                @click="handleFollow"
              >
                {{ userInfo?.is_following ? '已关注' : '关注' }}
              </el-button>
              <el-button round icon="ChatDotRound">私信</el-button>
            </template>
          </div>
        </div>
      </div>

      <!-- 内容 Tabs -->
      <el-tabs v-model="activeTab" class="content-tabs">
        <el-tab-pane label="笔记" name="posts">
          <div v-if="posts.length === 0 && !loading" class="empty-state">
            <el-empty description="还没有发布任何笔记" />
          </div>
          
          <div v-else class="posts-grid">
            <post-card
              v-for="post in posts"
              :key="post.id"
              :post="post"
              @click="goToDetail"
              @like="handleLike"
              @comment="goToDetail"
            >
              <template #actions>
                <el-dropdown v-if="isAuthor(post)" @command="(cmd: string) => handleCommand(cmd, post.id)" @click.stop>
                  <span class="el-dropdown-link">
                    <el-icon><More /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="delete" style="color: red;">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </post-card>
          </div>
          
          <!-- 加载更多 -->
          <div v-if="posts.length < postsTotal" class="load-more">
            <el-button text @click="loadMorePosts" :loading="loading">加载更多</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Edit, Plus, More, Setting, ChatDotRound, Check } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { useUserProfile } from './composables/use-user-profile';
import PostCard from '@/components/post/post-card.vue';
import type { Post } from '@/types/post';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 默认背景图
const defaultBackground = 'https://picsum.photos/1200/400?random=999';

// 当前激活的 Tab
const activeTab = ref('posts');

// 获取用户ID
const userId = computed(() => route.params.id as string);

// 使用用户主页逻辑
const { 
  loading, 
  userInfo, 
  posts, 
  postsTotal, 
  loadMorePosts, 
  handleFollow
} = useUserProfile(userId.value);

// 是否是当前登录用户
const isCurrentUser = computed(() => {
  return userStore.userInfo?.id === userId.value;
});

// 是否是帖子作者
const isAuthor = (post: Post) => {
  return userStore.userInfo?.id === String(post.author.id);
};

// 跳转到设置页
const goToSetting = () => {
  router.push({ path: '/setting', query: { edit: 'true' } });
};

// 跳转到帖子详情
const goToDetail = (post: Post) => {
  router.push(`/post/${post.id}`);
};

// 点赞
const handleLike = (postId: number) => {
  ElMessage({ message: '点赞成功', type: 'success', showClose: true, duration: 2000 });
};

// 处理下拉菜单命令
const handleCommand = (command: string, postId: number) => {
  if (command === 'delete') {
    ElMessageBox.confirm('确定要删除这条动态吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      ElMessage({ message: '删除成功', type: 'success', showClose: true, duration: 2000 });
    });
  }
};
</script>

<style scoped>
.user-profile-page {
  min-height: 100vh;
  background-color: var(--el-bg-color);
}

.profile-background {
  height: 240px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
}

.profile-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  top: -40px; /* 让内容部分上移，覆盖一点背景图 */
}

.user-info-section {
  display: flex;
  gap: 32px;
  margin-bottom: 20px;
  padding-bottom: 20px;
}

.user-avatar-wrapper {
  flex-shrink: 0;
  padding: 4px;
  background: var(--el-bg-color);
  border-radius: 50%;
}

.user-avatar {
  border: 4px solid var(--el-bg-color);
}

.user-info-right {
  flex: 1;
  padding-top: 48px; /* 抵消 top: -40px 的影响，让文字对齐 */
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.nickname {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.tags-row {
  display: flex;
  gap: 6px;
}

.user-tag {
  font-size: 12px;
}

.user-id {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 12px;
}

.user-bio {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
  margin-bottom: 16px;
  max-width: 600px;
}

.user-stats-row {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.stat-item .count {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.stat-item .label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.content-tabs {
  background: var(--el-bg-color);
  border-radius: 8px;
  min-height: 400px;
}

/* 调整 Tabs 样式 */
:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--el-border-color-lighter);
}

:deep(.el-tabs__item) {
  font-size: 16px;
  height: 50px;
  line-height: 50px;
}

:deep(.el-tabs__item.is-active) {
  font-weight: 600;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* 响应式 Grid */
  gap: 20px;
  padding: 20px 0;
}

.empty-state {
  padding: 60px 0;
}

.load-more {
  text-align: center;
  padding: 20px 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .user-info-section {
    flex-direction: column;
    gap: 16px;
    align-items: center;
    text-align: center;
  }
  
  .user-info-right {
    padding-top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .name-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .user-stats-row {
    justify-content: center;
  }
  
  .posts-grid {
    grid-template-columns: 1fr; /* 移动端单列 */
  }
}
</style>
