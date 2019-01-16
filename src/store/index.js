import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        realName: "",
        id: "",
        roleArray: [],
        fieldDetail: {}
    },
    mutations: {
        set_realName(state, realName){
            state.realName = realName
        },
        set_id(state, id){
            state.id = id
        },
        set_roleArray(state, roleArray){
            state.roleArray = roleArray
        },
        set_field_detail(state, detail){
            state.fieldDetail = detail
        }
    },
    actions: {
        set_realName(context, realName){
            context.commit('set_realName', realName)
        },
        set_id(context, id){
            context.commit('set_id', id)
        },
        set_roleArray(context, roleArray){
            context.commit('set_roleArray', roleArray)
        },
        set_field_detail(context, detail){
            context.commit('set_field_detail', detail)
        }
    },
});

export default store;
