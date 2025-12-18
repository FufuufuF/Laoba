// src/routes.ts
import Profile from '@/pages/profile/index.vue';
import Admin from '@/pages/admin/index.vue';
import Home from '@/pages/home/index.vue';


export const routes = [
    {
        path: '/',
        children: [
            {
                path: 'home',
                component: Home,
            },
            {
                path: 'profile',
                component: Profile,
            },
            {
                path: 'admin',
                component: Admin,
            },
        ]
    }
];

