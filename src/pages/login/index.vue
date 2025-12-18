<template>
  <div class="login-container">
    <!-- 登录/注册标签切换 -->
    <div class="tab-header">
      <div 
        class="tab-item" 
        :class="{ active: isLoginTab }"
        @click="isLoginTab = true"
      >
        登录
      </div>
      <div 
        class="tab-item" 
        :class="{ active: !isLoginTab }"
        @click="isLoginTab = false"
      >
        注册
      </div>
    </div>

    <!-- 登录表单 -->
    <div class="form-wrap" v-if="isLoginTab">
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
        <el-form-item label="学号" prop="studentId">
          <el-input 
            v-model="loginForm.studentId" 
            placeholder="请输入学号（管理员输入admin）"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="loginForm.password" 
            :type="userStore.showPwd ? 'text' : 'password'"
            placeholder="请输入密码"
            suffix-icon="el-icon-view"
            @click="userStore.showPwd = !userStore.showPwd"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="userStore.rememberMe">记住我</el-checkbox>
          <el-button 
            type="text" 
            @click="handleForgetPwd"
            style="float: right"
          >
            忘记密码？
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            class="btn-block"
            @click="handleLogin"
            :loading="loginLoading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 注册表单 -->
    <div class="form-wrap" v-else>
      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="80px">
        <el-form-item label="学号" prop="studentId">
          <el-input 
            v-model="registerForm.studentId" 
            placeholder="请输入10位学号（示例：2023150106）"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="registerForm.password" 
            type="password"
            placeholder="请输入6-16位密码（字母+数字）"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input 
            v-model="registerForm.confirmPwd" 
            type="password"
            placeholder="请再次输入密码"
            :rules="[
              { validator: validateConfirmPwd, trigger: 'blur' }
            ]"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input 
            v-model="registerForm.nickname" 
            placeholder="请输入2-8位昵称"
          />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarUpload"
            accept="image/*"
          >
            <img 
              v-if="registerForm.avatar" 
              :src="registerForm.avatar" 
              class="avatar-preview"
            />
            <el-button v-else icon="el-icon-plus">上传头像</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input 
            v-model="registerForm.intro" 
            type="textarea"
            placeholder="请输入个人简介（选填）"
            rows="3"
          />
        </el-form-item>
        <el-form-item label="兴趣标签">
          <el-select 
            v-model="registerForm.tags" 
            multiple
            placeholder="请选择兴趣标签（可多选）"
          >
            <el-option label="编程" value="编程" />
            <el-option label="阅读" value="阅读" />
            <el-option label="运动" value="运动" />
            <el-option label="音乐" value="音乐" />
            <el-option label="游戏" value="游戏" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            class="btn-block"
            @click="handleRegister"
            :loading="registerLoading"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore, type UserInfo } from '@/stores/user';
import { login, register, forgetPassword } from '@/api/user';
import { validateStudentId, validatePassword, validateNickname } from '@/utils/validate';

// 状态初始化
const router = useRouter();
const userStore = useUserStore();
const isLoginTab = ref(true); // 切换登录/注册标签
const loginLoading = ref(false); // 登录加载中
const registerLoading = ref(false); // 注册加载中

// 登录表单
const loginFormRef = ref();
const loginForm = reactive({
  studentId: '',
  password: '',
});
// 登录表单校验规则
const loginRules = reactive({
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

// 注册表单
const registerFormRef = ref();
const registerForm = reactive({
  studentId: '',
  password: '',
  confirmPwd: '',
  nickname: '',
  avatar: '',
  intro: '',
  tags: [],
});
// 注册表单校验规则
const registerRules = reactive({
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { validator: (rule: any, value: string) => {
      const res = validateStudentId(value);
      return res.valid ? Promise.resolve() : Promise.reject(res.msg);
    }, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: (rule: any, value: string) => {
      const res = validatePassword(value);
      return res.valid ? Promise.resolve() : Promise.reject(res.msg);
    }, trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { validator: (rule: any, value: string) => {
      const res = validateNickname(value);
      return res.valid ? Promise.resolve() : Promise.reject(res.msg);
    }, trigger: 'blur' }
  ],
});

// 确认密码校验
const validateConfirmPwd = (rule: any, value: string) => {
  if (!value) {
    return Promise.reject('请再次输入密码');
  }
  if (value !== registerForm.password) {
    return Promise.reject('两次输入的密码不一致');
  }
  return Promise.resolve();
};

// 头像上传（模拟，真实项目替换为后端上传接口）
const handleAvatarUpload = (response: any, file: any) => {
  // 模拟获取图片地址
  registerForm.avatar = URL.createObjectURL(file.raw);
  ElMessage.success('头像上传成功');
};

// 登录方法
const handleLogin = async () => {
  try {
    // 表单校验
    await loginFormRef.value.validate();
    loginLoading.value = true;
    // 调用登录接口
    const res = await login(loginForm);
if (res.success) {
  ElMessage.success(res.msg);
  // 新增：类型映射（把res.data转成UserInfo格式）
  const userData: UserInfo = {
    id: res.data!.studentId,
    username: res.data!.studentId,
    avatar: res.data!.avatar,
    nickname: res.data!.nickname,
    bio: res.data!.bio, // 直接用bio（不用intro了）
    role: res.data!.role as 'student' | 'admin',
    tags: res.data!.tags,
    isForbidden: res.data!.isForbidden
  };  // 调用login时传入映射后的userData
  userStore.login(userData);
  // 跳转页面
router.push(res.data!.role === 'admin' ? '/home/admin' : '/home/profile');}    else {
      ElMessage.error(res.msg);
    }
  } catch (err) {
    console.error('登录失败：', err);
  } finally {
    loginLoading.value = false;
  }
};

// 注册方法
const handleRegister = async () => {
  try {
    // 表单校验
    await registerFormRef.value.validate();
    registerLoading.value = true;
    // 调用注册接口
    const res = await register({
      studentId: registerForm.studentId,
      password: registerForm.password,
      nickname: registerForm.nickname,
      avatar: registerForm.avatar,
      intro: registerForm.intro,
      tags: registerForm.tags,
    });
    if (res.success) {
      ElMessage.success(res.msg);
      // 注册成功后切回登录标签
      isLoginTab.value = true;
      // 清空注册表单
      registerFormRef.value.resetFields();
      registerForm.avatar = '';
    } else {
      ElMessage.error(res.msg);
    }
  } catch (err) {
    console.error('注册失败：', err);
  } finally {
    registerLoading.value = false;
  }
};

// 忘记密码
const handleForgetPwd = async () => {
  try {
    const { value: studentId } = await ElMessageBox.prompt(
      '请输入你的学号',
      '忘记密码',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: /^2023\d{6}$|^admin$/, // 支持管理员和学生
        inputErrorMessage: '学号格式错误',
      }
    );
    // 调用忘记密码接口
    const res = await forgetPassword(studentId);
    if (res.success) {
      ElMessage.success(res.msg);
    } else {
      ElMessage.error(res.msg);
    }
  } catch (err) {
    ElMessage.info('已取消');
  }
};
</script>

<style scoped>
.login-container {
  width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.tab-header {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e6e6e6;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  cursor: pointer;
}
.tab-item.active {
  color: #409eff;
  border-bottom: 2px solid #409eff;
}
.form-wrap {
  margin-top: 20px;
}
.btn-block {
  width: 100%;
}
.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>