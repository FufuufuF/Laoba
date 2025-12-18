import { apiClient } from '@/api/client';
import type { Post, Comment } from '@/api/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getPostDetail(id: string) {
  try {
      // return await apiClient.get<Post>(`/posts/${id}`);
      throw new Error('No backend');
  } catch (e) {
      await delay(300);
      const postsStr = localStorage.getItem('mock_posts');
      if (postsStr) {
          const posts: Post[] = JSON.parse(postsStr);
          const post = posts.find(p => p.id === id);
          if (post) return post;
      }
      throw new Error('Post not found');
  }
}

export async function getComments(id: string) {
  try {
      // return await apiClient.get<Comment[]>(`/posts/${id}/comments`);
      throw new Error('No backend');
  } catch (e) {
      await delay(300);
      const commentsStr = localStorage.getItem(`mock_comments_${id}`);
      return commentsStr ? JSON.parse(commentsStr) : [];
  }
}

export async function addComment(postId: string, content: string) {
  try {
      // return await apiClient.post<Comment, { content: string }>(`/posts/${postId}/comments`, { content });
      throw new Error('No backend');
  } catch (e) {
      await delay(300);
      const userStr = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
      const user = userStr ? JSON.parse(userStr) : { id: '0', nickname: '游客', avatar: '' };
      
      const newComment: Comment = {
          id: Date.now().toString(),
          author: {
            id: user.id || user.studentId,
            nickname: user.nickname || user.username,
            avatar: user.avatar || ''
          },
          content,
          createdAt: new Date().toISOString()
      };
      
      const commentsStr = localStorage.getItem(`mock_comments_${postId}`);
      const comments: Comment[] = commentsStr ? JSON.parse(commentsStr) : [];
      comments.unshift(newComment);
      localStorage.setItem(`mock_comments_${postId}`, JSON.stringify(comments));
      
      // Update post comment count
      const postsStr = localStorage.getItem('mock_posts');
      if (postsStr) {
          const posts: Post[] = JSON.parse(postsStr);
          const post = posts.find(p => p.id === postId);
          if (post) {
              post.commentCount++;
              localStorage.setItem('mock_posts', JSON.stringify(posts));
          }
      }
      
      return newComment;
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
