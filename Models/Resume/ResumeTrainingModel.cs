using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Resume
{
    [Serializable]
    [TableInfo("resume_training")]
    public class ResumeTrainingModel : BaseEntity
    {
        [GuidIdentity]
        public string resume_id { get; set; }

        public string start_time { get; set; }
        public string end_time { get; set; }
        public string so_far { get; set; }
        public string name { get; set; }
        public string city { get; set; }
        public string authority { get; set; }
        public string certificate { get; set; }
        public string description { get; set; }
    }
}
