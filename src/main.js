import Vue from 'vue'
import App from './App.vue'

// 依赖
import axios from 'axios'
import VueAxios from 'vue-axios'
import iview from 'iview'
import moment from 'moment'

// 自定义组件、插件
import CommonListCom from './components/Common/List'
import CommonUploadCom from './components/Common/Upload'
import Cm from './plugins/Cm'

// 路由、存储
import router from '@/router/index'
import store from '@/state/index'

import 'iview/dist/styles/iview.css'
import './assets/css/init.css'

Vue.config.productionTip = false
Vue.prototype.$moment = moment;

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

