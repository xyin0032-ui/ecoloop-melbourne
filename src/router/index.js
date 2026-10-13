import {
  createRouter,
  createWebHistory
} from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import AddBookView from '../views/AddBookView.vue'
import RecyclingPointsView from '../views/RecyclingPointsView.vue'
import RecyclingGuideView from '../views/RecyclingGuideView.vue'
import AdminView from '../views/AdminView.vue'

import { getCurrentUser, waitForAuth } from '../utils/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/firebase-signin',
    name: 'FirebaseSignin',
    component: LoginView
  },
  {
    path: '/register',
    alias: '/firebase-register',
    name: 'FireRegister',
    component: RegisterView
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/points',
    name: 'RecyclingPoints',
    component: RecyclingPointsView
  },
  {
    path: '/guide',
    name: 'RecyclingGuide',
    component: RecyclingGuideView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  await waitForAuth()

  const user = getCurrentUser()

  if (to.meta.requiresAuth && !user) {
    return '/login'
  }

  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    return '/access-denied'
  }
})

export default router