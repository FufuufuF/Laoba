/**
 * 评论审核 Composable
 */
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getAdminComments,
  approveComment,
  rejectComment,
  type AdminComment,
} from "@/api/admin";

export const useAdminComments = () => {
  const commentStatusFilter = ref("pending");
  const commentLoading = ref(false);
  const commentList = ref<AdminComment[]>([]);
  const commentPage = ref(1);
  const commentPageSize = ref(20);
  const commentTotal = ref(0);

  const loadComments = async () => {
    commentLoading.value = true;
    try {
      const res = await getAdminComments({
        status: commentStatusFilter.value,
        page: commentPage.value,
        page_size: commentPageSize.value,
      });
      commentList.value = res.data?.comments || [];
      commentTotal.value = res.data?.total || 0;
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      commentLoading.value = false;
    }
  };

  const handleApproveComment = async (comment: AdminComment) => {
    try {
      await ElMessageBox.confirm(`确定通过该评论的审核吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success",
      });
      await approveComment(comment.id);
      ElMessage.success("审核通过");
      loadComments();
    } catch (err) {
      if (err !== "cancel") {
        console.error("Approve comment failed:", err);
      }
    }
  };

  const handleRejectComment = async (comment: AdminComment) => {
    try {
      await ElMessageBox.confirm(`确定拒绝该评论吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      await rejectComment(comment.id);
      ElMessage.success("已拒绝");
      loadComments();
    } catch (err) {
      if (err !== "cancel") {
        console.error("Reject comment failed:", err);
      }
    }
  };

  const handleCommentPageChange = (page: number) => {
    commentPage.value = page;
    loadComments();
  };

  const handleCommentSizeChange = (size: number) => {
    commentPageSize.value = size;
    commentPage.value = 1;
    loadComments();
  };

  return {
    commentStatusFilter,
    commentLoading,
    commentList,
    commentPage,
    commentPageSize,
    commentTotal,
    loadComments,
    handleApproveComment,
    handleRejectComment,
    handleCommentPageChange,
    handleCommentSizeChange,
  };
};
