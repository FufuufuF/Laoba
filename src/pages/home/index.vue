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
            <post-card
                v-for="post in postList"
                :key="post.id"
                :post="post"
                @click="() => goToDetail(post)"
                @like="handleLike"
                @comment="() => goToDetail(post)"
            >
                <template #actions>
                    <el-dropdown v-if="isAuthor(post)" @command="(cmd: string) => handleCommand(cmd, post.id)" @click.stop>
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { More } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { usePost } from './composables/use-post';
import PostCard from '@/components/post/post-card.vue';
import { likePost, deletePost } from './api';
import type { Post } from '@/types/post';

const router = useRouter();
const userStore = useUserStore();
const { postList, fetchPostList } = usePost();
const loading = ref(false);

// 判断是否是作者
const isAuthor = (post: Post) => {
    return userStore.userInfo?.id === String(post.author.id);
};

const goToCreate = () => {
    router.push('/post-create');
};

const goToDetail = (post: Post) => {
    router.push(`/post/${post.id}`);
};

const handleLike = async (postId: number) => {
    try {
        await likePost(postId);
        const post = postList.value.find((p) => p.id === postId);
        if (post) {
            post.status.likeCount += 1;
        }
        ElMessage.success('点赞成功');
    } catch (error) {
        ElMessage.error('点赞失败');
    }
};

const handleCommand = (command: string, postId: number) => {
    if (command === 'delete') {
        ElMessageBox.confirm('确定要删除这条动态吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            try {
                await deletePost(postId);
                ElMessage.success('删除成功');
                // 重新加载列表
                await fetchPostList();
            } catch (error) {
                ElMessage.error('删除失败');
            }
        });
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