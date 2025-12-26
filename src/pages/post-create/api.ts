import { apiClient } from "@/api/core/client";
import type { Post } from "@/types/post";

// 模拟延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createPost(data: {
  title: string;
  text: string;
  tags: string[];
  media: { url: string; type: "image" | "video" }[];
}) {
  // 尝试调用真实接口，如果失败则使用本地 Mock
  try {
    // return await apiClient.post('/posts', data);
    throw new Error("No backend"); // 强制使用 Mock
  } catch (e) {
    await delay(500);
    const postsStr = localStorage.getItem("mock_posts_new");
    const posts: Post[] = postsStr ? JSON.parse(postsStr) : [];

    // 获取当前用户（从 localStorage 或 sessionStorage）
    const userStr =
      localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");
    const user = userStr
      ? JSON.parse(userStr)
      : { id: 0, username: "游客", avatar: "" };

    const newPost: Post = {
      id: Date.now(),
      title: data.title || "无标题",
      text: data.text,
      media: data.media,
      tags: data.tags,
      createAt: Date.now(),
      updateAt: Date.now(),
      author: {
        id: Number(user.id || user.studentId || 0),
        name: user.nickname || user.username || "游客",
        avatar:
          user.avatar ||
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      },
      status: {
        commentCount: 0,
        likeCount: 0,
        shareCount: 0,
      },
    };

    posts.unshift(newPost);
    localStorage.setItem("mock_posts_new", JSON.stringify(posts));
    return { code: 0, message: "success", data: newPost };
  }
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post<{ url: string }, FormData>("/upload", formData);
}
