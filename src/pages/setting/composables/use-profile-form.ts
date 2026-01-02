/**
 * 个人资料表单逻辑组合式函数
 */
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import type { UserInfo } from "@/stores/user";
import { validateNickname } from "@/utils/validate";
import { updateProfileApi } from "../api";

export const useProfileForm = () => {
  const route = useRoute();
  const userStore = useUserStore();
  const profileFormRef = ref();
  const isEdit = ref(false);
  const saveLoading = ref(false);

  // 个人信息表单
  const profileForm = reactive<Partial<UserInfo>>({
    username: "",
    nickname: "",
    avatar: "",
    bio: "",
    tags: [],
    role: "student" as "student" | "admin",
  });

  /**
   * 初始化表单数据
   */
  const initFormData = () => {
    if (userStore.userInfo) {
      profileForm.username = userStore.userInfo.username;
      profileForm.nickname = userStore.userInfo.nickname;
      profileForm.avatar = userStore.userInfo.avatar;
      profileForm.bio = userStore.userInfo.bio || "";
      profileForm.tags = userStore.userInfo.tags || [];
      profileForm.role = userStore.userInfo.role;
    }
  };

  /**
   * 头像上传成功回调
   */
  const handleAvatarUpload = (file: any) => {
    // 将文件转换为 Base64
    if (!file.raw) return;
    const reader = new FileReader();
    reader.readAsDataURL(file.raw);
    reader.onload = () => {
      profileForm.avatar = reader.result as string;
      ElMessage({
        message: "头像已选择",
        type: "success",
        showClose: true,
        duration: 2000,
      });
    };
    reader.onerror = (error) => {
      console.error("头像转换失败:", error);
      ElMessage({
        message: "头像处理失败",
        type: "error",
        showClose: true,
        duration: 2000,
      });
    };
  };

  /**
   * 切换编辑模式
   */
  const toggleEdit = () => {
    if (isEdit.value) {
      // 取消编辑时恢复原始数据
      initFormData();
    }
    isEdit.value = !isEdit.value;
  };

  /**
   * 保存个人信息
   */
  const handleSave = async () => {
    try {
      await profileFormRef.value?.validate();
      saveLoading.value = true;

      // 调用后端 API 更新
      const res = await updateProfileApi({
        nickname: profileForm.nickname,
        avatar: profileForm.avatar,
        bio: profileForm.bio,
        tags: profileForm.tags,
      });

      // 更新用户信息
      userStore.editUserInfo({
        nickname: res.data.nickname,
        avatar: res.data.avatar,
        bio: res.data.bio,
        tags: res.data.tags,
      });

      ElMessage({
        message: "信息保存成功",
        type: "success",
        showClose: true,
        duration: 2000,
      });
      isEdit.value = false;
    } catch (err) {
      console.error("保存失败：", err);
    } finally {
      saveLoading.value = false;
    }
  };

  /**
   * 昵称校验规则
   */
  const nicknameValidator = (_rule: any, value: string) => {
    const res = validateNickname(value);
    return res.valid ? Promise.resolve() : Promise.reject(res.msg);
  };

  // 挂载时初始化表单数据
  onMounted(() => {
    initFormData();
    // 如果路由参数中有 edit=true，则自动开启编辑模式
    if (route.query.edit === 'true') {
      isEdit.value = true;
    }
  });

  return {
    profileFormRef,
    profileForm,
    isEdit,
    saveLoading,
    nicknameValidator,
    handleAvatarUpload,
    toggleEdit,
    handleSave,
  };
};
