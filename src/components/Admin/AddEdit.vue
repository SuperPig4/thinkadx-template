<style>
    .img-upload{position: relative;width:60px; height:60px;border-radius: 5px;overflow: hidden;}
    .img-upload img{ width:100%; height:100%;}
    .img-upload:hover .make-action{display:flex;}
    .img-upload .make-action{display: none;justify-content: center;align-items: center;position:absolute;top:0px;left:0px;width:60px;height:60px;border-radius: 5px;background:rgba(0,0,0,0.6);}
    .img-upload .make-action i{color:#fff;font-size:23px;cursor: pointer;margin: 0 2px;}
</style>
<template>
    <div>
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <Form class="G-form" ref="formValidate" :rules="ruleValidate" :model="submitData" :label-width="$root.iviewConfig.formLabelWidth" label-position="right" >
            
            <FormItem label="状态">
                <i-switch v-model="submitData.status" size="large" >
                    <span slot="open">正常</span>
                    <span slot="close">暂停</span>
                </i-switch>
            </FormItem>

            <FormItem label="图标" prop="avatar">
                <Upload 
                    v-show="!submitData.avatar"
                    name="image"
                    ref="upload" 
                    :show-upload-list="true" 
                    :on-success="uploadSuccess" 
                    :before-upload="uploadBefore" 
                    :data="uploadConfig.otherData" 
                    :headers="uploadConfig.headers" 
                    :action="$root.iviewConfig.uploadUrl">
                    <Button icon="ios-cloud-upload-outline">上传</Button>
                </Upload>

                <div v-show="submitData.avatar" class="img-upload">
                    <img :src="submitData.avatar" ></img>
                    <div class="make-action">
                        <Icon type="ios-eye-outline" @click="openImg" ></Icon>
                        <Icon type="ios-trash-outline" @click="delUploadImg" ></Icon>
                    </div>
                </div>
            </FormItem>

            <FormItem label="分组" prop="group_id" >
                <Select v-model="submitData.group_id" filterable >
                    <Option v-for="item in groupList" :key="item.id" :value="item.id">{{item.name}}</Option>
                </Select>
            </FormItem>

            <FormItem label="账号" prop="access">
                <Input v-model="submitData.access" placeholder="请输入账号" :disabled="Boolean(id)" ></Input>
            </FormItem>

            <FormItem label="姓名" prop="nickname" >
                <Input v-model="submitData.nickname" placeholder="请输入姓名"></Input>
            </FormItem>

            <FormItem label="密码" prop="add_data_password" v-if="!id" >
                <Input v-model="submitData.add_data_password" placeholder="请输入密码"></Input>
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
                uploadConfig : {
                    headers : {},
                    otherData : {
                        path : 'menu_icon'
                    },
                },
                submitData : {
                    group_id : 0,
                    avatar : '',
                    access : '',
                    nickname : '',
                    add_data_password : '',
                    status : true
                },
                groupList : [],
                ruleValidate : {
                    nickname : [
                        {required : true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    group_id : [
                        {type:'number', required : true, message: '请选择分组', trigger: 'change' }
                    ],
                    // avatar : [
                    //     {
                    //         required : true,
                    //         validator (rule, value, callback, source, options) {
                    //             if(!value) {
                    //                 callback('请上传头像')
                    //             } else {
                    //                 callback();
                    //             }
                    //         }
                    //     }
                    // ],
                }
            }
        },
        created() {
            this.$emit('on-topSetPathNameAr', ['管理员管理','管理员列表','列表','编辑'])
            this.$route.params.id && (this.id = this.$route.params.id)
            
            this.setRule().then(() => {
                this.$Cm.api('admin/admin_group/index', {
                    all : 1
                }).then(res => {
                    res.run(false).then(() => {
                        this.groupList = res.data
                    })
                })

                if(this.id) {
                    this.isShowLoading = true
                    this.$Cm.api('admin/admin_user/detail',{
                        id : this.id
                    }).then(res => {
                        res.run(false).then(() => {
                            res.data.avatar = res.data.avatar.url
                            res.data.status = Boolean(res.data.status)
                            this.submitData = res.data
                        })
                    }).finally(() => {
                        this.isShowLoading =  false
                    })
                }
            })

        },
        methods : {
            // 根据fid决定验证规则
            setRule () {
                return new Promise((resolve, reject) => {
                    if(!this.id) {
                        Object.assign(this.ruleValidate, {
                            access : [
                                {required : true, message: '请输入账号', trigger: 'blur' }
                            ],
                            add_data_password : [
                                {required : true, message: '请输入密码', trigger: 'blur' }
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
                        this.$Cm.api('admin/admin_user/add_edit', Object.assign({}, this.submitData, {
                            status : Number(this.submitData.status)
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

            openImg () {
                window.open(this.submitData.avatar, '_blank')
            },
            uploadSuccess (e, file) {
                let result = file.response
                if(result.code) {
                    this.submitData.avatar = result.data.url
                } else {
                    this.$Message.error(result.msg)
                }
            },
            delUploadImg () {
                this.submitData.avatar = ''
                this.$refs.upload.clearFiles()
            },
            uploadBefore () {
                return new Promise((resolve, reject) => {
                    this.uploadConfig.headers = new this.$Cm.getApiHeaderData(this.uploadConfig.otherData, false)
                    resolve()
                })
            },
            
        }
    } 
</script>
