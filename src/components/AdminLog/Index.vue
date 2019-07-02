<template>
    <div>
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <div>
            <Form inline>
                <FormItem>
                    <Input v-model="searchText" placeholder="ID或管理员ID" />
                </FormItem>
                <FormItem>
                    <Button @click="search" type="info">搜索</Button>
                </FormItem>
            </Form>
        </div>
        <Cm-List ref="CmList" @on-page-change="pageChange" :page="page" :column="column" :data="list" :total="count" />
    </div>
</template>
<script>
    export default {
        data () {
            return {
                isShowLoading : true,
                count : 0,
                page : 0,
                list : [],
                searchText : '',
                column : [
                    {
                        title: 'id',
                        key: 'id',
                        width: 80,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title : '管理员',
                        key : 'admin_name',
                        render: (h, params) => {
                            return h(
                                "div",
                                params.row.admin.nickname
                            );
                        }
                    },
                    {
                        title : '描述',
                        key : 'des'
                    },
                    {
                        title : 'ip',
                        key : 'ip'
                    },
                    {
                        title : '操作时间',
                        key : 'act_time',
                        render: (h, params) => {
                            return h(
                                "div",
                                this.$Cm.formatDate(params.row.create_time)
                            );
                        }
                    },
                ]
            }
        },  
        created() {
            this.getCount().then(() => {
                this.page++
            })
        },
        activated () {
            this.$emit('on-topSetPathNameAr', ['系统设置','管理员操作日志','列表'])
        },
        watch : {
            page (value) {
                if(value == 0) {
                    this.isShowLoading = true
                    this.list = []
                    this.getCount().then(() => {
                        this.page++
                    })
                } else {
                    this.getData()
                }
            }
        },
        methods: {
            // 刷新
            refresh () {
                this.searchText = ''
                this.page = 0
            },
            // 搜索提交
            search () {
                this.page = 0
            },
            // list组建的page变动
            pageChange (e) {
                this.page = e
            },
            // 请求数据
            getData () {
                this.isShowLoading = true
                this.$Cm.api('admin/admin_log/index', {
                    p : this.page,
                    search : this.searchText
                }).then(res => {
                    res.run(false).then(() => {
                        if(res.data.length <= 0) {
                            this.getCount().then(() => {
                                this.page--
                            })
                        } else {
                            this.list = res.data
                        }
                        console.log(this.list)
                    })
                }).finally(() => {
                    this.isShowLoading =  false
                })
            },
            // 获得统计
            getCount () {
                return this.$Cm.api('admin/admin_log/index', {
                    count : 1,
                    search : this.searchText
                }).then(res => {
                    res.run(false).then(() => {
                        this.count = res.data
                    })
                })
            }
        },
    }
</script>
