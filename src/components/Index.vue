<style>
    .layout{height:100%;background: #f5f7f9;position: relative;overflow: hidden;}
    .layout-logo{height: 30px;color:#fff;line-height: 30px;border-radius: 3px;float: left;font-size:20px;position: absolute;top: 15px;left: -2%;}
    .layout-logo img{height:100%;}
    .layout-nav{width: 420px;margin: 0 auto; margin-right: 20px;}
    .layout-nav>li{ float:right !important;}
    .Sider{ position: relative;  width: 15% !important; min-width: 15% !important; max-width: 15% !important; height:100%; background: #fff;}
    .Sider a{ text-align: left; padding-left:60px !important;}
    .ivu-menu-submenu-title{ padding-left:30px !important; text-align: left !important;}
    .ivu-menu-item{padding-left:20px !important;}
    .refresh{ position:absolute; top:80px; right:40px; z-index:800; }
    .jumpmain{ position:absolute; top:80px; right:80px; z-index:800; }
    .menu-icon{ width:14px; height:14px; position: relative; top:2px; }
</style>
<template>
    <div class="layout">
        <Layout :style="{height:'100%'}">
            <Header>
                <Menu mode="horizontal" theme="dark">
                    <div class="layout-logo">
                        {{$store.state.system_config.admin_system_name}}
                    </div>
                    <div class="layout-nav" >
                        <MenuItem name="1">
                            <Dropdown @on-click="userDropdownEv" >
                                <a href="javascript:void(0)">
                                    <Avatar v-if="$store.state.user_info.avatar" :src="$store.state.user_info.avatar.url" />
                                    <Avatar v-else >
                                        <template v-if="!$store.state.user_info.avatar">
                                            User
                                        </template>
                                    </Avatar>
                                    <Icon :style="{marginLeft:'10px', color:'#fff'}" type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="setPassword">修改密码</DropdownItem>
                                    <DropdownItem name="dropOutLogin" divided >退出</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </MenuItem>
                    </div>
                </Menu>
            </Header>

            <Layout :style="{height:'100%'}" >
                <Sider hide-trigger class="Sider" >
                    <CmMenu />
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}" >
                    <Button @click="refreshAct" title="刷新" class="refresh" type="primary" shape="circle" icon="md-refresh"></Button>
                    <Button @click="jumpMain" title="主页" class="jumpmain" type="success" shape="circle" icon="ios-list-box"></Button>
                    <Breadcrumb :style="{margin: '24px 0', textAlign:'left'}">
                        <BreadcrumbItem v-for="item in pathNameAr" v-bind:key="item" >{{item}}</BreadcrumbItem>
                    </Breadcrumb>
                    <Content :style="{position : 'relative', padding: '24px', background: '#fff'}" >
                        <keep-alive>
                            <router-view ref="routerView" @on-topSetPathNameAr="setPathNameAr" v-if="$route.path.indexOf('index') != -1" ></router-view>
                        </keep-alive>
                        <router-view ref="routerView" @on-topSetPathNameAr="setPathNameAr" v-if="$route.path.indexOf('index') == -1" ></router-view>
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
                    'Loading'
                ]
            }
        },
        components : {
            CmMenu
        },
        created () {
            // 用户信息
            this.$Cm.api('admin/admin_user/info').then(res => {
                res.run(false).then(() => {
                    this.$store.commit("SetUserInfo", res.data)
                })
            })

            // 最新的配置信息
            this.$Cm.api('admin/config/get_system_config').then(res => {
                res.run(false).then(() => {
                    this.$store.commit('SetSystemConfig', res.data)
                })
            })
        },
        methods: {
            getAvatar() {
                if(this.$store.state.user_info.avatar) {
                    return this.$store.state.user_info.avatar.url
                } else {
                    return ''
                }
                
            },
            /**
             * 修改路径名
             * @param string/array 如果是数组则直接覆盖/否则只是push
             */
            setPathNameAr (age) {
                if(age instanceof Array) {
                    this.pathNameAr = age.concat()
                } else {
                    this.pathNameAr.push(age)
                }
            },
            jumpMain () {
                this.$router.push('/main');
            },
            refreshAct () {
                if(this.$refs.routerView.refresh) {
                    this.$refs.routerView.refresh()
                }
            },
            userDropdownEv (name) {
                switch(name) {
                    case 'dropOutLogin' :
                            this.$Cm.dropOutLogin()
                        break;
                    case 'setPassword' :
                            this.$router.push('/main/set_password')
                        break;
                }
            }
        },
    }
</script>