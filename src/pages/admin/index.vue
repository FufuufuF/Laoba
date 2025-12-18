<template>
  <div class="admin-container">
    <el-card class="admin-card">
      <div slot="header">用户管理</div>

      <el-table 
        :data="userList" 
        border
        stripe
        style="width: 100%"
        :loading="loading"
      >
        <el-table-column prop="studentId" label="学号" width="180" />
        <el-table-column prop="nickname" label="昵称" width="180" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
              {{ scope.row.role === 'admin' ? '管理员' : '学生' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isForbidden" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isForbidden ? 'warning' : 'success'">
              {{ scope.row.isForbidden ? '已封禁' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <template v-if="scope.row.role !== 'admin'">
              <el-button 
                type="warning"
                size="small"
                @click="handleForbidden(scope.row)"
              >
                {{ scope.row.isForbidden ? '解封' : '封禁' }}
              </el-button>
              <el-button 
                type="primary"
                size="small"
                @click="handleReset(scope.row.studentId)"
              >
                重置资料
              </el-button>
            </template>
            <el-button 
              v-else
              size="small"
              disabled
            >
              不可操作
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getUserList, forbiddenUser, resetUserInfo } from '@/api/user';
import type { UserInfo } from '@/stores/user';

const loading = ref(false);
const userList = ref<UserInfo[]>([]);

const loadUserList = async () => {
  try {
    loading.value = true;
    const res = await getUserList();
    if (res.success) {
      userList.value = res.data;
    }
  } catch (err) {
    ElMessage.error('加载用户列表失败');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUserList();
});

const handleForbidden = async (user: UserInfo) => {
  try {
    const confirmText = user.isForbidden ? '解封' : '封禁';
    await ElMessageBox.confirm(
      `确定要${confirmText}用户【${user.id}】吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    const res = await forbiddenUser(user.id, !user.isForbidden);
    if (res.success) {
      ElMessage.success(res.msg);
      loadUserList();
    } else {
      ElMessage.error(res.msg);
    }
  } catch (err) {
    ElMessage.info('已取消操作');
  }
};

const handleReset = async (studentId: string) => {
  try {
    await ElMessageBox.confirm(
      `确定要重置用户【${studentId}】的资料吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    const res = await resetUserInfo(studentId);
    if (res.success) {
      ElMessage.success(res.msg);
      loadUserList();
    } else {
      ElMessage.error(res.msg);
    }
  } catch (err) {
    ElMessage.info('已取消操作');
  }
};
</script>

<style scoped>
.admin-container {
  width: 900px;
  margin: 50px auto;
}
.admin-card {
  padding: 20px;
}
</style>