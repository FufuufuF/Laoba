import { apiClient } from "@/api/core/client";
import type { ApiResponse } from "@/api/core/types";

/**
 * 个人资料页面相关 API
 */

// 更新个人信息参数类型
export interface UpdateProfileParams {
  nickname?: string;
  avatar?: string;
  bio?: string;
  tags?: string[];
}

/**
 * 更新个人信息 API
 */
export const updateProfileApi = (params: UpdateProfileParams) => {
  return apiClient.post<ApiResponse<any>>('/api/v1/user/profile', params);
};

