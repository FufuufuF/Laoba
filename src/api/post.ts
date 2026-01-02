/**
 * 帖子相关 API
 * 公用接口 - 用于获取帖子列表、创建帖子、获取帖子详情
 */
import { apiClient } from "./core/client";
import type { ApiResponse } from "./core/types";

// =====通用类型=====

export interface MediaItem {
  url: string;
  type: "image" | "video";
}

export interface PostResponse {
  id: number;
  user_id: number;
  title: string;
  content: string | null;
  media: MediaItem[] | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  author: {
    user_id: number;
    avatar?: string;
    nickname: string;
  };
  status: {
    view_count: number;
    like_count: number;
    comment_count: number;
    share_count: number;
    is_liked: boolean;
    is_collected: boolean;
  };
}

// =====get接口=====
// 获取帖子列表

export interface PostListResponse {
  posts: PostResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 获取帖子列表
 * GET /api/v1/post/?sort_by=latest|hot&page=1&page_size=20
 */
export const getPosts = (
  sortBy: "latest" | "hot" = "latest",
  page: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PostListResponse>> => {
  return apiClient.get(
    `/api/v1/post/?sort_by=${sortBy}&page=${page}&page_size=${pageSize}`
  );
};

/**
 * 获取指定用户的帖子列表
 * GET /api/v1/user/users/{user_id}/posts
 */
export const getUserPosts = (
  userId: number | string
): Promise<ApiResponse<PostListResponse>> => {
  return apiClient.get(`/api/v1/user/users/${userId}/posts`);
};

// =====post接口=====
// 创建帖子

export interface CreatePostRequest {
  title: string;
  content: string;
  media: MediaItem[];
  tags: string[];
}

export interface CreatePostResponse {
  post: PostResponse;
}

/**
 * 创建帖子
 * POST /api/v1/post/
 */
export const createPost = (
  data: CreatePostRequest
): Promise<ApiResponse<CreatePostResponse>> => {
  return apiClient.post("/api/v1/post/", data);
};

// =====get接口=====
// 获取帖子详情

export interface PostDetailResponse {
  post: PostResponse | null;
}

/**
 * 获取帖子详情
 * GET /api/v1/post/{post_id}
 */
export const getPostDetail = (
  postId: number
): Promise<ApiResponse<PostDetailResponse>> => {
  return apiClient.get(`/api/v1/post/${postId}`);
};

// =====修改帖子状态接口(点赞收藏)=====
export const updatePostStatus = (
  postId: number,
  action: "like" | "unlike" | "collect" | "uncollect"
): Promise<ApiResponse<PostResponse>> => {
  return apiClient.post(`/api/v1/post/${postId}/`, { action });
};
