using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DatabaseInterface.SystemInterface;
using DatabaseService.SystemService;
using Models.Common;
using Models.ShowModel.SystemManage;
using Models.SystemManage;

namespace Company
{
    public class CompanyManage
    {
        private ICompanyDb companyDb = new CompanyDb();
        private ReturnModel returnModel = new ReturnModel();

        /// <summary>
        /// 检查公司名称是否重复
        /// </summary>
        /// <param name="companyName"></param>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public bool CheckCompanyNameExists(string companyName, string companyId)
        {
            var company = companyDb.GetCompanyByUsername(companyName);
            if (company == null)
            {
                return false;
            }
            else
            {
                if (company.company_id == companyId)
                {
                    return false;
                }
            }
            return true;
        }

        /// <summary>
        /// 插入公司
        /// </summary>
        /// <param name="company"></param>
        /// <returns></returns>
        public ReturnModel AddCompany(CompanyModel company)
        {
            try
            {
                company.company_id = Guid.NewGuid().ToString();
                companyDb.AddCompany(company);
                returnModel.result = 0;
                returnModel.info = "新增成功！";
                return returnModel;
            }
            catch (Exception e)
            {
                returnModel.result = 1;
                returnModel.info = "新增失败！";
                return returnModel;
            }
        }

        /// <summary>
        /// 修改公司
        /// </summary>
        /// <param name="company"></param>
        /// <returns></returns>
        public ReturnModel UpdateCompany(CompanyModel company)
        {
            try
            {
                companyDb.UpdateCompany(company);
                returnModel.result = 0;
                returnModel.info = "修改成功！";
                return returnModel;
            }
            catch (Exception e)
            {
                returnModel.result = 1;
                returnModel.info = "修改失败！";
                return returnModel;
            }
        }

        /// <summary>
        /// 删除一家公司
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public ReturnModel DeleteCompany(string companyId)
        {
            try
            {
                companyDb.DeleteCompany(companyId);
                returnModel.result = 0;
                returnModel.info = "删除成功！";
                return returnModel;
            }
            catch (Exception e)
            {
                returnModel.result = 1;
                returnModel.info = "删除失败！";
                return returnModel;
            }
        }

        /// <summary>
        /// 搜索公司
        /// </summary>
        /// <param name="companyName"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public ReturnListModel SearchCompanyList(string companyName = "", int pageIndex = 1, int pageSize = 20)
        {
            var returnListModel = new ReturnListModel();
            try
            {
                var total = 0;
                var list = companyDb.SearchCompanyList(out total, companyName, pageIndex, pageSize);
                returnListModel.info = "";
                returnListModel.list = list;
                returnListModel.result = 0;
                returnListModel.total = total;
                return returnListModel;
            }
            catch (Exception e)
            {
                returnListModel.info = "查询失败！";
                returnListModel.list = new List<CompanyListShow>();
                returnListModel.result = 1;
                returnListModel.total = 0;
                return returnListModel;
            }
        }

        /// <summary>
        /// 获得一个公司信息
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public CompanyModel GetCompanyById(string companyId)
        {
            return companyDb.GetCompanyById(companyId);
        }

        /// <summary>
        /// 检查公司名称是否存在
        /// </summary>
        /// <param name="param"></param>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public bool CheckCompanyName(string param, string companyId)
        {
            return companyDb.CheckCompanyNameExists(param, companyId);
        }

    }
}
