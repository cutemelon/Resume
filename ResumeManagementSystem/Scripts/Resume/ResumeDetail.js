$(function () {
    credit();
    $(".showList").click(function () {
        $(".cardStyle").css("display", "none");
        $(".listStyle").css("display", "block");
    });

    $(".showCard").click(function () {
        $(".listStyle").css("display", "none");
        $(".cardStyle").css("display", "block");
    });

    $(".containerimg").mousemove(function () {
        $(".containerimg .resume-tips ul").css("transform", "rotateX(1.16deg) rotateY(6.2deg)");
    });
    $(".containerimg").mouseout(function () {
        $(".containerimg .resume-tips ul").css("transform", "rotateX(-4.24deg) rotateY(-4.88deg)");
    });
});

function credit() {
    var chart = AmCharts.makeChart("credit", {
        type: "radar",
        theme: "light",
        fontFamily: "Open Sans",
        color: "#888",
        dataProvider: [{
            country: "身份认证",
            litres: 156.9
        }, {
            country: "简历质量",
            litres: 131.1
        }, {
            country: "行为偏好",
            litres: 115.8
        }, {
            country: "信用历史",
            litres: 109.9
        }, {
            country: "社交人脉",
            litres: 108.3
        }],
        valueAxes: [{
            axisTitleOffset: 20,
            minimum: 0,
            axisAlpha: .15
        }],
        startDuration: 2,
        graphs: [{
            balloonText: "[[value]] litres of beer per year",
            bullet: "round",
            valueField: "litres"
        }],
        categoryField: "country",
        exportConfig: {
            menuTop: "10px",
            menuRight: "10px",
            menuItems: [{
                icon: "/lib/3/images/export.png",
                format: "png"
            }]
        }
    });
    chart.write('credit');
}