/*
 * @Descripttion: 
 * @version: 
 * @Author: 奔跑猪
 * @Date: 2020-01-30 17:31:11
 * @LastEditTime: 2020-07-16 08:00:00
 */ 
import Vue from 'vue'
import App from './App.vue'
import Cm from './plugins/Cm.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './vuex_state'
import iview from 'iview'
import router from './router_index.js'
import CommonListCom from './components/Common/List'
import CommonUploadCom from './components/Common/Upload'

import 'iview/dist/styles/iview.css'
import './assets/css/init.css'

Vue.config.productionTip = false

Vue.use(Cm)
Vue.use(VueAxios,axios);
Vue.use(iview)

Vue.component('Cm-List', CommonListCom)
Vue.component('Cm-Upload', CommonUploadCom)

console.log(process.env)
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
        this.iviewConfig.uploadUrl = this.$Cm.getConfig().apiDomain + '/admin/upload/index'
    },
    store,
    router,
    render: h => h(App)
}).$mount('#app')

