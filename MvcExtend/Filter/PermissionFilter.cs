using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web.Http.Filters;
using System.Web.Mvc;
using Infrastructure.Log;
using ActionFilterAttribute = System.Web.Mvc.ActionFilterAttribute;

namespace MvcExtend.Filter
{
    public class PermissionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var errorString = "";
            var checkresult = CheckPermission(filterContext, out errorString);
            if (checkresult == PermissionCheckResult.Passed)
            {
                base.OnActionExecuting(filterContext);
                return;
            }
            var controller = filterContext.Controller as System.Web.Mvc.Controller;
            MethodInfo[] methods = GetActions(filterContext);
            var method = methods.First(p => p.Name.Equals(filterContext.ActionDescriptor.ActionName, StringComparison.CurrentCultureIgnoreCase));

            Type returnType = method.ReturnType;

            filterContext.Result = new RedirectResult(controller.Url.Action("Index", "Login"));
            
        }

        protected virtual PermissionCheckResult CheckPermission(ActionExecutingContext filterContext, out string message)
        {
            message = "";
            //检查Session
            if (!CheckSession(filterContext))
            {
                message = "请登录";
                return PermissionCheckResult.NeedLogin;
            }
            return PermissionCheckResult.Passed;
        }

        private static bool CheckSession(ControllerContext context)
        {
            if (context.HttpContext == null)
            {
                return false;
            }
            if (context.HttpContext.Session == null)
            {
                return false;
            }
            if (context.HttpContext.Session["currentUser"] == null)
            {
                return false;
            }
            return true;
        }

        private static MethodInfo[] GetActions(ActionExecutingContext context)
        {
            MethodInfo[] methods =
                context.ActionDescriptor.ControllerDescriptor.ControllerType.GetMethods();
            return methods;
        }

        #region

        public enum PermissionCheckResult
        {
            /// <summary>
            /// 通过验证
            /// </summary>
            Passed,
            /// <summary>
            /// 需要登陆（没有Session）
            /// </summary>
            NeedLogin,
            /// <summary>
            /// 没有请求的权限
            /// </summary>
            NoPermission
        }

        #endregion
    }
}