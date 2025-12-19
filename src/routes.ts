// src/routes.ts
import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/components/index.vue';
import { routes as pageRoutes } from '@/pages/routes';
import Login from '@/pages/login/index.vue';

const routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            ...pageRoutes,
        ]
    },
    {
        path: '/login',
        component: Login,
    }
];

export const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

// 路由守卫暂时注释，方便测试
// router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
//     const userStore = useUserStore();
//     userStore.initUser();

//     if (to.meta.title) {
//         document.title = to.meta.title as string;
//     }

//     if (to.meta.requireAuth === false) {
//         next();
//         return;
//     }

//     if (!userStore.isLoggedIn) {
//         next('/login');
//         return;
//     }

//     if (to.meta.requireAdmin && userStore.userInfo?.role !== 'admin') {
//         next('/home/profile');
//         return;
//     }

//     next();
// });