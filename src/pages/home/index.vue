<template>
    <div class="home-container">
        <div class="feed-header">
            <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <el-tab-pane label="最新发布" name="latest" />
                <el-tab-pane label="热门推荐" name="hot" />
            </el-tabs>
            <el-button type="primary" @click="goToCreate">发布动态</el-button>
        </div>
        
        <div class="post-list">
            <!-- 骨架屏加载态 -->
            <template v-if="loading">
                <post-skeleton v-for="i in 3" :key="i" />
            </template>
            
            <!-- 空状态 -->
            <div v-else-if="postList.length === 0" class="empty-state">
                <el-empty description="暂无帖子" />
            </div>
            
            <!-- 帖子列表 -->
            <template v-else>
                <post-card
                    v-for="post in postList"
                    :key="post.id"
                    :post="post"
                    @click="() => goToDetail(post)"
                    @like="handleLike"
                    @comment="() => goToDetail(post)"
                />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { usePost } from './composables/use-post';
import PostCard from '@/components/post/post-card.vue';
import PostSkeleton from '@/components/post/post-skeleton.vue';
import { updatePostStatus } from '@/api/post';
import type { Post } from '@/types/post';

const router = useRouter();
const { postList, fetchPostList } = usePost();
const loading = ref(false);
const activeTab = ref<'latest' | 'hot'>('latest');

const goToCreate = () => {
    router.push('/post-create');
};

const goToDetail = (post: Post) => {
    router.push(`/post/${post.id}`);
};

const handleTabChange = async (tab: 'latest' | 'hot') => {
    loading.value = true;
    try {
        await fetchPostList(tab);
    } finally {
        loading.value = false;
    }
};

const handleLike = async (postId: number) => {
    const post = postList.value.find((p) => p.id === postId);
    if (!post) return;
    
    try {
        const action = post.status.isLiked ? 'unlike' : 'like';
        const response = await updatePostStatus(postId, action);
        // 使用服务器返回的最新数据更新本地状态
        post.status.likeCount = response.data.status.like_count;
        post.status.isLiked = response.data.status.is_liked;
    } catch (error) {
        ElMessage({ message: '操作失败', type: 'error', showClose: true, duration: 2000 });
    }
};

onMounted(async () => {
    loading.value = true;
    try {
        await fetchPostList(activeTab.value);
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

.feed-header :deep(.el-tabs) {
    flex: 1;
}

.feed-header :deep(.el-tabs__header) {
    margin: 0;
}

.feed-header :deep(.el-tabs__nav-wrap::after) {
    display: none;
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