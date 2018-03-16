using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Api
{
    /// <summary>
    ///     第三方站点
    /// </summary>
    public class ThridSite
    {
        //站点Id
        public int SiteCode { get; set; }
        //拼音缩写
        public string ShortPinYinName { get; set; }
        //中文名
        public string CnName { get; set; }
        //RMS中对应的中文名
        public string RmsName { get; set; }
    }
}
