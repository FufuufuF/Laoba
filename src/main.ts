import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/theme-chalk/dark/css-vars.css' // Import dark mode css vars
import App from './App.vue'
import { router } from '@/routes' // 引入我们刚才写的文件

const app = createApp(App)

app.use(createPinia())
app.use(router) // 注册路由

app.mount('#app')