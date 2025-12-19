// src/pages/routes.ts
import Profile from '@/pages/profile/index.vue';
import Admin from '@/pages/admin/index.vue';
import Home from '@/pages/home/index.vue';
import PostCreate from '@/pages/post-create/index.vue';
import PostDetail from '@/pages/post-detail/index.vue';

export const routes = [
    {
        path: '/',
        children: [
            {
                path: 'home',
                name: 'Home',
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
                meta: { title: '个人中心', requireAuth: true },
            },
            {
                path: 'admin',
                name: 'Admin',
                component: Admin,
                meta: { title: '管理后台', requireAuth: true, requireAdmin: true },
            },
        ]
    }
];

