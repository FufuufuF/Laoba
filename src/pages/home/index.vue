<template>
    <div class="home-container">
        <div class="feed-header">
            <h2>最新动态</h2>
            <el-button type="primary" @click="goToCreate">发布动态</el-button>
        </div>
        
        <div v-loading="loading" class="post-list">
            <!-- 空状态 -->
            <div v-if="!loading && postList.length === 0" class="empty-state">
                <el-empty description="暂无帖子" />
            </div>
            
            <!-- 帖子列表 -->
            <post-preview
                v-for="post in postList"
                :key="post.id"
                :post="post"
                @like="handleLike"
                @delete="handleDelete"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePost } from './composables/use-post';
import PostPreview from './components/post-preview.vue';
import { likePost, deletePost } from './api';
import { ElMessage } from 'element-plus';

const router = useRouter();
const { postList, fetchPostList } = usePost();
const loading = ref(false);

const goToCreate = () => {
    router.push('/post-create');
};

const handleLike = async (id: number) => {
    try {
        await likePost(id);
        const post = postList.find((p: { id: number }) => p.id === id);
        if (post) {
            post.status.likeCount += 1;
        }
        ElMessage.success('点赞成功');
    } catch (error) {
        ElMessage.error('点赞失败');
    }
};

const handleDelete = async (id: number) => {
    try {
        await deletePost(id);
        ElMessage.success('删除成功');
        // 重新加载列表
        await fetchPostList();
    } catch (error) {
        ElMessage.error('删除失败');
    }
};

onMounted(async () => {
    loading.value = true;
    try {
        await fetchPostList();
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.home-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.feed-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.feed-header h2 {
    margin: 0;
}

.post-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.empty-state {
    padding: 60px 0;
}
</style>