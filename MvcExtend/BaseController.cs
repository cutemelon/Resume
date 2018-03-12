using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Models.SystemManage;
using MvcExtend.Filter;

namespace MvcExtend
{
    [PermissionFilter]
    public class BaseController : Controller
    {
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
    }
}
