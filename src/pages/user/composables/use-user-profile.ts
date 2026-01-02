import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getUserInfo, getUserPosts, followUser, unfollowUser, type UserProfile, type RawPost } from "../api";
import type { Post } from "@/types/post";

/**
 * 将后端原始帖子数据转换为前端 Post 类型
 */
const mapPost = (raw: RawPost): Post => {
  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    media: raw.media,
    tags: raw.tags,
    createAt: new Date(raw.created_at).getTime(),
    updateAt: new Date(raw.updated_at).getTime(),
    author: {
      id: raw.author.user_id,
      name: raw.author.nickname,
      avatar: raw.author.avatar,
    },
    status: {
      commentCount: raw.status.comment_count,
      likeCount: raw.status.like_count,
      shareCount: raw.status.share_count,
      isLiked: raw.status.is_liked,
      isCollected: raw.status.is_collected,
    },
  };
};

/**
 * 用户主页逻辑
 */
export const useUserProfile = (userId: string) => {
  const loading = ref(false);
  const userInfo = ref<UserProfile | null>(null);
  
  // 帖子列表相关
  const posts = ref<Post[]>([]);
  const postsTotal = ref(0);
  const postsPage = ref(1);
  
  const pageSize = 20;

  // 加载用户信息
  const loadUserInfo = async () => {
    try {
      const res = await getUserInfo(userId);
      userInfo.value = res.data;
    } catch (error) {
      ElMessage({
        message: "加载用户信息失败",
        type: "error",
        showClose: true,
        duration: 2000,
      });
      console.error(error);
    }
  };

  // 加载用户帖子
  const loadUserPosts = async (reset = false) => {
    if (reset) {
      postsPage.value = 1;
      posts.value = [];
    }

    try {
      loading.value = true;
      const res = await getUserPosts(userId, postsPage.value, pageSize);
      // 适配旧接口返回结构 { posts: [] }
      const list = (res.data as any).posts || (res.data as any).list || [];
      const total = (res.data as any).total || list.length; // 旧接口可能没有 total
      
      const mappedPosts = list.map(mapPost);
      posts.value = reset ? mappedPosts : [...posts.value, ...mappedPosts];
      postsTotal.value = total;
    } catch (error) {
      ElMessage({
        message: "加载帖子列表失败",
        type: "error",
        showClose: true,
        duration: 2000,
      });
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  // 关注/取消关注
  const handleFollow = async () => {
    if (!userInfo.value) return;
    
    const isFollowing = userInfo.value.is_following;
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        userInfo.value.is_following = false;
        userInfo.value.followers_count = Math.max(0, userInfo.value.followers_count - 1);
        ElMessage.success("已取消关注");
      } else {
        await followUser(userId);
        userInfo.value.is_following = true;
        userInfo.value.followers_count++;
        ElMessage.success("关注成功");
      }
    } catch (error) {
      ElMessage.error(isFollowing ? "取消关注失败" : "关注失败");
    }
  };

  // 加载更多帖子
  const loadMorePosts = () => {
    if (posts.value.length < postsTotal.value) {
      postsPage.value++;
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
    postsTotal,
    loadUserPosts,
    loadMorePosts,
    handleFollow
  };
};
