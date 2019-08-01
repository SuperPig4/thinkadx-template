<style>
    #login {
        position: relative;
        height: 100%;
    }

    .right {
        width: 35%;
        float: right;
        height: 100%;
        background:#f8f8f9;
    }
    .left {
        width: 65%;
        float: left;
        height: 100%;
        display:flex; 
        justify-content: center; 
        align-items: center;
        background: #2f5191;
    }

    /* .left .img {
        position: relative;
        bottom: 0px;
        width: 100%;
        height: 100%;
        background: #16136a url("../assets/images/2.jpg") no-repeat;
        background-size: 80% auto;
        background-position: center;
    } */

    .form-bg{
        width:100%;
        height:100%;
        /* margin:0 auto; */
        display:flex;
        align-items: center;
        flex-direction:column;
        justify-content:center;
    }
    .form-bg .input-item{ 
        width:60%;
    }
    .form-bg .Button{ width:100%; }

    h1{ font-size:24px; margin-bottom:30px; }
</style>
<template>
    <div id="login">
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <div class="left">
            <img src="../assets/images/2.jpg" ></img>
        </div>
        <div class="right">
            <Form  class="form-bg">
                <h1>{{$store.state.system_config.admin_system_name}}</h1>
                <FormItem class="input-item">
                    <Input type="text" size="large" v-model="user" placeholder="请输入账号">
                        <Icon type="ios-contact" slot="prefix" />
                    </Input>
                </FormItem>
                <FormItem class="input-item" >
                    <Input type="password" size="large" v-model="password"  placeholder="请输入密码">
                        <Icon type="ios-lock-outline" slot="prefix"></Icon>
                    </Input>
                </FormItem>
                <FormItem class="input-item">
                    <Button type="primary" size="large" @click="submit" long :loading="isLogin" >登陆</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isShowLoading : true,
            isLogin : false,
            user: "",
            password: ""
        };
    },
    created: function() {
        this.$Cm.api('admin/config/get_system_config').then(res => {
            res.run(false).then(() => {
                this.$store.commit('SetSystemConfig', res.data)
                window.document.title = res.data.admin_system_name
            })
        }).finally(() => {
            this.isShowLoading =  false
        })
    },
    methods: {
        submit() {
            this.isLogin = true
            this.$Cm.api('admin/admin_user/login',{
                access: this.user,
                password: this.password,
                oauth_type: "pwd",
                port_type: "api"
            }, {} , false).then(res => {
                if(res.code == 0) {
                    this.$Message.error({
                        content : res.msg,
                        duration: 3,
                        closable: true
                    })
                } else {
                    this.$store.commit("SetToken", {
                        type: "refresh",
                        value: Object.assign({time: parseInt(Date.now() / 1000)}, res.data.refresh_token)
                    })
                    this.$store.commit("SetToken", {
                        value: Object.assign({time: parseInt(Date.now() / 1000)}, res.data.access_token)
                    });
                    this.$router.push({ path: "main" });
                    this.$Cm.loginSuccessInitConfig();
                }
            }).finally(() => {
                this.isLogin = false
            })
        }
    }
};
</script>