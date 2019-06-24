<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'


export default {
    name: 'app',
    components: {
    HelloWorld
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  height:100%;
  /* margin-top: 60px; */
}

@media all and (max-width: 1200px) {
    html, body {width: 1200px;}
}

@media all and (max-height: 768px) {
    html, body {height: 768px !important;}
}

.G-form{ margin-top:20px; width:400px; position: relative; }
.G-form .ivu-form-item-label{ width:130px !important }

</style>
