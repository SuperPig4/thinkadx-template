<style>
    /* 统计 */
    .total{}
    .total>div{ height:100px; }
    .total>div .ivu-card{ }
    .total>div .ivu-card .ivu-card-body{ padding:0px; display:flex;  }
    .total>div .ivu-card .ivu-card-body .left{ height:100px; line-height: 100px; width:100px; text-align: center; color:#fff;}
    .total>div .ivu-card .ivu-card-body .left.adminnum{ background:#F44336;  }
    .total>div .ivu-card .ivu-card-body .left.like{ background:#ff9800;  }
    .total>div .ivu-card .ivu-card-body .left.carstarts{ background:#2196F3;  }
    .total>div .ivu-card .ivu-card-body .left.award{ background:#30cc7b;  }
    .total>div .ivu-card .ivu-card-body .right{ flex-grow: 1; }
    .total>div .ivu-card .ivu-card-body>div{ text-align: center; line-height: 50px; }
    .total>div .ivu-card .ivu-card-body .right .number{ border-bottom: solid 1px #e8eaec; height:50px; }
    .total>div .ivu-card .ivu-card-body .right .title{ height:50px; }

    /* 进度环 */
    .circle-bg{ margin-top:30px; }
    .circle-bg .title{ font-size:20px; text-align: center; }
    .circle-bg .c{ margin-top:20px; text-align: center; }

    /* 图表 */
    .chart{margin-top:80px;}
    .chart>div{}
    #chart1{ width:100%; height:300px; margin-top:10px;}
    #chart2{ width:100%; height:300px; margin-top:10px;}
</style>
<template>
    <div>
        <Row class="total" :gutter="20" >
            <Col span="6">
                <Card>
                    <div class="left adminnum" >
                        <Icon type="md-person" size="30" />
                    </div>
                    <div class="right" >
                        <div class="number" >{{count.admin}}</div>
                        <div class="title" >管理员总数</div>
                    </div>
                </Card>
            </Col>
            <Col span="6">
                <Card>
                    <div class="left like" >
                        <Icon type="logo-buffer" size="30" />
                    </div>
                    <div class="right" >
                        <div class="number" >{{count.action_log}}</div>
                        <div class="title" >操作记录总数</div>
                    </div>
                </Card>
            </Col>
            <Col span="6">
                <Card>
                    <div class="left carstarts" >
                        <Icon type="ios-checkmark-circle" size="30"  />
                    </div>
                    <div class="right" >
                        <div class="number" >{{count.login_success}}</div>
                        <div class="title" >登录成功总数</div>
                    </div>
                </Card>
            </Col>
            <Col span="6">
                <Card>
                    <div class="left award" >
                        <Icon type="md-remove-circle" size="30" />
                    </div>
                    <div class="right" >
                        <div class="number" >{{count.login_fail}}</div>
                        <div class="title" >登录失败总数</div>
                    </div>
                </Card>
            </Col>
        </Row>

        <Row class="circle-bg" :gutter="20" >
            <Col span="6">
                <Card>
                    <div class="title" >管理员数量</div>
                    <div class="c" >
                        <i-circle stroke-color="#F44336" :percent="todayCount.admin">
                            <span class="demo-Circle-inner" style="font-size:24px">{{todayCount.admin}}%</span>
                        </i-circle>
                    </div>
                </Card>
            </Col>
            <Col span="6">
                <Card>
                    <div class="title" >点赞数</div>
                    <div class="c" >
                        <i-circle stroke-color="#ff9800" :percent="todayCount.action_log">
                            <span class="demo-Circle-inner" style="font-size:24px">{{todayCount.action_log}}%</span>
                        </i-circle>
                    </div>
                </Card>
            </Col>
            <Col span="6">
                <Card>
                    <div class="title" >发车次数</div>
                    <div class="c" >
                        <i-circle stroke-color="#2196F3" :percent="todayCount.login_success">
                            <span class="demo-Circle-inner" style="font-size:24px">{{todayCount.login_success}}%</span>
                        </i-circle>
                    </div>
                </Card>
            </Col>
            <Col span="6">
                <Card>
                    <div class="title" >奖励次数</div>
                    <div class="c" >
                        <i-circle stroke-color="#30cc7b" :percent="todayCount.login_fail">
                            <span class="demo-Circle-inner" style="font-size:24px">{{todayCount.login_fail}}%</span>
                        </i-circle>
                    </div>
                </Card>
            </Col>
        </Row>

        <Row class="chart" :gutter="10" >
            <Col span="10">
                <Card>
                    <div id="chart1" ></div>
                </Card>
            </Col>
            <Col span="14">
                <Card>
                    <div id="chart2" ></div>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import { tool } from '@/utils/api'
    export default {
        data () {
            return {
                SystemConfig : {
                    pathNameAr : ['主页'],
                    contentStyle : {
                        card : {
                            background : 'none'
                        }
                    }
                },
                isShowLoading : true,
                
                // 统计
                count : {
                    admin : 0,
                    admin_log : 0,
                    login_success : 0,
                    login_fail : 0
                },
                // 今天统计占比
                todayCount : {
                    admin : 0,
                    admin_log : 0,
                    login_success : 0,
                    login_fail : 0
                },
                // 图表1 数据
                chartData1 : [],
                // 图表2 数据
                chartData2 : [],
            }
        },
        created () {
            this.getData()
        },
        watch : {
            chartData1 : 'initChart1',
            chartData2 : 'initChart2',
        },
        methods : {
            // 刷新
            refresh () {
                this.getData()
            },
            getData () {
                this.isShowLoading = true
                this.$Cm.api(tool.main).then(res => {
                    res.run(false).then(() => {
                        this.count = res.data.count;
                        this.todayCount = res.data.today_count;
                        this.chartData1 = res.data.chart_data_1;
                        this.chartData2 = res.data.chart_data_2;
                    })
                }).finally(() => {
                    this.isShowLoading =  false
                })
            },
            // 初始化图标
            initChart1 () {
                let myChart1 = this.$echarts.init(document.getElementById('chart1'));
                let option = {
                    title : {
                        text: '日志操作频率',
                        x:'center',
                        y: 'bottom',
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            type: 'line',
                            data: this.chartData1
                        }
                    ]
                };
                myChart1.setOption(option);
            },
            // 初始化图标
            initChart2 () {
                let myChart2 = this.$echarts.init(document.getElementById('chart2'));
                let source = [
                    ['星期一'],
                    ['星期二'],
                    ['星期三'],
                    ['星期四'],
                    ['星期五'],
                    ['星期六'],
                    ['星期七'],
                ];
                for(var i = 0; i < 7; i++) {
                    source[i] = source[i].concat(this.chartData2[i]);
                }
                
                let option = {
                    title : {
                        text: '登录成功或失败',
                        x:'center',
                        y: 'bottom',
                    },
                    legend: {},
                    tooltip: {},
                    dataset: {
                        source: [['product', '成功', '失败']].concat(source)
                    },
                    xAxis: {type: 'category'},
                    yAxis: {},
                    // Declare several bar series, each will be mapped
                    // to a column of dataset.source by default.
                    series: [
                        {type: 'bar'},
                        {type: 'bar'}
                    ]
                };
                myChart2.setOption(option);
            }
        }
    }
</script>