import Vue from 'vue'
import App from './App.vue'
import Cm from './plugins/Cm.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './vuex_state'
import iview from 'iview'
import router from './router_index.js'
import CommonListCom from './components/Common/List'

import 'iview/dist/styles/iview.css'
import './assets/css/init.css'

Vue.config.productionTip = false

Vue.use(Cm)
Vue.use(VueAxios,axios);
Vue.use(iview)

Vue.component('Cm-List', CommonListCom)

new Vue({
    data () {
        return {
            iviewConfig : {
                // form组件的label-width参数
                formLabelWidth : 130,
                // 上传组件
                uploadUrl : ''
            }
        }
    },
    created() {
        this.iviewConfig.uploadUrl = this.$Cm.getConfig().apiDomain + '/upload/index'
    },
    store,
    router,
    render: h => h(App)
}).$mount('#app')

