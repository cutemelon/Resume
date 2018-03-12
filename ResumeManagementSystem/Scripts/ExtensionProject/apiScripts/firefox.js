/*
火狐api
*/
var FirefoxApiHandle = function () { };

/*
获得storage内的存储变量
*/
FirefoxApiHandle.prototype.storageLocalGet= function(paramName, func) {
    chrome.storage.local.get("employee", function(item) {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
        } else {
            func(item);
        }
    });
}

/*
存储用户信息
*/
FirefoxApiHandle.prototype.storageLocalSetUserConfig= function(employee, themeUserSet) {
    chrome.storage.local.set({ employee, themeUserSet }, onSet);
}

/*
获得文件的路径
*/
FirefoxApiHandle.prototype.getPath= function(path) {
    return chrome.extension.getURL(path);
}

/*
设置图标显示
*/
FirefoxApiHandle.prototype.setShowIcon=function(picPath) {
    chrome.browserAction.setIcon({ path: picPath });
}

/*
新建一个标签页
*/
FirefoxApiHandle.prototype.createNewTab= function(url) {
    chrome.tabs.create({
        url: url
    });
}

/*
获得background页面
*/
FirefoxApiHandle.prototype.getBackgroundFunc= function() {
    return browser.extension.getBackgroundPage();
}

/*
浏览器自带弹出框
*/
FirefoxApiHandle.prototype.alertMessage= function(message, eventTime, title, type, id) {
    if (message == undefined || message == "") {
        return;
    }
    if (id == undefined) {
        id = "noteMessage";
    }
    if (type == undefined) {
        type = "basic";
    }
    if (title == undefined) {
        title = "小智提醒您：";
    }
    if (eventTime == undefined) {
        eventTime = 5000;
    }
    chrome.notifications.create(id, {
        "type": type,
        "title": title,
        "message": message,
        "eventTime": eventTime
    });
}

/*
移除监控
type:
1-tabs.onUpdated
2-runtime.onMessage
*/
FirefoxApiHandle.prototype.removeListener= function(func, type) {
    switch (type) {
        case 1:
            chrome.tabs.onUpdated.removeListener(func);
            break;
        case 2:
            chrome.runtime.onMessage.removeListener(func);
            break;
        default:
            console.log("移除监控失败，未找到此类型的监控！");
    }
}

/*
添加监控
type:
1-tabs.onUpdated
2-runtime.onMessage
*/
FirefoxApiHandle.prototype.addListener= function(func, type) {
    switch (type) {
        case 1:
            chrome.tabs.onUpdated.addListener(func);
            break;
        case 2:
            chrome.runtime.onMessage.addListener(func);
            break;
        default:
            console.log("添加监控失败，未找到此类型的监控！");
    }
}

/*
监控storage变化
*/
FirefoxApiHandle.prototype.storageChangeListener= function(func) {
    chrome.storage.onChanged.addListener(func);
}

/*
同步加载js和css
urls：需要加载的js、css数组
func: 回调函数
*/
FirefoxApiHandle.prototype.loadJS= function(urls, func) {
    fireFoxLoadJS(0, urls,func);
}

/*
向extension.js发送信息以启动主程序
*/
FirefoxApiHandle.prototype.extensionsWork= function(employeeNo, tokenNo) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { defaultEmployeeNo: employeeNo, defaultToken: tokenNo });
    });
}

/*
手动加载时，向background.js发送信息以启动主程序
*/
FirefoxApiHandle.prototype.extensionsWorkByUser=function() {
    var sending = browser.runtime.sendMessage({
        work: "web needs extension to work."
    });
    sending.then(handleResponse, handleError);
}

/*
递归函数，同步加载js和css
*/
function fireFoxLoadJS(i, urls, func) {
    if (urls[i].indexOf(".css") >= 0) {
        chrome.tabs.insertCSS({ file: urls[i] }, function() {
            if (i < urls.length - 1) {
                fireFoxLoadJS(i + 1, urls, func);
            } else {
                if (func != undefined) {
                    func();
                }
            }
        });
    } else {
        chrome.tabs.executeScript({ file: urls[i], allFrames: true }, function() {
            if (i < urls.length - 1) {
                fireFoxLoadJS(i + 1, urls, func);
            } else {
                if (func != undefined) {
                    func();
                }
            }
        });
    }
}

/*
api执行成功后系统的回调函数
*/
function onSet() {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
    } else {
        //console.log("OK");
    }
}

/*
api执行成功后系统的回调函数
*/
function handleResponse() {
    console.log('Message responsed.');
}

/*
api执行错误后系统的回调函数
*/
function handleError(error) {
    console.log("The api of runtime is error.");
}