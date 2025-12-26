<template>
  <div class="post-create">
    <h2>发布动态</h2>
    <el-form :model="form" label-width="0">
      <el-form-item label="标题">
        <el-input
          v-model="form.title"
          placeholder="输入标题（选填）"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="内容">
        <el-input
          v-model="form.text"
          type="textarea"
          :rows="6"
          placeholder="分享你的新鲜事..."
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="标签">
        <el-tag
          v-for="tag in form.tags"
          :key="tag"
          closable
          @close="removeTag(tag)"
          style="margin-right: 8px;"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="tagInputVisible"
          ref="tagInputRef"
          v-model="tagInputValue"
          size="small"
          style="width: 100px;"
          @keyup.enter="addTag"
          @blur="addTag"
        />
        <el-button v-else size="small" @click="showTagInput">+ 添加标签</el-button>
      </el-form-item>
      
      <el-form-item label="图片/视频">
        <el-upload
          v-model:file-list="fileList"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          accept="image/*,video/*"
          :on-change="handleFileChange"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit" :loading="submitting">发布</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import type { UploadFile, UploadUserFile } from 'element-plus';
import { usePostCreate } from './composables/use-post-create';

const { submitting, submitPost } = usePostCreate();

const form = ref({
  title: '',
  text: '',
  tags: [] as string[],
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
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
