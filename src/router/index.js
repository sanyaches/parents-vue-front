import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import Home from '@/components/Home'
import SingleNew from '@/components/SingleNew'
import Client from '@/components/Client'
import News from '@/components/News'
import Registration from "@/components/Registration";
import Searched from "@/components/Searched";

Vue.use(Router);
Vue.use(Vuex);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/new/:id',
      name: 'singlenew',
      component: SingleNew
    },
    {
      path: '/news/:id',
      name: 'news',
      component: News
    },
    {
      path: '/client',
      name: 'client',
      component: Client
    },
    {
      path: '/registration',
      name: 'registration',
      component: Registration
    },
    {
      path: '/searched',
      name: 'searched',
      component: Searched
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
