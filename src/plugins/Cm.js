import md5 from 'js-md5'
import store from '@/state/index'
import iview from 'iview'
import moment from 'moment'


export default {
    install : function(Vue, options) {
        //配置参数
        let Config = {
            //接口域名配置
            apiDomain : process.env.VUE_APP_HOST ,
            // 是否可执行强制退出操作,这个参数主要是为了防止强制退出被多次调用
            isAllowForceDropOutLogin : true
        };

        // 返回结果执行通用方法
        const apiRunObject = {
            /**
             * 自动判定返回code执行提示
             * @param bool isShowSuccess 是否显示成功提示 
             * @param bool isShowFail    是否显示失败提示
             */
            run (isShowSuccess = true, isShowFail = true) {
                return new Promise((o, r) => {
                    if(this.code) {
                        if(isShowSuccess == true) {
                            iview.Message.success(this.msg)
                        }
                        o(this)
                    } else {
                        if(isShowFail == true) {
                            iview.Message.error(this.msg)
                        }
                        r(this)
                    }
                })
            }
        };

        // 全局过滤器
        let formatDate = (value) => {
            if(isNaN(value)) {
                return ''
            } else {
                return moment.unix(value).format('YYYY-MM-DD h:mm:ss');
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

                    // 内容节点样式
                    this.$emit('on-setContentStyle', Config.contentStyle)
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
            
            // 获得配置信息
            getConfig () {
                return Config
            },

            // 登陆成功初始化 配置参数
            loginSuccessInitConfig () {
                Config.isAllowForceDropOutLogin = true
            },

            // 退出登陆
            dropOutLogin () {
                // 发送请求
                if(Config.isAllowForceDropOutLogin == true) {
                    Config.isAllowForceDropOutLogin = false
                    store.commit('EmptyUserInfo')
                    router.push({ path:'/' })
                    // this.api('admin/admin_user/logout').finally(() => {
                    //     router.push({ path:'/' })
                    // })
                }
            },

            /**
             * 接口header鉴权
             * 
             * @param bool isUseToken 是否使用token
             * 
             * @return object
             */
            getApiHeaderData (isUseToken = true) {
                return new (function(isUseToken) {
                    // token
                    if(isUseToken === true && store.state.access_token.token) this.token = store.getters.getToken();
                    this['oauth-type'] = 'password';
                    this['port-type'] = 'api';
                    this.appid = process.env.VUE_APP_APPID;
                    this.timestamp = moment().unix();
                    this.nonce = Math.random().toString(36).substr(2);
                    this.sign =  md5('appid=' + process.env.VUE_APP_APPID + '&timestamp=' + this.timestamp + '&nonce=' + this.nonce + '&appsecret=' + process.env.VUE_APP_APPSECRET).toUpperCase();
                }) (isUseToken);
            },
            
            /**
             * 请求接口
             * 
             * @param Object/Bool e                   请求对象
             * @param Object      data                发送参数
             * @param object      config              配置
             * @param Object      defaultHeader       默认header头
             * @param Bool        isUseToken          是否使用token
             * 
             * @return new Promise
             */
            api (e, data = {}, config = {}, header = {}, isUseToken = true) {
                return new Promise((resolve, reject) => {
                    // 请求地址
                    let url = e, 
                    // 请求类型
                    method = 'GET', 
                    // 配置
                    config = Object.assign({
                        // 请求包发送失败 OR 报错时是否弹出报错信息
                        sendOrCodeErrIsPop: true
                    }, config), 
                    // 请求头
                    headers = Object.assign({},{
                        'Content-Type':'application/json'
                    },header , this.getApiHeaderData(isUseToken));
                    
                    if(e instanceof Array) {
                        url = e[0];
                        method = e[1];
                    } else if(typeof(e) == 'object') {
                        url = e.url;
                        method = e.method;
                    }
                    
                    Vue.axios({
                        method : method,
                        url : Config.apiDomain + url,
                        headers : headers,
                        data : data
                    }).then(res => {
                        // 保存新的令牌
                        if(res.headers['access-token'] && store.getters.getToken() && (store.getters.getToken() != res.headers['access-token'])) {
                            store.commit('SetToken', {
                                type : 'access',
                                value : {
                                    token : res.headers['access-token'],
                                    expire_time : res.headers['access-token-expire-time'],
                                }
                            });
                        }

                        let runData = res.data;
                        runData.__proto__ = apiRunObject;
                        resolve(runData);
                    }).catch((res) => {
                        if(typeof(res) == 'object' && res.response) {
                            // 判断状态码
                            switch(res.response.status) {
                                case 401 :
                                    // 如果当前已经带上了刷新令牌还是401则表示令牌无效了
                                    if(headers['refresh-token']) {
                                        let expireTimeDate = moment.unix(store.state.refresh_token.system_expire_time);
                                        iview.Modal.error({
                                            title : '提示',
                                            content : moment().isBefore(expireTimeDate) ? '您的账号在其他地方登录了' : '登录凭证已过期,请重新登录' ,
                                            onOk : () => {
                                                Vue.prototype.$Cm.dropOutLogin()
                                            },
                                        })
                                        reject(res);
                                    } else {
                                        let refreshToken = store.getters.getToken('refresh');
                                        if(refreshToken && isUseToken === true) {
                                            // 刷新令牌
                                            this.api(e, data, config, Object.assign({
                                                'refresh-token' : refreshToken
                                            }, header), isUseToken).then(res => {
                                                resolve(runData);
                                            }).catch(res => {
                                                reject(res);
                                            })
                                        }
                                    }
                                break;
                            }
                        } else {
                            if(config.sendOrCodeErrIsPop) {
                                iview.Modal.error({
                                    title : '提示',
                                    content : res
                                })
                            }
                            reject(res);
                        }
                    })
                });
            }
        }


    }
}