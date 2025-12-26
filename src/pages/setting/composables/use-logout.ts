/**
 * 退出登录逻辑组合式函数
 */
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

export const useLogout = () => {
  const router = useRouter();
  const userStore = useUserStore();

  /**
   * 处理退出登录
   */
  const handleLogout = () => {
    userStore.logout();
    ElMessage({
      message: "退出登录成功",
      type: "success",
      showClose: true,
      duration: 2000,
    });
    router.push("/login");
  };

  return {
    handleLogout,
  };
};
