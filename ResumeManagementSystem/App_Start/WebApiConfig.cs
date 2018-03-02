using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using ResumeManagementSystem.Filter;

namespace ResumeManagementSystem
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = RouteParameter.Optional }
            );
            config.Filters.Add(new ServiceFilter());
        }
    }
}
