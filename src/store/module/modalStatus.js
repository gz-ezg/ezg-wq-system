const modalStatus = {
  state: {
    companyModalStatus: false,
    customerModalStatus: false,
    fieldTypeModalStatus: false,
  },
  mutations: {
    change_company_modal_status(state){
      state.companyModalStatus = !state.companyModalStatus
    },
    change_customer_modal_status(state){
        state.customerModalStatus = !state.customerModalStatus
    },
    change_fieldType_modal_status(state){
        state.fieldTypeModalStatus = !state.fieldTypeModalStatus
    },
  },
  actions: {

  }
}

export default modalStatus;
