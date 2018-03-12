/// <reference path="global.js" />
function VagueData() {
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

var TCHandler = function () {
    IHandler.apply(this);
};

TCHandler.prototype = new IHandler();

TCHandler.prototype.hasContactInfo = function () {
    var hasContactInfo = false;
    if ($("#getContact").text().indexOf("查看联系方式") < 0 && $(".tel-pwd").length == 0) {
        hasContactInfo = true;
    }
    return hasContactInfo;
};

TCHandler.prototype.getContactInfo = function () {
    var strMobile = $(".real-mobile").text().trim();
    var strEmail = "";
    if (strMobile == "" && strEmail == "")
        throw new Error('102');
	return GetSearchDataCommonTC();
};

TCHandler.prototype.getDataForSearch = function () {
    return GetSearchDataCommonTC();
};

TCHandler.prototype.getResumeId = function () {
    var identity = "";//(document.location.href.split('dpid')[1]).split("&")[0].replace("=", "").trim();
    return identity;
};

TCHandler.prototype.getResumeShowId = function () {
    var identity = "";//(document.location.href.split('dpid')[1]).split("&")[0].replace("=", "").trim();
    return identity;
};

TCHandler.prototype.uploadResume = function () {
    var resumeDetailModel = new RDM();

    //联系方式
    resumeDetailModel.contact = new Contact();
    var phone = $(".real-mobile").text().trim();
    resumeDetailModel.contact.phone = phone;

    //来源
    resumeDetailModel.src = ["0"];

    //个人信息
    resumeDetailModel.basic = new BaseInfo();
    //简历ID（显示ID）
    resumeDetailModel.basic.id = "";//(document.location.href.split('dpid')[1]).split("&")[0].replace("=", "").trim();
    //姓名
    resumeDetailModel.basic.name = $("#name").text().trim();
    var sexTC = $(".sex").text().trim();
    if (sexTC.indexOf("男") >= 0) {
        resumeDetailModel.basic.gender = "0";
    } else {
        if (sexTC.indexOf("女") >= 0) {
            resumeDetailModel.basic.gender = "1";
        } else {
            resumeDetailModel.basic.gender = "2";
        }
    }
    //年龄
    resumeDetailModel.basic.age = $(".age").text().replace("岁", "");
    //学历
    resumeDetailModel.basic.degree = $(".edu").text();
    var basicDomTC = $(".base-detail").find("span");
    for (var i = 0; i < basicDomTC.length; i++) {
        if (basicDomTC[i].innerText.trim() != "") {
            if (basicDomTC[i].innerText.trim().indexOf("年工作经验") >= 0) {
                //工作经验
                resumeDetailModel.basic.work_experience = basicDomTC[i].innerText.trim().replace("年工作经验", "");
            }
            if (basicDomTC[i].innerText.trim().indexOf("现居") >= 0) {
                //现住地
                resumeDetailModel.basic.address_province = basicDomTC[i].innerText.trim().replace("现居", "");
            }
        }
    }
    //当前状态
    resumeDetailModel.basic.current_status = $("#Job-status").text().trim();
    //期望工作地点
    resumeDetailModel.basic.expect_city_ids = $("#expectLocation").text().trim();
    //期望从事职业
    resumeDetailModel.basic.expect_position_name = $("#expectJob").text().trim();
    //自我评价
    resumeDetailModel.basic.self_remark = $(".aboutMe").find(".edu-detail").text().trim();

    //工作信息
    if ($(".work").length > 0) {
        var tempCompanyDom = $(".work")[0].querySelectorAll(".experience-detail");
        for (var j = 0; j < tempCompanyDom.length; j++) {
            var tempWorkInfo = new WorkInfo();
            //公司
            tempWorkInfo.corporation_name = tempCompanyDom[j].querySelector(".itemName").innerText.trim();
            var itemWorkDom = tempCompanyDom[j].querySelectorAll("p");
            for (var k = 0; k < itemWorkDom.length; k++) {
                if (itemWorkDom[k].innerText.indexOf("工作时间") >= 0) {
                    var tempWorkTime = itemWorkDom[k].innerText.trim().replace("工作时间：", "").split('-');
                    //开始时间
                    tempWorkInfo.start_time = tempWorkTime[0].replace("年", "-").replace("月", "");
                    //结束时间
                    tempWorkInfo.end_time = tempWorkTime[1].split('（')[0].replace("年", "-").replace("月", "");
                }
                //岗位
                if (itemWorkDom[k].innerText.indexOf("在职职位") >= 0) {
                    tempWorkInfo.position_name = itemWorkDom[k].innerText.trim().replace("在职职位：", "");
                }
                //职责
                if (itemWorkDom[k].innerText.indexOf("工作职责") >= 0) {
                    tempWorkInfo.responsibilities = itemWorkDom[k].innerText.trim().replace("工作职责：", "");
                }
            }
            resumeDetailModel.work.push(tempWorkInfo);
        }
    }
    
    //教育信息
    if ($(".education").length > 0) {
        var tempSchoolDom = $(".education")[0].querySelectorAll(".edu-detail");
        for (var l = 0; l < tempSchoolDom.length; l++) {
            var tempEduInfo = new EduInfo();
            //学校
            tempEduInfo.school_name = tempSchoolDom[l].querySelector(".college-name").innerText.trim();
            //专业
            tempEduInfo.discipline_name = tempSchoolDom[l].querySelector(".professional").innerText.trim();
            //结束时间
            tempEduInfo.end_time = tempSchoolDom[l].querySelector(".graduate-time").innerText.trim().replace("年", "-").replace("月毕业","");
            if (l == 0) {
                //basic毕业院校
                resumeDetailModel.basic.school = tempEduInfo.school_name;
                //basic毕业时间
                resumeDetailModel.basic.graduate_date = tempEduInfo.end_time;
            }
            resumeDetailModel.education.push(tempEduInfo);
        }
    }

    //语言信息
    if ($(".language").length > 0) {
        var tempLagDom = document.querySelectorAll(".language");
        for (var m = 0; m < tempLagDom.length; m++) {
            var tempLagInfo = new LanInfo();
            //语言类别
            tempLagInfo.name = tempLagDom[m].innerText.trim().split("：")[0];
            //掌握程度
            tempLagInfo.level = tempLagDom[m].innerText.trim().split("：")[1];
            resumeDetailModel.language.push(tempLagInfo);
        }
    }

    //证书信息
    if (document.querySelector(".medal") != null) {
        var tempCerDom = document.querySelector(".medal").querySelectorAll(".certificate-item");
        for (var n = 0; n < tempCerDom.length; n++) {
            var tempCerInfo = new CerInfo();
            //获得时间
            if (tempCerDom[n].querySelector(".certificate-time") != null) {
                tempCerInfo.start_time = tempCerDom[n].querySelector(".certificate-time").innerText.trim().replace("年", "-").replace("月", "");
            }
            //证书名称
            tempCerInfo.name = tempCerDom[n].querySelector(".certificate-name").innerText.trim();
            resumeDetailModel.certificate.push(tempCerInfo);
        }
    }

    //技能信息
    if (document.querySelector(".skillList")!=null) {
        var tempSkiDom = document.querySelector(".skillList").querySelectorAll(".certificate-item");
        for (var o = 0; o < tempSkiDom.length; o++) {
            var tempSkiInfo = new SkiInfo();
            //名称
            tempSkiInfo.name = tempSkiDom[o].querySelector(".skill-name").innerText.trim();
            //掌握程度
            tempSkiInfo.level = tempSkiDom[o].querySelector(".skill-degree").split("（")[0].trim();
            //使用时间
            tempSkiInfo.period = tempSkiDom[o].querySelector(".skill-degree").split("（")[1].replace("）", "").trim();
            resumeDetailModel.skill.push(tempSkiInfo);
        }
    }
    
    //项目经验
    if (document.querySelector(".project") != null) {
        var tempProDom = document.querySelector(".project").querySelectorAll(".experience-detail");
        for (var p = 0; p < tempProDom.length; p++) {
            var tempProInfo = new ProInfo();
            //开始时间
            tempProInfo.start_time = tempProDom[p].querySelector("p").innerText.replace("项目时间：", "").split("-")[0].replace("年", "-").replace("月", "").trim();
            //结束时间
            tempProInfo.end_time = tempProDom[p].querySelector("p").innerText.replace("项目时间：", "").split("-")[1].replace("年", "-").replace("月", "").trim();
            //是否至今
            if (tempProInfo.end_time == "至今") {
                tempProInfo.so_far = "Y";
                tempProInfo.end_time = "";
            }
            //项目名称
            tempProInfo.name = tempProDom[p].querySelector(".itemName").innerText.trim();
            var tempProContentDom = tempProDom[p].querySelectorAll(".title-content");
            for (var q = 0; q < tempProContentDom.length; q++) {
                if (tempProContentDom[q].querySelector(".item-title").innerText.indexOf("项目简介") >= 0) {
                    //项目描述
                    tempProInfo.describe = tempProContentDom[q].querySelector(".item-content").innerText.trim();
                }
                if (tempProContentDom[q].querySelector(".item-title").innerText.indexOf("项目业绩") >= 0) {
                    //职责描述
                    tempProInfo.responsibilities = tempProContentDom[q].querySelector(".item-content").innerText.trim();
                }
            }
            resumeDetailModel.project.push(tempProInfo);
        }
    }

    return resumeDetailModel;
}

function GetSearchDataCommonTC() {
    var vagueData = new VagueData();
    var wordReg = /[\u4e00-\u9fa5]/;

    /*
    *简历信息抓取
    */

    //姓名
    var name = $("#name").text().trim();
    var nameFlag = true;
    for (var p = 0; p < name.length; p++) {
        if (!wordReg.test(name[p])) {
            nameFlag = false;
        }
    }
    if (!nameFlag) {
        name = "";
    }

    //性别
    var sex = $(".sex").text().trim();

    //简历显示ID
    var identity = "";//(document.location.href.split('/?')[0]).split("_")[2].trim();

    //户籍$当前所在地$期望工作地
    var cities = "";
    var placeLive = "";//当前所在地
    var placeBorn = "";//户籍
    var placeLike = $("#expectLocation").text().trim();//期望工作地
    var placeLikeFlag = true;
    for (var i = 0; i < placeLike.length; i++) {
        if (!wordReg.test(placeLike[p])) {
            placeLikeFlag = false;
        }
    }
    if (!placeLikeFlag) {
        placeLike = "";
        cities = placeLive + placeBorn + placeLike;
    } else {
        cities = placeLive + placeBorn + placeLike;
    }

    //公司
    var company = "";
    var companyDom = document.querySelectorAll(".experience-detail");
    for (var j = 0; j < companyDom.length; j++) {
        company = company + companyDom[j].querySelector(".itemName").innerText.trim() + "$";
    }


    //学校及毕业年份
    var school = "";
    var graduateYear = "";
    var schoolDom = document.querySelectorAll(".college-name");
    for (var k = 0; k < schoolDom.length; k++) {
        school = school + schoolDom[k].innerText.trim() + "$";
        if (k == 0) {
            graduateYear = document.querySelector(".graduate-time").innerText.split('年')[0];
        }
    }

    //手机号
    var mobile = "";
    if ($("#getContact").text().indexOf("查看联系方式") < 0 && $(".tel-pwd").length == 0) {
        mobile = $(".real-mobile").text().trim();
    }
    

    /*
    *隐藏域抓取
    */
    var extraDatas = new ExtraData();
    extraDatas.extId = "";
    extraDatas.resumeId = "";
    extraDatas.resumeUserId = "";
    extraDatas.userName = name;


    vagueData.name = name;
    vagueData.birthday = "";
    vagueData.cities = cities.trim();
    vagueData.company = company.trim();
    vagueData.email = "";
    vagueData.extraDatas = extraDatas;
    vagueData.graduateYear = graduateYear;
    vagueData.identity = identity;
    vagueData.mobile = mobile;
    vagueData.mobileLast = "";
    vagueData.project = "";
    vagueData.registry = "";
    vagueData.school = school.trim();
    vagueData.sex = sex;

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