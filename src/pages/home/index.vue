<template>
    <div class="home-container">
        <div class="feed-header">
            <!-- 主 Tab：全站动态 / 关注动态 -->
            <el-tabs v-model="mainTab" @tab-change="handleMainTabChange" class="main-tabs">
                <el-tab-pane label="全站动态" name="all" />
                <el-tab-pane label="关注动态" name="following" :disabled="!isLoggedIn" />
            </el-tabs>
            <el-button type="primary" @click="goToCreate">发布动态</el-button>
        </div>
        
        <!-- 子 Tab：仅全站动态时显示排序选项 -->
        <div v-if="mainTab === 'all'" class="sort-tabs">
            <el-radio-group v-model="activeTab" size="small" @change="handleSortChange">
                <el-radio-button label="latest">最新发布</el-radio-button>
                <el-radio-button label="hot">热门推荐</el-radio-button>
            </el-radio-group>
        </div>
        
        <div class="post-list">
            <!-- 骨架屏加载态 -->
            <template v-if="loading && postList.length === 0">
                <post-skeleton v-for="i in 3" :key="i" />
            </template>
            
            <!-- 空状态 -->
            <div v-else-if="postList.length === 0" class="empty-state">
                <el-empty :description="mainTab === 'following' ? '还没有关注任何人，去发现更多用户吧' : '暂无帖子'" />
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
                    @author-click="goToUserProfile"
                />
            </template>
        </div>
        
        <!-- 加载更多按钮 -->
        <div v-if="postList.length > 0" class="load-more">
            <el-button 
                v-if="hasMore" 
                :loading="loading" 
                @click="handleLoadMore"
            >
                {{ loading ? '加载中...' : '加载更多' }}
            </el-button>
            <span v-else class="no-more">没有更多了</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { usePost } from './composables/use-post';
import { useUserStore } from '@/stores/user';
import PostCard from '@/components/post/post-card.vue';
import PostSkeleton from '@/components/post/post-skeleton.vue';
import { updatePostStatus } from '@/api/post';
import type { Post } from '@/types/post';

const router = useRouter();
const userStore = useUserStore();
const { postList, hasMore, fetchPostList, fetchFollowingPosts, loadMore } = usePost();
const loading = ref(false);
const mainTab = ref<'all' | 'following'>('all');
const activeTab = ref<'latest' | 'hot'>('latest');

// 是否已登录
const isLoggedIn = computed(() => userStore.isLoggedIn);

const goToCreate = () => {
    router.push('/post-create');
};

const goToDetail = (post: Post) => {
    router.push(`/post/${post.id}`);
};

// 跳转到用户主页
const goToUserProfile = (userId: number) => {
    router.push(`/user/${userId}`);
};

// 主 Tab 切换
const handleMainTabChange = async (tab: 'all' | 'following') => {
    loading.value = true;
    try {
        if (tab === 'following') {
            await fetchFollowingPosts();
        } else {
            await fetchPostList(activeTab.value);
        }
    } finally {
        loading.value = false;
    }
};

// 排序 Tab 切换
const handleSortChange = async (sortBy: 'latest' | 'hot') => {
    loading.value = true;
    try {
        await fetchPostList(sortBy);
    } finally {
        loading.value = false;
    }
};

const handleLoadMore = async () => {
    await loadMore();
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
    margin-bottom: 12px;
}

.feed-header .main-tabs {
    flex: 1;
}

.feed-header :deep(.el-tabs__header) {
    margin: 0;
}

.feed-header :deep(.el-tabs__nav-wrap::after) {
    display: none;
}

.sort-tabs {
    margin-bottom: 16px;
}

.post-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.empty-state {
    padding: 60px 0;
}

.load-more {
    display: flex;
    justify-content: center;
    padding: 20px 0;
}

.no-more {
    color: #909399;
    font-size: 14px;
}
</style>