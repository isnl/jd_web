import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入Iconify的Vue组件
import { Icon } from '@iconify/vue'
// 导入Unocss
import 'uno.css'

import App from './App.vue'
import router from './router'
import './assets/main.css'

// Element icons
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局注册Iconify Icon组件
app.component('IconifyIcon', Icon)

// pinia持久化插件
app.use(createPinia().use(piniaPersist))
app.use(router)
app.use(ElementPlus)

app.mount('#app')
