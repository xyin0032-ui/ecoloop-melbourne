import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import RecyclingGuideView from '../views/RecyclingGuideView.vue'
import RecyclingPointsView from '../views/RecyclingPointsView.vue'
import RegisterView from '../views/RegisterView.vue'
import AboutView from '../views/AboutView.vue'

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
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
  path: '/about',
  name: 'about',
  component: AboutView,
    },
  ],
})

export default router