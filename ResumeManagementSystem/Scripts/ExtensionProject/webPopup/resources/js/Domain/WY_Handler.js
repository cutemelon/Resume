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

var WYHandler = function () {
    IHandler.apply(this);
};

WYHandler.prototype = new IHandler();

WYHandler.prototype.hasContactInfo = function () {
    var hasContactInfo = ($("#UndownloadLink").length == 0);
    return hasContactInfo;
};

WYHandler.prototype.getContactInfo = function () {
    var strEmail = $("#divResume .blue").text().trim();
	var strMobile = $("#divResume .infr tr")[1].getElementsByTagName("td")[1].innerText.trim();
	if (strMobile == "" && strEmail == "")
	    throw new Error('102');
	return GetSearchDataCommonWY();
};

WYHandler.prototype.getDataForSearch = function () {
    return GetSearchDataCommonWY();
};

WYHandler.prototype.getResumeId = function () {
    var identity = $("#hidUserID").val();
    return identity;
};

WYHandler.prototype.getResumeShowId = function () {
    var identity = $("#hidUserID").val();
    return identity;
};

WYHandler.prototype.uploadResume = function () {
    var resumeDetailModel = new RDM();

    var contentTxt = $("#divInfo .box");
    var indexWork = -1;
    var indexSchool = -1;
    var indexPerson = -1;
    var indexWorkLike = -1;
    var indexProject = -1;
    var indexPersonOther = -1;
    var indexTotalIncome = -1;
    for (var l = 0; l < contentTxt.length; l++) {
        if (contentTxt[l].getElementsByTagName("td")[0] != undefined) {
            if (contentTxt[l].getElementsByTagName("td")[0].innerText.trim() == "工作经验") {
                indexWork = l;
            }
            if (contentTxt[l].getElementsByTagName("td")[0].innerText.trim() == "教育经历") {
                indexSchool = l;
            }
            if (contentTxt[l].getElementsByTagName("td")[0].innerText.trim() == "个人信息") {
                indexPerson = l;
            }
            if (contentTxt[l].getElementsByTagName("td")[0].innerText.trim() == "求职意向") {
                indexWorkLike = l;
            }
            if (contentTxt[l].getElementsByTagName("td")[0].innerText.trim() == "项目经验") {
                indexProject = l;
            }
            if (contentTxt[l].getElementsByTagName("td")[0].innerText.trim().indexOf("技能特长") >= 0) {
                indexPersonOther = l;
            }
            if (contentTxt[l].getElementsByTagName("td")[0].innerText.trim().indexOf("目前年收入") >= 0) {
                indexTotalIncome = l;
            }
        }
    }

    //更新信息
    resumeDetailModel.update_info = new UpdateInfo();
    var tempUpdateTime = $("#lblResumeUpdateTime").find("b").eq(0).text();
    resumeDetailModel.update_info.updated_at = tempUpdateTime;

    //联系方式
    resumeDetailModel.contact = new Contact();
    var email = $("#divResume .blue").text().trim();
    if (email.indexOf("*") >= 0) {
        email = "";
    }
    resumeDetailModel.contact.email = email;
    var phone = $("#divResume .infr tr")[1].getElementsByTagName("td")[1].innerText.trim();
    if (phone.indexOf("*") >= 0) {
        phone = "";
    }
    resumeDetailModel.contact.phone = phone;

    //来源
    resumeDetailModel.src = ["0"];

    //更新时间
    resumeDetailModel.updated_at = tempUpdateTime;

    //个人信息
    resumeDetailModel.basic = new BaseInfo();
    //目前年收入
    if (indexTotalIncome != -1) {
        resumeDetailModel.basic.current_salary = $("#divInfo .box")[indexTotalIncome].innerText.trim().split("：")[1].trim().split('(')[0].trim();
    }
    //简历ID（显示ID）
    resumeDetailModel.basic.id = $(".icard").text().trim().replace("ID:", "");
    //简历用户ID
    resumeDetailModel.basic.resumeUserId = $("#hidUserID").val();
    //姓名
    resumeDetailModel.basic.name = $("#divResume .infr tr .name")[0].innerText.trim();
    var tempPersonInfoDom = $("#divResume .infr tr");
    for (var i = 0; i < tempPersonInfoDom.length; i++) {
        if (tempPersonInfoDom[i].innerText.trim().indexOf("|") >= 0) {
            var tempPersonInfoArray = tempPersonInfoDom[i].innerText.trim().split('|');
            //性别
            var sexWY = tempPersonInfoArray[0];
            if (sexWY.indexOf("男") >= 0) {
                resumeDetailModel.basic.gender = "0";
            } else {
                if (sexWY.indexOf("女") >= 0) {
                    resumeDetailModel.basic.gender = "1";
                } else {
                    resumeDetailModel.basic.gender = "2";
                }
            }
            for (var j = 0; j < tempPersonInfoArray.length; j++) {
                //工作经验
                if (tempPersonInfoArray[j].indexOf("工作经验") >= 0) {
                    resumeDetailModel.basic.work_experience = tempPersonInfoArray[j].replace("年工作经验", "");
                }
                if (tempPersonInfoArray[j].indexOf("岁") >= 0 && tempPersonInfoArray[j].indexOf("年") >= 0) {
                    //生日
                    var birthdayContent = tempPersonInfoArray[j].split('（')[1].split('）')[0].trim();
                    resumeDetailModel.basic.birth = birthdayContent.replace("年", "-").replace("月", "-").replace("日", "");
                    //年龄
                    resumeDetailModel.basic.age = tempPersonInfoArray[j].split('（')[0].trim().replace("岁", "");
                }
                //现住地
                if (tempPersonInfoArray[j].indexOf("现居住") >= 0) {
                    resumeDetailModel.basic.address_province = GetProvinceLocation(tempPersonInfoArray[j].replace("现居住", ""));
                }
            }
        }
        //当前状态
        if (i == 1) {
            var tempStatus = tempPersonInfoDom[1].querySelector("td").innerText.trim();
            resumeDetailModel.basic.current_status = tempStatus;
        }
    }
    if (indexWorkLike != -1) {
        var tempLikeArry = $("#divInfo .box").eq(indexWorkLike).find(".keys");
        for (var n = 0; n < tempLikeArry.length; n++) {
            //期望工作地点
            if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).text().indexOf("地点") >= 0) {
                var tempLikeTextArry = $("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim().split(' ');
                for (var o = 0; o < tempLikeTextArry.length; o++) {
                    resumeDetailModel.basic.expect_city_ids = GetProvinceLocation(tempLikeTextArry[o]);
                }
            }
            //期望月薪
            if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).text().indexOf("期望薪资") >= 0) {
                if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim().indexOf("万元") >= 0) {
                    if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim().indexOf("万元/年") >= 0) {
                        var tempSalaryYearArry = $("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim().replace("万元/年", "").trim().split('-');
                        //期望年薪最小值
                        resumeDetailModel.basic.expect_annual_salary_from = tempSalaryYearArry[0] + "万";
                        //期望年薪最大值
                        resumeDetailModel.basic.expect_annual_salary_to = tempSalaryYearArry[1] + "万";;
                    } else if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim().indexOf("万元/月") >= 0) {
                        var tempSalaryMonthArray = $("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim().replace("万元/月", "").trim().split('-');
                        //期望月薪最小值
                        resumeDetailModel.basic.expect_salary_from = tempSalaryMonthArray[0] + "万";;
                        //期望月薪最大值
                        resumeDetailModel.basic.expect_salary_to = tempSalaryMonthArray[1] + "万";;
                    }
                } else {
                    if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim().indexOf("元/年") >= 0) {
                        var tempSalaryYearArry = $("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim().replace("元/年", "").trim().split('-');
                        //期望年薪最小值
                        resumeDetailModel.basic.expect_annual_salary_from = tempSalaryYearArry[0];
                        //期望年薪最大值
                        resumeDetailModel.basic.expect_annual_salary_to = tempSalaryYearArry[1];
                    } else if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim().indexOf("元/月") >= 0) {
                        var tempSalaryMonthArray = $("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim().replace("元/月", "").trim().split('-');
                        //期望月薪最小值
                        resumeDetailModel.basic.expect_salary_from = tempSalaryMonthArray[0];
                        //期望月薪最大值
                        resumeDetailModel.basic.expect_salary_to = tempSalaryMonthArray[1];
                    }
                }
            }
            //到岗时间
            if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).text().indexOf("到岗时间") >= 0) {
                resumeDetailModel.basic.expect_work_at = $("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim();
            }
            //自我评价
            if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).text().indexOf("自我评价") >= 0) {
                var tempSelfArray = $("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：');
                for (var y = 1; y < tempSelfArray.length; y++) {
                    if (y == tempSelfArray.length - 1) {
                        resumeDetailModel.basic.self_remark = (resumeDetailModel.basic.self_remark + tempSelfArray[y]);
                    } else {
                        resumeDetailModel.basic.self_remark = (resumeDetailModel.basic.self_remark + tempSelfArray[y] + "：");
                    }
                }
            }
            //期望工作性质
            if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).text().indexOf("工作类型") >= 0) {
                resumeDetailModel.basic.expect_type = $("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim();
            }
            //期望从事职业
            if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).text().indexOf("职能") >= 0) {
                resumeDetailModel.basic.expect_position_name = $("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim();
            }
            //期望从事行业
            if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).text().indexOf("职能") >= 0) {
                resumeDetailModel.basic.expect_industry_name = $("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim();
            }
        }
    }
    if (indexPerson != -1) {
        var tempBornArry = $("#divInfo .box").eq(indexPerson).find(".tb2");
        for (var m = 0; m < tempBornArry.length; m++) {
            //户口所在地
            if ($("#divInfo .box").eq(indexPerson).find(".tb2").eq(m).text().trim().indexOf("户口/国籍") >= 0) {
                resumeDetailModel.basic.account_province = GetProvinceLocation($("#divInfo .box").eq(indexPerson).find(".tb2").eq(m).text().trim().split('：')[1].trim());
            }
            //婚姻状况
            if ($("#divInfo .box").eq(indexPerson).find(".tb2").eq(m).text().trim().indexOf("婚姻状况") >= 0) {
                var tempMarital = $("#divInfo .box").eq(indexPerson).find(".tb2").eq(m).text().trim().split('：')[1].trim();
                if (tempMarital == "已婚") {
                    resumeDetailModel.basic.marital = "Y";
                }else if (tempMarital == "未婚") {
                    resumeDetailModel.basic.marital = "N";
                } else {
                    resumeDetailModel.basic.marital = "U";
                }
            }
            //政治面貌
            if ($("#divInfo .box").eq(indexPerson).find(".tb2").eq(m).text().trim().indexOf("政治面貌") >= 0) {
                resumeDetailModel.basic.political_status = $("#divInfo .box").eq(indexPerson).find(".tb2").eq(m).text().trim().split('：')[1].trim();
            }
            //家庭地址（地址）
            if ($("#divInfo .box").eq(indexPerson).find(".tb2").eq(m).text().trim().indexOf("家庭地址") >= 0) {
                resumeDetailModel.basic.address = $("#divInfo .box").eq(indexPerson).find(".tb2").eq(m).text().trim().split('：')[1].trim();
            }
        }
    }
    var tempDegreeDom = document.querySelector(".tba");
    if (tempDegreeDom != null) {
        for (var k = 0; k < tempDegreeDom.querySelectorAll(".keys").length; k++) {
            //学历
            if (tempDegreeDom.querySelectorAll(".keys")[k].innerText.indexOf("学位") >= 0) {
                resumeDetailModel.basic.degree = $(tempDegreeDom.querySelectorAll(".keys")[k]).parent().find(".txt2").text();
            }
        }
    }

    //工作信息
    if (indexWork != -1) {
        var tempCompanyDom = $("#divInfo .box")[indexWork].querySelectorAll(".p15");
        for (var p = 0; p < tempCompanyDom.length; p++) {
            var tempWorkInfo = new WorkInfo();
            var tempCompanyDomA = tempCompanyDom[p].childNodes[0].childNodes[0].childNodes;

            var tempCompanyTimeArry = $(tempCompanyDomA[0]).find(".time").text().trim().split("-");
            //开始时间
            tempWorkInfo.start_time = tempCompanyTimeArry[0].replace("/", "-");
            //结束时间
            tempWorkInfo.end_time = tempCompanyTimeArry[1].replace("/", "-");
            //是否至今
            if (tempWorkInfo.end_time == "至今") {
                tempWorkInfo.so_far = "Y";
                tempWorkInfo.end_time = "";
            }
            //公司
            tempWorkInfo.corporation_name = $(tempCompanyDomA[0]).find(".bold").text().trim();
            var tempCorDescIndex = tempCompanyDomA.length >= 4 ? 1 : 0;
            var tempWorkPosIndex = tempCompanyDomA.length >= 4 ? 2 : 1;
            var tempWorkDescIndex = tempCompanyDomA.length >= 4 ? 3 : 2;
            if (tempCorDescIndex != 0) {
                //公司描述
                tempWorkInfo.corporation_desc = $(tempCompanyDomA[tempCorDescIndex]).text();
            }
            //部门
            tempWorkInfo.architecture_name = $(tempCompanyDomA[tempWorkPosIndex]).find(".time").text().trim();
            //岗位
            tempWorkInfo.position_name = $(tempCompanyDomA[tempWorkPosIndex]).find(".rtbox").text().trim();
            //职责
            tempWorkInfo.responsibilities = $(tempCompanyDomA[tempWorkDescIndex]).find(".txt1").text().trim();
            resumeDetailModel.work.push(tempWorkInfo);
        }
    }

    //教育信息
    if (indexSchool != -1) {
        var tempSchoolDom = $("#divInfo .box")[indexSchool].querySelector(".tba").childNodes[0].childNodes[0].childNodes;
        for (var q = 0; q < tempSchoolDom.length; q++) {
            var tempEduInfo = new EduInfo();
            var tempSchoolTimeArray = $($(tempSchoolDom[q]).find("tbody")[0].childNodes[0]).find(".time").text().trim().split("-");
            //开始时间
            tempEduInfo.start_time = tempSchoolTimeArray[0].trim().replace("/", "-");
            //结束时间
            tempEduInfo.end_time = tempSchoolTimeArray[1].trim().replace("/", "-");
            if (q == 0) {
                resumeDetailModel.basic.graduate_date = tempEduInfo.end_time;
            }
            //是否至今
            if (tempEduInfo.end_time == "至今") {
                tempEduInfo.so_far = "Y";
                tempEduInfo.end_time = "";
                resumeDetailModel.basic.graduate_date = "";
            }
            //学校
            tempEduInfo.school_name = $($($(tempSchoolDom[q]).find("tbody")[0].childNodes[0]).find(".rtbox")[0]).find(".txt3").text().trim();
            if (q == 0) {
                resumeDetailModel.basic.school = tempEduInfo.school_name;
            }
            var tempDegInfoArray = $(tempSchoolDom[q]).find("tbody")[0].childNodes[1].innerText.trim().split("|");
            //专业
            tempEduInfo.discipline_name = tempDegInfoArray[1];
            //学历
            tempEduInfo.degree = tempDegInfoArray[0];
            if ($(tempSchoolDom[q]).find("tbody")[0].childNodes.length == 3) {
                //专业描述
                tempEduInfo.discipline_desc = $(tempSchoolDom[q]).find("tbody")[0].childNodes[2].querySelector(".txt1").innerText.trim();
            }
            resumeDetailModel.education.push(tempEduInfo);
        }
    }

    //项目信息
    if (indexProject != -1) {
        var tempProjectDom = $("#divInfo .box")[indexProject].querySelector(".tbb").childNodes[0].childNodes[0].childNodes;
        for (var r = 0; r < tempProjectDom.length; r++) {
            var tempProInfo = new ProInfo();
            var tempProjectTimeArray = $(tempProjectDom[r]).find(".time").text().trim().split("-");
            //开始时间
            tempProInfo.start_time = tempProjectTimeArray[0].trim().replace("/", "-");
            //结束时间
            tempProInfo.end_time = tempProjectTimeArray[1].trim().replace("/", "-");
            //是否至今
            if (tempProInfo.end_time == "至今") {
                tempProInfo.so_far = "Y";
                tempProInfo.end_time = "";
            }
            //项目名称
            tempProInfo.name = $(tempProjectDom[r]).find(".rtbox").text().trim();
            var tempProDetailDom = $(tempProjectDom[r]).find(".keys");
            for (var s = 0; s < tempProDetailDom.length; s++) {
                //项目描述
                if (tempProDetailDom[s].innerText.indexOf("项目描述") >= 0) {
                    tempProInfo.describe = $(tempProDetailDom[s]).parent().find(".txt1").text();
                }
                //职责描述
                if (tempProDetailDom[s].innerText.indexOf("职责描述") >= 0) {
                    tempProInfo.responsibilities = $(tempProDetailDom[s]).parent().find(".txt1").text();
                }
            }
            resumeDetailModel.project.push(tempProInfo);
        }
    }
    
    if (indexPersonOther != -1) {
        var tempPersonOtherDom = $("#divInfo .box")[indexPersonOther].querySelector(".tbb").childNodes[0].childNodes[0].childNodes;
        for (var t = 0; t < tempPersonOtherDom.length; t++) {
            t = t + 1;
            //语言信息
            if (tempPersonOtherDom[t - 1].innerText.indexOf("技能") >= 0) {
                var tempLangDom = $(tempPersonOtherDom[t]).find(".skill");
                for (var u = 0; u < tempLangDom.length; u++) {
                    var tempLagInfo = new SkiInfo();
                    //语言类别
                    tempLagInfo.name = tempLangDom[u].innerText.trim();
                    //掌握程度
                    tempLagInfo.level = $(tempLangDom[u]).parent().find(".skco").text().trim();
                    resumeDetailModel.skill.push(tempLagInfo);
                }
            }
            //证书信息
            if (tempPersonOtherDom[t - 1].innerText.indexOf("证书") >= 0) {
                var tempCerDom = $(tempPersonOtherDom[t]).find(".time");
                for (var v = 0; v < tempCerDom.length; v++) {
                    var tempCerInfo = new CerInfo();
                    //获得时间
                    tempCerInfo.start_time = tempCerDom[v].innerText.trim().replace("/", "-");
                    //证书名称
                    tempCerInfo.name = $(tempCerDom[v]).parent().find(".rtbox").text().trim();
                    resumeDetailModel.certificate.push(tempCerInfo);
                }
            }
            //培训经历
            if (tempPersonOtherDom[t - 1].innerText.indexOf("培训经历") >= 0) {
                var tempTrainDom = tempPersonOtherDom[t].querySelector("table").childNodes[0].childNodes;
                for (var w = 0; w < tempTrainDom.length; w++) {
                    var tempTraInfo = new TraInfo();
                    var tempTrainTimeArray = $(tempTrainDom[w]).find(".time").text().trim().split("-");
                    //开始时间
                    tempTraInfo.start_time = tempTrainTimeArray[0].trim().replace("/", "-");
                    //结束时间
                    tempTraInfo.end_time = tempTrainTimeArray[1].trim().replace("/", "-");
                    //是否至今
                    if (tempTraInfo.end_time == "至今") {
                        tempTraInfo.so_far = "Y";
                        tempTraInfo.end_time = "";
                    }
                    //培训课程
                    tempTraInfo.name = $(tempTrainDom[w]).find(".rtbox").text().trim();
                    var tempKeyList = tempPersonOtherDom[t].querySelector("table").childNodes[0].childNodes[w].querySelectorAll(".keys");
                    for (var x = 0; x < tempKeyList.length; x++) {
                        //培训机构
                        if (tempKeyList[x].innerText.indexOf("培训机构") >= 0) {
                            tempTraInfo.authority = $(tempKeyList[x]).parent().find(".txt2").text().trim();
                        }
                        //培训地点
                        if (tempKeyList[x].innerText.indexOf("培训地点") >= 0) {
                            tempTraInfo.city = $(tempKeyList[x]).parent().find(".txt2").text().trim();
                        }
                        //详细描述
                        if (tempKeyList[x].innerText.indexOf("培训描述") >= 0) {
                            tempTraInfo.description = $(tempKeyList[x]).parent().find(".txt1").text().trim();
                        }
                    }
                    resumeDetailModel.training.push(tempTraInfo);
                }
            }
        }
    }
    return resumeDetailModel;
}

function GetSearchDataCommonWY() {
    var vagueData = new VagueData();

    /*
    *简历信息抓取
    */

    //姓名
    var name = $("#divResume .infr tr .name")[0].innerText.trim();
    if (name.indexOf("ID") >= 0) {
        name = "";
    }

    //邮箱
    var email = $("#divResume .blue").text().trim();
    if (email.indexOf("*") >= 0) {
        email = "";
    }

    //电话及后四位
    var mobile = $("#divResume .infr tr")[1].getElementsByTagName("td")[1].innerText.trim();//电话
    var mobileLast = "";//后四位
    if (mobile.indexOf("*") >= 0) {
        mobileLast = mobile.substring(mobile.length - 4);
        mobile = "";
    }

    //性别
    var arrSex = $("#divResume .infr tr")[2].innerText.trim().split('|');
    if (email != "") {
        arrSex = $("#divResume .infr tr")[3].innerText.trim().split('|');
    }
    var sex = arrSex[0];
    //生日
    var birthday = "";
    var birthdayContent = arrSex[1].split('（')[1].split('）')[0];
    birthday = birthdayContent.split('年')[0].trim() + "-" +
        birthdayContent.split('年')[1].split("月")[0].trim() + "-" +
        birthdayContent.split('年')[1].split("月")[1].trim().replace("日", "");

    //公司和学校以及毕业年份
    var contentTxt = $("#divInfo .box");
    var indexWork = -1;
    var indexSchool = -1;
    var indexPerson = -1;
    var indexWorkLike = -1;
    for (var j = 0; j < contentTxt.length; j++) {
        if (contentTxt[j].getElementsByTagName("td")[0] != undefined) {
            if (contentTxt[j].getElementsByTagName("td")[0].innerText.trim() == "工作经验") {
                indexWork = j;
            }
            if (contentTxt[j].getElementsByTagName("td")[0].innerText.trim() == "教育经历") {
                indexSchool = j;
            }
            if (contentTxt[j].getElementsByTagName("td")[0].innerText.trim() == "个人信息") {
                indexPerson = j;
            }
            if (contentTxt[j].getElementsByTagName("td")[0].innerText.trim() == "求职意向") {
                indexWorkLike = j;
            }
        }
    }
    //公司
    var company = "";
    if (indexWork != -1) {
        var companyContent = $("#divInfo .plate_right");
        for (var k = 0; k < companyContent.length; k++) {
            if (companyContent[k].getElementsByClassName("bold")[0] != undefined) {
                company = company + companyContent[k].getElementsByClassName("bold")[0].innerText.trim() + "$";
            }
        }
    }
    //学校及毕业年份
    var school = "";
    var graduateYear = "";
    if (indexSchool != -1) {
        var schoolContent = $("#divInfo .box")[indexSchool].getElementsByTagName("tbody");
        for (var l = 2; l < schoolContent.length; l++) {
            if (schoolContent[l].getElementsByClassName("txt3")[0] != undefined) {
                school = school + schoolContent[l].getElementsByClassName("txt3")[0].innerText.trim().split("[")[0].trim() + "$";
                if (l == 2) {
                    var tempG = schoolContent[l].getElementsByClassName("time")[0].innerText.trim().split('-')[1].trim();
                    if (tempG.indexOf("/") >= 0) {
                        graduateYear = tempG.split('/')[0];
                    }
                }
            }
        }
    }

    //简历显示ID
    var identity = $("#divResume .infr tr")[0].getElementsByTagName("td")[1].innerText.replace('ID:', '');
    if (mobile == "" && email == "") {
        identity = $("#divResume .infr tr")[0].getElementsByTagName("td")[0].innerText.replace('ID:', '');
    }

    //户籍
    var registry = "";

    //户籍$当前所在地$期望工作地
    var cities = "";
    var placeLive = "";//当前所在地
    var placeBorn = "";//户籍
    var placeLike = "";//期望工作地
    var tempLive = $("#divResume .infr tr")[2].innerText.trim().split('|');
    for (var i = 0; i < tempLive.length; i++) {
        if (tempLive[i].indexOf("现居住") >= 0) {
            placeLive = GetProvinceLocation(tempLive[i].replace("现居住", "").split('-')[0]) + "$";
        }
    }
    if (indexPerson != -1) {
        var tempBornArry = $("#divInfo .box").eq(indexPerson).find(".tb2");
        for (var m = 0; m < tempBornArry.length; m++) {
            if ($("#divInfo .box").eq(indexPerson).find(".tb2").eq(m).text().trim().indexOf("户口/国籍") >= 0) {
                placeBorn = GetProvinceLocation($("#divInfo .box").eq(indexPerson).find(".tb2").eq(m).text().trim().split('：')[1].trim()) + "$";
            }
        }
    }
    if (indexWorkLike != -1) {
        var tempLikeArry = $("#divInfo .box").eq(indexWorkLike).find(".keys");
        for (var n = 0; n < tempLikeArry.length; n++) {
            if ($("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).text().indexOf("地点") >= 0) {
                var tempLikeTextArry = $("#divInfo .box").eq(indexWorkLike).find(".keys").eq(n).parent().text().split('：')[1].trim().split(' ');
                for (var o = 0; o < tempLikeTextArry.length; o++) {
                    placeLike = placeLike + tempLikeTextArry[o] + "$";
                }
            }
        }
    }
    registry = placeBorn.replace("$", "");
    cities = placeLive + placeBorn + placeLike;

    /*
    *隐藏域抓取
    */
    var extraDatas = new ExtraData();
    extraDatas.extId = "";
    extraDatas.resumeId = "";
    extraDatas.resumeUserId = $("#hidUserID").val();
    extraDatas.userName = name;


    vagueData.name = name;
    vagueData.birthday = birthday.trim();
    vagueData.cities = cities.trim();
    vagueData.company = company.trim();
    vagueData.email = email;
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