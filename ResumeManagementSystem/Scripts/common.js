function escape (str) {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//扩展ajax方法
$.extend({
    //仿C#的String.Format方法
    format: function (source, params) {
        /// <summary>
        ///     将指定字符串中的一个或多个格式项替换为指定对象的字符串表示形式。
        /// </summary>
        /// <param name="source" type="String">
        ///     复合格式字符串
        /// </param>
        /// <param name="params" type="String">
        ///     要设置格式的对象
        /// </param>
        /// <returns type="String">format 的副本，其中的任何格式项均替换为 arg0 的字符串表示形式。</returns>
        if (arguments.length == 1)
            return function () {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args);
            };
        if (arguments.length > 2 && params.constructor != Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor != Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    },
    //改写$.get方法，对Url添加时间戳，确保每次请求，数据都是最新的
    //添加没有权限的处理
    get: function (url, data, callback, type) {
        // shift arguments if data argument was omited
        if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = null;
        }
        if (url.indexOf("?") > 0) {
            url += "&Timestamp=" + this.getTime();
        } else {
            url += "?Timestamp=" + this.getTime();
        }
        return jQuery.ajax({
            type: "GET",
            url: url,
            data: data,
            success: function (rdata) {

                if (rdata != null && rdata.permissionError && rdata.permissionError == 1) {
                    $.dialog({
                        title: rdata.title,
                        content: rdata.errorMsg,
                        okVal: rdata.btnValue,
                        ok: function () {
                            if (rdata.result == 403) {
                                //拒绝访问，没有权限

                            } else {
                                //需要登录
                                window.location = rdata.loginUrl + "?backUrl=" + encodeURIComponent(window.location.href);
                            }

                        },
                        cancel: false,
                        lock: true,
                        min: false,
                        max: false
                    });
                } else {
                    try {
                        callback(rdata);
                    } catch (e) {

                    }

                }
            },
            dataType: type
        });
    },
    //改写$.post方法，添加没有权限的处理
    post: function (url, data, callback, type) {
        // shift arguments if data argument was omited
        if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = {};
        }

        return jQuery.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function (rdata) {
                if (rdata != null && rdata.permissionError && rdata.permissionError == 1) {
                    $.dialog({
                        title: rdata.title,
                        content: rdata.errorMsg,
                        okVal: rdata.btnValue,
                        ok: function () {
                            if (rdata.result == 403) {
                                //拒绝访问，没有权限
                            } else {
                                //需要登录
                                window.location = rdata.loginUrl + "?backUrl=" + encodeURIComponent(window.location.href);
                            }
                        },
                        cancel: false,
                        lock: true,
                        min: false,
                        max: false
                    });
                } else {
                    try {
                        callback(rdata);
                    } catch (e) {

                    }
                }
            },
            dataType: type
        });
    },

    //返回时间的数值表示形式
    getTime: function () {
        ///<summary>
        ///获取时间戳
        ///</summary>
        return (new Date()).valueOf();
    }
});

var dialogCallback;
function showDialog(content, title, time, callback) {
    ///<summary>
    ///显示消息提示
    ///</summary>
    ///<param name="content">要显示的消息内容</param>
    ///<param name="title">提示框标题</param>
    ///<param name="time">消息框显示的时间（超时时自动关闭)</param>
    ///<param name="callback">关闭时调用的函数</param>
    if (!$.dialog) {
        return;
    }
    if ($.isFunction(title)) {
        callback = title;
        title = null;
    }
    var islock = true;
    if (typeof (title) == "boolean") {
        islock = title;
        title = "提示";
    }
    if (!title) {
        title = "提示";
    }
    if (!time) {
        time = 3;
    }

    dialogCallback = callback;
    var jq = window.top.jQuery;
    jq.dialog({
        title: title,
        content: content,
        time: time,
        max: false,
        min: false,
        lock: islock,
        close: function () {
            setTimeout("callDialogCallback()", 200);
        }
        //,close: callback
    });
}
function callDialogCallback() {
    if ($.isFunction(dialogCallback)) {
        dialogCallback.call(window);
        dialogCallback = null;
    }
}