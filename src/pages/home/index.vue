<template>
  <div class="home-page">
    <div class="feed-header">
      <h2>最新动态</h2>
      <el-button type="primary" @click="goToCreate">发布动态</el-button>
    </div>
    
    <div v-loading="loading" class="feed-list">
      <el-empty v-if="!loading && posts.length === 0" description="暂无动态" />
      <PostCard 
        v-for="post in posts" 
        :key="post.id" 
        :post="post" 
        @delete="handleDelete"
        @like="handleLike"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getPostList, deletePost, likePost } from './api';
import type { Post } from '@/api/types';
import PostCard from './components/post-card.vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const posts = ref<Post[]>([]);
const loading = ref(false);

const loadPosts = async () => {
  loading.value = true;
  try {
    // Mock data if API fails or returns empty (for development)
    // In real scenario, just: posts.value = await getPostList();
    const res = await getPostList().catch(() => []); 
    if (Array.isArray(res) && res.length > 0) {
        posts.value = res;
    } else {
        // Fallback mock data
        posts.value = [
            {
                id: '1',
                author: { id: '101', nickname: '张三', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
                content: '今天天气真好！',
                images: [],
                likeCount: 10,
                commentCount: 2,
                createdAt: new Date().toISOString(),
                isLiked: false
            },
             {
                id: '2',
                author: { id: '102', nickname: '李四', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
                content: '分享一张图片',
                images: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                likeCount: 5,
                commentCount: 0,
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                isLiked: true
            }
        ]
    }
  } finally {
    loading.value = false;
  }
};

const goToCreate = () => {
  router.push('/home/post-create');
};

const handleDelete = async (id: string) => {
  try {
    await deletePost(id);
    ElMessage.success('删除成功');
    posts.value = posts.value.filter(p => p.id !== id);
  } catch (error) {
    // ElMessage handled in client
  }
};

const handleLike = async (id: string) => {
  try {
    await likePost(id);
    const post = posts.value.find(p => p.id === id);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likeCount += post.isLiked ? 1 : -1;
    }
  } catch (error) {
    // Error
  }
};

onMounted(() => {
  loadPosts();
});
</script>

<style scoped>
.home-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>