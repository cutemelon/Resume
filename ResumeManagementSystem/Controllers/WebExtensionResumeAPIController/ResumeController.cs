using System;
using System.Configuration;
using System.Web.Http;
using Infrastructure.DataAccess;
using Resume;

namespace ResumeManagementSystem.Controllers.WebExtensionResumeAPIController
{
    public class ResumeController : ApiController
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
    }
}
