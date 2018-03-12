/*
页面注入后的起始方法
*/

console.log("extension loaded");
var apiHandle = new BroswerApiHandle().CreateHandle();
var resumeDelayPages = new Array(
    { "Name": "zh", "URL": "newrms.cjol.com/resume/detail", "Code": "3" },
    { "Name": "ec", "URL": "www.ifchange.com/resume?id", "Code": "6" }
);//需要延迟加载的，因为post请求后台拼接的简历
var currentPageName = "";//当前页面名称
var employeeNo;//员工号
var timeTickRMS;//计时变量
var timeCount = 0;//30秒计时器

/*
初始化方法
*/
function PageReadyFunction() {
    
    //判断是否为简历网站
    if (!siteHelper.IsWorksite()) {
        console.log("This not the correct page that we need!");
        return;
    }

    //判断浏览器是否支持
    browserHelper.IsSupported();

    //加载弹出框
    var currentTheme = store.get('ThemeName');
    if (currentTheme === null) {
        currentTheme = 'tran';
    }
    themeHelper.LoadTheme(currentTheme);

    //判断简历是否为58的，如果是58，启动替换程序以替换矢量图
    if (document.location.href.indexOf("jianli.58.com") >= 0) {
        LoadTCInforReplaceFunction();
    } else {
        MainFunction();
    }
    
}

/*
主程序执行
*/
function MainFunction() {
    if (!IsDelay()) {
        //加载主程序
        LoadAfterTheme();
    } else {
        //延迟加载或请求处理
        switch (currentPageName) {
            case "zh":
                timeTickRMS = setInterval(function () {
                    //console.log(timeCount);
                    timeCount++;
                    if (timeCount > 30) {
                        timeCount = 0;
                        clearInterval(timeTickRMS);
                        return;
                    }
                    if ($("#div_resume .resume_info_up").text().indexOf("简历编号") >= 0 && timeCount <= 30) {
                        timeCount = 0;
                        clearInterval(timeTickRMS);
                        //加载主程序
                        LoadAfterTheme();
                    }
                }, 1000);
                break;
            case "ec":
                timeTickRMS = setInterval(function () {
                    //console.log(timeCount);
                    timeCount++;
                    if (timeCount > 30) {
                        timeCount = 0;
                        clearInterval(timeTickRMS);
                        return;
                    }
                    if ($("._name").innerText != "" && timeCount <= 30) {
                        timeCount = 0;
                        clearInterval(timeTickRMS);
                        //加载主程序
                        LoadAfterTheme();
                    }
                }, 1000);
                break;
            default:
                break;
        }
    }
}

/*
判断是否需要延迟加载
*/
function IsDelay() {
    var urlCurrentPage = document.location.href;
    for (var x in resumeDelayPages) {
        if (urlCurrentPage.indexOf(resumeDelayPages[x].URL) >= 0) {
            currentPageName = resumeDelayPages[x].Name;
            return true;
        }
    }
    currentPageName = "";
    timeCount = 0;
    return false;
}

/*
主程序启动方法，用于网页判断、浏览器支持、简历判断等功能
*/
function LoadAfterTheme() {

    //判断小智是否已经加载
    if ($("#TableContent").length>=1 || $(".default_workDiv").length >= 1 || $(".default_sleepDiv").length >= 1 || $(".metroBox").length >= 1 || $(".metro_Icon").length >= 1) {
        //console.log("小智已加载");
        return;
    }

    //执行鼠标滚轮监控事件（目前只适用于火狐）
    MouseScroll();

    //执行主程序
    try {
        var main = new Main();
        main.Process();
        //DownloadCountZL();
    }
    catch (err) {
        console.log(err.message);
        logHelper.Log(err.message);
    }
}

/*
加载58同城简历信息手动替换程序
*/
function LoadTCInforReplaceFunction() {
    var style = "<style>.menu_Container{height : 360px;width : 270px;background-color : #FFF;border : 2px solid #000;font-family: 'Microsoft YaHei UI','Microsoft YaHei',serif;padding:5px;position: fixed;right: 0px;bottom: 0px;font-size: 16px;z-index: 5000;}</style>";
    var html = "<div class='menu_Container' id='xiaozhiMenu'><div>请按照简历内容填写以下信息后点击“确定”按钮，进行简历查重</div>" +
        "<div style='margin-top:5px'>姓名：<input type='text' id='tc_name' placeholder='请输入简历姓名'/><span style='display:block;font-size: 15px;margin-left: 48px'>例如：张三</span></div>" +
        "<div>性别：<input type='text' id='tc_sex' placeholder='请输入性别'/><span style='display:block;font-size: 15px;margin-left: 48px'>例如：男</span></div>" +
        "<div>年龄：<input type='text' id='tc_age' placeholder='请输入年龄'/><span style='display:block;font-size: 15px;margin-left: 48px'>例如：25</span></div>" +
        "<div>学历：<input type='text' id='tc_degree' placeholder='请输入学历'/><span style='display:block;font-size: 15px;margin-left: 48px'>例如：本科</span></div>" +
        "<div>工作经验：<input type='text' id='tc_exp' placeholder='请输入工作经验'/><span style='display:block;font-size: 15px;margin-left: 48px'>例如：1年以下请填写1，5-10请填写10，6年以上填写6</span></div>" +
        "<div>电话：<input type='text' id='tc_tel' placeholder='请输入电话'/><span style='display:block;font-size: 15px;margin-left: 48px'>例如：18512345678</span></div>" +
        "<div style='display:none'>邮箱：<input type='text' id='tc_mail' placeholder='请输入邮箱'/><span style='display:block;font-size: 15px;margin-left: 48px'>例如：zhangsan@pactera.com</span></div>" +
        "<div style='margin-top:15px;'><span id='infoConfirmBtn' style='cursor:pointer;margin-left: 120px;bottom:0px;position:relative;background-color:#2D89EF;color:#FFF;width:100px;'>&nbsp;&nbsp;确定&nbsp;&nbsp;</span></div>" +
        "</div>";
    $(".pvpbg").html($(".pvpbg").html() + style + html);
    $(document).delegate('#infoConfirmBtn', 'click', function () {
        ConfirmTCReplace();
    });
    if ($("#getContact").text().indexOf("查看联系方式") >= 0 || $(".tel-pwd").length != 0) {
        $("#tc_tel").parent().hide();
        $("#tc_mail").parent().hide();
        $("#xiaozhiMenu").height(300);
    }
}

/*
检查输入信息并且替换信息
*/
function ConfirmTCReplace() {
    if ($("#tc_name").val().trim() == "") {
        alert("请输入姓名！");
        return;
    }
    if ($("#tc_sex").val().trim() == "") {
        alert("请输入性别！");
        return;
    }
    if ($("#tc_age").val().trim() == "") {
        alert("请输入年龄！");
        return;
    }
    if ($("#tc_degree").val().trim() == "") {
        alert("请输入学历！");
        return;
    }
    if ($("#tc_exp").val().trim() == "") {
        alert("请输入工作经验！");
        return;
    }
    if ($("#tc_sex").val().trim() != "男" && $("#tc_sex").val().trim() != "女") {
        alert("请输入正确的性别！");
        $("#tc_sex").val("");
        return;
    }
    var ageReg = /^\+?[1-9]\d*$/;
    if (!ageReg.test($("#tc_age").val().trim())) {
        alert("请输入正确的年龄！");
        $("#tc_age").val("");
        return;
    }
    if ($("#tc_degree").val().trim() != "高中以下" && $("#tc_degree").val().trim() != "高中" && $("#tc_degree").val().trim() != "中专/技校" &&
        $("#tc_degree").val().trim() != "大专" && $("#tc_degree").val().trim() != "本科" && $("#tc_degree").val().trim() != "硕士" &&
        $("#tc_degree").val().trim() != "博士" && $("#tc_degree").val().trim() != "MBA/EMBA") {
        alert("请输入正确的学历！");
        $("#tc_degree").val("");
        return;
    }
    var expReg = /^\+?[0-9]\d*$/;
    if (!expReg.test($("#tc_exp").val().trim())) {
        alert("请输入正确的工作经验！");
        $("#tc_exp").val("");
        return;
    }

    if ($("#getContact").text().indexOf("查看联系方式") < 0 && $(".tel-pwd").length==0) {
        if ($(".real-mobile").length > 0) {
            if ($("#tc_tel").val().trim() == "") {
                alert("请输入手机！");
                return;
            }
        }
        if ($("#tc_tel").val().trim() != "") {
            var telReg = /^1[34578]\d{9}$/;
            if (!telReg.test($("#tc_tel").val().trim())) {
                alert("请输入正确的手机！");
                $("#tc_tel").val("");
                return;
            }
        }
        //if ($("#tc_mail").val().trim() != "") {
        //    var mailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        //    if (!mailReg.test($("#tc_mail").val().trim())) {
        //        alert("请输入正确的邮箱！");
        //        $("#tc_mail").val("");
        //        return;
        //    }
        //}
    }

    $("#name").text($("#tc_name").val().trim());
    $(".sex").text($("#tc_sex").val().trim());
    $(".age").text($("#tc_age").val().trim() + "岁");
    $(".edu").text($("#tc_degree").val().trim());
    $(".edu").next().next().text($("#tc_exp").val().trim() + "年工作经验");

    if ($("#getContact").text().indexOf("查看联系方式") < 0 && $(".tel-pwd").length == 0) {
        $(".real-mobile").text($("#tc_tel").val().trim());
    }

    $("#xiaozhiMenu").remove();
    MainFunction();
}

/*
监听方法，用于监听background.js是否发送信息
*/
function MainFunctionListener(request, sender, sendResponse) {
    employeeNo = request.defaultEmployeeNo;
    tokenGlobal = request.defaultToken;
    PageReadyFunction();
    apiHandle.removeListener(MainFunctionListener, 2);
}

apiHandle.addListener(MainFunctionListener, 2);


/*
监听方法，监听鼠标滚轮事件，火狐专用
*/
function MouseScroll() {
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc);
    }
}

/*
鼠标滚轮滚动时触发的方法，如果在小智内部使用滚轮，依据情况进行翻页显示
*/
var scrollFunc = function (e) {
    if (isInArea) {
        //如果是正值就是向下滚，负值就是向下滚
        if (e.detail < 0) {
            rollNum = rollNum - 1;
            if (rollNum < 0) {
                rollNum = 0;
            }
            buildPageContent(allData, false);
        } else {
            rollNum = rollNum + 1;
            if ((rollNum + 3) > allRollCount) {
                rollNum = allRollCount - 3;
            }
            if (rollNum < 0) {
                rollNum = 0;
            }
            buildPageContent(allData, false);
        }
    }
}


//智联下载量统计（废弃）
function DownloadCountZL() {
    var summary = $('.summary-bottom').text();
    //是否包括mail关键字 以此判断页面是否包含联系信息
    var hasContactInfo = (summary.indexOf('如需联系方式请下载该简历') < 0);
    
    if ($(".previewLayer11").length == 0 && hasContactInfo) {
        return;
    }
    $(".previewLayer11").eq(1).removeClass("previewLayer11").addClass("previewLayerRms11");
    var scripts = "<script>"
        + "$(\".previewLayerRms11\").live(\"click\", function () {"
        + "    var extID = $(\"#extId\").val();"
        + "    var source = $(\"#viewSource\").val();"
        + "    var resumeVersion = $(\"#resume_version\").val();"
        + "    var dType = $(\"#Olive_download_btn\").data(\"dtype\");"
        + "    var language = GetLanguage(); "
        + "    var resumeName = GetResumeName(); "
        + "    if ($(\"#resumeDownloadNum\") == null) {"
        + "        PopupDownResumeRms(extID, resumeVersion, language, resumeName, source, dType);"
        + "    }"
        + "    else {"
        + "        var resumeDownloadNum = $(\"#resumeDownloadNum\").val();"
        + "        if (resumeDownloadNum != \"0\") {"
        + "            PopupDownResumeRms(extID, resumeVersion, language, resumeName, source, dType, function(){"
        + "                getCouponZLB();"
        + "            });"
        + "        }"
        + "        else {"
        + "            $.popupDiv({"
        + "                title: \"下载简历\", url: \"/resumepreview/resume/_Download?extID=\" + extID + \"&resumeVersion=\" + resumeVersion + \"&language=\" + language + \"&dType=\" + dType"
        + "            });"
        + "        }"
        + "    }"
        + "    return false;"
        + "});"
        + "function PopupDownResumeRms(extID, resumeVersion, language, resumeName, source, dType, cbFn) {"
        + "    $.popupDiv({"
        + "          title: \"下载简历\", " 
        + "            url: \"/resumepreview/resume/_Download?extID=\" + extID + \"&resumeVersion=\" + resumeVersion + \"&language=\" + language + \"&dType=\" + dType, buttons: {"
        + "      \"下 载\": function () {"
        + "                   $(this).unbind(\"click\");"
        + "                   var favoriteID = $(\"#favorite\").val();"
        + "                   var dType = $(\".Olive_download_btn\").data(\"dtype\"), coupCode;"
        + "                   if($(\".paytab li:eq(1)\").hasClass('now')){"
        + "                      dType = 3;"
        + "                      coupCode = $(\"#sleCon\").val();"
        + "                      coupCode == 'notuse' && (coupCode = '');"
        + "                   }"
        + "                   var favoriteName = $(\"#favorite\").find(\"option:selected\").text();"
        + "                   var postdata = {couponcode: coupCode, extID: extID, versionNumber: resumeVersion, favoriteID: favoriteID, resumeName: resumeName, dType: dType };"
        + "                   myAjax({"
        + "                       url: \"/resumepreview/resume/DownloadResume\","
        + "                  dataType: \"json\","
        + "                      type: \"POST\","
        + "                      data: postdata,"
        + "                   success: function (data) {"
        + "                                if (data.ErrorCode === -10001) {"
        + "                                    document.location.href = \"http://rd2.zhaopin.com/s/loginmgr/login.asp\";"
        + "                                    return false;"
        + "                                }"
        + "                                $.popupClose();"
        + "                                $(\".szmr_overts\").css({ 'width': '265px' });"
        + "                                if (data.ErrorCode === 0) {"
        + "alert(\"成功啦，这里写下载量+1的代码请求哦\"); "
        + "                                    ShowMsg(\"265\", \"<div class='szmr_sm'>简历下载至“<span>\" + favoriteName + \"</span>”</div>\", 8000);"
        + "                                    var form = $(\"#srListForm\");"
        + "                                    if (form.length > 0) {"
        + "                                        var frm = document.getElementById(\"srListForm\");"
        + "                                        var postUrl = \"http://rd.zhaopin.com/resumepreview/resume/viewmany\" + location.search + \"&currentExtId=\" + extID;"
        + "                                        if ($(\"#listPosition\").length > 0) {"
        + "                                            var listPositionVal = $(\"#listPosition\").val();"
        + "                                            postUrl = postUrl + \"&listPosition=\" + listPositionVal;"
        + "                                        }"
        + "                                        frm.action = postUrl;"
        + "                                        form.submit();"
        + "                                    } else {"
        + "                                        setTimeout(\"document.location.href = location.href\", 2000);"
        + "                                    }"
        + "                                } else {"
        + "alert(\"出错啦\"); "
        + "                                    ShowMsg(\"265\", \"<div class='szmr_sm'>\" + data.Message + \"</div>\", 4000);"
        + "                                }"
        + "                            }"
        + "                     });"
        + "                 },"
        + "      \"取 消\": function () {"
        + "                    $.popupClose();"
        + "                 }"
        + "    }, width: 420,"
        + "    success: function () {"
        + "        if ($(\"#productError\").val() === \"True\") {"
        + "            var message = $(\"#productErrorMessage\").val();"
        + "            message = message ? message : \"\";"
        + "            var download = $(\"#IsDownloaded\").val();"
        + "            var ZLBEnough = $(\"#IsZLBEnough\").val();"
        + "            $.popupClose();"
        + "            if (ZLBEnough == 'False') {"
        + "                $.popupDiv({"
        + "                    title: \"提示\","
        + "                      msg: '<b>下载该简历，将消耗<span style=\"color:#eb6100;\">30个</span>智联币！</b><br><br><span>您智联币余额不足，无法下载，请去充值！</span><br><br>',"
        + "                  buttons: {"
        + "                             \"去充值\": function () {"
        + "                                            window.open('http://e.zhaopin.com/zhilianCurrency/5/getform.do', '_blank');"
        + "                                         },"
        + "                               \"取消\": function () {"
        + "                                           $.popupClose();"
        + "                                         }"
        + "                           }"
        + "                });"
        + "                return;"
        + "            }"
        + "            if (download === \"True\") {"
        + "                $.popupDiv({ title: \"下载简历\", msg: message, buttons: { \"确 定\": function () { window.location.reload(); } } });"
        + "            } else {"
        + "                ShowMsg(\"400\", \"<div class='szmr_sm'>\" + message + \"</div>\", 4000);"
        + "            }"
        + "          }"
        + "          if(typeof cbFn == 'function'){"
        + "             cbFn();"
        + "          }"
        + "        }"
        + "    });"
        + "}"
        + "</script>";
    var bodyHtml = "";
    $("body").append(bodyHtml + scripts);
}



