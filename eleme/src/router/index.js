import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: "",
        redirect: "/goods"
      },
      {
        path: '/goods',
        name: 'HomeGoods',
        component: () => import('../components/HomeGoods.vue')
      },
      {
        path: '/ratings',
        name: 'HomeRatings',
        component: () => import('../components/HomeRatings.vue')
      },
      {
        path: '/seller',
        name: 'HomeSeller',
        component: () => import('../components/HomeSeller.vue')
      }
    ]
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkExactActiveClass: 'link-exact-active'
})

export default router
