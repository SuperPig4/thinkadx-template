export const admin =  {
    // 管理员
    user : Object.assign(createCrudApi('admin_user'), {
        // 用户信息
        info : 'admin/admin_user/info',
        // 修改密码
        setPassword : ['admin/admin_user/set_password', 'POST'],
        // 退出
        logout : 'admin/admin_user/logout'
    }),
    // 管理员分组
    group : Object.assign(createCrudApi('admin_group')),
    // 管理员规则
    rule : Object.assign(createCrudApi('admin_rule')),
    // 管理员操作日志
    adminLog : 'admin/admin_log/index',
    // 登录
    login : ['admin/admin_user/login', 'POST']
} 

// 系统
export const system =  {
    // 系统配置
    config : 'admin/config/get_system_config',
} 

// 工具
export const tool =  {
    // main
    main : 'admin/tool/main',
    // 验证码key
    verifyKey : 'admin/tool/get_verify_key',
    // 清空系统缓存
    cleanExpiredCache : 'admin/tool/empty_expired_cache',
}

// 菜单
export const menu = Object.assign(createCrudApi('menu'),{
    getList : 'admin/menu/get_list'
})

// 配置
export const config = Object.assign(createCrudApi('config'))

function createCrudApi (controller) {
    return {
        index : `admin/${controller}/index`,
        delete : `admin/${controller}/delete`,
        detail : `admin/${controller}/detail`,
        add : [`admin/${controller}/add`, 'POST'],
        edit : [`admin/${controller}/edit`, 'POST'],
        /**
         * 
         * @param bool isEdit true:新增  false:编辑 
         */
        addOrEdit (isEdit) {
            return isEdit ? this.edit : this.add ;
        }
    };
}