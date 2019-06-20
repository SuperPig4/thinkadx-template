<style>

    .img-upload{
        position: relative;
        width:60px; 
        height:60px;
        border-radius: 5px;
        overflow: hidden;
    }

    .img-upload img{ 
        width:100%; 
        height:100%;
    }

    .img-upload:hover .make-action{
        display:flex;
    }

    .img-upload .make-action{
        display: none;
        justify-content: center;
        align-items: center;
        position:absolute;
        top:0px;
        left:0px;
        width:60px;
        height:60px;
        border-radius: 5px;
        background:rgba(0,0,0,0.6);
    }

    .img-upload .make-action i{
        color:#fff;
        font-size:23px;
        cursor: pointer;
        margin: 0 2px;
    }
    

</style>
<template>
    <div>
        <Form class="G-form" ref="formValidate" :rules="ruleValidate" :model="submitData" :label-width="$root.iviewConfig.formLabelWidth" label-position="right" >
            <FormItem label="状态">
                <i-switch :value="submitData.status == 1" />
            </FormItem>
            <FormItem label="图标" prop="icon" >
                <Upload 
                    v-show="!submitData.icon"
                    name="image"
                    ref="upload" 
                    :show-upload-list="true" 
                    :on-success="uploadSuccess" 
                    :before-upload="uploadBefore" 
                    :data="otherData" 
                    :headers="headers" 
                    :action="$root.iviewConfig.uploadUrl">
                    <Button icon="ios-cloud-upload-outline">上传</Button>
                </Upload>
                <div v-show="submitData.icon" class="img-upload">
                    <img :src="submitData.icon" ></img>
                    <div class="make-action">
                        <Icon type="ios-eye-outline" @click="openImg" ></Icon>
                        <Icon type="ios-trash-outline" @click="delUploadImg" ></Icon>
                    </div>
                </div>
            </FormItem>
            <FormItem label="标题" prop="title" >
                <Input v-model="submitData.title" placeholder="请输入标题"></Input>
            </FormItem>
            <FormItem label="模块" prop="module" >
                <Input v-model="submitData.module" placeholder="请输入模块"></Input>
            </FormItem>
            <FormItem label="控制器" prop="controller" >
                <Input v-model="submitData.controller" placeholder="请输入控制器"></Input>
            </FormItem>
            <FormItem label="方法" prop="action" >
                <Input v-model="submitData.action" placeholder="请输入方法"></Input>
            </FormItem>

            <div v-if="id" >
                <FormItem>
                <Divider />
                </FormItem>
                <!-- <FormItem label="上级栏目" >
                    <Input disabled :value="submitData.father && submitData.father.title" placeholder="请输入标题"></Input>
                </FormItem> -->
                <FormItem label="创建时间" >
                    <Input disabled :value="submitData.create_time|formatData" placeholder="请输入标题"></Input>
                </FormItem>
            </div>

            <FormItem>
                <Button @click="submit" type="primary">提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                id : 1,
                headers : {},
                otherData : {
                    path : 'menu_icon'
                },
                submitData : {
                    icon : '',
                    title : '',
                    module : '',
                    controller : '',
                    action : '',
                    status : 1,
                    // father_id : 0,
                },
                ruleValidate : {
                    icon : [
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
                    ],
                    title : [
                        {required : true, message: '请输入标题', trigger: 'blur' }
                    ],
                    module : [
                        {required : true, message: '请输入模块', trigger: 'blur' }
                    ],
                    controller : [
                        {required : true, message: '请输入控制器', trigger: 'blur' }
                    ],
                    action : [
                        {required : true, message: '请输入方法', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            if(this.$route.params.id) {
                this.id = this.$route.params.id
                this.$Cm.api('admin/menu/detail',{
                    id : this.$route.params.id
                }).then(res => {
                    res.run(false)
                    res.data.icon = res.data.icon.url
                    this.submitData = res.data
                })
            }
        },
        methods : {
            submit () {
                this.$refs['formValidate'].validate(valiRes => {
                    if(valiRes) {
                        this.$Cm.api('admin/menu/add_edit', this.submitData).then(res => {
                            res.run()
                        })
                    }
                })
            },
            openImg () {
                window.open(this.submitData.icon, '_blank')
            },
            uploadSuccess (e, file) {
                let result = file.response
                if(result.code) {
                    this.submitData.icon = result.data.url
                } else {
                    this.$Message.error(result.msg)
                }
            },
            delUploadImg () {
                this.submitData.icon = {}
                this.$refs.upload.clearFiles()
            },
            uploadBefore () {
                return new Promise((resolve, reject) => {
                    this.headers = new this.$Cm.getApiHeaderData(this.otherData, false)
                    resolve()
                })
            },
            
        }
    } 
</script>
