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
  post_id: number;
  user: CommentAuthor;
  content: string;
  created_at: string;
}

export interface CommentsResponse {
  comments: Comment[];
}

/**
 * 获取帖子评论列表
 * GET /api/v1/comment/{id}
 */
export const getComments = (
  postId: number
): Promise<ApiResponse<CommentsResponse>> => {
  return apiClient.get(`/api/v1/comment/`, { post_id: postId });
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
  return apiClient.post(`/api/v1/post/${postId}/comments`, data);
};
