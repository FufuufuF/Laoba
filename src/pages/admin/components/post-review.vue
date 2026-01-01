<template>
  <div class="post-review">
    <div class="filter-bar">
      <el-radio-group v-model="postStatusFilter" @change="loadPosts">
        <el-radio-button label="pending">待审核</el-radio-button>
        <el-radio-button label="approved">已通过</el-radio-button>
        <el-radio-button label="rejected">已拒绝</el-radio-button>
      </el-radio-group>
    </div>

    <el-table
      :data="postList"
      border
      stripe
      v-loading="postLoading"
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="150">
        <template #default="scope">
          <el-link type="primary" @click="viewPostDetail(scope.row)">
            {{ scope.row.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容预览" min-width="200">
        <template #default="scope">
          <span class="content-preview">{{
            truncateContent(scope.row.content)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="author_nickname" label="作者" width="120" />
      <el-table-column prop="review_status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row.review_status)">
            {{ getStatusLabel(scope.row.review_status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="发布时间" min-width="160">
        <template #default="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <div class="action-buttons">
            <el-button size="small" @click="viewPostDetail(scope.row)">
              查看
            </el-button>
            <el-button-group>
              <el-button
                v-if="scope.row.review_status !== 'approved'"
                type="success"
                size="small"
                @click="handleApprovePost(scope.row)"
              >
                通过
              </el-button>
              <el-button
                v-if="scope.row.review_status !== 'rejected'"
                type="danger"
                size="small"
                @click="handleRejectPost(scope.row)"
              >
                拒绝
              </el-button>
            </el-button-group>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="postTotal > 0"
      class="pagination"
      :current-page="postPage"
      :page-size="postPageSize"
      :total="postTotal"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @current-change="handlePostPageChange"
      @size-change="handlePostSizeChange"
    />

    <!-- 帖子详情弹窗 -->
    <PostDetailDialog
      v-model:visible="showDetailDialog"
      :post="selectedPost"
      @approve="handleApprovePost"
      @reject="handleRejectPost"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAdminPosts } from "../composables/use-admin-posts";
import { formatDate, getStatusTagType, getStatusLabel } from "../utils";
import PostDetailDialog from "./post-detail-dialog.vue";

const {
  postStatusFilter,
  postLoading,
  postList,
  postPage,
  postPageSize,
  postTotal,
  showDetailDialog,
  selectedPost,
  loadPosts,
  viewPostDetail,
  handleApprovePost,
  handleRejectPost,
  handlePostPageChange,
  handlePostSizeChange,
} = useAdminPosts();

const truncateContent = (content: string | null): string => {
  if (!content) return "-";
  return content.length > 80 ? content.slice(0, 80) + "..." : content;
};

onMounted(() => {
  loadPosts();
});

// 暴露 loadPosts 方法给父组件
defineExpose({ loadPosts });
</script>

<style scoped>
.filter-bar {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.content-preview {
  color: #666;
  font-size: 13px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
