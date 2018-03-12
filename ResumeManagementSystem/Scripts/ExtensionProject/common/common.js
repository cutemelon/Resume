/*
*此文件夹下面是js公共方法或者扩展，修改需谨慎
*/


/*
*动态加载js文件和css文件（异步处理）
*注意：使用以下方法可能出现JS或者CSS未加载完成就执行之后的方法的情况
*/
var dynamicLoading = {
    css: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
}

/*
*动态加载js文件（伪同步处理）
*注意：使用以下方法一定要加载完js才会执行稍后的方法
*/
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
        // IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        // FF, Chrome, Opera, ...
        script.onload = function () {
            if (callback != undefined) {
                callback();
            }
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

/*
*真正的同步加载。前提是未开启debug模式，如果开启了debug模式，那么，就是异步加载。
*如果同步加载，相当于一个ajax请求，在浏览器调试模式下不会加载js，不便于调试，如果需要调试，请使用异步加载，这样可以调试js
*/
function loadScriptWaiting(url) {
    if (isDebug) {
        dynamicLoading.js("../" + url);
    } else {
        //loadScript("../" + url);
        $.ajax({
            url: getPath(url),
            async: false,
            dataType: 'script'
        });
    }
}

/*
*提示模块，利用自带提示框进行提示
*参考：https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/notifications/NotificationOptions
*/
function alertMessage(message, eventTime, title, type, id) {
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
*错误提示模块，利用自带提示框进行提示
*/
//function Error(msg) {
//    alertMessage(msg);
//}

/*
*获得文件的路径
*/
function getPath(path) {
    return chrome.extension.getURL(path);
}

/*
*弹出框方法
*1-普通弹出提示（只能传入标题和内容）
*/
function messageBox(settings) {
    chrome.tabs.executeScript({ file: "/content_scripts/injectScript.js", allFrames: true }, function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { configSettings: settings });
        });
    });
}

/*
*错误提示
*/
function errorBox(content) {
    var settings = {
        title: "错误",
        content: content,
        type: 1
    };
    messageBox(settings);
}

