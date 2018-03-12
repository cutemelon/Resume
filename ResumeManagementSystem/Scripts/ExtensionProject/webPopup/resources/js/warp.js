var curPage2 = 1;
var allPage2;
$(function () {
    
    var objs = $('object');
    objs.append('<param name="wmode" value="transparent">');
    var startDiv = '<div id="_Warp_Container" class="animated">' + 
        '</div>' +
        '<div id="_Warp_Content" class="animated">' +
            '<div id="Focus_Left" style="display:none;" class="focus_left_none">' +
                '</div>' +
                '<div id="Focus_Right" class="focus_right_none">' +
                '</div>' +
                '<div id="Conten1" style="position:absolute" class="_warp_content animated fadeInLeft">' +
                    '<div class="_content1">欢迎使用小智3.5</div>' +
                '</div>' +
                '<div id="Conten2" style="position:absolute;" class="_warp_content animated fadeOutRight display_none">' +
                    '<div class="_head1">风格</div>' +
                    '<div style="margin-top:60px;">' +
                        '<label for="Tran" style="cursor:pointer">' +
                            '<img width="60" height="90" src="' + update1Pic + '" />' +
                        '</label>' +
                        '<input id="Tran" type="radio" name="theme" value="tran" checked="checked" />' +
                        '<label for="Metro" style="cursor:pointer">' +
                            '<img style="margin-left:30px;" width="60" height="90" src="' + metro_workingPic + '" />' +
                        '</label>' +
                        '<input id="Metro" type="radio" name="theme" value="metro" />' +
                    '</div>' +
                '</div>' +
                '<div id="Conten3" style="position:absolute;" class="_warp_content animated fadeOutRight display_none">' +
                    '<div class="_head1">更快</div>' +
                    '<div class="_content2" style="margin-top:20px;">' +
                        '<span style="line-height:40px;">页面抓取 速度更快 </span><span style="font-size:14px;">页面取值耗时提升 10%</span><br />' +
                        '<span style="line-height:40px;">数据查询 速度更快 </span><span style="font-size:14px;">数据查询耗时提升 20%</span><br />' +
                        '<span style="line-height:40px;">解析简历 速度更快 </span><span style="font-size:14px;">解析入库耗时提升 25%</span><br />' +
                        '</div>' +
                '</div>' +
                '<div id="Conten4" style="position:absolute;" class="_warp_content animated fadeOutRight display_none">' +
                    '<div class="_head1">更准</div>' +
                    '<div class="_content2" style="margin-top:20px;">' +
                        '<span style="line-height:40px;">页面取值 抓内容更准&nbsp;&nbsp;</span><span style="font-size:14px;">页面取值准确率提升 50%</span><br />' +
                        '<span style="line-height:40px;">数据匹配 精确度更准&nbsp;&nbsp;</span><span style="font-size:14px;">数据匹配准确率提升 15%</span><br />' +
                        '<span style="line-height:40px;">简历入库 解析度更高&nbsp;&nbsp;</span><span style="font-size:14px;">简历解析准确率提升 10%</span><br />' +
                    '</div>' +
                '</div>' +
                '<div id="Conten5" style="position:absolute;" class="_warp_content animated fadeOutRight display_none">' +
                    '<div class="_head1">举个栗子</div>' +
                    '<div class="_content2" style="margin-top:10px;">' +
                        '<img height="200" src="' + findmePic + '"><br />' +
                        '<span style="font-size:20px">你可以在这里查看版本信息</span>' +
                    '</div>' +
                '</div>' +
                '<div id="Conten6" style="position:absolute;" class="_warp_content animated fadeOutRight display_none">' +
                    '<div class="_head1">那么问题就来了</div>' +
                    '<div class="_content2" style="margin-top:10px;">' +
                        '<span style="font-size:20px;">什么时候更新插件?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><br/>' +
                        '<img height="100" width="400" src="' + update1Pic + '"><br />' +
                        '<span style="font-size:20px">在使用中 根据系统提示进行更新</span>' +
                    '</div>' +
                '</div>' +
                '<div id="Conten7" style="position:absolute;" class="_warp_content animated fadeOutRight display_none">' +
                    '<div class="_head1">还有疑问</div>' +
                    '<div class="_content3">' +
                        '请联系' +
                        '<a href="mailto:rms_support@pactera.com" style="font-size:30px;color:#279FEE"><span>RMS_Support</span></a>' +
                    '</div>' +
                    '<div id="_Warp_Finished" class="finished_btn">' +
                        '开始使用' +
                    '</div>' +
                '</div>' +
                '<div id="Conten8" style="position:absolute;" class="_warp_content animated fadeOutRight display_none">' +
                    '<div class="_content2" style="font-size:25px;">' +
                        '<span>《你以为那么复杂的页面我看不懂信息》</span><br />' +
                        '<span>《你以为很奇葩的公司名字我就查不到》</span><br />' +
                        '<span>《哈哈哈哈哈哈哈哈哈哈哈你太天真了》</span><br />' +
                        '<span>《被优化过了很多次怎么会办不到那些》</span><br />' +
                        '<span>《除非真的是很变态很变态的人的简历》</span><br />' +
                        '<span>《虽然我有时候也会出错影响你们工作》</span><br />' +
                        '<span>《但是我还是依然很努力的想做得更好》</span><br />' +
                        '<span>《哪像你这么无聊会把这段文字给看完》</span><br />' +
                        '<span>《快返回前页点击那个蓝色的开始使用》</span><br />' +
                    '</div>' +
                '</div>' +
    '</div>';
    $('body').append(startDiv);
    allPage2 = $('._warp_content').length;
    resize2();
    $(window).resize(null, resize2);
    $('#_Warp_Finished').on('click', function () {
		var t = '';
		$("input[name='theme']:checked").each(function () {
            t = this.value;
		}); 
		store.set("ThemeName", t);
		store.set('ShowStart', appDescription);
		$('#_Warp_Container,#_Warp_Content').remove();
        //选择哪个就自动勾选后面页面的
		if (t == "tran") {
		    $("#tran").click();
		} else {
		    $("#metro").click();
		}
    });
});

function resize2() {
    var _bWidth, _bHeight;
    _bWidth = $(window).width();
    _dWidth = $(document).width();
    _bHeight = $(window).height();
    _dHeight = $(document).height();
    $('#_Warp_Container').height(_dHeight).width(_dWidth);
    $('#_Warp_Content').css('top', (_bHeight - 300) / 2).css('left', (_bWidth - 600) / 2);
    refreshCom2();
    $('#Focus_Right').on('hover', function() {
        $(this).toggleClass('focus_right_none').toggleClass('focus_right_hover');
    }).on('click', function () {
        if (curPage2 >= 8) {
            curPage2 = 7;
        }
        $('#Conten' + curPage2).removeClass('fadeInLeft fadeInRight').addClass('fadeOutLeft');
        curPage2 = curPage2 + 1;
        $('#Conten' + curPage2).removeClass('fadeOutLeft fadeOutRight display_none').addClass('fadeInRight');
        refreshCom2();
    });

    $('#Focus_Left').on('hover', function () {
        $(this).toggleClass('focus_left_none').toggleClass('focus_left_hover');
    }).on('click', function () {
        if (curPage2 <= 1) {
            curPage2 = 2;
        }
        $('#Conten' + curPage2).removeClass('fadeInLeft fadeInRight').addClass('fadeOutRight');
        curPage2 = curPage2 - 1;
        $('#Conten' + curPage2).removeClass('fadeOutLeft fadeOutRight display_none').addClass('fadeInLeft');
        refreshCom2();
    });
}

function refreshCom2() {
    if (curPage2 == 1)
        $('#Focus_Left').hide();
    else
        $('#Focus_Left').show();
    if (curPage2 == (allPage2)) 
        $('#Focus_Right').hide();
    else
        $('#Focus_Right').show();
}