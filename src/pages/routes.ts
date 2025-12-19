// src/routes.ts
import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/components/index.vue';
// 删掉这行：import { routes as pageRoutes } from '@/pages/routes';
import Login from '@/pages/login/index.vue';
import Profile from '@/pages/profile/index.vue';
import Admin from '@/pages/admin/index.vue';
import Home from '@/pages/home/index.vue';
import PostCreate from '@/pages/post-create/index.vue';
import PostDetail from '@/pages/post-detail/index.vue';


const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { title: '登录/注册', requireAuth: false },
    },
    {
        path: '/home',
        component: Layout,
        redirect: '/home/feed', // 添加默认重定向到 feed
        children: [
            // 删掉这行：...pageRoutes
            {
                path: 'feed',
                name: 'Feed',
                component: Home,
                meta: { title: '首页', requireAuth: true },
            },
            {
                path: 'post-create',
                name: 'PostCreate',
                component: PostCreate,
                meta: { title: '发布动态', requireAuth: true },
            },
            {
                path: 'post/:id',
                name: 'PostDetail',
                component: PostDetail,
                meta: { title: '动态详情', requireAuth: true },
            },
            {
                path: 'profile',
                name: 'Profile',
                component: Profile,
                meta: { title: '个人主页', requireAuth: true },
            },
            {
                path: 'admin',
                name: 'Admin',
                component: Admin,
                meta: { title: '用户管理', requireAuth: true, requireAdmin: true },
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
];

export const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});
