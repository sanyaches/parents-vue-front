import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import Auth from '@/components/auth/Auth'
import Signup from '@/components/signup'

Vue.use(Router)
Vue.use(Vuex)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'auth',
      component: Auth
    },
    {
      path: '/reg',
      name: 'reg',
      component: Signup
    }
  ]
})
