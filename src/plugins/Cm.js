import md5 from 'js-md5'
import store from '@/vuex_state'

export default {
    install : function(Vue, options) {
        //配置参数
        let Config = {
            //接口域名配置
            apiDomain : 'http://www.thinkadx-v2.cn/admin/'
        }, RefreshTokenLogic = function() {
            // Vue.prototype.$Cm.api('user/rese_token',{
            //     refresh_token : 
            // })
        }
        
        Vue.prototype.$Cm = {
            api (
                //接口地址
                url, 
                //地址
                data = {}, 
                //头部
                defaultHeader = {}, 
                //是否使用token
                isUseToken = true
            ) {
                console.log(store)
                // console.log(Vue.axios)
                return new Promise((resolve, reject) => {
                    let header = Object.assign({},{
                        'Content-Type':'application/json'
                    },defaultHeader, new (function(data) {
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
                    }) (data))

                    Vue.axios({
                        method : 'POST',
                        url : Config.apiDomain + url,
                        headers : header,
                        data : data
                    }).then(res => {
                        if(res.status == 200) {
                            let runData = res.data
                            if(runData.code == 0 && runData.errorCode) {

                            } else {
                                resolve(runData)
                            }
                        } else {
                            console.log('请求异常')
                            reject()
                        }
                    })
                })
            }
        }


    }
}