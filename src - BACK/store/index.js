import Vue from 'vue'
import Vuex from 'vuex'

import cookieparser from 'cookieparser'

Vue.use(Vuex)


export const actions = {
  vueStat ({ commit }, { req }) {
    let user = null
    if (req && req.headers && req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      user = (parsed.user && JSON.parse(parsed.user)) || null
    }

    commit('auth/setUser', user)
  }
}

export const store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
});
