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

export const useLogin = () => {
  const router = useRouter();
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
      ElMessage({
        message: "登录成功",
        type: "success",
        showClose: true, // 显示关闭按钮
        duration: 2000, // 显示时长，5秒后消失（默认3秒）
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
