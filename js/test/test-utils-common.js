/**
 * Created by chensheng.zcs on 16/10/16.
 */
$(function () {
    utils.jQueryExtension.init(); // 初始化jQuery配置

    // 判断是否中文字符
    $("body").on("click", "input[name=testChineseChar]", function () {
        var str = $("input[name=chineseChar]").val().trim();
        var flag = utils.String.hasChineseChar(str);
        console.log(flag);
    });

    // Email正则
    var email = "chensheng.zcs@alibaba-inc.com";
    var flag = utils.Validation.isEmail(email);
    console.log(flag);

    // GPS地理位置调用
    var gps = utils.GPS.getLocation(); // 过三秒才能调用
    setTimeout(function () {
        console.log(gps);
        $("body").append(JSON.stringify(gps)); // 获取地理位置
    }, 2000);

    // 获取日期
    console.log(utils.Date.getStdCurrentTime()); // 获取标准时间
    console.log(utils.Date.getStdCurrentTime(true)); // 获取带毫秒的标准时间
    console.log(utils.Date.getStdPlusCurrentTime(true)); // 获取标准时间带上下午

    console.log(utils.Date.stringToGMTDate(utils.Date.getStdCurrentTime())); // 标准时间转GMT时间

    var str = "Thu Oct 13 19:40:28 CST 2016";
    console.log("======");
    console.log(str);
    console.log(utils.Date.stringToGMTDate(str));

    // 模拟原生XMLHttpRequest请求
    var url = "request.php",
        data = {
            name: "shinnlove"
        },
        opts = {
            loadStart: function () {
                console.log("请求开始");
            },
            progress: function () {
                console.log("处理中");
            },
            load: function (result) {
                console.log(result);
            },
            error: function () {
                console.log("请求失败");
            },
            abort: function () {
                console.log("请求终止");
            }
        };
    utils.NativeXHR.ajax(url, data, opts); // 原生请求

});