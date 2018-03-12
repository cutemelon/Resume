using System;

namespace Models.SystemManage
{
    [Serializable]
    [TableInfo("userInfo")]
    public class UserModel : BaseEntity
    {
        [GuidIdentity]
        public string user_id { get; set; }

        public string company_id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string name { get; set; }
        public string mobile { get; set; }
        public string email { get; set; }
        /// <summary>
        /// 0-正常 1-删除 2-冻结
        /// </summary>
        public int status { get; set; }
        public int company_admin { get; set; }
        public int system_admin { get; set; }
        public DateTime? create_time { get; set; }
        public string create_by { get; set; }
        public DateTime? last_update_time { get; set; }
        public string last_update_by { get; set; }

        #region 扩展字段

        [ExcludeField]
        public int RowIndex { get; set; }

        #endregion

    }
}
