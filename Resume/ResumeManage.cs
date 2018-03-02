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

        public void AddResume(StructuredResumeModel structuredResumeModel, UserModel user)
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
            resumeModel.resume_id = Guid.NewGuid();
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
            resumeModel.tenant_id = user.tenant_id;
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
                    var languageTemp=
                }
            }
        }
    }
}
