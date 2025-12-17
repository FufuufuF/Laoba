<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <div slot="header" class="card-header">
        <span>个人信息</span>
        <el-button 
          type="text" 
          @click="isEdit = !isEdit"
        >
          {{ isEdit ? '取消' : '编辑' }}
        </el-button>
      </div>

      <!-- 个人信息展示/编辑 -->
      <el-form :model="profileForm" label-width="100px" ref="profileFormRef">
        <el-form-item label="学号">
          <el-input v-model="profileForm.username" disabled />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input 
            v-model="profileForm.nickname" 
            :disabled="!isEdit"
            :rules="[
              { validator: validateNickname, trigger: 'blur' }
            ]"
          />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            v-if="isEdit"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarUpload"
            accept="image/*"
          >
            <img 
              :src="profileForm.avatar" 
              class="avatar-preview"
            />
          </el-upload>
          <img 
            v-else
            :src="profileForm.avatar" 
            class="avatar-preview"
          />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input 
            v-model="profileForm.bio" 
            type="textarea"
            rows="3"
            :disabled="!isEdit"
          />
        </el-form-item>
        <el-form-item label="兴趣标签">
          <el-select 
            v-model="profileForm.tags" 
            multiple
            placeholder="请选择兴趣标签"
            :disabled="!isEdit"
          >
            <el-option label="编程" value="编程" />
            <el-option label="阅读" value="阅读" />
            <el-option label="运动" value="运动" />
            <el-option label="音乐" value="音乐" />
            <el-option label="游戏" value="游戏" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="profileForm.role" disabled />
        </el-form-item>

        <!-- 保存按钮（编辑模式显示） -->
        <el-form-item v-if="isEdit">
          <el-button 
            type="primary"
            @click="handleSave"
            :loading="saveLoading"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 退出登录按钮 -->
    <el-button 
      type="danger"
      style="margin-top: 20px"
      @click="handleLogout"
    >
      退出登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import type { UserInfo } from '@/stores/user'; // 导入UserInfo类型
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { validateNickname } from '@/utils/validate';

// 状态初始化
const router = useRouter();
const userStore = useUserStore();
const isEdit = ref(false); // 是否编辑模式
const saveLoading = ref(false); // 保存加载中
const profileFormRef = ref();

// 个人信息表单
const profileForm = reactive<Partial<UserInfo>>({
  username: '', // 注意：这里实际是UserInfo的username，后面映射
  nickname: '',
  avatar: '',
  bio: '', // 替换原来的intro，对齐UserInfo的bio
  tags: [],
  role: 'student' as 'student' | 'admin', // 明确role的类型
});
// 初始化个人信息
onMounted(() => {
  if (userStore.userInfo) {
    profileForm.username = userStore.userInfo.username; // 用username存学号（替换原来的studentId）
    profileForm.nickname = userStore.userInfo.nickname;
    profileForm.avatar = userStore.userInfo.avatar;
    profileForm.bio = userStore.userInfo.bio || ''; // 用bio替换原来的intro
    profileForm.tags = userStore.userInfo.tags || [];
    profileForm.role = userStore.userInfo.role; // 此时role的类型是'student'|'admin'
  }
});
// 头像上传
const handleAvatarUpload = (response: any, file: any) => {
  profileForm.avatar = URL.createObjectURL(file.raw);
  ElMessage.success('头像上传成功');
};

// 保存个人信息
const handleSave = async () => {
  try {
    await profileFormRef.value.validate();
    saveLoading.value = true;
    // 只传递需要修改的字段（避免无关字段）
    userStore.editUserInfo({
      nickname: profileForm.nickname,
      avatar: profileForm.avatar,
      bio: profileForm.bio,
      tags: profileForm.tags
    });
    ElMessage.success('信息保存成功');
    isEdit.value = false;
  } catch (err) {
    console.error('保存失败：', err);
  } finally {
    saveLoading.value = false;
  }
};
// 退出登录
const handleLogout = () => {
  userStore.logout();
  ElMessage.success('退出登录成功');
  router.push('/login');
};
</script>

<style scoped>
.profile-container {
  width: 600px;
  margin: 50px auto;
}
.profile-card {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>