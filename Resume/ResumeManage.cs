using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using ApiManage;
using ApplicationExtensions;
using DatabaseInterface.ResumeInterface;
using DatabaseInterface.SystemInterface;
using DatabaseService.ResumeService;
using DatabaseService.SystemService;
using Models.Api;
using Models.Resume;
using Models.SystemManage;

namespace Resume
{
    public class ResumeManage
    {
        private IResumeDb resumeDb;
        private ICompanyDb companyDb = new CompanyDb();
        private IUserDb userDb;

        /// <summary>
        /// 简历结构化入库
        /// </summary>
        /// <param name="importModel"></param>
        /// <returns></returns>
        public string ImportStructured(StructuredImportModel importModel)
        {
            var reponseJson = string.Empty;
            var jsSerializer = new JavaScriptSerializer();
            importModel.employeeNo = string.IsNullOrEmpty(importModel.employeeNo) ? "" : importModel.employeeNo.Trim();
            if (importModel.employeeNo == "")
            {
                reponseJson = jsSerializer.Serialize(new { Flag = 1, Info = "请登录", Result = "[]" });
                return reponseJson;
            }
            try
            {
                var result = ImportStructuredResume(importModel, 0,
                    new TokenManage().GetCompanyId(importModel.token), 0);
                if (result.Flag == 0)
                {
                    reponseJson = jsSerializer.Serialize(new { Flag = 0, Info = string.Empty, Result = new { ResumeId = result.ResumeId } });
                }
                else if (result.Flag == 5)
                {
                    reponseJson = jsSerializer.Serialize(new { Flag = 4, Info = "简历入库异常", Result = "[]" });
                }
                else
                {
                    reponseJson = jsSerializer.Serialize(new { Flag = 4, Info = result.Message, Result = "[]" });
                }
                return reponseJson;
            }
            catch (Exception ex)
            {
                reponseJson = jsSerializer.Serialize(new { Flag = 4, Info = "简历入库异常", Result = "[]" });
                return reponseJson;
            }
        }

        /// <summary>
        /// 简历结构化入库（导入前的操作）
        /// </summary>
        /// <param name="importModel"></param>
        /// <param name="physicalSourceId"></param>
        /// <param name="companyId"></param>
        /// <param name="importFrom"></param>
        /// <returns></returns>
        public StoreResult ImportStructuredResume(StructuredImportModel importModel, int physicalSourceId,
            string companyId, int importFrom)
        {
            //var fileInfo = SaveFile(importModel.structuredResumeDetail.htmlContent);
            string importType = string.Empty;
            if (importModel.structuredResumeDetail.importType == 0) importType = "手动新增";
            else if (importModel.structuredResumeDetail.importType == 1) importType = "手动更新";
            else if (importModel.structuredResumeDetail.importType == 2) importType = "自动新增";
            else if (importModel.structuredResumeDetail.importType == 3) importType = "自动更新 ";
            //log.WriteLog(importType + ";identity:" + importModel.structuredResumeDetail.basic.id + ";source: " + ThridSysSetting.GetSite((int)importModel.structuredResumeDetail.src[0]).RmsName + ";name:"
            //    + importModel.structuredResumeDetail.basic.name + ";mobile:" + importModel.structuredResumeDetail.contact.phone + ";email:" + importModel.structuredResumeDetail.contact.email + ";fileInfo:" + fileInfo.FullName, importModel.employeeNo, "StructuredResume");
            DealDescription dealDescription = new DealDescription();
            if (importModel.structuredResumeDetail.importType == 1 && physicalSourceId == 0)
                dealDescription = DealDescription.小智插件手动更新;
            else if (importModel.structuredResumeDetail.importType == 3 && physicalSourceId == 0)
                dealDescription = DealDescription.小智插件自动更新;
            else if (importModel.structuredResumeDetail.importType == 1 && physicalSourceId == 1)
                dealDescription = DealDescription.嵌入式手动更新;
            else if (importModel.structuredResumeDetail.importType == 3 && physicalSourceId == 1)
                dealDescription = DealDescription.嵌入式自动更新;
            var flag = (importModel.structuredResumeDetail.importType == 1 ||
                        importModel.structuredResumeDetail.importType == 3)
                ? 1
                : 0;
            var result = AddOrUpdateResume(importModel.structuredResumeDetail, importModel.employeeNo, companyId, flag,
                importModel.structuredResumeDetail.repeatId, importFrom);
            return result;
        }

        /// <summary>
        /// 简历结构化入库（新增或更新具体方法）
        /// </summary>
        /// <param name="structuredResumeModel"></param>
        /// <param name="username"></param>
        /// <param name="companyId"></param>
        /// <param name="flag"></param>
        /// <param name="resumeOldId"></param>
        /// <param name="importFrom"></param>
        /// <returns></returns>
        public StoreResult AddOrUpdateResume(StructuredResumeModel structuredResumeModel, string username, string companyId, int flag,
            string resumeOldId = "", int importFrom = 0)
        {
            StoreResult result = new StoreResult();
            var company = companyDb.GetCompanyById(companyId);
            if (company == null)
            {
                result.Flag = 4;
                result.Message = "公司不存在";
                return result;
            }

            resumeDb = new ResumeDb(new ApplicationCommon().GetUserDBConnection(company));
            userDb = new UserDb(new ApplicationCommon().GetUserDBConnection(company));

            var user = userDb.GetUserByUsername(username);
            if (user == null)
            {
                result.Flag = 4;
                result.Message = "该账号不存在";
                return result;
            }

            //简历基础表
            var resumeModel = new ResumeModel();
            resumeModel.account = structuredResumeModel.basic.account;
            resumeModel.account_province = structuredResumeModel.basic.account_province;
            resumeModel.address = structuredResumeModel.basic.address;
            resumeModel.address_province = structuredResumeModel.basic.address;
            resumeModel.age = structuredResumeModel.basic.age.ToString();
            if (!string.IsNullOrWhiteSpace(structuredResumeModel.basic.birth))
            {
                var birthArrary = structuredResumeModel.basic.birth.Split('-');
                if (birthArrary.Length == 1)
                {
                    resumeModel.birth = Convert.ToDateTime(structuredResumeModel.basic.birth + "-1-1");
                }
                else if (birthArrary.Length == 2)
                {
                    resumeModel.birth = Convert.ToDateTime(structuredResumeModel.basic.birth + "-1");
                }
                else
                {
                    resumeModel.birth = Convert.ToDateTime(structuredResumeModel.basic.birth);
                }
            }
            resumeModel.can_buy = "1";
            resumeModel.company_id = companyId;
            resumeModel.resume_id = flag == 1 ? resumeOldId : Guid.NewGuid().ToString();
            resumeModel.import_from = importFrom;
            resumeModel.import_type = Convert.ToInt32(structuredResumeModel.importType);
            resumeModel.created_by = user.user_id;
            resumeModel.created_time = DateTime.Now;
            resumeModel.current_salary = structuredResumeModel.basic.current_salary;
            resumeModel.current_status = structuredResumeModel.basic.current_status;
            resumeModel.degree = structuredResumeModel.basic.degree;
            resumeModel.email = structuredResumeModel.contact.email;
            resumeModel.expect_annual_salary_from = structuredResumeModel.basic.expect_annual_salary_from;
            resumeModel.expect_annual_salary_to = structuredResumeModel.basic.expect_annual_salary_to;
            resumeModel.expect_bonus = structuredResumeModel.basic.expect_bonus;
            resumeModel.expect_city_ids = structuredResumeModel.basic.expect_city_ids;
            resumeModel.expect_industry_name = structuredResumeModel.basic.expect_industry_name;
            resumeModel.expect_position_name = structuredResumeModel.basic.expect_position_name;
            resumeModel.expect_salary_from = structuredResumeModel.basic.expect_salary_from;
            resumeModel.expect_salary_month = structuredResumeModel.basic.expect_salary_month;
            resumeModel.expect_salary_to = structuredResumeModel.basic.expect_salary_to;
            resumeModel.expect_type = structuredResumeModel.basic.expect_type;
            resumeModel.expect_work_at = structuredResumeModel.basic.expect_work_at;
            resumeModel.gender = structuredResumeModel.basic.gender;
            resumeModel.graduate_date = structuredResumeModel.basic.graduate_date;
            resumeModel.htmlContent = structuredResumeModel.htmlContent;
            resumeModel.interests = structuredResumeModel.basic.interests;
            resumeModel.is_fertility = structuredResumeModel.basic.is_fertility;
            resumeModel.is_house = structuredResumeModel.basic.is_house;
            resumeModel.last_updated_by = user.user_id;
            resumeModel.last_updated_time = resumeModel.created_time;
            resumeModel.live_family = structuredResumeModel.basic.live_family;
            resumeModel.marital = structuredResumeModel.basic.marital;
            resumeModel.msn = structuredResumeModel.contact.msn;
            resumeModel.name = structuredResumeModel.basic.name;
            resumeModel.nation = structuredResumeModel.basic.nation;
            resumeModel.noHtmlContent = structuredResumeModel.noHtmlContent;
            resumeModel.other_info = structuredResumeModel.basic.other_info;
            resumeModel.overseas = structuredResumeModel.basic.overseas;
            resumeModel.phone = structuredResumeModel.contact.phone;
            resumeModel.photo = structuredResumeModel.basic.photo;
            resumeModel.political_status = structuredResumeModel.basic.political_status;
            resumeModel.qq = structuredResumeModel.contact.qq;
            resumeModel.resume_hideId = structuredResumeModel.basic.hidId;
            resumeModel.resume_orginalId = structuredResumeModel.basic.id;
            resumeModel.resume_status = 0;
            resumeModel.resume_updated_at = string.IsNullOrWhiteSpace(structuredResumeModel.update_info.updated_at)
                ? (DateTime?)null
                : Convert.ToDateTime(structuredResumeModel.update_info.updated_at);
            resumeModel.resume_userId = structuredResumeModel.basic.resumeUserId;
            resumeModel.school = structuredResumeModel.basic.school;
            resumeModel.self_remark = structuredResumeModel.basic.self_remark;
            resumeModel.sina = structuredResumeModel.contact.sina;
            if (structuredResumeModel.src != null)
            {
                var srcString = "";
                for (int i = 0; i < structuredResumeModel.src.Length; i++)
                {
                    srcString = srcString == ""
                        ? structuredResumeModel.src[i].ToString()
                        : ("," + structuredResumeModel.src[i].ToString());
                }
                resumeModel.src = srcString;
            }
            else
            {
                resumeModel.src = "-1";
            }
            resumeModel.tel = structuredResumeModel.contact.tel;
            resumeModel.ten = structuredResumeModel.contact.ten;
            resumeModel.wechat = structuredResumeModel.contact.wechat;
            resumeModel.work_experience = structuredResumeModel.basic.work_experience;

            //简历证书
            var certificateList = new List<ResumeCertificateModel>();
            if (structuredResumeModel.certificate != null)
            {
                foreach (var cerInfo in structuredResumeModel.certificate)
                {
                    var certificateTemp = new ResumeCertificateModel();
                    certificateTemp.description = cerInfo.description;
                    certificateTemp.name = cerInfo.name;
                    certificateTemp.resume_id = resumeModel.resume_id;
                    certificateTemp.start_time = cerInfo.start_time;
                    certificateList.Add(certificateTemp);
                }
            }

            //简历教育经历
            var educationList = new List<ResumeEducationModel>();
            if (structuredResumeModel.education != null)
            {
                foreach (var eduInfo in structuredResumeModel.education)
                {
                    var educationTemp = new ResumeEducationModel();
                    educationTemp.degree = eduInfo.degree;
                    educationTemp.discipline_desc = eduInfo.discipline_desc;
                    educationTemp.discipline_name = eduInfo.discipline_name;
                    educationTemp.end_time = eduInfo.end_time;
                    educationTemp.is_entrance = eduInfo.is_entrance;
                    educationTemp.resume_id = resumeModel.resume_id;
                    educationTemp.school_name = eduInfo.school_name;
                    educationTemp.so_far = eduInfo.so_far;
                    educationTemp.start_time = eduInfo.start_time;
                    educationList.Add(educationTemp);
                }
            }

            //简历语言
            var languageList = new List<ResumeLanguageModel>();
            if (structuredResumeModel.language != null)
            {
                foreach (var lanInfo in structuredResumeModel.language)
                {
                    var languageTemp = new ResumeLanguageModel();
                    languageTemp.certificate = lanInfo.certificate;
                    languageTemp.level = lanInfo.level;
                    languageTemp.name = lanInfo.name;
                    languageTemp.resume_id = resumeModel.resume_id;
                    languageList.Add(languageTemp);
                }
            }

            //项目经验
            var projectList = new List<ResumeProjectModel>();
            if (structuredResumeModel.project != null)
            {
                foreach (var proInfo in structuredResumeModel.project)
                {
                    var projectTemp = new ResumeProjectModel();
                    projectTemp.describe = proInfo.describe;
                    projectTemp.develop_tool = proInfo.develop_tool;
                    projectTemp.end_time = proInfo.end_time;
                    projectTemp.hard_env = proInfo.hard_env;
                    projectTemp.name = proInfo.name;
                    projectTemp.responsibilities = proInfo.responsibilities;
                    projectTemp.resume_id = resumeModel.resume_id;
                    projectTemp.so_far = proInfo.so_far;
                    projectTemp.soft_env = proInfo.soft_env;
                    projectTemp.start_time = proInfo.start_time;
                    projectList.Add(projectTemp);
                }
            }

            //技能信息
            var skillList = new List<ResumeSkillModel>();
            if (structuredResumeModel.skill != null)
            {
                foreach (var skiInfo in structuredResumeModel.skill)
                {
                    var skillTemp = new ResumeSkillModel();
                    skillTemp.level = skiInfo.level;
                    skillTemp.name = skiInfo.name;
                    skillTemp.period = skiInfo.period;
                    skillTemp.resume_id = resumeModel.resume_id;
                    skillList.Add(skillTemp);
                }
            }

            //培训信息
            var trainList = new List<ResumeTrainingModel>();
            if (structuredResumeModel.training != null)
            {
                foreach (var traInfo in structuredResumeModel.training)
                {
                    var trainTemp = new ResumeTrainingModel();
                    trainTemp.authority = traInfo.authority;
                    trainTemp.certificate = traInfo.certificate;
                    trainTemp.city = traInfo.city;
                    trainTemp.description = traInfo.description;
                    trainTemp.end_time = traInfo.end_time;
                    trainTemp.name = traInfo.name;
                    trainTemp.resume_id = resumeModel.resume_id;
                    trainTemp.so_far = traInfo.so_far;
                    trainTemp.start_time = traInfo.start_time;
                    trainList.Add(trainTemp);
                }
            }

            //工作经验
            var workList = new List<ResumeWorkExperienceModel>();
            if (structuredResumeModel.work != null)
            {
                foreach (var workInfo in structuredResumeModel.work)
                {
                    var workTemp = new ResumeWorkExperienceModel();
                    workTemp.annual_salary_from = workInfo.annual_salary_from;
                    workTemp.annual_salary_to = workInfo.annual_salary_to;
                    workTemp.architecture_name = workInfo.architecture_name;
                    workTemp.basic_salary_from = workInfo.basic_salary_from;
                    workTemp.basic_salary_to = workInfo.basic_salary_to;
                    workTemp.bonus = workInfo.bonus;
                    workTemp.city = workInfo.city;
                    workTemp.corporation_desc = workInfo.corporation_desc;
                    workTemp.corporation_name = workInfo.corporation_name;
                    workTemp.corporation_type = workInfo.corporation_type;
                    workTemp.end_time = workInfo.end_time;
                    workTemp.industry_name = workInfo.industry_name;
                    workTemp.management_experience = workInfo.management_experience;
                    workTemp.position_name = workInfo.position_name;
                    workTemp.reporting_to = workInfo.reporting_to;
                    workTemp.responsibilities = workInfo.responsibilities;
                    workTemp.resume_id = resumeModel.resume_id;
                    workTemp.salary_month = workInfo.salary_month;
                    workTemp.scale = workInfo.scale;
                    workTemp.so_far = workInfo.so_far;
                    workTemp.start_time = workInfo.salary_month;
                    workTemp.station_name = workInfo.station_name;
                    workTemp.subordinates_count = workInfo.subordinates_count;
                    workList.Add(workTemp);
                }
            }

            if (flag == 1)
            {
                if (string.IsNullOrEmpty(resumeOldId))
                {
                    result.Flag = 4;
                    result.Message = "简历不存在";
                    return result;
                }
                else
                {
                    var oldResume = resumeDb.GetResumeById(resumeOldId);
                    if (oldResume == null)
                    {
                        result.Flag = 4;
                        result.Message = "简历不存在";
                        return result;
                    }
                    resumeModel.created_by = oldResume.created_by;
                    resumeModel.created_time = oldResume.created_time;
                    resumeModel.last_updated_time = DateTime.Now;
                    if (oldResume.last_updated_time.Value.AddDays(14) > resumeModel.last_updated_time.Value)
                    {
                        result.Flag = 3;
                        result.Message = "重复简历更新时间在两周内，无法覆盖";
                        result.ResumeId = resumeModel.resume_id;
                        return result;
                    }
                    if (string.IsNullOrEmpty(resumeModel.name))
                    {
                        result.Flag = 1;
                        result.Message = "姓名不能为空";
                        return result;
                    }
                    if (string.IsNullOrEmpty(resumeModel.phone) && string.IsNullOrEmpty(resumeModel.email))
                    {
                        result.Flag = 2;
                        result.Message = "手机和邮箱为空或格式错误";
                        return result;
                    }
                    var dbReturn = resumeDb.UpdateResumeDetails(resumeModel, certificateList, educationList,
                        languageList, projectList, skillList, trainList, workList);
                    if (dbReturn)
                    {
                        result.Flag = 0;
                        result.ResumeId = resumeModel.resume_id;
                        result.Message = "简历覆盖成功";
                        return result;
                    }
                    else
                    {
                        result.Flag = 5;
                        result.Message = "异常";
                        return result;
                    }
                }
            }
            else
            {
                var returnVal = resumeDb.InsertResumeDetails(resumeModel, certificateList, educationList,
                    languageList, projectList, skillList, trainList, workList);
                if (returnVal)
                {
                    return result;
                }
                else
                {
                    result.Flag = 5;
                    result.Message = "异常";
                    return result;
                }
            }
        }


        public string ResumeSearch(ResumeSearchEntity entity)
        {
            var reponseJson = string.Empty;
            var jsSerializer = new JavaScriptSerializer();
            try
            {
                entity.EmployeeNo = string.IsNullOrEmpty(entity.EmployeeNo) ? "" : entity.EmployeeNo.Trim();
                if (string.IsNullOrEmpty(entity.EmployeeNo))
                {
                    return jsSerializer.Serialize(new { Falg = 1, Info = "请登录", Result = "[]" });
                }

                var company = companyDb.GetCompanyById(new TokenManage().GetCompanyId(entity.token));
                if (company == null)
                {
                    reponseJson = jsSerializer.Serialize(new { Flag = 4, Info = "公司不存在", Result = "[]" });
                    return reponseJson;
                }

                resumeDb = new ResumeDb(new ApplicationCommon().GetUserDBConnection(company));
                userDb = new UserDb(new ApplicationCommon().GetUserDBConnection(company));

                var user = userDb.GetUserByUsername(new TokenManage().GetUserName(entity.token));
                if (user == null)
                {
                    reponseJson = jsSerializer.Serialize(new { Flag = 4, Info = "该账号不存在", Result = "[]" });
                    return reponseJson;
                }


                entity.Birth = string.IsNullOrEmpty(entity.Birth) ? "" : entity.Birth.Trim();
                entity.Sex = string.IsNullOrEmpty(entity.Sex) ? "" : entity.Sex.Trim();
                entity.School = string.IsNullOrEmpty(entity.School) ? "" : entity.School.Trim();
                entity.CompanyAll = entity.Company;
                entity.Company = string.IsNullOrEmpty(entity.Company) ? "" : Regex.Replace(entity.Company.Trim(), "有限|责任|公司|分公司|股份|集团|工作室|技术|软件|计算机|信息|科技|网络|系统", "");
                entity.ExtId = string.IsNullOrEmpty(entity.ExtId) ? "" : entity.ExtId.Trim();
                entity.SiteCode = string.IsNullOrEmpty(entity.SiteCode) ? "" : entity.SiteCode.Trim();
                entity.CandidateName = string.IsNullOrEmpty(entity.CandidateName) ? "" : entity.CandidateName.Trim();
                entity.Email = string.IsNullOrEmpty(entity.Email) ? "" : entity.Email.Trim();
                entity.Mobile = string.IsNullOrEmpty(entity.Mobile) ? "" : entity.Mobile.Trim();
                entity.MobileLast = string.IsNullOrEmpty(entity.MobileLast) ? "" : entity.MobileLast.Trim();
                entity.GraduateYear = string.IsNullOrEmpty(entity.GraduateYear) ? "" : entity.GraduateYear.Trim();
                entity.Cities = string.IsNullOrEmpty(entity.Cities) ? "" : entity.Cities.Trim();
                entity.Registry = string.IsNullOrEmpty(entity.Registry) ? "" : entity.Registry.Trim();
                entity.ExtraDatas.UserName = string.IsNullOrEmpty(entity.ExtraDatas.UserName) ? "" : entity.ExtraDatas.UserName.Trim();
                entity.ExtraDatas.HidResumeId = string.IsNullOrEmpty(entity.ExtraDatas.HidResumeId) ? "" : entity.ExtraDatas.HidResumeId.Trim();
                entity.ExtraDatas.ResumeUserId = string.IsNullOrEmpty(entity.ExtraDatas.ResumeUserId) ? "" : entity.ExtraDatas.ResumeUserId.Trim();
                SiteEnum site = (SiteEnum)Convert.ToInt32(entity.SiteCode);

                List<SearchReturnEntity> returnResult = SearchResumeBaseFunction(entity);
                if (returnResult.Count == 0)
                {
                    reponseJson = jsSerializer.Serialize(new { Flag = (entity.SearchType == 0 ? 0 : 2), Info = string.Empty, Result = "[]" });
                    return reponseJson;
                }
                if (entity.SearchType == 0)
                {
                    returnResult.ForEach(r => r.CanUpdate = false);
                }
                //var result = returnResult.Where(p => p.Score > 0f);
                reponseJson = jsSerializer.Serialize(new { Flag = 0, Info = string.Empty, Result = returnResult });
                return reponseJson;

            }
            catch (Exception ex)
            {
                reponseJson = jsSerializer.Serialize(new { Flag = 2, Info = ex.Message, Result = "[]" });//搜索异常
                return reponseJson;
            }

        }


        public List<SearchReturnEntity> SearchResumeBaseFunction(ResumeSearchEntity entity)
        {
            try
            {
                var candidateName = string.IsNullOrWhiteSpace(entity.CandidateName) ? "" : entity.CandidateName;
                var list = resumeDb.GetResumeByEasySearchConditional(entity.ExtId, candidateName);
                return RecombineResumeEntity(list, entity);
            }
            catch (Exception e)
            {
                return new List<SearchReturnEntity>();
            }
        }

        public List<SearchReturnEntity> RecombineResumeEntity(List<ResumeModel> list, ResumeSearchEntity searchEntity)
        {
            try
            {
                var resultList = new List<SearchReturnEntity>();
                foreach (var item in list)
                {
                    var resultEntity = new SearchReturnEntity();
                    string workExpId = string.Empty;
                    resultEntity.Plan = "C";
                    resultEntity.TaskId = 0;//searchId;
                    resultEntity.SEmployeeNo = searchEntity.EmployeeNo;
                    resultEntity.SSource = (searchEntity.SearchType == 0 || searchEntity.SearchType == 1) ? "newplugin" : "browser";
                    resultEntity.RResumeId = item.resume_id;
                    resultEntity.SCandidateName = searchEntity.CandidateName;
                    resultEntity.SUserName = searchEntity.ExtraDatas.UserName;
                    resultEntity.RCandidateName = item.name;
                    resultEntity.SEmail = searchEntity.Email;
                    resultEntity.REmail = item.email;
                    resultEntity.SMobile = searchEntity.Mobile;
                    resultEntity.RMobile = item.phone;
                    resultEntity.SMobileLast = searchEntity.MobileLast;
                    resultEntity.SExtId = searchEntity.ExtId;
                    resultEntity.SHidResumeId = searchEntity.ExtraDatas.HidResumeId;
                    resultEntity.SResumeUserId = searchEntity.ExtraDatas.ResumeUserId;
                    resultEntity.RSynResumeId = item.resume_orginalId;
                    resultEntity.SSex = searchEntity.Sex;
                    resultEntity.RSex = item.gender;
                    resultEntity.SBirth = searchEntity.Birth;
                    //resultEntity.RBirthNum = item.birth.ToString();
                    resultEntity.SGraduateYear = searchEntity.GraduateYear;
                    resultEntity.RGraduateYear = item.graduate_date;
                    resultEntity.SSchool = searchEntity.School;
                    resultEntity.RSchool = item.school;
                    workExpId = Convert.IsDBNull(item.work_experience) ? "0" : item.work_experience.ToString();
                    if (workExpId != "0")
                    {
                        resultEntity.RWorkExp = item.work_experience;//((ResumeWorkExp)Convert.ToInt32(workExpId)).ToString();
                    }
                    resultEntity.RHightestDegree = item.degree;
                    resultEntity.SLabelContent = searchEntity.Company.Replace("$", " ");
                    resultEntity.RLabelContent = item.corporation_name_str.TrimEnd(',');
                    resultEntity.RLabelDetailContent = item.corporation_name_str.TrimEnd(',');
                    //是否可以更新
                    resultEntity.CanUpdate = false;//Convert.ToDateTime(item.last_updated_time).CompareTo(DateTime.Now.AddDays(-14)) == -1;
                    resultEntity.Status = "1";//((ResumeStatus)Convert.ToInt32(dt.Rows[i]["ResumeStatus"])).ToString();
                    resultList.Add(resultEntity);
                }
                return resultList;
            }
            catch (Exception)
            {
                return new List<SearchReturnEntity>();
            }
        }


        #region

        /// <summary>
        /// 简历合并
        /// </summary>
        public enum DealDescription
        {
            自动合并 = 0,
            小智插件手动更新 = 1,
            小智插件自动更新 = 2,
            嵌入式手动更新 = 3,
            嵌入式自动更新 = 4,
            无忧ftp同步 = 5,
            智联ftp同步 = 6,
            单份上传 = 7,
            粘贴上传 = 8,
            批量上传 = 9,
            编辑简历基本信息 = 10,
            内部推荐 = 11,
            集团官网投递 = 12,
            手动合并 = 13

        }

        /// <summary>
        /// 简历来源
        /// </summary>
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
