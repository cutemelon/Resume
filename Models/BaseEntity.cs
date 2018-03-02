using System;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Text;

namespace Models
{
    [Serializable]
    public class BaseEntity
    {
        [ExcludeField]
        public bool IsDeletedInDatabase { get; set; }

        [ExcludeField]
        public virtual string EntityId
        {
            get
            {
                var ps = GetType().GetProperties();
                var o = (from info in ps
                         let identity = IdentityAttribute.GetAttribute(info)
                         where identity != null
                         select info.GetValue(this, null)).FirstOrDefault();
                if (o == null)
                {
                    o = (from info in ps
                         let identity = GuidIdentityAttribute.GetAttribute(info)
                         where identity != null
                         select info.GetValue(this, null)).FirstOrDefault();
                }
                if (o != null)
                    return o.ToString();
                return "0";
            }
        }

        public BaseEntity()
        {
        }

        public override string ToString()
        {
            Type t = GetType();
            PropertyInfo[] ps = t.GetProperties();
            var desc = new StringBuilder();

            foreach (var item in ps)
            {
                desc.AppendFormat("{0}:{1} \r\n", item.Name, item.GetValue(this, null));
            }
            return t.Name + "\r\n" + desc.ToString();
        }
    }
}