using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DatabaseInterface.SystemInterface;
using Infrastructure.DataAccess;
using Models.SystemManage;

namespace DatabaseService.SystemService
{
    public class CompanyDb : ICompanyDb
    {
        private readonly IBaseDataAccess _dataAccess = BaseDataAccess.DataAccess;

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
left join company c on c.company_id = u.tanent_id
where u.username='{0}'", username);
            return _dataAccess.FetchListBySql<CompanyModel>(sql).FirstOrDefault();
        }
    }
}
