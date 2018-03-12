using System;
using System.Collections.Generic;
using System.Web.Mvc;
using DatabaseInterface.SystemInterface;
using DatabaseService.SystemService;
using Models.ShowModel.SystemManage;
using Models.SystemManage;
using MvcExtend;

namespace ResumeManagementSystem.Controllers.SystemManage
{
    public class CompanyController : BaseController
    {
        private ICompanyDb companyDb = new CompanyDb();

        /// <summary>
        /// 公司信息列表页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 添加公司
        /// </summary>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public ActionResult AddCompany(string companyId = "")
        {
            var model = new CompanyModel();
            if (!string.IsNullOrWhiteSpace(companyId))
            {
                model = companyDb.GetCompanyById(companyId);
            }
            return View(model);
        }


        #region 方法


        /// <summary>
        /// 搜索公司列表页
        /// </summary>
        /// <param name="companyName"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public JsonResult GetCompanyList(string companyName, int pageIndex = 1, int pageSize = 20)
        {
            var total = 0;
            var dataList = companyDb.SearchCompanyList(out total, companyName, pageIndex, pageSize);

            return Json(new { dataList, recordCount = total }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 判断公司名称是否已存在
        /// </summary>
        /// <param name="param"></param>
        /// <param name="courseId"></param>
        /// <returns></returns>
        public JsonResult CheckCompanyName(string param, string companyId)
        {
            
            var company = companyDb.GetCompanyByUsername(param);
            var result = true;
            if (company == null)
            {
                result= false;
            }
            else
            {
                if (company.company_id == companyId)
                {
                    result= false;
                }
            }
            var status = result ? "n" : "y";
            var info = result ? "公司名称已存在" : "";
            return Json(new { status, info }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 保存用户
        /// </summary>
        /// <param name="companyName"></param>
        /// <param name="phone"></param>
        /// <param name="contact"></param>
        /// <param name="mobile"></param>
        /// <param name="location"></param>
        /// <param name="DBname"></param>
        /// <param name="DBaddress"></param>
        /// <param name="description"></param>
        /// <param name="companyId"></param>
        /// <returns></returns>
        public JsonResult SaveCompany(string companyName = "", string phone = "", string contact = "",
            string mobile = "", string location = "", string DBname = "",
            string DBaddress = "", string description = "", string companyId = "")
        {
            try
            {
                var model = new CompanyModel();
                model = companyDb.GetCompanyById(companyId);
                model.company_name = companyName;
                model.phone = phone;
                model.contact = contact;
                model.mobile = mobile;
                model.location = location;
                model.DB_name = DBname;
                model.DB_IP_address = DBaddress;
                model.description = description;
                model.last_update_time = DateTime.Now;
                model.last_update_time_by = CurrentUser.user_id;
                if (!string.IsNullOrWhiteSpace(companyId))
                {
                    model.company_id = companyId;
                    companyDb.UpdateCompany(model);
                }
                else
                {
                    model.company_id = Guid.NewGuid().ToString();
                    model.create_by = CurrentUser.user_id;
                    model.create_time = model.last_update_time;
                    companyDb.AddCompany(model);
                }
                return Json(new { result = 1, msg = "保存成功" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { result = 0, msg = "保存失败" }, JsonRequestBehavior.AllowGet);
            }
            
        }

        #endregion

    }
}
