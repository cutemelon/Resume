using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models.SystemManage;

namespace DatabaseInterface.SystemInterface
{
    public interface ICompanyDb
    {

        /// <summary>
        /// 创建一家公司信息
        /// </summary>
        /// <param name="company"></param>
        void AddCompany(CompanyModel company);

        /// <summary>
        /// 修改一家公司信息
        /// </summary>
        /// <param name="company"></param>
        /// <returns></returns>
        int UpdateCompany(CompanyModel company);

        /// <summary>
        /// 根据ID获得公司信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        CompanyModel GetCompanyById(string id);

        /// <summary>
        /// 根据用户名获得公司信息
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        CompanyModel GetCompanyByUsername(string username);

    }
}
