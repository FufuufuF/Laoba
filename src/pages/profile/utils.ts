/**
 * 个人资料页面工具函数
 */
import type { UserInfo } from '@/stores/user';
import type { UpdateProfileParams } from './api';

/**
 * 从 UserInfo 中提取可编辑的字段
 */
export const extractEditableFields = (userInfo: UserInfo): UpdateProfileParams => {
  return {
    nickname: userInfo.nickname,
    avatar: userInfo.avatar,
    bio: userInfo.bio,
    tags: userInfo.tags,
  };
};

/**
 * 验证表单数据是否有修改
 */
export const hasFormChanged = (
  original: UpdateProfileParams,
  current: UpdateProfileParams
): boolean => {
  return (
    original.nickname !== current.nickname ||
    original.avatar !== current.avatar ||
    original.bio !== current.bio ||
    JSON.stringify(original.tags) !== JSON.stringify(current.tags)
  );
};

