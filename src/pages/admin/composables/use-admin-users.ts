/**
 * 用户管理 Composable
 */
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getAdminUsers, banUser, unbanUser, type AdminUser } from "@/api/admin";

export const useAdminUsers = () => {
  const userSearch = ref("");
  const userLoading = ref(false);
  const userList = ref<AdminUser[]>([]);
  const userPage = ref(1);
  const userPageSize = ref(20);
  const userTotal = ref(0);

  const loadUsers = async () => {
    userLoading.value = true;
    try {
      const res = await getAdminUsers({
        search: userSearch.value || undefined,
        page: userPage.value,
        page_size: userPageSize.value,
      });
      userList.value = res.data?.users || [];
      userTotal.value = res.data?.total || 0;
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      userLoading.value = false;
    }
  };

  const handleToggleBan = async (user: AdminUser) => {
    const action = user.is_forbidden ? "解封" : "封禁";
    try {
      await ElMessageBox.confirm(
        `确定要${action}用户【${user.nickname || user.student_id}】吗？`,
        "提示",
        { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
      );

      if (user.is_forbidden) {
        await unbanUser(user.id);
      } else {
        await banUser(user.id);
      }

      ElMessage.success(`${action}成功`);
      loadUsers();
    } catch (err) {
      if (err !== "cancel") {
        console.error("Ban/unban failed:", err);
      }
    }
  };

  const handleUserPageChange = (page: number) => {
    userPage.value = page;
    loadUsers();
  };

  const handleUserSizeChange = (size: number) => {
    userPageSize.value = size;
    userPage.value = 1;
    loadUsers();
  };

  return {
    userSearch,
    userLoading,
    userList,
    userPage,
    userPageSize,
    userTotal,
    loadUsers,
    handleToggleBan,
    handleUserPageChange,
    handleUserSizeChange,
  };
};
