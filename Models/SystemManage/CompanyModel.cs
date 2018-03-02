using System;

namespace Models.SystemManage
{
    [Serializable]
    [TableInfo("company")]
    public class CompanyModel : BaseEntity
    {
        [GuidIdentity]
        public Guid company_id { get; set; }

        public Guid tenant_id { get; set; }
        public string company_name { get; set; }
        public string phone { get; set; }
        public string qq { get; set; }
        public string mobile { get; set; }
        public string location { get; set; }
        public string DB_name { get; set; }
        public string DB_IP_address { get; set; }
        public string status { get; set; }
        public string contact { get; set; }
        public string description { get; set; }
        public DateTime? create_time { get; set; }
        public Guid create_by { get; set; }
        public DateTime? last_update_time { get; set; }
        public Guid last_update_time_by { get; set; }
    }
}
