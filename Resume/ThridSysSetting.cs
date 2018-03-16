using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models.Api;

namespace Resume
{
    public class ThridSysSetting
    {
        public static List<ThridSite> SiteList = new List<ThridSite>()
        {
            new ThridSite(){ SiteCode = 1, CnName = "智联招聘", ShortPinYinName = "ZP", RmsName = "ZhaoPin"},
            new ThridSite(){ SiteCode = 2, CnName = "前程无忧", ShortPinYinName = "WY", RmsName = "51job"},
            new ThridSite(){ SiteCode = 3, CnName = "中国人才热线", ShortPinYinName = "ZG", RmsName = "CJOL"},
            new ThridSite(){ SiteCode = 4, CnName = "猎聘网", ShortPinYinName = "LP", RmsName = "猎聘网"},
            new ThridSite(){ SiteCode = 6, CnName = "e成网", ShortPinYinName = "EC", RmsName = "e成"},
            new ThridSite(){ SiteCode = 7, CnName = "e成推荐", ShortPinYinName = "ECTJ", RmsName = "e成推荐"},
            new ThridSite(){ SiteCode = 8, CnName = "58同城", ShortPinYinName = "58TC", RmsName = "58同城"}
        };

        public static ThridSite GetSite(int siteCode)
        {
            return SiteList.FirstOrDefault(s => s.SiteCode == siteCode);
        }
    }
}
