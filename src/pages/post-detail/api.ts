/**
 * 帖子详情页面相关 API
 */
import {
  getPostDetail as apiGetPostDetail,
  type PostDetailResponse,
  type PostResponse,
} from "@/api/post";
import { apiClient } from "@/api/core/client";
import type { ApiResponse } from "@/api/core/types";

// =====get接口=====
// 获取帖子详情

/**
 * 获取帖子详情
 * GET /api/v1/post/{id}
 */
export const getPostDetail = (
  id: number
): Promise<ApiResponse<PostDetailResponse>> => {
  return apiGetPostDetail(id);
};

// =====get接口=====
// 获取评论列表

export interface CommentAuthor {
  id: number;
  nickname: string;
  avatar: string;
}

export interface Comment {
  id: number;
  author: CommentAuthor;
  content: string;
  created_at: string;
}

export interface CommentsResponse {
  comments: Comment[];
}

/**
 * 获取帖子评论列表
 * GET /api/v1/post/{id}/comments
 */
export const getComments = (
  postId: number
): Promise<ApiResponse<CommentsResponse>> => {
  return apiClient.get(`/post/${postId}/comments`);
};

// =====post接口=====
// 添加评论

export interface AddCommentRequest {
  content: string;
}

export interface AddCommentResponse {
  comment: Comment;
}

/**
 * 添加评论
 * POST /api/v1/post/{id}/comments
 */
export const addComment = (
  postId: number,
  content: string
): Promise<ApiResponse<AddCommentResponse>> => {
  const data: AddCommentRequest = { content };
  return apiClient.post(`/post/${postId}/comments`, data);
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

// 导出类型供其他地方使用
export type { PostResponse, PostDetailResponse };
