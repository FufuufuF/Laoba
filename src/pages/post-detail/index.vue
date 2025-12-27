<template>
  <div class="post-detail-page" v-loading="loading">
    <div v-if="post">
      <el-page-header @back="$router.back()" content="动态详情" class="mb-4" />
      
      <el-card class="post-card">
        <div class="post-header">
          <el-avatar :src="post.author.avatar" />
          <div class="meta">
            <span class="nickname">{{ post.author.name }}</span>
            <span class="time">{{ formatTime(post.createAt) }}</span>
          </div>
        </div>
        
        <div class="content">
          <h2 class="post-title" v-if="post.title">{{ post.title }}</h2>
          <p>{{ post.content }}</p>
          
          <!-- 标签 -->
          <div v-if="post.tags.length > 0" class="tags">
            <el-tag v-for="tag in post.tags" :key="tag" type="info" size="small">
              # {{ tag }}
            </el-tag>
          </div>
          
          <!-- 媒体内容 -->
          <div class="media-list" v-if="post.media && post.media.length">
            <div v-for="(media, index) in post.media" :key="index" class="media-item">
              <el-image 
                v-if="media.type === 'image'"
                :src="media.url" 
                :preview-src-list="post.media.filter(m => m.type === 'image').map(m => m.url)"
                fit="cover"
                class="post-image"
              />
              <video 
                v-else-if="media.type === 'video'"
                :src="media.url" 
                controls
                class="post-video"
              />
            </div>
          </div>
        </div>
        
        <div class="actions">
           <el-button text :class="{ liked: post.status.isLiked }" @click="handleLike">
             <el-icon><Star /></el-icon> {{ post.status.likeCount }} {{ post.status.isLiked ? '已赞' : '点赞' }}
           </el-button>
           <el-button text>
             <el-icon><ChatDotRound /></el-icon> {{ post.status.commentCount }} 评论
           </el-button>
        </div>
      </el-card>

      <div class="comments-section">
        <h3>评论 ({{ comments.length }})</h3>
        
        <div class="comment-input">
          <el-input 
            v-model="newComment" 
            placeholder="写下你的评论..." 
            type="textarea" 
            :rows="2"
          />
          <el-button type="primary" class="mt-2" @click="submitComment" :loading="submittingComment">发送</el-button>
        </div>

        <div class="comment-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <el-avatar :src="comment.author.avatar" :size="32" />
            <div class="comment-content">
              <div class="comment-header">
                <span class="nickname">{{ comment.author.nickname }}</span>
                <span class="time">{{ formatTime(Number(comment.createdAt)) }}</span>
              </div>
              <p>{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-else-if="!loading" description="动态不存在" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePostDetail } from './composables/use-post-detail';
import { useComments } from './composables/use-comments';
import { usePostActions } from './composables/use-post-actions';
import { formatTime } from './utils';
import { Star, ChatDotRound } from '@element-plus/icons-vue';

const route = useRoute();
const postId = Number(route.params.id);

// Composables
const { post, loading, loadPostDetail } = usePostDetail(postId);
const { comments, newComment, submittingComment, loadComments, submitComment } = useComments(postId, post);
const { handleLike } = usePostActions(post);

// 加载数据
const loadData = async () => {
  await Promise.all([loadPostDetail(), loadComments()]);
};

onMounted(loadData);
</script>

<style scoped>
.post-detail-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
.mb-4 { margin-bottom: 16px; }
.mt-2 { margin-top: 8px; }
.post-header { display: flex; gap: 12px; margin-bottom: 16px; }
.meta { display: flex; flex-direction: column; }
.nickname { font-weight: bold; }
.time { font-size: 12px; color: #999; }
.post-title { 
  font-size: 20px; 
  font-weight: 600; 
  margin-bottom: 12px; 
}
.tags { 
  display: flex; 
  gap: 8px; 
  margin-top: 12px; 
  flex-wrap: wrap; 
}
.media-list { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
  gap: 8px; 
  margin-top: 12px; 
}
.media-item {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}
.post-image, .post-video { 
  width: 100%; 
  height: 200px; 
  object-fit: cover;
  border-radius: 8px;
}
.post-video {
  background-color: #000;
}
.actions { margin-top: 16px; border-top: 1px solid #eee; padding-top: 12px; }
.actions .liked { color: #67c23a; }
.comments-section { margin-top: 24px; }
.comment-item { display: flex; gap: 12px; margin-top: 16px; border-bottom: 1px solid #f5f5f5; padding-bottom: 16px; }
.comment-content { flex: 1; }
.comment-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
</style>
