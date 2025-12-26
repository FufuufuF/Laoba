/**
 * 登录页面常量配置
 */

// 兴趣标签选项
export const INTEREST_TAGS = [
  { label: "编程", value: "编程" },
  { label: "阅读", value: "阅读" },
  { label: "运动", value: "运动" },
  { label: "音乐", value: "音乐" },
  { label: "游戏", value: "游戏" },
] as const;

// 表单规则
export const LOGIN_RULES = {
  studentId: [{ required: true, message: "请输入学号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
} as const;

// 表单占位符
export const PLACEHOLDERS = {
  login: {
    studentId: "请输入学号（管理员输入admin）",
    password: "请输入密码",
  },
  register: {
    studentId: "请输入10位学号（示例：2023150106）",
    username: "请输入用户名",
    password: "请输入6-16位密码（字母+数字）",
    confirmPwd: "请再次输入密码",
    nickname: "请输入2-8位昵称",
    intro: "请输入个人简介（选填）",
  },
} as const;
