import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getUserInfo, getUserPosts } from '../api';
import type { UserInfo } from '@/stores/user';
import type { Post } from '@/types/post';

/**
 * 用户主页逻辑
 */
export const useUserProfile = (userId: string) => {
  const loading = ref(false);
  const userInfo = ref<UserInfo | null>(null);
  const posts = ref<Post[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = 20;

  // 加载用户信息
  const loadUserInfo = async () => {
    try {
      loading.value = true;
      const res = await getUserInfo(userId);
      userInfo.value = res.data;
    } catch (error) {
      ElMessage.error('加载用户信息失败');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  // 加载用户帖子
  const loadUserPosts = async (reset = false) => {
    if (reset) {
      page.value = 1;
      posts.value = [];
    }

    try {
      loading.value = true;
      const res = await getUserPosts(userId, page.value, pageSize);
      posts.value = reset ? res.data.list : [...posts.value, ...res.data.list];
      total.value = res.data.total;
    } catch (error) {
      ElMessage.error('加载帖子列表失败');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  // 加载更多
  const loadMore = () => {
    if (posts.value.length < total.value) {
      page.value++;
      loadUserPosts();
    }
  };

  // 初始化加载
  onMounted(() => {
    loadUserInfo();
    loadUserPosts(true);
  });

  return {
    loading,
    userInfo,
    posts,
    total,
    loadUserPosts,
    loadMore,
  };
};

