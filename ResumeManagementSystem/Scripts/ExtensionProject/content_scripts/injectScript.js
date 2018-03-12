/*
*弹出框原生代码
*/
var Prompt = {
    $: function (id) { return document.getElementById(id); },
    add: function () { //生成div和遮罩层
        this.createShade();
        this.createPrompt();
    },
    init: function (option) {
        var title = this.title = option.title || false,
            shade = this.shade = option.shade || false,  //是否显示遮罩
            opacity = this.opacity = option.opacity || 20, //遮罩透明度
            width = this.width = option.width || 500,
            height = this.height = option.height || 300,
            _temp = this._temp = option.html || "",
            ConfirmFun = this.ConfirmFun = option.ConfirmFun || false,
            CancelFun = this.CancelFun = option.CancelFun || false;
        this.editTitle();
        this.editHtml();
        if (ConfirmFun) {
            this.showBottom();
        } else {
            this.hideBottom();
        }
        this.show();
    },
    editTitle: function () {   //title div生成
        var prompt_title = this.$("prompt_title");
        if (this.title) {
            prompt_title.innerHTML = this.title;
            //添加拖拽方法
            this.drag();
            prompt_title.style.display = "block";
        } else {
            prompt_title.style.display = "none";
        }
    },
    editHtml: function () {
        var prompt_body = this.$("prompt_body");
        prompt_body.innerHTML = this._temp;
    },
    createPrompt: function () {    //创建弹出的div
        var doc = document,
            Div = doc.createElement("div");
        Div.id = "prompt";
        Div.innerHTML = "<span id='prompt_close'></span><div id='prompt_title'></div><div id='prompt_body'></div><div id='prompt_bottom'></div>";
        doc.body.appendChild(Div);

        var prompt_close = this.$("prompt_close");
        this.addHandler(prompt_close, "click", this.hide);
    },
    showBottom: function () {    //创建确定 取消按钮
        var that = this,
            prompt_bottom = that.$("prompt_bottom");

        if (that.CancelFun) {
            prompt_bottom.innerHTML = "<a class='btn' id='ConfirmFun'>确定</a><a class='btn' id='CancelFun'>取消</a>";
            that.addHandler(that.$("ConfirmFun"), "click", function () {
                that.hide();
                that.ConfirmFun();
            });

            that.addHandler(that.$("CancelFun"), "click", function () {
                that.hide();
                that.CancelFun();
            });
        } else {
            prompt_bottom.innerHTML = "<a class='btn' id='ConfirmFun'>确定</a>";
            that.addHandler(that.$("ConfirmFun"), "click", function () {
                that.hide();
                that.ConfirmFun();
            });
        }

        prompt_bottom.style.display = "block";
    },
    hideBottom: function () {
        this.$("prompt_bottom").innerHTML = "";
        this.$("prompt_bottom").style.display = "none";
    },
    show: function () {
        var promptDiv = Prompt.$("prompt"),
            shadeDiv = Prompt.$("shadeDiv"),
            bodyHeight = document.documentElement.clientHeight || document.body.clientHeight;
        promptDiv.style.display = "block";
        promptDiv.style.width = this.width + "px";
        promptDiv.style.height = this.height + "px";
        promptDiv.style.left = (this.bodyWidth / 2 - this.width / 2) + "px";
        promptDiv.style.top = (bodyHeight / 2 - this.height / 2) + "px";
        if (this.shade) {
            shadeDiv.style.display = "block";
            if (document.all) {
                shadeDiv.filters.alpha.opacity = this.opacity;
                shadeDiv.style.zoom = 1;
            } else {
                shadeDiv.style.opacity = this.opacity / 100;
            }
        }
        if (this.IE6()) promptDiv.appendChild(this.createIframe());    //ie6添加iframe
    },
    hide: function () {
        Prompt.$("prompt").style.display = "none";
        Prompt.$("shadeDiv").style.display = "none";
    },
    createShade: function () { //创建遮罩层
        var doc = document,
            bodyWidth = this.bodyWidth = doc.documentElement.clientWidth || doc.body.clientWidth,
            bodyHeight = this.bodyHeight = doc.documentElement.scrollHeight || doc.body.scrollHeight,
            Div = doc.createElement("div");
        Div.id = "shadeDiv";
        Div.style.height = bodyHeight + "px";
        Div.style.width = bodyWidth + "px";
        Div.style.opacity = 0.2;
        if (this.IE6()) Div.appendChild(this.createIframe("shadeDiv"));    //ie6添加iframe
        doc.body.appendChild(Div);
    },
    createIframe: function (div) {
        var width, height;
        if (div == "shadeDiv") {
            width = this.bodyWidth;
            height = this.bodyHeight;
        } else {
            width = this.width;
            height = this.height;
        }
        var Iframe = document.createElement('iframe');
        Iframe.style.position = 'absolute';
        Iframe.style.zIndex = '-1';
        Iframe.style.left = '-1px';
        Iframe.style.top = 0;
        Iframe.style.border = 0;
        Iframe.style.filter = 'alpha(opacity=0)';
        Iframe.style.width = width + 'px';
        Iframe.style.height = height + 'px';
        return Iframe;
    },
    isDown: false,
    drag: function () {    //添加拖拽事件
        var that = this,
            mouseX, mouseY, objY, objX,
            prompt_title = this.$("prompt_title"),
            prompt = this.$("prompt");

        that.addHandler(prompt_title, "mousedown", function (event) {
            var event = window.event || event;
            if (event.button == 0 || event.button == 1) {  //鼠标左键chrome=0 ie=1
                (!window.ActiveXObject) ? event.preventDefault() : event.returnValue = false; //取消默认行为
                mouseX = event.clientX;
                mouseY = event.clientY;
                objY = parseInt(prompt.style.top);
                objX = parseInt(prompt.style.left);
                that.isDown = true;
            }
        });

        that.addHandler(document, "mousemove", function (event) {
            if (that.isDown) {
                var event = window.event || event;
                // (!window.ActiveXObject) ? event.preventDefault() : event.returnValue = false; //取消默认行为
                prompt.style.top = event.clientY - mouseY + objY + "px";
                prompt.style.left = event.clientX - mouseX + objX + "px";
            }
        });

        that.addHandler(document, "mouseup", function () {
            that.isDown = false;
        });
    },
    getPosition: function (obj) { //获取元素在页面里的位置和宽高
        var top = 0,
            left = 0,
            width = obj.offsetWidth,
            height = obj.offsetHeight;

        while (obj.offsetParent) {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }

        return { "top": top, "left": left, "width": width, "height": height };
    },
    addHandler: function (node, type, handler) {
        node.addEventListener ? node.addEventListener(type, handler, false) : node.attachEvent('on' + type, handler);
    },
    IE6: function () {
        return !!window.ActiveXObject && !window.XMLHttpRequest;
    }

}

Prompt.add();

function ShowMsgBox(settings) {

    var css = '<style type="text/css">*{margin:0;padding: 0;}body{height: 2000px;}#txt {background-color: green;padding: 5px;line-height: 1.5;color: #fff;}div#shadeDiv{display:none;position: absolute;top: 0;left: 0; opacity: 1; filter: alpha(opacity=100);z-index: 9998;background-color: #000;}div#prompt{border-radius:5px; display:none;border: 1px solid #CCC; position:fixed;_position: absolute;z-index: 9999;background-color: #fff;}div#prompt_title{ cursor:move;border-radius:5px;font-size:14px;font-weight: bold;color: #333;padding-left:10px;height: 35px;line-height: 35px;border-bottom: 1px solid #ececec;background-color:#fcfcfc; }span#prompt_close{ position: absolute;right: 10px;top: 10px; cursor: pointer; background: url("bd_split_210d2d99.gif") no-repeat -281px -41px; width: 14px;height: 13px;outline: none;display: block;}div#prompt_body{padding: 30px 20px;font-size:13px;line-height: 1.5;}div#prompt_bottom{display:none;position: absolute;bottom: 15px;right: 15px;}div#prompt_bottom a.btn{_display:block;_float:left;border: 1px solid #888;border-radius:2px;font-size: 13px;padding: 5px 8px ;margin-left: 10px;cursor: pointer;color: #000000;color: #000000!important;background: #F3F3F3;background: -moz-linear-gradient(top,#ffffff 0%,#ebebeb 90%,#F3F3F3 100%);background: -webkit-linear-gradient(top,#ffffff 0%,#ebebeb 90%,#F3F3F3 100%);background: -o-linear-gradient(top,#ffffff 0%,#ebebeb 90%,#F3F3F3 100%);background: -ms-linear-gradient(top,#ffffff 0%,#ebebeb 90%,#F3F3F3 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#ffffff",endColorstr="#d7d7d7",GradientType=0 );background: linear-gradient(top,#ffffff 0%,#ebebeb 90%,#F3F3F3 100%);}div#prompt_bottom a.btn:hover{border: 1px solid blue;}</style>';

    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
    //console.log("start");
    switch(settings.type) {
        case 1:
            Prompt.init({
                title: settings.title,
                shade: true,
                opacity: 20,
                width: 300,
                height: 100,
                html: settings.content
            });
            break;
        default:
            break;
    }
    //console.log("end");
}

function MsgBoxListener(request, sender, sendResponse) {
    //console.log("MsgBoxListener");
    ShowMsgBox(request.configSettings);
    chrome.runtime.onMessage.removeListener(MsgBoxListener);
}

chrome.runtime.onMessage.addListener(MsgBoxListener);