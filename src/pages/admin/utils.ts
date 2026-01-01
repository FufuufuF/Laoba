/**
 * Admin 页面工具函数
 */

/**
 * 格式化日期显示
 */
export const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("zh-CN");
};

/**
 * 获取审核状态对应的 Tag 类型
 */
export const getStatusTagType = (
  status: string
): "warning" | "success" | "danger" | "info" => {
  switch (status) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "info";
  }
};

/**
 * 获取审核状态的中文标签
 */
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "待审核";
    case "approved":
      return "已通过";
    case "rejected":
      return "已拒绝";
    default:
      return status;
  }
};

/**
 * 获取可见性的中文标签
 */
export const getVisibilityLabel = (visibility: string): string => {
  switch (visibility) {
    case "public":
      return "公开";
    case "friends":
      return "仅好友";
    case "private":
      return "仅自己";
    default:
      return visibility;
  }
};
