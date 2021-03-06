// import Vue from 'vue';
// import Vuex from 'vuex';
// Vue.use(Vuex);
 
// const store = new Vuex.Store({
 
//   state: {
//     // 存储token
//     Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : ''
//   },
 
//   mutations: {
//     // 修改token，并将token存入localStorage
//     changeLogin (state, user) {
//           state.Authorization = user.Authorization;
//           console.log("123333");
//           console.log(state);
//           console.log(user);
//       localStorage.setItem('Authorization', user.Authorization);
//     }
//   }
// });
 
// export default store;


import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const actions = {}
const mutations = {
    handleUserName: (state, user_name) => {
        state.user_name = user_name
            // 把登录的用户的名保存到localStorage中，防止页面刷新，导致vuex重新启动，用户名就成为初始值（初始值为空）的情况
        localStorage.setItem('user_name', user_name)
    }
}
const state = {
    user_name: '' || localStorage.getItem('user_name')
}
// getters 只会依赖 state 中的成员去更新
const getters = {
    userName: (state) => state.user_name
}

const store = new Vuex.Store({
    actions,
    mutations,
    state,
    getters
})
export default store 