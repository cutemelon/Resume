using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Resume
{
    [Serializable]
    [TableInfo("resume_change_log")]
    public class ResumeChangeLogModel : BaseEntity
    {
        [GuidIdentity]
        public Guid row_id { get; set; }

        public Guid resume_id { get; set; }
        public Guid tenant_id { get; set; }
        public string change_log { get; set; }
        public Guid created_by { get; set; }
        public DateTime? created_time { get; set; }
    }
}
