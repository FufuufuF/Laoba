import { usePostStore } from '../stores/post-store';
import { getPosts } from '../api';
import type { Post } from '@/types/post';

export const usePost = () => {
    const postStore = usePostStore();

    const fetchPostList = async () => {
        const res = await getPosts();
        const posts = res.posts.map((item) => ({
            id: item.id,
            title: item.title,
            text: item.text,
            media: item.media,
            tags: item.tags,
            createAt: item.created_at,
            updateAt: item.updated_at,
            author: item.author,
            status: {
                commentCount: item.status.comment_count,
                likeCount: item.status.like_count,
                shareCount: item.status.share_count,
            }
        })) as Post[];
        postStore.postList = posts;
    }

    return {
        postList: postStore.postList,
        fetchPostList,
    }
}