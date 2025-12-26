/**
 * 忘记密码逻辑组合式函数
 */
import { ElMessage, ElMessageBox } from "element-plus";
// import { forgetPasswordApi } from '../api';

export const useForgetPassword = () => {
  /**
   * 处理忘记密码
   */
  const handleForgetPwd = async () => {
    try {
      const { value: studentId } = await ElMessageBox.prompt(
        "请输入你的学号",
        "忘记密码",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          inputPattern: /^2023\d{6}$|^admin$/,
          inputErrorMessage: "学号格式错误",
        }
      );

      // 调用忘记密码接口
      //   const res = await forgetPasswordApi(studentId);
      const res = { success: true, msg: "" };

      if (res.success) {
        ElMessage({
          message: res.msg,
          type: "success",
          showClose: true,
          duration: 2000,
        });
      } else {
        ElMessage({
          message: res.msg,
          type: "error",
          showClose: true,
          duration: 2000,
        });
      }
    } catch (err) {
      ElMessage({
        message: "已取消",
        type: "info",
        showClose: true,
        duration: 2000,
      });
    }
  };

  return {
    handleForgetPwd,
  };
};
