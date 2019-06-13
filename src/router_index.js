import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/vuex_state'

Vue.use(VueRouter)

const router = new VueRouter({
    // mode: 'history',
    routes : [
        {
            path : '/',
            component : resolve => require(['@/components/Login'], resolve)
        },
        {
            path : '/main',
            // component : resolve => require(['@/components/HelloWorld'], resolve),
            component : resolve => require(['@/components/Index'], resolve),
        }
    ]
})

router.beforeEach((to, from, next) => {
    // if((!null) && to.path != '/') {
    if((!store.getters.getToken()) && to.path != '/') {
        next('/')
    } else if(store.getters.getToken() && to.path == '/') {
        next({path : 'main'})
    } else {
        next()
    }
})

export default router