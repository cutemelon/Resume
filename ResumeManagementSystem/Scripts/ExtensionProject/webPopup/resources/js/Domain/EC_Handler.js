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

var ECHandler = function () {
    IHandler.apply(this);
};

ECHandler.prototype = new IHandler();

ECHandler.prototype.hasContactInfo = function () {
    var hasContactInfo = false;
    var strMobile = $(document.querySelector(".icon-phonecall")).parent().text().trim();
    var strEmail = $(document.querySelector(".icon-resume-mail")).parent().text().trim();
    if (strMobile != "" || strEmail != "") {
        hasContactInfo = true;
    }
    return hasContactInfo;
};

ECHandler.prototype.getContactInfo = function () {
    var strMobile = $(document.querySelector(".icon-phonecall")).parent().text().trim();
    var strEmail = $(document.querySelector(".icon-resume-mail")).parent().text().trim();
    if (strMobile == "" && strEmail == "")
        throw new Error('102');
    return GetSearchDataCommonEC();
};

ECHandler.prototype.getDataForSearch = function () {
    return GetSearchDataCommonEC();
};

ECHandler.prototype.getResumeId = function () {
    var identity = (document.location.href.split('=')[1]).split('&')[0];
    return identity;
};

ECHandler.prototype.getResumeShowId = function () {
    var identity = (document.location.href.split('=')[1]).split('&')[0];
    return identity;
};

ECHandler.prototype.uploadResume=function() {
    var resumeDetailModel = new RDM();
    var myDate = new Date();
    
    //更新信息
    resumeDetailModel.update_info = new UpdateInfo();
    var tempUpdateTime = document.querySelector("[class='updated-time']").innerText.trim();
    if (tempUpdateTime.trim() == "今天") {
        tempUpdateTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
    } else if (tempUpdateTime.trim() == "昨天") {
        var tempAddUpdateTime = AddDate((myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear(), -1);
        tempUpdateTime = tempAddUpdateTime.getFullYear() + "-" + (tempAddUpdateTime.getMonth() + 1) + "-" + tempAddUpdateTime.getDate();
    }
    resumeDetailModel.update_info.updated_at = tempUpdateTime;

    //联系方式
    resumeDetailModel.contact = new Contact();
    var email = document.querySelector(".icon-resume-mail");
    resumeDetailModel.contact.email = email == null ? "" : email.parentNode.innerText.trim();
    var phone = document.querySelector(".icon-phonecall");
    resumeDetailModel.contact.phone = phone == null ? "" : phone.parentNode.innerText.trim();

    //来源
    resumeDetailModel.src = ["0"];

    //更新时间
    resumeDetailModel.updated_at = tempUpdateTime;

    //个人信息
    resumeDetailModel.basic = new BaseInfo();
    //简历ID
    resumeDetailModel.basic.id = (document.location.href.split('=')[1]).split('&')[0];
    //简历ID（隐藏域ID）
    resumeDetailModel.basic.hidId = (document.location.href.split('=')[1]).split('&')[0];
    //姓名
    resumeDetailModel.basic.name = $("._name")[0].innerText.trim();
    //性别
    var sexEC = document.querySelector("._basic-info").querySelector("dd").querySelectorAll("span")[0].innerText;
    if (sexEC.indexOf("男") >= 0) {
        resumeDetailModel.basic.gender = "0";
    } else {
        if (sexEC.indexOf("女") >= 0) {
            resumeDetailModel.basic.gender = "1";
        } else {
            resumeDetailModel.basic.gender = "2";
        }
    }
    resumeDetailModel.basic.nation = "";
    var tempNgBind = document.querySelector("._basic-info").querySelector("dd").childNodes;
    for (var i = 1; i < tempNgBind.length; i++) {
        //工作经验
        if (tempNgBind[i].innerText.indexOf("年经验") >= 0) {
            if (tempNgBind[i].innerText.indexOf("少于1") >= 0) {
                resumeDetailModel.basic.work_experience = "0";
            } else {
                resumeDetailModel.basic.work_experience = tempNgBind[i].innerText.trim().replace("年经验", "");
            }
        }
        //现住地(省)
        if (tempNgBind[i].innerText.indexOf("现居") >= 0) {
            resumeDetailModel.basic.address_province = GetProvinceLocation(tempNgBind[i].innerText.trim().replace("现居", "").replace("new", ""));
        }
        //户口所在地（省）
        if (tempNgBind[i].innerText.indexOf("籍贯") >= 0) {
            resumeDetailModel.basic.account_province = GetProvinceLocation(tempNgBind[i].innerText.trim().replace("籍贯", "").replace("new", ""));
        }
    }
    //生日
    resumeDetailModel.basic.birth = document.querySelector("._basic-info").querySelector("dd").querySelectorAll("span")[2].innerText;
    if (resumeDetailModel.basic.birth.indexOf("-") < 0) {
        resumeDetailModel.basic.birth = "";
    }
    //年龄
    var tempAge = document.querySelector("._basic-info").querySelector("dd").querySelectorAll("span")[2].innerText;
    var tempAgeValue = 0;
    if (tempAge.indexOf("-") >= 0) {
        tempAgeValue = tempAge.split('-')[0];
    } else {
        tempAgeValue = tempAge;
    }
    resumeDetailModel.basic.age = myDate.getFullYear() - parseInt(tempAgeValue) + 1;
    var tempExpectDom = document.querySelector("._detail-intention").querySelectorAll(".ant-col-12");
    for (var j = 0; j < tempExpectDom.length; j++) {
        //期望工作地点
        if (tempExpectDom[j].querySelector(".s-col9").innerText.indexOf("期望地点") >= 0) {
            resumeDetailModel.basic.expect_city_ids = GetProvinceLocation(tempExpectDom[j].innerText.replace("期望地点：", "").replace("new", "").replace("未完善", "").trim());
        }
        //当前状态
        if (tempExpectDom[j].querySelector(".s-col9").innerText.indexOf("目前状况：") >= 0) {
            var tempCurrentStatus = tempExpectDom[j].innerText.trim();
            resumeDetailModel.basic.current_status = tempCurrentStatus.replace("未完善", "").replace("目前状况：", "");
        }
        if (tempExpectDom[j].querySelector(".s-col9").innerText.indexOf("期望月薪：") >= 0) {
            var tempSalaryContent = tempExpectDom[j].innerText.replace("期望月薪：", "").replace("new", "").replace("/月", "").replace("未完善", "").replace("面议", "").trim();
            if (tempSalaryContent != "") {
                //期望月薪最小值
                resumeDetailModel.basic.expect_salary_from = tempSalaryContent.split("~")[0].trim();
                //期望月薪最大值
                resumeDetailModel.basic.expect_salary_to = tempSalaryContent.split("~")[1].trim();
            }
        }
        //期望从事行业
        if (tempExpectDom[j].querySelector(".s-col9").innerText.indexOf("期望行业：") >= 0) {
            resumeDetailModel.basic.expect_industry_name = tempExpectDom[j].innerText.replace("期望行业：", "").replace("new", "").replace("未完善", "").trim();
        }
        //期望从事职业
        if (tempExpectDom[j].querySelector(".s-col9").innerText.indexOf("期望职位：") >= 0) {
            resumeDetailModel.basic.expect_position_name = tempExpectDom[j].innerText.replace("期望职位：", "").replace("new", "").replace("未完善", "").trim();
        }
    }
    //自我评价
    resumeDetailModel.basic.self_remark = $(".other-content").text().trim();
    //其他信息
    resumeDetailModel.basic.other_info = document.querySelector("._detail-other").innerText.trim();

    //工作信息
    var tempWorkDom = document.querySelector("._detail-work") == null ? new Array() : document.querySelector("._detail-work").querySelectorAll(".work-list");
    for (var k = 0; k < tempWorkDom.length; k++) {
        var tempWorkInfo = new WorkInfo();
        //开始时间
        tempWorkInfo.start_time = tempWorkDom[k].querySelector(".ant-col-6").innerText.trim().split("-")[0].replace(".", "-").trim();
        //结束时间
        tempWorkInfo.end_time = tempWorkDom[k].querySelector(".ant-col-6").innerText.trim().split("-")[1].replace(".", "-").trim();
        //是否至今
        if (tempWorkInfo.end_time == "至今") {
            tempWorkInfo.so_far = "Y";
            tempWorkInfo.end_time = "";
        }
        //公司
        if (tempWorkDom[k].querySelector(".row-header-name") != null) {
            tempWorkInfo.corporation_name = tempWorkDom[k].querySelector(".row-header-name").innerText.trim();
        }
        //岗位
        if (tempWorkDom[k].querySelector(".s-fb") != null) {
            tempWorkInfo.position_name = tempWorkDom[k].querySelector(".s-fb").innerText.trim();
        }
        //职责
        if (tempWorkDom[k].querySelector(".work-responsibility") != null) {
            tempWorkInfo.responsibilities = tempWorkDom[k].querySelector(".work-responsibility").innerText.trim();
        }
        //部门
        if (tempWorkDom[k].querySelectorAll(".work-info-item")[1] != undefined) {
            tempWorkInfo.architecture_name = tempWorkDom[k].querySelectorAll(".work-info-item")[1].innerText.trim();
        }
        resumeDetailModel.work.push(tempWorkInfo);
    }
    
    //教育信息
    var tempEduDom = document.querySelector("._detail-education") == null ? new Array() : document.querySelector("._detail-education").querySelectorAll(".ant-row");
    for (var l = 0; l < tempEduDom.length; l++) {
        var tempEduInfo = new EduInfo();
        //开始时间
        tempEduInfo.start_time = tempEduDom[l].querySelector(".ant-col-6").innerText.trim().split("-")[0].replace(".", "-").trim();
        //结束时间
        tempEduInfo.end_time = tempEduDom[l].querySelector(".ant-col-6").innerText.trim().split("-")[1].replace(".", "-").trim();
        if (l == 0) {
            resumeDetailModel.basic.graduate_date = tempEduInfo.end_time;
        }
        //是否至今
        if (tempEduInfo.end_time == "至今") {
            tempEduInfo.so_far = "Y";
            tempEduInfo.end_time = "";
            resumeDetailModel.basic.graduate_date = "";
        }
        //学校
        if (tempEduDom[l].querySelector(".ant-col-16").childNodes[1] != undefined) {
            tempEduInfo.school_name = tempEduDom[l].querySelector(".ant-col-16").childNodes[1].innerText.trim();
            if (l == 0) {
                resumeDetailModel.basic.school = tempEduInfo.school_name.replace("985/211", "");
            }
        }
        //专业
        if (tempEduDom[l].querySelector(".ant-col-16").childNodes[2] != undefined) {
            tempEduInfo.discipline_name = tempEduDom[l].querySelector(".ant-col-16").childNodes[2].innerText.trim();
        }
        //学历
        if (tempEduDom[l].querySelector(".ant-col-16").childNodes[0] != undefined) {
            tempEduInfo.degree = tempEduDom[l].querySelector(".ant-col-16").childNodes[0].innerText.trim();
            if (resumeDetailModel.basic.degree == "") {
                resumeDetailModel.basic.degree = tempEduInfo.degree;
            }
        }
        resumeDetailModel.education.push(tempEduInfo);
    }

    //语言信息
    var tempLagDom = document.querySelectorAll("._detail-language .ant-row") == null ? new Array() : document.querySelectorAll("._detail-language .ant-row");
    for (var m = 0; m < tempLagDom.length; m++) {
        var tempLagInfo = new LanInfo();
        //语言类别
        tempLagInfo.name = tempLagDom[m].querySelectorAll(".f-has-content")[0].innerText.trim();
        //掌握程度
        tempLagInfo.level = tempLagDom[m].querySelectorAll(".f-has-content")[1] == undefined ? "" : tempLagDom[m].querySelectorAll(".f-has-content")[1].innerText.trim();
        resumeDetailModel.language.push(tempLagInfo);
    }
    debugger;
    //项目信息
    var tempProDom = document.querySelector("._detail-project .ant-card-body") == null ? new Array() : document.querySelector("._detail-project .ant-card-body").childNodes;
    for (var n = 0; n < tempProDom.length; n++) {
        var tempProInfo = new ProInfo();
        //开始时间
        tempProInfo.start_time = tempProDom[n].querySelectorAll(".ant-row")[0].querySelector(".ant-col-6").innerText.split("-")[0].replace(".", "-").trim();
        //结束时间
        tempProInfo.end_time = tempProDom[n].querySelectorAll(".ant-row")[0].querySelector(".ant-col-6").innerText.split("-")[1].replace(".", "-").trim();
        //是否至今
        if (tempProInfo.end_time == "至今") {
            tempProInfo.so_far = "Y";
            tempProInfo.end_time = "";
        }
        //项目名称
        tempProInfo.name = document.querySelector("._detail-project .ant-card-body").childNodes[0].querySelector(".row-header-name").innerText.trim();
        //项目描述
        if (tempProDom[n].querySelectorAll(".ant-row")[1] != undefined) {
            tempProInfo.describe = tempProDom[n].querySelectorAll(".ant-row")[1].innerText.trim();
        }
        //职责描述
        if (tempProDom[n].querySelectorAll(".ant-row")[2] != undefined) {
            tempProInfo.responsibilities = tempProDom[n].querySelectorAll(".ant-row")[2].innerText.trim();
        }
        resumeDetailModel.project.push(tempProInfo);
    }

    //证书信息
    var tempCerDom = document.querySelectorAll("._detail-certificate .ant-row");
    for (var p = 0; p < tempCerDom.length; p++) {
        var tempCerInfo = new CerInfo();
        //获得时间
        if (tempCerDom[p].querySelector(".ant-col-6") != null) {
            tempCerInfo.start_time = tempCerDom[p].querySelector(".ant-col-6").innerText.trim().replace(".", "-");
        }
        //证书名称
        if (tempCerDom[p].querySelector(".f-word-1") != null) {
            tempCerInfo.name = tempCerDom[p].querySelector(".f-word-1").innerText.trim();
        }
        resumeDetailModel.certificate.push(tempCerInfo);
    }
    
    //培训信息

    //技能信息
    var tempSkiDom = document.querySelectorAll("._detail-skill .ant-row");
    for (var o = 0; o < tempSkiDom.length; o++) {
        var tempSkiInfo = new SkiInfo();
        //名称
        tempSkiInfo.name = tempSkiDom[o].querySelectorAll(".f-has-content")[0].innerText.trim();
        //掌握程度
        tempSkiInfo.level = tempSkiDom[o].querySelectorAll(".f-has-content")[1].innerText.trim();
        resumeDetailModel.skill.push(tempSkiInfo);
    }
    return resumeDetailModel;
}

function GetSearchDataCommonEC() {
    var vagueData = new VagueData();

    $("._updated-tag").each(function () {
        $(this).html("");
    });

    /*
    *简历信息抓取
    */

    //姓名
    var name = document.querySelector("._name").innerText.trim();
    if ($(document.querySelector(".icon-phonecall")).parent().text().trim() == "" && $(document.querySelector(".icon-resume-mail")).parent().text().trim() == "") {
        name = "";
    }

    //性别、生日、户籍、当前所在地
    var sex = "";
    var birthday = "";
    var registry = "";
    var location = "";
    var baseInfoDom = document.querySelector("._basic-info").querySelector("dd").querySelectorAll("span");
    for (var i = 0; i < baseInfoDom.length; i++) {
        var contentTemp = baseInfoDom[i].innerText.trim();
        if (contentTemp == "女" || contentTemp == "男") {
            sex = contentTemp;
        }
        if (contentTemp.indexOf("籍贯") >= 0) {
            registry = GetProvinceLocation(contentTemp.replace("籍贯", "").trim());
        }
        if (contentTemp.indexOf("现居") >= 0) {
            location = GetProvinceLocation(contentTemp.replace("现居", "").trim());
        }
    }

    var school = "";
    var graduateYear = "";
    if (document.querySelector("._detail-education") != null) {
        //毕业年份
        graduateYear = document.querySelector("._detail-education").querySelector(".ant-col-6").innerText.split("-")[1].trim();
        if (graduateYear.length >= 0) {
            graduateYear = graduateYear.split('.')[0];
        }
        if (graduateYear == "至今") {
            graduateYear = "";
        }

        //学校
        var schoolDom = document.querySelector("._detail-education").querySelectorAll(".f-no-last");
        for (var j = 0; j < schoolDom.length; j++) {
            if (schoolDom[j].querySelectorAll("span").length == 2) {
                school = school + schoolDom[j].querySelectorAll("span")[0].innerText.trim().replace("985/211", "") + "$";
            } else {
                school = school + schoolDom[j].querySelectorAll("span")[1].innerText.trim().replace("985/211", "") + "$";
            }

        }
    }

    var company = "";
    if (document.querySelector("._detail-work") != null) {
        //公司
        var companyDom = document.querySelector("._detail-work").querySelectorAll(".row-header-name");
        for (var k = 0; k < companyDom.length; k++) {
            company = company + companyDom[k].innerText.trim() + "$";
        }
    }

    //简历显示ID
    var identity = "";
    if (name == "") {
        identity = document.querySelector("._name").innerText.trim();
    } else {
        identity = document.querySelector("._vipname").innerText.replace("(", "").replace(")", "").trim();
    }

    //手机号
    var mobile = $(document.querySelector(".icon-phonecall")).parent().text().trim();

    //邮箱
    var mail = $(document.querySelector(".icon-resume-mail")).parent().text().trim();

    //手机号后四位（猎聘无）
    var mobileLast = "";

    //户籍$当前所在地$期望工作地
    var cities = registry + "$" + location + "$";
    var tempExpectLocation = "";
    var intentionDom = document.querySelector("._detail-intention").querySelectorAll(".ant-col-12");
    for (var l = 0; l < intentionDom.length; l++) {
        if (intentionDom[l].innerText.indexOf("期望地点") >= 0) {
            tempExpectLocation = intentionDom[l].innerText.replace("期望地点：", "").trim();
            if (tempExpectLocation == "未完善") {
                tempExpectLocation = "";
            }
        }
    }
    cities = cities + tempExpectLocation;

    /*
    *隐藏域抓取
    */
    var extraDatas = new ExtraData();
    extraDatas.extId = "";
    extraDatas.resumeId = (document.location.href.split('=')[1]).split('&')[0];
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

    $("._updated-tag").each(function () {
        $(this).html("new");
    });

    return vagueData;
}

//时间加减法
function AddDate(dd, dadd) {
    var a = new Date(dd);
    a = a.valueOf();
    a = a + dadd * 24 * 60 * 60 * 1000;
    a = new Date(a);
    return a;
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
