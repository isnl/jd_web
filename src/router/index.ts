import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/home/index.vue'
import CardEditorView from '../views/cardEditor/index.vue'
import CardListView from '../views/cardList/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/editor',
      name: 'editor',
      component: CardEditorView
    },
    {
      path: '/card-list',
      name: 'cardList',
      component: CardListView
    }
  ]
})

export default router
