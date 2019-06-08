import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = new Vuex.Store({
    state : {
        // 访问令牌
        access_token : {},
        // 刷新令牌
        refresh_token : {}
    },
    getters : {
        getToken : (state) => (type) => {
            if(type == 'refresh') {
                return state.refresh_token.token
            } else {
                return state.access_token.token
            }
        },
    },
    mutations : {
        initData (state) {
            try {
                if(sessionStorage != null) {
                    if(sessionStorage.getItem) {
                        let accessToken = sessionStorage.getItem('access_token'),
                        refreshToken = sessionStorage.getItem('refresh_token')

                        if(accessToken) {
                            state.access_token = JSON.parse(accessToken)
                        }
                        if(refreshToken) {
                            state.refresh_token = JSON.parse(refreshToken)
                        }
                    }
                }
            } catch (err) {
                console.log(err)
                console.log('state initData error')
            }
        },
        SetToken (state, param) {
            let key
            if(param.type == 'refresh') {
                state.refresh_token = param.value
                key = 'refresh_token'
            } else {
                state.access_token = param.value
                key = 'access_token'
            }

            //进入到无痕模式可能会没有set方法
            try {
                if(sessionStorage != null) {
                    if(sessionStorage.setItem) {
                        sessionStorage.setItem(key, JSON.stringify(param.value))
                    }
                }
            } catch (err) {
                console.log('报错')
            }
        }
    }
})

// 初始化
state.commit('initData')

export default state