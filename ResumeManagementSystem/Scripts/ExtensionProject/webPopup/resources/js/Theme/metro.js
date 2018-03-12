var curPage = 1;
var allPage = 1;
var importFlag = false;
var icons = new Array("dormancy", "wait", "work", "hidden", "broken");
var allData;

var MsgBox = function () {
    IMsgBox.apply(this);
};   

initEffect();

MsgBox.prototype = new IMsgBox();

MsgBox.prototype.MsgBox = function(settings){
	var params = {
        Id: "metroBox",
        Height: 250,
        Width: 200,
        Align: "center",
        Title: MSG.SYSTEM_TITLE,
        Content: "",
        CallBack: null,
        Hidden: true,
        HiddenIcon: null,
        Clear: true
    };
    var ops = $.extend(params, settings);
    var divId = ops.Id;
    var msgBoxDiv = '<div id="{0}" class="metroBox"><div class="metroBox_Title"><div class="metroBox_Title_Hidden"></div><span id="spanShowId">{1}</span></div><div class="metroBox_Content">{2}</div></div>';
    msgBoxDiv = String.format(msgBoxDiv, divId, ops.Title, ops.Content);
    var _this = $(msgBoxDiv);
    if (ops.Clear) {
        clearPanel();
    }
    _this.appendTo('body');
    _this.addClass('animated fadeInRight').css('bottom', 10);
    _this.find('.metroBox_Title_Hidden').bind('click', function () {
        _this.toggleClass('fadeInRight').toggleClass('fadeOutRight');
        if (ops.HiddenIcon !== null)
            showIcon(ops.HiddenIcon, _this);
    });
    if (ops.CallBack !== null) {
        ops.CallBack();
    }  
};

MsgBox.prototype.LoadBox = function(settings){
	var params = {
        Id: "metroBox",
        Height: 250,
        Width: 200,
        Align: "center",
        Title: "",
        CallBack: null,
        HiddenIcon: null,
        Hidden: false,
        Src: line_loadingPic
    };

    var ops = $.extend(params, settings);

    var loadBoxContent = '<img src="{0}" />';
    loadBoxContent = String.format(loadBoxContent, ops.Src);
    this.MsgBox({
        Content: loadBoxContent,
        Title: ops.Title,
        Hidden: ops.Hidden,
        Callback: ops.CallBack,
        HiddenIcon: ops.HiddenIcon
    });
};

MsgBox.prototype.ErrorBox = function (settings) {
	var params = {
        Id: "metroBox_Error",
        Height: 250,
        Width: 200,
        Align: "center",
        Title: MSG.ERROR_TITLE,
        Content: "",
        Help: "",
        CallBack: null,
        HiddenIcon: "Broken",
        Hidden: false,
        Update: false
    };

    var ops = $.extend(params, settings);

    ops.Content += ops.Help;
    
    this.MsgBox({
        Id: ops.Id,
        Title: ops.Title,
        Content: ops.Content,
        HiddenIcon: ops.HiddenIcon,
        Hidden : ops.Hidden
    });
};

MsgBox.prototype.TableBox = function (settings) {
	var params = {
        Id: "metroBox_Table",
        Height: 250,
        Width: 200,
        Align: "center",
        Title: "",
        Content: "",
        CallBack: null,
        HiddenIcon: "Work",
        Hidden: false,
        Update: false,
        Data: []
    };

	var ops = $.extend(params, settings);
    //标题后按钮显示
	var titleShow = "";
    //查重错误反馈显示
	var contentMetro = '<div id="errorReport" class="metroReplay animated fadeInRight" style="bottom: -2px;border-top-left-radius: 10px;" title="如果您重复下载了此份简历，请及时反馈给我们">重复下载反馈</div>';
    //查重结果显示
	var buildContentMetro = buildContent(ops.Data, ops.Update);
    if (_SEARCHTYPE == 2) {
        contentMetro = "";
    }
    if (ops.Title == MSG.RESULT_TITLE) {
        titleShow = "";
    } else if (ops.Title == MSG.RESULT_TITLE2) {
        titleShow = '<span id="searchAgain" class="default_button searchAgain" title="' + MSG.SEARCHAGAINTITLE + '">' + MSG.SEARCHAGAIN + '</span>';
    } else {
        titleShow = '<span id="importNewId" class="default_button importNew" title="' + MSG.UPLOADRESUMETITLE + '">' + MSG.UPLOADRESUNE + '</span>';
    }
    if (buildContentMetro == MSG.RESULT_CONTENT) {
        buildContentMetro = '<div style="height:120px;">' + buildContentMetro + '</div>';
    }
    this.MsgBox({
        Id: ops.Id,
        Title: '<span class="metroTitle">' + ops.Title + '</span>' + titleShow,
        Content: contentMetro + buildContentMetro,
        CallBack: function() {
            initNav();
            $("#btnPre").bind('click', prePage);
            $("#btnNext").bind('click', nextPage);
        },
        HiddenIcon: ops.HiddenIcon
    });
    resize();
};

MsgBox.prototype.InitIcon = function (iconName) {
    showIcon(iconName, null);
};

MsgBox.prototype.ChangeTitle = function (title) {
    $('.metroBox_Title span').html(title);
};

MsgBox.prototype.MsgBoxLeft = function(content){
    var divLeft = $('<div class="animated fadeOutLeft metro_Left"> <div class="metro_Left_Content">' + content +'</div></div>');
    divLeft.appendTo('body').removeClass('fadeOutLeft').addClass('fadeInLeft');
};

function resize() {
	var needResize = $(".metroBox_Table") !== null;
    if (needResize) {
        var realHeight = $("#page1").height();
        $(".metroBox_Table").height(realHeight + 21);
    }
}

function buildContent(jsonData, canUpdate) {
	if (jsonData === '[]' || jsonData === null || jsonData.length <= 0)
	    return MSG.RESULT_CONTENT;

	allRollCount = jsonData.length;
    //根据匹配度由高到低排序
	for (var j = 0; j < jsonData.length; j++) {
	    for (var k = 0; k < jsonData.length; k++) {
	        var tempp;
	        if (jsonData[j]["Score"] > jsonData[k]["Score"]) {
	            tempp = jsonData[j];
	            jsonData[j] = jsonData[k];
	            jsonData[k] = tempp;
	        }
	    }
	}
    allData = jsonData;
    var result = '<div class="metroBox_Table" id="metroBox_TableShow">';
    //向上和向下箭头
    if (allRollCount > 3) {
        result += "<div class=\"metroBox_Icon_Up\" style=\"display:none\"></div><div class=\"metroBox_Icon_Down\"></div>";
    }
    result += buildPageContent(jsonData, true);
    return result + '</div>';

}

function buildPageContent(jsonData, isFirstLoad) {
    var div;
    var tempNum = 3;
    div = $('<div id="page1" class="metroBox_Page animated" style="position:absolute"></div>');

    if ($("#metroBox_TableShow").html() != undefined) {
        $("#metroBox_TableShow").html("<div class=\"metroBox_Icon_Up\"></div><div class=\"metroBox_Icon_Down\"></div>");
    }
    if (allRollCount <= 3) {
        tempNum = allRollCount;
        $(".metroBox_Icon_Up").hide();
        $(".metroBox_Icon_Down").hide();
    } else {
        if (!isFirstLoad) {
            $(".metroBox_Icon_Up").show();
            $(".metroBox_Icon_Down").show();
        }
    }
    for (var i = 0; i < tempNum; i++) {
        var _this = jsonData[i + rollNum];
        console.log(_this);

        var htmlStr = $("<div class=\"metroBox_Block3\"></div>");
        if (rollNum == 0 && i == 0) {
            htmlStr = $("<div class=\"metroBox_Block3\" style=\"margin-top:21px\"></div>");
        }
        /*
        *以下为更新逻辑
        *1、距离上次更新至少2周
        *2、手机、邮箱一致且为精确查重的可以自动更新
        *3、手机、邮箱只有1个相同且为精确查重的可以手动更新
        */
        if (_this["CanUpdate"]) {
            if (_this["IsExacte"]) {
                htmlStr.append('<div repeatId="' + _this["RResumeId"] + '|' + codeHelper.Decode(_this["RCandidateName"]) + '" class="metroBox_Block_Update default_IsExacte"></div>');
            } else {
                if (_SEARCHTYPE == 0) {
                    //htmlStr.append('<div repeatId="' + _this["RResumeId"] + '|' + codeHelper.Decode(_this["RCandidateName"]) + '" class="metroBox_Block_Update default_IsExacte"></div>');
                }else {
                    if ((_this["RMobile"] == _MOBILE || _this["REmail"] == _EMAIL) && _SEARCHTYPE == 1) {
                        htmlStr.append('<div repeatId="' + _this["RResumeId"] + '|' + codeHelper.Decode(_this["RCandidateName"]) + '" class="metroBox_Block_Update"></div>');
                    }
                }
            }  
        }

        //标题栏
        var title = "<div class=\"metroBox_Block_title clearfix\">";
        //RMS简历状态
        switch (convertStr(codeHelper.Decode(_this["Status"]))) {
            case "未处理":
                title += "<span class=\"label left label-Untreated\">未处理</span>";
                break;
            case "储备库":
                title += "<span class=\"label left label-Repository\">储备库</span>";
                break;
            case "已录用":
                title += "<span class=\"label left label-Repository\">已录用</span>";
                break;
            case "招聘中":
                title += "<span class=\"label left label-Repository\">招聘中</span>";
                break;
            case "已废弃":
                title += "<span class=\"label left label-obsolete\">已废弃</span>";
                break;
            default:
                title += "<span class=\"label left label-Untreated\">未处理</span>";
                break;
        }
        //是否关联RMS简历库
        if (_this["RIsConnection"] == false || _this["RIsConnection"] == undefined) {
            //重新显示，显示分数
            if (_this["Score"] != undefined) {
                var tempScore = Math.round(_this["Score"] * 10000) / 100; //parseInt(_this["Score"] * 10000) / 100;
                if (tempScore >= 100) {
                    tempScore = 100;
                }
                if (tempScore <= 0) {
                    tempScore = 0;
                }
                title += ("<span class=\"label right label-similarity\">匹配相似度：" + tempScore + "%</span>");
            } else {
                title += ("<span class=\"label right label-similarity\">匹配相似度：0%</span>");
            }
        } else {
            title += "<span class=\"label right label-relation\">已关联RMS简历</span>";
        }
        title += "</div>";
        htmlStr.append(title);


        //个人信息栏
        var personInfo = "<div class=\"metroBox_Block_Name\">";
        //姓名
        if (_this["RCandidateName"] != undefined) {
            var namePersonInfo = _this["RCandidateName"].trim();
            if (_this["RCandidateName"].trim().length > 3) {
                namePersonInfo = _this["RCandidateName"].trim().substring(0, 2) + "...";
            }
            personInfo += ("<a target=\"_blank\" href=\"" + commonUrl + "/Resume/ResumeDetailInfo?ID=" +
                _this["RResumeId"] + "&TaskId=" + _this["TaskId"] + "\">" +
                "<span class=\"metroBox_Block_Name_Name\" title=\"" + _this["RCandidateName"] + "\">" +
                (rollNum + 1 + i) + "、" + namePersonInfo + "</span></a>");
        } else {
            personInfo += ("<span class=\"metroBox_Block_Name_Name\" title=\"无名氏\">" + (rollNum + 1 + i) + "、无名氏</span>");
        }
        //学位信息
        var other = "";
        var degreePersonInfo = "";
        var degreePersonInfoTitle = "";
        var graduatePersonInfo = "";
        var graduatePersonInfoTitle = "";
        var marginLeftStyle = "";
        if (_this["RHightestDegree"] != undefined) {
            if (_this["RHightestDegree"].length > 3) {
                degreePersonInfo = _this["RHightestDegree"].substring(0, 3) + "...";
                degreePersonInfoTitle = _this["RHightestDegree"];
                marginLeftStyle = "style=\"margin-left: 0px\"";
            } else {
                degreePersonInfo = _this["RHightestDegree"];
                degreePersonInfoTitle = _this["RHightestDegree"];
            }
        }
        if (degreePersonInfo == "") {
            degreePersonInfo = "未知";
            degreePersonInfoTitle = "未知";
        }
        if (_this["RGraduateYear"] != undefined) {
            graduatePersonInfo = _this["RGraduateYear"];
            graduatePersonInfoTitle = _this["RGraduateYear"];
        }
        if (graduatePersonInfo == "") {
            graduatePersonInfo = "未知";
            graduatePersonInfoTitle = "未知";
        }
        other = ("<span class=\"metroBox_Block_Name_Year\" title=\"" + degreePersonInfoTitle + "/" + graduatePersonInfoTitle + "\" "
            + marginLeftStyle + ">" + degreePersonInfo + "/" + graduatePersonInfo + "</span>");
        personInfo += other;
        //操作
        var operate = "";
        if (_this["RIsConnection"] == false || _this["RIsConnection"] == undefined) {
            if (searchFuncHandle.judgeNoConnectionFun()) {
                operate = "<span class=\"metroBox_Block_Name_RelativeButton\" repeatId=\"" + _this["RResumeId"] + "|" + codeHelper.Decode(_this["RCandidateName"]) + "\">关联RMS简历</span>";
            }
        } else {
            var rightShow = _this["RRightCount"];
            var wrongShow = _this["RWrongCount"];
            if (parseInt(_this["RRightCount"]) >= 99) {
                rightShow = "99+";
            }
            if (parseInt(_this["RWrongCount"]) >= 99) {
                wrongShow = "99+";
            }
            operate = "<span class=\"metroBox_Block_Name_JudgeButton judgeButtonRight\" repeatId=\"" + _this["RMappingId"] + "|" + codeHelper.Decode(_this["RCandidateName"]) + "\">对<span class=\"metroJudgeNum\" id=\"right_" + _this["RMappingId"] + "\">(" + rightShow + ")</span></span>";
            operate += "<span class=\"metroBox_Block_Name_JudgeButton_wrong judgeButtonWrong\" repeatId=\"" + _this["RMappingId"] + "|" + codeHelper.Decode(_this["RCandidateName"]) + "\">错<span class=\"metroJudgeNum\" id=\"wrong_" + _this["RMappingId"] + "\">(" + wrongShow + ")</span></span>";
        }
        personInfo += operate;
        htmlStr.append(personInfo);


        //匹配的信息
        if (_this["RLabelDetailContent"] != undefined) {
            var showRLabelContent = _this["RLabelDetailContent"];
            if (_this["RLabelDetailContent"] == null) {
                showRLabelContent = "暂无";
            }
            if (_this["RLabelDetailContent"].trim() == "") {
                showRLabelContent = "暂无";
            }
            htmlStr.append("<div class=\"metroBox_Block_location\" title=\"" + showRLabelContent + "\">" + showRLabelContent + "</div>");
        } else {
            htmlStr.append("<div class=\"metroBox_Block_location\" title=\"暂无\">暂无</div>");
        }

        htmlStr.appendTo(div);
    }

    
    if (isFirstLoad == true) {
        var $t = $(div);
        var v = $t.get(0);
        return v.outerHTML;
    } else {
        $("#metroBox_TableShow").append(div);
        JudgeArrowShow();
    }
}

function JudgeArrowShow() {
    if (allRollCount > 3) {
        if (rollNum == 0) {
            $(".metroBox_Icon_Up").hide();
        }
        if ((rollNum + 3) >= allRollCount) {
            $(".metroBox_Icon_Down").hide();
        }
    }
}

function showIcon(icon, _this) {
	if (!icon.IsIn(icons))
        throw Error("do not support icon:" + icon);
    $('.metro_Icon').removeClass('fadeInLeft fadeInRight').addClass('fadeOutRight removeIcon');

    $('<div class="animated metroBox_Icon_' + icon + ' fadeOutRight metro_Icon"></div>').appendTo('body').toggleClass('fadeInRight').toggleClass('fadeOutRight').bind('click', function () {
        if (_this !== null)
            _this.removeClass('fadeOutLeft fadeOutRight').addClass('fadeInRight');
        $(this).toggleClass('fadeInRight').toggleClass('fadeOutRight');
    });
    $('.removeIcon').remove();
}

function clearPanel() {
	var _temps1 = $('.metro_Icon');
    _temps1.removeClass('fadeInRight fadeInLeft').addClass('fadeOutRight');
    var _temps2 = $('.metroBox');
    _temps2.removeClass('fadeInRight fadeInLeft').addClass('fadeOutRight');
    setTimeout(function () {
        _temps1.remove();
        _temps2.remove();
    }, 200);
}

function initNav() {
 	if (allPage === 1) {
        $("#btnPre,#btnNext").hide();
    }
    else {
        if (curPage === 1)
            $("#btnPre").hide();
        else
            $("#btnPre").show();
        if (allPage === curPage)
            $("#btnNext").hide();
        else
            $("#btnNext").show();
    }
}

function nextPage() {
	var _prePage = $("#page" + curPage);
    _prePage.removeClass('fadeInLeft fadeInRight').addClass('fadeOutLeft');
    setTimeout(function () {
        if (_prePage.css("display") == "block")
            _prePage.hide();
    }, 100);
    curPage++;
    $("#page" + curPage).show().removeClass('fadeOutLeft fadeOutRight').addClass('fadeInRight');
    initNav();
}

function prePage() {
	 var _prePage = $("#page" + curPage);//.toggleClass('fadeInLeft');
    _prePage.removeClass('fadeInLeft fadeInRight').addClass('fadeOutRight');
    setTimeout(function () {
        if (_prePage.css("display") == "block")
            _prePage.hide();
    }, 100);
    curPage--;
    $("#page" + curPage).show().removeClass('fadeOutLeft fadeOutRight').addClass('fadeInLeft');
    initNav();
}

function initEffect() {
    $(document).delegate('.metroBox_Block,.metroBox_Block2,.metroBox_Block3', 'hover', function () {
        $(this).find('.metroBox_Block_Update').width(106).text(MSG.UPDATE);
    });

    $(document).delegate('.metroBox_Block,.metroBox_Block2,.metroBox_Block3', 'mouseleave', function () {
        $(this).find('.metroBox_Block_Update').width(5).text("");
    });

    $(document).delegate('.metroBox_Block_Update', 'click', function () {
        update(this);
        return false;
    });

    $(document).delegate('.importNew', 'click', function () {
        importFlag = true;
        update(this);
        return false;
    });

    $(document).delegate('.searchAgain', 'click', function () {
        searchFuncHandle.searchAgainForNoRelation();
        return false;
    });

    $(document).delegate('#errorReport', 'click', function () {
        var func0 = function () {
            alert("反馈成功！");
            $("#errorReport").remove();
        };
        var func1 = function () {
            _msgHelper.ErrorBox({
                Content: '反馈失败！请发送邮件至RMS_SUPPORT！'
            });
        };
        searchFuncHandle.resultErrorReport(func0, func1);
        return false;
    });
    
    $(document).delegate("#metroBox_TableShow", "mouseenter", function () {
        isInArea = true;
    });

    $(document).delegate("#metroBox_TableShow", "mouseleave", function () {
        isInArea = false;
    });

    $(document).delegate(".metroBox_Block_Name_RelativeButton", "click", function() {
        relativeMetro(this);
    });

    $(document).delegate(".judgeButtonRight", "click", function () {
        judgeRelation(this, 1);
    });

    $(document).delegate(".judgeButtonWrong", "click", function () {
        judgeRelation(this, 0);
    });
}

function convertStr(oldstring) {
    if (oldstring === null)
        return oldstring;
    if (oldstring.length > 5)
        return oldstring.substring(0, 5);
    else
        return oldstring;
}

String.format = function () {
	if (arguments.length === 0)
        return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

String.prototype.IsIn = function (arr) {
	if (!(arr instanceof Array))
        throw Error("argument must be Arrary");
    for (var x in arr) {
        if (this.toLowerCase() === arr[x].toLowerCase()) {
            return true;
        }
    }
    return false;
};

function update(_this) {
    $('#metroBox_Table').removeClass('fadeInLeft fadeInRight').addClass('fadeOutLeft');
    setTimeout(function () {
        if ($('#metroBox_Table').css("display") == "block")
            $('#metroBox_Table').hide();
    }, 500);
    var updateId = "";
    var updateName = "此人";
    if (!importFlag) {
        updateId = $(_this).attr('repeatId').split('|')[0];
        updateName = $(_this).attr('repeatId').split('|')[1];
    }
    _msgHelper.MsgBox({
        Id: 'UpdatePanel',
        Title: '',
        Content: '<div style="height:30px">' + MSG.UPDATE_TITLE + '</div><div class="metroBox_Buttons"><button class="metroBox_Button btn_Submit">' + MSG.SUBMIT + '</button><button class="metroBox_Button btn_Cancel">' + MSG.CANCEL + '</button></div>',
        HiddenIcon: 'Work',
        Hidden: true,
        Clear: false
    });
    $('.btn_Cancel').bind('click', function () {
        importFlag = false;
        $('#UpdatePanel').removeClass('fadeInLeft fadeInRight').addClass('fadeOutRight');
        $('#metroBox_Table').show().removeClass('fadeOutLeft fadeOutRight').addClass('fadeInLeft');
        setTimeout(function () {
            if ($('#UpdatePanel').css("display") == "block")
                $('#UpdatePanel').remove();
        }, 250);
    });

    $('.btn_Submit').bind('click', function () {
        if (importFlag) {
            searchFuncHandle.importResume();
            importFlag = false;
            return;
        }
        _msgHelper.LoadBox({
            Title: MSG.UPDATE_TITLE2,
            HiddenIcon: 'Work',
            Hidden: false,
            Clear: true
        });

        searchFuncHandle.updateResume(updateName, updateId, undefined, undefined, 1);

    });

    return false;

}

function relativeMetro(_this) {
    var relativeId = $(_this).attr('repeatId').split('|')[0];
    var relativeName = $(_this).attr('repeatId').split('|')[1];
    $('#metroBox_Table').removeClass('fadeInLeft fadeInRight').addClass('fadeOutRight');
    _msgHelper.MsgBox({
        Id: 'RelativePanel',
        Title: '',
        Content: '<div style="height:30px">' + MSG.RELATIVE_TITLE + '</div><div class="metroBox_Buttons"><button class="metroBox_Button btn_Submit">' + MSG.SUBMIT + '</button><button class="metroBox_Button btn_Cancel">' + MSG.CANCEL + '</button></div>',
        HiddenIcon: 'Work',
        Hidden: true,
        Clear: false
    });

    $('.btn_Cancel').bind('click', function () {
        $('#RelativePanel').removeClass('fadeInLeft fadeInRight').addClass('fadeOutRight');
        $('#metroBox_Table').show().removeClass('fadeOutLeft fadeOutRight').addClass('fadeInLeft');
        setTimeout(function () {
            if ($('#RelativePanel').css("display") == "block")
                $('#RelativePanel').remove();
        }, 250);
    });

    $('.btn_Submit').bind('click', function () {
        _msgHelper.LoadBox({
            Title: MSG.RELATIVE_TITLE2,
            HiddenIcon: 'Work',
            Hidden: false,
            Clear: true
        });
        searchFuncHandle.relativeResume(relativeName, relativeId);
    });
}

function judgeRelation(_this, value) {
    var relativeId = $(_this).attr('repeatId').split('|')[0];
    $('#metroBox_Table').removeClass('fadeInLeft fadeInRight').addClass('fadeOutRight');
    _msgHelper.MsgBox({
        Id: 'JudgeRelationPanel',
        Title: MSG.JUDGERELATION_TITLE,
        Content: '<div style="height:30px"><img src="' + line_loadingPic + '" /></div>',
        HiddenIcon: 'Work',
        Hidden: true,
        Clear: false
    });
    searchFuncHandle.judgeRelationResume(relativeId, value, 0);
}


