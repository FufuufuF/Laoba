/**
 * 注册逻辑组合式函数
 */
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import {
  validateStudentId,
  validatePassword,
  validateNickname,
} from "@/utils/validate";
import { register as registerApi } from "../api";
import type { RegisterFormData } from "../types";

export const useRegister = () => {
  const registerFormRef = ref();
  const registerLoading = ref(false);

  // 注册表单数据
  const registerForm = reactive<RegisterFormData & { confirmPwd: string }>({
    studentId: "",
    password: "",
    confirmPwd: "",
    nickname: "",
    username: "",
    avatar: "",
    bio: "",
    tags: [],
  });

  // 注册表单规则
  const registerRules = reactive({
    studentId: [
      { required: true, message: "请输入学号", trigger: "blur" },
      {
        validator: (_rule: any, value: string) => {
          const res = validateStudentId(value);
          return res.valid ? Promise.resolve() : Promise.reject(res.msg);
        },
        trigger: "blur",
      },
    ],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      {
        validator: (_rule: any, value: string) => {
          const res = validatePassword(value);
          return res.valid ? Promise.resolve() : Promise.reject(res.msg);
        },
        trigger: "blur",
      },
    ],
    nickname: [
      { required: true, message: "请输入昵称", trigger: "blur" },
      {
        validator: (_rule: any, value: string) => {
          const res = validateNickname(value);
          return res.valid ? Promise.resolve() : Promise.reject(res.msg);
        },
        trigger: "blur",
      },
    ],
  });

  /**
   * 确认密码校验
   */
  const validateConfirmPwd = (_rule: any, value: string) => {
    if (!value) {
      return Promise.reject("请再次输入密码");
    }
    if (value !== registerForm.password) {
      return Promise.reject("两次输入的密码不一致");
    }
    return Promise.resolve();
  };

  /**
   * 头像上传成功回调
   */
  const handleAvatarUpload = (_response: any, file: any) => {
    registerForm.avatar = URL.createObjectURL(file.raw);
    ElMessage({
      message: "头像上传成功",
      type: "success",
      showClose: true,
      duration: 2000,
    });
  };

  /**
   * 执行注册
   * @returns 是否注册成功
   */
  const handleRegister = async (): Promise<boolean> => {
    try {
      // 表单校验
      await registerFormRef.value.validate();
      registerLoading.value = true;

      // 调用注册接口
      await registerApi({
        student_id: registerForm.studentId,
        password: registerForm.password,
        username: registerForm.username,
        nickname: registerForm.nickname,
        avatar: registerForm.avatar,
        bio: registerForm.bio,
        tags: registerForm.tags,
      });
      ElMessage({
        message: "注册成功",
        type: "success",
        showClose: true, // 显示关闭按钮
        duration: 2000, // 显示时长，5秒后消失（默认3秒）
      });
      return true;
    } catch (err) {
      console.error("注册失败：", err);
      return false;
    } finally {
      registerLoading.value = false;
    }
  };

  return {
    registerFormRef,
    registerForm,
    registerRules,
    registerLoading,
    validateConfirmPwd,
    handleAvatarUpload,
    handleRegister,
  };
};
