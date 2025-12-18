import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { Post } from '@/types/post';

export const usePostStore = defineStore('post', () => {
    const postList = ref<Post[]>([]);

    return {
        postList,
    }
});
