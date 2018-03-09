using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Common
{
    public class ReturnListModel : BaseEntity
    {
        public int total { get; set; }

        public object list { get; set; }

        public int result { get; set; }

        public string info { get; set; }
    }
}
