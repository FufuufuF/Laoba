// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"; // 导入解析器
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 1. 配置自动导入 Element Plus 相关的 API 和 hooks
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // 2. 配置自动导入 Element Plus 组件
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/laoba": {
        target: "http://172.24.190.42:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/laoba/, ""),
      },
    },
  },
});
