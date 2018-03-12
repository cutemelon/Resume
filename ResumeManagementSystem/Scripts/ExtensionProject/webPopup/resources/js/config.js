var work = true;
var useLocalCache = false;
var isInArea = false;//鼠标是否在范围内
var rollNum = 0;//展现列表从第几个开始显示
var allRollCount = 0;//数据总个数

//简历页面信息
var resumePages = new Array(
    { "Name": "zl", "URL": "rd.zhaopin.com/resumepreview/resume/viewone", "Code": "1" },
    { "Name": "wy", "URL": "ehire.51job.com/Candidate/ResumeView.aspx", "Code": "2" },
    { "Name": "lp", "URL": "lpt.liepin.com/resume/showresumedetail", "Code": "4" },
    { "Name": "lp", "URL": "lpt.liepin.com/resume/showrecommendresumedetail", "Code": "4" },
    { "Name": "zh", "URL": "newrms.cjol.com/resume/detail", "Code": "3" },
    { "Name": "jb", "URL": "siva-my.jobstreet.com/applications/viewResumePrint", "Code": "5" },
    { "Name": "ec", "URL": "www.ifchange.com/resume?id", "Code": "6" },
    { "Name": "local", "URL": "http://localhost:3774/Html/MsgBoxDemo.html", "Code": "5" },
    { "Name": "tc", "URL": "jianli.58.com/resumedetail/single/", "Code": "8" }
);

//关联例外
var noConnectionSiteCode = new Array(
    "8"
);

var searchPages = new Array(
    { "Name": "zl", "URL": "http://rdsearch.zhaopin.com/Home/ResultForCustom", "Code": "1" },
    { "Name": "wy", "URL": "http://rdsearch.zhaopin.com/Home/ResultForCustom", "Code": "1" },
    { "Name": "lp", "URL": "http://rdsearch.zhaopin.com/Home/ResultForCustom", "Code": "1" },
    { "Name": "zh", "URL": "http://rdsearch.zhaopin.com/Home/ResultForCustom", "Code": "1" },
    { "Name": "jb", "URL": "http://rdsearch.zhaopin.com/Home/ResultForCustom", "Code": "1" },
    { "Name": "ec", "URL": "http://rdsearch.zhaopin.com/Home/ResultForCustom", "Code": "1" }
);

var worksites = new Array(
    "*.zhaopin.com/*",
    "*.51job.com/*",
    "*.cjol.com/*",
    "*.liepin.com/*",
    "*.jobstreet.com/*",
    "*.ifchange.com/*",
    "*.58.com/*"
);

var MSG = {
    DO_ERROR: '操作失败',
    LOAD_ERROR: '脚本初始化异常，请重新加载页面',
    LOGIN_TITLE: '愚蠢的人类',
    LOGIN_CONTENT: '请先登录RMS',
    LOGIN_CONTENT2: '请先登录',
    GETDATA_CONTENT: '正在收集数据',
    SEARCH_CONTENT: '正在查询数据库',
    IMPORT_CONTENT: '正在解析入库',
    RESULT_TITLE: 'RMS简历库模糊匹配结果',
    RESULT_TITLE2: 'RMS简历库关联匹配结果',
    UPDATE_TITLE: '真的要更新吗',
    UPDATE_TITLE2: '正在更新简历',
    RESULT2_TITLE: 'RMS简历库精确比配结果',
    RESULT3_TITLE: '简历入库成功',
    RESULT4_TITLE: '简历更新成功',
    RESULT_CONTENT: '暂未匹配到相似简历',
    LESSINFO: '信息只有一丢丢',
    NOTSUPPORT: '插件可能不兼容此浏览器',
    NOTSUPPORT2: '为获得更好的体验 推荐使用IE10+、火狐、谷歌浏览器',
    ERROR_TITLE: '出错了',
    SYSTEM_TITLE: '系统消息',
    LINK: '点击查看',
    ERRORCODE: '错误代码',
    CONTACTADMIN: '请联系管理员',
    SUBMIT: '是',
    CANCEL: '否',
    UPDATE: '点我更新',
    RELATIVE_TITLE: '真的要关联吗',
    RELATIVE_TITLE2: '正在关联简历',
    RESULT5_TITLE: '简历关联成功',
    LINK_BACK: '返回',
    RELATIVE_ERROR: '关联出错',
    JUDGERELATION_TITLE: '关联评价中',
    JUDGERELATION_EXIST: '您已经评价过',
    TOKENERROR: 'token异常，请退出小智后重新登录！',
    SERVERERROR: 'Server Error',
    SERVERNOTFOUND: '找不到服务器',
    SERVERPROGRAMERROR: '后台程序出错',
    UNKNOWERROR: '未知错误',
    NOTVALIDPAGE: '当前页非简历页面',
    INITERROR: '初始化出错',
    CONTACTINFOERROR: '未成功收集手机或邮箱',
    COLLECTDATAERROR: '收集数据出错',
    UNSUPPORTBROSWER: '不支持浏览器',
    UNSUPPORTCSS3: '低版本IE 不支持CSS3',
    UPLOADRESUMEBYUSER: '请手动上传',
    SEARCHAGAINTITLE: '以下简历没有您所需要的，请点此模糊/精确搜索',
    SEARCHAGAIN: '继续查找',
    UPLOADRESUMETITLE: '以下简历没有您所需要的，请点此上传一份新简历',
    UPLOADRESUNE: '上传新简历'
};