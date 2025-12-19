export interface Post {
    id: number;
    title: string;
    text: string;
    media: {
        url: string;
        type: 'image' | 'video';
    }[];
    tags: string[];
    createAt: number;
    updateAt: number;
    author: {
        id: number;
        name: string;
        avatar: string;
    };
    status: {
        commentCount: number;
        likeCount: number;
        shareCount: number;
    }
}