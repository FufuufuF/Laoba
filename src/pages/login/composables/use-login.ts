/**
 * 登录逻辑组合式函数
 */
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { loginApi, type LoginParams } from '../api';
import { mapToUserInfo, getRedirectPath } from '../utils';
import { LOGIN_RULES } from '../const';

export const useLogin = () => {
  const router = useRouter();
  const userStore = useUserStore();
  const loginFormRef = ref();
  const loginLoading = ref(false);

  // 登录表单数据
  const loginForm = reactive<LoginParams>({
    studentId: '',
    password: '',
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
      const res = await loginApi(loginForm);
      
      if (res.success) {
        ElMessage.success(res.msg);
        
        // 映射用户数据
        const userData = mapToUserInfo(res.data!);
        
        // 登录并存储用户信息
        userStore.login(userData);
        
        // 跳转页面
        const redirectPath = getRedirectPath(userData.role);
        router.push(redirectPath);
      } else {
        ElMessage.error(res.msg);
      }
    } catch (err) {
      console.error('登录失败：', err);
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

