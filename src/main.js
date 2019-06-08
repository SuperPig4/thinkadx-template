import Vue from 'vue'
import App from './App.vue'
import Cm from './plugins/Cm.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './vuex_state'

Vue.config.productionTip = false

Vue.use(Cm)
Vue.use(VueAxios,axios);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

