using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.ShowModel.SystemManage
{
    [Serializable]
    [TableInfo("company")]
    public class CompanyListShow : BaseEntity

    {
        [ExcludeField]
        public string RowIndex { get; set; }
        public string company_id { get; set; }
        public string company_name { get; set; }
        public string create_time { get; set; }
    }
}
