/**
 * Created by chensheng.zcs on 16/10/12.
 */
$(function () {
    jQuery.extend(jQuery.ajax, {_requestCache: {}});

    var basicParamsConfirm = 'instId=asdfs#channelType=sadf#cardNo=123#contractNo=#contractId=#cardIndexNo=#userId=#bizIdentity=#amount=3.13255674563552352345#defaultApiCode=#cardType=#cardHolderName=#certNo=#mobile=#merchantId=#callSystemName=';

    $("body").on("click", "input[name=splitString]", function () {

        var kvResult = utils.Object.splitStrIntoKVObj(basicParamsConfirm, "#", "=");

        if (!utils.Object.fetchValueByKey("instId", kvResult)) {
            utils.ART.showDialog("instId");
            return false;
        }
        if (!utils.Object.fetchValueByKey("channelType", kvResult)) {
            utils.ART.showDialog("channelType");
            return false;
        }
        if (!utils.Object.fetchValueByKey("amount", kvResult)) {
            utils.ART.showDialog("amount");
            return false;
        }
        if (!utils.Validation.isFloatNum(kvResult["amount"])) {
            utils.ART.showDialog("金额必须为浮点数");
            return false;
        }

        console.log($.param(kvResult));

    }).on("click", "input[name=confirmBtn]", function () {
        // 校验json
        var jsonStr = $("textarea[name=keyValue]").val(), jsonObj = null;
        if (jsonStr != "") {
            try {
                jsonObj = $.parseJSON(jsonStr);
                utils.ART.showTip("上传完成");
            } catch (ex) {
                console.log(ex);
                utils.ART.showDialog("解析失败");
            }
        }
    }).on("click", "input[name=ajaxBtn]", function () {
        // 起带缓存的ajax线程提交
        var url = "request.php",
            params = {
                name: "shinnlove"
            }, // 请求数据
            opts = {
                // noDefaultLoading: true, // 不要自定义的Loading框（时间不可控）
                loadingMsg: "请求执行中...", // 自定义loading信息，也可以在beforeSend中呼出有提示信息的等待框
                loadingMask: true, // loading遮罩
                noMsg: true, // 不要成功或错误的解析信息
                "beforeSend": function () {
                }, // return false直接不提交ajax
                "complete": function (XHR, status, requestIndex) {
                    $("body").append("XHR[" + requestIndex + "]请求完毕。<br>");
                }, // 处理完成 to do
                "success": function (result) {
                    console.log(result);
                },
                "error": function (XHR, status, error) {
                }
            }; // 请求选项
        utils.jQueryXHR.ajax(url, params, opts);
    }).on("click", "input[name=loadingBtn]", function () {
        // 提示框
        utils.MLoading.show("加载中，请等待...");
        setTimeout(function () {
            utils.MLoading.tipAfterLoading("您的网络有些问题，请稍后再试[code:4]", 1);
        }, 1500);
    }).on("click", "input[name=kitBtn]", function () {
        // 弹出小工具阶段
        var tmpl = template("generate-tmpl", {});
        if (tmpl == "{Template Error}") {
            utils.ART.showDialog("渲染模板失败，请刷新页面后再试");
            return
        }
        utils.ART.showDialog(tmpl, "路由试算小工具");

        // 生成复制事件阶段（必须在DOM追加后做）
        $("input[name=copyBtn]").zclip({
            path: "js/zclip/ZeroClipboard.swf",
            copy: function () {
                var copyTarget = $("textarea[name=generate-value]").val();
                if (copyTarget.trim() != "") {
                    return copyTarget;
                } else {
                    utils.MLoading.showTip("复制内容不能为空");
                }
            },
            setCSSEffects: false,
            beforeCopy: function () {
            },
            afterCopy: function () {
                utils.Plugin.Zclip.copySuccess();
            }
        });

    }).on("click", ".kv-addBtn", function () {
        // 增加一条KV
        var tmpl = template("kv-tmpl", {});
        if (tmpl == "{Template Error}") {
            tmpl = ""
        }
        if ($(".kit-body .one-kv").length == 0) {
            $(".kit-body").html(tmpl); // 没有新增
        } else {
            $(".kit-body").append(tmpl); // 已经有的继续追加
        }
    }).on("click", ".del-kvblock", function () {
        $(this).closest(".one-kv").remove();
        utils.MLoading.showTip("移除成功，请重新生成试算参数");
    }).on("click", "input[name=generate]", function () {
        // 路由试算生成
        if ($(".kit-body .one-kv").length == 0) {
            utils.MLoading.showTip("至少添加一条属性，请点击新增")
        } else {
            // 循环检验参数不空
            var paramsOK = true, jsonHeader = "{", jsonTail = "}", generateJson = '', generateStr;
            $(".one-kv").each(function () {
                var _t = $(this),
                    tempKey = _t.find(".kv-block input[name=route-key]").val().trim(), // 路由key
                    tempValue = _t.find(".kv-block input[name=route-value]").val().trim(); // 路由value
                generateJson += '"' + tempKey + '":"' + tempValue + '", '
                if (tempKey == "" || tempValue == "") {
                    paramsOK = false;
                }
            })
            if (paramsOK) {
                // 写入试算路由
                generateStr = jsonHeader + generateJson.substr(0, generateJson.length - 2) + jsonTail;
                console.log(generateStr);
                $("#jsonTxt").val(generateStr); // textarea只能用id写入
            } else {
                utils.MLoading.showTip("参数填写不完整，请输入完整");
            }
            // 重新绑定复制事件（防止失效）
            $("input[name=copyBtn]").zclip({
                path: "js/zclip/ZeroClipboard.swf",
                copy: function () {
                    var copyTarget = $("textarea[name=generate-value]").val();
                    if (copyTarget.trim() != "") {
                        return copyTarget;
                    } else {
                        utils.MLoading.showTip("复制内容不能为空");
                    }
                },
                setCSSEffects: false,
                beforeCopy: function () {
                },
                afterCopy: function () {
                    utils.Plugin.Zclip.copySuccess();
                }
            });
        }
    }).on("click", "input[name=multiAjax]", function () {
        var url = "request.php",
            params = [], // 待提交数据
            opts = [],
            total = 10,
            success = 0,
            fail = 0; // 请求选项
        // 构造请求参数
        for (var i = 0; i < 10; i++) {
            // 请求数据
            params[i] = {
                dataId: "dataInfo" + i
            };
            // 请求选项
            opts[i] = {
                requestIndex: i, // 定义请求线程
                // noDefaultLoading: true, // 不要自定义的Loading框（时间不可控）
                loadingMsg: "请求执行中...", // 自定义loading信息，也可以在beforeSend中呼出有提示信息的等待框
                noMsg: true, // 不要成功错误的解析信息
                // 默认自带Loading（无提示），除非noShowLoading=true
                "beforeSend": function () {
                    //utils.MLoading.show("执行中...");
                }, // return false直接不提交ajax
                "complete": function (XHR, status, requestIndex) {
                    $("body").append("XHR[" + requestIndex + "]请求完毕。<br>");
                    if (--total == 0) {
                        //utils.MLoading.hide();
                        $("body").append("所有ajax线程请求完毕。<br>");
                        $("body").append("成功的线程数量:" + success + "。<br>");
                        $("body").append("失败的线程数量:" + fail + "。<br>");
                    }
                }, // 处理完成 to do
                "success": function (result) {
                    console.log(result);
                    success += 1;
                },
                "error": function (XHR, status, error) {
                    fail += 1;
                }
            };
        }
        // 批量起带缓存的ajax线程提交
        for (var j = 0; j < 10; j++) {
            utils.jQueryXHR.ajax(url, params[j], opts[j]); // utils默认post/json
        }
    }).on("mouseenter", "#txt-area", function () {
        console.log("鼠标悬浮");
        if ($(".fixed-layer").css("display") == "none") {
            $(".fixed-layer").show();
            $("body").off("mouseenter", "#txt-area");
        }
    }).on("mouseout", "#txt-area", function () {
        console.log("鼠标移除");
        $(".fixed-layer").hide();
    });

});