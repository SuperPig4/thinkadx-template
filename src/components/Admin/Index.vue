<template>
    <div>
        <Cm-List 
            ref="CmList"
            @del="del"
            :catchDelBut="true"
            :controller="listConfig.controller"
            :searchPlaceholder="listConfig.searchPlaceholder"
            :column="column">
        </Cm-List>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                // 系统配置
                SystemConfig : {
                    pathNameAr : ['系统设置','管理员管理','列表']
                },
                // 列表组件配置参数
                listConfig : {
                    controller : 'admin_user',
                    searchPlaceholder : '用户ID或昵称'
                },
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
                        title : '昵称',
                        key : 'nickname',
                    },
                    {
                        title : '状态',
                        key : 'status_text',
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
                                }, '编辑')
                            ]);
                        }
                    }
                ]
            }
        },  
        methods: {
            // 刷新
            refresh () {
                this.$refs.CmList.refresh()
            },
            // 跳转至编辑、新增页面
            add_edit (id = '') {
                this.$router.push('/main/admin_user_add_edit/' + id)
            },
            del () {
                this.$Modal.confirm({
                    loading: true,
                    title: '提示',
                    content: '数据删除后将无法恢复,是否确定删除?',
                    cancelText: '取消',
                    okText: '确定',
                    onOk : () => {
                        let data = this.$refs.CmList.$refs.table.getSelection()
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
                        this.$Cm.api('admin/admin_user/delete',{
                            delete_id : ids
                        }).then(res => {
                            res.run(false).then(() => {
                                this.$Message.info('操作成功,刷新数据中...')
                                this.$refs.CmList.getData()
                            })
                        }).finally(() => {
                            this.$Modal.remove()
                            this.isShowLoading = false
                        })
                    }
                })
            },
        },
    }
</script>
