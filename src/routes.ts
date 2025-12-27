// src/routes.ts
import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/components/index.vue";
import { routes as pageRoutes } from "@/pages/routes";
import Login from "@/pages/login/index.vue";

const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [...pageRoutes],
  },
  {
    path: "/login",
    component: Login,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

// 路由守卫：调用后端鉴权接口
router.beforeEach(async (to, from, next) => {
  // 如果是登录页，直接放行，不进行鉴权
  if (to.path === "/login") {
    next();
    return;
  }

  // 如果路由不要求鉴权（游客可访问页面），直接放行
  if (to.meta?.requireAuth === false) {
    next();
    return;
  }

  try {
    // 动态导入避免循环依赖
    const { checkAuth } = await import("@/api/auth");
    const response = await checkAuth();

    // 鉴权成功：code === 0
    if (response.code === 0 && response.data?.user_id) {
      next();
      return;
    }

    // 鉴权失败：跳转到登录页
    next("/login");
  } catch (error) {
    // 请求异常：跳转到登录页
    console.error("[Router Guard] 鉴权失败:", error);
    next("/login");
  }
});
