using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Api
{
    public class ResumeSearchEntity
    {
        public string Birth { get; set; }
        public string Sex { get; set; }
        public string School { get; set; }
        public string Company { get; set; }
        public string CompanyAll { get; set; }
        public string ExtId { get; set; }

        public string SiteCode { get; set; }
        public string CandidateName { get; set; } //简历姓名
        public string Email { get; set; } //邮箱
        public string Mobile { get; set; } //手机
        public string MobileLast { get; set; } //手机后四位
        public string GraduateYear { get; set; } //毕业年份
        public string Cities { get; set; } //目前所在地、期望工作地
        public string Registry { get; set; } //户口
        public string EmployeeNo { get; set; } //当前用户
        public int SearchType { get; set; } //搜索类型，0-小智模糊 1-小智精确 2-浏览器镜像模糊 3-浏览器镜像精确

        public string UserIp { get; set; }
        public string UserBrowser { get; set; }

        public ExtraDatas ExtraDatas;

        public string token { get; set; }
    }

    public class ExtraDatas
    {
        public string UserName { get; set; }
        public string HidResumeId { get; set; }
        public string ResumeUserId { get; set; }
    }

    public class ConnectionSearchEntity
    {
        public string SiteCode { get; set; }
        public int SearchType { get; set; } //搜索类型，0-小智模糊 1-小智精确 2-浏览器镜像模糊 3-浏览器镜像精确
        public string EmployeeNo { get; set; }
        public string ExtId { get; set; }
        public string UserIp { get; set; }
        public string UserBrowser { get; set; }
    }

    public class ResultErrorModel
    {
        /// <summary>
        /// 简历来源
        /// </summary>
        public string siteCode { get; set; }

        /// <summary>
        /// 简历ID
        /// </summary>
        public string resumeId { get; set; }

        /// <summary>
        /// 员工工号
        /// </summary>
        public string employeeNo { get; set; }

        /// <summary>
        /// 版本号
        /// </summary>
        public string p_version { get; set; }

        /// <summary>
        /// 浏览器
        /// </summary>
        public string p_browser { get; set; }
    }
}
