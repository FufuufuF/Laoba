import { ref } from "vue";
import type { Post } from "@/types/post";
import { getPosts as getPostsApi } from "@/api/post";
import type { PostResponse } from "@/api/post";

export const usePost = () => {
  const postList = ref<Post[]>([]);
  const currentSort = ref<"latest" | "hot">("latest");

  const fetchPostList = async (sortBy: "latest" | "hot" = "latest") => {
    currentSort.value = sortBy;
    try {
      const res = await getPostsApi(sortBy);
      const posts = res.data.posts.map((item: PostResponse) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        media: item.media,
        tags: item.tags,
        createAt: new Date(item.created_at).getTime(),
        updateAt: new Date(item.updated_at).getTime(),
        author: {
          id: item.author.user_id,
          name: item.author.nickname,
          avatar: item.author.avatar,
        },
        status: {
          commentCount: item.status.comment_count,
          likeCount: item.status.like_count,
          shareCount: item.status.share_count,
          isLiked: item.status.is_liked,
          isCollected: item.status.is_collected,
        },
      })) as Post[];
      postList.value = posts;
    } catch (e) {
      console.error(e);
    }
  };

  return {
    postList,
    currentSort,
    fetchPostList,
  };
};
