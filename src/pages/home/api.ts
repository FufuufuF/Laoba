import { apiClient } from '@/api/client';
import { MOCK_POSTS } from './MOCK_API';

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