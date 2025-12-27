/**
 * 登录提示 Composable
 * 用于在游客模式下提示用户登录
 */
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ElMessageBox } from "element-plus";

export function useLoginPrompt() {
  const router = useRouter();
  const userStore = useUserStore();
  const showLoginDialog = ref(false);
  const loginPromptMessage = ref("");

  /**
   * 检查用户是否已登录
   */
  const isLoggedIn = () => userStore.isLoggedIn;

  /**
   * 需要登录才能进行的操作
   * 如果用户未登录，显示登录提示
   * @param action 登录后要执行的操作
   * @param message 自定义提示消息
   * @returns 是否已登录（可以继续操作）
   */
  const requireLogin = async (
    action?: () => void,
    message?: string
  ): Promise<boolean> => {
    if (userStore.isLoggedIn) {
      action?.();
      return true;
    }

    // 使用 ElMessageBox 显示登录提示
    try {
      await ElMessageBox.confirm(
        message || "请先登录后再进行此操作",
        "需要登录",
        {
          confirmButtonText: "去登录",
          cancelButtonText: "取消",
          type: "warning",
        }
      );
      router.push("/login");
    } catch {
      // 用户点击取消，不做任何操作
    }
    return false;
  };

  /**
   * 显示登录提示对话框（用于组件模式）
   */
  const showPrompt = (message?: string) => {
    loginPromptMessage.value = message || "";
    showLoginDialog.value = true;
  };

  /**
   * 隐藏登录提示对话框
   */
  const hidePrompt = () => {
    showLoginDialog.value = false;
  };

  return {
    isLoggedIn,
    requireLogin,
    showLoginDialog,
    loginPromptMessage,
    showPrompt,
    hidePrompt,
  };
}
