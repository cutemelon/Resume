using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Resume
{
    [Serializable]
    [TableInfo("resume")]
    public class ResumeModel : BaseEntity
    {
        /// <summary>
        /// 简历ID
        /// </summary>
        [GuidIdentity]
        public string resume_id { get; set; }
        public string company_id { get; set; }
        public string created_by { get; set; }
        public DateTime created_time { get; set; }
        public string last_updated_by { get; set; }
        public DateTime? last_updated_time { get; set; }
        public int import_from { get; set; }
        public string import_type { get; set; }
        public DateTime? resume_updated_at { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string qq { get; set; }
        public string tel { get; set; }
        public string sina { get; set; }
        public string ten { get; set; }
        public string msn { get; set; }
        public string wechat { get; set; }
        public string src { get; set; }
        public string can_buy { get; set; }
        public string resume_orginalId { get; set; }
        public string resume_hideId { get; set; }
        public string resume_userId { get; set; }
        public string name { get; set; }
        public string photo { get; set; }
        public string gender { get; set; }
        public string nation { get; set; }
        public string work_experience { get; set; }
        public DateTime? birth { get; set; }
        public string age { get; set; }
        public string expect_city_ids { get; set; }
        public string current_status { get; set; }
        public string address_province { get; set; }
        public string address { get; set; }
        public string account_province { get; set; }
        public string account { get; set; }
        public string expect_salary_from { get; set; }
        public string expect_salary_to { get; set; }
        public string expect_salary_month { get; set; }
        public string expect_bonus { get; set; }
        public string expect_annual_salary_from { get; set; }
        public string expect_annual_salary_to { get; set; }
        public string expect_work_at { get; set; }
        public string marital { get; set; }
        public string is_fertility { get; set; }
        public string is_house { get; set; }
        public string live_family { get; set; }
        public string interests { get; set; }
        public string overseas { get; set; }
        public string self_remark { get; set; }
        public string political_status { get; set; }
        public string expect_type { get; set; }
        public string expect_position_name { get; set; }
        public string expect_industry_name { get; set; }
        public string other_info { get; set; }
        public string degree { get; set; }
        public string school { get; set; }
        public string graduate_date { get; set; }
        public string current_salary { get; set; }
        /// <summary>
        /// 简历状态 0-正常 1-更新删除 2-弃用 3-删除
        /// </summary>
        public int resume_status { get; set; }
        public string htmlContent { get; set; }
        public string noHtmlContent { get; set; }
        public string oldResumeId { get; set; }
    }
}
