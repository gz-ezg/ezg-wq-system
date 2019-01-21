import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import user from './module/user'
import modalStatus from './module/modalStatus'

const store = new Vuex.Store({
    modules: {
      user,
      modalStatus
    },
    state: {
        fieldDetail: {},
        company: {},
        //  弹出层状态
        fieldType: {},
        fieldTypeList: [],
        showImg: [],
        uploadImg: [],
        memo: ''
    },
    mutations: {
        set_field_detail(state, detail){
            state.fieldDetail = detail
        },
        set_company(state, company){
            state.company = company
        },
        set_fieldTypeList(state, List){
            state.fieldTypeList = List
        },
        set_fieldType(state, fieldType){
            state.fieldType = fieldType
        },
        push_img(state, img){
            state.showImg.push(img)
        },
        push_upload_img(state, img){
            state.uploadImg.push(img)
        },
        remove_upload_img(state, index){
          state.uploadImg.splice(index, 1)
          state.showImg.splice(index, 1)
        }
    },
    actions: {

    },
});

export default store;
