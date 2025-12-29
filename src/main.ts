import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/theme-chalk/dark/css-vars.css' // Import dark mode css vars
import App from './App.vue'
import { router } from '@/routes' // 引入我们刚才写的文件
import { useThemeStore } from '@/stores/theme'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router) // 注册路由

app.mount('#app')

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()