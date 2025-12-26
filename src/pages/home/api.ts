/**
 * 首页相关 API
 */
import {
  getPosts as apiGetPosts,
  type PostListResponse,
  type PostResponse,
} from "@/api/post";
import { apiClient } from "@/api/core/client";
import type { ApiResponse } from "@/api/core/types";

// =====get接口=====
// 获取帖子列表

/**
 * 获取帖子列表
 * GET /api/v1/post/
 */
export const getPosts = (): Promise<ApiResponse<PostListResponse>> => {
  return apiGetPosts();
};

// =====post接口=====
// 点赞帖子

/**
 * 点赞帖子
 * POST /api/v1/post/{id}/like
 */
export const likePost = (id: number): Promise<ApiResponse<null>> => {
  return apiClient.post(`/post/${id}/like`, {});
};

// =====delete接口=====
// 删除帖子

/**
 * 删除帖子
 * DELETE /api/v1/post/{id}
 */
export const deletePost = (id: number): Promise<ApiResponse<null>> => {
  return apiClient.delete(`/post/${id}`);
};

// 导出帖子响应类型供其他地方使用
export type { PostResponse, PostListResponse };
