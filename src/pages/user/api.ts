import { apiClient } from "@/api/core/client";
import type { ApiResponse } from "@/api/core/types";

// 后端原始帖子结构
export interface RawPost {
  id: number;
  user_id: number;
  title: string;
  content: string;
  media: { url: string; type: "image" | "video" }[];
  tags: string[];
  created_at: string;
  updated_at: string;
  visibility: string;
  author: {
    user_id: number;
    avatar: string;
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

// 用户详情响应接口
export interface UserProfile {
  id: number;
  student_id: string;
  username: string;
  nickname: string | null;
  avatar: string | null;
  bio: string | null;
  tags: string[] | null;
  role: "user" | "admin";
  is_forbidden: boolean;
  created_at: string;
  updated_at: string;
  followers_count: number;
  following_count: number;
  is_following: boolean;
  likes_received: number; // 用户收到的总点赞数
  // 前端兼容字段（可选，后端暂无）
  background?: string;
  likeCount?: number; // 可删除，使用 likes_received 代替
}

// 帖子列表响应接口
export interface UserPostsResponse {
  list: RawPost[];
  total: number;
}

// 关注状态响应接口
export interface FollowResponse {
  is_following: boolean;
}

/**
 * 获取用户详情
 * @param userId 用户ID
 */
export const getUserInfo = (userId: string | number) => {
  return apiClient.get<ApiResponse<UserProfile>>(
    `/api/v1/user/users/${userId}`
  );
};

/**
 * 获取用户发布的帖子
 * @param userId 用户ID
 * @param page 页码
 * @param pageSize 每页数量
 */
export const getUserPosts = (
  userId: string | number,
  page = 1,
  pageSize = 20
) => {
  return apiClient.get<ApiResponse<UserPostsResponse>>(
    `/api/v1/user/users/${userId}/posts`,
    {
      params: { page, page_size: pageSize },
    }
  );
};

/**
 * 获取用户收藏的帖子
 * @param userId 用户ID
 * @param page 页码
 * @param pageSize 每页数量
 */
export const getUserFavorites = (
  userId: string | number,
  page = 1,
  pageSize = 20
) => {
  return apiClient.get<ApiResponse<UserPostsResponse>>(
    `/api/v1/user/users/${userId}/favorites`,
    {
      params: { page, page_size: pageSize },
    }
  );
};

/**
 * 关注用户
 * @param userId 目标用户ID
 */
export const followUser = (userId: string | number) => {
  return apiClient.post<ApiResponse<FollowResponse>>(
    `/api/v1/user/users/${userId}/follow`,
    {}
  );
};

/**
 * 取消关注用户
 * @param userId 目标用户ID
 */
export const unfollowUser = (userId: string | number) => {
  return apiClient.delete<ApiResponse<FollowResponse>>(
    `/api/v1/user/users/${userId}/follow`
  );
};
