<style>
    .layout{height:100%;background: #f5f7f9;position: relative;overflow: hidden;}
    .layout-logo{height: 64px;color:#fff;line-height: 64px; text-align: center; border-radius: 3px;font-size:20px; }
    .layout-logo img{height:100%;}
    
    .header{ padding-left:0px; background:#fff; box-shadow:inset 0 0 5px rgba(0,0,0,0.2);}
    .header .user-info{ float:right;}
    .header .left-action{ height:100%; float: left; padding-left:10px;}
    .header .left-action .icon{ line-height:60px; padding:0px 20px; height:100%;}
    .header .left-action .icon:hover{ background:#515a6e; color:#fff; }

    .Sider{ padding:0px 10px; overflow-y:scroll; position: relative;  height:100%; background: #515a6e; overflow-x: hidden;}
    .Sider a{ text-align: left; padding-left:60px !important;}

    .footer{ position:absolute; bottom:0px; width:100%; z-index:1000; background:#515a6e; color:#fff; text-align: center; padding:0px; height:40px; line-height: 40px;}
</style>
<template>
    <div class="layout">
        <Layout :style="{height:'100%'}">

            <!-- 左侧菜单 -->
            <Sider
                ref="side1" 
                hide-trigger 
                collapsible 
                :collapsed-width="0" 
                v-model="isCollapsed"
                :width="250" 
                class="Sider" 
                >
                    <div class="layout-logo">
                        {{$store.state.system_config.admin_system_name}}
                    </div>
                <CmMenu />
            </Sider>

            <Layout :style="{height:'100%', position:'relative'}" >
                
                <!-- 头部 -->
                <Header class="header">
                    <div class="left-action" >
                        <Icon class="icon" @click="toggleLeftMenu" type="md-menu" size="24"></Icon>
                        <Icon class="icon" @click="jumpMain" type="ios-home-outline" size="24"></Icon>
                        <Icon class="icon" @click="refreshAct" type="md-refresh" size="24"></Icon>
                    </div>
                    
                    <div class="user-info" >
                         <Dropdown @on-click="userDropdownEv" >
                            <a href="javascript:void(0)">
                                <Avatar v-if="$store.state.user_info.avatar" :src="$store.state.user_info.avatar.url" />
                                <Avatar v-else >
                                    <template v-if="!$store.state.user_info.avatar">
                                        User
                                    </template>
                                </Avatar>
                                <Icon :style="{marginLeft:'10px', color:'#515a6e'}" type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="cleanSystemCache">清空系统缓存</DropdownItem>
                                <DropdownItem name="setPassword">修改密码</DropdownItem>
                                <DropdownItem name="dropOutLogin" divided >退出</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </Header>
                
                <!-- 右侧内容 -->
                <Layout :style="contentStyleLayout" >
                    <!-- 路径 -->
                    <Breadcrumb :style="{margin: '10px 0 15px', textAlign:'left'}">
                        <BreadcrumbItem v-for="item in pathNameAr" v-bind:key="item" >{{item}}</BreadcrumbItem>
                    </Breadcrumb>

                    <!-- 内容 -->
                    <Card :style="contentStyleCard">
                        <Content :style="{position : 'relative'}" >
                            <keep-alive>
                                <router-view ref="routerView" @on-setContentStyle="setContentStyle" @on-topSetPathNameAr="setPathNameAr" v-if="$route.meta.keepAlive" ></router-view>
                            </keep-alive>
                            <router-view ref="routerView" @on-setContentStyle="setContentStyle" @on-topSetPathNameAr="setPathNameAr" v-if="!$route.meta.keepAlive" ></router-view>
                        </Content>
                    </Card>
                </Layout>

                <!-- 底部版权 -->
                <Footer class="footer" >thinkadx</Footer>
            </Layout>
            
        </Layout>
    </div>
</template>
<script>
    import { admin, system, tool } from '@/utils/api'
    import CmMenu from './Menu'
    export default {
        data () {
            return {
                // 路径名
                pathNameAr : [
                    'Loading'
                ],
                // 是否收起菜单
                isCollapsed : false,
                // 内容节点默认样式
                contentStyle : {
                    // 默认
                    default : {
                        layout : {padding: '15px', paddingBottom: '60px', height:'93%'},
                        card : {overflow:'auto'}
                    },
                    // 改动的
                    change : {
                        layout : {},
                        card : {}
                    }
                }
            }
        },
        components : {
            CmMenu
        },
        computed : {
            contentStyleLayout () {
                return Object.assign({}, this.contentStyle.default.layout, this.contentStyle.change.layout);
            },
            contentStyleCard () {
                return Object.assign({}, this.contentStyle.default.card, this.contentStyle.change.card);
            },
        },
        created () {
            // 用户信息
            this.$Cm.api(admin.user.info).then(res => {
                res.run(false).then(() => {
                    this.$store.commit("SetUserInfo", res.data)
                })
            })

            // 最新的配置信息
            this.$Cm.api(system.config).then(res => {
                res.run(false).then(() => {
                    this.$store.commit('SetSystemConfig', res.data)
                    window.document.title = res.data.admin_system_name
                })
            })
        },
        methods: {
            // 切换显示
            toggleLeftMenu () {
                this.$refs.side1.toggleCollapse();
            },
            // 头像
            getAvatar() {
                if(this.$store.state.user_info.avatar) {
                    return this.$store.state.user_info.avatar.url
                } else {
                    return ''
                }
            },
            /**
             * 修改内容节点样式
             * @param object
             */
            setContentStyle (style) {
                let e = {
                    layout : {},
                    card : {}
                };

                if(style) {
                    e = {
                        layout : style.layout || {},
                        card : style.card || {}
                    };
                }

                this.contentStyle.change = e;
            },
            /**
             * 修改路径名
             * @param string/array 如果是数组则直接覆盖/否则只是push
             */
            setPathNameAr (value) {
                this.pathNameAr = value
            },
            // 跳转到main
            jumpMain () {
                this.$router.push('/main');
            },
            // 刷新当前main组件
            refreshAct () {
                if(this.$refs.routerView.refresh) {
                    this.$refs.routerView.refresh()
                }
            },
            // 用户下拉菜单点击事件
            userDropdownEv (name) {
                switch(name) {
                    case 'dropOutLogin' :
                            this.$Spin.show();
                            this.$Cm.api(admin.user.logout).finally(() => {
                                this.$Spin.hide()
                                this.$Cm.dropOutLogin()
                            })
                        break;
                    case 'setPassword' :
                            this.$router.push('/main/set_password')
                        break;
                    case 'cleanSystemCache' :
                            // 清空系统缓存
                            this.$Cm.api(tool.cleanExpiredCache).then((res) => {
                                res.run(false).then(() => {
                                    this.$Message.success('缓存清除成功') 
                                })
                            })
                        break;
                }
            }
        },
    }
</script>