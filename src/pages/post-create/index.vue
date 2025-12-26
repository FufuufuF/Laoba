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
import { useRouter } from 'vue-router';
import { createPost } from '@/api/post';
import { useUserStore } from '@/stores/user';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { UploadFile, UploadUserFile } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const form = ref({
  title: '',
  text: '',
  tags: [] as string[],
  media: [] as { url: string; type: 'image' | 'video' }[]
});
const fileList = ref<UploadUserFile[]>([]);
const submitting = ref(false);

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
  if (!form.value.text.trim() && fileList.value.length === 0) {
    ElMessage.warning('请输入内容或上传图片/视频');
    return;
  }

  submitting.value = true;
  try {
    // 处理媒体文件
    const media: { url: string; type: 'image' | 'video' }[] = [];
    for (const file of fileList.value) {
      if (file.raw) {
        // 判断文件类型
        const isVideo = file.raw.type.startsWith('video/');
        // 转换为 Base64 用于本地存储
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file.raw!);
        });
        media.push({
          url: base64,
          type: isVideo ? 'video' : 'image'
        });
      }
    }
    
    const response = await createPost({
      title: form.value.title,
      content: form.value.text,
      tags: form.value.tags,
      media: media,
      user_id: Number(userStore.userInfo?.id) || 0,
    });
    
    if (response.code !== 200) {
      throw new Error(response.message || '发布失败');
    }
    
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
