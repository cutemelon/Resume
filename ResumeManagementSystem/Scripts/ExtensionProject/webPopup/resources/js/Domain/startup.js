/*
作用：主程序及主要方法
*/

var _HANDLER;
var _CONTACTINFO;
var _RESUMEID;
var _MOBILE;//手机全局变量
var _EMAIL;//邮箱全局变量
var _SEARCHTYPE;//搜索模式 0-关联查找 1-精确查找 2-模糊查找
var _ERRORINFOFORRELATIONSEARCH = "";
var searchFuncHandle;

var Main = function(){ };

Main.prototype.Process = function() {
    searchFuncHandle.initSearch();
};

var ExtensionState = function () { };

/*
初始化
*/
ExtensionState.prototype.initSearch = function() {
    logHelper.Log('current state : InitState');

    _msgHelper.InitIcon('Dormancy');

    _HANDLER = (new HandlerFactory()).Create();

    var hasContactInfo;
    try {
        hasContactInfo = _HANDLER.hasContactInfo();
    } catch (err) {
        MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.CONTACTINFOERROR, "", 2);
        throw new Error(err.message);
    }

    //因为目前调用统一的接口，但是前端这里还是记录下是精确查重还是模糊查重方便纠错
    if (hasContactInfo) {
        searchFuncHandle.exactSearch(true);
    } else {
        searchFuncHandle.hubbleSearch(true);
    }
}

/*
模糊查重
*/
ExtensionState.prototype.hubbleSearch = function(isRelative) {
    logHelper.Log('current state : HubbleState');
    //获取查重内容
    try {
        var vagueData = _HANDLER.getDataForSearch();
    }
    catch (err) {
        MessageBoxInfoShow(MSG.COLLECTDATAERROR, "", "", 2);
        return;
    }
    //弹出正在查询提示
    MessageBoxInfoShow(MSG.SEARCH_CONTENT, "", "", 0);
    if (isRelative) {
        //关联简历查询
        var relationSearch = searchFuncHandle.getRelationResumeById(0);
        _MOBILE = vagueData.mobile;
        _EMAIL = vagueData.email;
        _SEARCHTYPE = 2;
        if (relationSearch == "token error") {
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.TOKENERROR, "", 2);
            return;
        } else if (relationSearch == "0") {

        } else if (relationSearch == "1") {
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, _ERRORINFOFORRELATIONSEARCH, "", 2);
            return;
        } else if (relationSearch == "2") {
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.SERVERERROR, "", 2);
            return;
        } else if (relationSearch == "4") {
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, _ERRORINFOFORRELATIONSEARCH, "  <a target=\"blank\" style=\"font-size:16px;\" href=\"http://rms.pactera.com/help/Plugin.html\">帮助</a>", 2);
            return;
        } else {
            MessageBoxInfoShow(MSG.RESULT_TITLE2, relationSearch, "", 1);
            return;
        }
    }
    //模糊查重
    _RESUMEID = vagueData.identity;

    logHelper.Log(vagueData.name);
    logHelper.Log(vagueData.birthday);
    logHelper.Log(vagueData.cities);
    logHelper.Log(vagueData.email);
    logHelper.Log(vagueData.extraDatas);
    logHelper.Log(vagueData.graduateYear);
    logHelper.Log(vagueData.identity);
    logHelper.Log(vagueData.mobile);
    logHelper.Log(vagueData.mobileLast);
    logHelper.Log(vagueData.registry);
    logHelper.Log(vagueData.school);
    logHelper.Log(vagueData.sex);

    var func0 = function (data) {
        MessageBoxInfoShow(MSG.RESULT_TITLE, data, "", 1);
    };
    var func1 = function () {
        MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.SERVERERROR, "", 2);
    };

    var _ops = vagueData;
    //warning
    //_hubbleState.oStateContext.setState(_hubbleState.oStateContext.getImportState());
    //_hubbleState.oStateContext.process();
    $.ajaxPost('Hubble', _ops, func0, func1);
}

/*
关联查重
*/
ExtensionState.prototype.getRelationResumeById= function(type) {
    try {
        var resumeId = _HANDLER.getResumeId();
    }
    catch (errs) {
        MessageBoxInfoShow(ERROR_MSG.E101, "", "", 2);
        throw new Error('101-' + errs.message);
    }
    if (resumeId == "") {
        return "0";
    }
    var ops = {
        resumeId: resumeId,
        siteCode: siteHelper.CurPageInfo().Code,
        searchType: type,
        token: tokenGlobal,
        employeeNo: employeeNo,
        p_version: appVersion,
        p_descript: appDescription,
        p_browser: browserNameConfig,
        p_info: ''
    };

    _MOBILE = "";
    _EMAIL = "";
    _SEARCHTYPE = 0;
    _RESUMEID = _HANDLER.getResumeShowId();

    logHelper.Log('start post : RelationResume');
    logHelper.Log('post Url   : ' + method2url['RelationResume']);
    var resultTemp = "0";
    $.ajax({
        type: "POST",
        url: method2url['RelationResume'],
        data: ops,
        async: false,
        success: function (response) {
            logHelper.Log('response succeed ');
            console.log(response);
            var responseData = $.parseJSON(response);
            var result = new Object();
            if (responseData.result == 1) {
                if (typeof (responseData.resultContent) == 'object')
                    result = responseData.resultContent;
                else
                    result = $.parseJSON(responseData.resultContent);
                switch (result.Flag) {
                    case 0:
                        if (typeof (result.Result) == 'object')
                            resultTemp = result.Result;
                        else
                            resultTemp = $.parseJSON(result.Result);
                        if (resultTemp.length > 0) {
                        } else {
                            resultTemp = "0";
                        }
                        break;
                    case 1:
                        resultTemp = "1";
                        _ERRORINFOFORRELATIONSEARCH = result.Info;
                        break;
                    case 2:
                        resultTemp = "2";
                        break;
                    case 4:
                        resultTemp = "4";
                        _ERRORINFOFORRELATIONSEARCH = result.Info;
                        break;
                    case 5:
                        logHelper.Log("Data From Server Cache");
                        if (typeof (result.Result) == 'object')
                            resultTemp = result.Result;
                        else
                            resultTemp = $.parseJSON(result.Result);
                        if (resultTemp.length > 0) {
                        } else {
                            resultTemp = "0";
                        }
                        break;
                    default:
                        resultTemp = "0";
                }
            } else {
                resultTemp = "token error";
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            resultTemp = "0";
            var httpCode = xmlHttpRequest.status;
            if (httpCode == 404 || httpCode == '404' || httpCode == 0 || httpCode == '0') {
                MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.SERVERNOTFOUND, "", 2);
                throw new Error('104-' + httpCode);
            }
            else if (httpCode == 500 || httpCode == '500') {
                MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.SERVERPROGRAMERROR, "", 2);
                throw new Error('105-' + httpCode);
            } else {
                MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.UNKNOWERROR, "", 2);
                throw new Error('106-' + httpCode);
            }
        }
    });
    return resultTemp;
}

/*
精确查重
*/
ExtensionState.prototype.exactSearch = function (isRelative) {
    logHelper.Log('current state : ExactState');
    MessageBoxInfoShow(MSG.SEARCH_CONTENT, "", "", 0);
    //获取查重内容
    try {
        var contactInfo = _HANDLER.getContactInfo();
        _CONTACTINFO = contactInfo;
    }
    catch (err) {
        MessageBoxInfoShow(MSG.COLLECTDATAERROR, "", "", 2);
        return;
    }
    if (isRelative) {
        //关联查重
        var relationSearch = searchFuncHandle.getRelationResumeById(0);
        _MOBILE = contactInfo.mobile;
        _EMAIL = contactInfo.email;
        _SEARCHTYPE = 1;
        if (relationSearch == "token error") {
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.TOKENERROR, "", 2);
            return;
        } else if (relationSearch == "0") {

        } else if (relationSearch == "1") {
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, _ERRORINFOFORRELATIONSEARCH, "", 2);
            return;
        } else if (relationSearch == "2") {
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.SERVERERROR, "", 2);
            return;
        } else if (relationSearch == "4") {
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, _ERRORINFOFORRELATIONSEARCH, "  <a target=\"blank\" style=\"font-size:16px;\" href=\"http://rms.pactera.com/help/Plugin.html\">帮助</a>", 2);
            return;
        } else {
            MessageBoxInfoShow(MSG.RESULT_TITLE2, relationSearch, "", 1);
            if (relationSearch.length == 0) {
                searchFuncHandle.autoUpdateResume(2);
            } else {
                searchFuncHandle.autoUpdateResume(3);
            }
            return;
        }
    }
    _RESUMEID = contactInfo.identity;

    logHelper.Log(contactInfo.name);
    logHelper.Log(contactInfo.birthday);
    logHelper.Log(contactInfo.cities);
    logHelper.Log(contactInfo.email);
    logHelper.Log(contactInfo.extraDatas);
    logHelper.Log(contactInfo.graduateYear);
    logHelper.Log(contactInfo.identity);
    logHelper.Log(contactInfo.mobile);
    logHelper.Log(contactInfo.mobileLast);
    logHelper.Log(contactInfo.registry);
    logHelper.Log(contactInfo.school);
    logHelper.Log(contactInfo.sex);

    var func0 = function (data) {
        MessageBoxInfoShow(MSG.RESULT2_TITLE, data, "", 1);
        if (data.length == 0) {
            searchFuncHandle.autoUpdateResume(2);
        } else {
            searchFuncHandle.autoUpdateResume(3);
        }
    };

    var func1 = function () {
        searchFuncHandle.importResume();
    };

    var _ops = contactInfo;
    //warning
    //_exactState.oStateContext.setState(_exactState.oStateContext.getImportState());
    //_exactState.oStateContext.process();
    $.ajaxEncodePost('Hubble', _ops, func0, func1);
}

/*
上传简历
*/
ExtensionState.prototype.importResume= function() {
    logHelper.Log('current state : ImportState');
    _msgHelper.ChangeTitle(MSG.IMPORT_CONTENT);
    var siteName = siteHelper.CurPageInfo().Name;
    var htmlContent = "";
    var noHtmlContent = "";
    switch (siteName) {
        case 'zl':
            var resumeRecommendZl = $('#rewardhrresult').html();
            var resumeRight = $('.resume-preview-right').html();
            $('#rewardhrresult').html("");
            $('.resume-preview-right').html("");
            htmlContent = document.getElementsByClassName('resume-body-left')[0].innerHTML;
            noHtmlContent = document.getElementsByClassName('resume-body-left')[0].innerText.trim();
            $('#rewardhrresult').html(resumeRecommendZl);
            $('.resume-preview-right').html(resumeRight);
            break;
        case 'wy':
            var resumeRecommend = $('#resumeRecommend').html();
            $('#resumeRecommend').html("");
            htmlContent = document.getElementById('divResume').innerHTML;
            noHtmlContent = $("#divResume").text().trim();
            $('#resumeRecommend').html(resumeRecommend);
            break;
        case 'lp':
            var resumeHideLP = $(".print-hide").html();
            $(".print-hide").html("");
            htmlContent = $(".menu-section")[0].innerHTML;
            noHtmlContent = $(".menu-section")[0].innerText.trim();
            $(".print-hide").html(resumeHideLP);
            break;
        case 'zh':
            htmlContent = document.getElementsByClassName('resume_div_wrap')[0].innerHTML;
            noHtmlContent = document.getElementsByClassName('resume_div_wrap')[0].innerText.trim();
            break;
        case 'ec':
            var operateE = $(".ic-menu-default").html();
            $(".ic-menu-default").html("");
            var yueE = $(".extra-btn-box").html();
            $(".extra-btn-box").html("");
            var sideE = $(".side-wrapper").html();
            $(".side-wrapper").html("");
            htmlContent = $(".ic-layout-main").html();
            noHtmlContent = $(".ic-layout-main")[0].innerText.trim();
            $(".ic-menu-default").html(operateE);
            $(".extra-btn-box").html(yueE);
            $(".side-wrapper").html(sideE);
            break;
        case 'tc':
            var resumeHideTC = $(".expectInfo").find(".stonefont").length > 0 ? $(".expectInfo").find(".stonefont")[0].innerText : "";
            var resumeActionTC = $(".telephone").find(".resume-action").length > 0 ? $(".telephone").find(".resume-action")[0].innerHTML : "";
            var jobInformTC = $(".jobInform").length > 0 ? $(".jobInform").html() : "";
            $($(".expectInfo").find(".stonefont")[0]).html("");
            $($(".telephone").find(".resume-action")[0]).html("");
            $(".jobInform").html("");
            htmlContent = document.querySelector(".vipResContent").innerHTML;
            noHtmlContent = document.querySelector(".vipResContent").innerText.trim();
            if (resumeHideTC != "") {
                $($(".expectInfo").find(".stonefont")[0]).html(resumeHideTC);
            }
            if (resumeActionTC != "") {
                $($(".telephone").find(".resume-action")[0]).html(resumeActionTC);
            }
            if (jobInformTC != "") {
                $(".jobInform").html(jobInformTC);
            }
            break;
        default:
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.UNKNOWERROR, "", 2);
            throw new Error('303');
    }
    if (curUrl.indexOf('ResumeViewFolder') >= 0)
        htmlContent = htmlContent.replace($('#divChart').html(), '');
    var re = new RegExp('·', "g");
    htmlContent = htmlContent.replace(re, '.');

    var func0 = function (data) {
        logHelper.Log("Import Resume Succeed");
        MessageBoxInfoShow(MSG.RESULT3_TITLE, '<a target="_blank" href="' + commonUrl + '/Resume/ResumeDetailInfo?ID=' + data.ResumeId + '">' + MSG.LINK + '</a>', "", 3);
    };

    var func1 = function () {
        logHelper.Log("Import Resume Failed");
        MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.UPLOADRESUMEBYUSER, "", 2);
    };

    var structuredResume = _HANDLER.uploadResume();
    structuredResume.importType = 0;
    structuredResume.src = [siteHelper.CurPageInfo().Code];
    structuredResume.htmlContent = htmlContent;
    structuredResume.noHtmlContent = noHtmlContent;

    var _ops = {
        structuredResumeDetail: structuredResume
    };

    $.ajaxPost('StructuredImport', _ops, func0, func1);
}

/*
自动上传简历
*/
ExtensionState.prototype.autoUpdateResume = function (type) {
    var existResume = $('.default_IsExacte');
    if (type == 2) {
        searchFuncHandle.updateResume(_CONTACTINFO.name, "", undefined, undefined, type);
    }
    else {
        if ($('.default_IsExacte').length > 0) {
            logHelper.Log("AutoUpdate Resume");
            existResume.hide();
            var repeatName = existResume.attr('repeatId').split('|')[1];
            var repeatId = existResume.attr('repeatId').split('|')[0];
            _msgHelper.MsgBoxLeft('正在自动更新 ' + repeatName + ' 的简历');
            var tempFun = function () {
                $('.metro_Left_Content').text(repeatName + '的简历更新成功');
                var t = setInterval(function () {
                    $('.metro_Left').hide();
                }, 3000);
            };

            var tempFun2 = function () {
                $('.metro_Left_Content').html(repeatName + '的简历更新失败<br/>请手动更新');
                var t = setInterval(function () {
                    $('.metro_Left').hide();
                }, 3000);
            };
            searchFuncHandle.updateResume(repeatName, repeatId, tempFun, tempFun2, type);
        }
    }
}

/*
更新简历
*/
ExtensionState.prototype.updateResume= function(resumeName, repeatId, funTemp, funcTemp2, type) {
    logHelper.Log("Update Resume");
    var siteName = siteHelper.CurPageInfo().Name;
    var htmlContent = "";
    var noHtmlContent = "";
    switch (siteName) {
        case 'zl':
            var resumeRecommendZl = $('#rewardhrresult').html();
            var resumeRight = $('.resume-preview-right').html();
            $('#rewardhrresult').html("");
            $('.resume-preview-right').html("");
            htmlContent = document.getElementsByClassName('resume-body-left')[0].innerHTML;
            noHtmlContent = document.getElementsByClassName('resume-body-left')[0].innerText.trim();
            $('#rewardhrresult').html(resumeRecommendZl);
            $('.resume-preview-right').html(resumeRight);
            break;
        case 'wy':
            var resumeRecommend = $('#resumeRecommend').html();
            $('#resumeRecommend').html("");
            htmlContent = document.getElementById('divResume').innerHTML;
            noHtmlContent = $("#divResume").text().trim();
            $('#resumeRecommend').html(resumeRecommend);
            break;
        case 'lp':
            var resumeHideLP = $(".print-hide").html();
            $(".print-hide").html("");
            htmlContent = $(".menu-section")[0].innerHTML;
            noHtmlContent = $(".menu-section")[0].innerText.trim();
            $(".print-hide").html(resumeHideLP);
            break;
        case 'zh':
            htmlContent = document.getElementsByClassName('resume_div_wrap')[0].innerHTML;
            noHtmlContent = document.getElementsByClassName('resume_div_wrap')[0].innerText.trim();
            break;
        case 'ec':
            var operateE = $(".ic-menu-default").html();
            $(".ic-menu-default").html("");
            var yueE = $(".extra-btn-box").html();
            $(".extra-btn-box").html("");
            var sideE = $(".side-wrapper").html();
            $(".side-wrapper").html("");
            htmlContent = $(".ic-layout-main").html();
            noHtmlContent = $(".ic-layout-main")[0].innerText.trim();
            $(".ic-menu-default").html(operateE);
            $(".extra-btn-box").html(yueE);
            $(".side-wrapper").html(sideE);
            break;
        case 'tc':
            var resumeHideTC = $(".expectInfo").find(".stonefont").length > 0 ? $(".expectInfo").find(".stonefont")[0].innerText : "";
            var resumeActionTC = $(".telephone").find(".resume-action").length > 0 ? $(".telephone").find(".resume-action")[0].innerHTML : "";
            var jobInformTC = $(".jobInform").length > 0 ? $(".jobInform").html() : "";
            $($(".expectInfo").find(".stonefont")[0]).html("");
            $($(".telephone").find(".resume-action")[0]).html("");
            $(".jobInform").html("");
            htmlContent = document.querySelector(".vipResContent").innerHTML;
            noHtmlContent = document.querySelector(".vipResContent").innerText.trim();
            if (resumeHideTC != "") {
                $($(".expectInfo").find(".stonefont")[0]).html(resumeHideTC);
            }
            if (resumeActionTC != "") {
                $($(".telephone").find(".resume-action")[0]).html(resumeActionTC);
            }
            if (jobInformTC != "") {
                $(".jobInform").html(jobInformTC);
            }
            break;
        default:
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.UNKNOWERROR, "", 2);
            throw new Error('303');
    }
    if (curUrl.indexOf('ResumeViewFolder') >= 0)
        htmlContent = htmlContent.replace($('#divChart').html(), '');
    var re = new RegExp('·', "g");
    htmlContent = htmlContent.replace(re, '.');

    var func0 = function (data) {
        logHelper.Log("Update Resume Succeed");
        if (funTemp !== undefined)
            funTemp(data);
        else
            MessageBoxInfoShow(MSG.RESULT4_TITLE, '<a target="_blank" href="' + commonUrl + '/Resume/ResumeDetailInfo?ID=' + data.ResumeId + '">' + MSG.LINK + '</a>', "", 3);
    };

    var func1 = function () {
        logHelper.Log("Update Resume Failed");
        if (funcTemp2 !== undefined)
            funcTemp2();
        else {
            logHelper.Log("Update Resume Failed");
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.UPLOADRESUMEBYUSER, "", 2);
        }
    };

    var structuredResume = _HANDLER.uploadResume();
    structuredResume.importType = type;
    structuredResume.src = [siteHelper.CurPageInfo().Code];
    structuredResume.htmlContent = htmlContent;
    structuredResume.noHtmlContent = noHtmlContent;
    structuredResume.repeatId = repeatId;

    var _ops = {
        structuredResumeDetail: structuredResume
    };

    $.ajaxPost('StructuredImport', _ops, func0, func1);
}

/*
关联简历
*/
ExtensionState.prototype.relativeResume= function(resumeName, repeatId) {
    logHelper.Log("Relative Resume");
    var siteName = siteHelper.CurPageInfo().Name;
    var htmlShowId = "";
    switch (siteName) {
        case 'zl':
            htmlShowId = $("#resume_id").val();//智联隐藏域ID
            break;
        case 'wy':
            var identity = $("#hidUserID").val();
            htmlShowId = identity;
            break;
        case 'lp':
            htmlShowId = $('.more span').eq(0).text().split('|')[0].trim().split('：')[1];
            break;
        case 'zh':
            htmlShowId = $('.resume_info_up').text().split('：')[1];
            break;
        case 'ec':
            htmlShowId = (document.location.href.split('=')[1]).split('&')[0];
            break;
        default:
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.UNKNOWERROR, "", 2);
            throw new Error('303');
    }

    var func0 = function () {
        logHelper.Log("Relative Resume Succeed");
        MessageBoxInfoShow(MSG.RESULT5_TITLE, '<a onclick="javascript: window.location.reload();" style="cursor:pointer">' + MSG.LINK_BACK + '</a>', "", 3);
    };

    var func1 = function () {
        logHelper.Log("Relative Resume Failed");
        MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.RELATIVE_ERROR, "", 2);
    };

    var _ops = {
        resumeId: repeatId,
        originalResumeId: htmlShowId
    };

    $.ajaxPost('Relative', _ops, func0, func1);
}

/*
*对错选择 1-对 0-错
*/
ExtensionState.prototype.judgeRelationResume=function(repeatId, valueFlag, type) {
    logHelper.Log("Judge RelationResume");
    var func0 = function (data) {
        logHelper.Log("Judge Resume Succeed");
        if ($("#metroBox_Table").length != 0) {
            $('#JudgeRelationPanel').remove();
            $('#metroBox_Table').show().removeClass('fadeOutLeft fadeOutRight').addClass('fadeInLeft');
        } else {
            $('#workImg').parent().remove();
            $('#TableContent').show();
        }
        if (data.Result == "Exist") {
            alert(MSG.JUDGERELATION_EXIST);
        } else {
            var rightShow = data.Result.split('|')[0];
            var wrongShow = data.Result.split('|')[1];
            if (parseInt(data.Result.split('|')[0]) >= 99) {
                rightShow = "99+";
            }
            if (parseInt(data.Result.split('|')[1]) >= 99) {
                wrongShow = "99+";
            }
            $("#right_" + repeatId).html("(" + rightShow + ")");
            $("#wrong_" + repeatId).html("(" + wrongShow + ")");
        }
    };

    var func1 = function () {
        logHelper.Log("Judge Resume Failed");

        if ($("#metroBox_Table").length != 0) {
            $('#JudgeRelationPanel').remove();
            $('#metroBox_Table').show().removeClass('fadeOutLeft fadeOutRight').addClass('fadeInLeft');
        } else {
            $('#workImg').parent().remove();
            $('#TableContent').show();
        }
        alert(MSG.DO_ERROR);
    };

    var _ops = {
        mappingId: repeatId,
        value: valueFlag
    };

    $.ajaxPost('JudgeRelation', _ops, func0, func1);
}

/*
*关联搜索无效后进行的模糊搜索
*/
ExtensionState.prototype.searchAgainForNoRelation=function() {
    logHelper.Log('current state : InitStateAgain');
    MessageBoxInfoShow(MSG.SEARCH_CONTENT, "", "", 0);
    var hasContactInfo;
    try {
        hasContactInfo = _HANDLER.hasContactInfo();
    }
    catch (err) {
        MessageBoxInfoShow(MSG.COLLECTDATAERROR, "", "", 1);
        throw new Error(err.message);
    }

    //因为目前调用统一的接口，但是前端这里还是记录下是精确查重还是模糊查重方便纠错
    if (!hasContactInfo) {
        //模糊查重
        _SEARCHTYPE = 2;
        searchFuncHandle.hubbleSearch(false);
    }
    else {
        //精确查重
        _SEARCHTYPE = 1;
        searchFuncHandle.exactSearch(false);
    }
}

/*
*查重结果错误反馈
*/
ExtensionState.prototype.resultErrorReport = function (func0, func1) {
    var _ops = {
        resumeId: _RESUMEID
    };
    $("#errorReport").hide();
    $.ajaxEncodePost('ResultError', _ops, func0, func1);
}

/*
*判断是否是关联例外
*/
ExtensionState.prototype.judgeNoConnectionFun= function (){
    var flagFJNCF = true;
    for (var i = 0; i < noConnectionSiteCode.length; i++) {
        if (siteHelper.CurPageInfo().Code == noConnectionSiteCode[i]) {
            flagFJNCF = false;
        }
    }
    return flagFJNCF;
}

searchFuncHandle = new ExtensionState();







