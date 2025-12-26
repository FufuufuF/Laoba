<template>
  <div class="user-profile-page">
    <el-card class="user-info-card" v-loading="loading">
      <!-- 用户信息头部 -->
      <div class="user-header">
        <el-avatar :size="80" :src="userInfo?.avatar" />
        <div class="user-meta">
          <div class="user-name-row">
            <h2 class="nickname">{{ userInfo?.nickname }}</h2>
            <el-tag v-if="userInfo?.role === 'admin'" type="danger" size="small">管理员</el-tag>
            <el-tag v-else-if="userInfo?.isForbidden" type="info" size="small">已封禁</el-tag>
          </div>
          <div class="username">学号：{{ userInfo?.username }}</div>
          <div v-if="userInfo?.bio" class="bio">{{ userInfo.bio }}</div>
          <div v-if="userInfo?.tags && userInfo.tags.length > 0" class="tags">
            <el-tag
              v-for="tag in userInfo.tags"
              :key="tag"
              size="small"
              type="info"
              effect="plain"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        
        <!-- 操作按钮区域 -->
        <div class="actions">
          <el-button v-if="isCurrentUser" type="primary" @click="goToSetting">
            <el-icon><Edit /></el-icon>
            编辑资料
          </el-button>
          <el-button v-else type="primary" plain>
            <el-icon><Plus /></el-icon>
            关注
          </el-button>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="user-stats">
        <div class="stat-item">
          <div class="stat-value">{{ total }}</div>
          <div class="stat-label">帖子</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">0</div>
          <div class="stat-label">关注</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">0</div>
          <div class="stat-label">粉丝</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">0</div>
          <div class="stat-label">获赞</div>
        </div>
      </div>
    </el-card>

    <!-- 帖子列表 -->
    <div class="posts-section">
      <h3 class="section-title">TA 的帖子</h3>
      
      <div v-if="posts.length === 0 && !loading" class="empty-state">
        <el-empty description="还没有发布任何帖子" />
      </div>

      <div v-else class="posts-list">
        <post-card
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @click="goToDetail"
          @like="handleLike"
          @comment="goToDetail"
        >
          <template #actions>
            <el-dropdown v-if="isAuthor(post)" @command="(cmd) => handleCommand(cmd, post.id)" @click.stop>
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

        <!-- 加载更多 -->
        <div v-if="posts.length < total" class="load-more">
          <el-button @click="loadMore" :loading="loading">加载更多</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Edit, Plus, More } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { useUserProfile } from './composables/use-user-profile';
import PostCard from '@/components/post/post-card.vue';
import type { Post } from '@/types/post';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 获取用户ID
const userId = computed(() => route.params.id as string);

// 使用用户主页逻辑
const { loading, userInfo, posts, total, loadMore } = useUserProfile(userId.value);

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
  router.push('/setting');
};

// 跳转到帖子详情
const goToDetail = (post: Post) => {
  router.push(`/post/${post.id}`);
};

// 点赞
const handleLike = (postId: number) => {
  // TODO: 实现点赞逻辑
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
      // TODO: 实现删除逻辑
      ElMessage({ message: '删除成功', type: 'success', showClose: true, duration: 2000 });
    });
  }
};
</script>

<style scoped>
.user-profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.user-info-card {
  margin-bottom: 20px;
}

.user-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.user-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nickname {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.username {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.bio {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.actions {
  display: flex;
  align-items: flex-start;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  text-align: center;
}

.stat-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-item:hover .stat-value {
  color: var(--el-color-primary);
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.posts-section {
  margin-top: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.empty-state {
  padding: 40px 0;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.load-more {
  text-align: center;
  padding: 20px 0;
}
</style>
