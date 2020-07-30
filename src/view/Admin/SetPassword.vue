<template>
    <div>
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <Form class="G-form" ref="formValidate" :rules="ruleValidate" :model="submitData" :label-width="$root.iviewConfig.formLabelWidth" label-position="right" >
            <FormItem label="旧密码" prop="old_password" v-if="$store.state.user_info.id != 1" >
                <Input v-model="submitData.old_password" placeholder="请输入旧密码"></Input>
            </FormItem>
            <FormItem label="新密码" prop="new_password" >
                <Input v-model="submitData.new_password" placeholder="请输入新密码"></Input>
            </FormItem>
            <FormItem>
                <Button @click="submit" type="primary">提交</Button>
                <Divider />
                <Button class="back" size="large" icon="ios-arrow-back" @click="$router.back()">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    import { admin } from '@/utils/api'
    export default {
        data () {
            return {
                isShowLoading : false,
                submitData : {
                    old_password : '',
                    new_password : ''
                },
                ruleValidate : {
                    new_password : [
                        {required : true, message: '请输入新密码', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.$emit('on-topSetPathNameAr', ['修改密码'])
            this.setRule()
        },
        methods: {
            submit () {
                this.$refs['formValidate'].validate(valiRes => {
                    if(valiRes) {
                        this.isShowLoading = true
                        this.$Cm.api(admin.user.setPassword, Object.assign({}, this.submitData, {
                            id : (this.$route.params.id || ''),
                            oauth_type: "pwd",
                            port_type: "api"
                        })).then(res => {
                            res.run()
                            this.isShowLoading = false
                        })
                    }
                })
            },
            setRule () {
                if(this.$store.state.user_info.id != 1) {
                    Object.assign(this.ruleValidate, {
                        old_password : [
                            {required : true, message: '请输入旧密码', trigger: 'blur'}
                        ]
                    })
                }
            }
        }
    }
</script>
