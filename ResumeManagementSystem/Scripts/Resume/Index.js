var dataList;
$(function () {

    InitDataList();
    $(".showList").click(function () {
        $(".cardStyle").css("display", "none");
        $(".listStyle").css("display", "block");
    });

    $(".showCard").click(function () {
        $(".listStyle").css("display", "none");
        $(".cardStyle").css("display", "block");
    });

    $(".showList").click(function () {
        $("#tblContent2").html($("#contentTemplate2").render(dataList));
    });
});

function InitDataList(page) {

    var expectPosition = $(".expectPosition").val() == null ? null : $(".expectPosition").val().trim();//期望职位值
    var degree = $(".degree").val() == null ? null : $(".degree").val().trim();//学历值
    var gender = $(".gender").val() == null ? null : $(".gender").val().trim();//性别值
    var name = $(".name").val() == null ? null : $(".name").val().trim();//姓名值
    var address = $(".address").val() == null ? null : $(".address").val().trim();//地址值
    var age = $(".age").val() == null ? null : $(".age").val().trim();//年龄值
    var workExperience = $(".workExperience").val() == null ? null : $(".workExperience").val().trim();//工作经验值
    var company = $(".company").val() == null ? null : $(".company").val().trim();//公司值
    var position = $(".position").val() == null ? null : $(".position").val().trim();//目前职位值

    $.post(
         "/Resume/GetResumeList",
        { expectPosition: expectPosition, degree: degree, gender: gender, name: name, address: address, age: age, workExperience: workExperience, company: company, position: position, pageNo: 1, size: 20 },
        function (data, status) {
            //数据写到前台
            dataList = data.dataList;
            $("#tblContent1").html($("#contentTemplate1").render(dataList));
            //$("#tblContent2").html($("#contentTemplate2").render(data.dataList));
            //$("#divPage").html(data["pageList"]);
        },
    "json"
    );
}

