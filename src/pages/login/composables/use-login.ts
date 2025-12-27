/**
 * 登录逻辑组合式函数
 */
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getRedirectPath } from "../utils";
import { LOGIN_RULES } from "../const";
import type { LoginFormData } from "../types";
import { login as loginApi } from "../api";
import type { LoginRequest } from "@/api/auth";
import { useUserStore } from "@/stores/user";

export const useLogin = () => {
  const router = useRouter();
  const userStore = useUserStore();
  const loginFormRef = ref();
  const loginLoading = ref(false);

  // 登录表单数据
  const loginForm = reactive<LoginFormData>({
    studentId: "",
    password: "",
  });

  // 登录表单规则
  const loginRules = LOGIN_RULES;

  /**
   * 执行登录
   */
  const handleLogin = async () => {
    try {
      // 表单校验
      await loginFormRef.value.validate();
      loginLoading.value = true;

      // 调用登录接口
      const res = await loginApi({
        student_id: loginForm.studentId,
        password: loginForm.password,
      } as LoginRequest);

      // 更新用户状态到 store
      userStore.setUserData({
        id: String(res.data.id),
        username: res.data.student_id,
        nickname: res.data.nickname,
        avatar: "", // 登录响应中没有头像，后续可以从用户信息接口获取
        role: res.data.role,
      });
      // 设置 token 标识已登录
      userStore.setToken(`token-${res.data.id}-${Date.now()}`);

      ElMessage({
        message: "登录成功",
        type: "success",
        showClose: true,
        duration: 2000,
      });
      router.push(getRedirectPath(res.data.role));
    } catch (err) {
      console.error("登录失败：", err);
    } finally {
      loginLoading.value = false;
    }
  };

  return {
    loginFormRef,
    loginForm,
    loginRules,
    loginLoading,
    handleLogin,
  };
};
