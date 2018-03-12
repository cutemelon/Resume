using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models.SystemManage;

namespace DatabaseInterface.SystemInterface
{
    public interface IUserDb
    {

        /// <summary>
        /// 添加用户
        /// </summary>
        /// <param name="user"></param>
        void AddUser(UserModel user);

        /// <summary>
        /// 更新一个用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        int UpdateUser(UserModel user);

        /// <summary>
        /// 根据ID获得用户
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        UserModel GetUserById(string id);

        /// <summary>
        /// 根据用户名获得用户
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        UserModel GetUserByUsername(string userName);

        /// <summary>
        /// 获得用户列表
        /// </summary>
        /// <param name="total"></param>
        /// <param name="userName"></param>
        /// <param name="realName"></param>
        /// <param name="startIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        List<UserModel> GetUserList(out int total, string userName = "", string realName = "",
            int startIndex = 1, int pageSize = int.MaxValue);

    }
}
