export const admin =  {
    // 管理员信息
    adminUser : {
        info : 'admin/admin_user/info'
    },
    // 登录
    login : ['/admin/admin_user/login', 'POST']
} 

export const system =  {
    // 系统配置
    config : 'admin/config/get_system_config',
} 

export const tool =  {
    // main
    main : 'admin/tool/main',
    // 验证码key
    verifyKey : 'admin/tool/get_verify_key',
    // 清空系统缓存
    cleanExpiredCache : 'admin/tool/empty_expired_cache',
} 

