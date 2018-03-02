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
    public class UserDb : IUserDb
    {
        private readonly IBaseDataAccess _dataAccess = BaseDataAccess.DataAccess;

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
            var sql = string.Format("select * from user where username='{0}' ", userName);
            return _dataAccess.FetchListBySql<UserModel>(sql).FirstOrDefault();
        }

    }
}
