<style>
    /* .action{ margin-bottom:20px; } */
    /* .action button{ margin-right:10px;} */
</style>

<template>
    <div>

        <!-- loading -->
        <slot name="loading">
            <Spin size="large" fix v-show="isShowLoading" ></Spin>
        </slot>

        <!-- 搜索框 -->
        <slot name="search">
            <div>
                <Form inline>
                    <slot name="search-button">
                        <FormItem>
                            <Button @click="add" icon="md-add-circle" type="primary">增加</Button>
                        </FormItem>
                        <FormItem>
                            <Button @click="del" icon="md-trash" type="error">批量删除</Button>
                        </FormItem>
                    </slot>
                    <FormItem>
                        <Input v-model="searchText" :placeholder="searchPlaceholder" />
                    </FormItem>
                    <FormItem>
                        <Button @click="search" type="info">搜索</Button>
                    </FormItem>
                </Form>
            </div>
        </slot>

        <Table 
            ref="table" 
            border 
            :columns="column" 
            :data="list" 
            >
        </Table>

        <Page 
            style="text-align: center; margin-top:20px;" 
            :current="page" 
            :total="total" 
            :page-size="25" 
            @on-change="pageChange"
            simple 
        />
    </div>
</template>

<script>
    export default {
        props : {
            // 搜索框placeholder - 重置了slot之后该参数将无效(search)
            searchPlaceholder : {
                type : String,
                default : 'id'
            },
            // 控制器
            controller : {
                type : String,
                required: true
            },
            // 项
            column : {
                type : Array,
                required: true
            },
            // 接管提交数据
            catchSubData : false,
            // 接管删除按钮事件
            catchDelBut : false,
            // 接管增加按钮事件
            catchAddBut : false
        },
        data () {
            return {
                // 列表
                list : [],
                // 数据总共条数
                total : 0,
                // 当前分页
                page : 1,
                // 搜索内容
                searchText : '',
                // 加载状态 - 重置了slot之后该参数将无效(loading)
                isShowLoading : true,
                // 是否第一次加载
                isDyc : false,
            }
        },
        mounted() {
            this.isDyc = true
            this.getData()
        },
        methods: {
            // 默认按钮-添加事件
            add () {
                if(this.catchAddBut) {
                    this.$emit('add')
                } else {
                    this.$router.push('/main/'+ this.controller +'_add_edit/')
                }
            },
            // 默认按钮-批量删除
            del () {
                if(this.catchDelBut) {
                    this.$emit('del')
                } else {
                    this.$Modal.confirm({
                        loading: true,
                        title: '提示',
                        content: '数据删除后将无法恢复,是否确定删除?',
                        cancelText: '取消',
                        okText: '确定',
                        onOk : () => {
                            let data = this.$refs.table.getSelection()
                            if(data.length <= 0) {
                                this.$Modal.remove()
                                this.$Message.error('请选择删除数据')
                                return false
                            }

                            let ids = []
                            for(let i in data) {
                                ids.push(data[i].id)
                            } 

                            this.isShowLoading = true
                            this.$Cm.api('admin/'+ this.controller +'/delete',{
                                id : ids
                            }).then(res => {
                                res.run(false).then(() => {
                                    this.$Message.info('操作成功,刷新数据中...')
                                    this.getData()
                                })
                            }).finally(() => {
                                this.$Modal.remove()
                                this.isShowLoading = false
                            })
                        }
                    })
                }
            },
            // 搜索
            search () {
                this.page = 1
                this.getData()
            },
            // 分页变动
            pageChange (e) {
                this.page = e
                this.getData()
            },
            // 刷新数据
            refresh () {
                this.getData()
            },
            // 获得数据列表
            async getData (submitData) {
                this.isShowLoading = true
                if(this.catchSubData) {
                    if(!submitData) {
                        this.$emit('catch-SubData')
                        return false
                    } else {
                        submitData = Object.assign({
                            p : this.page,
                            search : this.searchText
                        }, submitData)
                    }
                } else {
                    submitData = {
                        p : this.page,
                        search : this.searchText
                    }
                }
                
                // 获得列表
                let url = 'admin/' + this.controller + '/index'
                this.list = []
                let listRes = await this.$Cm.api(url, submitData)
                listRes.run(false).then(() => {
                    this.list = listRes.data
                })

                // 获得统计
                if(this.isDyc) {
                    this.isDyc = false
                    let countRes = await this.$Cm.api(url, Object.assign({
                        count : 1
                    }, submitData))
                    countRes.run(false).then(() => {
                        this.total = countRes.data
                    })
                }
                this.isShowLoading = false
            }

        },
    }
</script>
