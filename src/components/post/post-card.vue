<template>
  <el-card class="post-card" shadow="hover" :class="{ 'clickable': clickable }" @click="handleClick">
    <!-- 作者信息区域 -->
    <div class="post-header">
      <div class="author-info">
        <el-avatar :size="40" :src="post.author.avatar" />
        <div class="author-details">
          <span class="author-name">{{ post.author.name }}</span>
          <span class="post-time">{{ formatTime(post.createAt) }}</span>
        </div>
      </div>
      
      <!-- 操作菜单插槽 -->
      <slot name="actions" />
    </div>

    <!-- 帖子标题 -->
    <h3 v-if="post.title" class="post-title">{{ post.title }}</h3>

    <!-- 帖子内容 -->
    <div class="post-content">
      {{ post.text }}
    </div>

    <!-- 媒体内容区域 -->
    <div v-if="post.media.length > 0" class="post-media" @click.stop>
      <div
        v-for="(media, index) in post.media"
        :key="index"
        class="media-item"
      >
        <img
          v-if="media.type === 'image'"
          :src="media.url"
          :alt="`图片 ${index + 1}`"
          class="media-image"
        />
        <video
          v-else-if="media.type === 'video'"
          :src="media.url"
          controls
          class="media-video"
        />
      </div>
    </div>

    <!-- 标签区域 -->
    <div v-if="post.tags.length > 0" class="post-tags">
      <el-tag
        v-for="tag in post.tags"
        :key="tag"
        type="info"
        size="small"
        class="tag-item"
      >
        # {{ tag }}
      </el-tag>
    </div>

    <!-- 互动统计区域 -->
    <div class="post-footer" @click.stop>
      <div class="stat-item" :class="{ liked: post.status.isLiked }" @click="handleLike">
        <el-icon><Star /></el-icon>
        <span>{{ post.status.likeCount }}</span>
      </div>
      <div class="stat-item" @click="handleComment">
        <el-icon><ChatDotRound /></el-icon>
        <span>{{ post.status.commentCount }}</span>
      </div>
      <div class="stat-item" @click="handleShare">
        <el-icon><Share /></el-icon>
        <span>{{ post.status.shareCount }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ChatDotRound, Star, Share } from '@element-plus/icons-vue';
import type { Post } from '@/types/post';

// 定义 props
const props = withDefaults(defineProps<{
  post: Post;
  clickable?: boolean;  // 是否可点击跳转
}>(), {
  clickable: true
});

// 定义 emits
const emit = defineEmits<{
  (e: 'click', post: Post): void;
  (e: 'like', postId: number): void;
  (e: 'comment', postId: number): void;
  (e: 'share', postId: number): void;
}>();

// 点击卡片
const handleClick = () => {
  if (props.clickable) {
    emit('click', props.post);
  }
};

// 点赞
const handleLike = () => {
  emit('like', props.post.id);
};

// 评论
const handleComment = () => {
  emit('comment', props.post.id);
};

// 分享
const handleShare = () => {
  emit('share', props.post.id);
};

// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }
};
</script>

<style scoped>
.post-card {
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.post-card.clickable {
  cursor: pointer;
}

.post-card.clickable:hover {
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-weight: 600;
  color: var(--el-text-color-primary);
  font-size: 14px;
}

.post-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.post-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.post-content {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin-bottom: 12px;
  word-break: break-word;
}

.post-media {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.media-item {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.media-image,
.media-video {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  border-radius: 8px;
}

.media-video {
  background-color: #000;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag-item {
  cursor: pointer;
}

.post-footer {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.stat-item:hover {
  color: var(--el-color-primary);
}

.stat-item.liked {
  color: #67c23a;
}

.stat-item .el-icon {
  font-size: 16px;
}
</style>

