import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {},
  state: {
    searchPhrase: '',
  },
  getters: {
    getSearchPhrase: state => {
      return state.searchPhrase;
    }
  },

  // // action
  // actions: {
  //   update ({ commit }, value) {
  //     commit('update', value)
  //   }
  // },

  // mutation
  mutations: {
    updatePhrase (state, searchPhrase) {
      state.searchPhrase = searchPhrase
    }
  }

})
