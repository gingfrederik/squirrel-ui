import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import File from './views/File.vue'
import Policy from './views/Policy.vue'
import Role from './views/Role.vue'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/file',
      name: 'file',
      component: File,
      meta: { requiresAuth: true },
    },
    {
      path: '/policy',
      name: 'policy',
      component: Policy,
      meta: { requiresAuth: true },
    },
    {
      path: '/role',
      name: 'role',
      component: Role,
      meta: { requiresAuth: true },
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (store.state.loginStatus != true) {
      next({ path: '/login' });
    } else {
      next(); // 往下繼續執行
    }
  } else {
    next(); // 往下繼續執行
  }
});

export default router;