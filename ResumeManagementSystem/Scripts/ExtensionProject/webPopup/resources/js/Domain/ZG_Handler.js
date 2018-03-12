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

var ZGHandler = function () {
    IHandler.apply(this);
};

ZGHandler.prototype = new IHandler();

ZGHandler.prototype.hasContactInfo = function () {
    var summary = $("#viewcontact").text();
    var hasContactInfo = (summary.indexOf('查看联系方式') < 0);
    console.log(hasContactInfo);
	return hasContactInfo;
};

ZGHandler.prototype.getContactInfo = function () {
    var strMobile, strEmail, strName, identity = '';
    
    var contentTxt = document.querySelectorAll(".common_box");
    var indexContact = -1;
    for (var l = 0; l < contentTxt.length; l++) {
        if (contentTxt[l].querySelector(".common_tit").innerText.trim().indexOf("联系方式") >= 0) {
            indexContact = l;
        }
    }
    if (indexContact != -1) {
        var tempContactDom = contentTxt[indexContact].querySelectorAll(".common_left");
        for (var n = 0; n < tempContactDom.length; n++) {
            if (tempContactDom[n].innerText.trim().indexOf("手机号码") >= 0) {
                //手机号码
                strMobile = $(tempContactDom[n]).next().text().trim();
            }
            if (tempContactDom[n].innerText.trim().indexOf("Email") >= 0) {
                //邮箱
                strEmail = $(tempContactDom[n]).next().text().trim();
            }
        }
    }
    if (strMobile === null || strMobile.length === 0 || strEmail === null || strEmail.length === 0) {
        throw new Error('102');
    }
    return GetSearchDataCommonZG();
};

ZGHandler.prototype.getDataForSearch = function () {
    return GetSearchDataCommonZG();
};

ZGHandler.prototype.getResumeId = function () {
    var identity = $('.resume_info_up').text().split('：')[1];
    return identity;
};

ZGHandler.prototype.getResumeShowId = function () {
    var identity = $('.resume_info_up').text().split('：')[1];
    return identity;
};

ZGHandler.prototype.uploadResume = function () {
    var resumeDetailModel = new RDM();

    var contentTxt = document.querySelectorAll(".common_box");
    var indexWork = -1;
    var indexSchool = -1;
    var indexWorkLike = -1;
    var indexProject = -1; 
    var indexPersonOther = -1;
    var indexSelfEvulation = -1;
    var indexContact = -1;
    var indexLanguage = -1;
    var indexCer = -1;
    var indexSki = -1;
    for (var l = 0; l < contentTxt.length; l++) {
        if (contentTxt[l].querySelector(".common_tit").innerText.trim().indexOf("求职意向") >= 0) {
            indexWorkLike = l;
        }
        if (contentTxt[l].querySelector(".common_tit").innerText.trim().indexOf("自我评价") >= 0) {
            indexSelfEvulation = l;
        }
        if (contentTxt[l].querySelector(".common_tit").innerText.trim().indexOf("技能专长") >= 0) {
            indexPersonOther = l;
        }
        if (contentTxt[l].querySelector(".common_tit").innerText.trim().indexOf("联系方式") >= 0) {
            indexContact = l;
        }
        if (contentTxt[l].querySelector(".common_tit").innerText.trim().indexOf("工作经历") >= 0) {
            indexWork = l;
        }
        if (contentTxt[l].querySelector(".common_tit").innerText.trim().indexOf("教育背景") >= 0) {
            indexSchool = l;
        }
        if (contentTxt[l].querySelector(".common_tit").innerText.trim().indexOf("项目经验") >= 0) {
            indexProject = l;
        }
        if (contentTxt[l].querySelector(".common_tit").innerText.trim().indexOf("语言能力") >= 0) {
            indexLanguage = l;
        }
        if (contentTxt[l].querySelector(".common_tit").innerText.trim().indexOf("获得证书") >= 0) {
            indexCer = l;
        }
        if (contentTxt[l].querySelector(".common_tit").innerText.trim().indexOf("专业技能") >= 0) {
            indexSki = l;
        }
    }

    //更新信息
    resumeDetailModel.update_info = new UpdateInfo();
    var tempUpdateTime = $(".resume_info_down").text().replace("最后更新时间：", "");
    resumeDetailModel.update_info.updated_at = tempUpdateTime;
    //个人信息
    resumeDetailModel.basic = new BaseInfo();
    //联系方式
    resumeDetailModel.contact = new Contact();
    if (indexContact != -1) {
        var tempContactDomA = contentTxt[indexContact].querySelectorAll(".common_left");
        for (var u = 0; u < tempContactDomA.length; u++) {
            if (tempContactDomA[u].innerText.trim().indexOf("手机号码") >= 0) {
                //手机号码
                resumeDetailModel.contact.phone = $(tempContactDomA[u]).next().text().trim();
            }
            if (tempContactDomA[u].innerText.trim().indexOf("Email") >= 0) {
                //邮箱
                resumeDetailModel.contact.email = $(tempContactDomA[u]).next().text().trim();
            }
            if (tempContactDomA[u].innerText.trim().indexOf("QQ") >= 0) {
                //QQ
                resumeDetailModel.contact.qq = $(tempContactDomA[u]).next().text().trim();
            } 
            if (tempContactDomA[u].innerText.trim().indexOf("通信地址") >= 0) {
                //家庭地址
                resumeDetailModel.basic.address = $(tempContactDomA[u]).next().text().trim();
            }
        }
    }

    //来源
    resumeDetailModel.src = ["0"];

    //更新时间
    resumeDetailModel.updated_at = tempUpdateTime;

    //简历ID（显示ID）
    resumeDetailModel.basic.id = $('.resume_info_up').text().split('：')[1];
    //姓名
    resumeDetailModel.basic.name = $('.jobseeker_name').text().trim().split('(')[0].trim();
    var personalInfoA = $(".jobseekerbaseinfo_con")[0].querySelectorAll(".field_fontsize");
    for (var i = 0; i < personalInfoA.length; i++) {
        var tempPersonalInfoAContent = personalInfoA[i].innerText.trim();
        //期望月薪最小值(单位 元/月)
        if (tempPersonalInfoAContent.indexOf("期望薪资") >= 0) {
            if (tempPersonalInfoAContent.indexOf("面议") < 0) {
                var tempRegSalary = /[1-9]\d*/;
                resumeDetailModel.basic.expect_salary_from = tempPersonalInfoAContent.match(tempRegSalary)[0];
            }
        }
        //工作经验
        if (tempPersonalInfoAContent.indexOf("工作经验") >= 0) {
            var tempRegExp = /^\d+\.\d/;
            resumeDetailModel.basic.work_experience = tempPersonalInfoAContent.match(tempRegExp)[0].split('.')[0];
        }
    }
    var personalInfoB = $(".jobseekerbaseinfo_con")[0].querySelectorAll(".field_left");
    for (var j = 0; j < personalInfoB.length; j++) {
        var tempPersonalInfoBContent = personalInfoB[j].innerText.trim();
        //性别 0-男 1-女 2-未知
        if (tempPersonalInfoBContent.indexOf("性别") >= 0) {
            if ($(personalInfoB[j]).next().text().indexOf("男") >= 0) {
                resumeDetailModel.basic.gender = "0";
            } else {
                if ($(personalInfoB[j]).next().text().indexOf("女") >= 0) {
                    resumeDetailModel.basic.gender = "1";
                } else {
                    resumeDetailModel.basic.gender = "2";
                }
            }
        }
        //年龄
        if (tempPersonalInfoBContent.indexOf("年龄") >= 0) {
            var tempRegAge = /[1-9]\d*/;
            resumeDetailModel.basic.age = $(personalInfoB[j]).next().text().match(tempRegAge)[0];
        }
        //婚姻
        if (tempPersonalInfoBContent.indexOf("婚否") >= 0) {
            if ($(personalInfoB[j]).next().text().indexOf("未婚") >= 0) {
                resumeDetailModel.basic.marital = "N";
            } else {
                if ($(personalInfoB[j]).next().text().indexOf("已婚") >= 0) {
                    resumeDetailModel.basic.marital = "Y";
                } else {
                    resumeDetailModel.basic.marital = "U";
                }
            }
        }
        //学历
        if (tempPersonalInfoBContent.indexOf("学历") >= 0) {
            resumeDetailModel.basic.degree = $(personalInfoB[j]).next().text().replace("学历：", "").trim();
        }
        ////语言信息
        //if (tempPersonalInfoBContent.indexOf("外语") >= 0 && indexLanguage != -1) {
        //    var tempLagInfo = new LanInfo();
        //    var tempLanArrary = $(personalInfoB[i]).next().html().trim().split('&nbsp;');
        //    for (var k = 0; k < tempLanArrary.length - 1; k++) {
        //        //语言类别
        //        tempLagInfo.name = tempLagInfo.name + tempLanArrary[k].trim();
        //    }
        //    //掌握程度
        //    tempLagInfo.level = tempLanArrary[tempLanArrary.length - 1];
        //    resumeDetailModel.language.push(tempLagInfo);
        //}
    }
    if (indexWorkLike != -1) {
        var tempWorkLikeDom = contentTxt[indexWorkLike].querySelectorAll(".common_left");
        for (var m = 0; m < tempWorkLikeDom.length; m++) {
            if (tempWorkLikeDom[m].innerText.trim().indexOf("意向行业") >= 0) {
                //期望从事行业
                resumeDetailModel.basic.expect_industry_name = $(tempWorkLikeDom[m]).next().text().trim();
            }
            if (tempWorkLikeDom[m].innerText.trim().indexOf("意向岗位") >= 0) {
                //期望从事职业
                resumeDetailModel.basic.expect_position_name = $(tempWorkLikeDom[m]).next().text().trim();
            }
            if (tempWorkLikeDom[m].innerText.trim().indexOf("意向地区") >= 0) {
                //期望工作地点
                resumeDetailModel.basic.expect_city_ids = GetProvinceLocation($(tempWorkLikeDom[m]).next().text().trim());
            }
            if (tempWorkLikeDom[m].innerText.trim().indexOf("可到岗时间") >= 0) {
                //到岗时间
                resumeDetailModel.basic.expect_work_at = $(tempWorkLikeDom[m]).next().text().trim();
            }
            if (tempWorkLikeDom[m].innerText.trim().indexOf("目前所在地") >= 0) {
                //现住地(省)
                resumeDetailModel.basic.address_province = GetProvinceLocation($(tempWorkLikeDom[m]).next().text().trim());
            }
        }
    }
    //自我评价
    if (indexSelfEvulation != -1) {
        resumeDetailModel.basic.self_remark = contentTxt[indexSelfEvulation].querySelector(".common_con").innerText.trim();
    }
    //其它信息（技能专长）
    if (indexPersonOther != -1) {
        resumeDetailModel.basic.other_info = contentTxt[indexPersonOther].querySelector(".common_con").innerText.trim();
    }
    if (indexContact != -1) {
        var tempContactDom = contentTxt[indexContact].querySelectorAll(".common_left");
        for (var n = 0; n < tempContactDom.length; n++) {
            if (tempContactDom[n].innerText.trim().indexOf("户口所在地") >= 0) {
                //户口所在地
                resumeDetailModel.basic.account_province = $(tempContactDom[n]).next().text().trim();
            }
            if (tempContactDom[n].innerText.trim().indexOf("目前所在地") >= 0) {
                //现住地
                resumeDetailModel.basic.address_province = $(tempContactDom[n]).next().text().trim();
            }
        }
    }
    //当前状态
    var tempStatusContent = $(".jobseeker_name").text();
    if (tempStatusContent.indexOf("(") >= 0) {
        resumeDetailModel.basic.current_status = tempStatusContent.split('(')[1].replace(')','').trim();;
    }
    

    //工作信息
    if (indexWork != -1) {
        var tempWorkDom = contentTxt[indexWork].querySelectorAll("table");
        for (var o = 0; o < tempWorkDom.length; o++) {
            if ($(tempWorkDom[o]).find("span").length != 0) {
                var tempWorkInfo = new WorkInfo();
                var tempCompanyTimeArry = $(tempWorkDom[o]).find("span")[2].innerText.trim().split("（")[0].trim().split("至");
                //开始时间
                tempWorkInfo.start_time = tempCompanyTimeArry[0].replace("/", "-");
                //结束时间
                tempWorkInfo.end_time = tempCompanyTimeArry[1].replace("/", "-");
                //是否至今
                if (tempWorkInfo.end_time == "今") {
                    tempWorkInfo.so_far = "Y";
                    tempWorkInfo.end_time = "";
                }
                //公司
                tempWorkInfo.corporation_name = $(tempWorkDom[o]).find("span")[0].innerText.trim();
                //行业
                if ($(tempWorkDom[o]).find("span")[4] != undefined) {
                    tempWorkInfo.industry_name = $(tempWorkDom[o]).find("span")[4].innerText.trim();
                }
                //岗位
                tempWorkInfo.position_name = $(tempWorkDom[o]).find("span")[1].innerText.trim();
                //当前薪资最小值(单位 K)
                if ($(tempWorkDom[o]).find("span")[3] != undefined) {
                    if ($(tempWorkDom[o]).find("span")[3].innerText.trim() != "保密") {
                        tempWorkInfo.basic_salary_from = $(tempWorkDom[o]).find("span")[3].innerText.trim().match(/[1-9]\d*/)[0];
                    }
                }
                //职责
                tempWorkInfo.responsibilities = tempWorkDom[o].querySelector(".work_experience_describe").innerText.trim();
                resumeDetailModel.work.push(tempWorkInfo);
            }
        }
    }

    //教育信息
    if (indexSchool != -1) {
        try {
            var tempSchoolDom = contentTxt[indexSchool].querySelector(".common_con").childNodes;
            for (var v = 0; v < tempSchoolDom.length; v++) {
                if ($(tempSchoolDom[v]).find("span").length > 0) {
                    var tempEduInfo = new EduInfo();
                    var tempSchoolTimeArray = $(tempSchoolDom[v]).find("span")[2].innerText.trim().split("至");
                    //开始时间
                    tempEduInfo.start_time = tempSchoolTimeArray[0].trim().replace("/", "-");
                    //结束时间
                    tempEduInfo.end_time = tempSchoolTimeArray[1].trim().replace("/", "-");
                    if (v == 0) {
                        resumeDetailModel.basic.graduate_date = tempEduInfo.end_time;
                    }
                    //是否至今
                    if (tempEduInfo.end_time == "今") {
                        tempEduInfo.so_far = "Y";
                        tempEduInfo.end_time = "";
                        tempEduInfo.end_time = "";
                    }
                    //学校
                    tempEduInfo.school_name = $(tempSchoolDom[v]).find("span")[0].innerText.trim();
                    if (v == 0) {
                        resumeDetailModel.basic.school = tempEduInfo.school_name;
                    }
                    //学历
                    tempEduInfo.degree = $(tempSchoolDom[v]).find("span")[1].innerText.trim();
                    //专业描述
                    tempEduInfo.discipline_desc = $(tempSchoolDom[v]).find(".work_experience_describe").text().trim();
                    //专业
                    tempEduInfo.discipline_name = tempSchoolDom[v].innerText.trim().replace($(tempSchoolDom[v]).find("span")[2].innerText.trim(), "").replace(tempEduInfo.school_name, "").replace(tempEduInfo.degree, "").replace($(tempSchoolDom[v]).find(".work_experience_describe")[0].innerText, "").trim();
                    resumeDetailModel.education.push(tempEduInfo);
                }
            }
            
        } catch (e) {

        }
    }

    //项目信息
    if (indexProject != -1) {
        var tempProjectDom = contentTxt[indexProject].querySelector(".common_con").childNodes;
        for (var p = 0; p < tempProjectDom.length; p++) {
            if ($(tempProjectDom[p]).find("span").length != 0) {
                var tempProInfo = new ProInfo();
                var tempProjectTimeArray = tempProjectDom[p].querySelector("table").querySelector("tr").querySelectorAll("td")[1].innerText.trim().split("至");
                //开始时间
                tempProInfo.start_time = tempProjectTimeArray[0].trim().replace("/", "-");
                //结束时间
                tempProInfo.end_time = tempProjectTimeArray[1].trim().replace("/", "-");
                //是否至今
                if (tempProInfo.end_time == "今") {
                    tempProInfo.so_far = "Y";
                    tempProInfo.end_time = "";
                }
                //项目名称
                tempProInfo.name = tempProjectDom[p].querySelector("table").querySelector("tr").querySelectorAll("td")[0].innerText.trim();
                var tempProDetailDom = tempProjectDom[p].querySelectorAll(".common_left");
                for (var q = 0; q < tempProDetailDom.length; q++) {
                    //软件环境
                    if (tempProDetailDom[q].innerText.trim().indexOf("软件环境") >= 0) {
                        tempProInfo.soft_env = $(tempProDetailDom[q]).next().text().trim();
                    }
                    //硬件环境
                    if (tempProDetailDom[q].innerText.trim().indexOf("硬件环境") >= 0) {
                        tempProInfo.hard_env = $(tempProDetailDom[q]).next().text().trim();
                    }
                    //开发工具
                    if (tempProDetailDom[q].innerText.trim().indexOf("开发工具") >= 0) {
                        tempProInfo.develop_tool = $(tempProDetailDom[q]).next().text().trim();
                    }
                    //职责描述
                    if (tempProDetailDom[q].innerText.trim().indexOf("项目职责") >= 0) {
                        tempProInfo.responsibilities = $(tempProDetailDom[q]).next().text().trim();
                    }
                    //项目描述
                    if (tempProDetailDom[q].innerText.trim().indexOf("项目描述") >= 0) {
                        tempProInfo.describe = $(tempProDetailDom[q]).next().text().trim();
                    }
                }
                resumeDetailModel.project.push(tempProInfo);
            }
        }
    }

    //语言信息
    if (resumeDetailModel.language.length == 0 && indexLanguage != -1) {
        var tempLanDom = document.querySelectorAll(".common_box")[indexLanguage].querySelectorAll("table");
        for (var r = 0; r < tempLanDom.length; r++) {
            if ($(tempLanDom[r]).find("span").length != 0) {
                var tempLagInfo = new LanInfo();
                //语言类别
                tempLagInfo.name = $(tempLanDom[r]).find("span")[0].innerText.trim();
                for (var s = 1; s < $(tempLanDom[r]).find("span").length; s++) {
                    //掌握程度
                    tempLagInfo.level = tempLagInfo.level + " " + $(tempLanDom[r]).find("span")[s].innerText.trim();
                }
                tempLagInfo.level = tempLagInfo.level.trim();
                resumeDetailModel.language.push(tempLagInfo);
            }
        }
    }

    //证书信息
    if (indexCer != -1) {
        var tempCerDom = document.querySelectorAll(".common_box")[indexCer].querySelectorAll("table");
        for (var t = 0; t < tempCerDom.length; t++) {
            if ($(tempCerDom[t]).find("span").length != 0) {
                var tempCerInfo = new CerInfo();
                //获得时间
                tempCerInfo.start_time = $(tempCerDom[t]).find("span")[1].innerText.trim().replace("/", "-");
                //证书名称
                tempCerInfo.name = $(tempCerDom[t]).find("span")[0].innerText.trim();
                resumeDetailModel.certificate.push(tempCerInfo);
            }
        }
    }

    //技能信息
    if (indexSki != -1) {
        var tempSkiDom = document.querySelectorAll(".common_box")[7].querySelectorAll("table");
        for (var k = 0; k < tempSkiDom.length; k++) {
            if (tempSkiDom[k].querySelectorAll("span").length != 0) {
                var tempSkiInfo = new SkiInfo();
                //名称
                tempSkiInfo.name = tempSkiDom[k].querySelectorAll("span")[1].innerText.trim();
                //使用时间
                tempSkiInfo.period = tempSkiDom[k].querySelectorAll("span")[2].innerText.trim().replace("个月", "");
                if (tempSkiDom[k].querySelectorAll("span").length >= 4) {
                    //掌握程度
                    tempSkiInfo.level = tempSkiDom[k].querySelectorAll("span")[3].innerText.trim();
                }
                resumeDetailModel.skill.push(tempSkiInfo);
            }
        }
    }

    return resumeDetailModel;
}

function GetSearchDataCommonZG() {
    var vagueData = new VagueData();

    /*
    *简历信息抓取
    */

    //姓名
    var name = $('.jobseeker_name').text().trim().split('(')[0].trim();
    if (name.indexOf("隐藏姓名") >= 0) {
        name = "";
    }

    //性别
    var sex = "";

    //生日
    var birthday = "";

    var indexPerson = 0;
    var tempPerson = $('.jobseekerbaseinfo_box').find(".field_parent").find("td");
    $('.jobseekerbaseinfo_box').find(".field_parent").find("td").each(function () {
        if ($(this).text().trim() == "性别：") {
            sex = tempPerson.eq(indexPerson + 1).text().trim();
        }
        indexPerson++;
    });

    //学校和毕业年份和工作经验
    var companyName = "";//公司名称
    var schoolName = "";//学校
    var graduateYear = "";//毕业年份
    var workIndex = -1;
    var eduIndex = -1;
    var workGetIndex = -1;
    var workContent;
    for (var j = 0; j < $(".common_box .common_tit").length; j++) {
        if ($(".common_box .common_tit")[j].innerText.trim() == "工作经历") {
            workIndex = j;
        }
        if ($(".common_box .common_tit")[j].innerText.trim() == "教育背景") {
            eduIndex = j;
        }
        if ($(".common_box .common_tit")[j].innerText.trim() == "求职意向") {
            workGetIndex = j;
        }
    }
    if (workIndex > -1) {
        workContent = $(".common_box")[workIndex].getElementsByClassName("work_experience");//$(".work_experience");
        for (var i = 0; i < workContent.length; i++) {
            companyName = (companyName + workContent[i].children[0].children[0].innerHTML + "$");
        }
    }

    var eduI = 0;
    if (eduIndex > -1) {
        var eduContent = $(".common_box")[eduIndex].getElementsByClassName("work_experience");
        for (var k = 0; k < eduContent.length; k++) {
            schoolName = (schoolName + eduContent[k].children[0].children[0].innerHTML + "$");
            if (eduI == 0) {
                var tempEdu = $(".common_box")[eduIndex].getElementsByClassName("work_experience")[0].children[2].innerHTML.split('至')[1];
                if (tempEdu.indexOf("/")) {
                    graduateYear = tempEdu.split('/')[0];
                }
            }
            eduI++;
        }
    }

    //简历显示ID
    var identity = "";
    identity = $('.resume_info_up').text().split('：')[1];

    var temp = $('.common_box:eq(1)');
    //手机号
    var mobile = temp.find('table>tbody>tr:eq(0)>.common_right_l').text().trim();
    if (mobile === '')
        mobile = temp.find('table>tbody>tr:eq(2)>.common_right_l').text().trim();

    //邮箱
    var mail = temp.find('table>tbody>tr:eq(3)>.common_right_l').text().trim();

    //手机号后四位（猎聘无）
    var mobileLast = "";

    //户籍
    var registry = "";

    //户籍$当前所在地$期望工作地
    var cities = registry + "$" + "" + "$";
    var placeExpect = "";
    var placeIndex = -1;
    var indexP = 0;
    if (workGetIndex > -1) {
        $(".common_con").eq(workGetIndex).find("td").each(function () {
            if ($(this).text().trim() == "意向地区：") {
                placeIndex = indexP;
            }
            indexP++;
        });
    }
    if (placeIndex > -1) {
        placeExpect = GetProvinceLocation($(".common_con").eq(workGetIndex).find("td").eq(placeIndex + 1).text().trim());
    }
    cities = cities + placeExpect;

    /*
    *隐藏域抓取
    */
    var extraDatas = new ExtraData();
    extraDatas.extId = "";
    extraDatas.resumeId = "";
    extraDatas.resumeUserId = "";
    extraDatas.userName = "";

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