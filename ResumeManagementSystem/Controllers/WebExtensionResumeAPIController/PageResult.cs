using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Models.Api;
using Models.Common;

namespace ResumeManagementSystem.Controllers.WebExtensionResumeAPIController
{
    public class PageResult : ApiController
    {
        /// <summary>
        /// 需要验证token的返回
        /// </summary>
        /// <returns></returns>
        public string JsonPageResult(string content, int result = 1)
        {
            var model = new ApiReturnModel();
            model.token = "";
            model.resultContent = content;
            model.result = result;
            return Newtonsoft.Json.JsonConvert.SerializeObject(model);
        }

        /// <summary>
        /// 过滤器返回
        /// </summary>
        /// <param name="content"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public string ErrorFilter(string content, int result = 0)
        {
            var model = new ApiReturnModel();
            model.token = "";
            model.resultContent = content;
            model.result = result;
            return Newtonsoft.Json.JsonConvert.SerializeObject(model);
        }

        #region 公共方法

        /// <summary>
        /// 获得请求的主机信息
        /// </summary>
        /// <returns></returns>
        public string GetIPAddress()
        {
            string ip = string.Empty;
            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.ServerVariables["HTTP_VIA"]))
                ip = Convert.ToString(System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"]);
            if (string.IsNullOrEmpty(ip))
                ip = Convert.ToString(System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"]);
            return ip;
        }

        #endregion

    }
}