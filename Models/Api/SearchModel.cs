using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Api
{
    public class SearchModel : ApiBaseEntity
    {
        public string name { get; set; }

        public string birthday { get; set; }

        public string cities { get; set; }

        public string company { get; set; }

        public string email { get; set; }

        public ExtraData extraDatas { get; set; }

        public string graduateYear { get; set; }

        public string identity { get; set; }

        public string mobile { get; set; }

        public string mobileLast { get; set; }

        public string registry { get; set; }

        public string school { get; set; }

        public string sex { get; set; }

        public string siteCode { get; set; }

        public string employeeNo { get; set; }

        public string p_version { get; set; }

        public string p_browser { get; set; }

    }

    public class ExtraData
    {
        //当前简历人员姓名
        public string userName { get; set; }

        //简历ID
        public string resumeId { get; set; }

        //当前简历显示ID
        public string extId { get; set; }

        //简历用户ID
        public string resumeUserId { get; set; }
    }
}
