using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Text;
using Extensions;
using Infrastructure.Log;
using Models;
using RTF.Data;

namespace Infrastructure.DataAccess
{
    public class SqlServerDataAccess : IBaseDataAccess
    {

        private readonly string _connectionStringName = "SqlServer";
        //private readonly string _providerName;
        private readonly string _connstr;
        private DbProviderFactory _factory;

        public DataBaseType DataBaseType
        {
            get
            {
                return DataBaseType.SqlServer;
            }
        }

        /// <summary>
        ///     分页查询的外部查询语句
        ///     <para>索引0：实际查询语句</para>
        ///     <para>索引1：排序规则</para>
        ///     <para>索引2：start</para>
        ///     <para>索引3：end</para>
        /// </summary>
        public string PagingSelect
        {
            get
            {
                return  @" SELECT  *
FROM    ( SELECT    ROW_NUMBER() OVER (ORDER BY {1} ) AS RowIndex ,
                    *
          FROM      ( {0} ) a
        ) v  WHERE v.RowIndex BETWEEN {2} AND {3} ";

            }
        }
           



        public static string PrimaryKeyPagingSelect = @"
SELECT  *
FROM    ( SELECT  {4},  ROW_NUMBER() OVER ( {1} ) AS RowIndex 
                    
          FROM      ( {0} ) a
        ) v  WHERE v.RowIndex BETWEEN {2} AND {3} 
";
        private string _identity = @" SELECT @@Identity AS ID ";

        //用于缓存Sql语句
        private readonly Dictionary<Type, string> _insertSqlCaches;
        private readonly Dictionary<Type, string> _updateSqlCaches;
        private readonly Dictionary<Type, SelectSqlCacheItem> _selectSqlCaches;
        /// <summary>
        ///     以配置文件中数据库连接字符串SqlServer实例化数据查询
        /// </summary>
        public SqlServerDataAccess()
        {
            if (ConfigurationManager.ConnectionStrings[_connectionStringName] != null)
            {

                _connstr = ConfigurationManager.ConnectionStrings[_connectionStringName].ConnectionString;

                _insertSqlCaches = new Dictionary<Type, string>();
                _updateSqlCaches = new Dictionary<Type, string>();
                _selectSqlCaches = new Dictionary<Type, SelectSqlCacheItem>();

                CommonConstruct();
                return;
            }
            throw new InvalidOperationException("Can't find a connection string with the name '" + _connectionStringName + "'");
        }

        /// <summary>
        ///     以连接字符串实例化数据查询
        /// </summary>
        /// <param name="connectionString">连接字符串</param>
        public SqlServerDataAccess(string connectionString)
        {
            if (ConfigurationManager.ConnectionStrings[_connectionStringName] != null)
            {
                _connstr = connectionString;
                _insertSqlCaches = new Dictionary<Type, string>();
                _updateSqlCaches = new Dictionary<Type, string>();

                CommonConstruct();
                return;
            }
            throw new InvalidOperationException("Can't find a connection string with the name '" + _connectionStringName + "'");
        }

        private void CommonConstruct()
        {
            _factory = DbProviderFactories.GetFactory("System.Data.SqlClient");
        }

        /// <summary>
        ///     打开一个Sql数据库连接
        /// </summary>
        /// <returns></returns>
        private IDbConnection OpenConnection()
        {
            IDbConnection connection = _factory.CreateConnection();
            connection.ConnectionString = _connstr;
            connection.Open();

            return connection;
        }

        private string ToSqlServer(string sql)
        {
            return sql;
        }

        /// <summary>
        ///     通过限制条件，批量数据库记录删除
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        public int DeleteEntities<T>(string where)
        {
            if (string.IsNullOrEmpty(where))
            {
                throw new Exception("删除条件不能为空");
            }
            if (!where.Trim().StartsWith("where", StringComparison.InvariantCultureIgnoreCase))
            {
                where = " WHERE " + where;
            }
            Type type = typeof(T);
            TableInfoAttribute tableInfo = TableInfoAttribute.GetAttribute(type);
            string tableName = tableInfo == null ? type.Name : tableInfo.TableName;
            string deleteSql = "DELETE FROM " + tableName + " " + where;

            return ExecuteSql(ToSqlServer(deleteSql));
        }

        /// <summary>
        ///     执行Sql语句，返回受影响的行数
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        public int ExecuteSql(string sql, dynamic param = null)
        {
            using (IDbConnection connection = OpenConnection())
            {
                return connection.Execute(ToSqlServer(sql), param as object);
            }
        }
        /// <summary>
        /// 传统方式执行Sql语句，返回结果中第一行第一列，如果没有结果，返回 null
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public object ExecuteScalar(string sql, params IDataParameter[] parameters)
        {
            using (IDbConnection connection = OpenConnection())
            {
                var cmd = connection.CreateCommand();
                cmd.CommandText = ToSqlServer(sql);
                foreach (var parameter in parameters)
                {
                    cmd.Parameters.Add(parameter);
                }
                object result = cmd.ExecuteScalar();


                if (result == null) return 0;
                Type resultType = result.GetType();
                if (resultType == typeof(int)) return (int)result;
                if (resultType == typeof(long))
                {
                    try
                    {
                        long lr = (long)result;
                        return Convert.ToInt32(lr);
                    }
                    catch (System.OverflowException)
                    {
                        LogHelper.Error(string.Format(@"执行SQL语句：{0} \r\n时，结果超出Int类型的最大值。", sql));
                        //throw;
                        return 0;
                    }
                }
                if (resultType == typeof(decimal))
                {
                    decimal dr = (decimal)result;
                    try
                    {
                        int ir = Convert.ToInt32(dr);
                        return ir;
                    }
                    catch (System.OverflowException)
                    {
                        LogHelper.Error(string.Format(@"执行SQL语句：{0} \r\n时，结果超出Int类型的最大值。", sql));
                        //throw;
                        return 0;
                    }
                }
                return result;
            }
        }

        /// <summary>
        ///     添加一个实体
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public string AddEntity(BaseEntity entity)
        {
            //判断是否启用了缓存
            Type type = entity.GetType();


            PropertyInfo[] propertyInfos = type.GetProperties();

            var ps = new DynamicParameters { };
            PropertyInfo pk = null;
            foreach (PropertyInfo propertyInfo in propertyInfos)
            {
                if (IdentityAttribute.GetAttribute(propertyInfo) != null)
                {
                    pk = propertyInfo;
                }
                if (GuidIdentityAttribute.GetAttribute(propertyInfo) != null)
                {
                    pk = propertyInfo;
                }
                if (ExcludeFieldAttribute.GetAttribute(propertyInfo) != null) continue;

                ps.Add(propertyInfo.Name, propertyInfo.GetValue(entity, null));
            }



            string insertSql = GenerateInsertSql(type);
            try
            {
                using (IDbConnection connection = OpenConnection())
                {
                    string id = connection.Query<string>(insertSql, ps).FirstOrDefault();


                    if (pk != null)
                    {
                        pk.SetValue(entity, Convert.ToInt32(id), null);
                    }

                    return id;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("发生错误，SQL语句为：" + insertSql + "\r\n实体为：" + entity, ex);
            }
        }

        /// <summary>
        ///     添加一组实体
        /// </summary>
        /// <param name="entities"></param>
        /// <returns></returns>
        public int AddEntities(ICollection entities)
        {
            if (entities == null)
            {
                throw new ArgumentNullException("entities", "列表为空");
            }
            if (entities.Count == 0)
            {
                return 0;
            }

            var insertSql = new StringBuilder();

            foreach (object entity in entities)
            {
                if (entity == null) continue;
                insertSql.AppendLine(GenerateInsertSql(entity));
            }
            try
            {
                using (IDbConnection connection = OpenConnection())
                {
                    return connection.Execute(ToSqlServer(insertSql.ToString()));
                }
            }
            catch (Exception ex)
            {
                throw new Exception("发生错误，SQL语句为：" + insertSql, ex);
            }
        }

        /// <summary>
        ///     更新一个实体
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="primaryKeyField"></param>
        /// <returns></returns>
        public int UpdateEntity(BaseEntity entity, string primaryKeyField = "")
        {
            Type t = entity.GetType();
            PropertyInfo[] ps = t.GetProperties();
            PropertyInfo pk;
            if (string.IsNullOrEmpty(primaryKeyField))
            {
                pk = ps.FirstOrDefault(p => IdentityAttribute.GetAttribute(p) != null);
                if (pk == null)
                {
                    pk = ps.FirstOrDefault(p => GuidIdentityAttribute.GetAttribute(p) != null);
                }
            }
            else
                pk = ps.FirstOrDefault(p => p.Name == primaryKeyField);
            if (pk == null)
            {
                throw new Exception(string.Format("实体{0}没有设置主键", t.FullName));
            }
            string where = " WHERE " + pk.Name + "=@" + pk.Name;

            string updateSql = "";
            //if (entity.Dbvalue.Count == 0)
            updateSql = GenerateUpdateSql(t);
            //else
            //    updateSql = GenerateUpdateSql(t, entity);

            if (string.IsNullOrWhiteSpace(updateSql))
                return 0;
            updateSql += where;

            try
            {
                using (IDbConnection connection = OpenConnection())
                {
                    int result = connection.Execute(ToSqlServer(updateSql), entity, null, 60);
                    return result;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("发生错误，SQL语句为：" + updateSql, ex);
            }
        }

        /// <summary>
        ///     根据Id获取实体
        /// </summary>
        /// <typeparam name="T">类型</typeparam>
        /// <param name="id">主键Id</param>
        /// <param name="primaryKeyField"></param>
        /// <returns></returns>
        public T Get<T>(string id, string primaryKeyField = "") where T : BaseEntity
        {
            //find key
            Type type = typeof(T);
            T entity;
            PropertyInfo pk;
            PropertyInfo[] ps = type.GetProperties();
            if (string.IsNullOrEmpty(primaryKeyField))
                pk = GetPrimaryKey(type);
            else
                pk = ps.FirstOrDefault(p => p.Name == primaryKeyField);
            if (pk == null)
            {
                throw new Exception(string.Format("实体{0}没有设置主键", type.FullName));
            }
            TableInfoAttribute tableInfo = TableInfoAttribute.GetAttribute(type);
            string where = string.Format("{0}.{1}='{2}'", tableInfo == null ? type.Name : tableInfo.TableName, pk.Name, id);

            entity = GetList<T>(where).FirstOrDefault();
            //if (entity != null)
            //    foreach (var item in ps)
            //    {
            //        entity.Dbvalue.Add(new KeyValuePair<string, object>(item.Name, item.GetValue(entity, null)));
            //    }
            return entity;
        }

        private PropertyInfo GetPrimaryKey(Type type)
        {
            PropertyInfo[] ps = type.GetProperties();
            PropertyInfo pk = ps.FirstOrDefault(p => IdentityAttribute.GetAttribute(p) != null);
            if (pk == null)
            {
                pk = ps.FirstOrDefault(p => GuidIdentityAttribute.GetAttribute(p) != null);
            }
            return pk;
        }

        /// <summary>
        ///     更新指定表的指定字段
        /// </summary>
        /// <param name="tableName">表名称</param>
        /// <param name="fieldName">字段名称</param>
        /// <param name="value">字段值</param>
        /// <param name="where">更新条件</param>
        /// <returns></returns>
        public int UpdateField(string tableName, string fieldName, string value, string where)
        {
            using (IDbConnection conneciont = OpenConnection())
            {
                if (!where.TrimStart().StartsWith("where", StringComparison.OrdinalIgnoreCase))
                {
                    where = " WHERE " + where;
                }
                value = "'" + value + "'";
                string updateSql = string.Format("UPDATE {0} SET {1}={2} {3}", tableName, fieldName, value, where);
                return conneciont.Execute(updateSql);
            }
        }
        /// <summary>
        ///     更新指定表的指定字段
        /// </summary>
        /// <param name="tableName">表名称</param>
        /// <param name="fieldName">字段名称</param>
        /// <param name="value">字段值(表达式)</param>
        /// <param name="where">更新条件</param>
        /// <returns></returns>
        public int UpdateFieldCalc(string tableName, string fieldName, string value, string where)
        {
            using (IDbConnection conneciont = OpenConnection())
            {
                if (!where.TrimStart().StartsWith("where", StringComparison.OrdinalIgnoreCase))
                {
                    where = " WHERE " + where;
                }
                string updateSql = string.Format("UPDATE {0} SET {1}={2} {3}", tableName, fieldName, value, where);
                return conneciont.Execute(updateSql);
            }
        }

        /// <summary>
        ///     更新字段
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="fieldvalues">字段名称和字段值的键值对集合</param>
        /// <param name="where">更新条件</param>
        /// <returns></returns>
        public int UpdateFields(string tableName, List<KeyValuePair<string, string>> fieldvalues, string where)
        {
            using (IDbConnection connection = OpenConnection())
            {
                if (!string.IsNullOrEmpty(where))
                {
                    if (!where.TrimStart().StartsWith("where", StringComparison.CurrentCultureIgnoreCase))
                    {
                        where = " WHERE " + where;
                    }
                }
                StringBuilder updateSql = new StringBuilder().AppendFormat("UPDATE {0} SET ", tableName);
                for (int i = 0; i < fieldvalues.Count; i++)
                {
                    string value = fieldvalues[i].Value == null ? "NULL" : string.Format("'{0}'", fieldvalues[i].Value);

                    updateSql.AppendFormat("{0}={1}", fieldvalues[i].Key, value);

                    if (i < fieldvalues.Count - 1)
                        updateSql.Append(",");
                    updateSql.AppendLine();
                }
                updateSql.Append(where);
                return connection.Execute(ToSqlServer(updateSql.ToString()));
            }
        }

        /// <summary>
        ///     获取列表数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="strWhere"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        public List<T> GetList<T>(string strWhere = "1=1", dynamic param = null) where T : BaseEntity
        {
            using (IDbConnection connection = OpenConnection())
            {
                string sql = GenerateSelectSql<T>(strWhere);
                return connection.Query<T>(ToSqlServer(sql), param as object).ToList();
            }
        }

        private List<T> FetchEntities<T>(string strwhere, dynamic param = null) where T : BaseEntity
        {
            using (var connection = OpenConnection())
            {
                string sql = GenerateSelectSql<T>(strwhere);
                return connection.Query<T>(ToSqlServer(sql), param as object).ToList();
            }
        }
        /// <summary>
        ///  根据主键Id获取实体集合
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entityIds"></param>
        /// <returns></returns>
        public List<T> GetListByEntityIds<T>(IEnumerable<string> entityIds) where T : BaseEntity
        {

            T[] tArray = new T[entityIds.Count()];
            IDictionary<string, int> objs = new Dictionary<string, int>();
            for (int i = 0; i < entityIds.Count(); i++)
            {
                tArray[i] = default(T);
                objs[entityIds.ElementAt(i)] = i;
            }
            if (objs.Any())
            {
                var entityType = typeof(T);
                var tableInfoAttr = TableInfoAttribute.GetAttribute(entityType);
                var pk = entityType.GetProperties().FirstOrDefault(p => IdentityAttribute.GetAttribute(p) != null);
                var tableName = tableInfoAttr == null ? entityType.Name : tableInfoAttr.TableName;
                if (pk == null)
                {
                    pk = entityType.GetProperties().FirstOrDefault(p => GuidIdentityAttribute.GetAttribute(p) != null);
                }
                if (pk != null)
                {
                    var idsString = "";
                    for (int i = 0; i < objs.Keys.ToArray().Length; i++)
                    {
                        idsString = idsString +
                                    (i == 0
                                        ? ("'" + objs.Keys.ToArray()[i] + "'")
                                        : (",'" + objs.Keys.ToArray()[i] + "'"));
                    }
                    var datalist = FetchEntities<T>(tableName + "." + pk.Name + " IN(" + idsString + ")");
                    foreach (var entity1 in datalist)
                    {
                        tArray[objs[entity1.EntityId]] = entity1;
                    }
                }
            }
            List<T> tEntities = new List<T>();
            T[] tArray1 = tArray;
            for (int i = 0; i < tArray1.Length; i++)
            {
                T entity2 = tArray1[i];
                if (entity2 != null)
                {
                    tEntities.Add(entity2);
                }
            }
            return tEntities;
        }

        /// <summary>
        /// 根据条件获取指定类型的记录数
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="where"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        public int GetCount<T>(string where, dynamic param = null)
        {
            string sql = GenerateCountSql<T>(where);
            using (IDbConnection connection = OpenConnection())
            {
                return connection.Query<int>(ToSqlServer(sql), param as object).First();
            }
        }


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
        public IEnumerable<T> GetEntities<T>(out int totalCount, string strWhere = "1=1", int startIndex = 1,
                               int pageSize = int.MaxValue, string orderBy = "", dynamic param = null) where T : BaseEntity
        {
            using (IDbConnection connection = OpenConnection())
            {
                if (string.IsNullOrEmpty(strWhere))
                    strWhere = "1=1";
                if (!strWhere.TrimStart().StartsWith("WHERE", StringComparison.CurrentCultureIgnoreCase))
                {
                    strWhere = " WHERE " + strWhere;
                }
                var pk = GetPrimaryKey(typeof(T));
                if (string.IsNullOrEmpty(orderBy))
                {
                    if (pk != null)
                        orderBy = pk.Name + " DESC ";
                    else throw new Exception("未设置排序字段");
                }

                if (orderBy.Trim().StartsWith("ORDER BY", StringComparison.CurrentCultureIgnoreCase))
                {
                    orderBy = orderBy.ToLower().Replace("order by", " ");
                }

                string countSql = GenerateCountSql<T>(strWhere);
                totalCount = connection.Query<int>(ToSqlServer(countSql), param as object).First();
                if (totalCount == 0) return new T[0];

                if (int.MaxValue == pageSize) pageSize--;
                int end = startIndex + pageSize - 1;

                string dataSql = string.Format(PagingSelect
                    , GenerateSelectSql<T>(strWhere)
                    , orderBy
                    , startIndex
                    , end);

                return connection.Query<T>(ToSqlServer(dataSql), param as object);
            }
        }
        /// <summary>
        /// 使用SQL语句查询，获取结果集合
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public IEnumerable<T> GetListBySql<T>(string sql, dynamic parameters = null) where T : BaseEntity
        {
            using (IDbConnection connection = OpenConnection())
            {
                return connection.Query<T>(ToSqlServer(sql), parameters as object);
            }
        }

        public IEnumerable<T> FetchListBySql<T>(string sql, dynamic parameters = null)
        {
            using (IDbConnection connection = OpenConnection())
            {
                return connection.Query<T>(ToSqlServer(sql), parameters as object);
            }
        }

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
        public IEnumerable<T> GetListBySql<T>(string sql, int pageIndex, int pageSize, string order, dynamic parameters = null)
        {
            using (IDbConnection connection = OpenConnection())
            {
                var pagingSql = string.Format(PagingSelect, sql, order, (pageIndex - 1) * pageSize + 1, pageIndex * pageSize);
                return connection.Query<T>(ToSqlServer(pagingSql), parameters as object);
            }
        }
        

        /// <summary>
        ///     生成查询语句
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        internal string GenerateSelectSql<T>(string where = "")
        {
            Type t = typeof(T);
            return GenerateSelectSql(t, where);
        }
        /// <summary>
        /// 生成查询主键的SQL语句
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        internal string GenerateSelectPkSql<T>(string where = "")
        {
            if (!string.IsNullOrEmpty(where))
            {
                if (!where.TrimStart().StartsWith("WHERE", StringComparison.CurrentCultureIgnoreCase))
                {
                    where = " WHERE " + where;
                }
            }
            var selectSql = new StringBuilder("SELECT ");
            List<FieldProperty> fpmap = FieldProperty.GetFieldPropertys<T>();
            List<FieldProperty> tables = FieldProperty.GetTables<T>();
            FieldProperty masterTable = fpmap.FirstOrDefault(p => string.IsNullOrEmpty(p.MasterTableField));

            var ps = typeof(T).GetProperties();
            var pk = ps.FirstOrDefault(p => IdentityAttribute.GetAttribute(p) != null);
            if (pk == null)
            {
                return string.Empty;
            }
            selectSql.AppendFormat("{0}.{1}", masterTable.TableAlias, pk.Name);
            //selectSql.Append(pk.Name);
            selectSql.AppendLine();
            selectSql.AppendLine(" FROM ");
            selectSql.Append(" " + "".PadLeft(tables.Count - 1, '('));
            selectSql.AppendFormat(" {0} {1} ", masterTable.TableName, masterTable.TableAlias);

            foreach (FieldProperty item in tables)
            {
                if (!string.IsNullOrEmpty(where))
                {
                    where = where.Replace(" " + item.TableName + ".", " " + item.TableAlias + ".")
                                 .Replace("(" + item.TableName + ".", "(" + item.TableAlias + ".")
                                 .Replace("=" + item.TableName + ".", "=" + item.TableAlias + ".");
                }
                if (item.TableAlias == masterTable.TableAlias) continue;
                selectSql.AppendFormat(" LEFT JOIN {0} {1} ", item.TableName, item.TableAlias);
                selectSql.AppendFormat(" ON {0}.{1}={2}.{3}) ", masterTable.TableAlias, item.MasterTableField,
                                       item.TableAlias, item.RelateField);
                selectSql.AppendLine();
            }
            string strSql = selectSql + where;

            return strSql;
        }
        /// <summary>
        ///     生成查询语句
        /// </summary>
        /// <returns></returns>
        internal string GenerateSelectSql(Type type, string where = "")
        {
            if (!string.IsNullOrEmpty(where))
            {
                if (!where.TrimStart().StartsWith("WHERE", StringComparison.CurrentCultureIgnoreCase))
                {
                    where = " WHERE " + where;
                }
            }
            var selectSql = new StringBuilder("SELECT ");
            List<FieldProperty> fpmap = FieldProperty.GetFieldPropertys(type);
            List<FieldProperty> tables = FieldProperty.GetTables(type);
            FieldProperty masterTable = fpmap.FirstOrDefault(p => string.IsNullOrEmpty(p.MasterTableField));

            foreach (FieldProperty item in fpmap)
            {
                if (string.IsNullOrEmpty(item.FieldAlias))
                    selectSql.AppendFormat("{0}.{1},", item.TableAlias, item.FieldName);
                else selectSql.AppendFormat("{0}.{1} {2},", item.TableAlias, item.FieldName, item.FieldAlias);
            }

            //增加扩展字段
            //Type type = typeof(T);
            PropertyInfo[] propertyInfos = type.GetProperties();
            foreach (PropertyInfo info in propertyInfos)
            {
                ExtendedAttribute extended = ExtendedAttribute.GetAttribute(info);
                if (extended != null)
                {
                    var extSql = extended.ExtendedSql;
                    foreach (FieldProperty item in tables)
                    {
                        extSql = extSql.Replace(" " + item.TableName + ".", " " + item.TableAlias + ".")
                                                       .Replace("(" + item.TableName + ".", "(" + item.TableAlias + ".")
                                                       .Replace("=" + item.TableName + ".", "=" + item.TableAlias + ".");

                    }
                    selectSql.Append("(" + extSql + ") " + info.Name + ",");
                }
            }

            selectSql = selectSql.Remove(selectSql.Length - 1, 1);
            selectSql.AppendLine();
            selectSql.AppendLine(" FROM ");
            selectSql.Append(" " + "".PadLeft(tables.Count - 1, '('));
            selectSql.AppendFormat(" {0} {1} ", masterTable.TableName, masterTable.TableAlias);

            foreach (FieldProperty item in tables)
            {
                if (!string.IsNullOrEmpty(where))
                {
                    where = where.Replace(" " + item.TableName + ".", " " + item.TableAlias + ".")
                                 .Replace("(" + item.TableName + ".", "(" + item.TableAlias + ".")
                                 .Replace("=" + item.TableName + ".", "=" + item.TableAlias + ".");
                }
                if (item.TableAlias == masterTable.TableAlias) continue;
                selectSql.AppendFormat(" LEFT JOIN {0} {1} ", item.TableName, item.TableAlias);
                selectSql.AppendFormat(" ON {0}.{1}={2}.{3}) ", masterTable.TableAlias, item.MasterTableField,
                                       item.TableAlias, item.RelateField);
                selectSql.AppendLine();
            }
            string strSql = selectSql + where;

            return strSql;
        }
        /// <summary>
        ///     生成查询数据记录数的Sql语句
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="where"></param>
        /// <returns></returns>
        internal string GenerateCountSql<T>(string where = "")
        {
            if (!string.IsNullOrEmpty(where))
            {
                if (!where.TrimStart().StartsWith("WHERE", StringComparison.CurrentCultureIgnoreCase))
                {
                    where = " WHERE " + where;
                }
            }
            var selectSql = new StringBuilder("SELECT COUNT(1)  ");
            ICollection<FieldProperty> fpmap = FieldProperty.GetFieldPropertys<T>();
            ICollection<FieldProperty> tables = FieldProperty.GetTables<T>();
            FieldProperty masterTable = fpmap.FirstOrDefault(p => string.IsNullOrEmpty(p.MasterTableField));


            selectSql.AppendLine(" FROM ");
            string leftBrackets = "".PadLeft(tables.Count - 1, '(');
            selectSql.Append(" " + leftBrackets);
            selectSql.AppendFormat(" {0} {1} ", masterTable.TableName, masterTable.TableAlias);

            foreach (FieldProperty item in tables)
            {
                if (!string.IsNullOrEmpty(where))
                {
                    where = where.Replace(" " + item.TableName + ".", " " + item.TableAlias + ".")
                        .Replace("(" + item.TableName + ".", "(" + item.TableAlias + ".");
                }
                if (item.TableAlias == masterTable.TableAlias) continue;
                selectSql.AppendFormat(" LEFT JOIN {0} {1} ", item.TableName, item.TableAlias);
                selectSql.AppendFormat(" ON {0}.{1}={2}.{3}) ", masterTable.TableAlias, item.MasterTableField,
                                       item.TableAlias, item.RelateField);
                selectSql.AppendLine();
            }
            string strSql = selectSql + where;

            return strSql;
        }

        /// <summary>
        ///     生成新增的Sql语句
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        internal string GenerateInsertSql<T>()
        {
            Type type = typeof(T);
            return GenerateInsertSql(type);
        }

        /// <summary>
        ///     生成新增的Sql语句
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        internal string GenerateInsertSql(Type type)
        {
            //判断缓存中存在已经生成的Sql语句，则直接返回
            if (_insertSqlCaches.ContainsKey(type))
            {
                return _insertSqlCaches[type];
            }
            PropertyInfo[] propertyInfos = type.GetProperties();
            var insertSql = new StringBuilder();

            bool hasIdentityField = false;
            TableInfoAttribute tableInfo = TableInfoAttribute.GetAttribute(type);
            string tableName = tableInfo == null ? type.Name : tableInfo.TableName;
            insertSql.AppendFormat("INSERT INTO {0} (", tableName);

            var values = new StringBuilder(" VALUES (");
            int columnCount = 0;
            foreach (PropertyInfo info in propertyInfos)
            {
                ExtendedAttribute extended = ExtendedAttribute.GetAttribute(info);
                if (extended != null) continue;
                ExcludeFieldAttribute exclude = ExcludeFieldAttribute.GetAttribute(info);
                if (exclude != null) continue;
                IdentityAttribute identity = IdentityAttribute.GetAttribute(info);
                if (identity != null)
                {
                    hasIdentityField = true;
                    continue;
                }
                GuidIdentityAttribute guidIdentity = GuidIdentityAttribute.GetAttribute(info);
                if (guidIdentity != null)
                {
                    hasIdentityField = true;
                    continue;
                }
                RefFieldAttribute refField = RefFieldAttribute.GetAttribute(info);
                if (refField != null) continue;
                if (columnCount != 0)
                {
                    insertSql.Append(",");
                    values.Append(",");
                }
                insertSql.AppendFormat("{0}", info.Name);
                values.AppendLine("@" + info.Name);
                columnCount++;
            }
            insertSql.AppendFormat(") {0} ) ", values);

            if (hasIdentityField)
            {
                insertSql.AppendFormat(_identity);
            }
            string insertSqlstr = insertSql.ToString();
            _insertSqlCaches.Add(type, insertSqlstr); //加入缓存
            return insertSqlstr;
        }

        /// <summary>
        ///     生成新增的Sql语句
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        internal string GenerateInsertSql(object obj)
        {
            Type type = obj.GetType();

            PropertyInfo[] propertyInfos = type.GetProperties();
            var insertSql = new StringBuilder();
            TableInfoAttribute tableInfo = TableInfoAttribute.GetAttribute(type);
            string tableName;
            if (tableInfo == null)
            {
                tableName = type.Name;
            }
            else
            {
                tableName = tableInfo.TableName;
            }

            insertSql.AppendFormat("INSERT INTO {0} (", tableName);

            var values = new StringBuilder(" VALUES (");
            int columnCount = 0;
            foreach (PropertyInfo info in propertyInfos)
            {
                ExtendedAttribute extended = ExtendedAttribute.GetAttribute(info);
                if (extended != null)
                    continue;
                ExcludeFieldAttribute exclude = ExcludeFieldAttribute.GetAttribute(info);
                if (exclude != null)
                    continue;
                IdentityAttribute identity = IdentityAttribute.GetAttribute(info);
                if (identity != null)
                    continue;
                RefFieldAttribute refField = RefFieldAttribute.GetAttribute(info);
                if (refField != null)
                    continue;
                if (columnCount != 0)
                {
                    insertSql.Append(",");
                    values.Append(",");
                }
                object value = info.GetValue(obj, null);
                if (value == null || value == DBNull.Value)
                {
                    value = "NULL";
                }
                else
                {
                    value = string.Format("'{0}'", value);
                }
                insertSql.AppendFormat("{0}", info.Name);
                values.Append(value);
                columnCount++;
            }
            insertSql.AppendFormat(") {0} ) ", values);

            string insertSqlstr = insertSql.ToString() + ";";
            //_insertSqlCaches.Add(type, insertSqlstr);//加入缓存
            return insertSqlstr;
        }

        /// <summary>
        ///     生成更新的Sql语句
        ///     <para>注意：生成的Sql语句不带Where条件</para>
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        private string GenerateUpdateSql<T>()
        {
            Type type = typeof(T);
            return GenerateUpdateSql(type);
        }

        private string GenerateUpdateSql(Type type)
        {
            //判断缓存中存在已经生成的Sql语句，则直接返回
            if (_updateSqlCaches.ContainsKey(type))
            {
                return _updateSqlCaches[type];
            }
            PropertyInfo[] propertyInfos = type.GetProperties();
            TableInfoAttribute tableInfo = TableInfoAttribute.GetAttribute(type);
            string tableName = tableInfo == null ? type.Name : tableInfo.TableName;
            var updateSql = new StringBuilder();
            updateSql.AppendFormat("UPDATE {0} SET ", tableName);
            int columnCount = 0;

            foreach (PropertyInfo info in propertyInfos)
            {
                ExtendedAttribute extended = ExtendedAttribute.GetAttribute(info);
                if (extended != null) continue;
                ExcludeFieldAttribute exclude = ExcludeFieldAttribute.GetAttribute(info);
                if (exclude != null) continue;
                IdentityAttribute identity = IdentityAttribute.GetAttribute(info);
                if (identity != null) continue;
                RefFieldAttribute refField = RefFieldAttribute.GetAttribute(info);
                if (refField != null) continue;
                GuidIdentityAttribute guidIdentity = GuidIdentityAttribute.GetAttribute(info);
                if (guidIdentity != null) continue;

                if (columnCount != 0) updateSql.Append(",");
                updateSql.AppendFormat("{0}=@{0}", info.Name);
                columnCount++;
            }
            string updateString = updateSql.ToString();
            _updateSqlCaches[type] = updateString;
            return updateString;
        }

        private string GenerateUpdateSql(Type type, BaseEntity entity)
        {
            PropertyInfo[] propertyInfos = type.GetProperties();
            TableInfoAttribute tableInfo = TableInfoAttribute.GetAttribute(type);
            string tableName = tableInfo == null ? type.Name : tableInfo.TableName;
            var updateString = new StringBuilder();
            updateString.AppendFormat("UPDATE {0} SET ", tableName);
            int columnCount = 0;

            foreach (PropertyInfo info in propertyInfos)
            {
                ExtendedAttribute extended = ExtendedAttribute.GetAttribute(info);
                if (extended != null) continue;
                ExcludeFieldAttribute exclude = ExcludeFieldAttribute.GetAttribute(info);
                if (exclude != null) continue;
                IdentityAttribute identity = IdentityAttribute.GetAttribute(info);
                if (identity != null) continue;
                RefFieldAttribute refField = RefFieldAttribute.GetAttribute(info);
                if (refField != null) continue;
                GuidIdentityAttribute guidIdentity = GuidIdentityAttribute.GetAttribute(info);
                if (guidIdentity != null) continue;
                //var dbv = entity.Dbvalue.FirstOrDefault(p => p.Key == info.Name);
                //var newvalue = info.GetValue(entity, null);
                //if (dbv.Value != null && newvalue != null)
                //    if (dbv.ToString() == newvalue.ToString()) continue;

                if (columnCount != 0) updateString.Append(",");
                updateString.AppendFormat("{0}=@{0}", info.Name);
                columnCount++;
            }
            if (columnCount == 0)
                return "";
            return updateString.ToString();
        }

        internal string GenerateUpdateSql<T>(string where)
        {
            if (!string.IsNullOrEmpty(where))
            {
                if (!where.TrimStart().StartsWith("WHERE", StringComparison.CurrentCultureIgnoreCase))
                {
                    where = " WHERE " + where;
                }
            }
            return GenerateUpdateSql<T>() + " " + where;
        }

        public bool Exists<T>(int entityId, string primaryKey = "")
        {
            var ps = typeof(T).GetProperties();
            if (string.IsNullOrEmpty(primaryKey))
            {
                foreach (var propertyInfo in ps)
                {
                    IdentityAttribute identity = IdentityAttribute.GetAttribute(propertyInfo);
                    GuidIdentityAttribute guidIdentity = GuidIdentityAttribute.GetAttribute(propertyInfo);
                    if (identity != null)
                    {
                        primaryKey = propertyInfo.Name;
                        break;
                    }
                    else if (guidIdentity != null)
                    {
                        primaryKey = propertyInfo.Name;
                        break;
                    }
                }
            }

            if (string.IsNullOrEmpty(primaryKey))
            {
                throw new Exception("没有指定主键");
            }
            var sqlwhere = primaryKey + "=" + entityId;
            int count = GetCount<T>(sqlwhere);
            return count > 0;
        }
    }
}