import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import File from './views/File.vue'
import Policy from './views/Policy.vue'
import Role from './views/Role.vue'

Vue.use(Router)

export default new Router({
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
      component: File
    },
    {
      path: '/policy',
      name: 'policy',
      component: Policy 
    },
    {
      path: '/role',
      name: 'role',
      component: Role 
    }
  ]
})
