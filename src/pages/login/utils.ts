/**
 * 登录页面工具函数
 */
import type { UserInfo } from '@/stores/user';

/**
 * 将后端返回的用户数据映射为 UserInfo 格式
 */
export const mapToUserInfo = (data: any): UserInfo => {
  return {
    id: data.studentId,
    username: data.studentId,
    avatar: data.avatar,
    nickname: data.nickname,
    bio: data.bio,
    role: data.role as 'student' | 'admin',
    tags: data.tags,
    isForbidden: data.isForbidden,
  };
};

/**
 * 根据用户角色获取跳转路径
 */
export const getRedirectPath = (role: 'student' | 'admin'): string => {
  return role === 'admin' ? '/home/admin' : '/home/feed';
};

