<template>
  <div class="post-create">
    <h2>发布动态</h2>
    <el-form :model="form" label-width="0">
      <el-form-item>
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="6"
          placeholder="分享你的新鲜事..."
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item>
        <el-upload
          v-model:file-list="fileList"
          action="#"
          list-type="picture-card"
          :auto-upload="false"
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createPost, uploadImage } from './api';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { UploadFile, UploadUserFile } from 'element-plus';

const router = useRouter();
const form = ref({
  content: '',
  images: [] as string[]
});
const fileList = ref<UploadUserFile[]>([]);
const submitting = ref(false);

const handleFileChange = (uploadFile: UploadFile) => {
    // In a real app, you might upload immediately or wait for submit.
    // Here we assume we upload on submit or just mock it.
};

const handleRemove = (uploadFile: UploadFile) => {
    // handle remove
};

const submit = async () => {
  if (!form.value.content.trim() && fileList.value.length === 0) {
    ElMessage.warning('请输入内容或上传图片');
    return;
  }

  submitting.value = true;
  try {
    // Upload images first
    const imageUrls: string[] = [];
    for (const file of fileList.value) {
        if (file.raw) {
            // Convert to Base64 for local storage persistence
            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file.raw!);
            });
            imageUrls.push(base64);
        }
    }
    
    await createPost({
      content: form.value.content,
      images: imageUrls
    });
    
    ElMessage.success('发布成功');
    router.push('/home');
  } catch (error: any) {
    console.error(error);
    ElMessage.error(error.message || '发布失败');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.post-create {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
