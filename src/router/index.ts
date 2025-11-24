import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/convert'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/jd/Login.vue'),
      meta: { noAuth: true }
    },
    {
      path: '/',
      component: () => import('../views/jd/Layout.vue'),
      children: [
        {
          path: 'convert',
          name: 'convert',
          component: () => import('../views/jd/Convert.vue')
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('../views/jd/Orders.vue')
        },
        {
          path: 'settlement',
          name: 'settlement',
          component: () => import('../views/jd/Settlement.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/jd/Profile.vue')
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // 不需要认证的页面
  if (to.meta.noAuth) {
    next()
    return
  }

  // 需要认证的页面
  if (!authStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  next()
})

export default router
