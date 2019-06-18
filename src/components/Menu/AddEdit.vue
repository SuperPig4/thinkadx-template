<template>
    <div>
        <Form class="G-form" :label-width="$root.iviewConfig.formLabelWidth" label-position="right" >
            <FormItem label="图标" >
                <Upload 
                    name="image" 
                    :show-upload-list="true" 
                    :on-success="preview" 
                    :on-format-error="format" 
                    :before-upload="uploadBefore" 
                    :data="otherData" 
                    :headers="headers" 
                    :action="$root.iviewConfig.uploadUrl">
                    <Button icon="ios-cloud-upload-outline">上传</Button>
                </Upload>
            </FormItem>
            <FormItem label="标题" >
                <Input  placeholder="Enter something..."></Input>
            </FormItem>
        </Form>
        <span @click="test">test</span>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                id : 0,
                headers : {},
                otherData : {
                    path : 'menu_icon'
                },
                submitData : {
                    icon : {},
                    title : '',
                    module : '',
                    controller : '',
                    action : '',
                    status : 0,
                    create_time : '',
                    father_id : 0,
                }
            }
        },
        created() {
            
        },
        methods : {
            preview (s, file) {
                console.log(file.response)
            },
            format () {
                console.log('格式错误')
            },
            uploadBefore () {
                return new Promise((resolve, reject) => {
                    this.headers = new this.$Cm.getApiHeaderData(this.otherData, false)
                    resolve()
                })
            },
            test () {
                console.log(this.headersx)
            }
        }
    } 
</script>
