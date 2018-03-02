using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DatabaseInterface.ResumeInterface;
using Infrastructure.DataAccess;
using Models.Resume;

namespace DatabaseService.ResumeService
{
    public class ResumeDb : IResumeDb
    {
        //private readonly IBaseDataAccess _dataAccess = BaseDataAccess.DataAccess;
        private readonly IBaseDataAccess _dataAccess;

        public ResumeDb(string connectionStr)
        {
            if (string.IsNullOrWhiteSpace(connectionStr))
            {
                _dataAccess = BaseDataAccess.DataAccess;
            }
            else
            {
                _dataAccess = new SqlServerDataAccess(connectionStr);
            }
        }

        #region 简历基础表

        /// <summary>
        /// 添加一个简历
        /// </summary>
        /// <param name="resume"></param>
        public void AddResume(ResumeModel resume)
        {
            _dataAccess.AddEntity(resume);
        }

        /// <summary>
        /// 修改一个简历
        /// </summary>
        /// <param name="resume"></param>
        /// <returns></returns>
        public int UpdateResume(ResumeModel resume)
        {
            return _dataAccess.UpdateEntity(resume);
        }

        /// <summary>
        /// 根据ID获得简历
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ResumeModel GetResumeById(string id)
        {
            return _dataAccess.Get<ResumeModel>(id);
        }

        /// <summary>
        /// 删除一个简历
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int DeleteResume(string id)
        {
            var sql = string.Format("update resume set resume_status=1 where resume_id='{0}'", id);
            return _dataAccess.ExecuteSql(sql);
        }

        #endregion

        #region 简历证书表

        /// <summary>
        /// 添加证书信息
        /// </summary>
        /// <param name="certificateList"></param>
        public int AddResumeCertificate(List<ResumeCertificateModel> certificateList)
        {
            return _dataAccess.AddEntities(certificateList);
        }

        /// <summary>
        /// 根据简历ID删除证书信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int DeleteResumeCertificateById(string id)
        {
            return _dataAccess.DeleteEntities<ResumeCertificateModel>(string.Format(" resume_id='{0}' ", id));
        }

        /// <summary>
        /// 根据简历ID获得证书信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<ResumeCertificateModel> GetResumeCertificateListById(string id)
        {
            return _dataAccess.GetList<ResumeCertificateModel>(string.Format(" resume_id='{0}' ", id));
        } 

        #endregion

        #region 简历教育经历表

        /// <summary>
        /// 添加教育经历
        /// </summary>
        /// <param name="educationList"></param>
        /// <returns></returns>
        public int AddResumeEducation(List<ResumeEducationModel> educationList)
        {
            return _dataAccess.AddEntities(educationList);
        }

        /// <summary>
        /// 根据ID删除教育信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int DeleteResumeEducationById(string id)
        {
            return _dataAccess.DeleteEntities<ResumeEducationModel>(string.Format(" resume_id='{0}' ", id));
        }

        /// <summary>
        /// 根据ID获得教育信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<ResumeEducationModel> GetResumeEducationListById(string id)
        {
            return _dataAccess.GetList<ResumeEducationModel>(string.Format(" resume_id='{0}' ", id));
        } 

        #endregion

        #region 简历语言信息

        /// <summary>
        /// 添加语言信息
        /// </summary>
        /// <param name="languageList"></param>
        /// <returns></returns>
        public int AddResumeLanguage(List<ResumeLanguageModel> languageList)
        {
            return _dataAccess.AddEntities(languageList);
        }

        /// <summary>
        /// 根据简历ID删除语言信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int DeleteResumeLanguageById(string id)
        {
            return _dataAccess.DeleteEntities<ResumeLanguageModel>(string.Format(" resume_id='{0}' ", id));
        }

        /// <summary>
        /// 根据简历ID获得语言信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<ResumeLanguageModel> GetResumeLanguageListById(string id)
        {
            return _dataAccess.GetList<ResumeLanguageModel>(string.Format(" resume_id='{0}' ", id));
        } 

        #endregion

        #region 简历项目信息

        /// <summary>
        /// 添加项目信息
        /// </summary>
        /// <param name="projectList"></param>
        /// <returns></returns>
        public int AddResumeProject(List<ResumeProjectModel> projectList)
        {
            return _dataAccess.AddEntities(projectList);
        }

        /// <summary>
        /// 根据简历ID删除项目信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int DeleteResumeProjectById(string id)
        {
            return _dataAccess.DeleteEntities<ResumeProjectModel>(string.Format(" resume_id='{0}' ", id));
        }

        /// <summary>
        /// 根据简历ID获得项目信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<ResumeProjectModel> GetResumeProjectListById(string id)
        {
            return _dataAccess.GetList<ResumeProjectModel>(string.Format(" resume_id='{0}' ", id));
        }

        #endregion

        #region 简历技能信息

        /// <summary>
        /// 添加技能信息
        /// </summary>
        /// <param name="skillList"></param>
        /// <returns></returns>
        public int AddResumeSkill(List<ResumeSkillModel> skillList)
        {
            return _dataAccess.AddEntities(skillList);
        }

        /// <summary>
        /// 根据ID删除简历技能信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int DeleteResumeSkillById(string id)
        {
            return _dataAccess.DeleteEntities<ResumeSkillModel>(string.Format(" resume_id='{0}' ", id)); 
        }

        /// <summary>
        /// 根据ID获得技能信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<ResumeSkillModel> GetResumeSkillListById(string id)
        {
            return _dataAccess.GetList<ResumeSkillModel>(string.Format(" resume_id='{0}' ", id));
        } 

        #endregion

        #region 简历培训信息

        /// <summary>
        /// 添加培训信息
        /// </summary>
        /// <param name="trainingList"></param>
        /// <returns></returns>
        public int AddResumeTraining(List<ResumeTrainingModel> trainingList)
        {
            return _dataAccess.AddEntities(trainingList);
        }

        /// <summary>
        /// 根据ID删除培训信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int DeleteResumeTrainingById(string id)
        {
            return _dataAccess.DeleteEntities<ResumeSkillModel>(string.Format(" resume_id='{0}' ", id)); 
        }

        /// <summary>
        /// 根据ID获得培训信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<ResumeTrainingModel> GetResumeTrainingListById(string id)
        {
            return _dataAccess.GetList<ResumeTrainingModel>(string.Format(" resume_id='{0}' ", id));
        }

        #endregion

        #region 简历工作经验

        /// <summary>
        /// 添加工作经验
        /// </summary>
        /// <param name="workList"></param>
        /// <returns></returns>
        public int AddResumeWork(List<ResumeWorkExperienceModel> workList)
        {
            return _dataAccess.AddEntities(workList);
        }

        /// <summary>
        /// 根据ID删除工作经验
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int DeleteResumeWorkById(string id)
        {
            return _dataAccess.DeleteEntities<ResumeWorkExperienceModel>(string.Format(" resume_id='{0}' ", id)); 
        }

        /// <summary>
        /// 根据ID获得工作经验
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<ResumeWorkExperienceModel> GetResumeWorkListById(string id)
        {
            return _dataAccess.GetList<ResumeWorkExperienceModel>(string.Format(" resume_id='{0}' ", id));
        }

        #endregion

    }
}
