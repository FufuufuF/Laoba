/**
 * 帖子详情 Composable
 * 负责加载帖子详情数据和状态管理
 */
import { ref } from "vue";
import { getPostDetail } from "../api";
import type { Post } from "@/types/post";
import type { PostResponse } from "@/api/post";
import { ElMessage } from "element-plus";

/**
 * 将 API 响应的帖子数据转换为本地 Post 类型
 */
const transformApiPost = (apiPost: PostResponse): Post => {
  return {
    id: apiPost.id,
    title: apiPost.title,
    content: apiPost.content || "",
    media: apiPost.media || [],
    tags: apiPost.tags || [],
    createAt: new Date(apiPost.created_at).getTime(),
    updateAt: new Date(apiPost.updated_at).getTime(),
    author: {
      id: apiPost.author.user_id,
      name: apiPost.author.nickname,
      avatar: apiPost.author.avatar || "",
    },
    status: {
      commentCount: apiPost.status.comment_count,
      likeCount: apiPost.status.like_count,
      shareCount: apiPost.status.share_count,
      isLiked: apiPost.status.is_liked,
      isCollected: apiPost.status.is_collected,
    },
  };
};

export const usePostDetail = (postId: number) => {
  const post = ref<Post | null>(null);
  const loading = ref(false);

  /**
   * 加载帖子详情
   */
  const loadPostDetail = async () => {
    loading.value = true;
    try {
      const response = await getPostDetail(postId);
      const apiPost = response.data.post;
      if (apiPost) {
        post.value = transformApiPost(apiPost);
      }
    } catch (e) {
      ElMessage({
        message: "加载动态失败",
        type: "error",
        showClose: true,
        duration: 2000,
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    post,
    loading,
    loadPostDetail,
  };
};
