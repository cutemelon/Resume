using System;

namespace Models.SystemManage
{
    [Serializable]
    [TableInfo("userInfo")]
    public class UserModel : BaseEntity
    {
        [GuidIdentity]
        public Guid user_id { get; set; }

        public Guid tenant_id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string name { get; set; }
        public string mobile { get; set; }
        public string email { get; set; }
        public string status { get; set; }
        public string company_admin { get; set; }
        public string system_admin { get; set; }
        public DateTime? create_time { get; set; }
        public Guid create_by { get; set; }
        public DateTime? last_update_time { get; set; }
        public Guid last_update_by { get; set; }

        #region 扩展字段


        #endregion

    }
}
