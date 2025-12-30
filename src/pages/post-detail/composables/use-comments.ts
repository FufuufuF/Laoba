/**
 * 评论功能 Composable
 * 负责评论列表加载和发表评论
 */
import { ref, type Ref } from "vue";
import { getComments, addComment } from "../api";
import type { Post } from "@/types/post";
import type { Comment } from "@/api/core/types";
import { ElMessage } from "element-plus";

export const useComments = (postId: number, post: Ref<Post | null>) => {
  const comments = ref<Comment[]>([]);
  const newComment = ref("");
  const submittingComment = ref(false);

  /**
   * 加载评论列表
   */
  const loadComments = async () => {
    try {
      const response = await getComments(postId);
      comments.value = response.data.comments.map((comment) => ({
        id: String(comment.id),
        user: {
          id: String(comment.user.id),
          nickname: comment.user.nickname,
          avatar: comment.user.avatar,
        },
        content: comment.content,
        createdAt: comment.created_at,
      }));
    } catch (e) {
      // 评论加载失败不单独提示,由帖子详情处理
    }
  };

  /**
   * 发表评论
   */
  const submitComment = async () => {
    if (!newComment.value.trim()) return;

    submittingComment.value = true;
    try {
      const response = await addComment(postId, newComment.value);
      const newCommentApi = response.data.comment;

      const commentToAdd: Comment = {
        id: String(newCommentApi.id),
        user: {
          id: String(newCommentApi.user.id),
          nickname: newCommentApi.user.nickname,
          avatar: newCommentApi.user.avatar,
        },
        content: newCommentApi.content,
        createdAt: newCommentApi.created_at,
      };

      comments.value.unshift(commentToAdd);
      newComment.value = "";

      if (post.value) {
        post.value.status.commentCount++;
      }

      ElMessage({
        message: "评论成功",
        type: "success",
        showClose: true,
        duration: 2000,
      });
    } catch (e) {
      ElMessage({
        message: "评论失败",
        type: "error",
        showClose: true,
        duration: 2000,
      });
    } finally {
      submittingComment.value = false;
    }
  };

  return {
    comments,
    newComment,
    submittingComment,
    loadComments,
    submitComment,
  };
};
