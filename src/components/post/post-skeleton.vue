<template>
  <div class="post-skeleton">
    <div class="skeleton-header">
      <el-skeleton-item variant="circle" style="width: 40px; height: 40px" />
      <div class="skeleton-header-text">
        <el-skeleton-item variant="text" style="width: 100px; height: 16px" />
        <el-skeleton-item variant="text" style="width: 60px; height: 12px" />
      </div>
    </div>
    <div class="skeleton-content">
      <el-skeleton-item variant="text" style="width: 80%; height: 20px" />
      <el-skeleton-item variant="text" style="width: 100%; height: 14px" />
      <el-skeleton-item variant="text" style="width: 90%; height: 14px" />
    </div>
    <div class="skeleton-image">
      <el-skeleton-item variant="rect" style="width: 100%; height: 180px; border-radius: 8px" />
    </div>
    <div class="skeleton-footer">
      <el-skeleton-item variant="text" style="width: 60px; height: 14px" />
      <el-skeleton-item variant="text" style="width: 60px; height: 14px" />
      <el-skeleton-item variant="text" style="width: 60px; height: 14px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElSkeletonItem } from 'element-plus';
</script>

<style scoped>
.post-skeleton {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.skeleton-header-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.skeleton-image {
  margin-bottom: 16px;
}

.skeleton-footer {
  display: flex;
  gap: 24px;
}
</style>
