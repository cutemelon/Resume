using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Api
{
    public class StructuredImportModel : ApiBaseEntity
    {
        public string employeeNo { get; set; }
        public string p_version { get; set; }
        public string p_browser { get; set; }
        public StructuredResumeModel structuredResumeDetail { get; set; }
    }
}
