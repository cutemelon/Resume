/*
*作用：判断浏览器类型以实例化api
*/

var BroswerApiHandle = function () { };

BroswerApiHandle.prototype.CreateHandle=function() {
    if (navigator.userAgent.toLowerCase().indexOf("firefox") >= 0) {
        return new FirefoxApiHandle();
    } else {
        return "";
    }
}