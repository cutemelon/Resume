using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ApplicationExtensions;
using DatabaseInterface.SystemInterface;
using DatabaseService.SystemService;
using Extensions;
using Models.SystemManage;

namespace ResumeManagementSystem.Controllers
{
    public class LoginController : Controller
    {
        private IUserDb userDb;
        private ICompanyDb companyDb = new CompanyDb();

        #region

        /// <summary>
        ///     当前用户
        /// </summary>
        public UserModel CurrentUser
        {
            get { return Session["currentUser"] as UserModel; }
            set { Session["currentUser"] = value; }
        }

        /// <summary>
        /// 公司信息
        /// </summary>
        public CompanyModel CurrentCompany
        {
            get { return Session["currentCompany"] as CompanyModel; }
            set { Session["currentCompany"] = value; }
        }

        /// <summary>
        /// 链接信息
        /// </summary>
        public string CurrentUserConnectionInfo
        {
            get { return Session["CurrentUserConnectionInfo"] as string; }
            set { Session["CurrentUserConnectionInfo"] = value; }
        }

        #endregion
        
        public ActionResult Index()
        {
            return View();
        }

        #region

        public JsonResult UserLogin(string account = "", string password = "", string companyName = "")
        {
            var company = companyDb.GetCompanyByCompanyCode(companyName);
            if (company == null)
            {
                return Json(new { result = 0, msg = "公司、用户名或密码错误！" }, JsonRequestBehavior.AllowGet);
            }
            CurrentCompany = company;
            CurrentUserConnectionInfo = new ApplicationCommon().GetUserDBConnection(company);
            userDb = new UserDb(CurrentUserConnectionInfo);
            var user = userDb.GetUserByUsername(account);
            if (user == null)
            {
                return Json(new { result = 0, msg = "公司、用户名或密码错误！" }, JsonRequestBehavior.AllowGet);
            }
            if (!user.password.Trim().Equals(password.GetMd5(2), StringComparison.CurrentCultureIgnoreCase))
            {
                return Json(new { result = 0, msg = "公司、用户名或密码错误！" }, JsonRequestBehavior.AllowGet);
            }
            if (user.status == 2)
            {
                return Json(new { result = 0, msg = "账户已被冻结！" }, JsonRequestBehavior.AllowGet);
            }
            CurrentUser = user;
            return Json(new { result = 1, msg = "" }, JsonRequestBehavior.AllowGet);
        }

        #endregion

    }
}
