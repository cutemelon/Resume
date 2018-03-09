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

        public CompanyModel CurrentCompany
        {
            get { return Session["currentTenant"] as CompanyModel; }
            set { Session["currentTenant"] = value; }
        }
    }
}
