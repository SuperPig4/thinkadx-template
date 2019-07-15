<template>
    <div>
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <Form class="G-form" ref="formValidate" :rules="ruleValidate" :model="submitData" :label-width="$root.iviewConfig.formLabelWidth" label-position="right" >
            
            <FormItem label="描述" prop="des" >
                <Input v-model="submitData.des" placeholder="请输入描述"></Input>
            </FormItem>

            <FormItem label="规则" prop="rule">
                <Input v-model="submitData.rule" type="textarea" placeholder="请输入规则"></Input>
            </FormItem>

            <div v-if="id" >
                <FormItem>
                    <Divider />
                </FormItem>
                <FormItem label="创建时间" >
                    <Input disabled :value="submitData.create_time|formatDate"></Input>
                </FormItem>
            </div>

            <FormItem>
                <Button @click="submit" type="primary">提交</Button>
                <Divider />
                <Button class="back" size="large" icon="ios-arrow-back" @click="$router.back()">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                // 系统配置
                SystemConfig : {
                    pathNameAr : '编辑'
                },
                // 数据id
                id : 0,
                // 加载状态
                isShowLoading : false,
                // 提交数据
                submitData : {
                    des : '',
                    rule : ''
                },
                // 表单验证规则
                ruleValidate : {
                    des : [
                        {required : true, message: '请输入描述', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.$route.params.id && (this.id = this.$route.params.id)
            this.refresh()
        },
        methods : {
            // 刷新
            refresh () {
                if(this.id) {
                    this.isShowLoading = true
                    this.$Cm.api('admin/admin_rule/detail',{
                        id : this.id
                    }).then(res => {
                        res.run(false).then(() => {
                            this.submitData = res.data
                        })
                    }).finally(() => {
                        this.isShowLoading =  false
                    })
                }
            },
            submit () {
                this.$refs['formValidate'].validate(valiRes => {
                    if(valiRes) {
                        this.isShowLoading = true
                        this.$Cm.api('admin/admin_rule/add_edit', Object.assign({}, this.submitData)).then(res => {
                            res.run().then(() => {
                                this.$router.back()
                            })
                        }).finally(() => {
                            this.isShowLoading = false
                        })
                    }
                })
            },
        }
    } 
</script>
