<style>
.layout{height:100%;background: #f5f7f9;position: relative;overflow: hidden;}
.layout-logo{height: 30px;color:#fff;line-height: 30px;border-radius: 3px;float: left;font-size:20px;position: absolute;top: 15px;left: -2%;}
.layout-logo img{height:100%;}
.layout-nav{width: 420px;margin: 0 auto; margin-right: 20px;}
.layout-nav>li{ float:right !important;}
.Sider{ position: relative;  width: 15% !important; min-width: 15% !important; max-width: 15% !important; height:100%; background: #fff;}
.Sider li{ text-align: center;}
.ivu-menu-submenu-title{ padding-left:30px !important; text-align: left !important;}
.ivu-menu-item{padding-left:20px !important;}
.refresh{ position:absolute; top:80px; right:40px; }
.menu-icon{ width:14px; height:14px; position: relative; top:2px; }
</style>
<template>
    <div class="layout">
        <Layout :style="{height:'100%'}">
            <Header>
                <Menu mode="horizontal" theme="dark">
                    <div class="layout-logo">
                        后台管理系统
                    </div>
                    <div class="layout-nav" >
                        <MenuItem name="1">
                            <Dropdown @on-click="userDropdownEv" >
                                <a href="javascript:void(0)">
                                    <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                                    <Icon :style="{marginLeft:'10px', color:'#fff'}" type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem>驴打滚</DropdownItem>
                                    <DropdownItem>炸酱面</DropdownItem>
                                    <DropdownItem disabled>豆汁儿</DropdownItem>
                                    <DropdownItem>冰糖葫芦</DropdownItem>
                                    <DropdownItem name="dropOutLogin" divided >退出</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </MenuItem>
                        <!-- <MenuItem>
                            <Icon type="ios-paper" />
                            内容管理
                        </MenuItem> -->
                    </div>
                </Menu>
            </Header>

            <Layout :style="{height:'100%'}" >
                <Sider hide-trigger class="Sider" >
                    <CmMenu />
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}" >
                    <Button @click="refreshAct" title="刷新" class="refresh" type="primary" shape="circle" icon="md-refresh"></Button>
                    <Breadcrumb :style="{margin: '24px 0', textAlign:'left'}">
                        <BreadcrumbItem v-for="item in pathNameAr" v-bind:key="item" >{{item}}</BreadcrumbItem>
                    </Breadcrumb>
                    <Content :style="{padding: '24px', background: '#fff'}" >
                        <keep-alive>
                            <router-view @on-topSetPathNameAr="setPathNameAr" v-if="$route.path.indexOf('index') != -1" ></router-view>
                        </keep-alive>
                        <router-view @on-topSetPathNameAr="setPathNameAr" v-if="$route.path.indexOf('index') == -1" ></router-view>
                    </Content>
                </Layout>
            </Layout>
            
        </Layout>
    </div>
</template>
<script>
    import CmMenu from './Menu'
    export default {
        data () {
            return {
                // 路径名
                pathNameAr : [
                    '系统设置',
                    '管理员设置',
                    '列表'
                ],
                menuList : []
            }
        },
        components : {
            CmMenu
        },
        created () {
            // 菜单
            this.$Cm.api('admin/menu/get_list').then(res => {
                this.menuList = res.data
            })

            this.$on('test', function() {
                console.log('run test')
            })
        },
        methods: {
            /**
             * 修改路径名
             * @param string/array 如果是数组则直接覆盖/否则只是push
             */
            setPathNameAr (age) {
                if(age instanceof Array) {
                    this.pathNameAr = age
                } else {
                    this.pathNameAr.push(age)
                }
            },
            refreshAct () {
                location.reload() 
            },
            userDropdownEv (name) {
                switch(name) {
                    case 'dropOutLogin' :
                            this.$Cm.dropOutLogin()
                        break;
                }
            },
            dropOutLogin () {
                this.$Cm.dropOutLogin()
            }
        },
    }
</script>