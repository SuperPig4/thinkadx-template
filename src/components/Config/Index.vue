<template>
    <div>
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <div>
            <Form inline>
                <FormItem>
                    <Button @click="add_edit()" icon="md-add-circle" type="primary">增加</Button>
                </FormItem>
                <FormItem>
                    <Input v-model="searchText" placeholder="ID或名称" />
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
                        type: 'selection',
                        align: 'center',
                        width: 50,
                        fixed: 'left',
                    },
                    {
                        title: 'id',
                        key: 'id',
                        width: 80,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title : '名称',
                        key : 'name',
                    },
                    {
                        title : '类型',
                        key : 'type_text',
                    },
                    {
                        title : '描述',
                        key : 'description',
                    },
                    {
                        title: '操作',
                        fixed: 'right',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    on: {
                                        click : (e) => {
                                            this.add_edit(params.row.id)
                                        },
                                    },
                                    props: {
                                        icon : 'ios-create',
                                        type: 'default',
                                        size: 'small'
                                    },
                                    style : 'margin-right:10px;'
                                }, '编辑')
                            ]);
                        }
                    }
                ]
            }
        },  
        created() {
            this.getCount().then(() => {
                this.page++
            })
        },
        activated () {
            this.$emit('on-topSetPathNameAr', ['系统设置','系统配置','列表'])
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
            // 跳转至编辑、新增页面
            add_edit (id = '') {
                this.$router.push('/main/config_add_edit/' + id)
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
                this.$Cm.api('admin/config/index', {
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
                return this.$Cm.api('admin/config/index', {
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
