using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Api
{
    public class ErrorModel : BaseEntity
    {
        public int Flag { get; set; }

        public string Info { get; set; }

        public string Result { get; set; }

    }
}
