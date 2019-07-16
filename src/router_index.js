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
            component : resolve => require(['@/components/Index'], resolve),
            children : [
                // 工具-清空过期缓存
                {
                    path : 'tool_empty_expired_cache',
                    component : resolve => require(['@/components/Tool/tool_empty_expired_cache'], resolve)
                },
                // 菜单首页
                {
                    path : 'menu_index',
                    component : resolve => require(['@/components/Menu/Index'], resolve)
                },
                {
                    path : 'menu_add_edit/:fid/:id?',
                    component : resolve => require(['@/components/Menu/AddEdit'], resolve)
                },
                // 管理员
                {
                    path : 'set_password/:id?',
                    component : resolve => require(['@/components/Admin/SetPassword'], resolve)
                },
                {
                    path : 'admin_user_index',
                    component : resolve => require(['@/components/Admin/Index'], resolve)
                },
                {
                    path : 'admin_user_add_edit/:id?',
                    component : resolve => require(['@/components/Admin/AddEdit'], resolve)
                },
                // 管理员分组
                {
                    path : 'admin_group_index',
                    component : resolve => require(['@/components/AdminGroup/Index'], resolve)
                },
                {
                    path : 'admin_group_add_edit/:id?',
                    component : resolve => require(['@/components/AdminGroup/AddEdit'], resolve)
                },
                // 管理员分组规则
                {
                    path : 'admin_rule_index',
                    component : resolve => require(['@/components/AdminRule/Index'], resolve)
                },
                {
                    path : 'admin_rule_add_edit/:id?',
                    component : resolve => require(['@/components/AdminRule/AddEdit'], resolve)
                },
                // 配置文件
                {
                    path : 'config_index',
                    component : resolve => require(['@/components/Config/Index'], resolve)
                },
                {
                    path : 'config_add_edit/:id?',
                    component : resolve => require(['@/components/Config/AddEditx'], resolve)
                },
                // 管理员操作日志
                {
                    path : 'admin_log_index',
                    component : resolve => require(['@/components/AdminLog/Index'], resolve)
                },
                {
                    path : '',
                    component : resolve => require(['@/components/Main'], resolve)
                }
            ]
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