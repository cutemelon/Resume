using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using Models;

namespace Infrastructure.DataAccess
{
    /// <summary>
    /// 基础数据库访问对象（SQL版）
    /// </summary>
    public class BaseDataAccess
    {
        private static IBaseDataAccess _dataAccess;
        public static IBaseDataAccess DataAccess
        {
            get
            {
                if (_dataAccess == null)
                {
                    var tpstr = ConfigurationManager.AppSettings["DataAccess"];
                    var t = Type.GetType(tpstr);
                    _dataAccess = (IBaseDataAccess)Activator.CreateInstance(t);
                }

                return _dataAccess;
            }
        }

        private BaseDataAccess() { }
    }

    public enum DataBaseType
    {
        SqlServer,
        MySql,
        Oracle,
        Other
    }
    /// <summary>
    ///     表、列 对应 属性
    /// </summary>
    class FieldProperty
    {
        private string _masterField = string.Empty;

        private FieldProperty()
        {
        }

        /// <summary>
        ///     表名
        /// </summary>
        public string TableName { get; private set; }

        /// <summary>
        ///     表别名
        /// </summary>
        public string TableAlias { get; private set; }

        /// <summary>
        ///     字段名
        /// </summary>
        public string FieldName { get; private set; }

        /// <summary>
        ///     字段别名
        /// </summary>
        public string FieldAlias { get; set; }

        /// <summary>
        ///     关联字段中主表的字段
        /// </summary>
        public string MasterTableField
        {
            get { return _masterField; }
            private set { _masterField = value; }
        }

        /// <summary>
        ///     关联表中的关联字段
        ///     <para>一般为主键</para>
        /// </summary>
        public string RelateField { get; private set; }

        /// <summary>
        ///     对应实体属性
        /// </summary>
        private string PropertyName { get; set; }

        //去除重复记录，保证表和主表关联字段的组合只有一个
        //得到的结果就是要关联的表
        private static List<FieldProperty> Distinct(List<FieldProperty> list)
        {
            var result = new FieldProperty[list.Count];
            list.CopyTo(result);

            List<FieldProperty> resultList = result.ToList();

            for (int i = 0; i < resultList.Count; i++)
            {
                for (int j = i + 1; j < resultList.Count; j++)
                {
                    if (resultList[i].TableName == resultList[j].TableName &&
                        resultList[i].MasterTableField == resultList[j].MasterTableField)
                    {
                        resultList.RemoveAt(j);
                        j--;
                    }
                }
            }
            return resultList;
        }

        public static List<FieldProperty> GetFieldPropertys<T>()
        {
            Type t = typeof(T);
            return GetFieldPropertys(t);
        }

        internal static List<FieldProperty> GetFieldPropertys(Type t)
        {
            var fplist = new List<FieldProperty>();
            TableInfoAttribute tableInfo = TableInfoAttribute.GetAttribute(t);

            PropertyInfo[] ps = t.GetProperties();

            #region 取出映射关系

            foreach (PropertyInfo item in ps)
            {
                var fp = new FieldProperty();
                var excludeFieldAttribute = (ExcludeFieldAttribute)Attribute.GetCustomAttribute(item, typeof(ExcludeFieldAttribute));
                if (excludeFieldAttribute != null)
                    continue;

                ExtendedAttribute extendedAttribute = ExtendedAttribute.GetAttribute(item);
                if (extendedAttribute != null)
                    continue;

                RefFieldAttribute fieldattr = RefFieldAttribute.GetAttribute(item);
                if (fieldattr != null)
                {
                    fp.TableName = fieldattr.RefTableName;
                    fp.FieldName = fieldattr.RefFieldName ?? item.Name;
                    fp.FieldAlias = item.Name;
                    fp.PropertyName = item.Name;
                    fp.MasterTableField = fieldattr.MasterTableField;
                    fp.RelateField = fieldattr.RefTableKey;
                    fplist.Add(fp);
                }
                else
                {
                    fp.TableName = tableInfo == null ? t.Name : tableInfo.TableName;
                    fp.FieldName = item.Name;
                    fp.PropertyName = item.Name;
                    fplist.Add(fp);
                }
            }

            #endregion

            List<FieldProperty> tables = Distinct(fplist);
            for (int i = 0; i < tables.Count; i++)
            {
                string alias = "t" + i;
                foreach (FieldProperty item in fplist)
                {
                    if (item.TableName == tables[i].TableName && item.MasterTableField == tables[i].MasterTableField)
                    {
                        item.TableAlias = alias;
                        //if (string.IsNullOrEmpty(item.FieldAlias))
                        //    item.FieldAlias = alias + "_" + item.FieldName;
                    }
                }
            }
            return fplist;
        }

        /// <summary>
        ///     获取类型“T”中所有关联表信息
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static List<FieldProperty> GetTables<T>()
        {
            return Distinct(GetFieldPropertys<T>());
        }
        internal static List<FieldProperty> GetTables(Type type)
        {
            return Distinct(GetFieldPropertys(type));
        }
    }
    class SelectSqlCacheItem
    {
        public Type EntityType { get; set; }

        public string SelectSql { get; set; }

        private List<FieldProperty> _selectTables = new List<FieldProperty>();

        public List<FieldProperty> SelectTables { get { return _selectTables; } }
    }

    class EntityUpdateTrackHelper
    {
        private static object _sync = new object();
        private static Dictionary<string, Dictionary<string, object>> _items = new Dictionary<string, Dictionary<string, object>>();

        public static string GetEntityKey(BaseEntity entity)
        {
            Type t = entity.GetType();
            return GetEntityKey(t, entity.EntityId);
        }

        public static string GetEntityKey(Type t, object entityId)
        {
            return t.FullName + ":" + entityId;
        }

        public void SetCache(BaseEntity entity)
        {
            lock (_sync)
            {
                var key = GetEntityKey(entity);
                if (_items.ContainsKey(key))
                {
                    return;
                }

                var value = new Dictionary<string, object>();
                Type t = entity.GetType();
                var ps = t.GetProperties();
                foreach (var info in ps)
                {
                    value[info.Name] = info.GetValue(entity, null);
                }
                _items[key] = value;

            }

        }

        public Dictionary<string, object> GetCache(string key)
        {
            if (_items.ContainsKey(key))
            {
                return _items[key];
            }
            return new Dictionary<string, object>();
        }


    }
}