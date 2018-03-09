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
        public string row_id { get; set; }

        public string resume_id { get; set; }
        public string company_id { get; set; }
        public string change_log { get; set; }
        public string created_by { get; set; }
        public DateTime? created_time { get; set; }
    }
}
