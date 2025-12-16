import { createRouter, createWebHistory } from 'vue-router';

import Layout from '@/components/index.vue';
import { routes as pageRoutes } from '@/pages/routes';

const routes = [
    {
        path: '/',
        component: Layout,
        children: [...pageRoutes]
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});