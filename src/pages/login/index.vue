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

    <!-- 游客模式入口 -->
    <div class="guest-mode">
      <el-divider>或者</el-divider>
      <el-button 
        type="default" 
        class="guest-button"
        @click="enterGuestMode"
      >
        <el-icon><View /></el-icon>
        以游客身份浏览
      </el-button>
      <p class="guest-hint">游客模式下可浏览内容，但无法进行互动操作</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { View } from '@element-plus/icons-vue';
import LoginForm from './components/login-form.vue';
import RegisterForm from './components/register-form.vue';

const router = useRouter();

// 标签切换状态
const isLoginTab = ref(true);

/**
 * 注册成功回调
 */
const handleRegisterSuccess = () => {
  isLoginTab.value = true;
};

/**
 * 进入游客模式
 */
const enterGuestMode = () => {
  router.push('/home');
};
</script>

<style scoped>
.login-container {
  width: 400px;
  margin: 80px auto;
  padding: 24px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background-color: var(--el-bg-color);
}

.tab-header {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px;
  cursor: pointer;
  font-size: 16px;
  color: var(--el-text-color-secondary);
  transition: all 0.2s;
}

.tab-item:hover {
  color: var(--el-color-primary);
}

.tab-item.active {
  color: var(--el-color-primary);
  border-bottom: 2px solid var(--el-color-primary);
  font-weight: 500;
}

.guest-mode {
  margin-top: 16px;
  text-align: center;
}

.guest-button {
  width: 100%;
  height: 40px;
  font-size: 14px;
}

.guest-button .el-icon {
  margin-right: 6px;
}

.guest-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

:deep(.el-divider__text) {
  background-color: var(--el-bg-color);
  color: var(--el-text-color-placeholder);
  font-size: 12px;
}
</style>

