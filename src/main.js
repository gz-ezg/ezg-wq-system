// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import Vant from 'vant';
import { Lazyload } from 'vant';
import axios from 'axios'
import VueBus from './common/vue-bus'
import { Toast } from 'vant';
import 'vant/lib/index.css';
import 'lib-flexible/flexible.js'

// import Raven from 'raven-js';
// import RavenVue from 'raven-js/plugins/vue';

// Raven
//     .config("https://10cecf4fd1df4521a824adef6a810284@sentry.io/1340183")
//     .addPlugin(RavenVue, Vue)
//     .install();

Vue.use(VueBus)
Vue.use(Vant);
Vue.use(Lazyload);



axios.interceptors.response.use(
  (response) => {
    if(response.data.msgCode != 40000 && response.config.url != "api/legwork/apiLoginByWechatCode"){
      let url = 'api/system/saveFontErrMsg'
      let config = {
          name: "wqSystem",
          page: response.config.url,
          err: response
      }
      axios.post(url, config).then(function(res){}).catch((err)=>{})
    }
    if(response.data.msgCode == "50003" ){
      Toast.fail("登录失效！")
      router.push({
        name:'Login'
      })
    }
    return response;
  },
  (error) => {
    // Raven.captureException(error);
    return Promise.reject(error)
  }
)

// if(process.env.NODE_ENV !== 'development' ){
//   Vue.config.errorHandler = function(err, vm, info) {
//       Raven.captureException(err)
//   }
// }
Vue.prototype.$http = axios

Vue.prototype.$backTo = function(){
  this.$router.go(-1)
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
