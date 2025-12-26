/**
 * 鉴权相关 API
 * 公用接口 - 用于登录、注册、登出、鉴权验证
 */
import { apiClient } from "./core/client";
import type { ApiResponse } from "./core/types";

// =====get接口=====
// 鉴权验证

export interface AuthCheckResponse {
  user_id: number;
}

/**
 * 验证当前用户的 cookie 是否有效
 * GET /api/v1/auth/
 */
export const checkAuth = (): Promise<ApiResponse<AuthCheckResponse>> => {
  return apiClient.get("/api/v1/auth/");
};

// =====post接口=====
// 用户注册

export interface RegisterRequest {
  username: string;
  student_id: string;
  password: string;
  nickname: string;
  bio?: string;
  tags?: string[];
}

export interface RegisterResponse {
  id: number;
  student_id: string;
  username: string;
  nickname: string;
}

/**
 * 用户注册
 * POST /api/v1/auth/register
 */
export const register = (
  data: RegisterRequest
): Promise<ApiResponse<RegisterResponse>> => {
  return apiClient.post("/api/v1/auth/register", data);
};

// =====post接口=====
// 用户登录

export interface LoginRequest {
  student_id: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  student_id: string;
  username: string;
  nickname: string;
  role: "student" | "admin";
}

/**
 * 用户登录
 * POST /api/v1/auth/login
 */
export const login = (
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  return apiClient.post("/api/v1/auth/login", data);
};

// =====post接口=====
// 用户登出

/**
 * 用户登出
 * POST /api/v1/auth/logout
 */
export const logout = (): Promise<ApiResponse<null>> => {
  return apiClient.post("/api/v1/auth/logout", {});
};
