<template>
  <div class="user-management">
    <div class="search-bar">
      <el-input
        v-model="userSearch"
        placeholder="按学号或昵称搜索"
        clearable
        @keyup.enter="loadUsers"
        style="width: 300px"
      >
        <template #append>
          <el-button @click="loadUsers" :icon="Search" />
        </template>
      </el-input>
    </div>

    <el-table
      :data="userList"
      border
      stripe
      v-loading="userLoading"
      style="width: 100%"
    >
      <el-table-column prop="student_id" label="学号" min-width="120" />
      <el-table-column prop="nickname" label="昵称" min-width="120" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
            {{ scope.row.role === "admin" ? "管理员" : "学生" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_forbidden" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.is_forbidden ? 'warning' : 'success'">
            {{ scope.row.is_forbidden ? "已封禁" : "正常" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="注册时间" min-width="160">
        <template #default="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <template v-if="scope.row.role !== 'admin'">
            <el-button
              :type="scope.row.is_forbidden ? 'success' : 'warning'"
              size="small"
              @click="handleToggleBan(scope.row)"
            >
              {{ scope.row.is_forbidden ? "解封" : "封禁" }}
            </el-button>
          </template>
          <el-button v-else size="small" disabled>不可操作</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="userTotal > 0"
      class="pagination"
      :current-page="userPage"
      :page-size="userPageSize"
      :total="userTotal"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @current-change="handleUserPageChange"
      @size-change="handleUserSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useAdminUsers } from "../composables/use-admin-users";
import { formatDate } from "../utils";

const {
  userSearch,
  userLoading,
  userList,
  userPage,
  userPageSize,
  userTotal,
  loadUsers,
  handleToggleBan,
  handleUserPageChange,
  handleUserSizeChange,
} = useAdminUsers();

onMounted(() => {
  loadUsers();
});

// 暴露 loadUsers 方法给父组件
defineExpose({ loadUsers });
</script>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
