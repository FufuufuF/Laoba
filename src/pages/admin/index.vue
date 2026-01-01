<template>
  <div class="admin-container">
    <el-card class="admin-card">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <!-- 用户管理 Tab -->
        <el-tab-pane label="用户管理" name="users">
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
          
          <el-table :data="userList" border stripe v-loading="userLoading" style="width: 100%">
            <el-table-column prop="student_id" label="学号" min-width="120" />
            <el-table-column prop="nickname" label="昵称" min-width="120" />
            <el-table-column prop="role" label="角色" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
                  {{ scope.row.role === 'admin' ? '管理员' : '学生' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="is_forbidden" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.is_forbidden ? 'warning' : 'success'">
                  {{ scope.row.is_forbidden ? '已封禁' : '正常' }}
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
                    {{ scope.row.is_forbidden ? '解封' : '封禁' }}
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
        </el-tab-pane>
        
        <!-- 帖子审核 Tab -->
        <el-tab-pane label="帖子审核" name="posts">
          <div class="filter-bar">
            <el-radio-group v-model="postStatusFilter" @change="loadPosts">
              <el-radio-button label="pending">待审核</el-radio-button>
              <el-radio-button label="approved">已通过</el-radio-button>
              <el-radio-button label="rejected">已拒绝</el-radio-button>
            </el-radio-group>
          </div>
          
          <el-table :data="postList" border stripe v-loading="postLoading" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="title" label="标题" min-width="150" />
            <el-table-column prop="content" label="内容预览" min-width="200" show-overflow-tooltip />
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
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="scope">
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
        </el-tab-pane>
        
        <!-- 评论审核 Tab -->
        <el-tab-pane label="评论审核" name="comments">
          <div class="filter-bar">
            <el-radio-group v-model="commentStatusFilter" @change="loadComments">
              <el-radio-button label="pending">待审核</el-radio-button>
              <el-radio-button label="approved">已通过</el-radio-button>
              <el-radio-button label="rejected">已拒绝</el-radio-button>
            </el-radio-group>
          </div>
          
          <el-table :data="commentList" border stripe v-loading="commentLoading" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="content" label="评论内容" min-width="250" show-overflow-tooltip />
            <el-table-column prop="author_nickname" label="评论者" width="120" />
            <el-table-column prop="post_title" label="所属帖子" min-width="150" show-overflow-tooltip />
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
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import {
  getAdminUsers,
  banUser,
  unbanUser,
  getAdminPosts,
  approvePost,
  rejectPost,
  getAdminComments,
  approveComment,
  rejectComment,
  type AdminUser,
  type AdminPost,
  type AdminComment,
} from '@/api/admin';

// ==================== State ====================

const activeTab = ref('users');

// 用户管理
const userSearch = ref('');
const userLoading = ref(false);
const userList = ref<AdminUser[]>([]);
const userPage = ref(1);
const userPageSize = ref(20);
const userTotal = ref(0);

// 帖子审核
const postStatusFilter = ref('pending');
const postLoading = ref(false);
const postList = ref<AdminPost[]>([]);
const postPage = ref(1);
const postPageSize = ref(20);
const postTotal = ref(0);

// 评论审核
const commentStatusFilter = ref('pending');
const commentLoading = ref(false);
const commentList = ref<AdminComment[]>([]);
const commentPage = ref(1);
const commentPageSize = ref(20);
const commentTotal = ref(0);

// ==================== Helpers ====================

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('zh-CN');
};

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'approved': return 'success';
    case 'rejected': return 'danger';
    default: return 'info';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return '待审核';
    case 'approved': return '已通过';
    case 'rejected': return '已拒绝';
    default: return status;
  }
};

// ==================== Data Loading ====================

const loadUsers = async () => {
  userLoading.value = true;
  try {
    const res = await getAdminUsers({ 
      search: userSearch.value || undefined,
      page: userPage.value,
      page_size: userPageSize.value 
    });
    userList.value = res.data?.users || [];
    userTotal.value = res.data?.total || 0;
  } catch (err) {
    console.error('Failed to load users:', err);
  } finally {
    userLoading.value = false;
  }
};

const loadPosts = async () => {
  postLoading.value = true;
  try {
    const res = await getAdminPosts({ 
      status: postStatusFilter.value,
      page: postPage.value,
      page_size: postPageSize.value 
    });
    postList.value = res.data?.posts || [];
    postTotal.value = res.data?.total || 0;
  } catch (err) {
    console.error('Failed to load posts:', err);
  } finally {
    postLoading.value = false;
  }
};

const loadComments = async () => {
  commentLoading.value = true;
  try {
    const res = await getAdminComments({ 
      status: commentStatusFilter.value,
      page: commentPage.value,
      page_size: commentPageSize.value 
    });
    commentList.value = res.data?.comments || [];
    commentTotal.value = res.data?.total || 0;
  } catch (err) {
    console.error('Failed to load comments:', err);
  } finally {
    commentLoading.value = false;
  }
};

// 分页处理
const handleUserPageChange = (page: number) => {
  userPage.value = page;
  loadUsers();
};
const handleUserSizeChange = (size: number) => {
  userPageSize.value = size;
  userPage.value = 1;
  loadUsers();
};
const handlePostPageChange = (page: number) => {
  postPage.value = page;
  loadPosts();
};
const handlePostSizeChange = (size: number) => {
  postPageSize.value = size;
  postPage.value = 1;
  loadPosts();
};
const handleCommentPageChange = (page: number) => {
  commentPage.value = page;
  loadComments();
};
const handleCommentSizeChange = (size: number) => {
  commentPageSize.value = size;
  commentPage.value = 1;
  loadComments();
};

const handleTabChange = (tab: string) => {
  if (tab === 'users') loadUsers();
  else if (tab === 'posts') loadPosts();
  else if (tab === 'comments') loadComments();
};

onMounted(() => {
  loadUsers();
});

// ==================== User Actions ====================

const handleToggleBan = async (user: AdminUser) => {
  const action = user.is_forbidden ? '解封' : '封禁';
  try {
    await ElMessageBox.confirm(
      `确定要${action}用户【${user.nickname || user.student_id}】吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    );
    
    if (user.is_forbidden) {
      await unbanUser(user.id);
    } else {
      await banUser(user.id);
    }
    
    ElMessage.success(`${action}成功`);
    loadUsers();
  } catch (err) {
    if (err !== 'cancel') {
      console.error('Ban/unban failed:', err);
    }
  }
};

// ==================== Post Actions ====================

const handleApprovePost = async (post: AdminPost) => {
  try {
    await ElMessageBox.confirm(
      `确定通过帖子【${post.title}】的审核吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'success' }
    );
    await approvePost(post.id);
    ElMessage.success('审核通过');
    loadPosts();
  } catch (err) {
    if (err !== 'cancel') {
      console.error('Approve post failed:', err);
    }
  }
};

const handleRejectPost = async (post: AdminPost) => {
  try {
    await ElMessageBox.confirm(
      `确定拒绝帖子【${post.title}】吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    );
    await rejectPost(post.id);
    ElMessage.success('已拒绝');
    loadPosts();
  } catch (err) {
    if (err !== 'cancel') {
      console.error('Reject post failed:', err);
    }
  }
};

// ==================== Comment Actions ====================

const handleApproveComment = async (comment: AdminComment) => {
  try {
    await ElMessageBox.confirm(
      `确定通过该评论的审核吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'success' }
    );
    await approveComment(comment.id);
    ElMessage.success('审核通过');
    loadComments();
  } catch (err) {
    if (err !== 'cancel') {
      console.error('Approve comment failed:', err);
    }
  }
};

const handleRejectComment = async (comment: AdminComment) => {
  try {
    await ElMessageBox.confirm(
      `确定拒绝该评论吗？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    );
    await rejectComment(comment.id);
    ElMessage.success('已拒绝');
    loadComments();
  } catch (err) {
    if (err !== 'cancel') {
      console.error('Reject comment failed:', err);
    }
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

.search-bar {
  margin-bottom: 16px;
}

.filter-bar {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>