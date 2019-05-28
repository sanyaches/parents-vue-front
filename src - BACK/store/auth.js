import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export const state = () => {}

export const mutations = {
  setUser (state, user) {
    state.user = user
    Cookies.set('user', user)
  },
  logout (state) {
    state.user = null
    Cookies.set('user', null)
  }
}

export const getters = {
  username: state => {
    return state.user && state.user.username
  }
}
