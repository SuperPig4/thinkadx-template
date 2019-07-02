import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const state = new Vuex.Store({
    // plugins: [createPersistedState()],
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })],
    state : {
        // 访问令牌
        access_token : {},
        // 刷新令牌
        refresh_token : {},
        // 用户信息
        user_info : {},
        // 配置信息
        system_config : {}
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
        // 清空用户关键信息
        EmptyUserInfo (state) {
            state.refresh_token = ''
            state.access_token = ''
            state.user_info = ''
        }, 
        // 修改令牌
        SetToken (state, param) {
            if(param.type == 'refresh') {
                state.refresh_token = param.value
            } else {
                state.access_token = param.value
            }
        },
        // 置入用户信息
        SetUserInfo (state, value) {
            state.user_info = value
        },
        // 置入配置信息
        SetSystemConfig (state, value) {
            state.system_config = value
        } 
    }
})

// 初始化
// state.commit('initData')

export default state