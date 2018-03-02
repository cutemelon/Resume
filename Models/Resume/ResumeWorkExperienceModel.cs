using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Resume
{
    [Serializable]
    [TableInfo("resume_work_experience")]
    public class ResumeWorkExperienceModel : BaseEntity
    {
        [GuidIdentity]
        public Guid resume_id { get; set; }

        public string start_time { get; set; }
        public string end_time { get; set; }
        public string so_far { get; set; }
        public string corporation_name { get; set; }
        public string scale { get; set; }
        public string station_name { get; set; }
        public string reporting_to { get; set; }
        public string subordinates_count { get; set; }
        public string management_experience { get; set; }
        public string basic_salary_from { get; set; }
        public string basic_salary_to { get; set; }
        public string salary_month { get; set; }
        public string bonus { get; set; }
        public string annual_salary_from { get; set; }
        public string annual_salary_to { get; set; }
        public string corporation_desc { get; set; }
        public string city { get; set; }
        public string corporation_type { get; set; }
        public string architecture_name { get; set; }
        public string position_name { get; set; }
        public string responsibilities { get; set; }
        public string industry_name { get; set; }
    }
}
