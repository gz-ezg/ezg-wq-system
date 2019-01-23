import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import user from './module/user'
import modalStatus from './module/modalStatus'
import fieldDetail from './module/fieldDetail'

const store = new Vuex.Store({
    modules: {
      user,
      modalStatus,
      fieldDetail
    },
    state: {
        //  弹出层状态

    },
    mutations: {

    },
    actions: {

    },
});

export default store;
