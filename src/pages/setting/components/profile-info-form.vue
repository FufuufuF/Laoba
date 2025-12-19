<template>
  <el-form
    :model="profileForm"
    label-width="100px"
    ref="profileFormRef"
  >
    <el-form-item :label="FORM_LABELS.username">
      <el-input v-model="profileForm.username" disabled />
    </el-form-item>

    <el-form-item :label="FORM_LABELS.nickname" prop="nickname">
      <el-input
        v-model="profileForm.nickname"
        :disabled="!isEdit"
        :rules="[{ validator: nicknameValidator, trigger: 'blur' }]"
      />
    </el-form-item>

    <el-form-item :label="FORM_LABELS.avatar">
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

    <el-form-item :label="FORM_LABELS.bio">
      <el-input
        v-model="profileForm.bio"
        type="textarea"
        rows="3"
        :disabled="!isEdit"
      />
    </el-form-item>

    <el-form-item :label="FORM_LABELS.tags">
      <el-select
        v-model="profileForm.tags"
        multiple
        placeholder="请选择兴趣标签"
        :disabled="!isEdit"
      >
        <el-option
          v-for="tag in INTEREST_TAGS"
          :key="tag.value"
          :label="tag.label"
          :value="tag.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="FORM_LABELS.role">
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
</template>

<script setup lang="ts">
import { useProfileForm } from '../composables/use-profile-form';
import { INTEREST_TAGS, FORM_LABELS } from '../const';

// 定义 props
defineProps<{
  isEdit: boolean;
}>();

// 使用表单逻辑
const {
  profileFormRef,
  profileForm,
  saveLoading,
  nicknameValidator,
  handleAvatarUpload,
  handleSave,
} = useProfileForm();
</script>

<style scoped>
.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}
</style>

