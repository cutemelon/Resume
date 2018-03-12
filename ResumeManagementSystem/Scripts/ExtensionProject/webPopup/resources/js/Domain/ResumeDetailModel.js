//ResumeDetailModel.js
function RDM() {
    //更新信息
    this.update_info = new UpdateInfo();
    //联系方式
    this.contact = new Contact();
    //来源
    this.src = [];
    //简历是否可以购买到，0 表示不能，1 表示可以
    this.can_buy = 1;
    //匹配得分
    this.score = 0;
    //更新时间
    this.updated_at = "";
    //更新方式 0-手动新增1-手动更新2-自动新增4-自动更新
    this.importType = "";
    //RMS简历ID
    this.repeatId = "";
    //简历原文
    this.htmlContent = "";
    //不带html标签的简历原文
    this.noHtmlContent = "";
    //个人信息
    this.basic = new BaseInfo();
    //工作信息
    this.work = [];
    //教育信息
    this.education = [];
    //语言信息
    this.language = [];
    //项目信息
    this.project = [];
    //证书信息
    this.certificate = [];
    //培训信息
    this.training = [];
    //技能信息
    this.skill = [];
}

//更新信息
function UpdateInfo() {
    this.updated_at = "";
}

//联系方式
function Contact() {
    this.phone = "";
    this.email = "";
    this.qq = "";
    this.tel = "";
    this.sina = "";
    this.ten = "";
    this.msn = "";
    this.wechat = "";
}

//个人信息
function BaseInfo() {
    //简历ID（显示ID）
    this.id = "";
    //简历ID（隐藏域ID）
    this.hidId = "";
    //简历用户ID
    this.resumeUserId = "";
    //姓名
    this.name = "";
    //头像
    this.photo = "";
    //性别 0-男 1-女 2-未知
    this.gender = "2";
    //国籍
    this.nation = "";
    //工作经验
    this.work_experience = "";
    //生日
    this.birth = "";
    //年龄
    this.age = "";
    //期望工作地点
    this.expect_city_ids = "";
    //当前状态(1:离职，正在看机会; 2:在职，正在看机会; 3:在职，有好的机会可以考虑; 4:在职，不考虑机会;5:未知)
    this.current_status = "";
    //现住地(省)
    this.address_province = "";
    //地址
    this.address = "";
    //户口所在地（省）
    this.account_province = "";
    //区县
    this.account = "";
    //期望月薪最小值(单位 元/月)
    this.expect_salary_from = "";
    //期望月薪最大值 (单位 元/月)
    this.expect_salary_to = "";
    //期望薪资月数
    this.expect_salary_month = "";
    //期望其他收入(单位 元/年)
    this.expect_bonus = "";
    //期望年薪最小值(单位 元/年)
    this.expect_annual_salary_from = "";
    //期望年薪最大值(单位 元/年)
    this.expect_annual_salary_to = "";
    //到岗时间
    this.expect_work_at = "";
    //婚姻状况(Y：已婚；N：未婚；U：未知)
    this.marital =  "U";
    //是否已育(Y：已育；N：未育；U：未知)
    this.is_fertility = "U";
    //居住地是否有住房(Y：有住房；N：没有住房；U：未知)
    this.is_house = "U";
    //是否与家人同住(Y：同住；N：不同住；U：未知)
    this.live_family = "U";
    //兴趣
    this.interests = "";
    //是否有海外经历(Y：有；N：没有；U:未知)
    this.overseas = "U";
    //自我评价
    this.self_remark = "";
    //政治面貌
    this.political_status = "";
    //期望工作性质
    this.expect_type = "";
    //期望从事职业
    this.expect_position_name = "";
    //期望从事行业
    this.expect_industry_name = "";
    //其他信息
    this.other_info = "";
    //学历
    this.degree = "";
    //毕业院校
    this.school = "";
    //年收入
    this.current_salary = "";
    //毕业时间
    this.graduate_date = "";
}

//工作信息
function WorkInfo() {
    //开始时间
    this.start_time = "";
    //结束时间
    this.end_time = "";
    //是否至今（是：Y；否：N；）
    this.so_far = "N";
    //公司
    this.corporation_name = "";
    //规模
    this.scale = "";
    //岗位类别
    this.station_name = "";
    //汇报对象
    this.reporting_to = "";
    //下属人数
    this.subordinates_count = "";
    //是否有管理经验(Y：有；N：无；未知：U)
    this.management_experience = "U";
    //当前薪资最小值(单位 K)
    this.basic_salary_from = "";
    //当前薪资最大值(单位 K)
    this.basic_salary_to = "";
    //薪资月数
    this.salary_month = "";
    //其他收入(单位 K)
    this.bonus = "";
    //年薪最小值(单位 K)
    this.annual_salary_from = "";
    //年薪最大值(单位 K)
    this.annual_salary_to = "";
    //公司描述
    this.corporation_desc = "";
    //工作地点
    this.city = "";
    //公司性质
    this.corporation_type = "";
    //部门
    this.architecture_name = "";
    //岗位
    this.position_name = "";
    //职责
    this.responsibilities = "";
    //行业
    this.industry_name = "";
}

//教育信息
function EduInfo(){
    //开始时间
    this.start_time = "";
    //结束时间
    this.end_time = "";
    //是否至今（是：Y；否：N；）
    this.so_far = "N";
    //学校
    this.school_name = "";
    //专业
    this.discipline_name = "";
    //学历
    this.degree = "";
    //专业描述
    this.discipline_desc = "";
    //是否统招（是：Y；否：N；未知：U）
    this.is_entrance = "U";
}

//语言信息
function LanInfo() {
    //语言类别
    this.name = "";
    //掌握程度
    this.level = "";
    //证书
    this.certificate = "";
}

//项目信息
function ProInfo() {
    //开始时间
    this.start_time = "";
    //结束时间
    this.end_time = "";
    //是否至今（是：Y；否：N；）
    this.so_far = "N";
    //项目名称
    this.name = "";
    //软件环境
    this.soft_env = "";
    //硬件环境
    this.hard_env = "";
    //开发工具
    this.develop_tool = "";
    //项目描述
    this.describe = "";
    //职责描述
    this.responsibilities = "";
}

//证书信息
function CerInfo() {
    //获得时间
    this.start_time = "";
    //证书名称
    this.name = "";
    //描述
    this.description = "";
}

//培训信息
function TraInfo() {
    //开始时间
    this.start_time = "";
    //结束时间
    this.end_time = "";
    //是否至今（是：Y；否：N；）
    this.so_far = "N";
    //培训课程
    this.name = "";
    //培训地点
    this.city = "";
    //培训机构
    this.authority = "";
    //获得证书
    this.certificate = "";
    //详细描述
    this.description = "";
}

//技能信息
function SkiInfo() {
    //名称
    this.name = "";
    //掌握程度
    this.level = "";
    //使用时间（月）
    this.period = "";
}