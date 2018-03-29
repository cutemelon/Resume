using System.Collections.Generic;
using Models.Resume;

namespace DatabaseInterface.ResumeInterface
{
    public interface IResumeDb
    {
        #region 简历基础表

        /// <summary>
        /// 添加一个简历
        /// </summary>
        /// <param name="resume"></param>
        void AddResume(ResumeModel resume);

        /// <summary>
        /// 修改一个简历
        /// </summary>
        /// <param name="resume"></param>
        /// <returns></returns>
        int UpdateResume(ResumeModel resume);

        /// <summary>
        /// 根据ID获得简历
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        ResumeModel GetResumeById(string id);

        /// <summary>
        /// 删除一个简历
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        int DeleteResume(string id);

        #endregion

        #region 简历证书表

        /// <summary>
        /// 添加证书信息
        /// </summary>
        /// <param name="certificateList"></param>
        int AddResumeCertificate(List<ResumeCertificateModel> certificateList);

        /// <summary>
        /// 根据简历ID删除证书信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        int DeleteResumeCertificateById(string id);

        /// <summary>
        /// 根据简历ID获得证书信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        List<ResumeCertificateModel> GetResumeCertificateListById(string id);

        #endregion

        #region 简历教育经历表

        /// <summary>
        /// 添加教育经历
        /// </summary>
        /// <param name="educationList"></param>
        /// <returns></returns>
        int AddResumeEducation(List<ResumeEducationModel> educationList);

        /// <summary>
        /// 根据ID删除教育信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        int DeleteResumeEducationById(string id);

        /// <summary>
        /// 根据ID获得教育信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        List<ResumeEducationModel> GetResumeEducationListById(string id);

        #endregion

        #region 简历语言信息

        /// <summary>
        /// 添加语言信息
        /// </summary>
        /// <param name="languageList"></param>
        /// <returns></returns>
        int AddResumeLanguage(List<ResumeLanguageModel> languageList);

        /// <summary>
        /// 根据简历ID删除语言信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        int DeleteResumeLanguageById(string id);

        /// <summary>
        /// 根据简历ID获得语言信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        List<ResumeLanguageModel> GetResumeLanguageListById(string id);

        #endregion

        #region 简历项目信息

        /// <summary>
        /// 添加项目信息
        /// </summary>
        /// <param name="projectList"></param>
        /// <returns></returns>
        int AddResumeProject(List<ResumeProjectModel> projectList);

        /// <summary>
        /// 根据简历ID删除项目信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        int DeleteResumeProjectById(string id);

        /// <summary>
        /// 根据简历ID获得项目信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        List<ResumeProjectModel> GetResumeProjectListById(string id);

        #endregion

        #region 简历技能信息

        /// <summary>
        /// 添加技能信息
        /// </summary>
        /// <param name="skillList"></param>
        /// <returns></returns>
        int AddResumeSkill(List<ResumeSkillModel> skillList);

        /// <summary>
        /// 删除简历技能信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        int DeleteResumeSkillById(string id);

        /// <summary>
        /// 根据ID获得技能信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        List<ResumeSkillModel> GetResumeSkillListById(string id);

        #endregion

        #region 简历培训信息

        /// <summary>
        /// 添加培训信息
        /// </summary>
        /// <param name="trainingList"></param>
        /// <returns></returns>
        int AddResumeTraining(List<ResumeTrainingModel> trainingList);

        /// <summary>
        /// 根据ID删除培训信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        int DeleteResumeTrainingById(string id);

        /// <summary>
        /// 根据ID获得培训信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        List<ResumeTrainingModel> GetResumeTrainingListById(string id);

        #endregion

        #region 简历工作经验

        /// <summary>
        /// 添加工作经验
        /// </summary>
        /// <param name="workList"></param>
        /// <returns></returns>
        int AddResumeWork(List<ResumeWorkExperienceModel> workList);

        /// <summary>
        /// 根据ID删除工作经验
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        int DeleteResumeWorkById(string id);

        /// <summary>
        /// 根据ID获得工作经验
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        List<ResumeWorkExperienceModel> GetResumeWorkListById(string id);

        #endregion

        /// <summary>
        /// 更新简历
        /// </summary>
        /// <param name="resume"></param>
        /// <param name="certificateList"></param>
        /// <param name="educationList"></param>
        /// <param name="languageList"></param>
        /// <param name="projectList"></param>
        /// <param name="skillList"></param>
        /// <param name="trainingList"></param>
        /// <param name="workList"></param>
        /// <returns></returns>
        bool UpdateResumeDetails(ResumeModel resume, List<ResumeCertificateModel> certificateList,
            List<ResumeEducationModel> educationList, List<ResumeLanguageModel> languageList,
            List<ResumeProjectModel> projectList, List<ResumeSkillModel> skillList,
            List<ResumeTrainingModel> trainingList, List<ResumeWorkExperienceModel> workList);

        /// <summary>
        /// 新增简历
        /// </summary>
        /// <param name="resume"></param>
        /// <param name="certificateList"></param>
        /// <param name="educationList"></param>
        /// <param name="languageList"></param>
        /// <param name="projectList"></param>
        /// <param name="skillList"></param>
        /// <param name="trainingList"></param>
        /// <param name="workList"></param>
        /// <returns></returns>
        bool InsertResumeDetails(ResumeModel resume, List<ResumeCertificateModel> certificateList,
            List<ResumeEducationModel> educationList, List<ResumeLanguageModel> languageList,
            List<ResumeProjectModel> projectList, List<ResumeSkillModel> skillList,
            List<ResumeTrainingModel> trainingList, List<ResumeWorkExperienceModel> workList);

        /// <summary>
        /// 搜索简历
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        List<ResumeModel> GetResumeByEasySearchConditional(string id, string name = "");

        /// <summary>
        /// 获取简历列表
        /// </summary>
        /// <param name="startIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        List<ResumeModel> GetResumeList(out int count, string position = "", int startIndex = 1, int pageSize = int.MaxValue);
    }
}
