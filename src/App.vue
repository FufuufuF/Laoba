<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { watch } from 'vue'

const themeStore = useThemeStore()

// 监听主题变化
watch(
  () => themeStore.isDark,
  (isDark) => {
    // 如果有其他需要响应主题变化的逻辑，可在这里添加
  }
)
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
