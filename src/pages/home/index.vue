<template>
    <div class="home-container">
        <div class="post-list">
            <post-preview
                v-for="post in postList"
                :key="post.id"
                :post="post"
            />
        </div>
        
        <!-- 加载状态 -->
        <div v-if="postList.length === 0" class="empty-state">
            <el-empty description="暂无帖子" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePost } from './composables/use-post';
import PostPreview from './components/post-preview.vue';

const { postList, fetchPostList } = usePost();

onMounted(() => {
    fetchPostList();
});
</script>

<style scoped>
.home-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
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