<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAppInit } from '@/composables/use-app-init';

const { initApp } = useAppInit();

// 应用挂载时请求用户信息，防止刷新浏览器时登录状态丢失
onMounted(() => {
  initApp();
});
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
