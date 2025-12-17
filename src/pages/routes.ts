// src/routes.ts
import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/components/index.vue';
// 删掉这行：import { routes as pageRoutes } from '@/pages/routes';
import Login from '@/pages/login/index.vue';
import Profile from '@/pages/profile/index.vue';
import Admin from '@/pages/admin/index.vue';
import { useUserStore } from '@/stores/user';


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
        children: [
            // 删掉这行：...pageRoutes,
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

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const userStore = useUserStore();
    userStore.initUser();

    if (to.meta.title) {
        document.title = to.meta.title as string;
    }

    if (!to.meta.requireAuth) {
        next();
        return;
    }

    if (!userStore.isLoggedIn) {
        next('/login');
        return;
    }

    if (to.meta.requireAdmin && userStore.userInfo?.role !== 'admin') {
        next('/home/profile');
        return;
    }

    next();
});