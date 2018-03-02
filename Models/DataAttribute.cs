using System;
using System.Reflection;

namespace Models
{
    /// <summary>
    /// 表信息
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    [System.Serializable]
    public class TableInfoAttribute : Attribute
    {
        public TableInfoAttribute(string tableName)
        {
            TableName = tableName;
        }

        /// <summary>
        ///     数据库中表的名称
        /// </summary>
        public string TableName { get; set; }

        /// <summary>
        ///     获取元数据的特性
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public static TableInfoAttribute GetAttribute(Type item)
        {
            var excludeFieldAttribute = (TableInfoAttribute)GetCustomAttribute(item, typeof(TableInfoAttribute));
            return excludeFieldAttribute;
        }
    }

    /// <summary>
    ///     表示在自动生成SQL语句时，不处理该字段
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    [System.Serializable]
    public class ExcludeFieldAttribute : Attribute
    {
        /// <summary>
        ///     获取元数据的特性
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public static ExcludeFieldAttribute GetAttribute(MemberInfo item)
        {
            var excludeFieldAttribute = (ExcludeFieldAttribute)GetCustomAttribute(item, typeof(ExcludeFieldAttribute));
            return excludeFieldAttribute;
        }
    }

    /// <summary>
    ///     用于，对原始字段做一些处理之后，得到新的字段
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    [System.Serializable]
    public class ExtendedAttribute : Attribute
    {
        public ExtendedAttribute(string extendedSql)
        {
            ExtendedSql = extendedSql;
        }

        /// <summary>
        ///     扩展语句
        /// </summary>
        public string ExtendedSql { get; set; }

        private string _mysqlExtend = null;
        /// <summary>
        /// mysql版
        /// </summary>
        public string ExtendedMySql
        {
            get
            {
                return _mysqlExtend ?? ExtendedSql;
            }
            set { _mysqlExtend = value; }
        }

        public static ExtendedAttribute GetAttribute(MemberInfo item)
        {
            var extendedAttribute = (ExtendedAttribute)GetCustomAttribute(item, typeof(ExtendedAttribute));
            return extendedAttribute;
        }
    }


    /// <summary>
    /// 标记字段为自增长类型的主键字段
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    [System.Serializable]
    public class IdentityAttribute : Attribute
    {
        public static IdentityAttribute GetAttribute(MemberInfo member)
        {
            return (IdentityAttribute)GetCustomAttribute(member, typeof(IdentityAttribute));
        }
    }

    /// <summary>
    /// 标记字段为非自增长类型的主键字段
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    [System.Serializable]
    public class GuidIdentityAttribute : Attribute
    {
        public static GuidIdentityAttribute GetAttribute(MemberInfo member)
        {
            return (GuidIdentityAttribute)GetCustomAttribute(member, typeof(GuidIdentityAttribute));
        }
    }


    [AttributeUsage(AttributeTargets.Property)]
    [System.Serializable]
    public class RefFieldAttribute : Attribute
    {
        public RefFieldAttribute()
        {
        }

        /// <summary>
        /// </summary>
        /// <param name="masterTableField">主表的外键</param>
        /// <param name="refTableName">引用表名称</param>
        /// <param name="refTableKey">引用表主键</param>
        public RefFieldAttribute(string masterTableField, string refTableName, string refTableKey)
        {
            RefTableName = refTableName;
            RefTableKey = refTableKey;
            MasterTableField = masterTableField;
        }

        /// <summary>
        ///     引用表的名称
        /// </summary>
        public string RefTableName { get; set; }

        /// <summary>
        ///     引用表的键
        /// </summary>
        public string RefTableKey { get; set; }

        /// <summary>
        ///     主表的外键
        /// </summary>
        public string MasterTableField { get; set; }

        /// <summary>
        /// 引用的字段
        /// </summary>
        public string RefFieldName { get; set; }

        public static RefFieldAttribute GetAttribute(MemberInfo item)
        {
            var refFieldAttribute = (RefFieldAttribute)GetCustomAttribute(item, typeof(RefFieldAttribute));
            return refFieldAttribute;
        }
    }

    [System.Serializable]
    public class FieldDescriptionAttribute : Attribute
    {
        public string FieldName { get; set; }
        public FieldDescriptionAttribute(string fieldName)
        {
            FieldName = fieldName;
        }
        public static FieldDescriptionAttribute GetFieldDescriptionAttribute(MemberInfo element)
        {
            var fieldDesc = (FieldDescriptionAttribute)GetCustomAttribute(element, typeof(FieldDescriptionAttribute));

            return fieldDesc;
        }

    }

    /// <summary>
    /// 实体缓存期限类型
    /// </summary>
    public enum EntityCacheExpirationPolicies
    {
        /// <summary>
        /// 稳定数据      
        /// </summary>
        /// <remarks>
        /// 例如： Area/School
        /// </remarks>
        Stable = 1,
        /// <summary>
        /// 常用的单个实体
        /// </summary>
        /// <remarks>
        /// 例如： 用户、圈子
        /// </remarks>
        Usual = 3,
        /// <summary>
        /// 单个实体
        /// </summary>
        /// <remarks>
        /// 例如： 博文、帖子
        /// </remarks>
        Normal = 5
    }
}