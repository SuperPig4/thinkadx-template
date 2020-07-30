<template>
    <div>
        <Cm-List 
            ref="CmList"
            :api="listConfig.api"
            :controller="listConfig.controller"
            :searchPlaceholder="listConfig.searchPlaceholder"
            :column="column">
        </Cm-List>
        
    </div>
</template>
<script>
    import { admin } from '@/utils/api'
    export default {
        data () {
            return {
                // 系统配置
                SystemConfig : {
                    pathNameAr : ['系统设置','管理员分组','列表']
                },
                // 列表组件配置参数
                listConfig : {
                    api : admin.group,
                    controller : 'admin_group',
                    searchPlaceholder : 'ID或分组名'
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
                        title : '分组名',
                        key : 'name',
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
                this.$router.push('/main/admin_group_add_edit/' + id)
            },
        },
    }
</script>
