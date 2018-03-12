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

var LPHandler = function () {
    IHandler.apply(this);
};

LPHandler.prototype = new IHandler();

LPHandler.prototype.hasContactInfo = function () {
    var summary = $(".col").eq(2).text().replace("已验证", "").trim();
    var hasContactInfo = (summary.indexOf('******') < 0);
	return hasContactInfo;
};

LPHandler.prototype.getContactInfo = function () {
	var strMobile = $(".col").eq(2).text().replace("已验证", "").trim();
	var strEmail = $(".col").eq(4).text().replace("已验证", "").trim();
	if(strMobile === null || strMobile.length === 0 || strEmail === null || strEmail.length === 0)
	    throw new Error('102');
	return GetSearchDataCommonLP();
};

LPHandler.prototype.getDataForSearch = function () {
    return GetSearchDataCommonLP();
};

LPHandler.prototype.getResumeId = function () {
    var identity = $('.more span').eq(0).text().split('|')[0].trim().split('：')[1];
    return identity;
};

LPHandler.prototype.getResumeShowId = function () {
    var identity = $('.more span').eq(0).text().split('|')[0].trim().split('：')[1];
    return identity;
};

LPHandler.prototype.uploadResume = function () {
    var resumeDetailModel = new RDM();

    //更新信息
    resumeDetailModel.update_info = new UpdateInfo();
    var tempUpdateTime = $(".submenu").find(".more span")[0].innerText.trim().split("最新登录：")[1];
    resumeDetailModel.update_info.updated_at = tempUpdateTime;

    //联系方式
    resumeDetailModel.contact = new Contact();
    //邮箱
    var mail = $(".col").eq(4).text().replace("已验证", "").trim();
    if (mail.indexOf("*") >= 0) {
        mail = "";
    }
    resumeDetailModel.contact.email = mail;
    //手机号
    var mobile = $(".col").eq(2).text().replace("已验证", "").trim();
    if (mobile.indexOf("*") >= 0) {
        mobile = "";
    }
    resumeDetailModel.contact.phone = mobile;

    //来源
    resumeDetailModel.src = ["0"];

    //更新时间
    resumeDetailModel.updated_at = tempUpdateTime;

    //个人信息
    resumeDetailModel.basic = new BaseInfo();
    //简历ID（显示ID）
    resumeDetailModel.basic.id = $('.more span').eq(0).text().split('|')[0].trim().split('：')[1];
    //姓名
    resumeDetailModel.basic.name = $(".col").eq(0).text().replace("已验证", "").trim();
    if (resumeDetailModel.basic.name.indexOf("*") >= 0) {
        resumeDetailModel.basic.name = "";
    }
    var indexBaseInfo = -1;
    var indexNowInfo = -1;
    var indexFutureInfo = -1;
    var indexProject = -1;
    var indexSchool = -1;
    var indexLanguage = -1;
    var indexPersonOther = -1;
    var indexSelfEvu = -1;
    var indexSkiInfo = -1;
    var basePersonDom = $(".user-data");
    for (var i = 0; i < basePersonDom.length; i++) {
        if ($(basePersonDom[i]).find("dt").length == 0) {
            indexBaseInfo = i;
        }
        if ($(basePersonDom[i]).find("dt").text().trim().indexOf("目前职业概况") >= 0) {
            indexNowInfo = i;
        }
        if ($(basePersonDom[i]).find("dt").text().trim().indexOf("职业发展意向") >= 0) {
            indexFutureInfo = i;
        }
    }
    var detailPersonDom = $(".title");
    for (var o = 0; o < detailPersonDom.length; o++) {
        if (detailPersonDom[o].innerText.trim().indexOf("项目经历") >= 0) {
            indexProject = o;
        }
        if (detailPersonDom[o].innerText.trim().indexOf("教育经历") >= 0) {
            indexSchool = o;
        }
        if (detailPersonDom[o].innerText.trim().indexOf("语言能力") >= 0) {
            indexLanguage = o;
        }
        if (detailPersonDom[o].innerText.trim().indexOf("自我评价") >= 0) {
            indexSelfEvu = o;
        }
        if (detailPersonDom[o].innerText.trim().indexOf("附加信息") >= 0) {
            indexPersonOther = o;
        }
        if (detailPersonDom[o].innerText.trim().indexOf("技能认证") >= 0) {
            indexSkiInfo = o;
        }
    }
    if (indexBaseInfo != -1) {
        var baseInfoDom = $(basePersonDom[indexBaseInfo]).find("dd");
        for (var j = 0; j < baseInfoDom.length; j++) {
            //性别
            if (baseInfoDom[j].querySelector("label").innerText.indexOf("性别") >= 0) {
                var sexLP = baseInfoDom[j].querySelector(".col").innerText.trim();
                if (sexLP.indexOf("男") >= 0) {
                    resumeDetailModel.basic.gender = "0";
                } else {
                    if (sexLP.indexOf("女") >= 0) {
                        resumeDetailModel.basic.gender = "1";
                    } else {
                        resumeDetailModel.basic.gender = "2";
                    }
                }
            }
            //国籍
            if (baseInfoDom[j].querySelector("label").innerText.indexOf("国籍") >= 0) {
                resumeDetailModel.basic.nation = baseInfoDom[j].querySelector(".col").innerText.trim();
            }
            //户口所在地（省）
            if (baseInfoDom[j].querySelector("label").innerText.indexOf("户籍") >= 0) {
                resumeDetailModel.basic.account_province = GetProvinceLocation(baseInfoDom[j].querySelector(".col").innerText.trim());
            }
            //工作经验
            if (baseInfoDom[j].querySelector("label").innerText.indexOf("工作年限") >= 0) {
                resumeDetailModel.basic.work_experience = baseInfoDom[j].querySelector(".col").innerText.replace("年", "").trim();
            }
            //年龄
            if (baseInfoDom[j].querySelector("label").innerText.indexOf("年龄") >= 0) {
                resumeDetailModel.basic.age = baseInfoDom[j].querySelector(".col").innerText.replace("岁", "").trim();
            }
            //学历
            if (baseInfoDom[j].querySelector("label").innerText.indexOf("教育程度") >= 0) {
                resumeDetailModel.basic.degree = baseInfoDom[j].querySelector(".col").innerText.trim();
            }
            //婚姻状况(Y：已婚；N：未婚；U：未知)
            if (baseInfoDom[j].querySelector("label").innerText.indexOf("婚姻状况") >= 0) {
                var tempMarryInfo = baseInfoDom[j].querySelector(".col").innerText.trim();
                if (tempMarryInfo == "已婚") {
                    resumeDetailModel.basic.marital = "Y";
                }else if (tempMarryInfo == "未婚") {
                    resumeDetailModel.basic.marital = "N";
                } else {
                    resumeDetailModel.basic.marital = "U";
                }
            }
            //当前状态
            if (baseInfoDom[j].querySelector("label").innerText.indexOf("职业状态") >= 0) {
                var tempStatus = baseInfoDom[j].querySelector(".col").innerText.trim();
                resumeDetailModel.basic.current_status = tempStatus;
            }
            //现住地(省)
            if (baseInfoDom[j].querySelector("label").innerText.indexOf("所在地") >= 0) {
                resumeDetailModel.basic.address_province = GetProvinceLocation(baseInfoDom[j].querySelector(".col").innerText.trim());
            }
        }
        //自我评价
        if (indexSelfEvu != -1) {
            resumeDetailModel.basic.self_remark = detailPersonDom.eq(indexSelfEvu).next().text().trim();
        }
        //附加信息
        if (indexPersonOther!=-1) {
            resumeDetailModel.basic.other_info = detailPersonDom.eq(indexPersonOther).next().text().trim();
        }
    }
    if (indexFutureInfo != -1) {
        var futureInfoDom = $(basePersonDom[indexFutureInfo]).find("dd");
        for (var k = 0; k < futureInfoDom.length; k++) {
            //期望从事行业
            if (futureInfoDom[k].querySelector("label").innerText.indexOf("期望行业") >= 0) {
                resumeDetailModel.basic.expect_industry_name = futureInfoDom[k].querySelector(".col").innerText.trim();
            }
            //期望从事职业
            if (futureInfoDom[k].querySelector("label").innerText.indexOf("期望职位") >= 0) {
                resumeDetailModel.basic.expect_position_name = futureInfoDom[k].querySelector(".col").innerText.trim();
            }
            //期望年薪最大值(单位 元/年)
            if (futureInfoDom[k].querySelector("label").innerText.indexOf("期望年薪") >= 0) {
                var tempSalaryYearInfo = futureInfoDom[k].querySelector(".col").innerText.replace("万", "").trim();
                if (tempSalaryYearInfo != "面议") {
                    resumeDetailModel.basic.expect_annual_salary_to = tempSalaryYearInfo * 10;
                }
            }
            //期望工作地点
            if (futureInfoDom[k].querySelector("label").innerText.indexOf("期望地点") >= 0) {
                resumeDetailModel.basic.expect_city_ids = futureInfoDom[k].querySelector(".col").innerText.trim();
            }
        }
    }

    //工作信息
    var workInfoDom = document.querySelector("#workexp_anchor").querySelector(".exp").children;
    for (var l = 0; l < workInfoDom.length; l++) {
        var tempWorkInfo = new WorkInfo();

        var tempCompanyDom = document.querySelector("#workexp_anchor").querySelector(".exp").children[l];
        var tempCompanyTimeArry = tempCompanyDom.querySelector(".times").innerText.trim().split("-");
        //开始时间
        tempWorkInfo.start_time = tempCompanyTimeArry[0].replace("/", "-").trim();
        //结束时间
        tempWorkInfo.end_time = tempCompanyTimeArry[1].replace("/", "-").trim();
        //是否至今
        if (tempWorkInfo.end_time == "至今") {
            tempWorkInfo.so_far = "Y";
            tempWorkInfo.end_time = "";
        }
        //公司
        tempWorkInfo.corporation_name = tempCompanyDom.querySelector(".section-content").innerText.trim().split(' ')[0].trim();
        var tempComInfoDom = tempCompanyDom.querySelectorAll(".comp-info");
        for (var m = 0; m < tempComInfoDom.length; m++) {
            //公司性质
            if (tempComInfoDom[m].querySelector("label").innerText.indexOf("公司性质") >= 0) {
                tempWorkInfo.corporation_type = tempComInfoDom[m].innerText.split('：')[1].trim();
            }
            //规模
            if (tempComInfoDom[m].querySelector("label").innerText.indexOf("公司规模") >= 0) {
                tempWorkInfo.scale = tempComInfoDom[m].innerText.split('：')[1].trim();
            }
            //行业
            if (tempComInfoDom[m].querySelector("label").innerText.indexOf("公司行业") >= 0) {
                tempWorkInfo.industry_name = tempComInfoDom[m].innerText.split('：')[1].trim();
            }
            //公司描述
            if (tempComInfoDom[m].querySelector("label").innerText.indexOf("公司描述") >= 0) {
                tempWorkInfo.corporation_desc = tempComInfoDom[m].innerText.split('：')[1].trim();
            }
        }
        //岗位
        tempWorkInfo.position_name = tempCompanyDom.querySelector("h5").innerText.trim();
        var tempWorkInfoDom = tempCompanyDom.querySelectorAll("table")[1].querySelectorAll("tr");
        for (var n = 0; n < tempWorkInfoDom.length; n++) {
            //工作地点
            if (tempWorkInfoDom[n].innerText.indexOf("工作地点") >= 0) {
                tempWorkInfo.city = tempWorkInfoDom[n].innerText.split('：')[1].trim();
            }
            //下属人数
            if (tempWorkInfoDom[n].innerText.indexOf("下属人数") >= 0) {
                tempWorkInfo.subordinates_count = tempWorkInfoDom[n].innerText.split('：')[1].trim();
                if (tempWorkInfo.subordinates_count != "0") {
                    //是否有管理经验(Y：有；N：无；未知：U)
                    tempWorkInfo.management_experience = "Y";
                }
            }
            //职责
            if (tempWorkInfoDom[n].innerText.indexOf("职责业绩") >= 0) {
                tempWorkInfo.responsibilities = tempWorkInfoDom[n].innerText.split('：')[1].trim();
            }
        }
        resumeDetailModel.work.push(tempWorkInfo);
    }

    //教育信息
    if (indexSchool != -1) {
        var schoolDom = detailPersonDom.eq(indexSchool).next().find("tr");
        for (var p = 0; p < schoolDom.length; p++) {
            var tempEduInfo = new EduInfo();
            var schoolInfoDom = schoolDom[p].querySelectorAll("td");
            tempEduInfo.school_name = schoolInfoDom[0].querySelector("span").innerText.trim();
            var tempSchoolTimeArray = schoolInfoDom[0].innerText.replace(tempEduInfo.school_name, "").split("–");
            //开始时间
            tempEduInfo.start_time = tempSchoolTimeArray[0].trim().replace("/", "-");
            //结束时间
            tempEduInfo.end_time = tempSchoolTimeArray[1].trim().replace("/", "-");
            if (p == 0) {
                resumeDetailModel.basic.graduate_date = tempEduInfo.end_time;
                resumeDetailModel.basic.school = tempEduInfo.school_name;
            }
            //是否至今
            if (tempEduInfo.end_time == "至今") {
                tempEduInfo.so_far = "Y";
                tempEduInfo.end_time = "";
                resumeDetailModel.basic.graduate_date = "";
            }
            for (var q = 1; q < schoolInfoDom.length; q++) {
                if (schoolInfoDom[q].innerText.indexOf("专业：") >= 0) {
                    //专业
                    tempEduInfo.discipline_name = schoolInfoDom[q].querySelector(".filter-zone").innerText.trim();
                }
                if (schoolInfoDom[q].innerText.indexOf("学历：") >= 0) {
                    //学历
                    tempEduInfo.degree = schoolInfoDom[q].querySelector(".filter-zone").innerText.trim();
                }
            }
            resumeDetailModel.education.push(tempEduInfo);
        }
    }

    //语言信息
    if (indexLanguage != -1) {
        var languageDom = detailPersonDom.eq(indexLanguage).next().find("p");
        for (var r = 0; r < languageDom.length; r++) {
            var tempLagInfo = new LanInfo();
            //语言类别
            tempLagInfo.name = languageDom[r].innerText.trim();
            resumeDetailModel.language.push(tempLagInfo);
        }
    }
    
    //项目信息
    if (indexProject != -1) {
        var projectDom = detailPersonDom.eq(indexProject).next().children();
        for (var s = 0; s < projectDom.length; s++) {
            var tempProInfo = new ProInfo();
            var tempProjectTimeArrary = $(projectDom[s]).find(".times")[0].innerText.split("–");
            //开始时间
            tempProInfo.start_time = tempProjectTimeArrary[0].trim().replace("/", "-");
            //结束时间
            tempProInfo.end_time = tempProjectTimeArrary[1].trim().replace("/", "-");
            //是否至今
            if (tempProInfo.end_time == "至今") {
                tempProInfo.so_far = "Y";
                tempProInfo.end_time = "";
            }
            var tempProjectDetail = $(projectDom[s]).find("table").find("th");
            //项目名称
            tempProInfo.name = tempProjectDetail[0].innerText.trim();
            for (var t = 1; t < tempProjectDetail.length; t++) {
                if (tempProjectDetail[t].innerText.trim().indexOf("项目简介") >= 0) {
                    //项目描述
                    tempProInfo.describe = $(tempProjectDetail[t]).next().text().trim();
                }
                if (tempProjectDetail[t].innerText.trim().indexOf("项目职责") >= 0) {
                    //职责描述
                    tempProInfo.responsibilities = $(tempProjectDetail[t]).next().text().trim();
                }
            }
            resumeDetailModel.project.push(tempProInfo);
        }
    }

    //技能信息
    if (indexSkiInfo != -1) {
        var skillDom = detailPersonDom.eq(indexSkiInfo).next().find("td");
        for (var u = 0; u < skillDom.length; u++) {
            var tempSkiInfo = new SkiInfo();
            //名称
            tempSkiInfo.name = skillDom[u].querySelector("var").innerText.trim();
            resumeDetailModel.skill.push(tempSkiInfo);
        }
    }
    return resumeDetailModel;
}

function GetSearchDataCommonLP() {
    var vagueData = new VagueData();

    /*
    *简历信息抓取
    */

    //姓名
    var name = $(".col").eq(0).text().replace("已验证", "").trim();
    if (name.indexOf("*") >= 0) {
        name = "";
    }

    //性别
    var sex = $(".col").eq(1).text().replace("已验证", "").trim();
    if (sex.length > 0) {
        vagueData.sex = sex;
    }

    //生日
    var birthday = "";

    //学校和毕业年份
    var graduateYear = "";//毕业年份
    var school = "";//学校
    var index;
    var ischoolIndex = 0;
    $('.board').children().each(function () {
        if ($(this).text().trim() == "教育经历") {
            index = ischoolIndex;
        }
        ischoolIndex = ischoolIndex + 1;
    });
    index = index + 1;
    var gyInd = 0;
    $('.board').children().eq(index).find("tr").each(function () {
        var temp = $(this).find("td").eq(0).text().trim();
        var replaceWord = $(this).find("td").eq(0).find(".filter-zone").text().trim();
        school = school + replaceWord + "$";
        if (gyInd == 0) {
            if (temp.replace(replaceWord, "").split("–")[1].indexOf("/") >= 0) {
                graduateYear = temp.replace(replaceWord, "").split("–")[1].split('/')[0];
            }
        }
        gyInd++;
    });

    //公司
    var company = "";
    var companyList = $(".section-content");
    for (var i = 0; i < companyList.length; i++) {
        if (companyList[i].className == "section-content filter-zone") {
            company = company + $(".section-content").eq(i).text().split(" ")[0] + "$";
        }
    }

    //简历显示ID
    var identity = "";
    var identityContent = "";
    identityContent = $('.more span').eq(0).text().split('|')[0].trim().split('：')[1];
    identity = identityContent;
    vagueData.identity = identity;

    //手机号
    var mobile = $(".col").eq(2).text().replace("已验证", "").trim();
    if (mobile.indexOf("*") >= 0) {
        mobile = "";
    }

    //邮箱
    var mail = $(".col").eq(4).text().replace("已验证", "").trim();
    if (mail.indexOf("*") >= 0) {
        mail = "";
    }

    //手机号后四位（猎聘无）
    var mobileLast = "";

    //户籍
    var registry = GetProvinceLocation($(".col").eq(11).text().trim());

    //户籍$当前所在地$期望工作地
    var cities = registry + "$" + $(".col").eq(9).text().trim() + "$";
    var expectLocationIndex = 0;
    var indexTemp = -1;
    $(".user-data").find("dd").each(function () {
        if ($(this).find("label").text().trim() == "期望地点：") {
            expectLocationIndex = indexTemp;
        }
        indexTemp++;
    });
    if (indexTemp != -1) {
        cities = cities + $(".user-data").find("dd").eq(expectLocationIndex+1).text().trim().split('：')[1].trim();
    }

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
    vagueData.company = company.trim();
    vagueData.email = mail;
    vagueData.extraDatas = extraDatas;
    vagueData.graduateYear = graduateYear;
    vagueData.identity = identity;
    vagueData.mobile = mobile;
    vagueData.mobileLast = mobileLast;
    vagueData.project = "";
    vagueData.registry = registry;
    vagueData.school = school.trim();
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
