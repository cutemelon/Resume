using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;
using DatabaseInterface.ResumeInterface;
using DatabaseService.ResumeService;
using Extensions;
using Models.SystemManage;
using MvcExtend;


namespace ResumeManagementSystem.Controllers.Resume
{
    public class ResumeController : Controller
    {
        private IResumeDb resumeDb;
        private static HttpSessionState _session = System.Web.HttpContext.Current.Session;

        /// <summary>
        /// 简历页面
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 获取简历List
        /// </summary>
        /// <param name="expectPosition"></param>
        /// <param name="degree"></param>
        /// <param name="gender"></param>
        /// <param name="name"></param>
        /// <param name="address"></param>
        /// <param name="age"></param>
        /// <param name="workExperience"></param>
        /// <param name="company"></param>
        /// <param name="position"></param>
        /// <param name="pageNo"></param>
        /// <param name="size"></param>
        /// <returns></returns>
        public JsonResult GetResumeList(string expectPosition, string degree, string gender, string name, string address, string age, string workExperience, string company, string position, int? pageNo, int? size)
        {
            int pageIndex = pageNo ?? 1;
            int pageSize = size ?? 20;
            string CurrentUserConnectionInfo = _session["CurrentUserConnectionInfo"] as string;
            if (!string.IsNullOrEmpty(CurrentUserConnectionInfo))
                resumeDb = new ResumeDb(CurrentUserConnectionInfo);
            int total = 0;
            var dataList = resumeDb.GetResumeList(out total, position, pageIndex, pageSize);
            return Json(new { dataList, recordCount = total }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ResumeDetail()
        {
            return View();
        }
    }
}
