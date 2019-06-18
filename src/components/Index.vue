<style>
.layout{
    height:100%;
    background: #f5f7f9;
    position: relative;
    overflow: hidden;
}
.layout-logo{
    height: 30px;
    color:#fff;
    line-height: 30px;
    border-radius: 3px;
    float: left;
    font-size:20px;
    position: absolute;
    top: 15px;
    left: -2%;
}
.layout-logo img{
    height:100%;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
.layout-nav>li{
    float:right !important;
}
.Sider{ 
    width: 15% !important;
    min-width: 15% !important;
    max-width: 15% !important;
    height:100%;
    background: #fff;
}

.ivu-menu-submenu-title{
    padding-left:30px !important;
    text-align: left !important;
}

.ivu-menu-item{
    padding-left:20px !important;
}


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
                    <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
                        <Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                Item 1
                            </template>
                            <MenuItem name="1-1">Option 1</MenuItem>
                            <MenuItem name="1-2">Option 2</MenuItem>
                            <MenuItem name="1-3">Option 3</MenuItem>
                        </Submenu>
                        <Submenu name="2">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                Item 2
                            </template>
                            <MenuItem name="2-1">Option 1</MenuItem>
                            <MenuItem name="2-2">Option 2</MenuItem>
                        </Submenu>
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="ios-analytics"></Icon>
                                Item 3
                            </template>
                            <MenuItem name="3-1">Option 1</MenuItem>
                            <MenuItem name="3-2">Option 2</MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                    <Breadcrumb :style="{margin: '24px 0', textAlign:'left'}">
                        <BreadcrumbItem>Home</BreadcrumbItem>
                        <BreadcrumbItem>Components</BreadcrumbItem>
                        <BreadcrumbItem>Layout</BreadcrumbItem>
                    </Breadcrumb>
                    <Content :style="{padding: '24px', background: '#fff'}">
                        <router-view></router-view>
                    </Content>
                </Layout>
            </Layout>
            
        </Layout>
    </div>
</template>
<script>
    export default {
        methods: {
            userDropdownEv (name) {
                switch(name) {
                    case 'dropOutLogin' :
                            this.$Cm.dropOutLogin()
                        break;
                }
            },
            dropOutLogin () {
                console.log('执行了')
                this.$Cm.dropOutLogin()
            }
        },
    }
</script>