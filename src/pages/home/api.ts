import { apiClient } from "@/api/core/client";
import { MOCK_POSTS } from "./MOCK_API";
import type { Post } from "@/types/post";

// 后端接口响应类型
export interface PostItem {
  id: number;
  title: string;
  text: string;
  media: {
    url: string;
    type: "image" | "video";
  }[];
  tags: string[];
  created_at: number;
  updated_at: number;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
  status: {
    comment_count: number;
    like_count: number;
    share_count: number;
  };
}

export interface PostResponse {
  posts: PostItem[];
  total: number;
}

// 是否使用 Mock 数据（开发测试时可以设置为 true）
const USE_MOCK = true;

// localStorage 的 key
const STORAGE_KEY = "mock_posts_new";

export const getPosts = (): Promise<PostResponse> => {
  if (USE_MOCK) {
    // 1. 先尝试从 localStorage 读取
    const localData = localStorage.getItem(STORAGE_KEY);

    // 2. 如果没有数据，用 MOCK_API 初始化
    if (!localData) {
      const initialPosts: Post[] = MOCK_POSTS.posts.map((post) => ({
        id: post.id,
        title: post.title,
        text: post.text,
        media: post.media,
        tags: post.tags,
        createAt: post.created_at,
        updateAt: post.updated_at,
        author: post.author,
        status: {
          commentCount: post.status.comment_count,
          likeCount: post.status.like_count,
          shareCount: post.status.share_count,
        },
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPosts));
      return Promise.resolve(MOCK_POSTS);
    }

    // 3. 返回 localStorage 的数据 (已经是 Post 格式)
    const posts: Post[] = JSON.parse(localData);
    // 转换回 PostItem 格式供 use-post 使用
    const responseData: PostItem[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      text: post.text,
      media: post.media,
      tags: post.tags,
      created_at: post.createAt,
      updated_at: post.updateAt,
      author: post.author,
      status: {
        comment_count: post.status.commentCount,
        like_count: post.status.likeCount,
        share_count: post.status.shareCount,
      },
    }));
    return Promise.resolve({ posts: responseData, total: responseData.length });
  }
  return apiClient.get("/posts");
};

// 点赞帖子
export const likePost = async (id: number): Promise<void> => {
  if (USE_MOCK) {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      const posts: Post[] = JSON.parse(localData);
      const post = posts.find((p) => p.id === id);
      if (post) {
        post.status.likeCount += 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
      }
    }
    return Promise.resolve();
  }
  return apiClient.post(`/posts/${id}/like`, {});
};

// 删除帖子
export const deletePost = async (id: number): Promise<void> => {
  if (USE_MOCK) {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      const posts: Post[] = JSON.parse(localData);
      const newPosts = posts.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
    }
    return Promise.resolve();
  }
  return apiClient.delete(`/posts/${id}`);
};
