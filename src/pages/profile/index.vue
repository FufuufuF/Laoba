<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button
            type="text"
            @click="toggleEdit"
          >
            {{ isEdit ? '取消' : '编辑' }}
          </el-button>
        </div>
      </template>

      <!-- 个人信息表单 -->
      <profile-info-form :is-edit="isEdit" />
    </el-card>

    <!-- 退出登录按钮 -->
    <el-button
      type="danger"
      style="margin-top: 20px"
      @click="handleLogout"
    >
      退出登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import ProfileInfoForm from './components/profile-info-form.vue';
import { useProfileForm } from './composables/use-profile-form';
import { useLogout } from './composables/use-logout';

// 使用表单逻辑
const { isEdit, toggleEdit } = useProfileForm();

// 使用退出登录逻辑
const { handleLogout } = useLogout();
</script>

<style scoped>
.profile-container {
  width: 600px;
  margin: 50px auto;
}

.profile-card {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
