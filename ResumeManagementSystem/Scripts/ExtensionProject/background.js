/*
作用：扩展后台静默运行js
*/
var oldTab;//用于存储之前的页面信息
var currentTab;//用于存储当前页面信息
var currentTheme;//用于存储当前的样式模板信息
var nVersion;
var employeeNo;
var tokenNo;
var isRun = false;
var employee = {
    employeeNo: "",
    token: ""
};
var themeUserSet = {
    theme: ""
};

var apiHandle = new BroswerApiHandle().CreateHandle();

AutoLogin();

function AutoLogin() {
    var autoLoginCallBackFun = function(item) {
        if (item.employee.employeeNo == "" || item.employee.employeeNo == undefined ||
                item.employee.token == "" || item.employee.token == undefined) {
            apiHandle.alertMessage("请登录小智，否则将无法使用小智插件", 60000);
        } else {
            employee = {
                employeeNo: item.employee.employeeNo,
                token: item.employee.token
            };
            $("#loginUserCode").html(item.employee.employeeNo + "已登录");
            apiHandle.storageLocalSetUserConfig(employee, themeUserSet);
        }
    };
    apiHandle.storageLocalGet("employee", autoLoginCallBackFun);
}

/*
回调方法，获得编号
*/
function StorageChange(changes, area) {
    apiHandle.storageLocalGet("employee", gotEmployeeItem);
}

/*
调用url监控方法
*/
function gotEmployeeItem(item) {
    if (!isRun) {
        if (item.employee.employeeNo == "" || item.employee.employeeNo == undefined) {
        } else {
            isRun = true;
            LoadFunction(item.employee.employeeNo, item.employee.token);
        }
    } else {
        //退出登录
        isRun = false;
        employeeNo = "";
        employee = {
            employeeNo: "",
            token: ""
        };
        apiHandle.removeListener(TabUpdate, 1);
        console.log("退出登录");
    }
}

/*
监控是否登录，如果登录开始监控url
*/
apiHandle.storageChangeListener(StorageChange);

/*
实时监控页面url地址的变化，一旦变化，执行主程序
*/
function LoadFunction(userCode, tokenCode) {
    employeeNo = userCode;
    tokenNo = tokenCode;
    if (employeeNo == "" || employeeNo == undefined || tokenNo == "" || tokenNo == undefined) {
        apiHandle.alertMessage("对不起，小智运行错误！请联系管理人员！", 60000, "小智错误提示");
        return;
    }

    //定时程序，版本判断
    if (!isTestingVersion) {
        var versionCheck = setInterval(function () {
            var browserName = browserNameConfig;
            $.ajax({
                type: "POST",
                url: resendConnection + 'Version/CheckVersion',
                data: { p_descript: appDescription, p_browser: browserName },
                success: function(data) {
                    var version = $.parseJSON($.parseJSON(data).resultContent);
                    if (version.Flag == 1) {
                        store.set('nVersion', version.Info);
                        apiHandle.setShowIcon(apiHandle.getPath("../webPopup/resources/images/logo322.png"));
                    } else if (version.Flag == 4) {
                        apiHandle.setShowIcon(apiHandle.getPath("../webPopup/resources/images/logo32.png"));
                    } else {
                        store.set('nVersion', version.Info);
                        apiHandle.setShowIcon(apiHandle.getPath("../webPopup/resources/images/logo32.png"));
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
        }, 600000);
    }

    //定时程序，每秒对页面url进行判断，一旦发生改变，立刻进行url判断
    apiHandle.addListener(TabUpdate, 1);
    
}

/*
定时程序，每秒对页面url进行判断，一旦发生改变，立刻进行url判断
*/
function TabUpdate(tabId, changeInfo, tabInfo) {
    if (changeInfo.status == "complete" && tabInfo.status == "complete") {
        if (CheckUrlValid(tabInfo.url))
        {
            ReadyFunction();
        }
    }
}

/*
检查url是否合法，防止空页面造成的扩展错误
*/
function CheckUrlValid(url) {
    var expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp = new RegExp(expression);
    if (objExp.test(url)) {
        return true;
    } else {
        return false;
    }
}

/*
获取当前页面的简历信息主方法
流程：1、常规性检查，判断是否支持本地存储等
      2、依次加载js和css
      3、url地址判断招聘网站
      4、抓取页面信息进行分析
*/
function ReadyFunction() {

    //检查是否支持本地存储
    if (!store.enabled) {
        console.log('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
        apiHandle.alertMessage("您的浏览器不支持小智插件，请使用火狐浏览器！", 60000, "小智错误提示");
        return;
    }

    //判断是否是手动加载
    var curLoadStyle = store.get("loadStyle");
    if (curLoadStyle == "handLoad") {
        LoadByUser();
        return;
    }

    //加载JS
    try {
        ReadyLoadFunction();
    } catch (e) {
        console.log(e.message);
        apiHandle.alertMessage("对不起，小智运行错误！请联系管理人员！", 60000, "小智错误提示");
    } 
}

/*
加载JS方法
*/
function ReadyLoadFunction() {
    MainJsLoad();
}

/*
加载主程序所需要的JS文件
*/
function MainJsLoad() {
    console.log("load js start");
    //样式判断
    currentTheme = store.get('ThemeName');
    if (currentTheme == undefined || currentTheme == '' || currentTheme == 'default') {
        currentTheme = 'metro';
    }
    loadJSArrary[11] = "/webPopup/resources/css/" + currentTheme + ".css";
    loadJSArrary[12] = "/webPopup/resources/js/Theme/" + currentTheme + ".js";
    var returnFunc = function() {
        apiHandle.extensionsWork(employeeNo, tokenNo);
    };
    apiHandle.loadJS(loadJSArrary, returnFunc);
}

/*
手动加载小智JS
*/
function LoadExtensionOnBG() {
    MainJsLoad();
}

/*
手动加载js时，向前台页面注入js，以显示点击加载按钮等
*/
function LoadByUser() {

    //检查是否支持本地存储
    if (!store.enabled) {
        console.log('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
        apiHandle.alertMessage("您的浏览器不支持小智插件，请使用火狐浏览器！", 60000, "小智错误提示");
        return;
    }

    //样式判断
    currentTheme = store.get('ThemeName');
    if (currentTheme == undefined || currentTheme == '' || currentTheme == 'default') {
        currentTheme = 'metro';
    }

    //加载js和样式文件
    loadJSByUserArrary[1] = "/webPopup/resources/css/" + currentTheme + ".css";
    apiHandle.loadJS(loadJSByUserArrary, undefined);
}

//手动加载小智时，监听页面向background发送的信息
function handleUserLoadExtensionMessage(request, sender, sendResponse) {
    LoadExtensionOnBG();
}
apiHandle.addListener(handleUserLoadExtensionMessage, 2);



