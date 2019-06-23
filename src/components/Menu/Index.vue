<style>
    .button-x{ margin-right:8px;}
</style>

<template>
    <div class="G-page" >
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <div class="action">
            <Button @click="jumpAddEdit()" icon="md-add-circle" type="primary">
                增加顶级
            </Button>
            <Divider />
        </div>
        <Tree :data="list" :render="renderContent" multiple ></Tree>
    </div>
</template>

<script>
export default {
    data () {
        return {
            isShowLoading : true,
            list : []
        }
    },
    created : function() {
        this.getListData()
    },
    
    methods: {
        getListData () {
            this.$Cm.api('admin/menu/index').then(res => {
                let newList = []
                for(var i in res.data) {
                    var item = res.data[i]
                    // item.expand = true
                    item.render = (h, { root, node, data }) => {
                        return this.getRender(h, { root, node, data })
                    }
                    newList.push(item)
                }
                this.list = newList
                this.isShowLoading = false
            })
        },
        getRender (h, { root, node, data }, isShowBut = true) {
            let self = this
            let button = [
                h('Button', {
                    attrs : {title : '详情'},
                    props : {icon: 'md-albums'},
                    class : 'button-x',
                    on: {
                        click: () => {
                            this.jumpAddEdit(data.father_id, data.id)
                        }
                    }
                }),
                h('Button', {
                    attrs : {title : '删除'},
                    props: {icon: 'ios-remove'},
                    class : 'button-x',
                    on: {
                        click: () => { 
                            this.$Modal.confirm({
                                loading: true,
                                title: '提示',
                                content: '数据删除后将不能恢复,是否确定删除?',
                                cancelText: '取消',
                                okText: '确定',
                                onOk () {
                                    this.$Cm.api('admin/menu/delete',{
                                        id : data.id
                                    }).then(res => {
                                        res.run(false).then(() => {
                                            this.$Message.info('操作成功,刷新数据中...');
                                            self.isShowLoading = true
                                            self.list = []
                                            self.getListData()
                                        })
                                    }).finally(() => {
                                        this.$Modal.remove();
                                    })
                                }
                            });
                        }
                    }
                })
            ]
            if(isShowBut) {
                button.push(
                    h('Button', {
                        attrs : {title : '增加'},
                        props : {icon: 'ios-add'},
                        class : 'button-x',
                        on: {
                            click: () => { 
                                this.jumpAddEdit(data.id)
                            }
                        }
                    }),
                    
                )

            }
            return h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%'
                }
            }, [
                h('span', [
                    h('span', data.title)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right',
                        marginRight: '32px'
                    }
                }, button)
            ])
        },
        jumpAddEdit(fid = 0, id = '') {
            this.$router.push('/main/menu_add_edit/' + fid + '/' + id)
        },
        renderContent (h, { root, node, data }) {
            return this.getRender(h, { root, node, data }, false)
        }
    },
}
</script>
