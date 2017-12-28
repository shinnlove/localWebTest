/**
 * Created by chensheng.zcs on 16/10/17.
 */
$(function () {

    // 测试jQuery动画
    $(".animate-test").slideUp(); // 向上收起
    $(".animate-test").slideDown(); // 向下滑出
    // 动画变换
    var aniStyle = {
        width: 0,
        height: 0
    };
    $(".animate-test").animate(aniStyle, "normal", "linear", function () {
        console.log("ok");
        $(this).html("<span>ok</span>");
    });

    // 测试post提交
    var url = "request.php",
        data = {
            name: "shinnlove",
            id: "11234355"
        };
    utils.NativeXHR.post(url, data, function (result) {
        console.log(result);
    });

    // 测试ajax提交
    var url = "request.php",
        data = {
            id: "123456",
            name: "shinnlove2",
            englishName: "adam"
        },
        opts = {
            isUpload: false,
            beforeSend: function () {
                console.log("请求开始");
            },
            success: function (result, XHR) {
                console.log("请求成功" + result);
            },
            error: function () {
                console.log("请求错误");
            }
        };
    utils.NativeXHR.ajax(url, data, opts); // 调用原生XHR
});