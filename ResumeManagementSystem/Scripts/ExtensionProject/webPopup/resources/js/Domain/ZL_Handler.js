/// <reference path="global.js" />
function VagueData()
{ 
	this.sex = "";
	this.birthday = "";
	this.school = "";
	this.company = "";
	this.project = "";
	this.identity = "";
	this.mobile = "";
	this.mobileLast = "";
	this.email = "";
	this.graduateYear = "";
	this.cities = "";
	this.registry = "";
    this.name = "";
    this.extraDatas = new ExtraData();
}

function ExtraData() {
    this.userName = "";
    this.resumeId = "";
    this.extId = "";
    this.resumeUserId = "";
}

var ZLHandler = function () {
    IHandler.apply(this);
};

ZLHandler.prototype = new IHandler();

ZLHandler.prototype.hasContactInfo = function () {
    var summary = $('.summary-bottom').text();
	//是否包括mail关键字 以此判断页面是否包含联系信息
	var hasContactInfo = (summary.indexOf('如需联系方式请下载该简历') < 0);
	return hasContactInfo;
};

ZLHandler.prototype.getContactInfo = function () {
	var summary = $('.summary-bottom').text().trim();
	var strMobile = '';
	strMobile = summary.substr(0, 11);
    strMobile = (strMobile == undefined) ? "" : strMobile;
    var strEmail = "";
	strEmail = $('.mail').text().trim();
	if(strMobile == "" && strEmail == "")
	    throw new Error('102');
	return GetSearchDataCommonZL();
};

ZLHandler.prototype.getDataForSearch = function () {
    return GetSearchDataCommonZL();
};

ZLHandler.prototype.getAllIdentities = function(){
    var allTrs = $('.info');
    var identityReg = /J\w{22}/g;
    var idenitities = "";
    $(allTrs).each(function(){
        var tempIdentity = $(this).attr('tag');
        idenitities += ((tempIdentity + "").match(identityReg) + "$");
    });
    
    if(idenitities.length > 22)
        idenitities = idenitities.substr(0, idenitities.length - 1);
    return idenitities;
};

ZLHandler.prototype.getResumeId = function () {
    var identity = $("#resume_id").val();
    return identity;
};

ZLHandler.prototype.getResumeShowId = function () {
    var identity = $('.resume-left-tips-id:eq(0)').text();
    identity = identity.substring(3, identity.length).trim();
    return identity;
};

ZLHandler.prototype.uploadResume = function() {
    var resumeDetailModel = new RDM();

    var contentTxt = $(".resume-preview-all");
    var indexWork = -1;
    var indexSchool = -1;
    var indexWorkLike = -1;
    var indexProject = -1;
    var indexSelfEvulation = -1;
    var indexLanguage = -1;
    var indexSkill = -1;
    var indexInterest = -1;
    var indexCer = -1;
    var indexTrain = -1;
    for (var l = 0; l < contentTxt.length; l++) {
        if (contentTxt[l].getElementsByTagName("h3")[0] != undefined) {
            if (contentTxt[l].getElementsByTagName("h3")[0].innerText.trim() == "工作经历") {
                indexWork = l;
            }
            if (contentTxt[l].getElementsByTagName("h3")[0].innerText.trim() == "教育经历") {
                indexSchool = l;
            }
            if (contentTxt[l].getElementsByTagName("h3")[0].innerText.trim() == "求职意向") {
                indexWorkLike = l;
            }
            if (contentTxt[l].getElementsByTagName("h3")[0].innerText.trim() == "项目经历") {
                indexProject = l;
            }
            if (contentTxt[l].getElementsByTagName("h3")[0].innerText.trim().indexOf("自我评价") >= 0) {
                indexSelfEvulation = l;
            }
            if (contentTxt[l].getElementsByTagName("h3")[0].innerText.trim().indexOf("语言能力") >= 0) {
                indexLanguage = l;
            }
            if (contentTxt[l].getElementsByTagName("h3")[0].innerText.trim().indexOf("专业技能") >= 0) {
                indexSkill = l;
            }
            if (contentTxt[l].getElementsByTagName("h3")[0].innerText.trim().indexOf("兴趣爱好") >= 0) {
                indexInterest = l;
            }
            if (contentTxt[l].getElementsByTagName("h3")[0].innerText.trim().indexOf("证书") >= 0) {
                indexCer = l;
            }
            if (contentTxt[l].getElementsByTagName("h3")[0].innerText.trim().indexOf("培训经历") >= 0) {
                indexTrain = l;
            }
        }
    }

    //更新信息
    resumeDetailModel.update_info = new UpdateInfo();
    resumeDetailModel.update_info.updated_at = $("#resumeUpdateTime").text().trim().replace("年", "-").replace("月", "-").replace("日","");

    //联系方式
    resumeDetailModel.contact = new Contact();
    var summary = $('.summary-bottom').text().trim();
    var mobile = '';
    if (summary.indexOf('如需联系方式请下载该简历') >= 0) {
        mobile = "";
    } else {
        mobile = summary.substr(0, 11);
    }
    resumeDetailModel.contact.email = $('.mail').text().trim();
    resumeDetailModel.contact.phone = mobile;

    //来源
    resumeDetailModel.src = ["0"];

    //更新时间
    resumeDetailModel.updated_at = resumeDetailModel.update_info.updated_at;

    //个人信息
    resumeDetailModel.basic = new BaseInfo();
    //简历ID
    resumeDetailModel.basic.id = $($(".resume-left-tips-id")[0]).text().replace("ID:", "").trim();
    //简历用户ID
    resumeDetailModel.basic.hidId = $("#resume_id").val();
    //简历用户ID
    resumeDetailModel.basic.resumeUserId = $("#resumeUserId").val();
    //姓名
    resumeDetailModel.basic.name = $("#tt_username").val();
    var tempTxtPerson = $(".summary-top").find("span").html();
    var tempTxtArrary = tempTxtPerson.split("&nbsp;");
    var tempTxtPersonMoreArrary = $(".summary-top").html().split("<br>")[1].split("|");
    var workExp = "";
    var ageBirt = "";
    var bornPlace = "";
    var livePlace = "";
    for (var i = 0; i < tempTxtArrary.length; i++) {
        if (tempTxtArrary[i].trim() != "") {
            if (tempTxtArrary[i].indexOf("工作经验") >= 0) {
                workExp = tempTxtArrary[i];
            }
            if (tempTxtArrary[i].indexOf("岁") >= 0 && tempTxtArrary[i].indexOf("年") >= 0) {
                ageBirt = tempTxtArrary[i];
            }
            //性别
            if (tempTxtArrary[i].trim() == "男" || tempTxtArrary[i].trim() == "女") {
                if (tempTxtArrary[i].indexOf("男") >= 0) {
                    resumeDetailModel.basic.gender = "0";
                } else {
                    if (tempTxtArrary[i].indexOf("女") >= 0) {
                        resumeDetailModel.basic.gender = "1";
                    } else {
                        resumeDetailModel.basic.gender = "2";
                    }
                }
            }
            //婚姻状况
            if (tempTxtArrary[i].trim() == "已婚" || tempTxtArrary[i].trim() == "未婚") {
                if (tempTxtArrary[i].indexOf("已婚") >= 0) {
                    resumeDetailModel.basic.marital = "Y";
                } else {
                    if (tempTxtArrary[i].indexOf("未婚") >= 0) {
                        resumeDetailModel.basic.marital = "N";
                    } else {
                        resumeDetailModel.basic.marital = "U";
                    }
                }
            }
        }
    }
    for (var u = 0; u < tempTxtPersonMoreArrary.length; u++) {
        if (tempTxtPersonMoreArrary[u].indexOf("现居住地") >= 0) {
            livePlace = tempTxtPersonMoreArrary[u];
        }
        if (tempTxtPersonMoreArrary[u].indexOf("户口") >= 0) {
            bornPlace = tempTxtPersonMoreArrary[u];
        }
    }
    //现住地
    if (livePlace != "") {
        resumeDetailModel.basic.address_province = GetProvinceLocation(livePlace.split("：")[1].trim());
    }
    //户口所在地
    if (bornPlace != "") {
        resumeDetailModel.basic.account_province = GetProvinceLocation(bornPlace.split("：")[1].trim());
    }
    //工作经验
    if (workExp != "") {
        resumeDetailModel.basic.work_experience = workExp.replace("年工作经验", "");
    } else {
        resumeDetailModel.basic.work_experience = 0;
    }
    if (ageBirt != "") {
        //出生年月
        resumeDetailModel.basic.birth = ageBirt.split('(')[1].split(')')[0].trim().replace("年", "-").replace("月", "");
        //年龄
        resumeDetailModel.basic.age = ageBirt.split('(')[0].trim().replace("岁", "");
    }
    //求职意向
    if (indexWorkLike != -1) {
        var tempWorkLikeDom = $(contentTxt[indexWorkLike]).find("tr");
        for (var j = 0; j < tempWorkLikeDom.length; j++) {
            //期望工作地点
            if (tempWorkLikeDom[j].querySelector("[align='right']").innerText.trim().indexOf("期望工作地区") >= 0) {
                resumeDetailModel.basic.expect_city_ids = $(tempWorkLikeDom)[j].innerText.split("：")[1].trim();
            }
            //当前状态
            var tempCurrentStatus = "";
            if (tempWorkLikeDom[j].querySelector("[align='right']").innerText.trim().indexOf("目前状况") >= 0) {
                tempCurrentStatus = $(tempWorkLikeDom)[j].innerText.split("：")[1].trim();
                resumeDetailModel.basic.current_status = tempCurrentStatus;
            }
            //期望月薪
            var tempSalary = "";
            if (tempWorkLikeDom[j].querySelector("[align='right']").innerText.trim().indexOf("期望月薪") >= 0) {
                if ($(tempWorkLikeDom)[j].innerText.indexOf("-") >= 0) {
                    if ($(tempWorkLikeDom)[j].innerText.indexOf("元/月以下") >= 0) {
                        //期望月薪最小值
                        resumeDetailModel.basic.expect_salary_from = "0";
                        //期望月薪最大值
                        resumeDetailModel.basic.expect_salary_to = $(tempWorkLikeDom)[j].innerText.replace("元/月以下", "").trim();
                    } else {
                        tempSalary = $(tempWorkLikeDom)[j].innerText.split("：")[1].trim().replace("元/月", "");
                        //期望月薪最小值
                        resumeDetailModel.basic.expect_salary_from = tempSalary.split('-')[0].trim();
                        //期望月薪最大值
                        resumeDetailModel.basic.expect_salary_to = tempSalary.split('-')[1].trim();
                    }
                }
            }
            //期望工作性质
            if (tempWorkLikeDom[j].querySelector("[align='right']").innerText.trim().indexOf("期望工作性质") >= 0) {
                resumeDetailModel.basic.expect_type = $(tempWorkLikeDom)[j].innerText.split("：")[1].trim();
            }
            //期望从事职业
            if (tempWorkLikeDom[j].querySelector("[align='right']").innerText.trim().indexOf("期望从事职业") >= 0) {
                resumeDetailModel.basic.expect_position_name = $(tempWorkLikeDom)[j].innerText.split("：")[1].trim();
            }
            //期望从事行业
            if (tempWorkLikeDom[j].querySelector("[align='right']").innerText.trim().indexOf("期望从事行业") >= 0) {
                resumeDetailModel.basic.expect_industry_name = $(tempWorkLikeDom)[j].innerText.split("：")[1].trim();
            }
        }
    }
    //自我评价
    if (indexSelfEvulation != -1) {
        resumeDetailModel.basic.self_remark = $(contentTxt[indexSelfEvulation]).find(".resume-preview-dl").text().trim();
    }
    //兴趣爱好
    if (indexInterest != -1) {
        resumeDetailModel.basic.interests = contentTxt[indexInterest].querySelector(".resume-preview-dl").innerText.trim();
    }

    //工作信息
    if (indexWork != -1) {
        var tempWorkContent = $(contentTxt[indexWork]).html();
        tempWorkContent = tempWorkContent.replace("</h3>", "</h3><div class='workClassByAdd'>");
        while (tempWorkContent.indexOf("<h2>") >= 0) {
            tempWorkContent = tempWorkContent.replace("<h2>", "</div><div class='workClassByAdd'><h4>");
        }
        while (tempWorkContent.indexOf("</h2>") >= 0) {
            tempWorkContent = tempWorkContent.replace("</h2>", "</h4>");
        }
        tempWorkContent = tempWorkContent + "</div>";
        $(contentTxt[indexWork]).html(tempWorkContent);
        var tempWorkDom = $(contentTxt[indexWork]).find(".workClassByAdd");
        for (var k = 1; k < tempWorkDom.length; k++) {
            var tempWorkInfo = new WorkInfo();
            var tempWorkArrary = $(tempWorkDom[k]).find("h4").html().split('&nbsp;&nbsp;');
            var tempCompanyTimeArray = tempWorkArrary[0].trim().split("-");
            //开始时间
            tempWorkInfo.start_time = tempCompanyTimeArray[0].replace(".", "-").trim();
            //结束时间
            tempWorkInfo.end_time = tempCompanyTimeArray[1].replace(".", "-").trim();
            //是否至今
            if (tempWorkInfo.end_time == "至今") {
                tempWorkInfo.so_far = "Y";
                tempWorkInfo.end_time = "";
            }
            //公司
            tempWorkInfo.corporation_name = tempWorkArrary[1].trim().replace(/<\/?.+?>/g, "");
            var tempPerWorkArrary = $(tempWorkDom[k]).find("h5").text().split('|');
            //岗位
            tempWorkInfo.position_name = tempPerWorkArrary[0].trim().replace(/<\/?.+?>/g, "");
            for (var m = 0; m < tempPerWorkArrary.length; m++) {
                //当前薪资
                if (tempPerWorkArrary[m].indexOf("元/月") >= 0) {
                    if (tempPerWorkArrary[m].indexOf("元/月以下") >= 0) {
                        //期望月薪最小值
                        tempWorkInfo.basic_salary_from = "0";
                        //期望月薪最大值
                        tempWorkInfo.basic_salary_to = tempPerWorkArrary[m].replace("元/月以下", "").trim();
                    } else {
                        var tempComSalaryArrary = tempPerWorkArrary[m].replace("元/月", "").trim().split('-');
                        //当前薪资最小值
                        tempWorkInfo.basic_salary_from = tempComSalaryArrary[0].trim();
                        //当前薪资最大值
                        tempWorkInfo.basic_salary_to = tempComSalaryArrary[1].trim();
                    }
                }
            }
            var tempCompanyInfoArrary = $(tempWorkDom[k]).find(".resume-preview-dl")[0].innerText.trim().split('|');
            //行业
            tempWorkInfo.industry_name = tempCompanyInfoArrary[0].trim().replace(/<\/?.+?>/g, "");
            for (var n = 1; n < tempCompanyInfoArrary.length; n++) {
                if (tempCompanyInfoArrary[n].indexOf("企业性质") >= 0) {
                    //公司性质
                    tempWorkInfo.corporation_type = tempCompanyInfoArrary[n].replace("企业性质：", "").trim();
                }
                if (tempCompanyInfoArrary[n].indexOf("规模") >= 0) {
                    //规模
                    tempWorkInfo.scale = tempCompanyInfoArrary[n].replace("规模：", "").trim();
                }
            }
            //职责
            tempWorkInfo.responsibilities = $(tempWorkDom[k]).find(".resume-preview-dl")[1].innerText.trim().replace(/<\/?.+?>/g, "");

            resumeDetailModel.work.push(tempWorkInfo);
        }
        tempWorkContent = $(contentTxt[indexWork]).html();
        tempWorkContent = tempWorkContent.replace("</h3><div class=\"workClassByAdd\">", "</h3>");
        while (tempWorkContent.indexOf("<h4>") >= 0) {
            tempWorkContent = tempWorkContent.replace("</div><div class=\"workClassByAdd\"><h4>", "<h2>");
        }
        while (tempWorkContent.indexOf("</h4>") >= 0) {
            tempWorkContent = tempWorkContent.replace("</h4>", "</h2>");
        }
        $(contentTxt[indexWork]).html(tempWorkContent.substring(0, tempWorkContent.length - 6));
    }

    //教育信息
    if (indexSchool != -1) {
        var tempSchoolDom = $(contentTxt[indexSchool].querySelector(".resume-preview-dl")).html().trim().split("<br>");
        for (var o = 0; o < tempSchoolDom.length; o++) {
            if (tempSchoolDom[o].trim() != "") {
                var tempEduInfo = new EduInfo();
                var tempSchoolArrary = tempSchoolDom[o].split('&nbsp;&nbsp;');
                var tempSchoolTimeArray = tempSchoolArrary[0].trim().split("-");
                //开始时间
                tempEduInfo.start_time = tempSchoolTimeArray[0].replace(".", "-").trim();
                //结束时间
                tempEduInfo.end_time = tempSchoolTimeArray[1].replace(".", "-").trim();
                if (o== 0) {
                    resumeDetailModel.basic.graduate_date = tempEduInfo.end_time;
                }
                //是否至今
                if (tempEduInfo.end_time == "至今") {
                    tempEduInfo.so_far = "Y";
                    tempEduInfo.end_time = "";
                    resumeDetailModel.basic.graduate_date = "";
                }
                if (tempSchoolArrary.length >= 4) {
                    //学校
                    tempEduInfo.school_name = tempSchoolArrary[1].trim().replace(/<\/?.+?>/g, "");
                    if (resumeDetailModel.basic.school == "") {
                        resumeDetailModel.basic.school = tempEduInfo.school_name;
                    }
                    //专业
                    tempEduInfo.discipline_name = tempSchoolArrary[2].trim().replace(/<\/?.+?>/g, "");
                    //学历
                    tempEduInfo.degree = tempSchoolArrary[3].trim().replace(/<\/?.+?>/g, "");
                    if (resumeDetailModel.basic.degree == "") {
                        resumeDetailModel.basic.degree = tempEduInfo.degree;
                    }
                    resumeDetailModel.education.push(tempEduInfo);
                }
            }
        }
    }

    //语言信息
    if (indexLanguage != -1) {
        var tempLanDom = contentTxt[indexLanguage].querySelector(".resume-preview-dl").innerText.trim().split("\n");
        for (var p = 0; p < tempLanDom.length; p++) {
            var tempLanArrary = tempLanDom[p].trim().split("：");
            var tempLagInfo = new LanInfo();
            //语言类别
            tempLagInfo.name = tempLanArrary[0].trim();
            //掌握程度
            tempLagInfo.level = tempLanArrary.length >= 2 ? tempLanArrary[1].trim() : "";
            resumeDetailModel.language.push(tempLagInfo);
        }
    }

    //项目信息
    if (indexProject != -1) {
        var tempProjectContent = $(contentTxt[indexProject]).html();
        tempProjectContent = tempProjectContent.replace("</h3>", "</h3><div class='workClassByAdd'>");
        while (tempProjectContent.indexOf("<h2>") >= 0) {
            tempProjectContent = tempProjectContent.replace("<h2>", "</div><div class='workClassByAdd'><h4>");
        }
        while (tempProjectContent.indexOf("</h2>") >= 0) {
            tempProjectContent = tempProjectContent.replace("</h2>", "</h4>");
        }
        tempProjectContent = tempProjectContent + "</div>";
        $(contentTxt[indexProject]).html(tempProjectContent);
        var tempProjectDom = $(contentTxt[indexProject]).find(".workClassByAdd");
        for (var q = 1; q < tempProjectDom.length; q++) {
            var tempProInfo = new ProInfo();
            var tempProArrary = $(tempProjectDom[q]).find("h4").html().split('&nbsp;&nbsp;');
            var tempProTimeArray = tempProArrary[0].trim().split("-");
            //开始时间
            tempProInfo.start_time = tempProTimeArray[0].replace(".", "-").trim();
            //结束时间
            tempProInfo.end_time = tempProTimeArray[1].replace(".", "-").trim();
            //是否至今
            if (tempProInfo.end_time == "至今") {
                tempProInfo.so_far = "Y";
                tempProInfo.end_time = "";
            }
            //项目名称
            tempProInfo.name = tempProArrary[1].trim().replace(/<\/?.+?>/g, "");
            var temProDetailDom = tempProjectDom[q].querySelectorAll("[valign='top']");
            for (var r = 0; r < temProDetailDom.length; r++) {
                var tempProDetailContent = temProDetailDom[r].querySelector("td").innerText.trim();
                //软件环境
                if (tempProDetailContent.indexOf("软件环境") >= 0) {
                    tempProInfo.soft_env = temProDetailDom[r].innerText.replace(tempProDetailContent, "").trim().replace(/<\/?.+?>/g, "");
                }
                //硬件环境
                if (tempProDetailContent.indexOf("硬件环境") >= 0) {
                    tempProInfo.hard_env = temProDetailDom[r].innerText.replace(tempProDetailContent, "").trim().replace(/<\/?.+?>/g, "");
                }
                //开发工具
                if (tempProDetailContent.indexOf("开发工具") >= 0) {
                    tempProInfo.develop_tool = temProDetailDom[r].innerText.replace(tempProDetailContent, "").trim().replace(/<\/?.+?>/g, "");
                }
                //项目描述
                if (tempProDetailContent.indexOf("项目描述") >= 0) {
                    tempProInfo.describe = temProDetailDom[r].innerText.replace(tempProDetailContent, "").trim().replace(/<\/?.+?>/g, "");
                }
                //职责描述
                if (tempProDetailContent.indexOf("责任描述") >= 0) {
                    tempProInfo.responsibilities = temProDetailDom[r].innerText.replace(tempProDetailContent, "").trim().replace(/<\/?.+?>/g, "");
                }
            }
            resumeDetailModel.project.push(tempProInfo);
        }
        tempProjectContent = $(contentTxt[indexProject]).html();
        tempProjectContent = tempProjectContent.replace("</h3><div class=\"workClassByAdd\">", "</h3>");
        while (tempProjectContent.indexOf("<h4>") >= 0) {
            tempProjectContent = tempProjectContent.replace("</div><div class=\"workClassByAdd\"><h4>", "<h2>");
        }
        while (tempProjectContent.indexOf("</h4>") >= 0) {
            tempProjectContent = tempProjectContent.replace("</h4>", "</h2>");
        }
        $(contentTxt[indexProject]).html(tempProjectContent.substring(0, tempProjectContent.length - 6));
    }

    //证书信息
    if (indexCer != -1) {
        var tempCerDom = contentTxt[indexCer].querySelectorAll("h2");
        for (var t = 0; t < tempCerDom.length; t++) {
            var tempCerInfo = new CerInfo();
            var tempCerArrary = $(tempCerDom[t]).html().trim().split('&nbsp;&nbsp;');
            if (tempCerArrary.length >= 2) {
                //获得时间
                tempCerInfo.start_time = tempCerArrary[0].trim().replace(".", "-");
                //证书名称
                tempCerInfo.name = tempCerArrary[1].trim().replace(/<\/?.+?>/g, "");
                resumeDetailModel.certificate.push(tempCerInfo);
            }
        }
    }

    //培训信息
    if (indexTrain != -1) {
        var tempTrainDom = contentTxt[indexTrain].querySelectorAll("h2");
        for (var v = 0; v < tempTrainDom.length; v++) {
            var tempTrainInfo = new TraInfo();
            try {
                var tempTrainContent = tempTrainDom[v].innerText.trim();
                //开始时间
                tempTrainInfo.start_time = tempTrainContent.split('-')[0].trim();
                //结束时间
                //培训课程
                if (tempTrainInfo.end_time.indexOf("至今") >= 0) {
                    tempTrainInfo.end_time = "";
                    tempTrainInfo.so_far = "Y";
                    tempTrainInfo.name = tempTrainContent.split('-')[1].trim().substring(2).trim();
                } else {
                    tempTrainInfo.end_time = tempTrainContent.split('-')[1].trim().substring(0, 7).trim();
                    tempTrainInfo.name = tempTrainContent.split('-')[1].trim().substring(7).trim();
                }
                var tempTrainDetailDom = $(tempTrainDom[v]).next().find("tr");
                for (var w = 0; w < tempTrainDetailDom.length; w++) {
                    //培训机构
                    if (tempTrainDetailDom[w].querySelector("td").innerText.indexOf("培训机构") >= 0) {
                        tempTrainInfo.authority = tempTrainDetailDom[w].innerText.split("：")[1].trim();
                    }
                    //培训地点
                    if (tempTrainDetailDom[w].querySelector("td").innerText.indexOf("培训地点") >= 0) {
                        tempTrainInfo.city = tempTrainDetailDom[w].innerText.split("：")[1].trim();
                    }
                    //详细描述
                    if (tempTrainDetailDom[w].querySelector("td").innerText.indexOf("培训描述") >= 0) {
                        tempTrainInfo.description = tempTrainDetailDom[w].innerText.split("：")[1].trim();
                    }
                }
                resumeDetailModel.training.push(tempTrainInfo);
            } catch (e) {

            }
        }
    }

    //技能信息
    if (indexSkill != -1) {
        var tempSkiDom = contentTxt[indexSkill].querySelector(".resume-preview-dl").innerText.trim().split("\n");
        for (var s = 0; s < tempSkiDom.length; s++) {
            var tempSkiInfo = new SkiInfo();
            try {
                //名称
                tempSkiInfo.name = tempSkiDom[s].split("：")[0].trim();
                //掌握程度
                tempSkiInfo.level = tempSkiDom[s].split("：")[1].trim().split("|")[0].trim();
                //使用时间
                tempSkiInfo.period = tempSkiDom[s].split("：")[1].trim().split("|")[1].trim().replace("个月", "");
            } catch (e) {
                //名称 如果出错就整体写入名字
                tempSkiInfo.name = tempSkiDom[s].trim();
            }
            resumeDetailModel.skill.push(tempSkiInfo);
        }
    }

    return resumeDetailModel;
}

function GetSearchDataCommonZL() {
    var vagueData = new VagueData();
    var txt = $(".summary-top").find("span").text();

    /*
    *简历信息抓取
    */

    //姓名
    var name = $('#userName').text().trim();

    //性别
    var sex = txt.substr(0, 1);

    //生日
    var bir = txt.substring(txt.indexOf('(') + 1, txt.indexOf(')'));
    var birthday = bir.replace("年", '-').replace('月', '');

    //公司
    var companyName = " ";
    var companies = $(".workExperience").find("h2");
    if (companies != undefined) {
        $(companies).each(function () {
            var _this = $(this).html().split('&nbsp;&nbsp;')[1].replace(/<[^>].*?>/g, "");
            companyName += _this + "$";
        });
        companyName = companyName.trim();
    }
    

    //学校
    var schoolName = " ";
    var schoolTxt = $(".educationContent").html();
    if (schoolTxt != undefined) {
        //console.log(schoolTxt);
        var eduExp2Reg = /\d{4}\s*\.\s*\d{2,}\s*-\s*(?:至今|\d{4}\s*\.\s*\d{2,}\s*)\$.*?(?=\$)/g;
        var temp = schoolTxt.replace(/&nbsp;&nbsp;/g, '$');
        var eduExps = (temp + "").match(eduExp2Reg);
        var eduArr = (eduExps + "").split(',');
        for (var i = 0; i < eduArr.length; i++) {
            var _this = eduArr[eduArr.length - i - 1];
            var edu = _this.substring((_this.indexOf('$') + 1), (_this.length));
            schoolName += (edu + "$");
        }
    }
    

    //毕业年份
    var graduateYear = "";
    var tempGY = "";
    if (schoolTxt != undefined) {
        tempGY = $(".educationContent").html().trim().split("<br>");
        if (tempGY.length > 0) {
            if (tempGY[0] != "" && tempGY[0].length >= 17) {
                var tempG = tempGY[0].substr(10, 7);
                if (tempG.indexOf(".") >= 0) {
                    graduateYear = tempG.split('.')[0];
                }

            }
        }
    }
    

    //简历显示ID
    var identity = $('.resume-left-tips-id:eq(0)').text();
    identity = $('.resume-left-tips-id:eq(0)').text();
    identity = identity.substring(3, identity.length).trim();

    //手机号
    var summary = $('.summary-bottom').text().trim();
    var mobile = '';
    if (summary.indexOf('如需联系方式请下载该简历') >= 0) {
        mobile = "";
    } else {
        mobile = summary.substr(0, 11);
    }

    //邮箱
    var mail = $('.mail').text().trim();

    //手机号后四位（智联无）
    var mobileLast = "";

    //户籍
    var registry = "";

    //户籍$当前所在地$期望工作地
    var cities = "";
    if ($(".summary-top").html() != null) {
        if ($(".summary-top").html().split("<br>").length >= 2) {
            var placeArray = $(".summary-top").html().split("<br>")[1].trim().split('|');
            var placeLive = "$";//当前所在地
            var placeBorn = "$";//户籍
            for (var j = 0; j < placeArray.length; j++) {
                if (placeArray[j].indexOf("现居住地") >= 0) {
                    placeLive = GetProvinceLocation(placeArray[j].split('：')[1].split(" ")[0]) + placeLive;
                }
                if (placeArray[j].indexOf("户口") >= 0) {
                    placeBorn = GetProvinceLocation(placeArray[j].split('：')[1].split(" ")[0]) + placeBorn;
                }
            }
            registry = placeBorn;//户籍
            placeBorn = placeBorn + "$";
            var placeLike = "";//期望工作地
            var placeLikeArray = $(".resume-preview-top").find("tr").eq(0).find("td").eq(1).html().trim().split('、');
            for (var k = 0; k < placeLikeArray.length; k++) {
                placeLike = placeLike + placeLikeArray[k] + '$';
            }
            cities = placeLive + placeBorn + placeLike;
        }
    }

    /*
    *隐藏域抓取
    */
    var extraDatas = new ExtraData();
    extraDatas.extId = $("#extId").val();
    extraDatas.resumeId = $("#resume_id").val();
    extraDatas.resumeUserId = $("#resumeUserId").val();
    extraDatas.userName = $("#tt_username").val();

    vagueData.name = name;
    vagueData.birthday = birthday.trim();
    vagueData.cities = cities.trim();
    vagueData.company = companyName.trim();
    vagueData.email = mail;
    vagueData.extraDatas = extraDatas;
    vagueData.graduateYear = graduateYear;
    vagueData.identity = identity;
    vagueData.mobile = mobile;
    vagueData.mobileLast = mobileLast;
    vagueData.project = "";
    vagueData.registry = registry;
    vagueData.school = schoolName.trim();
    vagueData.sex = sex.trim();
    return vagueData;
}

function GetProvinceLocation(location) {
    if (location == null || location == undefined) {
        location = "";
    }
    var province = location.trim();
    if (location.indexOf("-") >= 0) {
        province = location.split('-')[0].trim();
    }
    return province;
}