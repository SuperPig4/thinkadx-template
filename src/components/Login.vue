<template>
  <div class="hsello">
    <div @click="test" >登陆</div>
    <!-- <router-link :to="{ path:'main' }">点击</router-link> -->
  </div>
</template>

<script>
export default {
  // VuexState,
  props: {
    msg: String
  },
  created : function() {
  },
  methods: {
      test () {
          this.$Cm.api('user/login', {
            access : 'admin',
            password : 'admin',
            oauth_type : 'pwd',
            port_type : 'api'
          },{},false).then(res => {
            this.$store.commit('SetToken',{
              type : 'refresh',
              value : Object.assign({
                time : parseInt(Date.now() / 1000)
              }, res.data.refresh_token)
            })
            this.$store.commit('SetToken',{
              value : Object.assign({
                time : parseInt(Date.now() / 1000)
              },res.data.access_token)
            })
            this.$router.push({ path: 'main' })
            this.$Cm.loginSuccessInitConfig()
          })
      }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
