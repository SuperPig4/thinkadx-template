<template>
  <div class="hello">
    <h1 @click="getUserInfo">获得用户信息</h1>
    <h1 @click="dropOutLogin">退出登陆</h1>
  </div>
</template>

<script>
// import VuexState from '../vuex_state.js'
export default {
  // VuexState,
  name: 'hello',
  props: {
    msg: String
  },
  created : function() {
  },
  methods: {
    getUserInfo () {
      this.$Cm.api('admin_user/info').then(res => {
        console.log(res)
      })
    },
    dropOutLogin () {
      this.$Cm.dropOutLogin()
    }
  },
}
</script>
