using MKL_Web.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Linq;
using System.Data.SqlClient;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using System.Web.Services.Description;

namespace MKL_Web.Controllers
{
    public class HistoryController : Controller
    {
        // GET: History
        public ActionResult Index()
        {
            return View();
        }

        // GET: amendments
        private MKLDataContext db = null;
        private string status = "OK";
        public TransactionScope TransWithCommitted()
        {
            return new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = System.Transactions.IsolationLevel.ReadCommitted });
        }
        public HistoryController()
        {
            db = new MKLDataContext(ConfigurationManager.AppSettings["sql"].ToString());
        }


        public ActionResult Historyinstallment( DateTime? fdate = null, DateTime? tdate = null, string Item = "", string Serial = "", string Customer = "", string CreateBy = "", string UpdateBy = "")
        {
            // Use default date if null
            DateTime fromDate = fdate ?? DateTime.Today;
            DateTime toDate = tdate ?? DateTime.Today;


            var result = db.ICC_RPT_InstallmentHistory(
                fromDate,
                toDate,
                Item ?? "",
                Serial ?? "",
                Customer ?? "",
                CreateBy ?? "",
                UpdateBy ?? ""
            ).ToList();


            ViewBag.Listing = result;

            return View();
        }

    }
}