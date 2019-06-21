import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginStatus: false
  },
  mutations: {
    initStatus(state) {
      state.loginStatus = false;
    },
    setLoginStatus(state, payload) {
      state.loginStatus = payload;
    }
  },
  actions: {

  }
})
