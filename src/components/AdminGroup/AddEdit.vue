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

            <FormItem label="权限规则" v-if="ruleList.length > 1" >
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
                id : 0,
                isShowLoading : false,
                submitData : {
                    name : '',
                    rules : [],
                    status : true
                },
                ruleList : [],
                ruleValidate : {
                    name : [
                        {required : true, message: '请输入分组名', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.$emit('on-topSetPathNameAr', ['管理员管理','管理员分组','列表','编辑'])
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
        methods : {
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
