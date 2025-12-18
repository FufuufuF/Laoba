<template>
  <div class="form-wrap">
    <el-form
      :model="loginForm"
      :rules="loginRules"
      ref="loginFormRef"
      label-width="80px"
    >
      <el-form-item label="学号" prop="studentId">
        <el-input
          v-model="loginForm.studentId"
          :placeholder="PLACEHOLDERS.login.studentId"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          :type="showPwd ? 'text' : 'password'"
          :placeholder="PLACEHOLDERS.login.password"
          suffix-icon="el-icon-view"
          @click="showPwd = !showPwd"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        <el-button
          type="text"
          @click="handleForgetClick"
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useLogin } from '../composables/use-login';
import { useForgetPassword } from '../composables/use-forget-password';
import { PLACEHOLDERS } from '../const';

const userStore = useUserStore();
const showPwd = ref(false);
const rememberMe = ref(userStore.rememberMe);

// 使用登录逻辑
const {
  loginFormRef,
  loginForm,
  loginRules,
  loginLoading,
  handleLogin,
} = useLogin();

// 使用忘记密码逻辑
const { handleForgetPwd } = useForgetPassword();

const handleForgetClick = () => {
  handleForgetPwd();
};

// loginFormRef 在模板中通过 ref 属性使用
void loginFormRef;
</script>

<style scoped>
.form-wrap {
  margin-top: 20px;
}

.btn-block {
  width: 100%;
}
</style>

