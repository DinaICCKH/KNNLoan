using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MKL_Web.Models;
namespace MKL_Web.Controllers
{
    public class boqController : Controller
    {
        // GET: boq
        private SAPDataContext condb = null;
        private MKLDataContext db = null;
        private string status = "OK";
        private string ErrorDes = "";
        private string DocNum = "";
        private string sqlText = "";
        private view view = new view();
        public boqController()
        {
            db = new MKLDataContext(ConfigurationManager.AppSettings["sql"].ToString());
            condb = new SAPDataContext(ConfigurationManager.AppSettings["consql"].ToString());
        }
        public ActionResult boq()
        {
            ViewBag.pro = condb.OPRCs.Where(x => x.DimCode == 1).ToList();
            ViewBag.mainwork = condb._MAINWORKs.ToList();
            ViewBag.whs = condb.OWHs.ToList();
            ViewBag.uom = condb.OUOMs.ToList();
            ViewBag.floor = condb._FLOORs.ToList();
            ViewBag.p = "boqmat";
            ViewBag.mp = "pr";
            ViewBag.sp = "boq";
            return View();
        }
    }
}