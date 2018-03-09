using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ApplicationExtensions;
using DatabaseInterface.ResumeInterface;
using DatabaseService.ResumeService;
using Models.Api;
using Models.Resume;
using Models.SystemManage;

namespace Resume
{
    public class ResumeManage
    {
        private IResumeDb resumeDb;

        public void AddOrUpdateResume(StructuredResumeModel structuredResumeModel, UserModel user, int flag, string resumeOldId = "")
        {
            resumeDb = new ResumeDb(new ApplicationCommon().GetCompanyDBConnection(user.username));
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
            //resumeModel.import_from=structuredResumeModel
            resumeModel.import_type = structuredResumeModel.importType.ToString();
            resumeModel.interests = structuredResumeModel.basic.interests;
            resumeModel.is_fertility = structuredResumeModel.basic.is_fertility;
            resumeModel.is_house = structuredResumeModel.basic.is_house;
            resumeModel.last_updated_by = null;
            resumeModel.last_updated_time = null;
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
            resumeModel.resume_id = Guid.NewGuid().ToString();
            resumeModel.resume_orginalId = structuredResumeModel.basic.id;
            resumeModel.resume_status = 0;
            resumeModel.resume_updated_at = string.IsNullOrWhiteSpace(structuredResumeModel.update_info.updated_at)
                ? (DateTime?) null
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
            }
            else
            {
                resumeModel.src = "-1";
            }
            resumeModel.tel = structuredResumeModel.contact.tel;
            resumeModel.ten = structuredResumeModel.contact.ten;
            resumeModel.company_id = user.company_id;
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
                    return;
                }
                else
                {
                    var oldResume = resumeDb.GetResumeById(resumeOldId);
                    if (oldResume == null)
                    {
                        return;
                    }
                    else
                    {
                        resumeModel.oldResumeId = oldResume.resume_id;
                    }
                }
            }
            else
            {
                
            }
        }
    }
}
