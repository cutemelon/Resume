using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DatabaseInterface.SystemInterface;
using DatabaseService.SystemService;
using Extensions;
using Models.SystemManage;
using MvcExtend;

namespace ResumeManagementSystem.Controllers
{
    public class UserController : BaseController
    {
        private IUserDb userDb;

        /// <summary>
        /// 用户列表页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AddUser(string userId = "")
        {
            var user = new UserModel();
            if (!string.IsNullOrWhiteSpace(userId))
            {
                userDb = new UserDb(CurrentUserConnectionInfo);
                user = userDb.GetUserById(userId);
            }
            return View(user);
        }

        #region

        /// <summary>
        /// 获得用户列表
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="realName"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public JsonResult GetUserList(string userName = "", string realName = "", int pageIndex = 1, int pageSize = 20)
        {
            userDb = new UserDb(CurrentUserConnectionInfo);
            var total = 0;
            var dataList = userDb.GetUserList(out total, userName, realName, pageIndex, pageSize);
            return Json(new { dataList, recordCount = total }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 检查用户名重命名
        /// </summary>
        /// <param name="param"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public JsonResult CheckUserName(string param, string userId)
        {
            userDb = new UserDb(CurrentUserConnectionInfo);
            var user = userDb.GetUserByUsername(param);
            var result = true;
            if (user == null)
            {
                result = false;
            }
            else
            {
                if (user.user_id == userId)
                {
                    result = false;
                }
            }
            var status = result ? "n" : "y";
            var info = result ? "用户名已存在" : "";
            return Json(new { status, info }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 保存用户
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="userName"></param>
        /// <param name="mobile"></param>
        /// <param name="email"></param>
        /// <param name="realName"></param>
        /// <param name="isAdmin"></param>
        /// <returns></returns>
        public JsonResult SaveUser(string userId = "", string userName = "", string mobile = "", string email = "",
            string realName = "", int isAdmin = 0)
        {
            try
            {
                userDb = new UserDb(CurrentUserConnectionInfo);
                var user = new UserModel();
                if (!string.IsNullOrWhiteSpace(userId))
                {
                    user = userDb.GetUserById(userId);
                    if (user == null)
                    {
                        return Json(new { result = 0, msg = "保存失败！找不到该用户信息！" }, JsonRequestBehavior.AllowGet);
                    }
                }
                user.mobile = mobile;
                user.email = email;
                user.name = realName;
                user.last_update_by = CurrentUser.user_id;
                user.last_update_time = DateTime.Now;
                user.company_admin = isAdmin;
                if (string.IsNullOrWhiteSpace(userId))
                {
                    user.create_by = CurrentUser.user_id;
                    user.company_id = CurrentCompany.company_id;
                    user.create_time = user.last_update_time;
                    user.system_admin = 0;
                    user.user_id = Guid.NewGuid().ToString();
                    user.username = userName;
                    user.password = ("123456").GetMd5(2);
                    userDb.AddUser(user);
                }
                else
                {
                    userDb.UpdateUser(user);
                }
                return Json(new { result = 1, msg = "保存成功" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { result = 0, msg = "保存失败" }, JsonRequestBehavior.AllowGet);
            }
            
        }



        #endregion

    }
}
