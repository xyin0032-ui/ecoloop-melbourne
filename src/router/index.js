import {
  createRouter,
  createWebHistory,
} from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import AddBookView from '../views/AddBookView.vue'
import RecyclingGuideView from '../views/RecyclingGuideView.vue'
import RecyclingPointsView from '../views/RecyclingPointsView.vue'
import AdminView from '../views/AdminView.vue'
import DataTablesView from '../views/DataTablesView.vue'
import MapView from '../views/MapView.vue'
import EmailView from '../views/EmailView.vue'

import { getCurrentUser } from '../utils/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/guide',
    name: 'Guide',
    component: RecyclingGuideView,
  },
  {
    path: '/points',
    name: 'Points',
    component: RecyclingPointsView,
  },
  {
    path: '/data-tables',
    name: 'DataTables',
    component: DataTablesView,
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView,
  },
  {
    path: '/email',
    name: 'Email',
    component: EmailView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/firebase-signin',
    name: 'FirebaseSignin',
    component: LoginView,
  },
  {
    path: '/register',
    alias: '/firebase-register',
    name: 'FireRegister',
    component: RegisterView,
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (
    to.meta.requiresAuth &&
    !getCurrentUser()
  ) {
    return '/login'
  }
})

export default router