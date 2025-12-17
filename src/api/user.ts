// src/api/user.ts
// 模拟本地用户数据（真实项目替换为后端接口请求）
import type { UserInfo } from '@/stores/user';

let mockUsers = [
  // 默认管理员账号
  {
    id: 'admin', // 新增：id字段（和studentId一致）
    studentId: 'admin',
    username: 'admin', // 新增：和studentId一致
    password: 'admin123',
    nickname: '系统管理员',
    avatar: '',
    bio: '系统管理员账号',
    tags: [],
    role: 'admin',
    isForbidden: false,
  },
];

/**
 * 注册接口
 * @param userData 注册信息
 * @returns 注册结果
 */
export const register = async (userData: any) => {
  // 检查学号是否已存在
  const exist = mockUsers.find((u) => u.studentId === userData.studentId);
  if (exist) {
    return { success: false, msg: '该学号已注册' };
  }
  // 新增用户
  mockUsers.push({
    ...userData,
    username: userData.studentId, // 补充username
     bio: userData.intro, // 新增：把intro转成bio
    role: 'student',
    isForbidden: false,
  });
  return { success: true, msg: '注册成功' };
};

/**
 * 登录接口
 * @param loginData 登录信息（学号+密码）
 * @returns 登录结果+用户信息
 */
// 修改login接口的返回类型：
export const login = async (loginData: any): Promise<{
  success: boolean;
  msg: string;
  data?: Omit<UserInfo, 'id'> & { studentId: string } // 补充studentId（映射到UserInfo的username）
}> => {
  const { studentId, password } = loginData;
  const user = mockUsers.find((u) => u.studentId === studentId);
  if (!user) {
    return { success: false, msg: '学号不存在' };
  }
  if (user.isForbidden) {
    return { success: false, msg: '该账号已被封禁' };
  }
  if (user.password !== password) {
    return { success: false, msg: '密码错误' };
  }
  // 返回数据时，确保字段和UserInfo对齐
  const { password: _, ...userInfo } = user;
  return { 
    success: true, 
    msg: '登录成功', 
    data: userInfo as Omit<UserInfo, 'id'> & { studentId: string } 
  };
};
/**
 * 获取所有用户列表（管理员用）
 * @returns 用户列表
 */
export const getUserList = async (): Promise<{
  success: boolean;
  data: UserInfo[];
}> => {
  return { success: true, data: mockUsers as UserInfo[] };
};
/**
 * 封禁/解封用户（管理员用）
 * @param studentId 学号
 * @param isForbidden 是否封禁
 * @returns 操作结果
 */
export const forbiddenUser = async (studentId: string, isForbidden: boolean) => {
  const user = mockUsers.find((u) => u.studentId === studentId);
  if (!user) {
    return { success: false, msg: '用户不存在' };
  }
  user.isForbidden = isForbidden;
  return { success: true, msg: isForbidden ? '封禁成功' : '解封成功' };
};

/**
 * 重置用户资料（管理员用）
 * @param studentId 学号
 * @returns 操作结果
 */
export const resetUserInfo = async (studentId: string) => {
  const user = mockUsers.find((u) => u.studentId === studentId);
  if (!user) {
    return { success: false, msg: '用户不存在' };
  }
  // 重置为默认值
  user.nickname = `用户${studentId.slice(-4)}`;
  user.avatar = '';
  user.bio = '';
  user.tags = [];
  return { success: true, msg: '资料重置成功' };
};

/**
 * 忘记密码（重置密码为学号后6位）
 * @param studentId 学号
 * @returns 操作结果
 */
export const forgetPassword = async (studentId: string) => {
  const user = mockUsers.find((u) => u.studentId === studentId);
  if (!user) {
    return { success: false, msg: '学号不存在' };
  }
  // 重置密码为学号后6位
  user.password = studentId.slice(-6);
  return { success: true, msg: `密码已重置为学号后6位：${studentId.slice(-6)}` };
};