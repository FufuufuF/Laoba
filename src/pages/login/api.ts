/**
 * 登录页面相关 API
 */
import { login as apiLogin, register as apiRegister, forgetPassword as apiForgetPassword } from '@/api/user';

// 登录接口参数类型
export interface LoginParams {
  studentId: string;
  password: string;
}

// 注册接口参数类型
export interface RegisterParams {
  studentId: string;
  password: string;
  nickname: string;
  avatar?: string;
  intro?: string;
  tags?: string[];
}

/**
 * 登录 API
 */
export const loginApi = (params: LoginParams) => {
  return apiLogin(params);
};

/**
 * 注册 API
 */
export const registerApi = (params: RegisterParams) => {
  return apiRegister(params);
};

/**
 * 忘记密码 API
 */
export const forgetPasswordApi = (studentId: string) => {
  return apiForgetPassword(studentId);
};

