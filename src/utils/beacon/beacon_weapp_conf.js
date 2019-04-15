var conf = {
    appKey: "MA1254XW2DMU82",//小程序appKey，从灯塔官网获取
    version: "1.0.0",//小程序版本号
    channelId: "",//小程序渠道号，可不填
    getLocation: false,//获取当前的地理位置、速度，默认开启
    locationType: "wgs84",//获取当前的地理位置类型，默认为：wgs84，当getLocation为false时，此参数不会生效
    getUserInfo: false,//获取用户信息，默认关闭
    onPullDownRefresh: false,//下拉刷新事件统计，默认开启
    onReachBottom: false,//页面下拉触底统计，默认开启
    isDebug: false,//SDK实时联调，默认关闭，发布正式环境时务必关闭
    beforeLoad: function (options) {//此函数在SDK初始化之前调用，可以在此函数内动态修改SDK属性值
        //代码示例：
        // if (options.query.sid == "123") {
        //     this.appKey = "appKey值1";
        // } else if (options.query.sid == "456") {
        //     this.appKey = "appKey值2";
        // }
    }
};
module.exports = conf;
