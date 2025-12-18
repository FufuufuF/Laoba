/**
 * 个人资料页面常量配置
 */

// 兴趣标签选项（与登录页保持一致）
export const INTEREST_TAGS = [
  { label: '编程', value: '编程' },
  { label: '阅读', value: '阅读' },
  { label: '运动', value: '运动' },
  { label: '音乐', value: '音乐' },
  { label: '游戏', value: '游戏' },
] as const;

// 表单字段标签
export const FORM_LABELS = {
  username: '学号',
  nickname: '昵称',
  avatar: '头像',
  bio: '个人简介',
  tags: '兴趣标签',
  role: '角色',
} as const;

