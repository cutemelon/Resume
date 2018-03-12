using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DatabaseInterface.SystemInterface;
using Infrastructure.DataAccess;
using Models.SystemManage;

namespace DatabaseService.SystemService
{
    public class UserDb : IUserDb
    {
        private readonly IBaseDataAccess _dataAccess;

        public UserDb(string connectionStr)
        {
            if (string.IsNullOrWhiteSpace(connectionStr))
            {
                _dataAccess = BaseDataAccess.DataAccess;
            }
            else
            {
                _dataAccess = new SqlServerDataAccess(connectionStr);
            }
        }

        /// <summary>
        /// 添加用户
        /// </summary>
        /// <param name="user"></param>
        public void AddUser(UserModel user)
        {
            _dataAccess.AddEntity(user);
        }

        /// <summary>
        /// 更新一个用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public int UpdateUser(UserModel user)
        {
            return _dataAccess.UpdateEntity(user);
        }

        /// <summary>
        /// 根据ID获得用户
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public UserModel GetUserById(string id)
        {
            return _dataAccess.Get<UserModel>(id);
        }

        /// <summary>
        /// 根据用户名获得用户
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public UserModel GetUserByUsername(string userName)
        {
            var sql = string.Format("select * from userInfo where username='{0}' and status=0", userName);
            return _dataAccess.FetchListBySql<UserModel>(sql).FirstOrDefault();
        }

        /// <summary>
        /// 获得用户列表
        /// </summary>
        /// <param name="total"></param>
        /// <param name="userName"></param>
        /// <param name="realName"></param>
        /// <param name="startIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public List<UserModel> GetUserList(out int total, string userName = "", string realName = "",
            int startIndex = 1, int pageSize = int.MaxValue)
        {
            var where = " 1=1 ";
            if (!string.IsNullOrWhiteSpace(userName))
            {
                where += string.Format(" and username like '%{0}%'", userName);
            }
            if (!string.IsNullOrWhiteSpace(realName))
            {
                where += string.Format(" and name like '%{0}%'", realName);
            }
            return _dataAccess.GetEntities<UserModel>(out total, where, startIndex, pageSize, " create_time desc ").ToList();
        }

    }
}
