import { ref, computed } from "vue";
import {
  getFollowingList,
  getFollowersList,
  type FollowUserItem,
} from "../api";
import {
  followUser as followUserApi,
  unfollowUser as unfollowUserApi,
} from "@/pages/user/api";
import { ElMessage } from "element-plus";

export const useFollowList = (
  userId: number,
  type: "following" | "followers"
) => {
  const list = ref<FollowUserItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(20);
  const totalPages = ref(0);
  const hasMore = computed(() => page.value < totalPages.value);
  const isLoading = ref(false);

  // 获取列表
  const fetchList = async (reset = false) => {
    if (reset) {
      page.value = 1;
      list.value = [];
    }

    isLoading.value = true;
    try {
      const apiCall =
        type === "following" ? getFollowingList : getFollowersList;
      const res = await apiCall(userId, page.value, pageSize.value);

      if (res.code === 0) {
        if (reset) {
          list.value = res.data.list;
        } else {
          list.value = [...list.value, ...res.data.list];
        }
        total.value = res.data.total;
        totalPages.value = res.data.total_pages;
      }
    } catch (error) {
      ElMessage.error("加载列表失败");
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  // 加载更多
  const loadMore = async () => {
    if (!hasMore.value || isLoading.value) return;
    page.value++;
    await fetchList();
  };

  // 关注/取消关注（带乐观更新）
  const toggleFollow = async (targetUserId: number) => {
    const userItem = list.value.find((u) => u.id === targetUserId);
    if (!userItem) return;

    const previousState = userItem.is_following;
    // 乐观更新
    userItem.is_following = !previousState;

    try {
      if (previousState) {
        await unfollowUserApi(String(targetUserId));
        ElMessage.success("已取消关注");
      } else {
        await followUserApi(String(targetUserId));
        ElMessage.success("关注成功");
      }
    } catch (error) {
      // 回滚
      userItem.is_following = previousState;
      ElMessage.error(previousState ? "取消关注失败" : "关注失败");
    }
  };

  return {
    list,
    total,
    hasMore,
    isLoading,
    fetchList,
    loadMore,
    toggleFollow,
  };
};
