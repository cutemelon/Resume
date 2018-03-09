using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DatabaseInterface.SystemInterface;
using Infrastructure.DataAccess;
using Models.ShowModel.SystemManage;
using Models.SystemManage;

namespace DatabaseService.SystemService
{
    public class CompanyDb : ICompanyDb
    {
        private readonly IBaseDataAccess _dataAccess =
            new SqlServerDataAccess(ConfigurationManager.AppSettings["SystemDB"]);

        /// <summary>
        /// 创建一家公司信息
        /// </summary>
        /// <param name="company"></param>
        public void AddCompany(CompanyModel company)
        {
            _dataAccess.AddEntity(company);
        }

        /// <summary>
        /// 修改一家公司信息
        /// </summary>
        /// <param name="company"></param>
        /// <returns></returns>
        public int UpdateCompany(CompanyModel company)
        {
            return _dataAccess.UpdateEntity(company);
        }

        /// <summary>
        /// 根据ID获得公司信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public CompanyModel GetCompanyById(string id)
        {
            return _dataAccess.Get<CompanyModel>(id);
        }

        /// <summary>
        /// 根据用户名获得公司信息
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public CompanyModel GetCompanyByUsername(string username)
        {
            var sql = string.Format(@"select c.*
from userInfo u
left join company c on c.company_id = u.company_id
where u.username='{0}'", username);
            return _dataAccess.FetchListBySql<CompanyModel>(sql).FirstOrDefault();
        }

        /// <summary>
        /// 删除一家公司
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public int DeleteCompany(string companyId)
        {
            var sql = string.Format(@"update company set status=1 where company_id='{0}'", companyId);
            return _dataAccess.ExecuteSql(sql);
        }

        /// <summary>
        /// 列表搜索公司
        /// </summary>
        /// <param name="total"></param>
        /// <param name="companyName"></param>
        /// <param name="startIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public List<CompanyListShow> SearchCompanyList(out int total, string companyName = "", int startIndex = 1,
            int pageSize = int.MaxValue)
        {
            var where = " 1=1 ";
            if (!string.IsNullOrEmpty(companyName))
            {
                where += string.Format(" and company_name = '{0}'", companyName);
            }
            return _dataAccess.GetEntities<CompanyListShow>(out total, where, startIndex, pageSize, " create_time desc ").ToList();
        }

        /// <summary>
        /// 检查公司名称是否存在
        /// </summary>
        /// <param name="name"></param>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public bool CheckCompanyNameExists(string name, string companyId)
        {
            var sql = string.Format(@" company_name='{0}' and company_id != '{1}' ", name,
                companyId);
            return _dataAccess.GetCount<CompanyModel>(sql) > 0;
        }

        /// <summary>
        /// 根据公司编号获得公司信息
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public CompanyModel GetCompanyByCompanyCode(string companyCode)
        {
            var sql = string.Format(@"select * from company where company_code = '{0}'", companyCode);
            return _dataAccess.GetListBySql<CompanyModel>(sql).FirstOrDefault();
        }
    }
}
