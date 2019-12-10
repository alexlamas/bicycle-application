import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    counted: 0
  },
  mutations: {
    increment(state) {
      state.counted++;
    }
  },
  actions: {},
  modules: {}
});
