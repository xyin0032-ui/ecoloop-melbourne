import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import RecyclingGuideView from '../views/RecyclingGuideView.vue'
import RecyclingPointsView from '../views/RecyclingPointsView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import AboutView from '../views/AboutView.vue'
import AdminView from '../views/AdminView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'

import { getCurrentUser } from '../utils/auth'

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
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {
        requiresAdmin: true,
      },
    },
    {
      path: '/access-denied',
      name: 'access-denied',
      component: AccessDeniedView,
    },
  ],
})

router.beforeEach((to) => {
  const currentUser = getCurrentUser()

  if (to.meta.requiresAdmin) {
    if (!currentUser || currentUser.role !== 'admin') {
      return '/access-denied'
    }
  }
})

export default router