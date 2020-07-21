<style>
    .menu-icon{ width:14px; height:14px; position: relative; top:2px; }
</style>
<template>
    <div >
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <Menu theme="light" width="auto" accordion>
            <Submenu :name="item.id" v-for="item in menuList" v-bind:key="item.id" >
                <template slot="title">
                    <img :src="item.icon.url" class="menu-icon" ></img>
                    {{item.title}}
                </template>
                <MenuItem :name="itemTow.id" :to="'/main/'+itemTow.controller+'_'+itemTow.action" v-for="itemTow in item.children" v-bind:key="itemTow.id" >{{itemTow.title}}</MenuItem>
            </Submenu>
        </Menu>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                isShowLoading : true,
                menuList : []
            }
        },
        created () {
            // 菜单
            this.$Cm.api('admin/menu/get_list').then(res => {
                this.menuList = res.data
                this.isShowLoading = false
            })
        },
        methods : {
        }
    }
</script>