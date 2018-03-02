using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Infrastructure.Log;

namespace ResumeManagementSystem.Filter
{
    public class ServiceFilter : ActionFilterAttribute
    {
        private readonly string Key = "_thisWebApiOnActionMonitorLog_";
        public override void OnActionExecuting(HttpActionContext actionContext) {
            base.OnActionExecuting(actionContext);
            OnActionExecutingRequestMonitor(actionContext);
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            OnActionExecutedResponseMonitor(actionExecutedContext);
        }

        #region 请求日志记录

        /// <summary>
        /// 请求前记录请求信息
        /// </summary>
        /// <param name="actionContext"></param>
        public void OnActionExecutingRequestMonitor(HttpActionContext actionContext)
        {
            var monLog = new WebApiMonitorLog();
            monLog.ExecuteStartTime = DateTime.Now;
            //获取Action 参数
            monLog.ActionParams = actionContext.ActionArguments;
            monLog.HttpRequestHeaders = actionContext.Request.Headers.ToString();
            monLog.HttpMethod = actionContext.Request.Method.Method;

            actionContext.Request.Properties[Key] = monLog;
            var form = System.Web.HttpContext.Current.Request.Form;
            #region 如果参数是实体对象，获取序列化后的数据
            var stream = actionContext.Request.Content.ReadAsStreamAsync().Result;
            var encoding = Encoding.UTF8;
            stream.Position = 0;
            string responseData = "";
            using (var reader = new StreamReader(stream, encoding))
            {
                responseData = reader.ReadToEnd().ToString();
            }
            if (!string.IsNullOrWhiteSpace(responseData) && !monLog.ActionParams.ContainsKey("__EntityParamsList__"))
            {
                monLog.ActionParams["__EntityParamsList__"] = responseData;
            }
            #endregion
        }

        /// <summary>
        /// 请求后记录返回值信息
        /// </summary>
        /// <param name="actionExecutedContext"></param>
        public void OnActionExecutedResponseMonitor(HttpActionExecutedContext actionExecutedContext)
        {
            var monLog = actionExecutedContext.Request.Properties[Key] as WebApiMonitorLog ?? new WebApiMonitorLog();
            monLog.ExecuteEndTime = DateTime.Now;
            monLog.ActionName = actionExecutedContext.ActionContext.ActionDescriptor.ActionName;
            monLog.ControllerName =
                actionExecutedContext.ActionContext.ActionDescriptor.ControllerDescriptor.ControllerName;
            if (actionExecutedContext.ActionContext.Response != null)
            {
                monLog.ReturnValue = actionExecutedContext.ActionContext.Response.Content.ReadAsStringAsync().Result;
            }
            else
            {
                monLog.ReturnValue = "无返回值";
            }
            LogHelper.Monitor(monLog.GetLoginfo());
            if (actionExecutedContext.Exception != null)
            {
                string msg = string.Format(@"
                请求【{0}Controller】的【{1}】产生异常：
                Action参数： {2}
                Http请求头： {3}
                  客户端IP： {4}
                HttpMethod： {5}
                    ", monLog.ControllerName, monLog.ActionName, monLog.GetCollections(monLog.ActionParams),
                    monLog.HttpRequestHeaders, monLog.GetIP(), monLog.HttpMethod);
                LogHelper.Error(msg, actionExecutedContext.Exception);
            }
        }

        #endregion
    }
}