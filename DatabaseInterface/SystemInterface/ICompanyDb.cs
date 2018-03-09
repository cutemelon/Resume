using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models.ShowModel.SystemManage;
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

        /// <summary>
        /// 删除一家公司
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        int DeleteCompany(string companyId);

        /// <summary>
        /// 列表搜索公司
        /// </summary>
        /// <param name="total"></param>
        /// <param name="companyName"></param>
        /// <param name="startIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        List<CompanyListShow> SearchCompanyList(out int total, string companyName = "", int startIndex = 1,
            int pageSize = int.MaxValue);

        /// <summary>
        /// 检查公司名称是否存在
        /// </summary>
        /// <param name="name"></param>
        /// <param name="companyId"></param>
        /// <returns></returns>
        bool CheckCompanyNameExists(string name, string companyId);

        /// <summary>
        /// 根据公司编号获得公司信息
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        CompanyModel GetCompanyByCompanyCode(string companyCode);

    }
}
