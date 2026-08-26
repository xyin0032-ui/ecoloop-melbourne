import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import RecyclingGuideView from '../views/RecyclingGuideView.vue'
import RecyclingPointsView from '../views/RecyclingPointsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/guide',
      name: 'recycling-guide',
      component: RecyclingGuideView,
    },
    {
      path: '/points',
      name: 'recycling-points',
      component: RecyclingPointsView,
    },
  ],
})

export default router