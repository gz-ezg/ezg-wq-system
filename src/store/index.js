import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        realName: "",
        id: "",
        roleArray: [],
        fieldDetail: {},
        company: {},
        //  弹出层状态
        companyModalStatus: false,
        customerModalStatus: false,
        fieldTypeModalStatus: false,
        fieldType: {},
        fieldTypeList: [],
        showImg: [],
        uploadImg: []
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
        },
        set_company(state, company){
            state.company = company
        },
        set_fieldTypeList(state, List){
            state.fieldTypeList = List
        },
        change_company_modal_status(state){
            state.companyModalStatus = !state.companyModalStatus
        },
        change_customer_modal_status(state){
            state.customerModalStatus = !state.customerModalStatus
        },
        change_fieldType_modal_status(state){
            state.fieldTypeModalStatus = !state.fieldTypeModalStatus
        },
        set_fieldType(state, fieldType){
            state.fieldType = fieldType
        },
        push_img(state, img){
            state.showImg.push(img)
        },
        push_upload_img(state, img){
            state.uploadImg.push(img)
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
        },
        set_company(context, company){
            context.commit('set_company', company)
        },
        set_fieldType(context, fieldType){
            context.commit('set_fieldType', fieldType)
        }
    },
});

export default store;
