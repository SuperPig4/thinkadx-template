import md5 from 'js-md5'
import store from '@/vuex_state'
import iview from 'iview'
import router from '@/router_index'

export default {
    install : function(Vue, options) {
        //配置参数
        let Config = {
            //接口域名配置
            apiDomain : 'http://www.thinkadx-v2.cn/admin/',
            // 是否可执行强制退出操作,这个参数主要是为了防止强制退出被多次调用
            isAllowForceDropOutLogin : true
        }, RefreshTokenLogic = function() {
            return new Promise((resolve, reject) => {
                Vue.prototype.$Cm.api('user/rese_token',{
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
        
        Vue.prototype.$Cm = {
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
                if(Config.isAllowForceDropOutLogin == true) {
                    Config.isAllowForceDropOutLogin = false
                    store.commit('EmptyUserInfo')
                    router.push({ path:'/' })
                }
            },
            // 接口header鉴权 - 构造函数
            getApiHeaderData (data = {}, isUseToken = true) {
                return new (function(data, isUseToken) {
                    if(isUseToken === true && store.state.access_token.token) {
                        this.token = store.getters.getToken()
                    }
                    this.timestamp = parseInt(Date.now()/1000)
                    this.nonce = Math.random().toString(36).substr(2)
                    this.sign = ((data) => {
                        let paramsAr = [], 
                        cloneData = Object.assign(Object.assign({},this), data)
                        for(let i in cloneData) {
                            cloneData[i] == null && (cloneData[i] = '')
                            let item = cloneData[i]
                            paramsAr.push(i + '=' + encodeURIComponent(item).replace(/[!'()*]/g, function(c) {
                                return '%' + c.charCodeAt(0).toString(16).toUpperCase();
                            }))
                        }   
                        console.log(paramsAr.sort().join('&'))
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
                                                    resolve(res)
                                                }).catch((e) => {
                                                    reject()
                                                })
                                            })
                                        break;
                                    case -1002 :
                                            iview.Modal.error({
                                                title:'您的账号在其他地方登陆',
                                                content:2,
                                                onOk: () => {
                                                    Vue.prototype.$Cm.dropOutLogin()
                                                },
                                            })
                                        break;
                                    default :
                                            Vue.prototype.$Cm.dropOutLogin()
                                        break;
                                }
                            } else {
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