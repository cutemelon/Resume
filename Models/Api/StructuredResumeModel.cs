using System.Collections.Generic;

namespace Models.Api
{
    public class StructuredResumeModel : ApiBaseEntity
    {
        /// <summary>
        /// 更新信息
        /// </summary>
        public UpdateInfo update_info { get; set; }

        /// <summary>
        /// 联系方式
        /// </summary>
        public Contact contact { get; set; }

        /// <summary>
        /// 简历来源
        /// </summary>
        public int?[] src { get; set; }

        /// <summary>
        /// 简历是否可以购买到，0 表示不能，1 表示可以
        /// </summary>
        public int? can_buy { get; set; }

        /// <summary>
        /// 匹配得分
        /// </summary>
        public int? score { get; set; }

        /// <summary>
        /// 更新时间
        /// </summary>
        public string updated_at { get; set; }

        /// <summary>
        /// RMS简历ID
        /// </summary>
        public string repeatId { get; set; }

        /// <summary>
        /// 上传类型0-手动新增1-手动更新2-自动新增4-自动更新
        /// </summary>
        public int importType { get; set; }

        /// <summary>
        /// 简历原文
        /// </summary>
        public string htmlContent { get; set; }

        /// <summary>
        /// 不带标签的简历原文
        /// </summary>
        public string noHtmlContent { get; set; }

        /// <summary>
        /// 个人信息
        /// </summary>
        public BaseInfo basic { get; set; }

        /// <summary>
        /// 工作信息
        /// </summary>
        public List<WorkInfo> work { get; set; }

        /// <summary>
        /// 教育信息
        /// </summary>
        public List<EduInfo> education { get; set; }

        /// <summary>
        /// 语言信息
        /// </summary>
        public List<LanInfo> language { get; set; }

        /// <summary>
        /// 项目信息
        /// </summary>
        public List<ProInfo> project { get; set; }

        /// <summary>
        /// 证书信息
        /// </summary>
        public List<CerInfo> certificate { get; set; }

        /// <summary>
        /// 培训信息
        /// </summary>
        public List<TraInfo> training { get; set; }

        /// <summary>
        /// 技能信息
        /// </summary>
        public List<SkiInfo> skill { get; set; } 
    }

    public class UpdateInfo
    {
        /// <summary>
        /// 简历更新时间
        /// </summary>
        public string updated_at { get; set; }

        /// <summary>
        /// 0：无更新，1 表示工作经历有更新
        /// </summary>
        public string workdiff { get; set; }

        /// <summary>
        /// 0：无更新，1 表示项目经历有更新
        /// </summary>
        public string projectdiff { get; set; }

        /// <summary>
        /// 0：无更新，1 表示工作地点有更新
        /// </summary>
        public string addressdiff { get; set; }

        /// <summary>
        /// 0：无更新，1 表示期望城市有更新
        /// </summary>
        public string expect_citydiff { get; set; }
    }

    public class Contact
    {
        public string phone { get; set; }

        public string email { get; set; }

        public string qq { get; set; }

        public string tel { get; set; }

        public string sina { get; set; }

        public string ten { get; set; }

        public string msn { get; set; }

        public string wechat { get; set; }
    }

    public class BaseInfo
    {
        /// <summary>
        /// 简历ID（显示ID）
        /// </summary>
        public string id { get; set; }

        /// <summary>
        /// 简历ID（隐藏域ID）
        /// </summary>
        public string hidId { get; set; }

        /// <summary>
        /// 简历用户ID
        /// </summary>
        public string resumeUserId { get; set; }

        /// <summary>
        /// 姓名
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// 头像
        /// </summary>
        public string photo { get; set; }

        /// <summary>
        /// 性别 0-男 1-女 2-未知
        /// </summary>
        public string gender { get; set; }

        /// <summary>
        /// 国籍
        /// </summary>
        public string nation { get; set; }

        /// <summary>
        /// 工作经验（年）
        /// </summary>
        public string work_experience { get; set; }

        /// <summary>
        /// 生日
        /// </summary>
        public string birth { get; set; }

        /// <summary>
        /// 年龄
        /// </summary>
        public int? age { get; set; }

        /// <summary>
        /// 期望工作地点
        /// </summary>
        public string expect_city_ids { get; set; }

        /// <summary>
        /// 当前状态
        /// </summary>
        public string current_status { get; set; }

        /// <summary>
        /// 现住地（省）
        /// </summary>
        public string address_province { get; set; }

        /// <summary>
        /// 地址
        /// </summary>
        public string address { get; set; }

        /// <summary>
        /// 户口所在地（省）
        /// </summary>
        public string account_province { get; set; }

        /// <summary>
        /// 区县
        /// </summary>
        public string account { get; set; }

        /// <summary>
        /// 期望月薪最小值(单位 元)
        /// </summary>
        public string expect_salary_from { get; set; }

        /// <summary>
        /// 期望月薪最大值 (单位 元)
        /// </summary>
        public string expect_salary_to { get; set; }

        /// <summary>
        /// 期望薪资月数
        /// </summary>
        public string expect_salary_month { get; set; }

        /// <summary>
        /// 期望其他收入(单位 元)
        /// </summary>
        public string expect_bonus { get; set; }

        /// <summary>
        /// 期望年薪最小值(单位 元)
        /// </summary>
        public string expect_annual_salary_from { get; set; }

        /// <summary>
        /// 期望年薪最大值(单位 元)
        /// </summary>
        public string expect_annual_salary_to { get; set; }

        /// <summary>
        /// 到岗时间
        /// </summary>
        public string expect_work_at { get; set; }

        /// <summary>
        /// 婚姻状况(Y：已婚；N：未婚；U：未知)
        /// </summary>
        public string marital { get; set; }

        /// <summary>
        /// 是否已育(Y：已育；N：未育；U：未知)
        /// </summary>
        public string is_fertility { get; set; }

        /// <summary>
        /// 居住地是否有住房(Y：有住房；N：没有住房；U：未知)
        /// </summary>
        public string is_house { get; set; }

        /// <summary>
        /// 是否与家人同住(Y：同住；N：不同住；U：未知)
        /// </summary>
        public string live_family { get; set; }

        /// <summary>
        /// 兴趣
        /// </summary>
        public string interests { get; set; }

        /// <summary>
        /// 是否有海外经历(Y：有；N：没有)
        /// </summary>
        public string overseas { get; set; }

        /// <summary>
        /// 自我评价
        /// </summary>
        public string self_remark { get; set; }

        /// <summary>
        /// 政治面貌
        /// </summary>
        public string political_status { get; set; }

        /// <summary>
        /// 期望工作性质
        /// </summary>
        public string expect_type { get; set; }

        /// <summary>
        /// 期望从事职业
        /// </summary>
        public string expect_position_name { get; set; }

        /// <summary>
        /// 期望从事行业
        /// </summary>
        public string expect_industry_name { get; set; }

        /// <summary>
        /// 其他信息
        /// </summary>
        public string other_info { get; set; }

        /// <summary>
        /// 学历
        /// </summary>
        public string degree { get; set; }

        /// <summary>
        /// 毕业院校
        /// </summary>
        public string school = "";

        /// <summary>
        /// 年收入
        /// </summary>
        public string current_salary = "";

        /// <summary>
        /// 毕业时间
        /// </summary>
        public string graduate_date = "";
    }

    public class WorkInfo
    {
        /// <summary>
        /// 开始时间
        /// </summary>
        public string start_time { get; set; }

        /// <summary>
        /// 结束时间
        /// </summary>
        public string end_time { get; set; }

        /// <summary>
        /// 是否至今（是：Y；否：N；）
        /// </summary>
        public string so_far { get; set; }

        /// <summary>
        /// 公司
        /// </summary>
        public string corporation_name { get; set; }

        /// <summary>
        /// 规模
        /// </summary>
        public string scale { get; set; }

        /// <summary>
        /// 岗位类别
        /// </summary>
        public string station_name { get; set; }

        /// <summary>
        /// 汇报对象
        /// </summary>
        public string reporting_to { get; set; }

        /// <summary>
        /// 下属人数
        /// </summary>
        public string subordinates_count { get; set; }

        /// <summary>
        /// 是否有管理经验(Y：有；N：无；U：未知)
        /// </summary>
        public string management_experience { get; set; }

        /// <summary>
        /// 当前薪资最小值(单位 元)
        /// </summary>
        public string basic_salary_from { get; set; }

        /// <summary>
        /// 当前薪资最大值(单位 元)
        /// </summary>
        public string basic_salary_to { get; set; }

        /// <summary>
        /// 薪资月数
        /// </summary>
        public string salary_month { get; set; }

        /// <summary>
        /// 其他收入(单位 元)
        /// </summary>
        public string bonus { get; set; }

        /// <summary>
        /// 年薪最小值(单位 元)
        /// </summary>
        public string annual_salary_from { get; set; }

        /// <summary>
        /// 年薪最大值(单位 元)
        /// </summary>
        public string annual_salary_to { get; set; }

        /// <summary>
        /// 公司描述
        /// </summary>
        public string corporation_desc { get; set; }

        /// <summary>
        /// 工作地点
        /// </summary>
        public string city { get; set; }

        /// <summary>
        /// 公司性质
        /// </summary>
        public string corporation_type { get; set; }

        /// <summary>
        /// 部门
        /// </summary>
        public string architecture_name { get; set; }

        /// <summary>
        /// 岗位
        /// </summary>
        public string position_name { get; set; }

        /// <summary>
        /// 职责
        /// </summary>
        public string responsibilities { get; set; }

        /// <summary>
        /// 行业
        /// </summary>
        public string industry_name { get; set; }

        /// <summary>
        /// 行业id
        /// </summary>
        public int? industry_id { get; set; }

    }

    public class EduInfo
    {
        /// <summary>
        /// 开始时间
        /// </summary>
        public string start_time { get; set; }

        /// <summary>
        /// 结束时间
        /// </summary>
        public string end_time { get; set; }

        /// <summary>
        /// 是否至今（是：Y；否：N；）
        /// </summary>
        public string so_far { get; set; }

        /// <summary>
        /// 学校
        /// </summary>
        public string school_name { get; set; }

        /// <summary>
        /// 专业
        /// </summary>
        public string discipline_name { get; set; }

        /// <summary>
        /// 学历
        /// </summary>
        public string degree { get; set; }

        /// <summary>
        /// 专业描述
        /// </summary>
        public string discipline_desc { get; set; }

        /// <summary>
        /// 是否统招（是：Y；否：N；未知：U）
        /// </summary>
        public string is_entrance { get; set; }
    }

    public class LanInfo
    {
        /// <summary>
        /// 语言类别
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// 掌握程度
        /// </summary>
        public string level { get; set; }

        /// <summary>
        /// 证书
        /// </summary>
        public string certificate { get; set; }
    }

    public class ProInfo
    {
        /// <summary>
        /// 开始时间
        /// </summary>
        public string start_time { get; set; }

        /// <summary>
        /// 结束时间
        /// </summary>
        public string end_time { get; set; }

        /// <summary>
        /// 是否至今（是：Y；否：N；）
        /// </summary>
        public string so_far { get; set; }

        /// <summary>
        /// 项目名称
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// 软件环境
        /// </summary>
        public string soft_env { get; set; }

        /// <summary>
        /// 硬件环境
        /// </summary>
        public string hard_env { get; set; }

        /// <summary>
        /// 开发工具
        /// </summary>
        public string develop_tool { get; set; }

        /// <summary>
        /// 项目描述
        /// </summary>
        public string describe { get; set; }

        /// <summary>
        /// 职责描述
        /// </summary>
        public string responsibilities { get; set; }
    }

    public class CerInfo
    {
        /// <summary>
        /// 获得时间
        /// </summary>
        public string start_time { get; set; }

        /// <summary>
        /// 证书名称
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        public string description { get; set; }
    }

    public class TraInfo
    {
        /// <summary>
        /// 开始时间
        /// </summary>
        public string start_time { get; set; }

        /// <summary>
        /// 结束时间
        /// </summary>
        public string end_time { get; set; }

        /// <summary>
        /// 是否至今（是：Y；否：N；）
        /// </summary>
        public string so_far { get; set; }

        /// <summary>
        /// 培训课程
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// 培训地点
        /// </summary>
        public string city { get; set; }

        /// <summary>
        /// 培训机构
        /// </summary>
        public string authority { get; set; }

        /// <summary>
        /// 获得证书
        /// </summary>
        public string certificate { get; set; }

        /// <summary>
        /// 详细描述
        /// </summary>
        public string description { get; set; }
    }

    public class SkiInfo
    {
        /// <summary>
        /// 名称
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// 掌握程度
        /// </summary>
        public string level { get; set; }

        /// <summary>
        /// 使用时间（月）
        /// </summary>
        public string period { get; set; }
    }
}
