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
    <login-form v-if="isLoginTab" />

    <!-- 注册表单 -->
    <register-form v-else @register-success="handleRegisterSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from './components/login-form.vue';
import RegisterForm from './components/register-form.vue';

// 标签切换状态
const isLoginTab = ref(true);

/**
 * 注册成功回调
 */
const handleRegisterSuccess = () => {
  isLoginTab.value = true;
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
</style>
