using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DatabaseInterface.SystemInterface;
using DatabaseService.SystemService;

namespace ApplicationExtensions
{
    public class ApplicationCommon
    {
        private ICompanyDb companyDb = new CompanyDb();

        /// <summary>
        /// 获得该公司的数据库链接配置
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public string GetCompanyDBConnection(string userName)
        {
            var dbUsername = ConfigurationManager.AppSettings["DBUsername"];
            var dbPassword = ConfigurationManager.AppSettings["DBPassword"];
            var company = companyDb.GetCompanyByUsername(userName);
            var dbConnectionStr = string.Format("server={0};database={1};uid={2};pwd={3}", company.DB_IP_address,
                company.DB_name, dbUsername, dbPassword);
            return dbConnectionStr;
        }

    }
}
