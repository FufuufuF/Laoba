// src/composables/use-app-init.ts
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { checkAuth } from "@/api/auth";
import { useUserStore } from "@/stores/user";

/**
 * 应用初始化 Hook
 * 在应用启动时调用后端鉴权接口，验证用户登录状态
 * 如果鉴权失败则跳转到登录页
 */
export function useAppInit() {
  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();

  const isInitializing = ref(false);
  const isAuthenticated = ref(false);

  /**
   * 初始化应用：验证用户鉴权状态
   * @returns Promise<boolean> 鉴权是否成功
   */
  const initApp = async (): Promise<boolean> => {
    // 如果当前已在登录页，跳过鉴权检查，避免无限循环
    if (route.path === "/login") {
      isInitializing.value = false;
      return false;
    }

    isInitializing.value = true;

    try {
      const response = await checkAuth();

      // 鉴权成功：code === 0
      if (response.code === 0 && response.data?.user_id) {
        isAuthenticated.value = true;
        // 可选：更新 store 中的用户 ID
        // userStore.setUserData({ id: String(response.data.user_id), ... })
        return true;
      }

      // 鉴权失败：跳转到登录页
      isAuthenticated.value = false;
      userStore.clearUser();
      router.push("/login");
      return false;
    } catch (error) {
      // 请求异常（网络错误、401 等）：跳转到登录页
      console.error("[useAppInit] 鉴权失败:", error);
      isAuthenticated.value = false;
      userStore.clearUser();
      router.push("/login");
      return false;
    } finally {
      isInitializing.value = false;
    }
  };

  return {
    isInitializing,
    isAuthenticated,
    initApp,
  };
}
