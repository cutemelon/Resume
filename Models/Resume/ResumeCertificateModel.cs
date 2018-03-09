using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Resume
{
    [Serializable]
    [TableInfo("resume_certificate")]
    public class ResumeCertificateModel : BaseEntity
    {
        [GuidIdentity]
        public string resume_id { get; set; }

        public string start_time { get; set; }
        public string name { get; set; }
        public string description { get; set; }
    }
}
