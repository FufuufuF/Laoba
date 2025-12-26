export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface UserBasicInfo {
  id: string;
  nickname: string;
  avatar: string;
}

export interface Post {
  id: string;
  author: UserBasicInfo;
  content: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isLiked: boolean;
}

export interface Comment {
  id: string;
  author: UserBasicInfo;
  content: string;
  createdAt: string;
}
