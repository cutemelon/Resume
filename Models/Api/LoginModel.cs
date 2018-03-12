using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Api
{
    public class LoginModel
    {
        public string employeeNo { get; set; }

        public string password { get; set; }

        public string companyName { get; set; }
    }
}
