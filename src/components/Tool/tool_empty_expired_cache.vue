<style>
    .tool_empty_expired_cache{ display:flex; justify-content: center; align-items: center; height:100%;}
    .tool_empty_expired_cache button{ width:200px; height:100px;  }
</style>
<template>
    <div class="tool_empty_expired_cache" >
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <Button type="primary" @click="empty" >清空过期缓存</Button>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                // 系统配置
                SystemConfig : {
                    pathNameAr : ['系统设置','缓存管理']
                },
                isShowLoading : false,
            }
        },
        methods : {
            empty () {
                this.isShowLoading = true
                this.$Cm.api('admin/tool/empty_expired_cache').then((res) => {
                    res.run(false).then(() => {
                       this.$Message.success('操作成功') 
                    })
                }).finally(() => {
                    this.isShowLoading =  false
                })
            }
        }
    }
</script>