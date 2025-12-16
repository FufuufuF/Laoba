import type { RouteRecordRaw } from 'vue-router';

export const routes = [
    {
        path: 'home',
        component: () => import('@/pages/home/index.vue'),
    },
    {
        path: 'user',
        component: () => import('@/pages/user/index.vue'),
    },
] as RouteRecordRaw[];
