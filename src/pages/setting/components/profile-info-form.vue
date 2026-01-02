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
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleAvatarUpload"
        accept="image/*"
      >
        <div v-if="profileForm.avatar" class="avatar-wrapper">
          <img :src="profileForm.avatar" class="avatar-preview" />
          <div class="avatar-overlay">
            <el-icon><Plus /></el-icon>
          </div>
        </div>
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
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
import { Plus } from '@element-plus/icons-vue';
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
.avatar-uploader .avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-uploader .avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 24px;
}

.avatar-uploader .avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  transition: border-color 0.3s;
}

.avatar-uploader-icon:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
</style>

