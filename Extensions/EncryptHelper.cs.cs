using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;

namespace Extensions
{
    public static class EncryptHelper
    {
        /// <summary>
        ///     使用MD5进行数据加密。
        ///     <para>请用2：密码加密</para>
        /// </summary>
        /// <param name="str">需要加密的数据。</param>
        /// <param name="kind">加密类型：1-普通加密；2-密码加密</param>
        /// <returns>返回加密的数据</returns>
        public static string GetMd5(this string str, int kind = 2)
        {
            string reStr = "";
            //获取要加密的字段，并转化为Byte[]数组
            byte[] data = Encoding.Unicode.GetBytes(str.ToCharArray());
            //建立加密服务
            MD5 md5 = new MD5CryptoServiceProvider();
            //1代表加密Byte[]数组
            if (kind == 1)
            {
                //加密Byte[]数组
                byte[] result = md5.ComputeHash(data);
                //将加密后的数组转化为字段
                string sResult = Encoding.Unicode.GetString(result);
                //MD5普通加密
                reStr = sResult;
            }
            //2代表作为密码方式加密
            else if (kind == 2)
            {
                //作为密码方式加密
                reStr = FormsAuthentication.HashPasswordForStoringInConfigFile(str, "MD5");
            }
            return reStr;
        }
    }
}
