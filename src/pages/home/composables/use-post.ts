import { ref } from "vue";
import type { Post } from "@/types/post";
import { getPosts as getPostsApi } from "@/api/post";
import type { PostResponse } from "@/api/post";

export const usePost = () => {
  const postList = ref<Post[]>([]);
  const currentSort = ref<"latest" | "hot">("latest");
  const currentPage = ref(1);
  const pageSize = ref(20);
  const total = ref(0);
  const hasMore = ref(true);
  const isLoading = ref(false);

  const mapPostResponse = (item: PostResponse): Post => ({
    id: item.id,
    title: item.title,
    content: item.content ?? "",
    media: item.media ?? [],
    tags: item.tags ?? [],
    createAt: new Date(item.created_at).getTime(),
    updateAt: new Date(item.updated_at).getTime(),
    author: {
      id: item.author.user_id,
      name: item.author.nickname,
      avatar: item.author.avatar ?? "",
    },
    status: {
      commentCount: item.status.comment_count,
      likeCount: item.status.like_count,
      shareCount: item.status.share_count,
      isLiked: item.status.is_liked,
      isCollected: item.status.is_collected,
    },
  });

  const fetchPostList = async (sortBy: "latest" | "hot" = "latest") => {
    currentSort.value = sortBy;
    currentPage.value = 1;
    isLoading.value = true;
    try {
      const res = await getPostsApi(sortBy, 1, pageSize.value);
      const posts = res.data.posts.map(mapPostResponse);
      postList.value = posts;
      total.value = res.data.total;
      hasMore.value = res.data.page < res.data.total_pages;
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = async () => {
    if (!hasMore.value || isLoading.value) return;

    isLoading.value = true;
    currentPage.value++;
    try {
      const res = await getPostsApi(
        currentSort.value,
        currentPage.value,
        pageSize.value
      );
      const newPosts = res.data.posts.map(mapPostResponse);
      postList.value = [...postList.value, ...newPosts];
      hasMore.value = res.data.page < res.data.total_pages;
    } catch (e) {
      console.error(e);
      currentPage.value--; // 回滚页码
    } finally {
      isLoading.value = false;
    }
  };

  return {
    postList,
    currentSort,
    currentPage,
    total,
    hasMore,
    isLoading,
    fetchPostList,
    loadMore,
  };
};
