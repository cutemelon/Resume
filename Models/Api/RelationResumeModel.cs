using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Api
{
    public class RelationResumeModel : ApiBaseEntity
    {
        /// <summary>
        /// 简历来源1-智联2-无忧3-中华人才网4-猎聘6-e成
        /// </summary>
        public string siteCode { get; set; }

        /// <summary>
        /// 简历Id
        /// </summary>
        public string resumeId { get; set; }

        /// <summary>
        /// 搜索类型0模糊，1精确
        /// </summary>
        public int searchType { get; set; }

        /// <summary>
        /// 员工工号
        /// </summary>
        public string employeeNo { get; set; }

        /// <summary>
        /// 版本
        /// </summary>
        public string p_version { get; set; }

        /// <summary>
        /// 来源
        /// </summary>
        public string p_browser { get; set; }
    }
}
