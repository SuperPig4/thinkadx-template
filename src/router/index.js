import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/state/index'

Vue.use(VueRouter)

const router = new VueRouter({
    // mode: 'history',
    routes : [
        {
            path : '/',
            component : resolve => require(['@/view/Login'], resolve)
        },
        {
            path : '/main',
            component : resolve => require(['@/view/Index'], resolve),
            children : [
                // 工具-清空过期缓存
                {
                    path : 'tool_empty_expired_cache',
                    component : resolve => require(['@/view/Tool/tool_empty_expired_cache'], resolve)
                },
                // 菜单首页
                {
                    path : 'menu_index',
                    component : resolve => require(['@/view/Menu/Index'], resolve),
                    meta : {
                        keepAlive : true
                    }
                },
                {
                    path : 'menu_add_edit/:fid/:id?',
                    component : resolve => require(['@/view/Menu/AddEdit'], resolve)
                },
                // 管理员
                {
                    path : 'set_password/:id?',
                    component : resolve => require(['@/view/Admin/SetPassword'], resolve)
                },
                {
                    path : 'admin_user_index',
                    component : resolve => require(['@/view/Admin/Index'], resolve),
                    meta : {
                        keepAlive : true
                    }
                },
                {
                    path : 'admin_user_add_edit/:id?',
                    component : resolve => require(['@/view/Admin/AddEdit'], resolve)
                },
                // 管理员分组
                {
                    path : 'admin_group_index',
                    component : resolve => require(['@/view/AdminGroup/Index'], resolve),
                    meta : {
                        keepAlive : true
                    }
                },
                {
                    path : 'admin_group_add_edit/:id?',
                    component : resolve => require(['@/view/AdminGroup/AddEdit'], resolve)
                },
                // 管理员分组规则
                {
                    path : 'admin_rule_index',
                    component : resolve => require(['@/view/AdminRule/Index'], resolve),
                    meta : {
                        keepAlive : true
                    }
                },
                {
                    path : 'admin_rule_add_edit/:id?',
                    component : resolve => require(['@/view/AdminRule/AddEdit'], resolve)
                },
                // 配置文件
                {
                    path : 'config_index',
                    component : resolve => require(['@/view/Config/Index'], resolve),
                    meta : {
                        keepAlive : true
                    }
                },
                {
                    path : 'config_add_edit/:id?',
                    component : resolve => require(['@/view/Config/AddEditx'], resolve)
                },
                // 管理员操作日志
                {
                    path : 'admin_log_index',
                    component : resolve => require(['@/view/AdminLog/Index'], resolve),
                    meta : {
                        keepAlive : true
                    }
                },
                {
                    path : '',
                    component : resolve => require(['@/view/Main'], resolve)
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