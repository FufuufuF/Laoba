// src/routes.ts
import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/components/index.vue';
import { routes as pageRoutes } from '@/pages/routes';
import Login from '@/pages/login/index.vue';

const routes = [
    {
        path: '/',
        component: Layout,
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

// router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
//     const userStore = useUserStore();
//     userStore.initUser();

//     if (to.meta.title) {
//         document.title = to.meta.title as string;
//     }

//     if (!to.meta.requireAuth) {
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