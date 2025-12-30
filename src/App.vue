<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { RouterView } from 'vue-router';
import { useAppInit } from '@/composables/use-app-init';
import { useThemeStore } from '@/stores/theme';

const { initApp } = useAppInit();
const themeStore = useThemeStore();

// 应用挂载时请求用户信息，防止刷新浏览器时登录状态丢失
onMounted(() => {
  initApp();
});

// 监听主题变化
watch(
  () => themeStore.isDark,
  (isDark) => {
    // 如果有其他需要响应主题变化的逻辑，可在这里添加
  }
);
</script>

<template>
  <RouterView />
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
}
</style>
