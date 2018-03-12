using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using ApiManage;
using Models.Api;

namespace ResumeManagementSystem.Controllers.WebExtensionResumeAPIController.Filter
{
    public class AnonymousAttribute : Attribute
    {

    }

    /// <summary>
    /// token验证filter
    /// </summary>
    public class TokenVerificationAttribute : ActionFilterAttribute
    {
        private const string UserToken = "token";
        private TokenManage tokenManager = new TokenManage();

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            try
            {
                var anonymousAction = actionContext.ActionDescriptor.GetCustomAttributes<AnonymousAttribute>();
                if (!anonymousAction.Any())
                {
                    var token = TokenVerification(actionContext);
                }
                base.OnActionExecuting(actionContext);
            }
            catch (Exception e)
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Continue,
                    new PageResult().ErrorFilter(e.Message));
                base.OnActionExecuting(actionContext);
            }
        }

        protected virtual string TokenVerification(HttpActionContext actionContext)
        {
            // 获取token
            var token = GetToken(actionContext.ActionArguments, actionContext.Request.Method);
            // 判断token是否有效
            if (!tokenManager.VerifyToken(token))
            {
                throw new Exception("Token已失效!");
            }
            return token;
        }

        private string GetToken(Dictionary<string, object> actionArguments, HttpMethod type)
        {
            var token = "";

            if (type == HttpMethod.Post)
            {
                foreach (var value in actionArguments.Values)
                {
                    token = value.GetType().GetProperty(UserToken) == null
                        ? GetToken(actionArguments, HttpMethod.Get)
                        : value.GetType().GetProperty(UserToken).GetValue(value).ToString();
                }
            }
            else if (type == HttpMethod.Get)
            {
                if (!actionArguments.ContainsKey(UserToken))
                {
                    throw new Exception("未附带token!");
                }

                if (actionArguments[UserToken] != null)
                {
                    token = actionArguments[UserToken].ToString();
                }
                else
                {
                    throw new Exception("token不能为空!");
                }
            }
            else
            {
                throw new Exception("未被许可的访问!");
            }

            return token;
        }

    }

    /// <summary>
    /// 站点开启关闭filter
    /// </summary>
    public class SiteAvailableAttribute : ActionFilterAttribute
    {
        private const string UserSiteCode = "siteCode";

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            try
            {
                var anonymousAction = actionContext.ActionDescriptor.GetCustomAttributes<AnonymousAttribute>();
                if (!anonymousAction.Any())
                {
                    var siteFlag = CheckSiteAvailable(actionContext);
                    if (!siteFlag)
                    {
                        var errorModel = new ErrorModel();
                        errorModel.Flag = 4;
                        errorModel.Info = "此招聘站点目前暂时不支持！";
                        errorModel.Result = "";
                        actionContext.Response =
                            actionContext.Request.CreateResponse(HttpStatusCode.Continue,
                                new PageResult().JsonPageResult(Newtonsoft.Json.JsonConvert.SerializeObject(errorModel)));
                        base.OnActionExecuting(actionContext);
                    }
                }
                base.OnActionExecuting(actionContext);
            }
            catch (Exception e)
            {
                var errorModel = new ErrorModel();
                errorModel.Flag = 4;
                errorModel.Info = e.Message;
                errorModel.Result = "";
                actionContext.Response =
                            actionContext.Request.CreateResponse(HttpStatusCode.Continue,
                                new PageResult().JsonPageResult(Newtonsoft.Json.JsonConvert.SerializeObject(errorModel)));
                base.OnActionExecuting(actionContext);
            }
        }

        protected virtual bool CheckSiteAvailable(HttpActionContext actionContext)
        {
            try
            {
                var siteCode = GetSiteCode(actionContext.ActionArguments, actionContext.Request.Method);
                if (siteCode == "-1")
                {
                    return true;
                }
                var availableSite = ConfigurationManager.AppSettings["siteAvailableFlagValue_" + siteCode];
                return Convert.ToBoolean(availableSite);
            }
            catch (Exception)
            {
                throw new Exception("服务器配置异常，请联系管理员!");
            }
        }

        private string GetSiteCode(Dictionary<string, object> actionArguments, HttpMethod type)
        {
            var code = "-1";

            if (type == HttpMethod.Post)
            {
                foreach (var value in actionArguments.Values)
                {
                    code = value.GetType().GetProperty(UserSiteCode) == null
                        ? GetSiteCode(actionArguments, HttpMethod.Get)
                        : value.GetType().GetProperty(UserSiteCode).GetValue(value).ToString();
                }
            }
            else if (type == HttpMethod.Get)
            {
                if (!actionArguments.ContainsKey(UserSiteCode))
                {
                    code = "-1";
                }

                if (actionArguments[UserSiteCode] != null)
                {
                    code = actionArguments[UserSiteCode].ToString();
                }
                else
                {
                    code = "-1";
                }
            }
            else
            {
                throw new Exception("未被许可的访问!");
            }

            return code;
        }

    }

    /// <summary>
    /// 小智强制更新判断filter
    /// </summary>
    public class PluginUpdateAttribute : ActionFilterAttribute
    {
        private const string UserVersion = "p_version";

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            try
            {
                var anonymousAction = actionContext.ActionDescriptor.GetCustomAttributes<AnonymousAttribute>();
                if (!anonymousAction.Any())
                {
                    var updateFlag = CheckVersionUpdate(actionContext);
                    if (!updateFlag)
                    {
                        var errorModel = new ErrorModel();
                        errorModel.Flag = 4;
                        errorModel.Info = "请先升级小智后再使用！";
                        errorModel.Result = "";
                        actionContext.Response =
                            actionContext.Request.CreateResponse(HttpStatusCode.Continue,
                                new PageResult().JsonPageResult(Newtonsoft.Json.JsonConvert.SerializeObject(errorModel)));
                        base.OnActionExecuting(actionContext);
                    }
                }
                base.OnActionExecuting(actionContext);
            }
            catch (Exception e)
            {
                var errorModel = new ErrorModel();
                errorModel.Flag = 4;
                errorModel.Info = e.Message;
                errorModel.Result = "";
                actionContext.Response =
                            actionContext.Request.CreateResponse(HttpStatusCode.Continue,
                                new PageResult().JsonPageResult(Newtonsoft.Json.JsonConvert.SerializeObject(errorModel)));
                base.OnActionExecuting(actionContext);
            }
        }

        protected virtual bool CheckVersionUpdate(HttpActionContext actionContext)
        {
            try
            {
                var version = GetVersion(actionContext.ActionArguments, actionContext.Request.Method);
                var versionFlagConfig = Convert.ToBoolean(ConfigurationManager.AppSettings["pluginUpdateCheck"]);
                if (versionFlagConfig)
                {
                    var versionConfig = ConfigurationManager.AppSettings["pluginVersion"];
                    var versionConfigArrary = versionConfig.Split('.');
                    var versionArrary = version.Split('.');
                    if (Convert.ToInt32(versionConfigArrary[0]) > Convert.ToInt32(versionArrary[0]))
                    {
                        return false;
                    }
                    if (Convert.ToInt32(versionConfigArrary[1]) > Convert.ToInt32(versionArrary[1]))
                    {
                        return false;
                    }
                    if (Convert.ToInt32(versionConfigArrary[2]) > Convert.ToInt32(versionArrary[2]))
                    {
                        return false;
                    }
                }
                return true;
            }
            catch (Exception)
            {
                throw new Exception("服务器配置异常，请联系管理员!");
            }
        }

        private string GetVersion(Dictionary<string, object> actionArguments, HttpMethod type)
        {
            var version = "-1";

            if (type == HttpMethod.Post)
            {
                foreach (var value in actionArguments.Values)
                {
                    version = value.GetType().GetProperty(UserVersion) == null
                        ? GetVersion(actionArguments, HttpMethod.Get)
                        : value.GetType().GetProperty(UserVersion).GetValue(value).ToString();
                }
            }
            else if (type == HttpMethod.Get)
            {
                if (!actionArguments.ContainsKey(UserVersion))
                {
                    version = "-1";
                }

                if (actionArguments[UserVersion] != null)
                {
                    version = actionArguments[UserVersion].ToString();
                }
                else
                {
                    version = "-1";
                }
            }
            else
            {
                throw new Exception("未被许可的访问!");
            }

            return version;
        }

    }
}