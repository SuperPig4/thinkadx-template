import md5 from 'js-md5'
import store from '@/vuex_state'
import iview from 'iview'
import router from '@/router_index'
import apiObject from '@/lib/apiObject'

export default {
    install : function(Vue, options) {
        //配置参数
        let Config = {
            //接口域名配置
            apiDomain : 'http://'+ process.env.VUE_APP_HOST +'/index.php/',
            // 是否可执行强制退出操作,这个参数主要是为了防止强制退出被多次调用
            isAllowForceDropOutLogin : true
        }, RefreshTokenLogic = function() {
            return new Promise((resolve, reject) => {
                Vue.prototype.$Cm.api('admin/admin_user/rese_token',{
                    refresh_token : store.getters.getToken('refresh'),
                    old_token : store.getters.getToken(),
                }, {}, false).then(res => {
                    if(res.code == 1 && store.getters.getToken() != res.data.token) {
                        console.log('update token')
                        store.commit('SetToken', {
                            value : Object.assign({
                                time : parseInt(Date.now() / 1000)
                            },res.data)
                        })
                    }
                    resolve(res)
                }).catch((e) => {
                    reject()
                })
            })
        }

        // 全局过滤器
        let formatDate = (value) => {
            if(isNaN(value)) {
                return ''
            } else {
                let date = new Date(parseInt((parseInt(value) * 1000)));
                let y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? ('0' + MM) : MM;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let m = date.getMinutes();
                m = m < 10 ? ('0' + m) : m;
                let s = date.getSeconds();
                s = s < 10 ? ('0' + s) : s;
                return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
            }
        }
        Vue.filter('formatDate', formatDate)
        
        // 全局混入
        let SystemConfigLogic = function(params, useFunName) {
            this.$nextTick(function () {
                if(params) {
                    let Config = Object.assign({}, (params || {}))
                    // 路径逻辑
                    if(Config.pathNameAr) {
                        this.$emit('on-topSetPathNameAr', Config.pathNameAr)
                    }
                }      
            })
        }
        Vue.mixin({
            mounted () {
                SystemConfigLogic.call(this, this.SystemConfig, 'mounted')
            },
            activated () {
                SystemConfigLogic.call(this, this.SystemConfig, 'activated')
            }
        })

        Vue.prototype.$Cm = {
            formatDate,
            test () {
                console.log(router)
            },
            // 获得配置信息
            getConfig () {
                return Config
            },
            // 登陆成功初始化 配置参数
            loginSuccessInitConfig () {
                console.log(Config.isAllowForceDropOutLogin)
                Config.isAllowForceDropOutLogin = true
            },
            // 退出登陆
            dropOutLogin () {
                // 发送请求
                if(Config.isAllowForceDropOutLogin == true) {
                    Config.isAllowForceDropOutLogin = false
                    store.commit('EmptyUserInfo')
                    this.api('admin/admin_user/logout').finally(() => {
                        router.push({ path:'/' })
                    })
                }
            },
            /**
             * 接口header鉴权
             * 
             * @param any  data 参数 - 废弃
             * @param bool isUseToken 是否使用token
             * 
             * @return object
             */
            getApiHeaderData (data = {}, isUseToken = true) {
                return new (function(data, isUseToken) {
                    // token
                    if(isUseToken === true && store.state.access_token.token) this.token = store.getters.getToken();

                    this['oauth-type'] = 'password';
                    this['port-type'] = 'api';
                    this.appid = process.env.VUE_APP_APPID;
                    this.timestamp = parseInt(Date.now()/1000);
                    this.sign =  md5('appid=' + process.env.VUE_APP_APPID + '&timestamp=' + this.timestamp + '&appsecret=' + process.env.VUE_APP_APPSECRET).toUpperCase();
                }) (data, isUseToken);
            },

            /**
             * API对象 - 构造函数
             */
            apiObject () {

            },
            
            /**
             * 请求接口
             * 
             * @param String/Bool url            请求地址 / 返回API对象
             * @param Object data                发送参数
             * @param String method              请求类型
             * @param Object defaultHeader       默认header头
             * @param Bool   isUseToken          是否使用token
             * @param Bool   isNoteTokenRunError 是否监听token过期
             * 
             * @return new Promise
             */
            api (url, data = {}, method = 'POST', defaultHeader = {}, isUseToken = true, isNoteTokenRunError = true) {
                let newApiObject = new apiObject();
                if(url === false) {
                    return newApiObject;
                } else {
                    return new Promise((resolve, reject) => {
                        
                    })
                }


                return new Promise((resolve, reject) => {
                    let header = Object.assign({},{
                        'Content-Type':'application/json'
                    },defaultHeader, this.getApiHeaderData(data, isUseToken));

                    Vue.axios({
                        method : method,
                        url : Config.apiDomain + url,
                        headers : header,
                        data : data
                    }).then(res => {
                        if(res.status == 200) {
                            let runData = res.data
                            if(runData.code == 0 && runData.data.errorCode && isNoteTokenRunError == true) {
                                switch(runData.data.errorCode) {
                                    // case -1000 :
                                    //      非法请求
                                    //         Vue.prototype.$Cm.dropOutLogin()
                                    //     break;
                                    case -1001 :
                                            RefreshTokenLogic().then(res => {
                                                Vue.prototype.$Cm.api(url, data, defaultHeader, isUseToken, false).then(res => {
                                                    res.run(false, false).then(() => {
                                                        resolve(res)
                                                    }).catch((e) => {
                                                        Vue.prototype.$Cm.dropOutLogin()
                                                    })
                                                }).catch((e) => {
                                                    reject()
                                                })
                                            })
                                        break;
                                    case -1002 :
                                            reject()
                                            iview.Modal.error({
                                                title:'您的账号在其他地方登陆',
                                                content:'',
                                                onOk: () => {
                                                    Vue.prototype.$Cm.dropOutLogin()
                                                },
                                            })
                                        break;
                                    default :
                                            reject()
                                            Vue.prototype.$Cm.dropOutLogin()
                                        break;
                                }
                            } else {
                                runData.run = function(sucIsShow = true, errIsShow = true) {
                                    return new Promise((o, r) => {
                                        if(this.code) {
                                            if(sucIsShow == true) {
                                                iview.Message.success(this.msg)
                                            }
                                            o(this)
                                        } else {
                                            if(errIsShow == true) {
                                                iview.Message.error(this.msg)
                                            }
                                            r(this)
                                        }
                                    })
                                }
                                resolve(runData)
                            }
                        } else {
                            iview.Modal.error({
                                title:'提示',
                                content:'请求发生异常,请联系管理员'
                            })
                            reject()
                        }
                    }).catch((e) => {
                        iview.Modal.error({
                            title:'提示',
                            content:'请求发送失败,请检测网络是否正常'
                        })
                        reject()
                    })
                })

            }
        }


    }
}