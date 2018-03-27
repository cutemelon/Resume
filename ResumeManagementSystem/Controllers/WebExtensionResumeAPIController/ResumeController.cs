using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;
using System.Web.Script.Serialization;
using ApiManage;
using Infrastructure.DataAccess;
using Models.Api;
using Resume;
using ResumeManagementSystem.Controllers.WebExtensionResumeAPIController.Filter;

namespace ResumeManagementSystem.Controllers.WebExtensionResumeAPIController
{
    public class ResumeController : PageResult 
    {
        private Resume.ResumeManage resumeManager = new Resume.ResumeManage();

        /// <summary>
        /// 导入简历
        /// </summary>
        /// <param name="importModel"></param>
        /// <returns></returns>
        [System.Web.Http.HttpPost]
        public string StructuredImportResume([FromBody] StructuredImportModel importModel)
        {
            var errorModel = new ErrorModel();
            try
            {
                //if (!new CommonController().CheckUpdateAvailable(importData.structuredResumeDetail.src[0].ToString()))
                //{
                //    errorModel.Flag = 4;
                //    errorModel.Info = "此招聘站点暂时不支持简历上传！";
                //    errorModel.Result = "";
                //    return JsonPageResult(Newtonsoft.Json.JsonConvert.SerializeObject(errorModel));
                //}
                var returnContent = new ResumeManage().ImportStructured(importModel);
                return JsonPageResult(returnContent);
            }
            catch (Exception e)
            {
                errorModel.Flag = 4;
                errorModel.Info = "接口异常！请联系管理员！";
                errorModel.Result = "";
                return JsonPageResult(Newtonsoft.Json.JsonConvert.SerializeObject(errorModel));
            }
        }

        [System.Web.Http.HttpPost]
        public string ResultError()
        {
            return "ResultError";
        }

        /// <summary>
        /// 搜索简历
        /// </summary>
        /// <param name="searchData"></param>
        /// <returns></returns>
        [PluginUpdateAttribute]
        [SiteAvailableAttribute]
        [TokenVerification]
        [System.Web.Http.HttpPost]
        public string HubbleSearchers([FromBody] SearchModel searchData)
        {
            var errorModel = new ErrorModel();
            try
            {
                var resumeEntity = new ResumeSearchEntity();
                resumeEntity.Birth = searchData.birthday;
                resumeEntity.CandidateName = searchData.name;
                resumeEntity.Cities = searchData.cities;
                resumeEntity.Company = searchData.company;
                resumeEntity.Email = searchData.email;
                resumeEntity.EmployeeNo = searchData.employeeNo;
                resumeEntity.ExtId = searchData.identity;
                resumeEntity.ExtraDatas = new ExtraDatas();
                if (searchData.extraDatas != null)
                {
                    resumeEntity.ExtraDatas.HidResumeId = searchData.extraDatas.resumeId;
                    resumeEntity.ExtraDatas.ResumeUserId = searchData.extraDatas.resumeUserId;
                    resumeEntity.ExtraDatas.UserName = searchData.extraDatas.userName;
                }
                resumeEntity.GraduateYear = searchData.graduateYear;
                resumeEntity.Mobile = searchData.mobile;
                resumeEntity.MobileLast = searchData.mobileLast;
                resumeEntity.Registry = searchData.registry;
                resumeEntity.School = searchData.school;
                resumeEntity.SearchType = (string.IsNullOrWhiteSpace(searchData.mobile) &&
                                           string.IsNullOrWhiteSpace(searchData.email))
                    ? 0
                    : 1;
                resumeEntity.Sex = searchData.sex;
                resumeEntity.SiteCode = searchData.siteCode;
                resumeEntity.UserIp = "";
                resumeEntity.UserBrowser = searchData.p_browser + " " + searchData.p_version;
                resumeEntity.token = searchData.token;
                var returnContent = new ResumeManage().ResumeSearch(resumeEntity);
                return JsonPageResult(returnContent);
            }
            catch (Exception e)
            {
                errorModel.Flag = 4;
                errorModel.Info = "接口异常！请联系管理员！";
                errorModel.Result = "";
                return JsonPageResult(Newtonsoft.Json.JsonConvert.SerializeObject(errorModel));
            }
        }

        /// <summary>
        /// 关联简历搜索
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [PluginUpdateAttribute]
        [SiteAvailableAttribute]
        [TokenVerificationAttribute]
        [System.Web.Http.HttpPost]
        public string SearchRelationResumeById([FromBody] RelationResumeModel model)
        {
            return JsonPageResult(new JavaScriptSerializer().Serialize(
                new {Flag = 0, Info = string.Empty, Result = new List<SearchReturnEntity>()}));
        }


        #region

        public enum SiteEnum
        {
            ZhaoPin = 1,
            WuYou = 2,
            ZhongGuo = 3,
            LiePin = 4,
            ECheng = 6,
            EChengRecommend = 7,
            TongCheng = 8
        }

        #endregion
    }
}
