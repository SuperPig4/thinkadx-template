import Vue from 'vue'
import App from './App.vue'
import Cm from './plugins/Cm.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './vuex_state'
import iview from 'iview'
import router from './router_index.js'

import 'iview/dist/styles/iview.css'

Vue.config.productionTip = false

Vue.use(Cm)
Vue.use(VueAxios,axios);
Vue.use(iview)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

