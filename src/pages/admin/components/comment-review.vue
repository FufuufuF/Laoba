<template>
  <div class="comment-review">
    <div class="filter-bar">
      <el-radio-group v-model="commentStatusFilter" @change="loadComments">
        <el-radio-button label="pending">待审核</el-radio-button>
        <el-radio-button label="approved">已通过</el-radio-button>
        <el-radio-button label="rejected">已拒绝</el-radio-button>
      </el-radio-group>
    </div>

    <el-table
      :data="commentList"
      border
      stripe
      v-loading="commentLoading"
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column
        prop="content"
        label="评论内容"
        min-width="250"
        show-overflow-tooltip
      />
      <el-table-column
        prop="author_nickname"
        label="评论者"
        width="120"
      />
      <el-table-column
        prop="post_title"
        label="所属帖子"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column prop="review_status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row.review_status)">
            {{ getStatusLabel(scope.row.review_status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="评论时间" min-width="160">
        <template #default="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="scope">
          <el-button
            v-if="scope.row.review_status !== 'approved'"
            type="success"
            size="small"
            @click="handleApproveComment(scope.row)"
          >
            通过
          </el-button>
          <el-button
            v-if="scope.row.review_status !== 'rejected'"
            type="danger"
            size="small"
            @click="handleRejectComment(scope.row)"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="commentTotal > 0"
      class="pagination"
      :current-page="commentPage"
      :page-size="commentPageSize"
      :total="commentTotal"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @current-change="handleCommentPageChange"
      @size-change="handleCommentSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAdminComments } from "../composables/use-admin-comments";
import { formatDate, getStatusTagType, getStatusLabel } from "../utils";

const {
  commentStatusFilter,
  commentLoading,
  commentList,
  commentPage,
  commentPageSize,
  commentTotal,
  loadComments,
  handleApproveComment,
  handleRejectComment,
  handleCommentPageChange,
  handleCommentSizeChange,
} = useAdminComments();

onMounted(() => {
  loadComments();
});

// 暴露 loadComments 方法给父组件
defineExpose({ loadComments });
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
</style>
