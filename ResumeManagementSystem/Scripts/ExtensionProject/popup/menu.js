/*
作用：popup弹出页js
*/
var employee = {
    employeeNo: "",
    token: ""
};
var themeUserSet = {
    theme: ""
};
var loginTimer;
var apiHandle = new BroswerApiHandle().CreateHandle();

$(document).ready(function () {
    //cssDevelop();
    //testMyFunctions();

    //return;

    //更新按钮点击事件，跳转至下载页面
    $("#BtnUpdate").click(function () {
        UpdateClick();
    });

    //目前版本信息显示
    $(".verson-class").each(function() {
        if (!isTestingVersion) {
            $(this).text(appVersion);
        } else {
            $(this).text(appVersion + " 测试版");
        }
    });
    
    //检查是否已经登录过
    var checkLoginFunc = function (item) {
        if (item.employee.employeeNo == "" || item.employee.employeeNo == undefined ||
            item.employee.token == "" || item.employee.token == undefined) {
            $("#loginIndex").show();
            $("#mainIndex").hide();
        } else {
            $("#loginIndex").hide();
            $("#mainIndex").show();
            $("#loginUserCode").html(item.employee.employeeNo + "已登录");
        }
    };
    apiHandle.storageLocalGet("employee", checkLoginFunc);
    
    //退出登录
    $('#Cancel').click(function () {
        employee = {
            employeeNo: "",
            token: ""
        };
        apiHandle.storageLocalSetUserConfig(employee, themeUserSet);
        $("#loginIndex").show();
        $("#mainIndex").hide();
        alert('退出成功！');
    });

    //加载样式
    var curClassName = store.get("ThemeName");
    $('#' + curClassName).click();

    //确定按钮点击事件
    $('#BtnSubmit').click(function () {
        var t = '';
        $("input[name='theme']:checked").each(function () {
            t = this.value;
        });
        store.set("ThemeName", t);
        alert('保存成功！');
    });

    $("#LoginSubmit").click(function() {
        LoginUser();
    });

    //帮助
    $("#BtnForHelp").click(function() {
        GoForHelp();
    });

    //最新版本信息显示
    if (!isTestingVersion) {
        if (store.get("nVersion") == null) {
            $("#nVersion").text(appVersion);
        } else {
            $("#nVersion").text(store.get("nVersion"));
            if (store.get("nVersion") != appVersion) {
                apiHandle.setShowIcon(apiHandle.getPath("../webPopup/resources/images/logo322.png"));
            }
        }
    } else {
        $("#nVersion").text(appVersion + " 测试版");
        $("#BtnUpdate").hide();
    }

    //加载加载方式
    if (store.get("loadStyle") == null) {
        store.set("loadStyle", "autoLoad");
    }
    var curLoadStyle = store.get("loadStyle");
    $('#' + curLoadStyle).click();
    if (curLoadStyle == "handLoad") {
        $("#BtnLoad").show();
    } else {
        $("#BtnLoad").hide();
    }

    //加载方式选择确定按钮
    $('#BtnLoadSubmit').click(function () {
        var t = '';
        $("input[name='load']:checked").each(function () {
            t = this.value;
        });
        store.set("loadStyle", t);
        if (t == "handLoad") {
            $("#BtnLoad").show();
            alert('保存成功！请注意：以后每次简历查看，需要在页面加载完成后方可手动载入小智！');
        } else {
            $("#BtnLoad").hide();
            alert('保存成功！请注意：以后每次简历查看，会自动出现小智！');
        }
    });

    //手动加载小智
    $("#BtnLoad").click(function () {
        LoadExtension();
    });
});

/*
帮助
*/
function GoForHelp() {
    apiHandle.createNewTab("http://rms.pactera.com/help/Plugin.html");
}

/*
启用手动加载模式
*/
function LoadExtension() {
    var backgroundJS = apiHandle.getBackgroundFunc();
    backgroundJS.LoadExtensionOnBG();
}

/*
登录
*/
function LoginUser() {
    $("#loginErrorMsg").hide();
    $("#loginErrorMsgContent").html("");
    var userName = document.getElementById("userName").value;
    var passwd = document.getElementById("password").value;
    var companyName = document.getElementById("companyName").value;
    if (userName == "") {
        $("#loginErrorMsg").show();
        $("#loginErrorMsgContent").html("请输入工号！");
        return;
    }
    if (passwd == "") {
        $("#loginErrorMsg").show();
        $("#loginErrorMsgContent").html("请输入密码！");
        return;
    }
    if (companyName == "") {
        $("#loginErrorMsg").show();
        $("#loginErrorMsgContent").html("请输入公司名称！");
        return;
    }
    var params = {
        employeeNo: userName,
        password: passwd,
        companyName: companyName
    };

    $.ajax({
        type: "POST",
        url: resendConnection + 'Login/UserLogin',
        data: params,
        success: function(data) {
            var response = $.parseJSON(data);
            if (response.Flag != 0) {
                $("#loginErrorMsg").show();
                $("#loginErrorMsgContent").html(response.Result);
            } else {
                $("#loginIndex").hide();
                $("#mainIndex").show();
                employee = {
                    employeeNo: userName,
                    token: BASE64.encoder(userName).replace(/=/g, "[") + ";" + BASE64.encoder(passwd).replace(/=/g, "[") + ";" + BASE64.encoder(response.Result).replace(/=/g, "["),
                };
                $("#loginUserCode").html(employee.employeeNo + "已登录");
                apiHandle.storageLocalSetUserConfig(employee, themeUserSet);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            var httpCode = XMLHttpRequest.status;
            $("#loginErrorMsg").show();
            $("#loginErrorMsgContent").html("出错啦！返回错误值：" + httpCode);
        }
    });
}

/*
判断版本更新
*/
function UpdateClick() {
    var browserName = browserNameConfig;
    $.ajax({
        type: "POST",
        url: resendConnection + 'Version/CheckVersion',
        data: { p_descript: appDescription, p_browser: browserName },
        success: function(data) {
            var version = $.parseJSON($.parseJSON(data).resultContent);
            if (version.Flag == 1) {
                console.log("有新版本啦！");
                store.set('nVersion', version.Info);
                $("#nVersion").text(store.get("nVersion"));
                apiHandle.createNewTab(commonRMSUrl + "/help/PluginDownload.html");
            } else {
                alert("当前为最新版本！");
            }
        },
        error: function(xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest.status + ":" + textStatus);
            $("#nVersion").text(appVersion);
            if (store.get("nVersion").trim() != "") {
                $("#nVersion").text(store.get("nVersion"));
            }
        }
    });
}

/*
测试方法，没啥用
*/
function cssDevelop() {
    $("#loginIndex").hide();
    $("#mainIndex").show();  
}

/*
测试方法，没啥用
*/
function testMyFunctions() {
    //加载加载方式
    if (store.get("loadStyle") == null) {
        store.set("loadStyle", "autoLoad");
    }
    var curLoadStyle = store.get("loadStyle");
    $('#' + curLoadStyle).click();
    if (curLoadStyle == "handLoad") {
        $("#BtnLoad").show();
    } else {
        $("#BtnLoad").hide();
    }

    $("input[name='load']").click(function() {
        var t = '';
        $("input[name='load']:checked").each(function () {
            t = this.value;
        });
        if (t == "handLoad") {
            $("#BtnLoad").show();
        } else {
            $("#BtnLoad").hide();
        }
    });

    //加载方式选择确定按钮
    $('#BtnLoadSubmit').click(function () {
        var t = '';
        $("input[name='load']:checked").each(function () {
            t = this.value;
        });
        store.set("loadStyle", t);
        if (t == "handLoad") {
            $("#BtnLoad").show();
        } else {
            $("#BtnLoad").hide();
        }
        alert('保存成功！');
    });
    //$("#BtnUpdate").click(function () {
    //    UpdateClick();
    //});

    //if (store.get("nVersion") == null) {
    //    $("#nVersion").text(appVersion);
    //}
    //else {
    //    $("#nVersion").text(store.get("nVersion"));
    //}
    //var postData =
    //{
    //    resumeId: "123",
    //    originalResumeId: "223",
    //    employeeNo:"323",
    //    siteCode:1,
    //    token: "1111",
    //    p_version: "12",
    //    p_descript: "121212",
    //    p_browser: "ff",
    //    p_info: ''
    //};
    //$.ajax({
    //    url: "http://localhost:22534/api/User/AddResumeIdConnection",
    //    type: "POST",
    //    //data: JSON.stringify(postData),
    //    data: postData,
    //    success: function (response) {
    //        alert(response.Flag);
    //        alert(response.Result);
    //    }
    //});

}