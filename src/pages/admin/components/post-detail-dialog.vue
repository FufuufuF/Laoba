<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="帖子详情"
    width="800px"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <div v-if="post" class="post-detail">
      <!-- 作者信息 -->
      <div class="author-section">
        <el-avatar :src="post.author_avatar || undefined" :size="48">
          {{ post.author_nickname?.charAt(0) || "U" }}
        </el-avatar>
        <div class="author-info">
          <div class="author-name">{{ post.author_nickname || "匿名用户" }}</div>
          <div class="post-meta">
            <span>{{ formatDate(post.created_at) }}</span>
            <el-tag size="small" type="info">{{
              getVisibilityLabel(post.visibility)
            }}</el-tag>
            <el-tag size="small" :type="getStatusTagType(post.review_status)">
              {{ getStatusLabel(post.review_status) }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 帖子标题 -->
      <h2 class="post-title">{{ post.title }}</h2>

      <!-- 帖子内容 -->
      <div class="post-content">{{ post.content || "（无正文内容）" }}</div>

      <!-- 媒体展示 -->
      <div v-if="post.media && post.media.length > 0" class="media-section">
        <div class="media-title">附件（{{ post.media.length }}个）</div>
        <div class="media-grid">
          <template v-for="(item, index) in post.media" :key="index">
            <!-- 图片 -->
            <el-image
              v-if="item.type === 'image'"
              :src="item.url"
              :preview-src-list="imageUrls"
              :initial-index="getImageIndex(index)"
              fit="cover"
              class="media-item"
            />
            <!-- 视频 -->
            <div v-else-if="item.type === 'video'" class="video-container">
              <video :src="item.url" controls class="media-video" />
            </div>
          </template>
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="post.tags && post.tags.length > 0" class="tags-section">
        <el-tag
          v-for="tag in post.tags"
          :key="tag"
          size="small"
          class="tag-item"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">关闭</el-button>
        <el-button
          v-if="post?.review_status !== 'rejected'"
          type="danger"
          @click="handleReject"
        >
          拒绝
        </el-button>
        <el-button
          v-if="post?.review_status !== 'approved'"
          type="success"
          @click="handleApprove"
        >
          通过
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { AdminPost } from "@/api/admin";
import {
  formatDate,
  getStatusTagType,
  getStatusLabel,
  getVisibilityLabel,
} from "../utils";

const props = defineProps<{
  visible: boolean;
  post: AdminPost | null;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "approve", post: AdminPost): void;
  (e: "reject", post: AdminPost): void;
}>();

// 获取所有图片 URL 用于预览
const imageUrls = computed(() => {
  if (!props.post?.media) return [];
  return props.post.media
    .filter((item) => item.type === "image")
    .map((item) => item.url);
});

// 获取图片在 imageUrls 中的索引
const getImageIndex = (mediaIndex: number): number => {
  if (!props.post?.media) return 0;
  let imageCount = 0;
  for (let i = 0; i < mediaIndex; i++) {
    if (props.post.media[i].type === "image") {
      imageCount++;
    }
  }
  return imageCount;
};

const handleApprove = () => {
  if (props.post) {
    emit("approve", props.post);
  }
};

const handleReject = () => {
  if (props.post) {
    emit("reject", props.post);
  }
};
</script>

<style scoped>
.post-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.author-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  color: #999;
  font-size: 13px;
}

.post-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.post-content {
  font-size: 15px;
  line-height: 1.8;
  color: #555;
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: 20px;
}

.media-section {
  margin-bottom: 20px;
}

.media-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.media-item {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  cursor: pointer;
  object-fit: cover;
}

.video-container {
  width: 100%;
}

.media-video {
  width: 100%;
  max-height: 300px;
  border-radius: 8px;
  background: #000;
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.tag-item {
  cursor: default;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
