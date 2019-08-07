<style>
    #login { position: relative; height: 100%;}

    .right { width: 35%; float: right; height: 100%; background:#f8f8f9;}
    .left { width: 65%; float: left; height: 100%; display:flex;  justify-content: center;  align-items: center; background: #2f5191;}

    .form-bg{ width:100%; height:100%; display:flex; align-items: center; flex-direction:column; justify-content:center;}
    .form-bg .input-item{ width:60%;}
    .form-bg .Button{ width:100%; }
    
    h1{ font-size:24px; margin-bottom:30px; }

    .verify{ position: relative;}
    .verify input{ border-top-left-radius:0px; border-top-right-radius:0px;}
    .verify .refresh{ cursor: pointer;}
    .verify .verify-img{ border-top-left-radius:4px; border-top-right-radius:4px; overflow: hidden; z-index:10; text-align: center; bottom: 36px; position:absolute; background:#fff; border:1px solid #dcdee2; border-bottom: none; height:70px; width:100%; }
    .verify .verify-img .img-bg{ background:#000; height:70px;}
    .verify .verify-img .img-bg img{ width:160px; height:70px; padding:5px 0px; }
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
                <FormItem class="input-item verify" >
                    <div class="verify-img" v-show="verify.status" @click="showVerify" >
                        <div class="img-bg">
                            <img :src="verify.img" />
                        </div>
                        <!-- <div class="refresh" @click="imgVerify" >
                            点击刷新
                        </div> -->
                    </div>
                    <Input @on-focus="showVerify" @on-blur="showVerify" size="large" v-model="verify.value"  placeholder="请输入验证码(点击显示验证码)">
                        <Icon type="ios-bookmark-outline" slot="prefix"></Icon>
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
            password: "",
            verify : {
                status : false,
                img : '',
                key : '',
                value : ''
            }
        };
    },
    created: function() {
        this.$Cm.api('admin/config/get_system_config').then(res => {
            res.run(false).then(() => {
                this.$store.commit('SetSystemConfig', res.data)
            })
        }).finally(() => {
            this.isShowLoading =  false
        })
    },
    methods: {
        // 创建图片验证码
        imgVerify () {
            this.$Cm.api('admin/tool/get_verify_key').then(res => {
                res.run(false).then(() => {
                    this.verify.key = res.data
                    this.verify.img = this.$Cm.getConfig().apiDomain + 'admin/tool/get_verify_img?key=' + res.data 
                })
            })
        },
        // 显示验证码
        showVerify () {
            this.verify.status = !this.verify.status
            if(this.verify.status) {
                this.imgVerify()
            }
        },
        submit() {
            this.isLogin = true
            this.$Cm.api('admin/admin_user/login',{
                access: this.user,
                password: this.password,
                oauth_type: "pwd",
                port_type: "api",
                verify_key : this.verify.key,
                verify_code : this.verify.value,
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