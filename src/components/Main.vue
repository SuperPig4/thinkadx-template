<style>
    .top-circle{ margin:0 auto; margin-top:70px; width:800px; display:flex; justify-content: space-between;  }
    .top-circle>div{  }
    .top-circle .circle-content h1{ font-size:20px; }
    .top-circle .circle-content p{ margin:10px 0px; color: #657180; }
    .top-circle .circle-content p span{ position: relative;}
    .top-circle .circle-content p span::after{ content:''; position:absolute; left:0px; right:0px; margin:0 auto; bottom: -5px; width:50%; height:1px; background:#e0e3e6;  }
    .top-circle .circle-content>span{ display:block; margin-top:15px; }

    .table-bg{ margin-top:50px;}
</style>
<template>
    <div >
        <Spin size="large" fix v-show="isShowLoading" ></Spin>
        <div class="top-circle">
            <div>
                <i-circle
                    :size="200"
                    :trail-width="4"
                    :stroke-width="5"
                    :percent="100"
                    stroke-linecap="square"
                    stroke-color="#43a3fb">
                    <div class="circle-content">
                        <h1>{{count.admin}}</h1>
                        <p>
                            <span>管理员</span>
                        </p>
                        <!-- <span>
                            总占人数
                            <i>75%</i>
                        </span> -->
                    </div>
                </i-circle>
            </div>
            <div>
                <i-circle
                    :size="200"
                    :trail-width="4"
                    :stroke-width="5"
                    :percent="100"
                    stroke-linecap="square"
                    stroke-color="#ff5500">
                    <div class="circle-content">
                        <h1>{{count.actLog}}</h1>
                        <p>
                            <span>今天操作日志数</span>
                        </p>
                        <!-- <span>
                            总占人数
                            <i>75%</i>
                        </span> -->
                    </div>
                </i-circle>
            </div>
            <div>
                <i-circle
                    :size="200"
                    :trail-width="4"
                    :stroke-width="5"
                    :percent="100"
                    stroke-linecap="square"
                    stroke-color="#5cb85c">
                    <div class="circle-content">
                        <h1 style="font-size:14px;">{{(Date.now() / 1000) | formatDate}}</h1>
                        <p>
                            <span>刷新时间</span>
                        </p>
                        <!-- <span>
                            总占人数
                            <i>75%</i>
                        </span> -->
                    </div>
                </i-circle>
            </div>
        </div>

        <div class="table-bg">
            <Table :columns="columns" :data="datas"></Table>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                isShowLoading : true,
                columns: [
                    {
                        title: 'name',
                        key : 'name',
                        align : 'center'
                    },
                    {
                        title: 'value',
                        key : 'value',
                        align : 'center'
                    }
                ],
                datas: [],
                count : {}
            }
        },
        created () {
            this.$emit('on-topSetPathNameAr', ['主页'])
            this.getData()
        },
        methods : {
            // 刷新
            refresh () {
                this.getData()
            },
            getData () {
                this.isShowLoading = true
                this.$Cm.api('admin/tool/main').then(res => {
                    res.run(false).then(() => {
                        this.datas = res.data.info
                        this.count = res.data.count
                    })
                }).finally(() => {
                    this.isShowLoading =  false
                })
            }
        }
    }
</script>