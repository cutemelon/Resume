using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Resume
{
    [Serializable]
    [TableInfo("resume_project")]
    public class ResumeProjectModel : BaseEntity
    {
        [GuidIdentity]
        public Guid resume_id { get; set; }

        public string start_time { get; set; }
        public string end_time { get; set; }
        public string so_far { get; set; }
        public string name { get; set; }
        public string soft_env { get; set; }
        public string hard_env { get; set; }
        public string develop_tool { get; set; }
        public string describe { get; set; }
        public string responsibilities { get; set; }
    }
}
