<template>
    <div>
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <Form class="G-form" ref="formValidate" :rules="ruleValidate" :model="submitData" :label-width="$root.iviewConfig.formLabelWidth" label-position="right" >
            <FormItem label="状态">
                <i-switch v-model="submitData.status" />
            </FormItem>
            <FormItem label="图标" prop="icon" v-if="$route.params.fid == 0" >
                <Cm-Upload
                    path="menu_icon"
                    :image="submitData.icon"
                    @on-success="uploadSuccess"
                    @on-error="uploadError"
                    @on-delete="uploadDelete"
                    >
                </Cm-Upload>
            </FormItem>
            <FormItem label="标题" prop="title" >
                <Input v-model="submitData.title" placeholder="请输入标题"></Input>
            </FormItem>
            <FormItem label="模块" prop="module" v-if="$route.params.fid != 0" >
                <Input v-model="submitData.module" placeholder="请输入模块"></Input>
            </FormItem>
            <FormItem label="控制器" prop="controller" v-if="$route.params.fid != 0" >
                <Input v-model="submitData.controller" placeholder="请输入控制器"></Input>
            </FormItem>
            <FormItem label="方法" prop="action" v-if="$route.params.fid != 0" >
                <Input v-model="submitData.action" placeholder="请输入方法"></Input>
            </FormItem>
            <FormItem label="排序值" prop="sort" >
                <Input v-model="submitData.sort" placeholder="请输入排序值(越大越前)"></Input>
            </FormItem>

            <div v-if="id" >
                <FormItem>
                    <Divider />
                </FormItem>
                <!-- <FormItem label="上级栏目" >
                    <Input disabled :value="submitData.father && submitData.father.title" placeholder="请输入标题"></Input>
                </FormItem> -->
                <FormItem label="创建时间" >
                    <Input disabled :value="submitData.create_time|formatDate" placeholder="请输入标题"></Input>
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
                id : 0,
                isShowLoading : true,
                submitData : {
                    sort : 0,
                    icon : '',
                    title : '',
                    module : '',
                    controller : '',
                    action : '',
                    status : true,
                    // father_id : 0,
                },
                ruleValidate : {
                    title : [
                        {required : true, message: '请输入标题', trigger: 'blur' }
                    ],
                }
            }
        },
        created() {
            this.setRule().then(() => {
                if(this.$route.params.id) {
                    this.id = this.$route.params.id
                    this.refresh()
                } else {
                    this.isShowLoading = false
                }

                if(this.$route.params.fid) {
                    this.submitData.father_id = this.$route.params.fid
                }
            })
        },
        methods : {
            // 刷新
            refresh () {
                if(this.id) {
                    this.isShowLoading =  true
                    this.$Cm.api('admin/menu/detail',{
                        id : this.$route.params.id
                    }).then(res => {
                        res.run(false).then(() => {
                            res.data.icon = res.data.icon.url
                            res.data.status = Boolean(res.data.status)
                            this.submitData = res.data
                        })
                    }).finally(() => {
                        this.isShowLoading =  false
                    })
                }
            },
            // 根据fid决定验证规则
            setRule () {
                return new Promise((resolve, reject) => {
                    if(this.$route.params.fid == 0) {
                        this.ruleValidate.icon = [
                            {
                                required : true,
                                validator (rule, value, callback, source, options) {
                                    if(!value) {
                                        callback('请上传图标')
                                    } else {
                                        callback();
                                    }
                                }
                            },
                        ]
                    } else {
                        Object.assign( this.ruleValidate, {
                            module : [
                                {required : true, message: '请输入模块', trigger: 'blur' }
                            ],
                            controller : [
                                {required : true, message: '请输入控制器', trigger: 'blur' }
                            ],
                            action : [
                                {required : true, message: '请输入方法', trigger: 'blur' }
                            ]
                        })
                    }
                    resolve()
                })
            },
            submit () {
                this.$refs['formValidate'].validate(valiRes => {
                    if(valiRes) {
                        this.isShowLoading = true
                        this.$Cm.api('admin/menu/add_edit', Object.assign({}, this.submitData, {
                            status : Number(this.submitData.status)
                        })).then(res => {
                            this.isShowLoading = false
                            res.run().then(() => {
                                this.$router.back()
                            })
                        })
                    }
                })
            },
            uploadSuccess (res) {
                this.submitData.icon = res.data.url
            },
            uploadError (err) {
                this.$Message.error(err)
            },
            uploadDelete () {
                this.submitData.icon = ''
            }
        }
    } 
</script>
