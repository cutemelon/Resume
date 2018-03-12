using System;
using System.Configuration;
using System.Web.Http;
using System.Web.Mvc;
using ApplicationExtensions;
using DatabaseInterface.SystemInterface;
using DatabaseService.SystemService;
using Extensions;
using Infrastructure.DataAccess;
using Models.Api;
using Newtonsoft.Json;
using Resume;

namespace ResumeManagementSystem.Controllers.WebExtensionResumeAPIController
{
    public class LoginController : ApiController
    {
        private IUserDb userDb;
        private ICompanyDb companyDb = new CompanyDb();

        [System.Web.Http.HttpPost]
        [System.Web.Http.HttpGet]
        public string UserLogin([FromBody]LoginModel loginData)
        {
            string companyName = loginData.companyName;
            string userName=loginData.employeeNo;
            string password = loginData.password;
            var apiReturn = new ApiReturn();
            var company = companyDb.GetCompanyByCompanyCode(companyName);
            if (company == null)
            {
                apiReturn.Flag = 1;
                apiReturn.Result = "公司、用户名或密码错误！";
                return JsonConvert.SerializeObject(apiReturn);
            }
            var currentUserConnectionInfo = new ApplicationCommon().GetUserDBConnection(company);
            userDb = new UserDb(currentUserConnectionInfo);
            var user = userDb.GetUserByUsername(userName);
            if (user == null)
            {
                apiReturn.Flag = 1;
                apiReturn.Result = "公司、用户名或密码错误！";
                return JsonConvert.SerializeObject(apiReturn);
            }
            if (!user.password.Trim().Equals(password.GetMd5(2), StringComparison.CurrentCultureIgnoreCase))
            {
                apiReturn.Flag = 1;
                apiReturn.Result = "公司、用户名或密码错误！";
                return JsonConvert.SerializeObject(apiReturn);
            }
            if (user.status == 2)
            {
                apiReturn.Flag = 1;
                apiReturn.Result = "账户被冻结！";
                return JsonConvert.SerializeObject(apiReturn);
            }
            apiReturn.Flag = 0;
            apiReturn.Result = company.company_id;
            return JsonConvert.SerializeObject(apiReturn);
            return Newtonsoft.Json.JsonConvert.SerializeObject("ResultError");
        }

        [System.Web.Http.HttpGet]
        public string ResultError()
        {
            return "ResultError";
        }
    }
}
