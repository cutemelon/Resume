using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ApplicationExtensions;
using DatabaseInterface.SystemInterface;
using DatabaseService.SystemService;
using Extensions;

namespace ApiManage
{
    public class TokenManage
    {
        private IUserDb userDb;
        private ICompanyDb companyDb = new CompanyDb();

        /// <summary>
        /// 验证token是否存在
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public bool VerifyToken(string token)
        {
            try
            {
                token = token.Replace("[", "=");
                var arry = token.Split(';');
                var userName = "";
                var password = "";
                var companyName = "";
                byte[] userNameBytes = Convert.FromBase64String(arry[0]);
                userName = System.Text.Encoding.Default.GetString(userNameBytes);
                byte[] passwdBytes = Convert.FromBase64String(arry[1]);
                password = System.Text.Encoding.Default.GetString(passwdBytes);
                byte[] companyNameBytes = Convert.FromBase64String(arry[2]);
                companyName = System.Text.Encoding.Default.GetString(companyNameBytes);
                var company = companyDb.GetCompanyById(companyName);
                if (company == null)
                {
                    return false;
                }
                var currentUserConnectionInfo = new ApplicationCommon().GetUserDBConnection(company);
                userDb = new UserDb(currentUserConnectionInfo);
                var user = userDb.GetUserByUsername(userName);
                if (user == null)
                {
                    return false;
                }
                if (!user.password.Trim().Equals(password.GetMd5(2), StringComparison.CurrentCultureIgnoreCase))
                {
                    return false;
                }
                if (user.status == 2)
                {
                    return false;
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>
        /// 获得TOKEN中的公司ID
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public string GetCompanyId(string token)
        {
            token = token.Replace("[", "=");
            var arry = token.Split(';');
            var companyId = "";
            byte[] companyIdBytes = Convert.FromBase64String(arry[2]);
            companyId = System.Text.Encoding.Default.GetString(companyIdBytes);
            return companyId;
        }

        /// <summary>
        /// 获得TOKEN中的用户名
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public string GetUserName(string token)
        {
            token = token.Replace("[", "=");
            var arry = token.Split(';');
            var userName = "";
            byte[] userNameBytes = Convert.FromBase64String(arry[0]);
            userName = System.Text.Encoding.Default.GetString(userNameBytes);
            return userName;
        }
    }
}
