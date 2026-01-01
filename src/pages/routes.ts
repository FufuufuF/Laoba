// src/pages/routes.ts
import Setting from "@/pages/setting/index.vue";
import User from "@/pages/user/index.vue";
import Admin from "@/pages/admin/index.vue";
import Home from "@/pages/home/index.vue";
import PostCreate from "@/pages/post-create/index.vue";
import PostDetail from "@/pages/post-detail/index.vue";
import Search from "@/pages/search/index.vue";

export const routes = [
  {
    path: "/",
    children: [
      {
        path: "home",
        name: "Home",
        component: Home,
        meta: { title: "首页", requireAuth: false }, // 游客可访问
      },
      {
        path: "search",
        name: "Search",
        component: Search,
        meta: { title: "搜索", requireAuth: false }, // 游客可访问
      },
      {
        path: "post-create",
        name: "PostCreate",
        component: PostCreate,
        meta: { title: "发布动态", requireAuth: true },
      },
      {
        path: "post/:id",
        name: "PostDetail",
        component: PostDetail,
        meta: { title: "动态详情", requireAuth: false }, // 游客可访问
      },
      {
        path: "user/:id",
        name: "User",
        component: User,
        meta: { title: "用户主页", requireAuth: true },
      },
      {
        path: "setting",
        name: "Setting",
        component: Setting,
        meta: { title: "个人设置", requireAuth: true },
      },
      {
        path: "admin",
        name: "Admin",
        component: Admin,
        meta: { title: "管理后台", requireAuth: true, requireAdmin: true },
      },
    ],
  },
];
