import { apiClient } from '@/api/client';
import type { Post } from '@/api/types';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getPostList() {
  try {
    // return await apiClient.get<Post[]>('/posts');
    throw new Error('No backend');
  } catch (e) {
    await delay(500);
    const postsStr = localStorage.getItem('mock_posts');
    let posts: Post[] = postsStr ? JSON.parse(postsStr) : [];
    
    // 如果本地没有数据，初始化一些假数据
    if (posts.length === 0) {
        posts = [
            {
                id: '1',
                author: { id: '101', nickname: '张三', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
                content: '今天天气真好！(Mock Data)',
                images: [],
                likeCount: 10,
                commentCount: 2,
                createdAt: new Date().toISOString(),
                isLiked: false
            },
             {
                id: '2',
                author: { id: '102', nickname: '李四', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
                content: '分享一张图片 (Mock Data)',
                images: ['https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'],
                likeCount: 5,
                commentCount: 0,
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                isLiked: true
            }
        ];
        localStorage.setItem('mock_posts', JSON.stringify(posts));
    }
    return posts;
  }
}

export async function deletePost(id: string) {
  try {
      // return await apiClient.delete<void>(`/posts/${id}`);
      throw new Error('No backend');
  } catch (e) {
      await delay(200);
      const postsStr = localStorage.getItem('mock_posts');
      if (postsStr) {
          const posts: Post[] = JSON.parse(postsStr);
          const newPosts = posts.filter(p => p.id !== id);
          localStorage.setItem('mock_posts', JSON.stringify(newPosts));
      }
  }
}

export async function likePost(id: string) {
  try {
      // return await apiClient.post<void, { postId: string }>(`/posts/${id}/like`, { postId: id });
      throw new Error('No backend');
  } catch (e) {
      await delay(200);
      const postsStr = localStorage.getItem('mock_posts');
      if (postsStr) {
          const posts: Post[] = JSON.parse(postsStr);
          const post = posts.find(p => p.id === id);
          if (post) {
              post.isLiked = !post.isLiked;
              post.likeCount += post.isLiked ? 1 : -1;
              localStorage.setItem('mock_posts', JSON.stringify(posts));
          }
      }
  }
}
