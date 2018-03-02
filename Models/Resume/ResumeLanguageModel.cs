using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Resume
{
    [Serializable]
    [TableInfo("resume_language")]
    public class ResumeLanguageModel : BaseEntity
    {
        [GuidIdentity]
        public Guid resume_id { get; set; }

        public string name { get; set; }
        public string level { get; set; }
        public string certificate { get; set; }
    }
}
