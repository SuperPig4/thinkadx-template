<template>
    <div>
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <div>
            <Form inline>
                <FormItem>
                    <Button @click="add_edit()" icon="md-add-circle" type="primary">增加</Button>
                </FormItem>
                <FormItem>
                    <Button @click="del()" icon="md-trash" type="error">批量删除</Button>
                </FormItem>
                <FormItem>
                    <Input v-model="searchText" placeholder="ID或描述" />
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
                        title : '描述',
                        key : 'des',
                        ellipsis : true
                    },
                    {
                        title : '创建时间',
                        key : 'create_time',
                        render: (h, params) => {
                            return h(
                                "div",
                                this.$Cm.formatDate(params.row.create_time)
                            );
                        }
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
                                }, '编辑'),
                                h('Button', {
                                    on : {
                                        click : () => {
                                            this.del(params.row.id)
                                        }
                                    },
                                    props: {
                                        icon : 'md-trash',
                                        type: 'error',
                                        size: 'small'
                                    }
                                }, '删除')
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
            this.$emit('on-topSetPathNameAr', ['系统设置','分组规则','列表'])
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
            // 删除
            del (id) {
                this.$Modal.confirm({
                    loading: true,
                    title: '提示',
                    content: '数据删除后将无法恢复,是否确定删除?',
                    cancelText: '取消',
                    okText: '确定',
                    onOk : () => {
                        if(!id) {
                            let data = this.$refs.CmList.$refs.table.getSelection()
                            if(data.length > 0) {
                                id = []
                                for(let i in data) {
                                    id.push(data[i].id)
                                }  
                            } else {
                                this.$Modal.remove()
                                this.$Message.error('请选择删除数据')
                                return false;
                            }
                        }

                        this.isShowLoading = true
                        this.$Cm.api('admin/admin_rule/delete',{
                            id : id
                        }).then(res => {
                            res.run(false).then(() => {
                                this.$Message.info('操作成功,刷新数据中...')
                                this.getData()
                            })
                        }).finally(() => {
                            this.$Modal.remove()
                            this.isShowLoading =  false
                        })

                    }
                });
            },
            // 跳转至编辑、新增页面
            add_edit (id = '') {
                this.$router.push('/main/admin_rule_add_edit/' + id)
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
                this.$Cm.api('admin/admin_rule/index', {
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
                    })
                }).finally(() => {
                    this.isShowLoading =  false
                })
            },
            // 获得统计
            getCount () {
                return this.$Cm.api('admin/admin_rule/index', {
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
