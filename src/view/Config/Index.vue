<template>
    <div>
        <Cm-List 
            ref="CmList"
            :api="listConfig.api"
            :controller="listConfig.controller"
            :searchPlaceholder="listConfig.searchPlaceholder"
            :column="column">
            <template v-slot:search-button>
                <FormItem>
                    <Button @click="add_edit()" icon="md-add-circle" type="primary">增加</Button>
                </FormItem>
            </template>
        </Cm-List>
    </div>
</template>
<script>
    import { config } from '@/utils/api'
    export default {
        data () {
            return {
                // 系统配置
                SystemConfig : {
                    pathNameAr : ['系统设置','系统配置','列表']
                },
                // 列表组件配置参数
                listConfig : {
                    api : config,
                    controller : 'config',
                    searchPlaceholder : 'ID或名称'
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
        methods: {
            // 刷新
            refresh () {
                this.$refs.CmList.refresh()
            },
            // 跳转至编辑、新增页面
            add_edit (id = '') {
                this.$router.push('/main/config_add_edit/' + id)
            },
        },
    }
</script>
