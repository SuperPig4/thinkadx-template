<style>
    .img-upload{position: relative;width:60px; height:60px;border-radius: 5px;overflow: hidden;}
    .img-upload img{ width:100%; height:100%;}
    .img-upload:hover .make-action{display:flex;}
    .img-upload .make-action{display: none;justify-content: center;align-items: center;position:absolute;top:0px;left:0px;width:60px;height:60px;border-radius: 5px;background:rgba(0,0,0,0.6);}
    .img-upload .make-action i{color:#fff;font-size:23px;cursor: pointer;margin: 0 2px;}
</style>

<template>
    <div>
        <Upload 
            v-show="!image"
            name="image"
            ref="CmUpload" 
            :data="otherData" 
            :headers="headers" 
            :on-success="success" 
            :on-error="error"
            :before-upload="beforeUpload"
            :action="$root.iviewConfig.uploadUrl"
            :show-upload-list="true" 
            >
            <Button icon="ios-cloud-upload-outline">上传</Button>
        </Upload>
        <div v-show="image" class="img-upload">
            <img :src="image" ></img>
            <div class="make-action">
                <Icon type="ios-eye-outline" @click="openImg" ></Icon>
                <Icon type="ios-trash-outline" @click="deleteImg" ></Icon>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props : {
            // 上传成功回调
            image : {
                type : String,
                required: true
            },
            // 上传路径
            path : {
                type : String,
                default : 'default'
            },
        },
        data () {
            return {
                // 上传的额外参数
                otherData : {},
                // 包头
                headers : {}
            }
        },
        methods: {
            // 上传失败
            error () {
                this.$emit('on-error', '上传失败,请检查网络是否正常')
            },
            // 上传成功
            success (e, file) {
                let result = file.response
                this.$refs.CmUpload.clearFiles()
                if(result.code) {
                    this.$emit('on-success', result)
                } else {
                    this.$emit('on-error', result.msg)
                }
            },
            // 上传前的处理
            beforeUpload () {
                return new Promise((resolve, reject) => {
                    this.otherData.path = this.path
                    this.headers = this.$Cm.getApiHeaderData(this.otherData, false)
                    resolve()
                })
            },
            // 打开图片
            openImg () {
                window.open(this.image, '_blank')
            },
            // 清空我呢见
            deleteImg () {
                this.$emit('on-delete')
                this.$refs.CmUpload.clearFiles()
            },
        },
    }
</script>
