// src/pages/post-create/composables/use-post-create.ts
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createPost, type MediaItem } from "@/api/post";
import { ElMessage } from "element-plus";
import type { UploadUserFile } from "element-plus";
import { convertFilesToMedia } from "../utils";

export interface PostForm {
  title: string;
  text: string;
  tags: string[];
  visibility: "public" | "friends" | "private";
}

/**
 * 发布动态的业务逻辑 Hook
 */
export function usePostCreate() {
  const router = useRouter();

  const submitting = ref(false);

  /**
   * 提交发布动态
   */
  const submitPost = async (
    form: PostForm,
    fileList: UploadUserFile[]
  ): Promise<boolean> => {
    // 表单验证
    if (!form.text.trim() && fileList.length === 0) {
      ElMessage({
        message: "请输入内容或上传图片/视频",
        type: "warning",
        showClose: true,
        duration: 2000,
      });
      return false;
    }

    submitting.value = true;

    try {
      // 处理媒体文件
      const media = await convertFilesToMedia(fileList);

      // 调用 API
      const response = await createPost({
        title: form.title,
        content: form.text,
        tags: form.tags,
        media: media,
        visibility: form.visibility,
      });

      if (response.code !== 0) {
        throw new Error(response.message || "发布失败");
      }

      ElMessage({
        message: "发布成功",
        type: "success",
        showClose: true,
        duration: 2000,
      });
      router.push("/home");
      return true;
    } catch (error: any) {
      console.error("[usePostCreate] 发布失败:", error);
      ElMessage({
        message: error.message || "发布失败",
        type: "error",
        showClose: true,
        duration: 2000,
      });
      return false;
    } finally {
      submitting.value = false;
    }
  };

  return {
    submitting,
    submitPost,
  };
}
