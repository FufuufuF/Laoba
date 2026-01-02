import { apiClient } from "@/api/core/client";
import type { ApiResponse } from "@/api/core/types";

// 用户列表项
export interface FollowUserItem {
  id: number;
  nickname: string | null;
  avatar: string | null;
  bio: string | null;
  is_following: boolean;
}

// 用户列表响应
export interface FollowListResponse {
  list: FollowUserItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 获取用户关注的人列表
 */
export const getFollowingList = (
  userId: number,
  page: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<FollowListResponse>> => {
  return apiClient.get(
    `/api/v1/user/users/${userId}/following?page=${page}&page_size=${pageSize}`
  );
};

/**
 * 获取用户的粉丝列表
 */
export const getFollowersList = (
  userId: number,
  page: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<FollowListResponse>> => {
  return apiClient.get(
    `/api/v1/user/users/${userId}/followers?page=${page}&page_size=${pageSize}`
  );
};
