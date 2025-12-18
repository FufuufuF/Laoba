<template>
  <div class="form-wrap">
    <el-form
      :model="registerForm"
      :rules="registerRules"
      ref="registerFormRef"
      label-width="80px"
    >
      <el-form-item label="学号" prop="studentId">
        <el-input
          v-model="registerForm.studentId"
          :placeholder="PLACEHOLDERS.register.studentId"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          :placeholder="PLACEHOLDERS.register.password"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input
          v-model="registerForm.confirmPwd"
          type="password"
          :placeholder="PLACEHOLDERS.register.confirmPwd"
          :rules="[{ validator: validateConfirmPwd, trigger: 'blur' }]"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="registerForm.nickname"
          :placeholder="PLACEHOLDERS.register.nickname"
        />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          action="#"
          :show-file-list="false"
          :on-success="handleAvatarUpload"
          accept="image/*"
        >
          <img
            v-if="registerForm.avatar"
            :src="registerForm.avatar"
            class="avatar-preview"
          />
          <el-button v-else icon="el-icon-plus">上传头像</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input
          v-model="registerForm.intro"
          type="textarea"
          :placeholder="PLACEHOLDERS.register.intro"
          rows="3"
        />
      </el-form-item>
      <el-form-item label="兴趣标签">
        <el-select
          v-model="registerForm.tags"
          multiple
          placeholder="请选择兴趣标签（可多选）"
        >
          <el-option
            v-for="tag in INTEREST_TAGS"
            :key="tag.value"
            :label="tag.label"
            :value="tag.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="btn-block"
          @click="handleRegisterClick"
          :loading="registerLoading"
        >
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useRegister } from '../composables/use-register';
import { INTEREST_TAGS, PLACEHOLDERS } from '../const';

// 定义事件
const emit = defineEmits<{
  (e: 'register-success'): void;
}>();

// 使用注册逻辑
const {
  registerFormRef,
  registerForm,
  registerRules,
  registerLoading,
  validateConfirmPwd,
  handleAvatarUpload,
  handleRegister,
} = useRegister();

/**
 * 处理注册点击
 */
const handleRegisterClick = async () => {
  const success = await handleRegister();
  if (success) {
    emit('register-success');
  }
};
</script>

<style scoped>
.form-wrap {
  margin-top: 20px;
}

.btn-block {
  width: 100%;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>

