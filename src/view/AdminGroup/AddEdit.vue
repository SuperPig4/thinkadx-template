<template>
    <div>
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <Form class="G-form" ref="formValidate" :rules="ruleValidate" :model="submitData" style="width:600px;" :label-width="$root.iviewConfig.formLabelWidth" label-position="right" >
            
            <FormItem label="状态">
                <i-switch v-model="submitData.status" size="large" >
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                </i-switch>
            </FormItem>

            <FormItem label="分组名" prop="name" >
                <Input v-model="submitData.name" placeholder="请输分组名"></Input>
            </FormItem>

            <FormItem label="权限规则">
                <Transfer
                filterable
                :data="ruleList"
                :target-keys="submitData.rules"
                @on-change="transferChange"
                ></Transfer>
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
                // 规则列表
                ruleList : [],
                // 加载状态
                isShowLoading : false,
                // 提交表单
                submitData : {
                    name : '',
                    rules : [],
                    status : true
                },
                // 表单验证规则
                ruleValidate : {
                    name : [
                        {required : true, message: '请输入分组名', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.$route.params.id && (this.id = this.$route.params.id)
            this.$Cm.api('admin/admin_rule/index',{
                all : 1
            }).then(res => {
                res.run(false).then(() => {
                    for(let i in res.data) {
                        let item = res.data[i]
                        Object.assign(res.data[i], {
                            key : String(item.id),
                            label : item.des
                        })
                    }
                    this.ruleList = res.data
                })
            })
            this.refresh()
        },
        methods : {
            // 刷新
            refresh () {
                if(this.id) {
                    this.isShowLoading = true
                    this.$Cm.api('admin/admin_group/detail',{
                        id : this.id
                    }).then(res => {
                        res.run(false).then(() => {
                            res.data.rules = res.data.rules.split(',')
                            res.data.status = Boolean(res.data.status)
                            this.submitData = res.data
                        })
                    }).finally(() => {
                        this.isShowLoading =  false
                    })
                }
            },
            transferChange (newTargetKeys, direction, moveKeys) {
                this.submitData.rules = newTargetKeys
            },
            submit () {
                this.$refs['formValidate'].validate(valiRes => {
                    if(valiRes) {
                        this.isShowLoading = true
                        this.$Cm.api('admin/admin_group/add_edit', Object.assign({}, this.submitData, {
                            status : Number(this.submitData.status),
                            rules : this.submitData.rules
                        })).then(res => {
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
