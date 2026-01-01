/**
 * 管理员后台 API
 */
import { apiClient } from "./core/client";
import type { ApiResponse } from "./core/types";

// ==================== Types ====================

export interface AdminUser {
  id: number;
  student_id: string;
  nickname: string | null;
  avatar: string | null;
  role: "student" | "admin";
  is_forbidden: boolean;
  created_at: string;
}

export interface AdminPost {
  id: number;
  user_id: number;
  title: string;
  content: string | null;
  media: Array<{ type: "image" | "video"; url: string }>;
  tags: string[];
  visibility: "public" | "friends" | "private";
  review_status: "pending" | "approved" | "rejected";
  created_at: string;
  author_nickname: string | null;
  author_student_id: string | null;
  author_avatar: string | null;
}

export interface AdminComment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  review_status: "pending" | "approved" | "rejected";
  created_at: string;
  author_nickname: string | null;
  post_title: string | null;
}

// 分页响应类型
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ==================== 用户管理 API ====================

export const getAdminUsers = (
  params: { search?: string; page?: number; page_size?: number } = {}
) =>
  apiClient.get<
    ApiResponse<{
      users: AdminUser[];
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
    }>
  >("/api/v1/admin/users", params);

export const banUser = (userId: number) =>
  apiClient.post<ApiResponse<null>, Record<string, never>>(
    `/api/v1/admin/users/${userId}/ban`,
    {}
  );

export const unbanUser = (userId: number) =>
  apiClient.post<ApiResponse<null>, Record<string, never>>(
    `/api/v1/admin/users/${userId}/unban`,
    {}
  );

// ==================== 帖子审核 API ====================

export const getAdminPosts = (
  params: { status?: string; page?: number; page_size?: number } = {}
) =>
  apiClient.get<
    ApiResponse<{
      posts: AdminPost[];
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
    }>
  >("/api/v1/admin/posts", params);

export const approvePost = (postId: number) =>
  apiClient.post<ApiResponse<null>, Record<string, never>>(
    `/api/v1/admin/posts/${postId}/approve`,
    {}
  );

export const rejectPost = (postId: number) =>
  apiClient.post<ApiResponse<null>, Record<string, never>>(
    `/api/v1/admin/posts/${postId}/reject`,
    {}
  );

// ==================== 评论审核 API ====================

export const getAdminComments = (
  params: { status?: string; page?: number; page_size?: number } = {}
) =>
  apiClient.get<
    ApiResponse<{
      comments: AdminComment[];
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
    }>
  >("/api/v1/admin/comments", params);

export const approveComment = (commentId: number) =>
  apiClient.post<ApiResponse<null>, Record<string, never>>(
    `/api/v1/admin/comments/${commentId}/approve`,
    {}
  );

export const rejectComment = (commentId: number) =>
  apiClient.post<ApiResponse<null>, Record<string, never>>(
    `/api/v1/admin/comments/${commentId}/reject`,
    {}
  );
