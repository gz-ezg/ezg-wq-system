const user = {
  state: {
    realName: "",
    id: "",
    roleArray: [],
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
  },
  actions: {

  }
}

export default user;
