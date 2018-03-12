using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Api
{
    public class ApiReturnModel
    {
        public string token { get; set; }

        public string resultContent { get; set; }

        public int result { get; set; }
    }
}
