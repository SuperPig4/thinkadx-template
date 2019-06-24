<template>
    <div>
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <div class="action">
            <Form inline>
                <FormItem>
                    <Input v-model="searchText" placeholder="用户ID或昵称" />
                </FormItem>
                <FormItem>
                    <Button @click="search" type="primary">搜索</Button>
                </FormItem>
            </Form>
        </div>
        <Cm-List :column="column" :data="list" />
    </div>
</template>
<script>
    export default {
        data () {
            return {
                isShowLoading : true,
                count : 0,
                column : [
                    {
                        type: 'selection',
                        align: 'center',
                        width: 50,
                        fixed: 'left',
                    },{
                        title: 'id',
                        key: 'id',
                        width: 80,
                        align: 'center',
                        fixed: 'left'
                    },{
                        title : '昵称',
                        key : 'nickname',
                    },{
                        title : '创建时间',
                        key : 'create_time',
                        render: (h, params) => {
                            return h(
                                "div",
                                this.$Cm.formatDate(params.row.create_time)
                            );
                        }
                    },{
                        title: '操作',
                        fixed: 'right',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    on: {
                                        click: (e) => {console.log(params)},
                                    },
                                    props: {
                                        icon : 'ios-create',
                                        type: 'default',
                                        size: 'small'
                                    },
                                    style : 'margin-right:10px;'
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        icon : 'md-trash',
                                        type: 'error',
                                        size: 'small'
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                list : [],
                searchText : ''
            }
        },  
        created() {
            this.$Cm.api('admin/admin_user/index', {
                count : 1
            }).then(countRes => {
                countRes.run(false).then(() => {
                    this.count = countRes.data
                    this.getData()
                })
            })
        },
        methods: {
            search () {
                this.list = []
                this.getData()
            },
            getData () {
                this.isShowLoading = true
                this.$Cm.api('admin/admin_user/index', {
                    search : this.searchText
                }).then(res => {
                    this.list = res.data
                    this.isShowLoading = false
                })
            }
        },
    }
</script>
