<template>
    <div>
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <Form class="G-form" ref="formValidate" :rules="ruleValidate" :model="submitData" :label-width="$root.iviewConfig.formLabelWidth" label-position="right" >
            
            <FormItem label="配置名" prop="name" >
                <Input v-model="submitData.name" placeholder="请输入配置名"></Input>
            </FormItem>

            <FormItem label="别名" prop="alias" >
                <Input v-model="submitData.alias" placeholder="请输入别名"></Input>
            </FormItem>

            <FormItem label="类型" prop="type" >
                <Select v-model="submitData.type">
                    <Option value="system" >系统配置</Option>
                    <Option value="app" >应用配置</Option>
                </Select>
            </FormItem>

            <FormItem label="内容" prop="value" >
                <Input v-model="submitData.value" placeholder="请输入内容"></Input>
            </FormItem>

            <FormItem label="描述" prop="description">
                <Input v-model="submitData.description" type="textarea" placeholder="请输入描述"></Input>
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
    export default {
        data () {
            return {
                // 系统配置
                SystemConfig : {
                    pathNameAr : '编辑'
                },
                id : 0,
                isShowLoading : false,
                submitData : {
                    name : '',
                    alias : '',
                    type : '',
                    description : ''
                },
                ruleValidate : {
                    name : [
                        {required : true, message: '请输入配置名', trigger: 'blur' }
                    ],
                    alias : [
                        {required : true, message: '请输入别名', trigger: 'blur' }
                    ],
                    type : [
                        {required : true, message: '请选择类型', trigger: 'change' }
                    ],
                    description : [
                        {required : true, message: '请输入描述', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.$route.params.id && (this.id = this.$route.params.id)
            if(this.id) {
                this.isShowLoading = true
                this.$Cm.api('admin/config/detail',{
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
        methods : {
            submit () {
                this.$refs['formValidate'].validate(valiRes => {
                    if(valiRes) {
                        this.isShowLoading = true
                        this.$Cm.api('admin/config/add_edit', Object.assign({}, this.submitData)).then(res => {
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
