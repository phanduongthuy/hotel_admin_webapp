import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from "../store";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/employees',
    name: 'User',
    component: () => import('../views/Employee.vue')
  },
  {
    path: '/support-request',
    name: 'SupportRequest',
    component: () => import('../views/SupportRequest')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order')
  },
  {
    path: '/request-order-room',
    name: 'RequestOrder',
    component: () => import('../views/RequestOrder')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/User')
  },
  {
    path: '/service-rule',
    name: 'ServiceRule',
    component: () => import('../views/ServiceRule')
  },
  {
    path: '/information',
    name: 'Information',
    component: () => import('../views/Information')
  },
  {
    path: '/members',
    name: 'Member',
    component: () => import('../views/Members')
  },
  {
    path: '/config-email-template',
    name: 'Email',
    component: () => import('../views/Email')
  },
  {
    path: '/update-email-template/:id',
    name: 'UpdateEmail',
    component: () => import('../views/UpdateEmail')
  },
  {
    path: '/categories',
    name: 'Category',
    component: () => import('../views/Category')
  },
  {
    path: '/rooms',
    name: 'Room',
    component: () => import('../views/Room')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !store.state.auth.isAuthenticated) {
    next({ name: 'Login'})
  } else if(to.name === 'Login' && store.state.auth.isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
