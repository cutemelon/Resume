using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;
using System.Web.Script.Serialization;
using Infrastructure.DataAccess;
using Models.Api;
using Resume;
using ResumeManagementSystem.Controllers.WebExtensionResumeAPIController.Filter;

namespace ResumeManagementSystem.Controllers.WebExtensionResumeAPIController
{
    public class ResumeController : PageResult 
    {
        private Resume.ResumeManage resumeManager = new Resume.ResumeManage();
        [System.Web.Http.HttpGet]
        public string StructuredImportResume()
        {


            return Newtonsoft.Json.JsonConvert.SerializeObject("ResultError");
        }

        [System.Web.Http.HttpGet]
        public string ResultError()
        {
            return "ResultError";
        }

        [PluginUpdateAttribute]
        [SiteAvailableAttribute]
        [TokenVerification]
        [System.Web.Http.HttpPost]
        public string HubbleSearchers([FromBody] SearchModel searchData)
        {
            return JsonPageResult(new JavaScriptSerializer().Serialize(
                new {Flag = 0, Info = string.Empty, Result = new List<SearchReturnEntity>()}));
        }

        [PluginUpdateAttribute]
        [SiteAvailableAttribute]
        [TokenVerificationAttribute]
        [System.Web.Http.HttpPost]
        public string SearchRelationResumeById([FromBody] RelationResumeModel model)
        {
            return JsonPageResult(new JavaScriptSerializer().Serialize(
                new {Flag = 0, Info = string.Empty, Result = new List<SearchReturnEntity>()}));
        }
    }
}
