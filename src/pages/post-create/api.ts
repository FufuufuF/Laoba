/**
 * 创建帖子页面相关 API
 */
import {
  createPost as apiCreatePost,
  type CreatePostRequest,
  type CreatePostResponse,
  type MediaItem,
} from "@/api/post";
import { apiClient } from "@/api/core/client";
import type { ApiResponse } from "@/api/core/types";

// =====post接口=====
// 创建帖子

export interface CreatePostParams {
  title: string;
  content: string;
  media: MediaItem[];
  tags: string[];
  user_id: number;
}

/**
 * 创建帖子
 * POST /api/v1/post/
 */
export const createPost = (
  params: CreatePostParams
): Promise<ApiResponse<CreatePostResponse>> => {
  const data: CreatePostRequest = {
    title: params.title,
    content: params.content,
    media: params.media,
    tags: params.tags,
    user_id: params.user_id,
  };
  return apiCreatePost(data);
};

// =====post接口=====
// 上传图片

export interface UploadImageResponse {
  url: string;
}

/**
 * 上传图片
 * POST /api/v1/upload
 */
export const uploadImage = (
  file: File
): Promise<ApiResponse<UploadImageResponse>> => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post("/upload", formData);
};

// 导出媒体类型供其他地方使用
export type { MediaItem };
