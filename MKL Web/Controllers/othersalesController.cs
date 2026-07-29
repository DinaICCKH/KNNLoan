using MKL_Web.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MKL_Web.Controllers
{
    public class othersalesController : Controller
    {
        // GET: othersales
        private MKLDataContext db = null;
        private string status = "OK";
        public othersalesController()
        {
            db = new MKLDataContext(ConfigurationManager.AppSettings["sql"].ToString());
        }
        public ActionResult BuyBack()
        {
            ViewBag.cust = db.V_Customers.Where(x => x.CardType.ToString() == "C").ToList();
            ViewBag.houselist = db.v_Items.Where(x => x.ItemGroupCode == "101").ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();
            ViewBag.BankList = db.ICC_BankLists.ToList();   // change table name if different
            return View();
        }
        public ActionResult InvoiceList()
        {
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.cust = db.v_OCRDs.Where(x => x.cardtype == 'C').ToList();
            return View();
        }
        public ActionResult Invoice(int Key)
        {
            ViewBag.cust = db.v_OCRDs.Where(x => x.cardtype == 'C').ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.houselist = db.v_Items.Where(x => x.ItemGroupCode == "101").ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();
            ViewBag.ar = db.ARs.Where(a => a.DocEntry == Key).FirstOrDefault();
            ViewBag.ar1 = db.AR1s.Where(a => a.DocEntry == Key).ToList();
            ViewBag.contact = db.v_Contacts.Where(a => a.CntctCode == (db.ARs.Where(b => b.DocEntry == Key).FirstOrDefault().ContactPerson)).FirstOrDefault();
            return View();
        }
        public ActionResult MemoInvoice(int Key)
        {
            ViewBag.cust = db.v_OCRDs.Where(x => x.cardtype == 'C').ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.houselist = db.v_Items.Where(x => x.ItemGroupCode == "101").ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();
            ViewBag.ar = db.ARs.Where(a => a.DocEntry == Key).FirstOrDefault();
            ViewBag.ar1 = db.AR1s.Where(a => a.DocEntry == Key).ToList();
            ViewBag.contact = db.v_Contacts.Where(a => a.CntctCode == (db.ARs.Where(b => b.DocEntry == Key).FirstOrDefault().ContactPerson)).FirstOrDefault();

            string docdate = db.ARs.Where(a => a.DocEntry == Key).FirstOrDefault().DocDate.Value.ToString("dd-MMM-yyyy");
            string ocrcode = db.ARs.Where(a => a.DocEntry == Key).FirstOrDefault().OcrCode;
            string sqltext = "exec ICC_Get_DocNum '" + ocrcode + "','" + docdate + "','CNR'";

            ViewBag.DocNum = view.getSalesDocNum(sqltext, ConfigurationManager.AppSettings["sql"].ToString());
            return View();
        }
        public ActionResult MemoListing()
        {
            ViewBag.saleList = db.CNs.Where(a=>a.Reason==null).OrderBy(a=>a.DocNum).ToList();
            return View();
        }
        public ActionResult MemoInvoiceEdit(int Key)
        {
            ViewBag.cust = db.v_OCRDs.Where(x => x.cardtype == 'C').ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.houselist = db.v_Items.Where(x => x.ItemGroupCode == "101").ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();
            ViewBag.ar = db.CNs.Where(a => a.DocEntry == Key).FirstOrDefault();
            ViewBag.ar1 = db.CN1s.Where(a => a.DocEntry == Key).ToList();
            ViewBag.contact = db.v_Contacts.Where(a => a.CntctCode == (db.CNs.Where(b => b.DocEntry == Key).FirstOrDefault().ContactPerson)).FirstOrDefault();
            return View();
        }
        public ActionResult Receipt()
        {
            ViewBag.cust = db.v_OCRDs.Where(x => x.cardtype == 'C').ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.houselist = db.v_Items.Where(x => x.ItemGroupCode == "101").ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();
            return View();
        }
        public ActionResult HandOver()
        {
            return View();
        }
        public ActionResult SalesOpportunity()
        {
            ViewBag.cust = db.OCRDs.Where(x => x.CardType == "C").ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.houselist = db.v_Item_Houses.ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();
            ViewBag.oslp = db.v_OSLPs.ToList();
            ViewBag.stage = db.v_Stages.ToList();
            return View();
        }
        public ActionResult SalesOpportunityEdit(int key)
        {
            ViewBag.cust = db.OCRDs.Where(x => x.CardType == "C").ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.houselist = db.v_Item_Houses.ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();
            ViewBag.oslp = db.v_OSLPs.ToList();
            ViewBag.stage = db.v_Stages.ToList();
            ViewBag.h = db.SalesOpports.Where(a => a.DocEntry == key).FirstOrDefault();
            ViewBag.d = db.SalesOpport1s.Where(a => a.DocEntry == key).ToList();
            ViewBag.contact = db.v_Contacts.ToList();
            return View();
        }
        public ActionResult SalesOpportunityList()
        {
            ViewBag.saleList = db.SalesOpports.ToList();
            return View();
        }

        public ActionResult BuyBackList(DateTime? fdate = null, DateTime? tdate = null, string CreateBy = "")
        {
            // Use default date if null
            DateTime fromDate = fdate ?? new DateTime(1999, 1, 1);
            DateTime toDate = tdate ?? new DateTime(1999, 1, 1);

            var result = db.ICC_Get_RepocessingList_Approved(
                fromDate,
                toDate,
                CreateBy ?? ""
            ).ToList();


            ViewBag.BuyBackList = result;

            return View();
        }
    }
}