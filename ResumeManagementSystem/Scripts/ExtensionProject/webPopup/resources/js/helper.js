var curUrl = document.location.href;
var method2url = {
    Hubble: resendConnection + 'Resume/HubbleSearchers',
    Import: resendConnection + 'Resume/ImportResume', //5.0.0版本结构化入库后舍弃
    Update: resendConnection + 'Resume/UpdateResume',
    Exist: resendConnection + 'Resume/ExactSearch',
    Search: resendConnection + 'ExactSearch',
    Relative: resendConnection + 'Resume/AddResumeIdConnection',
    JudgeRelation: resendConnection + 'Resume/UserSetResumeStatus',
    RelationResume: resendConnection + 'Resume/SearchRelationResumeById',
    StructuredImport: resendConnection + 'Resume/StructuredImportResume',
    ResultError: resendConnection + 'Resume/ResultError'
};

/*LogHelper*/
var LogHelper = function () { };

LogHelper.prototype.Info = function(info){
    console.info(info);
};

LogHelper.prototype.Log = function (info) {
    var myDate = new Date();
    console.log(myDate.toLocaleDateString() + " " + myDate.toLocaleTimeString() + ' : ' + info);
};

/*SiteHelper*/
var SiteHelper = function () { };

/*判断页面url地址是否在集合中*/
function isMatchPages(worksite) {
    try {
        var host = document.location.href;
        var hostArray = host.split('.');
        if (hostArray.length < 3) {
            return false;
        }
        var matchHost = "*." + hostArray[1] + "." + hostArray[2] + "/*";
        //如果第二个存在“/”，那么做判断
        if (hostArray[2].indexOf("/") >= 0) {
            var tempHostArray = hostArray[2].split('/');
            matchHost = "*." + hostArray[1] + "." + tempHostArray[0] + "/*";
        }
        if (matchHost == worksite) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log("The url of the current page is not valid:" + e.message);
        return false;
    }
};

SiteHelper.prototype.IsWorksite = function () {
    var isWorksite = false;
    for (var x in worksites) {
        if (isMatchPages(worksites[x])) {
            isWorksite = true;
            break;
        }
    }
    if(isWorksite)
        logHelper.Log('is worksite');
    else
        logHelper.Log('is not worksite');
    return isWorksite;
};

SiteHelper.prototype.CurPageInfo = function () {
    for (var x in resumePages) {
        if (curUrl.indexOf(resumePages[x].URL) >= 0) {
            return { "Name": resumePages[x].Name, "Code": resumePages[x].Code, "PageType": "resume" };
        }
    }
    throw new Error('107-Current page is the wrong page');
};

/*BrowserHelper*/
var BrowserHelper = function () { };

BrowserHelper.prototype.BrowserName = function () {
    return browserNameConfig;
};

BrowserHelper.prototype.IsSupported = function () {
    var isSupported = false;
    var browserName = browserNameConfig;
    switch (browserName) {
        case "chrome": 
        	isSupported = true;
            break;
        case "firefox": 
        	isSupported = true;
            break;
        case "msie": 
        	isSupported = true;
            break;
        default:
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, MSG.UNSUPPORTBROSWER, "", 2);
            throw new Error('303-NotSuppotBrowser');
    }
    return isSupported;
};
 
/*ClassHelper*/
var ThemeHelper = function () { };

ThemeHelper.prototype.LoadTheme = function(themeName){
    _msgHelper = new MsgBox();
};

/*ResultHelper*/
var ResultHelper = function() { };

ResultHelper.prototype.Process = function (response, func0, func1) {
    var result = new Object();
    //未通过单点登录
    if (response.toString().indexOf('Central Authentication Service') >= 0)
        result.Flag = 1;
    else {
        if (typeof (response) == 'object')
            result = response;
        else
            result = $.parseJSON(response);
    }
    var resultTemp;
    switch (result.Flag) {
        case 0:
            if (typeof (result.Result) == 'object')
                resultTemp = result.Result;
            else
                resultTemp = $.parseJSON(result.Result);
            if (func0 !== null)
                func0(resultTemp);
            break;
        case 1:
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, result.Info, "", 2);
            break;
        case 2:
            if (func1 !== null)
                func1();
            break;
        case 4:
            MessageBoxInfoShow(MSG.SYSTEM_TITLE, result.Info, '  <a target="blank" style="font-size:16px;" href="http://rms.pactera.com/help/Plugin.html">帮助</a>', 2);
            break;
        case 5:
            logHelper.Log("Data From Server Cache");
            if (typeof (result.Result) == 'object')
                resultTemp = result.Result;
            else
                resultTemp = $.parseJSON(result.Result);
            if (func0 !== null)
                func0(resultTemp);
            break;
    }
};
 
/*CodeHelper*/ 
var CodeHelper = function() { };

CodeHelper.prototype.Decode = function(s){
    return unescape(s.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'));
};

var logHelper = new LogHelper();
var siteHelper = new SiteHelper();
var browserHelper = new BrowserHelper();
var themeHelper = new ThemeHelper();
var resultHelper = new ResultHelper();
var codeHelper = new CodeHelper();

/*
提示语、错误提示等
0-普通提示
1-数据展示
2-错误
3-特殊提示
*/
function MessageBoxInfoShow(title, content, help, type) {
    switch (type) {
        case 0:
            _msgHelper.LoadBox({
                Title: title,
                Hidden: false,
                Type: 'Search'
            });
            break;
        case 1:
            _msgHelper.TableBox({
                Title: title,
                Data: content,
                HiddenIcon: 'Wait'
            });
            break;
        case 2:
            _msgHelper.ErrorBox({
                Title: title,
                Content: content,
                Help: help,
                Hidden: true
            });
            break;
        case 3:
            _msgHelper.MsgBox({
                Title: title,
                Content: content,
                Hidden: true,
                HiddenIcon: 'Work'
            });
            break;
        default:
    }

}

/*extend method*/
(function($){
    $.ajaxPost = function(method, params, func0, func1) {
        var _params = {
            siteCode: siteHelper.CurPageInfo().Code,
            //token:tokenHelper.GetToken(),
            token: tokenGlobal,
            employeeNo: employeeNo,
            p_version: appVersion,
            p_descript: appDescription,
            p_browser: browserNameConfig,
            p_info: ''
        };
        var ops = $.extend(_params, params);
        logHelper.Log('start post : ' + method);
        logHelper.Log('post Url   : ' + method2url[method]);
        $.ajax({
            type: "POST",
            url: method2url[method],
            data: ops,
            success: function (response) {
                logHelper.Log('response succeed ');
                console.log(response);
                var responseData = $.parseJSON(response);
                if (responseData.result == 1) {
                    resultHelper.Process(responseData.resultContent, func0, func1);
                } else {
                    _msgHelper.ErrorBox({
                        Content: "token异常，请退出小智后重新登录！"
                    });
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                var httpCode = xmlHttpRequest.status;
                try {
                    if (httpCode == 404 || httpCode == '404' || httpCode == 0 || httpCode == '0')
                        throw new Error('104-' + httpCode);
                    else if (httpCode == 500 || httpCode == '500')
                        throw new Error('105-' + httpCode);
                    else
                        throw new Error('106-' + httpCode);
                } catch (err) {
                    logHelper.Log(err.message);
                    var errorCode = err.message.split('-');
                    switch (errorCode[0]) {
                        case '104': _msgHelper.ErrorBox({
                            Content: ERROR_MSG.E104
                        }); break;
                        case '105': _msgHelper.ErrorBox({
                            Content: ERROR_MSG.E105
                        }); break;
                        case '106': _msgHelper.ErrorBox({
                            Content: ERROR_MSG.E106
                        }); break;
                        default: _msgHelper.ErrorBox({
                            Content: err.message,
                            Help: '  <a target="blank" style="font-size:16px;" href="http://rms.pactera.com/help/Plugin.html">帮助</a>'
                        });
                    }
                }
            }
        });
    };
    
    $.ajaxEncodePost = function(method, params, func0, func1){
        var _params = {
            siteCode: siteHelper.CurPageInfo().Code,
            //token:tokenHelper.GetToken(),
            token: tokenGlobal,
            employeeNo: employeeNo,
            p_version: appVersion,
            p_descript: appDescription,
            p_browser: browserNameConfig,
            p_info: ''
        };
        
        var ops = $.extend(_params, params);
        logHelper.Log('start post : ' + method);
        logHelper.Log('post Url   : ' + method2url[method]);
        $.ajax({
            type: "POST",
            url: method2url[method],
            data: ops,
            success: function (response) {
                logHelper.Log('response succeed ');
                var responseData = $.parseJSON(response);
                if (responseData.result == 1) {
                    resultHelper.Process(responseData.resultContent, func0, func1);
                } else {
                    _msgHelper.ErrorBox({
                        Content: "token异常，请退出小智后重新登录！"
                    });
                }
            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                var httpCode = xmlHttpRequest.status;
                try {
                    if (httpCode == 404 || httpCode == '404' || httpCode == 0 || httpCode == '0')
                        throw new Error('104-' + httpCode);
                    else if (httpCode == 500 || httpCode == '500')
                        throw new Error('105-' + httpCode);
                    else
                        throw new Error('106-' + httpCode);
                } catch (err) {
                    logHelper.Log(err.message);
                    var errorCode = err.message.split('-');
                    switch (errorCode[0]) {
                        case '104': _msgHelper.ErrorBox({
                            Content: ERROR_MSG.E104
                        }); break;
                        case '105': _msgHelper.ErrorBox({
                            Content: ERROR_MSG.E105
                        }); break;
                        case '106': _msgHelper.ErrorBox({
                            Content: ERROR_MSG.E106
                        }); break;
                        default: _msgHelper.ErrorBox({
                            Content: err.message,
                            Help: '  <a target="blank" style="font-size:16px;" href="http://rms.pactera.com/help/Plugin.html">帮助</a>'
                        });
                    }
                }
            }
        });
    };
    
    function parseParam(param, key){
    	var paramStr="";
	     if(param instanceof String||param instanceof Number||param instanceof Boolean){
	         paramStr+="&"+key+"=" + BASE64.encoder(param).replace(/=/g,"[");
	     }else{
	         $.each(param,function(i){
	             var k=key==null?i:key+(param instanceof Array?"["+i+"]":"."+i);
	             paramStr+='&'+parseParam(this, k);
	         });
	     }
	     return paramStr.substr(1); 
    };

    function parseParamWithoutBase64(param, key) {
        var paramStr = "";
        if (param instanceof String || param instanceof Number || param instanceof Boolean) {
            paramStr += "&" + key + "=" + param;
        } else {
            $.each(param, function (i) {
                var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
                paramStr += '&' + parseParamWithoutBase64(this, k);
            });
        }
        return paramStr.substr(1);
    };
})(jQuery);



