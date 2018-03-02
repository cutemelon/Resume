using System;

namespace Models.SystemManage
{
    [Serializable]
    [TableInfo("system_operate_log")]
    public class SystemOperateLogModel : BaseEntity
    {
        [GuidIdentity]
        public Guid row_id { get; set; }

        public Guid operater { get; set; }
        public Guid tenant_id { get; set; }
        public string operate_type { get; set; }
        public string ip_address { get; set; }
        public DateTime operate_time { get; set; }
        public string description { get; set; }
    }
}
