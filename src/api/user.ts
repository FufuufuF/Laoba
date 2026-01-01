import { apiClient } from "./core/client";
import type { ApiResponse } from "./core/types";

// =====获取用户信息=====
export interface GetUserInfoResponse {
  id: number;
  student_id: string;
  username: string;
  nickname: string;
  avator: string;
  bio: string;
  tags: string[];
  role: "student" | "admin";
  is_forbidden: boolean;
  created_at: string;
  updated_at: string;
  follow_count: number;
  follower_count: number;
  is_following: boolean;
}

export const getUserInfo = (): Promise<ApiResponse<GetUserInfoResponse>> => {
  return apiClient.get(`/api/v1/user/me`);
};
