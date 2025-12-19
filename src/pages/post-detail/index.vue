<template>
  <div class="post-detail-page" v-loading="loading">
    <div v-if="post">
      <el-page-header @back="$router.back()" content="动态详情" class="mb-4" />
      
      <el-card class="post-card">
        <div class="post-header">
          <el-avatar :src="post.author.avatar" />
          <div class="meta">
            <span class="nickname">{{ post.author.nickname }}</span>
            <span class="time">{{ formatTime(post.createdAt) }}</span>
          </div>
        </div>
        
        <div class="content">
          <p>{{ post.content }}</p>
          <div class="images" v-if="post.images && post.images.length">
             <el-image 
              v-for="(img, index) in post.images" 
              :key="index" 
              :src="img" 
              :preview-src-list="post.images"
              fit="cover"
              class="post-image"
            />
          </div>
        </div>
        
        <div class="actions">
           <el-button :type="post.isLiked ? 'primary' : 'default'" text @click="handleLike">
             <el-icon><Star /></el-icon> {{ post.likeCount }} 点赞
           </el-button>
           <el-button text>
             <el-icon><ChatDotRound /></el-icon> {{ post.commentCount }} 评论
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
                <span class="time">{{ formatTime(comment.createdAt) }}</span>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getPostDetail, getComments, addComment, likePost } from './api';
import type { Post, Comment } from '@/api/types';
import { Star, ChatDotRound } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const postId = route.params.id as string;

const post = ref<Post | null>(null);
const comments = ref<Comment[]>([]);
const loading = ref(false);
const newComment = ref('');
const submittingComment = ref(false);

const formatTime = (time: string) => new Date(time).toLocaleString();

const loadData = async () => {
  loading.value = true;
  try {
    post.value = await getPostDetail(postId);
    comments.value = await getComments(postId);
  } catch (e) {
      ElMessage.error('加载动态失败');
  } finally {
    loading.value = false;
  }
};

const handleLike = async () => {
    if (!post.value) return;
    try {
        await likePost(post.value.id);
        post.value.isLiked = !post.value.isLiked;
        post.value.likeCount += post.value.isLiked ? 1 : -1;
    } catch (e) {}
};

const submitComment = async () => {
    if (!newComment.value.trim()) return;
    submittingComment.value = true;
    try {
        await addComment(postId, newComment.value);
        // Mock add
        comments.value.unshift({
            id: Date.now().toString(),
            author: { id: 'me', nickname: '我', avatar: '' },
            content: newComment.value,
            createdAt: new Date().toISOString()
        });
        newComment.value = '';
        if (post.value) post.value.commentCount++;
        ElMessage.success('评论成功');
    } catch (e) {} finally {
        submittingComment.value = false;
    }
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
.images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; }
.post-image { width: 100%; height: 200px; }
.actions { margin-top: 16px; border-top: 1px solid #eee; padding-top: 12px; }
.comments-section { margin-top: 24px; }
.comment-item { display: flex; gap: 12px; margin-top: 16px; border-bottom: 1px solid #f5f5f5; padding-bottom: 16px; }
.comment-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
</style>
