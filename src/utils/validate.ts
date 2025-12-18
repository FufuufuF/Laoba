// src/utils/validate.ts
/**
 * 学号校验：以2023开头，10位数字（可根据你的需求调整）
 * @param num 学号
 * @returns 校验结果+提示
 */
export const validateStudentId = (num: string) => {
  if (!num) return { valid: false, msg: '学号不能为空' };
  const reg = /^2023\d{6}$/; // 2023开头+6位数字=10位学号
  if (!reg.test(num)) return { valid: false, msg: '学号格式错误（示例：2023150106）' };
  return { valid: true, msg: '' };
};

/**
 * 密码校验：6-16位，包含字母+数字
 * @param pwd 密码
 * @returns 校验结果+提示
 */
export const validatePassword = (pwd: string) => {
  if (!pwd) return { valid: false, msg: '密码不能为空' };
  if (pwd.length < 6 || pwd.length > 16) return { valid: false, msg: '密码长度需6-16位' };
  const reg = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
  if (!reg.test(pwd)) return { valid: false, msg: '密码需包含字母和数字' };
  return { valid: true, msg: '' };
};

/**
 * 昵称校验：2-8位，不含特殊字符
 * @param nickname 昵称
 * @returns 校验结果+提示
 */
export const validateNickname = (nickname: string) => {
  if (!nickname) return { valid: false, msg: '昵称不能为空' };
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,8}$/;
  if (!reg.test(nickname)) return { valid: false, msg: '昵称需2-8位，仅含中文/字母/数字' };
  return { valid: true, msg: '' };
};