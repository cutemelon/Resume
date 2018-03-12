using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Extensions;

namespace Models.Api
{
    public class SearchReturnEntity
    {
        public string Plan { get; set; } //PlanA or PlanB
        public string SBirth { get; set; }
        public string SSex { get; set; }
        public string SSchool { get; set; }
        public string SExtId { get; set; }
        public string SCandidateName { get; set; } //简历姓名
        public string SEmail { get; set; } //邮箱
        public string SMobile { get; set; } //手机
        public string SMobileLast { get; set; } //手机后四位
        public string SGraduateYear { get; set; } //毕业年份
        public string SLabelContent { get; set; }
        public string SEmployeeNo { get; set; }
        public string SSource { get; set; }
        public string SUserName { get; set; }
        public string SHidResumeId { get; set; }
        public string SResumeUserId { get; set; }

        public string RResumeId { get; set; }
        public string RCandidateName { get; set; }
        public string REmail { get; set; }
        public string RMobile { get; set; }
        public string RBirthNum { get; set; }
        public string RSex { get; set; }
        public string RSchool { get; set; }
        public string RGraduateYear { get; set; }
        public string RLabelDetailContent { get; set; }
        public string RLabelContent { get; set; }
        public string RWorkExp { get; set; }
        public string RHightestDegree { get; set; }
        public string RSynResumeId { get; set; }
        public bool CanUpdate { get; set; }
        public string Status { get; set; }
        public bool SameIdentity { get; set; }
        public bool IsExacte
        {
            get { return SMobile == RMobile && SEmail == REmail; }
        }
        public bool RIsConnection { get; set; }
        public string RConnectionOperator { get; set; }
        public int RRightCount { get; set; }
        public int RWrongCount { get; set; }
        public int RMappingId { get; set; }

        private static readonly float MatchEmail = float.Parse(ConfigurationManager.AppSettings["MatchEmail"]);
        private static readonly float MatchMobile = float.Parse(ConfigurationManager.AppSettings["MatchMobile"]);
        private static readonly float MatchExtId = float.Parse(ConfigurationManager.AppSettings["MatchExtId"]);
        private static readonly float MatchMobileLast = float.Parse(ConfigurationManager.AppSettings["MatchMobileLast"]);
        private static readonly float MatchBirth = float.Parse(ConfigurationManager.AppSettings["MatchBirth"]);
        private static readonly float MatchSex = float.Parse(ConfigurationManager.AppSettings["MatchSex"]);
        private static readonly float MatchSchool = float.Parse(ConfigurationManager.AppSettings["MatchSchool"]);
        private static readonly float MatchGraduateYear = float.Parse(ConfigurationManager.AppSettings["MatchGraduateYear"]);
        private static readonly float MatchCandidateName = float.Parse(ConfigurationManager.AppSettings["MatchCandidateName"]);
        internal string LabelContentScoreCommemt;
        internal string ScoreComment;
        public int TaskId { get; set; }
        private float _score = 0f;
        public float Score
        {
            get
            {
                float totalScore = 0f;
                float nameScore = 0f;
                float emailScore = 0f;
                float mobileScore = 0f;
                float mobileLastScore = 0f;
                float synResumeIdScore = 0f;
                float birthScore = 0f;
                float sexScore = 0f;
                float schoolScore = 0f;
                float graduateYearScore = 0f;
                float labelContentScore = 0f;
                //文本匹配度计算
                LevenshteinDistance lDistance = new LevenshteinDistance();
                if ((!string.IsNullOrEmpty(SCandidateName) || !string.IsNullOrEmpty(SUserName)) && !string.IsNullOrEmpty(RCandidateName))
                {
                    if (SCandidateName == SUserName)
                    {
                        nameScore = SCandidateName == RCandidateName ? MatchCandidateName : 0f;
                        totalScore += nameScore;
                    }
                    else
                    {
                        nameScore += SCandidateName == RCandidateName ? MatchCandidateName : 0f;
                        nameScore += SUserName == RCandidateName ? MatchCandidateName : 0f;
                        totalScore += nameScore;
                    }
                }
                if (!string.IsNullOrEmpty(SEmail) && !string.IsNullOrEmpty(REmail))
                {
                    emailScore = SEmail == REmail ? MatchEmail : 0f;
                    totalScore += emailScore;
                }

                if (!string.IsNullOrEmpty(SMobile) && !string.IsNullOrEmpty(RMobile))
                {
                    mobileScore = SMobile == RMobile ? MatchMobile : 0f;
                    totalScore += mobileScore;
                }
                if (!string.IsNullOrEmpty(SMobileLast) && !string.IsNullOrEmpty(RMobile) && RMobile.Length >= 4)
                {
                    string mobileLast = RMobile.Trim().Substring(RMobile.Length - 4, 4);
                    mobileLastScore = SMobileLast == mobileLast ? MatchMobileLast : 0f;
                    totalScore += mobileLastScore;
                }
                if ((!string.IsNullOrEmpty(SExtId) || !string.IsNullOrEmpty(SHidResumeId) || !string.IsNullOrEmpty(SResumeUserId)) && !string.IsNullOrEmpty(RSynResumeId))
                {
                    float extIdScore = 0f;
                    string[] extIds = RSynResumeId.Split(' ');
                    for (int i = 0; i < extIds.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(extIds[i]))
                        {
                            extIdScore += extIds[i] == SExtId ? MatchExtId : 0f;
                            extIdScore += extIds[i] == SHidResumeId ? MatchExtId : 0f;
                            extIdScore += extIds[i] == SResumeUserId ? MatchExtId : 0f;
                        }
                    }
                    if (extIdScore > 0f)
                    {
                        synResumeIdScore = MatchExtId;
                        totalScore += synResumeIdScore;
                        SameIdentity = true;
                    }
                }
                if (!string.IsNullOrEmpty(SBirth) && !string.IsNullOrEmpty(RBirthNum))
                {
                    string birthStr = Convert.ToDateTime(SBirth).ToString("yyyy-MM").Replace("-", "");
                    birthScore = birthStr == RBirthNum ? MatchBirth : 0f;
                    totalScore += birthScore;
                }
                if (!string.IsNullOrEmpty(SSex) && !string.IsNullOrEmpty(RSex))
                {
                    sexScore = SSex != RSex ? MatchSex : 0f;
                    totalScore += sexScore;
                }
                if (!string.IsNullOrEmpty(SGraduateYear) && !string.IsNullOrEmpty(RGraduateYear))
                {
                    graduateYearScore = (SGraduateYear == RGraduateYear ? MatchGraduateYear : 0f);
                    totalScore += graduateYearScore;
                }
                if (!string.IsNullOrEmpty(SSchool) && !string.IsNullOrEmpty(RSchool))
                {
                    if (SSchool.Contains("$"))
                    {
                        string[] schools = SSchool.Split('$');
                        for (int j = 0; j < schools.Length; j++)
                        {
                            if (!string.IsNullOrEmpty(schools[j]))
                            {
                                schoolScore += (RSchool.IndexOf(schools[j].Trim()) >= 0 || schools[j].IndexOf(RSchool.Trim()) >= 0) ? MatchSchool : 0f;
                            }
                        }
                    }
                    else
                    {
                        schoolScore += (RSchool.IndexOf(SSchool.Trim()) >= 0 || SSchool.IndexOf(RSchool.Trim()) >= 0) ? MatchSchool : 0f;
                    }
                    if (schoolScore > 0f)
                    {
                        schoolScore = MatchSchool;
                        totalScore += schoolScore;
                    }
                }
                if (Plan == "A")
                {
                    if (!string.IsNullOrEmpty(RLabelContent) && !string.IsNullOrEmpty(SLabelContent))
                    {
                        //log.WriteLog("SLabelContent:" + SLabelContent + ";RLabelContent:" + RLabelContent, SExtId, SSource + SEmployeeNo);
                        labelContentScore = (float)lDistance.LevenshteinDistancePercent(SLabelContent, RLabelContent);
                        totalScore = totalScore + labelContentScore;
                    }
                }
                else if (Plan == "B" || Plan == "C")
                {
                    if (!string.IsNullOrEmpty(RLabelContent) && !string.IsNullOrEmpty(SLabelContent))
                    {
                        //log.WriteLog("SLabelContent:" + SLabelContent + ";RLabelContent:" + RLabelContent, SExtId, SSource + SEmployeeNo);
                        string sLabelContent = SLabelContent.Replace(" ", "").Replace("(", "").Replace(")", "").Replace("（", "").Replace("）", "");
                        string rLabelContent = RLabelContent.Replace(" ", "").Replace("(", "").Replace(")", "").Replace("（", "").Replace("）", "");
                        labelContentScore = (float)lDistance.LevenshteinDistancePercent(sLabelContent, rLabelContent);
                        totalScore = totalScore + (float)(labelContentScore * 0.5);
                    }
                }
                _score = (float)Math.Round(totalScore, 2);
                ScoreComment = RResumeId + "：Score=" + _score + "\r\n" + (nameScore > 0f ? ";name:" + nameScore : "") +
                               (emailScore > 0f ? ";email:" + emailScore : "") + (mobileScore > 0f ? ";mobile:" + mobileScore : "") +
                               (synResumeIdScore > 0f ? ";synResumeId:" + synResumeIdScore : "") +
                               (mobileLastScore > 0f ? ";mobileLast:" + mobileLastScore : "") +
                               (birthScore > 0f ? ";birth:" + birthScore : "") + (sexScore < 0f ? ";sex:" + sexScore : "") +
                               (schoolScore > 0f ? ";school:" + schoolScore : "") +
                               (graduateYearScore > 0f ? ";graduateYear:" + graduateYearScore : "") +
                               (labelContentScore > 0f ? ";labelContent:" + labelContentScore : "");
                //log.WriteLog(ScoreComment, SExtId, SSource + SEmployeeNo);
                return _score;
            }
            set { _score = value; }
        }

    }
}
