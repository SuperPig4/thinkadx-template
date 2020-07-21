<!--
 * @Author: 奔跑猪
 * @Date: 2020-01-30 17:31:11
 * @LastEditors: 奔跑猪
 * @LastEditTime: 2020-07-21 11:44:14
 * @Descripttion: 
--> 
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
    export default {
        name: 'app'
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

/* 滚动条 */
/* body::-webkit-scrollbar{
    display:none;
} */

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/  
::-webkit-scrollbar{
    width:8px;
    height:8px;
}

/*定义滑块 内阴影+圆角*/  
::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #515a6e;
}

/*定义滚动条轨道 内阴影+圆角*/ 
/* ::-webkit-scrollbar-track { */
    /* -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2); */
    /* border-radius: 10px; */
    /* background: #EDEDED; */
/* } */

</style>
