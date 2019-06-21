<style>
    .button-x{ margin-right:8px;}
</style>

<template>
    <div>
        <div class="action">
            <Button @click="jumpAddEdit" icon="md-add-circle" type="primary">
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
            list : []
        }
    },
    created : function() {
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
        })
    },
    
    methods: {
        getRender (h, { root, node, data }, isShowBut = true) {
            let button = []
            if(isShowBut) {
                button = [
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
                        attrs : {title : '增加'},
                        props : {icon: 'ios-add'},
                        class : 'button-x',
                        on: {
                            click: () => { 
                                this.jumpAddEdit(data.father_id)
                            }
                        }
                    }),
                    h('Button', {
                        attrs : {title : '删除'},
                        props: {icon: 'ios-remove'},
                        on: {
                            click: () => { this.remove(root, node, data) }
                        }
                    })
                ]
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
        jumpAddEdit(fid = '', id = '') {
            this.$router.push('/main/menu_add_edit/' + fid + '/' + id)
        },
        renderContent (h, { root, node, data }) {
            return this.getRender(h, { root, node, data }, false)
        }
    },
}
</script>
