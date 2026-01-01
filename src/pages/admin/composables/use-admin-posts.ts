/**
 * 帖子审核 Composable
 */
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getAdminPosts,
  approvePost,
  rejectPost,
  type AdminPost,
} from "@/api/admin";

export const useAdminPosts = () => {
  const postStatusFilter = ref("pending");
  const postLoading = ref(false);
  const postList = ref<AdminPost[]>([]);
  const postPage = ref(1);
  const postPageSize = ref(20);
  const postTotal = ref(0);

  // 帖子详情弹窗状态
  const showDetailDialog = ref(false);
  const selectedPost = ref<AdminPost | null>(null);

  const loadPosts = async () => {
    postLoading.value = true;
    try {
      const res = await getAdminPosts({
        status: postStatusFilter.value,
        page: postPage.value,
        page_size: postPageSize.value,
      });
      postList.value = res.data?.posts || [];
      postTotal.value = res.data?.total || 0;
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      postLoading.value = false;
    }
  };

  const viewPostDetail = (post: AdminPost) => {
    selectedPost.value = post;
    showDetailDialog.value = true;
  };

  const closeDetailDialog = () => {
    showDetailDialog.value = false;
    selectedPost.value = null;
  };

  const handleApprovePost = async (post: AdminPost) => {
    try {
      await ElMessageBox.confirm(
        `确定通过帖子【${post.title}】的审核吗？`,
        "提示",
        { confirmButtonText: "确定", cancelButtonText: "取消", type: "success" }
      );
      await approvePost(post.id);
      ElMessage.success("审核通过");
      loadPosts();
      // 如果在详情弹窗中操作，关闭弹窗
      if (showDetailDialog.value) {
        closeDetailDialog();
      }
    } catch (err) {
      if (err !== "cancel") {
        console.error("Approve post failed:", err);
      }
    }
  };

  const handleRejectPost = async (post: AdminPost) => {
    try {
      await ElMessageBox.confirm(`确定拒绝帖子【${post.title}】吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      await rejectPost(post.id);
      ElMessage.success("已拒绝");
      loadPosts();
      if (showDetailDialog.value) {
        closeDetailDialog();
      }
    } catch (err) {
      if (err !== "cancel") {
        console.error("Reject post failed:", err);
      }
    }
  };

  const handlePostPageChange = (page: number) => {
    postPage.value = page;
    loadPosts();
  };

  const handlePostSizeChange = (size: number) => {
    postPageSize.value = size;
    postPage.value = 1;
    loadPosts();
  };

  return {
    postStatusFilter,
    postLoading,
    postList,
    postPage,
    postPageSize,
    postTotal,
    showDetailDialog,
    selectedPost,
    loadPosts,
    viewPostDetail,
    closeDetailDialog,
    handleApprovePost,
    handleRejectPost,
    handlePostPageChange,
    handlePostSizeChange,
  };
};
