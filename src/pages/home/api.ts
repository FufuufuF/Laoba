import { apiClient } from '@/api/client';
import { MOCK_POSTS } from './MOCK_API';
import type { Post } from '@/types/post';

// 后端接口响应类型
export interface PostItem {
    id: number;
    title: string;
    text: string;
    media: {
        url: string;
        type: 'image' | 'video';
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
    }
}

export interface PostResponse {
    posts: PostItem[];
    total: number;
}

// 是否使用 Mock 数据（开发测试时可以设置为 true）
const USE_MOCK = true;

export const getPosts = (): Promise<PostResponse> => {
    if (USE_MOCK) {
        // 返回 mock 数据，模拟异步请求
        return Promise.resolve(MOCK_POSTS);
    }
    return apiClient.get('/posts');
}

// 点赞帖子
export const likePost = async (id: number): Promise<void> => {
    if (USE_MOCK) {
        // Mock 点赞逻辑
        return Promise.resolve();
    }
    return apiClient.post(`/posts/${id}/like`, {});
}

// 删除帖子
export const deletePost = async (id: number): Promise<void> => {
    if (USE_MOCK) {
        // Mock 删除逻辑
        return Promise.resolve();
    }
    return apiClient.delete(`/posts/${id}`);
}
