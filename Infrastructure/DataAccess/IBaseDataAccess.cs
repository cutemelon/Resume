using System.Collections;
using System.Collections.Generic;
using System.Data;
using Models;

namespace Infrastructure.DataAccess
{
    public interface IBaseDataAccess
    {
        string PagingSelect { get; }

        DataBaseType DataBaseType { get; }

        /// <summary>
        ///     通过限制条件，批量数据库记录删除
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        int DeleteEntities<T>(string where);

        /// <summary>
        ///     执行Sql语句，返回受影响的行数
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        int ExecuteSql(string sql, dynamic param = null);

        /// <summary>
        /// 传统方式执行Sql语句，返回结果中第一行第一列，如果没有结果，返回 null
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        object ExecuteScalar(string sql, params IDataParameter[] parameters);

        /// <summary>
        ///     添加一个实体
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        string AddEntity(BaseEntity entity);

        /// <summary>
        ///     添加一组实体
        /// </summary>
        /// <param name="entities"></param>
        /// <returns></returns>
        int AddEntities(ICollection entities);

        /// <summary>
        ///     更新一个实体
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="primaryKeyField"></param>
        /// <returns></returns>
        int UpdateEntity(BaseEntity entity, string primaryKeyField = "");

        /// <summary>
        ///     根据Id获取实体
        /// </summary>
        /// <typeparam name="T">类型</typeparam>
        /// <param name="id">主键Id</param>
        /// <param name="primaryKeyField"></param>
        /// <returns></returns>
        T Get<T>(string id, string primaryKeyField = "") where T : BaseEntity;

        /// <summary>
        ///     更新指定表的指定字段
        /// </summary>
        /// <param name="tableName">表名称</param>
        /// <param name="fieldName">字段名称</param>
        /// <param name="value">字段值</param>
        /// <param name="where">更新条件</param>
        /// <returns></returns>
        int UpdateField(string tableName, string fieldName, string value, string where);

        /// <summary>
        ///     更新指定表的指定字段
        /// </summary>
        /// <param name="tableName">表名称</param>
        /// <param name="fieldName">字段名称</param>
        /// <param name="value">字段值(表达式)</param>
        /// <param name="where">更新条件</param>
        /// <returns></returns>
        int UpdateFieldCalc(string tableName, string fieldName, string value, string where);

        /// <summary>
        ///     更新字段
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="fieldvalues">字段名称和字段值的键值对集合</param>
        /// <param name="where">更新条件</param>
        /// <returns></returns>
        int UpdateFields(string tableName, List<KeyValuePair<string, string>> fieldvalues, string where);

        /// <summary>
        ///     获取列表数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="strWhere"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        List<T> GetList<T>(string strWhere = "1=1", dynamic param = null) where T : BaseEntity;

        /// <summary>
        ///  根据主键Id获取实体集合
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entityIds"></param>
        /// <returns></returns>
        List<T> GetListByEntityIds<T>(IEnumerable<string> entityIds) where T : BaseEntity;

        /// <summary>
        /// 根据条件获取指定类型的记录数
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="where"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        int GetCount<T>(string where, dynamic param = null);

        /// <summary>
        ///     通用分页查询
        /// </summary>
        /// <param name="totalCount">总记录数</param>
        /// <param name="strWhere">查询条件</param>
        /// <param name="startIndex">起始记录位置</param>
        /// <param name="pageSize">每页记录数</param>
        /// <param name="orderBy">排序规则</param>
        /// <param name="param"></param>
        /// <returns></returns>
        IEnumerable<T> GetEntities<T>(out int totalCount, string strWhere = "1=1", int startIndex = 1,
            int pageSize = int.MaxValue, string orderBy = "", dynamic param = null) where T : BaseEntity;

        /// <summary>
        /// 使用SQL语句查询，获取结果集合
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        IEnumerable<T> GetListBySql<T>(string sql, dynamic parameters = null) where T : BaseEntity;

        IEnumerable<T> FetchListBySql<T>(string sql, dynamic parameters = null);

        /// <summary>
        /// 使用SQL语句查询，获取结果集合
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="order"></param>
        /// <param name="parameters"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        IEnumerable<T> GetListBySql<T>(string sql, int pageIndex, int pageSize, string order, dynamic parameters = null);

        bool Exists<T>(int entityId, string primaryKey = "");
    }
}