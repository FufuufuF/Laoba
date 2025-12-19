import { apiClient } from '@/api/client';
import type { Post } from '@/api/types';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function createPost(data: { content: string; images: string[] }) {
  // 尝试调用真实接口，如果失败则使用本地 Mock
  try {
     // return await apiClient.post('/posts', data);
     throw new Error('No backend'); // 强制使用 Mock
  } catch (e) {
    await delay(500);
    const postsStr = localStorage.getItem('mock_posts');
    const posts: Post[] = postsStr ? JSON.parse(postsStr) : [];
    
    // 获取当前用户（从 localStorage 或 sessionStorage）
    const userStr = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    const user = userStr ? JSON.parse(userStr) : { id: '0', nickname: '游客', avatar: '' };

    const newPost: Post = {
        id: Date.now().toString(),
        author: {
            id: user.id || user.studentId,
            nickname: user.nickname || user.username,
            avatar: user.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        },
        content: data.content,
        images: data.images,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date().toISOString(),
        isLiked: false
    };

    posts.unshift(newPost);
    localStorage.setItem('mock_posts', JSON.stringify(posts));
    return { code: 0, message: 'success', data: newPost };
  }
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post<{ url: string }, FormData>('/upload', formData);
}
