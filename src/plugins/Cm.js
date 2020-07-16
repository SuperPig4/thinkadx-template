import md5 from 'js-md5'
import store from '@/vuex_state'
import iview from 'iview'
import router from '@/router_index'

export default {
    install : function(Vue, options) {
        //配置参数
        let Config = {
            //接口域名配置
            // apiDomain : 'http://yizhongjiaoyu.cn/index.php/',
            apiDomain : 'http://thinkadx.cn/index.php/',
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
        }, randomString = (len) => {
        　　len = len || 16;
        　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        　　var maxPos = $chars.length;
        　　var pwd = '';
        　　for (var i = 0; i < len; i++) {
        　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        　　}
        　　return pwd;
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
            // 接口header鉴权 - 构造函数
            getApiHeaderData (data = {}, isUseToken = true) {
                return new (function(data, isUseToken) {
                    if(isUseToken === true && store.state.access_token.token) {
                        this.token = store.getters.getToken()
                    }
                    this.timestamp = parseInt(Date.now()/1000)
                    this.nonce = randomString()
                    this.sign = ((data) => {
                        let paramsAr = [], 
                        cloneData = Object.assign(Object.assign({},this), data)
                        for(let i in cloneData) {
                            cloneData[i] == null && (cloneData[i] = '')
                            let item = cloneData[i]
                            // 判断是否为数组
                            if(item instanceof Array) {
                                item = JSON.stringify(item)
                            }
                            paramsAr.push(i + '=' + encodeURIComponent(item).replace(/[!'()*]/g, function(c) {
                                return '%' + c.charCodeAt(0).toString(16).toUpperCase();
                            }).replace(/%20/g, function(c) {
                                return '+'
                            }).replace(/%2B/g, function(c) {
                                return '+'
                            }))
                        }   
                        // console.log(paramsAr.sort().join('&'))
                        return md5(paramsAr.sort().join('&')).toUpperCase()
                    })(data)
                }) (data, isUseToken)
            },
            // 请求接口
            api (
                //接口地址
                url, 
                //地址
                data = {}, 
                //头部
                defaultHeader = {}, 
                //是否使用token
                isUseToken = true,
                //是否监听token过期
                isNoteTokenRunError = true
            ) {
                return new Promise((resolve, reject) => {
                    let header = Object.assign({},{
                        'oauth-type'  : 'password',
                        'port-type'   : 'api',
                        'Content-Type':'application/json'
                    },defaultHeader, new this.getApiHeaderData(data, isUseToken))

                    Vue.axios({
                        method : 'POST',
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