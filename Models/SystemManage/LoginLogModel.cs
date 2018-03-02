using System;

namespace Models.SystemManage
{
    [Serializable]
    [TableInfo("login_log")]
    public class LoginLogModel : BaseEntity
    {
        [GuidIdentity]
        public Guid row_id { get; set; }

        public string login_name { get; set; }
        public DateTime login_time { get; set; }
        public string login_status { get; set; }
        public string ip_address { get; set; }
        public string response { get; set; }
    }
}
