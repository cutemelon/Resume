var curPage = 1;
var allPage = 1;
var importFlag = false;
var icons = new Array("dormancy", "wait", "work", "hidden", "broken");
var allDataTemp;
var updateTimes = 0;

var MsgBox = function () {
    IMsgBox.apply(this);
};

initEffect();

MsgBox.prototype = new IMsgBox();

MsgBox.prototype.MsgBox = function (settings) {
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

    showDiv(ops);
};

MsgBox.prototype.LoadBox = function (settings) {
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
    //clearPanel();
    var ops = $.extend(params, settings);

    initWorking();
    startWork(ops.Title);
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

    //clearPanel();
    var ops = $.extend(params, settings);
    ops.Content += ops.Help;
    showErrorHtml(ops.Content);
    //this.MsgBox({
    //    Id: ops.Id,
    //    Title: ops.Title,
    //    Content: ops.Content,
    //    HiddenIcon: ops.HiddenIcon,
    //    Hidden: ops.Hidden
    //});
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

    var tag = 1;

    var ops = $.extend(params, settings);

    clearPanel();

    //标题后按钮显示
    var titleShow = "";
    var _content = "";
    if (ops.Title == MSG.RESULT_TITLE) {
        titleShow = "";
        _content = drawTableDiv(ops.Data, 0);
    } else if (ops.Title == MSG.RESULT_TITLE2) {
        titleShow = '<span id="searchAgain" class="default_button searchAgain" title="以下简历没有您所需要的，请点此模糊搜索">继续查找</span>';
        _content = drawTableDiv(ops.Data, 1);
    } else {
        titleShow = '<span id="importNewId" class="default_button importNew" title="以下简历没有您所需要的，请点此上传一份新简历">上传新简历</span>';
        _content = drawTableDiv(ops.Data, 0);
    }

    allDataTemp = ops.Data;
    var container = $('<div id="TableContent" class="default_container clearPanel" />');

    $('<div id="imgWork" style="position:absolute;width:50px;height:75px;z-index:9999; cursor:pointer"></div>').appendTo(container);

    var content = $('<div class="default_content" />');
    content.appendTo(container);

    $('<div>' + ops.Title + titleShow + '</div>').appendTo(content);
    if (ops.Data.length === 0 || ops.Data === null) {
        $('<div style="width: 330px; min-height: 70px;">' + _content + '</div>').appendTo(content);
    } else {
        $('<div style="width: 330px; min-height: 130px;">' + _content + '</div>').appendTo(content);
        $('<div style="width: 150px;"><a href="javascript:void(0);" id="btnPre" style="float:left"><<</a><a href="javascript:void(0);" id="btnNext" style="float:left;margin-left:5px;">>></a></div>').appendTo(content);
    }
    if (_SEARCHTYPE != 2) {
        $('<div><div id="errorReport" class="default_button" title="如果您重复下载了此份简历，请及时反馈给我们" style="width:90px;margin-left:200px;font-size:15px">重复下载反馈</div></div>').appendTo(content);
    }

    $('<div class="default_content2">真的要更新 <span id="CandidateName" style="padding-left:5px;padding-right:5px;"></span> 的简历吗<br />'
        + '<button class="default_button" id="btnOK">是</button><button id="btnCancel" class="default_button">否</button></div>')
    .appendTo(container).hide();
    updateTimes = 0;
    $(document).delegate('#btnCancel', 'click', function () {
        $(".default_container").slideUp('quick', function () {
            $(".default_content2").hide();
            $(".default_content").show();
            $(".default_container").slideDown('quick');
            importFlag = false;
        });
    });

    $(document).delegate('#btnOK', 'click', function () {
        if (updateTimes > 0) {
            return;
        }
        updateTimes = 1;
        $('.default_content2').html('正在更新简历...');
        //这里是导入新的
        if (importFlag) {
            searchFuncHandle.importResume();
            importFlag = false;
            return;
        }
        //这里是更新旧的
        //var htmlContent = document.getElementsByTagName('html')[0].innerHTML;
        //if (curUrl.indexOf('ResumeViewFolder') >= 0)
        //    htmlContent = htmlContent.replace($('#divChart').html(), '');
        //re = new RegExp('·', "g");
        //htmlContent = htmlContent.replace(re, '.');

        var func0 = function (data) {
            logHelper.Log("Update Resume Succeed");
            $('.default_content2').html(data.Name + "的简历更新成功<br/>0<a target='_blank' href='" + commonUrl + "/Resume/ResumeDetailInfo?ID=" + data.ResumeId + "'>点击查看</a>");
        };

        var func1 = function () {
            logHelper.Log("Import Resume Failed");
            $(".default_content2").hide();
            _msgHelper.ErrorBox({
                Content: "请手动上传"
            });
        };

        //var _ops = {
        //    content: htmlContent,
        //    repeatId: repeatId
        //};

        searchFuncHandle.updateResume(name, repeatId, func0, func1, 1);
    });

    var x;

    $(document).delegate('#imgWork', 'click', function () {
        if (tag == 1) {
            x = $("#TableContent").height();
            $("#TableContent").animate({ height: 80 }, "slow", null, function () {
                $("#TableContent").animate({ width: 0 }, "slow", null, function () {
                    $("#TableContent").toggleClass('default_container').toggleClass('default_container2').animate({ width: 40 }, "slow");
                    $('.default_table').hide();
                });
                tag = 0;
            });
        }
        else {
            $("#TableContent").animate({ width: 0 }, "slow", null, function () {
                $('.default_table').show();
                $("#TableContent").toggleClass('default_container').toggleClass('default_container2').animate({ width: 350 }, "slow", null, function () {
                    $("#TableContent").animate({ height: x }, "slow");
                });
                tag = 1;
            });
        }
    });

    container.appendTo('body').hide().slideDown(1000);
    resize();

    $('#RefreshPage,#btnNext').click(function () {
        nextPage();
    });

    $('#btnPre').click(function () {
        prePage();
    });

    initNav();
};

MsgBox.prototype.InitIcon = function (iconName) {
    showIcon(iconName, null);
};

MsgBox.prototype.ChangeTitle = function (title) {
    $('.default_workContent').html(title);
};

MsgBox.prototype.MsgBoxLeft = function (content) {
    var divLeft = $('<div class="animated fadeOutLeft metro_Left"> <div class="metro_Left_Content">' + content + '</div></div>');
    divLeft.appendTo('body').removeClass('fadeOutLeft').addClass('fadeInLeft');
};

function resize() {
    var needResize = $(".default_content") !== null;
    if (needResize) {
        var realHeight = $("#page1").parent().height();//$("#page1").height();
        $(".default_content").height(realHeight + 50);
    }
}

function showIcon(icon, _this) {
    if (!icon.IsIn(icons))
        throw Error("do not support icon:" + icon);
    switch (icon) {
        case 'Dormancy': initDormancy(); break;
        case 'Work': initWorking(); break;

    }
}

function clearPanel() {
    $('.clearPanel').slideUp(1000, function () {
        $(this).remove();
    });
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
    $(document).delegate('.metroBox_Block', 'hover', function () {
        $(this).find('.metroBox_Block_Update').width(106).text(MSG.UPDATE);
    });

    $(document).delegate('.metroBox_Block', 'mouseleave', function () {
        $(this).find('.metroBox_Block_Update').width(5).text("");
    });

    $(document).delegate('.metroBox_Block_Update', 'click', function () {
        update(this);
        return false;
    });

    $(document).delegate('.searchAgain', 'click', function () {
        $("#TableContent").hide();
        searchFuncHandle.searchAgainForNoRelation();
        return false;
    });

    $(document).delegate(".relativeButton", "click", function () {
        relativeMetro(this);
    });

    $(document).delegate(".judgeButtonRight", "click", function () {
        judgeRelation(this, 1);
    });

    $(document).delegate(".judgeButtonWrong", "click", function () {
        judgeRelation(this, 0);
    });

    $(document).delegate('#errorReport', 'click', function () {
        var func0 = function () {
            alert("反馈成功！");
            $("#errorReport").remove();
        };
        var func1 = function () {
            $(".default_content").hide();
            _msgHelper.ErrorBox({
                Content: '反馈失败！请发送邮件至RMS_SUPPORT！'
            });
        };
        searchFuncHandle.resultErrorReport(func0, func1);
    });

    $(document).delegate('.importNew', 'click', function () {
        importFlag = true;
        $("#CandidateName").text("此人");
        $(".default_container").slideUp('quick', function () {
            $(".default_content").hide();
            $(".default_content2").show();
            $(".default_container").slideDown('quick');
        });
    });

    $(document).delegate('.updateButton', 'click', function () {
        repeatId = $(this).attr('repeatId').split('|')[0];
        name = $(this).parent().siblings().find('a').html();
        $("#CandidateName").text(name);
        $(".default_container").slideUp('quick', function () {
            $(".default_content").hide();
            $(".default_content2").show();
            $(".default_container").slideDown('quick');
        });
    });
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

function initDormancy() {
    var sleepDiv = $('<div class="default_sleepDiv"  style="cursor:pointer"  />');
    $('<img width="60px" height="90px" />')
	.attr('src', dormancyPic)
	.appendTo($(sleepDiv));
    $(sleepDiv).click(function () {
        $(sleepDiv).animate({ width: 0 }, "slow");
    }).appendTo('body');
};

function initWorking() {
    $('.default_sleepDiv').remove();
    var workDiv = $('<div class="default_workDiv clearPanel" />');
    $('<img id="workImg" width="50px" height="80px" style="float:left;cursor:pointer" />').attr('src', workingPic).appendTo($(workDiv));
    $(workDiv).appendTo('body');
    $(".default_workDiv").show();
};

function startWork(statusText) {
    var tag = 1;
    $('#workImg').click(function () {
        if (tag == 1) {
            $(".default_workContent").slideUp(500, function () {
                $(".default_workDiv").animate({ width: 50 }, "slow");
                tag = 0;
            });
        }
        else {
            $(".default_workDiv").animate({ width: 330 }, "slow", null, function () {
                $(".default_workContent").slideDown(500);
                tag = 1;
            });
        }
    });
    $('<div class="default_workContent" />').text(statusText).appendTo($('.default_workDiv'));
    $(".default_workDiv").animate({ width: 330 }, "slow", null, function () {
        $(".default_workContent").animate({ height: 60 }, "slow");
    });
};

function showErrorHtml(content) {
    if ($(".default_workContent").length == 0) {
        initWorking();
        startWork("");
    }
    $('#workImg').attr('src', brokenPic);

    $(".default_workContent").css('line-height', '30px').html(content);
};

function drawTableDiv(jsonData, searchType) {
    if (jsonData === '[]' || jsonData === null || jsonData.length <= 0)
        return '暂未匹配到相似简历';

    var totalCount = jsonData.length;
    var pageCount = Math.ceil(totalCount / 5);
    allPage = pageCount;
    var result = "";
    //result += drawDivPage(jsonData,1);

    for (var i = 1 ; i <= pageCount ; i++) {
        result += drawDivPage(jsonData, i, searchType);
    }
    return result;
}

function drawDivPage(jsonData, pageNum, searchType) {
    var div;
    if (pageNum === 1)
        div = $('<div id="page' + pageNum + '" class="animated rotateInDownLeft" style="position:absolute"></div>');
    else
        div = $('<div id="page' + pageNum + '" class="animated" style="display:none;position:absolute"></div>');
    var tableHtml = $('<table class="default_table"></table>');
    var tableHeadHtml = $('<thead><tr><th style="width: 15%">姓名</th><th style="width: 15%">学历</th><th style="width: 15%">毕业年份</th><th style="width: 25%">匹配度</th><th style="width: 10%">操作</th><th></th></tr></thead>');
    if (searchType == 1) {
        tableHeadHtml = $('<thead><tr><th style="width: 15%">姓名</th><th style="width: 15%">学历</th><th style="width: 15%">毕业年份</th><th style="width: 25%">操作</th><th></th></tr></thead>');
    }
    tableHeadHtml.appendTo(tableHtml);

    var tableBodyHtml = $("<tbody></tbody>");

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

    for (var i = 0 ; i < 5 ; i++) {
        var tempThis = jsonData[i + ((pageNum - 1) * 5)];
        console.log(tempThis);
        var tableTrHtml;

        var showRLabelContent = "";

        //匹配的信息
        if (tempThis["RLabelDetailContent"] != undefined) {
            showRLabelContent = tempThis["RLabelDetailContent"];
            if (tempThis["RLabelDetailContent"] == null) {
                showRLabelContent = "暂无";
            }
            if (tempThis["RLabelDetailContent"].trim() == "") {
                showRLabelContent = "暂无";
            }
        } else {
            showRLabelContent = "暂无";
        }

        //重新显示，显示分数
        tableTrHtml = $('<tr style="width:100%;" title="' + showRLabelContent + '"></tr>');

        tableTrHtml.append('<td><a target="_blank" href="' + commonUrl + '/Resume/ResumeDetailInfo?ID=' + tempThis["RResumeId"] + '&TaskId=' + tempThis["TaskId"] + '">' + convertStr(tempThis["RCandidateName"]) + '</a></td>');

        //学位
        if (tempThis["RHightestDegree"] != undefined) {
            tableTrHtml.append("<td>" + tempThis["RHightestDegree"] + "</td>");
        } else {
            tableTrHtml.append("<td></td>");
        }
        //毕业年份
        if (tempThis["RGraduateYear"] != undefined) {
            tableTrHtml.append("<td>" + tempThis["RGraduateYear"] + "</td>");
        } else {
            tableTrHtml.append("<td></td>");
        }
        //匹配度
        if (tempThis["RIsConnection"] == false || tempThis["RIsConnection"] == undefined) {
            if (tempThis["Score"] != undefined) {
                var tempScore = Math.round(tempThis["Score"] * 10000) / 100;
                if (tempScore >= 100) {
                    tempScore = 100;
                }
                if (tempScore <= 0) {
                    tempScore = 0;
                }
                tableTrHtml.append('<td>' + tempScore + '%</td>');
            } else {
                tableTrHtml.append('<td>0%</td>');
            }
            if (searchFuncHandle.judgeNoConnectionFun()) {
                tableTrHtml.append('<td><span class="default_button relativeButton" repeatId="' + tempThis["RResumeId"] + '|' + tempThis["RCandidateName"] + '">关联</span></td>');
            } else {
                tableTrHtml.append('<td></td>');
            }
        } else {
            var operate = "";
            var rightShow = tempThis["RRightCount"];
            var wrongShow = tempThis["RWrongCount"];
            if (parseInt(tempThis["RRightCount"]) >= 99) {
                rightShow = "99+";
            }
            if (parseInt(tempThis["RWrongCount"]) >= 99) {
                wrongShow = "99+";
            }
            operate = "<span class=\"default_button judgeButtonRight\" repeatId=\"" + tempThis["RMappingId"] + "|" + codeHelper.Decode(tempThis["RCandidateName"]) + "\">对<span class=\"judgeNum\" id=\"right_" + tempThis["RMappingId"] + "\">(" + rightShow + ")</span></span>";
            operate += "<span class=\"default_button judgeButtonWrong\" repeatId=\"" + tempThis["RMappingId"] + "|" + codeHelper.Decode(tempThis["RCandidateName"]) + "\">错<span class=\"judgeNum\" id=\"wrong_" + tempThis["RMappingId"] + "\">(" + wrongShow + ")</span></span>";
            tableTrHtml.append('<td>' + operate + '</td>');
        }

        /*
        *以下为更新逻辑
        *1、距离上次更新至少2周
        *2、手机、邮箱一致且为精确查重或者为关联查重的自动更新
        *3、手机、邮箱只有1个相同且为精确查重的可以手动更新
        */
        if (tempThis["CanUpdate"]) {
            if (tempThis["IsExacte"]) {
                tableTrHtml.append('<td><span class="default_button updateButton default_IsExacte" repeatId="' + tempThis["RResumeId"] + '|' + tempThis["RCandidateName"] + '">更新</span></td>');
            } else {
                if (_SEARCHTYPE == 0) {
                    //tableTrHtml.append('<td><span class="default_button updateButton default_IsExacte" repeatId="' + tempThis["RResumeId"] + '|' + tempThis["RCandidateName"] + '">更新</span></td>');
                } else {
                    if ((tempThis["RMobile"] == _MOBILE || tempThis["REmail"] == _EMAIL) && _SEARCHTYPE == 1) {
                        tableTrHtml.append('<td><span class="default_button updateButton" repeatId="' + tempThis["RResumeId"] + '|' + tempThis["RCandidateName"] + '">更新</span></td>');
                    }
                }
            }
        }
        else {
            tableTrHtml.append("<td></td>");
        }

        tableTrHtml.appendTo(tableBodyHtml);
        if ((i + 1 + ((pageNum - 1) * 5)) === jsonData.length) {
            break;
        }
    }
    tableBodyHtml.appendTo(tableHtml);
    tableHtml.appendTo(div);
    var $t = $(div);
    var v = $t.get(0);
    return v.outerHTML;

}

function showDiv(settings) {
    $('#imgWork').unbind('click');
    clearPanel();
    tag = 1;

    var _title = settings.Title;

    var container = $('<div id="TableContent" class="default_container clearPanel" />');
    $('<div id="imgWork" style="position:absolute;width:50px;height:75px;z-index:9999; cursor:pointer"></div>').appendTo(container);

    var content = $('<div class="default_content" />');
    content.appendTo(container);
    $('<div>' + _title + '</div>').appendTo(content);
    $('<div style="width: 330px;">' + settings.Content + '</div>').appendTo(content);

    var x;
    $(document).delegate('#imgWork', 'click', function () {
        if (tag == 1) {
            x = $("#TableContent").height();
            $("#TableContent").animate({ height: 80 }, "slow", null, function () {
                $("#TableContent").animate({ width: 0 }, "slow", null, function () {
                    $("#TableContent").toggleClass('default_container').toggleClass('default_container2').animate({ width: 40 }, "slow");
                });
                tag = 0;
            });
            $('.default_table').hide();
        }
        else {
            $('.default_table').show();
            $("#TableContent").animate({ width: 0 }, "slow", null, function () {
                $("#TableContent").toggleClass('default_container').toggleClass('default_container2').animate({ width: 350 }, "slow", null, function () {
                    $("#TableContent").animate({ height: x }, "slow");
                });
                tag = 1;
            });
        }
    });

    container.appendTo('body').hide().slideDown(1000);
}

function convertStr(oldstring) {
    if (oldstring === null)
        return oldstring;
    if (oldstring.length > 5)
        return oldstring.substring(0, 5);
    else
        return oldstring;
}

function judgeRelation(_this, value) {
    var relativeId = $(_this).attr('repeatId').split('|')[0];
    $('#TableContent').hide();
    _msgHelper.LoadBox({
        Id: 'JudgeRelationPanel',
        Title: MSG.JUDGERELATION_TITLE,
        HiddenIcon: 'Work',
        Hidden: false,
        Clear: true
    });
    searchFuncHandle.judgeRelationResume(relativeId, value, 1);
}

function update(_this) {
    $('#metroBox_Table').removeClass('fadeInLeft fadeInRight').addClass('fadeOutLeft');
    setTimeout(function () {
        if ($('#metroBox_Table').css("display") == "block")
            $('#metroBox_Table').hide();
    }, 500);
    var updateId = $(_this).attr('repeatId').split('|')[0];
    var updateName = $(_this).attr('repeatId').split('|')[1];
    _msgHelper.MsgBox({
        Id: 'UpdatePanel',
        Title: '',
        Content: '<div style="height:30px">' + MSG.UPDATE_TITLE + '</div><div class="metroBox_Buttons"><button class="metroBox_Button btn_Submit">' + MSG.SUBMIT + '</button><button class="metroBox_Button btn_Cancel">' + MSG.CANCEL + '</button></div>',
        HiddenIcon: 'Work',
        Hidden: true,
        Clear: false
    });
    $('.btn_Cancel').bind('click', function () {
        $('#UpdatePanel').removeClass('fadeInLeft fadeInRight').addClass('fadeOutRight');
        $('#metroBox_Table').show().removeClass('fadeOutLeft fadeOutRight').addClass('fadeInLeft');
        setTimeout(function () {
            if ($('#UpdatePanel').css("display") == "block")
                $('#UpdatePanel').remove();
        }, 250);
    });

    $('.btn_Submit').bind('click', function () {
        _msgHelper.LoadBox({
            Title: MSG.UPDATE_TITLE2,
            HiddenIcon: 'Work',
            Hidden: false,
            Clear: true
        });

        searchFuncHandle.updateResume(updateName, updateId, null, null, 1);

    });


    //alert(_this.attr('repeatid'));
    return false;

}

function relativeMetro(_this) {
    var relativeId = $(_this).attr('repeatId').split('|')[0];
    var relativeName = $(_this).attr('repeatId').split('|')[1];
    $('#metroBox_Table').removeClass('fadeInLeft fadeInRight').addClass('fadeOutRight');
    _msgHelper.MsgBox({
        Id: 'RelativePanel',
        Title: '',
        Content: '<div style="height:30px">' + MSG.RELATIVE_TITLE + '</div><div><button class="default_button btn_Submit">' + MSG.SUBMIT + '</button><button class="default_button btn_Cancel">' + MSG.CANCEL + '</button></div>',
        HiddenIcon: 'Work',
        Hidden: true,
        Clear: false
    });

    $('.btn_Cancel').bind('click', function () {
        _msgHelper.TableBox({
            Title: MSG.RESULT_TITLE,
            Data: allDataTemp,
            HiddenIcon: 'Wait'
        });
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













