<template>
  <div class="admin-container">
    <el-card class="admin-card">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <!-- 用户管理 Tab -->
        <el-tab-pane label="用户管理" name="users">
          <UserManagement ref="userManagementRef" />
        </el-tab-pane>

        <!-- 帖子审核 Tab -->
        <el-tab-pane label="帖子审核" name="posts">
          <PostReview ref="postReviewRef" />
        </el-tab-pane>

        <!-- 评论审核 Tab -->
        <el-tab-pane label="评论审核" name="comments">
          <CommentReview ref="commentReviewRef" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UserManagement from "./components/user-management.vue";
import PostReview from "./components/post-review.vue";
import CommentReview from "./components/comment-review.vue";

const activeTab = ref("users");

// 组件引用
const userManagementRef = ref<InstanceType<typeof UserManagement>>();
const postReviewRef = ref<InstanceType<typeof PostReview>>();
const commentReviewRef = ref<InstanceType<typeof CommentReview>>();

const handleTabChange = (tab: string) => {
  // 切换 Tab 时重新加载对应的数据
  if (tab === "users") {
    userManagementRef.value?.loadUsers();
  } else if (tab === "posts") {
    postReviewRef.value?.loadPosts();
  } else if (tab === "comments") {
    commentReviewRef.value?.loadComments();
  }
};
</script>

<style scoped>
.admin-container {
  width: 100%;
  max-width: 1400px;
  margin: 20px auto;
  padding: 0 20px;
}

.admin-card {
  padding: 20px;
}
</style>