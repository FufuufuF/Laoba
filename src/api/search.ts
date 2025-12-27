/**
 * 搜索 API
 */
import { apiClient } from "./core/client";
import type { ApiResponse } from "./core/types";
import type { PostResponse } from "./post";

// 用户搜索结果
export interface SearchUserResult {
  id: number;
  nickname: string;
  avatar: string | null;
  bio: string | null;
}

// 搜索响应
export interface SearchResponse {
  posts?: PostResponse[];
  users?: SearchUserResult[];
}

/**
 * 搜索
 * GET /api/v1/search/?q=xxx&type=all|posts|users
 */
export const search = (
  query: string,
  type: "all" | "posts" | "users" = "all"
): Promise<ApiResponse<SearchResponse>> => {
  return apiClient.get(
    `/api/v1/search/?q=${encodeURIComponent(query)}&type=${type}`
  );
};
