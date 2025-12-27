/**
 * 帖子操作 Composable
 * 负责点赞、收藏等操作
 */
import { type Ref } from "vue";
import { updatePostStatus } from "@/api/post";
import type { Post } from "@/types/post";

export const usePostActions = (post: Ref<Post | null>) => {
  /**
   * 处理点赞/取消点赞
   */
  const handleLike = async () => {
    if (!post.value) return;

    try {
      const action = post.value.status.isLiked ? "unlike" : "like";
      const response = await updatePostStatus(post.value.id, action);

      // 使用服务器返回的最新数据更新本地状态
      post.value.status.likeCount = response.data.status.like_count;
      post.value.status.isLiked = response.data.status.is_liked;
    } catch (e) {
      // 静默处理错误
    }
  };

  return {
    handleLike,
  };
};
