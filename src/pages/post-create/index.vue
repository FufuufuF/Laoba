<template>
  <div class="post-create">
    <div class="post-create-header">
      <h2>发布动态</h2>
      <p class="subtitle">分享你的想法和生活</p>
    </div>

    <el-form :model="form" label-position="top" class="post-form">
      <!-- 基本信息区域 -->
      <div class="form-section">
        <el-form-item label="标题">
          <el-input
            v-model="form.title"
            placeholder="给你的动态起个标题（选填）"
            maxlength="50"
            show-word-limit
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="内容" class="content-item">
          <el-input
            v-model="form.text"
            type="textarea"
            :rows="8"
            placeholder="分享你的新鲜事..."
            maxlength="500"
            show-word-limit
            resize="none"
          />
        </el-form-item>
      </div>

      <!-- 标签区域 -->
      <div class="form-section">
        <el-form-item label="标签">
          <div class="tags-container">
            <el-tag
              v-for="tag in form.tags"
              :key="tag"
              closable
              @close="removeTag(tag)"
              effect="plain"
              round
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="tagInputVisible"
              ref="tagInputRef"
              v-model="tagInputValue"
              size="small"
              class="tag-input"
              @keyup.enter="addTag"
              @blur="addTag"
            />
            <el-button v-else size="small" @click="showTagInput" class="add-tag-btn">
              <el-icon><Plus /></el-icon>
              添加标签
            </el-button>
          </div>
        </el-form-item>
      </div>

      <!-- 媒体区域 -->
      <div class="form-section">
        <el-form-item label="图片/视频">
          <el-upload
            v-model:file-list="fileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            accept="image/*,video/*"
            :on-change="handleFileChange"
            :on-remove="handleRemove"
            class="media-upload"
          >
            <div class="upload-trigger">
              <el-icon class="upload-icon"><Plus /></el-icon>
              <span class="upload-text">上传</span>
            </div>
          </el-upload>
          <div class="upload-tip">支持图片和视频，单个文件不超过 10MB</div>
        </el-form-item>
      </div>

      <!-- 可见范围区域 -->
      <div class="form-section">
        <el-form-item label="可见范围">
          <el-radio-group v-model="form.visibility" class="visibility-group">
            <el-radio-button value="public">
              <span class="visibility-option">🌐 公开</span>
            </el-radio-button>
            <el-radio-button value="friends">
              <span class="visibility-option">👥 好友可见</span>
            </el-radio-button>
            <el-radio-button value="private">
              <span class="visibility-option">🔒 仅自己</span>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>

      <!-- 操作按钮区域 -->
      <div class="form-actions">
        <el-button @click="$router.back()" size="large">取消</el-button>
        <el-button type="primary" @click="submit" :loading="submitting" size="large">
          <el-icon v-if="!submitting"><Check /></el-icon>
          发布动态
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { Plus, Check } from '@element-plus/icons-vue';
import type { UploadFile, UploadUserFile } from 'element-plus';
import { usePostCreate } from './composables/use-post-create';

const { submitting, submitPost } = usePostCreate();

const form = ref({
  title: '',
  text: '',
  tags: [] as string[],
  visibility: 'public' as 'public' | 'friends' | 'private',
});
const fileList = ref<UploadUserFile[]>([]);

// 标签相关
const tagInputVisible = ref(false);
const tagInputValue = ref('');
const tagInputRef = ref();

const showTagInput = () => {
  tagInputVisible.value = true;
  nextTick(() => {
    tagInputRef.value?.focus();
  });
};

const addTag = () => {
  const tag = tagInputValue.value.trim();
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag);
  }
  tagInputValue.value = '';
  tagInputVisible.value = false;
};

const removeTag = (tag: string) => {
  form.value.tags = form.value.tags.filter(t => t !== tag);
};

const handleFileChange = (uploadFile: UploadFile) => {
  // 文件已添加到列表
};

const handleRemove = (uploadFile: UploadFile) => {
  // 文件已从列表移除
};

const submit = async () => {
  await submitPost(form.value, fileList.value);
};
</script>

<style scoped>
.post-create {
  padding: 24px;
  max-width: 680px;
  margin: 0 auto;
}

.post-create-header {
  margin-bottom: 32px;
}

.post-create-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.post-create-header .subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--el-border-color-lighter);
}

.form-section :deep(.el-form-item) {
  margin-bottom: 16px;
}

.form-section :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.form-section :deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--el-text-color-primary);
  padding-bottom: 8px;
}

.content-item :deep(.el-textarea__inner) {
  font-size: 15px;
  line-height: 1.6;
}

/* 标签区域 */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-input {
  width: 100px;
}

.add-tag-btn {
  border-style: dashed;
}

/* 上传区域 */
.media-upload :deep(.el-upload--picture-card) {
  border-radius: 8px;
  border: 2px dashed var(--el-border-color);
  transition: all 0.2s;
}

.media-upload :deep(.el-upload--picture-card:hover) {
  border-color: var(--el-color-primary);
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.upload-icon {
  font-size: 24px;
  color: var(--el-text-color-secondary);
}

.upload-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

/* 可见范围 */
.visibility-group {
  display: flex;
  gap: 0;
}

.visibility-option {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 操作按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}

.form-actions .el-button {
  min-width: 100px;
}

/* 响应式 */
@media (max-width: 640px) {
  .post-create {
    padding: 16px;
  }
  
  .form-section {
    padding: 16px;
  }
  
  .post-create-header h2 {
    font-size: 24px;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .form-actions .el-button {
    width: 100%;
  }
}
</style>
