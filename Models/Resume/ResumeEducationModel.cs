using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Resume
{
    [Serializable]
    [TableInfo("resume_education")]
    public class ResumeEducationModel : BaseEntity
    {
        [GuidIdentity]
        public Guid resume_id { get; set; }

        public string start_time { get; set; }
        public string end_time { get; set; }
        public string so_far { get; set; }
        public string school_name { get; set; }
        public string discipline_name { get; set; }
        public string degree { get; set; }
        public string discipline_desc { get; set; }
        public string is_entrance { get; set; }
    }
}
