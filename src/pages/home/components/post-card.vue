<template>
  <el-card class="post-card" shadow="hover">
    <div class="post-header">
      <div class="user-info">
        <el-avatar :src="post.author.avatar" :size="40" />
        <div class="meta">
          <span class="nickname">{{ post.author.nickname }}</span>
          <span class="time">{{ formatTime(post.createdAt) }}</span>
        </div>
      </div>
      <el-dropdown v-if="isAuthor" @command="handleCommand">
        <span class="el-dropdown-link">
          <el-icon><More /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="delete" style="color: red;">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="post-content" @click="goToDetail">
      <p class="text">{{ post.content }}</p>
      <div class="images" v-if="post.images && post.images.length">
        <el-image 
          v-for="(img, index) in post.images" 
          :key="index" 
          :src="img" 
          :preview-src-list="post.images"
          fit="cover"
          class="post-image"
          @click.stop
        />
      </div>
    </div>

    <div class="post-footer">
      <div class="action-item" @click.stop="handleLike">
        <el-icon :color="post.isLiked ? 'red' : ''"><component :is="post.isLiked ? 'StarFilled' : 'Star'" /></el-icon>
        <span>{{ post.likeCount }}</span>
      </div>
      <div class="action-item" @click.stop="goToDetail">
        <el-icon><ChatDotRound /></el-icon>
        <span>{{ post.commentCount }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import type { Post } from '@/api/core/types';
import { More, Star, StarFilled, ChatDotRound } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';

const props = defineProps<{
  post: Post
}>();

const emit = defineEmits<{
  (e: 'delete', id: string): void;
  (e: 'like', id: string): void;
}>();

const router = useRouter();
const userStore = useUserStore();

const isAuthor = computed(() => userStore.userInfo?.id === props.post.author.id);

const formatTime = (time: string) => {
  return new Date(time).toLocaleString();
};

const goToDetail = () => {
  router.push(`/home/post/${props.post.id}`);
};

const handleLike = () => {
  emit('like', props.post.id);
};

const handleCommand = (command: string) => {
  if (command === 'delete') {
    ElMessageBox.confirm('确定要删除这条动态吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      emit('delete', props.post.id);
    });
  }
};
</script>

<style scoped>
.post-card {
  margin-bottom: 20px;
}
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.meta {
  display: flex;
  flex-direction: column;
}
.nickname {
  font-weight: bold;
  font-size: 14px;
}
.time {
  font-size: 12px;
  color: #999;
}
.post-content {
  cursor: pointer;
}
.text {
  margin-bottom: 12px;
  white-space: pre-wrap;
}
.images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.post-image {
  width: 100%;
  height: 150px;
  border-radius: 4px;
}
.post-footer {
  display: flex;
  border-top: 1px solid #eee;
  margin-top: 12px;
  padding-top: 12px;
}
.action-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #666;
}
.action-item:hover {
  color: #409eff;
}
</style>
