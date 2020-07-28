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
    <div style="background:#fff;">
        <Row class="total" :gutter="20" >
            <Col span="6">
                <Card dis-hover	>
                    <div class="left adminnum" >
                        <Icon type="md-person" size="30" />
                    </div>
                    <div class="right" >
                        <div class="number" >1000.00</div>
                        <div class="title" >管理员数量</div>
                    </div>
                </Card>
            </Col>
            <Col span="6">
                <Card dis-hover	>
                    <div class="left like" >
                        <Icon type="ios-thumbs-up" size="30" />
                    </div>
                    <div class="right" >
                        <div class="number" >1000.00</div>
                        <div class="title" >点赞数</div>
                    </div>
                </Card>
            </Col>
            <Col span="6">
                <Card dis-hover	>
                    <div class="left carstarts" >
                        <Icon type="md-trash" size="30"  />
                    </div>
                    <div class="right" >
                        <div class="number" >1000.00</div>
                        <div class="title" >发车次数</div>
                    </div>
                </Card>
            </Col>
            <Col span="6">
                <Card dis-hover	>
                    <div class="left award" >
                        <Icon type="ios-ribbon" size="30"  />
                    </div>
                    <div class="right" >
                        <div class="number" >1000.00</div>
                        <div class="title" >奖励次数</div>
                    </div>
                </Card>
            </Col>
        </Row>

        <Row class="circle-bg" :gutter="20" >
            <Col span="6">
                <Card dis-hover	>
                    <div class="title" >管理员数量</div>
                    <div class="c" >
                        <i-circle stroke-color="#F44336" :percent="40">
                            <span class="demo-Circle-inner" style="font-size:24px">40%</span>
                        </i-circle>
                    </div>
                </Card>
            </Col>
            <Col span="6">
                <Card dis-hover	>
                    <div class="title" >点赞数</div>
                    <div class="c" >
                        <i-circle stroke-color="#ff9800" :percent="80">
                            <span class="demo-Circle-inner" style="font-size:24px">80%</span>
                        </i-circle>
                    </div>
                </Card>
            </Col>
            <Col span="6">
                <Card dis-hover	>
                    <div class="title" >发车次数</div>
                    <div class="c" >
                        <i-circle stroke-color="#2196F3" :percent="20">
                            <span class="demo-Circle-inner" style="font-size:24px">20%</span>
                        </i-circle>
                    </div>
                </Card>
            </Col>
            <Col span="6">
                <Card dis-hover	>
                    <div class="title" >奖励次数</div>
                    <div class="c" >
                        <i-circle stroke-color="#30cc7b" :percent="10">
                            <span class="demo-Circle-inner" style="font-size:24px">10%</span>
                        </i-circle>
                    </div>
                </Card>
            </Col>
        </Row>

        <Row class="chart" :gutter="10" >
            <Col span="10">
                <Card dis-hover	>
                    <div id="chart1" ></div>
                </Card>
            </Col>
            <Col span="14">
                <Card dis-hover	>
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
                },
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
            this.getData()
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
                        this.datas = res.data.info
                        this.count = res.data.count
                    })

                    this.initChart1();
                    this.initChart2();
                }).finally(() => {
                    this.isShowLoading =  false
                })
            },
            // 初始化图标
            initChart1 () {
                let myChart1 = this.$echarts.init(document.getElementById('chart1'));
                let option = {
                    title : {
                        text: '某站点用户访问来源',
                        x:'center',
                        y: 'bottom',
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['最高气温', '最低气温']
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} °C'
                        }
                    },
                    series: [
                        {
                            name: '最高气温',
                            type: 'line',
                            data: [11, 11, 15, 13, 12, 13, 10],
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        },
                        {
                            name: '最低气温',
                            type: 'line',
                            data: [1, -2, 2, 5, 3, 2, 0],
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'},
                                    [{
                                        symbol: 'none',
                                        x: '90%',
                                        yAxis: 'max'
                                    }, {
                                        symbol: 'circle',
                                        label: {
                                            position: 'start',
                                            formatter: '最大值'
                                        },
                                        type: 'max',
                                        name: '最高点'
                                    }]
                                ]
                            }
                        }
                    ]
                };
                myChart1.setOption(option);
            },
            // 初始化图标
            initChart2 () {
                let myChart2 = this.$echarts.init(document.getElementById('chart2'));
                let option = {
                    title : {
                        text: '某站点用户访问来源',
                        x:'center',
                        y: 'bottom',
                    },
                    legend: {},
                    tooltip: {},
                    dataset: {
                        source: [
                            ['product', '2015', '2016', '2017'],
                            ['Matcha Latte', 43.3, 85.8, 93.7],
                            ['Milk Tea', 83.1, 73.4, 55.1],
                            ['Cheese Cocoa', 86.4, 65.2, 82.5],
                            ['Walnut Brownie', 72.4, 53.9, 39.1]
                        ]
                    },
                    xAxis: {type: 'category'},
                    yAxis: {},
                    // Declare several bar series, each will be mapped
                    // to a column of dataset.source by default.
                    series: [
                        {type: 'bar'},
                        {type: 'bar'},
                        {type: 'bar'}
                    ]
                };
                myChart2.setOption(option);
            }
        }
    }
</script>