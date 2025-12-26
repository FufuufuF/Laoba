import type { MediaItem } from "@/api/post";
import type { UploadUserFile } from "element-plus";

/**
 * 将文件列表转换为媒体数组（Base64）
 */
export const convertFilesToMedia = async (
  fileList: UploadUserFile[]
): Promise<MediaItem[]> => {
  const media: MediaItem[] = [];

  for (const file of fileList) {
    if (file.raw) {
      const isVideo = file.raw.type.startsWith("video/");
      // 转换为 Base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file.raw!);
      });
      media.push({
        url: base64,
        type: isVideo ? "video" : "image",
      });
    }
  }

  return media;
};
