import { apiClient } from "@/api/core/client";
import type { Post } from "@/types/post";
import type { Comment } from "@/api/core/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPostDetail(id: number): Promise<Post> {
  try {
    // return await apiClient.get<Post>(`/posts/${id}`);
    throw new Error("No backend");
  } catch (e) {
    await delay(300);
    const postsStr = localStorage.getItem("mock_posts_new");
    if (postsStr) {
      const posts: Post[] = JSON.parse(postsStr);
      const post = posts.find((p) => p.id === id);
      if (post) return post;
    }
    throw new Error("Post not found");
  }
}

export async function getComments(id: number): Promise<Comment[]> {
  try {
    // return await apiClient.get<Comment[]>(`/posts/${id}/comments`);
    throw new Error("No backend");
  } catch (e) {
    await delay(300);
    const commentsStr = localStorage.getItem(`mock_comments_${id}`);
    return commentsStr ? JSON.parse(commentsStr) : [];
  }
}

export async function addComment(
  postId: number,
  content: string
): Promise<Comment> {
  try {
    // return await apiClient.post<Comment, { content: string }>(`/posts/${postId}/comments`, { content });
    throw new Error("No backend");
  } catch (e) {
    await delay(300);
    const userStr =
      localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");
    const user = userStr
      ? JSON.parse(userStr)
      : { id: "0", nickname: "游客", avatar: "" };

    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        id: user.id || user.studentId,
        nickname: user.nickname || user.username || "游客",
        avatar:
          user.avatar ||
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      },
      content,
      createdAt: Date.now().toString(),
    };

    const commentsStr = localStorage.getItem(`mock_comments_${postId}`);
    const comments: Comment[] = commentsStr ? JSON.parse(commentsStr) : [];
    comments.unshift(newComment);
    localStorage.setItem(`mock_comments_${postId}`, JSON.stringify(comments));

    // Update post comment count
    const postsStr = localStorage.getItem("mock_posts_new");
    if (postsStr) {
      const posts: Post[] = JSON.parse(postsStr);
      const post = posts.find((p) => p.id === postId);
      if (post) {
        post.status.commentCount++;
        localStorage.setItem("mock_posts_new", JSON.stringify(posts));
      }
    }

    return newComment;
  }
}

export async function likePost(id: number) {
  try {
    // return await apiClient.post<void, { postId: number }>(`/posts/${id}/like`, { postId: id });
    throw new Error("No backend");
  } catch (e) {
    await delay(200);
    const postsStr = localStorage.getItem("mock_posts_new");
    if (postsStr) {
      const posts: Post[] = JSON.parse(postsStr);
      const post = posts.find((p) => p.id === id);
      if (post) {
        post.status.likeCount += 1;
        localStorage.setItem("mock_posts_new", JSON.stringify(posts));
      }
    }
  }
}
