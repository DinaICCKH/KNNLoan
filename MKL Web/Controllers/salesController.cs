using MKL_Web.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Transactions;
using MKL_Web_Borey.Models;
using System.Data.SqlClient;
using Microsoft.Ajax.Utilities;

namespace MKL_Web.Controllers
{
    public class salesController : Controller
    {
        // GET: sales
        private MKLDataContext db = null;
        private string status = "OK";
        public salesController()
        {
            db = new MKLDataContext(ConfigurationManager.AppSettings["sql"].ToString());
        }

        public ActionResult Booking()
        {   
            ViewBag.cust = db.V_Customers.Where(x => x.CardType.ToString() == "C").ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.houselist = db.v_Item_Houses.ToList();
            return View();
        }
        
        public ActionResult BookingEdit(int key)
        {
            ViewBag.cust = db.OCRDs.Where(x => x.CardType == "C").ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.houselist = db.v_Item_Houses.ToList();
            ViewBag.so = db.SOs.Where(a => a.DocEntry == key).FirstOrDefault();
            ViewBag.so1 = db.SO1s.Where(a => a.DocEntry == key).ToList().LastOrDefault();
            ViewBag.contact = db.v_Contacts.ToList();
            ViewBag.inst = db.InstallmentRows.Where(a =>a.BaseEntry==key && a.Method == "B").FirstOrDefault();
            return View();
        }

        public ActionResult OldScheduleEdit(int key)
        {
            ViewBag.cust = db.OCRDs.Where(x => x.CardType == "C").ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.houselist = db.v_Item_Houses.ToList();
            ViewBag.so = db.SOs.Where(a => a.DocEntry == key).FirstOrDefault();
            ViewBag.so1 = db.SO1s.Where(a => a.DocEntry == key).ToList().LastOrDefault();
            ViewBag.contact = db.v_Contacts.ToList();
            ViewBag.inst = db.InstallmentRows.Where(a => a.BaseEntry == key && a.Method == "B").FirstOrDefault();
            return View();
        }

        public ActionResult OldScheduleEditChangeItem(int key)
        {
            ViewBag.cust = db.OCRDs.Where(x => x.CardType == "C").ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.houselist = db.v_Item_Houses.ToList();
            ViewBag.so = db.SOs.Where(a => a.DocEntry == key).FirstOrDefault();
            ViewBag.so1 = db.SO1s.Where(a => a.DocEntry == key).ToList().LastOrDefault();
            ViewBag.contact = db.v_Contacts.ToList();
            ViewBag.inst = db.InstallmentRows.Where(a => a.BaseEntry == key && a.Method == "B").FirstOrDefault();
            return View();
        }


        public ActionResult LoanSchedule()
        {
            var armemoList=db.V_ARMemos.Where(a=>a.SAPIntegrationStatus=="N").ToList();
            var soList = db.SOs.Where(a => a.Reason == "Installment").ToList();
            ViewBag.cust = db.V_Customers.Where(x => x.CardType.ToString() == "C" && armemoList.Select(a => a.CardCode).Contains(x.CardCode)).ToList();
            ViewBag.houselist = db.v_Item_Houses.ToList();
            ViewBag.installment = db.InstallmentLists.Where(x=>x.InsCode!="B").ToList();
            return View();
        }
        public ActionResult PaymentScheduleEdit(int key)
        {
            ViewBag.cust = db.OCRDs.Where(x => x.CardType == "C").ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.houselist = db.v_Item_Houses.ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();

            ViewBag.so = db.SOs.Where(a => a.DocEntry == key).FirstOrDefault();
            ViewBag.so1 = db.SO1s.Where(a => a.DocEntry == key).ToList().LastOrDefault();
            ViewBag.contact = db.v_Contacts.ToList();
            ViewBag.inst = db.InstallmentRows.Where(a => a.BaseEntry == key).FirstOrDefault();
            return View();
        }
        public ActionResult Contract()
        {
            return View();
        }
        public JsonResult get_special_schedule(string itemcode,string installment, string LastRowno, string BaseLine,string method
            ,string paymentdate,string amount,string percent,string anualrate,string period,string remark, string decimalplace)
        {
            string sqltext = "exec ICC_AddOn_Installment_CalculateInstallmentAO '" + itemcode + "','" + installment + "','" + LastRowno
                + "','" + BaseLine + "','" + method + "','" + paymentdate + "','" + amount + "','" + percent + "','" + anualrate + "','" + period
                + "','" + remark + "'," + decimalplace;
            List<Payment_Schedule> list = new List<Payment_Schedule>();
            list = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable()
                    select new Payment_Schedule()
                    {
                        ID = "-1",
                        Remove = x["Remove"].ToString(),
                        Method = x["Method"].ToString(),
                        ItemCode = x["ItemCode"].ToString(),
                        ItemName = x["ItemName"].ToString(),
                        RowNo = x["RowNo"].ToString(),
                        MonthlyPay = x["MonthlyPay"].ToString(),
                        Principle = x["Principle"].ToString(),
                        Interest = x["Interest"].ToString(),
                        AccAmt = x["AccAmt"].ToString(),
                        RemainingAmt = x["RemainingAmt"].ToString(),
                        InstallmentDate =Convert.ToDateTime(x["InstallmentDate"].ToString()).ToString("dd-MMM-yyyy"),
                        DueDate = Convert.ToDateTime(x["DueDate"].ToString()).ToString("dd-MMM-yyyy"),
                        U_Period = x["U_Period"].ToString(),
                        U_AnnulRate = x["U_AnnulRate"].ToString(),
                        DepositAmt = x["DepositAmt"].ToString(),
                        CuInterest = x["CuInterest"].ToString(),
                        CuPayment = x["CuPayment"].ToString(),
                        BaseEntry = x["BaseEntry"].ToString(),
                        Status = x["Status"].ToString(),
                        BaseLine = x["BaseLine"].ToString(),
                        ARNo = x["ARNo"].ToString(),
                        PaymentNo = x["PaymentNo"].ToString(),
                        FixedPayment = x["FixedPayment"].ToString(),
                        HouseStatus = x["HouseStatus"].ToString(),
                        Remarks = x["Remarks"].ToString(),
                        ARNoInterest = x["ARNoInterest"].ToString(),
                        PaymentNoInterest = x["PaymentNoInterest"].ToString(),
                    }).ToList();
            var data = list.Select(x => new {
                x.ID,
                x.Remove,
                x.Method,
                x.ItemCode,
                x.ItemName,
                x.RowNo,
                x.MonthlyPay,
                x.Principle,
                x.Interest,
                x.AccAmt,
                x.RemainingAmt,
                x.InstallmentDate,
                x.DueDate,
                x.U_Period,
                x.U_AnnulRate,
                x.DepositAmt,
                x.CuInterest,
                x.CuPayment,
                x.BaseEntry,
                x.Status,
                x.BaseLine,
                x.ARNo,
                x.PaymentNo,
                x.FixedPayment,
                x.HouseStatus,
                x.Remarks,
                x.ARNoInterest,
                x.PaymentNoInterest
            }).ToList();
            return Json(new
            {
                status = status,
                data = data,
            });
        }
        
        public JsonResult get_payment_schedule(string itemcode,string method,string fullamount,string installment
            ,string monthlypayment,string date,string installmentperiod,string DPM,string AnnualRate,string LastRowno
            ,string BaseLine,string Remarks,string Decimal)
        {
            string sqltext = "exec ICC_AddOn_Installment_CalculateInstallment '"+ itemcode+"','"+ method+"','"+ fullamount
                +"','"+ installment+"','"+ monthlypayment + "','"+ date+"','"+ installmentperiod +"','"+ DPM+"','"+ AnnualRate+"','"+ LastRowno
                +"','"+ BaseLine+"',N'"+ Remarks+"',"+ Decimal;
            List<Payment_Schedule> list = new List<Payment_Schedule>();
            list = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable()
                    select new Payment_Schedule() {
                        ID = "-1",
                        Remove =x["Remove"].ToString(),
                        Method = x["Method"].ToString(),
                        ItemCode = x["ItemCode"].ToString(),
                        ItemName = x["ItemName"].ToString(),
                        RowNo = x["RowNo"].ToString(),
                        MonthlyPay = x["MonthlyPay"].ToString(),
                        Principle = x["Principle"].ToString(),
                        Interest = x["Interest"].ToString(),
                        AccAmt = x["AccAmt"].ToString(),
                        RemainingAmt = x["RemainingAmt"].ToString(),
                        InstallmentDate = Convert.ToDateTime(x["InstallmentDate"].ToString()).ToString("dd-MMM-yyyy"),
                        DueDate = Convert.ToDateTime(x["DueDate"].ToString()).ToString("dd-MMM-yyyy"),
                        U_Period = x["U_Period"].ToString(),
                        U_AnnulRate = x["U_AnnulRate"].ToString(),
                        DepositAmt = x["DepositAmt"].ToString(),
                        CuInterest = x["CuInterest"].ToString(),
                        CuPayment = x["CuPayment"].ToString(),
                        BaseEntry = x["BaseEntry"].ToString(),
                        Status = x["Status"].ToString(),
                        BaseLine = x["BaseLine"].ToString(),
                        ARNo = x["ARNo"].ToString(),
                        PaymentNo = x["PaymentNo"].ToString(),
                        FixedPayment = x["FixedPayment"].ToString(),
                        HouseStatus = x["HouseStatus"].ToString(),
                        Remarks = x["Remarks"].ToString(),
                        ARNoInterest = x["ARNoInterest"].ToString(),
                        PaymentNoInterest = x["PaymentNoInterest"].ToString(),
                    }).ToList();
            var data = list.Select(x => new {
                x.ID,
                x.Remove,
                x.Method,
                x.ItemCode,
                x.ItemName,
                x.RowNo,
                x.MonthlyPay,
                x.Principle,
                x.Interest,
                x.AccAmt,
                x.RemainingAmt,
                x.InstallmentDate,
                x.DueDate,
                x.U_Period,
                x.U_AnnulRate,
                x.DepositAmt,
                x.CuInterest,
                x.CuPayment,
                x.BaseEntry,
                x.Status,
                x.BaseLine,
                x.ARNo,
                x.PaymentNo,
                x.FixedPayment,
                x.HouseStatus,
                x.Remarks,
                x.ARNoInterest,
                x.PaymentNoInterest
            }).ToList();
            return Json(new
            {
                status = status,
                data = data,
            });
        }

        public JsonResult get_customer_list(string fcustomer, string tcustomer)
        {
            string sqltext = "exec ICC_GET_CustomerListRange '" + fcustomer + "','" + tcustomer + "'";
            List<Customerlist> list = new List<Customerlist>();
            list = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable()
                    select new Customerlist()
                    {
                        CardCode = x["CardCode"].ToString(),
                        CardName = x["CardName"].ToString(),
                        BalanceFC = Convert.ToDecimal(x["BalanceFC"]),
                        Balance = Convert.ToDecimal(x["Balance"])

                    }).ToList();
            var data = list.Select(x => new {
                x.CardCode,
                x.CardName,
                x.BalanceFC,
                x.Balance,
                
            }).ToList();
            return Json(new
            {
                status = status,
                data = data,
            });
        }

        public JsonResult get_payment_schedule_by_so(string soEntry,string rowStatus)
        {
            string sqltext = "exec ICC_AddOn_Installment_Table '" + soEntry + "','"+ rowStatus+"'";
            List<Payment_Schedule> list = new List<Payment_Schedule>();
            list = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable()
                    select new Payment_Schedule()
                    {
                        ID = x["ID"].ToString(),
                        Remove = x["Remove"].ToString(),
                        Method = x["Method"].ToString(),
                        ItemCode = x["ItemCode"].ToString(),
                        ItemName = x["ItemName"].ToString(),
                        RowNo = x["RowNo"].ToString(),
                        MonthlyPay = x["MonthlyPay"].ToString(),
                        Principle = x["Principle"].ToString(),
                        Interest = x["Interest"].ToString(),
                        AccAmt = x["AccAmt"].ToString(),
                        RemainingAmt = x["RemainingAmt"].ToString(),
                        InstallmentDate = Convert.ToDateTime(x["InstallmentDate"].ToString()).ToString("dd-MMM-yyyy"),
                        DueDate = Convert.ToDateTime(x["DueDate"].ToString()).ToString("dd-MMM-yyyy"),
                        U_Period = x["U_Period"].ToString(),
                        U_AnnulRate = x["U_AnnulRate"].ToString(),
                        DepositAmt = x["DepositAmt"].ToString(),
                        CuInterest = x["CuInterest"].ToString(),
                        CuPayment = x["CuPayment"].ToString(),
                        BaseEntry = x["BaseEntry"].ToString(),
                        Status = x["Status"].ToString(),
                        BaseLine = x["BaseLine"].ToString(),
                        ARNo = x["ARNo"].ToString(),
                        PaymentNo = x["PaymentNo"].ToString(),
                        FixedPayment = x["FixedPayment"].ToString(),
                        HouseStatus = x["HouseStatus"].ToString(),
                        Remarks = x["Remarks"].ToString(),
                        CardCode = x["CardCode"].ToString(),
                        CardName = x["CardName"].ToString(),
                        DocNum = x["DocNum"].ToString(),
                        DocDate =Convert.ToDateTime(x["DocDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        DeliveryDate = Convert.ToDateTime(x["DueDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        OcrCode = x["OcrCode"].ToString(),
                        OcrCode2 = x["OcrCode2"].ToString(),
                        OcrCode3 = x["OcrCode3"].ToString(),
                        HouseAmount = x["HouseAmount"].ToString(),
                        DiscountAmount = x["DiscountAmount"].ToString(),
                        DiscountPer = x["DiscountPer"].ToString(),
                        SpecialDisAmount = x["SpecialDisAmount"].ToString(),
                        SpecialDisPer = x["SpecialDisPer"].ToString(),
                        InstallmentAmt = x["InstallmentAmt"].ToString(),
                        DocStatus = x["DocStatus"].ToString(),
                        PaidDate = x["PaidDate"].ToString()==""?"": Convert.ToDateTime(x["PaidDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        PaidAmt = x["PaidAmt"].ToString(),

                        NewItemCode= x["NewItemCode"].ToString(),
                        NewItemName = x["NewItemName"].ToString(),
                        BuybackAmt = x["BuybackAmt"].ToString(),
                        GeneratedARAmt = x["GeneratedARAmt"].ToString(),
                        OutstandingAmt = x["OutstandingAmt"].ToString(),
                        VarianAmt = x["VarianAmt"].ToString(),
                        DistNumber = x["SerialNo"].ToString(),

                        ARNoInterest = x["ARNoInterest"].ToString(),
                        PaymentNoInterest = x["PaymentNoInterest"].ToString()
                    }).ToList();
            var data = list.Select(x => new {
                x.ID,
                x.Remove,
                x.Method,
                x.ItemCode,
                x.ItemName,
                x.RowNo,
                x.MonthlyPay,
                x.Principle,
                x.Interest,
                x.AccAmt,
                x.RemainingAmt,
                x.InstallmentDate,
                x.DueDate,
                x.U_Period,
                x.U_AnnulRate,
                x.DepositAmt,
                x.CuInterest,
                x.CuPayment,
                x.BaseEntry,
                x.Status,
                x.BaseLine,
                x.ARNo,
                x.PaymentNo,
                x.FixedPayment,
                x.HouseStatus,
                x.Remarks,
                x.CardCode,
                x.CardName,
                x.DocNum,
                x.DocDate,
                x.DeliveryDate,
                x.OcrCode,
                x.OcrCode2,
                x.OcrCode3,
                x.HouseAmount,
                x.DiscountAmount,
                x.DiscountPer,
                x.SpecialDisAmount,
                x.SpecialDisPer,
                x.InstallmentAmt,
                x.DocStatus,
                x.PaidDate,
                x.PaidAmt,
                x.NewItemCode,
                x.NewItemName,
                x.BuybackAmt,
                x.GeneratedARAmt,
                x.OutstandingAmt,
                x.VarianAmt,
                x.DistNumber,
                x.ARNoInterest,
                x.PaymentNoInterest
            }).ToList();
            return Json(new
            {
                status = status,
                data = data,
            });
        }

        

        public JsonResult get_payment_schedule_list_ChangeItem(string cardcode, string status, string type)
        {

            string sqltext = "exec Icc_get_ARMemo_list_ChangeItem '" + cardcode + "','" + status + "','" + type + "'";

            List<Payment_Schedule> list = new List<Payment_Schedule>();
            list = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable()
                    select new Payment_Schedule()
                    {
                        ItemCode = x["ItemCode"].ToString(),
                        ItemName = x["ItemName"].ToString(),
                        OcrCode = x["OcrCode"].ToString(),
                        OcrCode2 = x["OcrCode2"].ToString(),
                        OcrCode3 = x["OcrCode3"].ToString(),
                        DocNum = x["DocNum"].ToString(),
                        DocEntry = x["DocEntry"].ToString(),
                        LineNum = x["LineNum"].ToString(),
                        CardCode = x["CardCode"].ToString(),
                        CardName = x["CardName"].ToString(),
                        DocDate = Convert.ToDateTime(x["DocDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        DueDate = Convert.ToDateTime(x["DueDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        PaymentOptionName = x["PaymentOptionName"].ToString(),
                        Referral = x["Referral"].ToString(),
                        ConPeriod = x["ConPeriod"].ToString(),
                        HouseAmount = x["HouseAmount"].ToString(),
                        AdditionalAmt = x["AdditionalAmt"].ToString(),
                        DistNumber = x["DistNumber"].ToString()
                    }).ToList();
            var data = list
            //.Where(x => x.PaymentOptionName != "ChangingProduct") // Apply condition here
            .Select(x => new {
                x.ItemCode,
                x.ItemName,
                x.OcrCode,
                x.OcrCode2,
                x.OcrCode3,
                x.DocNum,
                x.DocEntry,
                x.LineNum,
                x.CardCode,
                x.CardName,
                x.DocDate,
                x.DueDate,
                x.PaymentOptionName,
                x.Referral,
                x.ConPeriod,
                x.HouseAmount,
                x.AdditionalAmt,
                x.DistNumber
            }).ToList();
            return Json(new
            {
                status = status,
                data = data,
            });
        }

        public JsonResult get_payment_schedule_list(string cardcode,string status,string type)
        {
            //status = "Installment";
    
             string sqltext = "exec Icc_get_ARMemo_list '" + cardcode + "','" + status + "','" + type + "'";

            List<Payment_Schedule> list = new List<Payment_Schedule>();
            list = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable()
                    select new Payment_Schedule()
                    {
                        ItemCode = x["ItemCode"].ToString(),
                        ItemName = x["ItemName"].ToString(),
                        OcrCode = x["OcrCode"].ToString(),
                        OcrCode2 = x["OcrCode2"].ToString(),
                        OcrCode3 = x["OcrCode3"].ToString(),
                        DocNum = x["DocNum"].ToString(),
                        DocEntry = x["DocEntry"].ToString(), 
                        LineNum = x["LineNum"].ToString(),
                        CardCode = x["CardCode"].ToString(),
                        CardName = x["CardName"].ToString(),
                        DocDate = Convert.ToDateTime(x["DocDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        DueDate = Convert.ToDateTime(x["DueDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        PaymentOptionName = x["PaymentOptionName"].ToString(),
                        Referral = x["Referral"].ToString(),
                        ConPeriod = x["ConPeriod"].ToString(),
                        HouseAmount = x["HouseAmount"].ToString(),
                        AdditionalAmt = x["AdditionalAmt"].ToString(),
                        DistNumber = x["DistNumber"].ToString()
                    }).ToList();
            var data = list
            //.Where(x => x.PaymentOptionName != "ChangingProduct") // Apply condition here
            .Select(x => new {
                x.ItemCode,
                x.ItemName,
                x.OcrCode,
                x.OcrCode2,
                x.OcrCode3,
                x.DocNum,
                x.DocEntry,
                x.LineNum,
                x.CardCode,
                x.CardName,
                x.DocDate,
                x.DueDate,
                x.PaymentOptionName,
                x.Referral,
                x.ConPeriod,
                x.HouseAmount,
                x.AdditionalAmt,
                x.DistNumber
            }).ToList();
            return Json(new
            {
                status = status,
                data = data,
            });
        }



        public ActionResult SalesListing()
        {
            ViewBag.saleList = db.SOs.Where(a=>a.PaymentOption=="B").OrderBy(a=>a.DocNum).ToList();
            return View();
        }
        public ActionResult PaymentListing()
        {
            ViewBag.saleList = db.SOs.Where(a => a.DocStatus == "Sold").OrderBy(a=>a.DocNum).ToList();
            return View();
        }


        public ActionResult ARMemoListing()
        {
            ViewBag.armemoList = db.V_ARMemos.Where(a => a.PaymentOption == "B").OrderBy(a => a.DocStatus).ToList();
            return View();
        }

        public ActionResult OldScheduleListing()
        {
            //ViewBag.armemoList = db.V_ARMemos.Where(a => a.PaymentOption == "B").OrderBy(a => a.DocStatus).ToList();
            ViewBag.armemoList = db.V_ARMemos.Where(a => a.SAPIntegrationStatus == "Y").OrderBy(a => a.CardCode).ToList();
            ViewBag.oldschedule = db.V_OldSchedules.ToList();
            return View();
        }


        public ActionResult OldScheduleListingChangeItem()
        {
             

            var excludedReasons = new[] { "CHI", "ChangingProduct" };
            ViewBag.armemoList = db.V_ARMemos
                .Where(a => a.SAPIntegrationStatus == "Y" && !excludedReasons.Contains(a.Reason))
                .OrderBy(a => a.CardCode)
                .ToList();

            return View();


        }


        public JsonResult get_penalty_list(string bpCode,string DateFrom, string DateTo, string DueDateFrom, string DueDateTo)
        {
            string sqltext = "exec ICC_Get_List_Penalty_Draf  '" + bpCode + "','" + DateFrom + "','" + DateTo + "','" + DueDateFrom + "','" + DueDateTo + "'";

            List<PenaltyList> list = new List<PenaltyList>();
            list = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable()
                    select new PenaltyList()
                    {
                        Select = x["SelectS"].ToString(),
                        CustomerCode = x["CustomerCode"].ToString(),
                        Branch = x["Branch"].ToString(),
                        CustomerName = x["CustomerName"].ToString(),
                        HouseNo = x["HouseNo"].ToString(),
                        DocNo = x["DocNo"].ToString(),
                        DocumentNumber = x["DocumentNumber"].ToString(),
                        DueDate = Convert.ToDateTime(x["DueDate"].ToString()).ToString("dd-MMM-yyyy"),
                        DocumentAmountLC = x["DocumentAmountLC"].ToString(),
                        OpenAmountLC = x["OpenAmountLC"].ToString(),
                        InterestDays = x["InterestDays"].ToString(),
                        InterestMonths = x["InterestMonths"].ToString(),
                        InterestPercent = x["InterestPercent"].ToString(),
                        InterestAmountLC = x["InterestAmountLC"].ToString(),
                        TotalInclInterestLC = x["TotalInclInterestLC"].ToString(),
                        Status = x["Status"].ToString(),
                        Message = x["Message"].ToString()
                    }).ToList();
            var data = list.Select(x => new {
                x.Select,
                x.CustomerCode,
                x.Branch,
                x.CustomerName,
                x.HouseNo,
                x.DocNo,
                x.DocumentNumber,
                x.DueDate,
                x.DocumentAmountLC,
                x.OpenAmountLC,
                x.InterestDays,
                x.InterestMonths,
                x.InterestPercent,
                x.InterestAmountLC,
                x.TotalInclInterestLC,
                x.Status,
                x.Message
            }).ToList();
            return Json(new
            {
                status = status,
                data = data,
            });
        }


        public TransactionScope TransWithCommitted()
        {
            return new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = System.Transactions.IsolationLevel.ReadCommitted });
        }
        //Save Booking
        public JsonResult save_booking(SO header, InstallmentRow detail)
        {
            try
            {
                status = "OK";
                int LastEntry = 0;
                if (status == "OK")
                {
                    string sqltext = "exec ICC_Get_DocNum '" + header.OcrCode + "','" + header.DocDate + "','SOR'";
                    string docnum= view.getSalesDocNum(sqltext, ConfigurationManager.AppSettings["sql"].ToString());
                    if (docnum == null)
                    {
                        return Json(new {status = "Error",lastEntry = LastEntry});
                    }

                    var trans = TransWithCommitted();
                    try
                    {
                        using (trans)
                        {
                            int rowindex = 0;
                            SO so = db.SOs.Where(x => x.DocEntry == header.DocEntry).FirstOrDefault();
                            if (so == null)
                            {
                                so = header;
                                so.DocStatus = "Booking";
                                so.PaymentOption = "B";
                                so.Reason = "BKN";
                                so.DocumentDate = header.DocDate;
                                so.CreatedDate = DateTime.Now;
                                so.DocNum = docnum;
                                db.SOs.InsertOnSubmit(so);
                                db.SOs.Context.SubmitChanges();

                                SO1 s1 = new SO1();
                                s1.DocEntry = so.DocEntry;
                                s1.LineNum = 0;
                                s1.ItemCode = detail.ItemCode;
                                s1.ItemName = detail.ItemName;
                                s1.Quantity = 1;
                                s1.UoMEntry = -1;
                                s1.UPrice = so.DocTotalBef;
                                s1.DiscountPer = so.DiscountPer;
                                s1.DiscountAmt = so.DiscountAmt;
                                s1.LineTotal = so.SubTotal;
                                s1.OcrCode = detail.OcrCode;
                                s1.OcrCode2 = detail.OcrCode2;
                                s1.OcrCode3 = detail.OcrCode3;
                                s1.Reason = "BKN";
                                db.SO1s.InsertOnSubmit(s1);
                                db.SO1s.Context.SubmitChanges();

                                detail.BaseEntry = so.DocEntry;
                                detail.BaseLine = 0;
                                detail.VisOrder = 0;
                                db.InstallmentRows.InsertOnSubmit(detail);
                                db.InstallmentRows.Context.SubmitChanges();
                            }
                            else
                            {
                                so.ConPeriod = header.ConPeriod;
                                so.Referral = header.Referral;
                                so.ContactPerson = header.ContactPerson;
                                so.DiscountAmt = header.DiscountAmt;
                                so.DiscountPer = header.DiscountPer;
                                so.SubTotal = header.SubTotal;
                                so.BalanceDue = header.BalanceDue;
                                so.DocTotalBef = header.DocTotalBef;
                                so.DepositAmt = header.DepositAmt;
                                so.DepositPer = header.DepositPer;
                                so.SAPIntegrationStatus = "Updated";
                                so.LastError = null;
                                so.UpdatedBy = header.CreatedBy;
                                so.CreatedDate = DateTime.Now;
                                db.SOs.Context.SubmitChanges();

                                SO1 s1 = db.SO1s.Where(a => a.DocEntry == header.DocEntry).ToList().LastOrDefault();
                                s1.ItemCode = detail.ItemCode;
                                s1.ItemName = detail.ItemName;
                                s1.Quantity = 1;
                                s1.UoMEntry = -1;
                                s1.UPrice = header.DocTotalBef;
                                s1.DiscountPer = header.DiscountPer;
                                s1.DiscountAmt = header.DiscountAmt;
                                s1.LineTotal = header.SubTotal;
                                s1.OcrCode = detail.OcrCode;
                                s1.OcrCode2 = detail.OcrCode2;
                                s1.OcrCode3 = detail.OcrCode3;
                                db.SO1s.Context.SubmitChanges();

                                InstallmentRow in_st = db.InstallmentRows.Where(a => a.BaseEntry == header.DocEntry && a.BaseLine == s1.LineNum && a.Method=="B").FirstOrDefault();
                                db.InstallmentRows.DeleteOnSubmit(in_st);
                                db.InstallmentRows.Context.SubmitChanges();

                                detail.BaseEntry = so.DocEntry;
                                detail.BaseLine = s1.LineNum;
                                detail.VisOrder = 0;
                                db.InstallmentRows.InsertOnSubmit(detail);
                                db.InstallmentRows.Context.SubmitChanges();
                            }
                            if (status == "OK")
                            {
                                trans.Complete();
                                trans.Dispose();
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        status = "Failed";
                    }
                }
                return Json(new
                {
                    status = status,
                    lastEntry = LastEntry,
                });
            }
            catch (Exception ex)
            {
                status = "Failed";
            }
            return Json(new
            {
                status = status
            });
        }
        public JsonResult cancel_booking(int DocKey,string user)
        {
            try
            {
                status = "OK";
                int LastEntry = 0;
                if (status == "OK")
                {
                    var trans = TransWithCommitted();
                    try
                    {
                        using (trans)
                        {
                            int rowindex = 0;
                            SO so = db.SOs.Where(x => x.DocEntry == DocKey).FirstOrDefault();
                            if (so != null)
                            {
                                so.DocStatus = "Cancelled";
                                so.SAPIntegrationStatus = "Cancelled";
                                so.CancelledBy = user;
                                so.CancelledDate = DateTime.Now;
                                db.SOs.Context.SubmitChanges();

                                SO1 s1 = so.SO1s.ToList().LastOrDefault();
                                s1.LineStatus = "Cancelled";
                                db.SO1s.Context.SubmitChanges();

                                InstallmentRow ro = db.InstallmentRows.Where(a => a.BaseEntry == so.DocEntry && a.BaseLine == s1.LineNum).ToList().LastOrDefault();
                                ro.RowStatus = "Cancelled";
                                db.InstallmentRows.Context.SubmitChanges();
                            }
                            else
                            {
                                status = "NotFound";
                            }
                            if (status == "OK")
                            {
                                trans.Complete();
                                trans.Dispose();
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        status = "Failed";
                    }
                }
                return Json(new
                {
                    status = status,
                    lastEntry = LastEntry,
                });
            }
            catch (Exception ex)
            {
                status = "Failed";
            }
            return Json(new
            {
                status = status
            });
        }

        public JsonResult save_payment_shcedule(SO header, List<InstallmentRow> installment_row, List<InstallmentRow> del_list)
        {
            status = "OK";
            int LastEntry = 0;
            if (status == "OK")
            {
                var trans = TransWithCommitted();
                try
                {
                    using (trans)
                    {
                        if (header != null)
                        {
                            SO s = db.SOs.Where(a => a.DocEntry == header.DocEntry).FirstOrDefault();
                            if (s != null)
                            {
                                s.DocTotalBef = header.DocTotalBef;
                                s.DiscountAmt = header.DiscountAmt;
                                s.DiscountPer = header.DiscountPer;
                                s.Referral = header.Referral;
                                s.ConPeriod = header.ConPeriod;
                                s.DocDate = header.DocDate;
                                s.DueDate = header.DueDate;
                                s.SubTotal = header.SubTotal;
                                s.BalanceDue = header.BalanceDue;
                                s.SAPIntegrationStatus = "Update";
                                db.SOs.Context.SubmitChanges();

                                SO1 s_1 = s.SO1s.ToList().LastOrDefault();
                                if (s_1 != null)
                                {
                                    s_1.LineTotal = header.SubTotal;
                                    s_1.DiscountAmt = header.DiscountAmt;
                                    s_1.DiscountPer = header.DiscountPer;
                                    db.SO1s.Context.SubmitChanges();
                                }
                                    
                                InstallmentRow in_row = db.InstallmentRows.Where(a => a.BaseEntry == s.DocEntry && a.BaseLine == s_1.LineNum && a.Method=="B").FirstOrDefault();
                                if (in_row != null)
                                {
                                    //// add old installmentRow to installment row history
                                    int lastInstanc = (int)(db.InstallmentRowHistories.Where(a => a.BaseLine == header.DocEntry).ToList().LastOrDefault() == null ? 0 : db.InstallmentRowHistories.Where(a => a.BaseLine == header.DocEntry).ToList().LastOrDefault().logInstanc);
                                    InstallmentRowHistory Hrow = new InstallmentRowHistory();
                                    Hrow=new InstallmentRowHistory
                                                {
                                                    ID = in_row.ID,
                                                    BaseEntry = in_row.BaseEntry,
                                                    BaseLine = in_row.BaseLine,
                                                    VisOrder = in_row.VisOrder,
                                                    ItemCode = in_row.ItemCode,
                                                    Principle = in_row.Principle,
                                                    Interest = in_row.Interest,
                                                    Monthly = in_row.Monthly,
                                                    PaymentDate = in_row.PaymentDate,
                                                    DueDate = in_row.DueDate,
                                                    Remaining = in_row.Remaining,
                                                    ReIncloudInter = in_row.ReIncloudInter,
                                                    RowStatus = in_row.RowStatus,
                                                    CuInterest = in_row.CuInterest,
                                                    CuPayment = in_row.CuPayment,
                                                    FixedPayment = in_row.FixedPayment,
                                                    ARNo = in_row.ARNo,
                                                    PaymentNo = in_row.PaymentNo,
                                                    Method = in_row.Method,
                                                    InstallmentAmt = in_row.InstallmentAmt,
                                                    DiscountAmt = in_row.DiscountAmt,
                                                    DepositAmt = in_row.DepositAmt,
                                                    AnnualRate = in_row.AnnualRate,
                                                    PeriodMonths = in_row.PeriodMonths,
                                                    HouseStatus = in_row.HouseStatus,
                                                    Remarks = in_row.Remarks,
                                                    Syn = in_row.Syn,
                                                    ErrorLog = in_row.ErrorLog,
                                                    DiscountAmount = in_row.DiscountAmount,
                                                    DiscountPer = in_row.DiscountPer,
                                                    SpecialDisAmount = in_row.SpecialDisAmount,
                                                    SpecialDisPer = in_row.SpecialDisPer,
                                                    AdditionalDisAmount = in_row.AdditionalDisAmount,
                                                    AdditionalDisPer = in_row.AdditionalDisPer,
                                                    ItemName = in_row.ItemName,
                                                    OcrCode = in_row.OcrCode,
                                                    OcrCode2 = in_row.OcrCode2,
                                                    OcrCode3 = in_row.OcrCode3,
                                                    logInstanc = lastInstanc + 1,
                                                    HistoryDate = DateTime.Now,
                                                    ARNoInterest = in_row.ARNoInterest,
                                                    PaymentNoInterest = in_row.PaymentNoInterest,
                                                };

                                    in_row.Remaining = (header.SubTotal - s.DepositAmt);
                                    in_row.ReIncloudInter = in_row.Interest + (header.SubTotal - s.DiscountAmt);
                                    in_row.DiscountAmount = installment_row[0].DiscountAmount;
                                    in_row.DiscountAmt = installment_row[0].DiscountAmt;
                                    in_row.DiscountPer= installment_row[0].DiscountPer;
                                    in_row.SpecialDisAmount = installment_row[0].SpecialDisAmount;
                                    in_row.SpecialDisPer = installment_row[0].SpecialDisPer;
                                    db.InstallmentRows.Context.SubmitChanges();
                                }
                            }
                        }
                        if (del_list != null)
                        {
                            InstallmentRow del = new InstallmentRow();
                            foreach(InstallmentRow a in del_list)
                            {
                                del = new InstallmentRow();
                                del = db.InstallmentRows.Where(b => b.ID == a.ID && b.RowStatus == "O").FirstOrDefault();
                                db.InstallmentRows.DeleteOnSubmit(del);
                                db.InstallmentRows.Context.SubmitChanges();
                            }
                        }
                         if (installment_row != null)
                        {
                            db.InstallmentRows.InsertAllOnSubmit(installment_row);
                            db.InstallmentRows.Context.SubmitChanges();
                        }
                        SO so = db.SOs.Where(a => a.DocEntry == installment_row[0].BaseEntry).FirstOrDefault();
                        so.Reason = "SLD";
                        so.DocStatus = "Sold";
                        db.SOs.Context.SubmitChanges();

                        SO1 s1 = db.SO1s.Where(a => a.DocEntry == installment_row[0].BaseEntry && a.LineNum==installment_row[0].BaseLine).ToList().LastOrDefault();
                        s1.Reason = "SLD";
                        s1.LineStatus = "Sold";
                        db.SO1s.Context.SubmitChanges();

                        //Update SAP AR Credit Memo
                        db.ICC_UpdateSAPDocumentStatus("LoanScheduleGenerate",header.DocEntry.ToString(),"");
                        db.SO1s.Context.SubmitChanges();

                        if (status == "OK")
                        {
                            trans.Complete();
                            trans.Dispose();
                        }
                    }
                }
                catch (Exception ex)
                {
                    status = "Failed";
                }
            }
            return Json(new { status = status, LastEntry = LastEntry },JsonRequestBehavior.AllowGet);
        }
        public JsonResult save_hold_unit(List<HoldUnit> hold_List)
        {
            try
            {
                status = "OK";
                int LastEntry = 0;
                if (status == "OK")
                {
                    var trans = TransWithCommitted();
                    try
                    {
                        if (hold_List != null)
                        {
                            using (trans)
                            {
                                HoldUnit hold = new HoldUnit();
                                List<HoldUnit> holdList = new List<HoldUnit>();
                                foreach (HoldUnit h in hold_List)
                                {
                                    hold = db.HoldUnits.Where(a => a.DocEntry == h.DocEntry).FirstOrDefault();
                                    if (hold != null)
                                    {
                                        hold.DocStatus = h.DocStatus;
                                        hold.UpdatedBy = h.CreatedBy;
                                        hold.UpdatedDate = DateTime.Now;
                                        hold.SAPIntegrationStatus = "A";
                                        db.HoldUnits.Context.SubmitChanges();
                                    }
                                    else
                                    {
                                        h.CreatedDate = DateTime.Now;
                                        h.SAPIntegrationStatus = "A";
                                        holdList.Add(h);
                                    }
                                }
                                if (holdList != null)
                                {
                                    db.HoldUnits.InsertAllOnSubmit(holdList);
                                    db.HoldUnits.Context.SubmitChanges();
                                }
                                if (status == "OK")
                                {
                                    trans.Complete();
                                    trans.Dispose();
                                }
                            }
                        }
                        else
                        {
                            status = "Error";
                        }
                    }
                    catch (Exception ex)
                    {
                        status = "Failed";
                    }
                }
                return Json(new
                {
                    status = status,
                    lastEntry = LastEntry
                });
            }
            catch (Exception ex)
            {
                status = "Failed";
            }
            return Json(new
            {
                status = status,
            });
        }
       
  
        public JsonResult save_memo(CN header, List<CN1> detail)
        {
            try
            {
                status = "OK";
                int LastEntry = 0;
                if (status == "OK")
                {
                    string sqltext = "exec ICC_Get_DocNum '" + header.OcrCode + "','" + header.DocDate + "','CNR'";
                    string docnum = view.getSalesDocNum(sqltext, ConfigurationManager.AppSettings["sql"].ToString());
                    if (docnum == null)
                    {
                        return Json(new { status = "Error", lastEntry = LastEntry });
                    }
                    var trans = TransWithCommitted();
                    try
                    {
                        using (trans)
                        {
                            if (header == null || detail == null)
                            {
                                status = "blank";
                            }
                            else
                            {
                                CN cn = new CN();
                                cn = db.CNs.Where(a => a.DocEntry == header.DocEntry).FirstOrDefault();
                                if (cn == null)
                                {
                                    cn = header;
                                    cn.DocNum = docnum;
                                    cn.CreatedDate = DateTime.Now;
                                    db.CNs.InsertOnSubmit(header);
                                    db.CNs.Context.SubmitChanges();

                                    LastEntry = cn.DocEntry;

                                    List<CN1> cn1 = new List<CN1>();
                                    detail.ForEach(a => a.DocEntry = cn.DocEntry);
                                    cn1 = detail;
                                    db.CN1s.InsertAllOnSubmit(cn1);
                                    db.CN1s.Context.SubmitChanges();
                                }
                            }
                            if (status == "OK")
                            {
                                trans.Complete();
                                trans.Dispose();
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        status = "Failed";
                    }
                }
                return Json(new
                {
                    status = status,
                    lastEntry = LastEntry,
                });
            }
            catch (Exception ex)
            {
                status = "Failed";
            }
            return Json(new
            {
                status = status
            });
        }
        public JsonResult save_sales_opportunity(SalesOpport header, List<SalesOpport1> opportList, List<SalesOpport1> del_list)
        {
            try
            {
                status = "OK";
                int LastEntry = 0;
                if (status == "OK")
                {
                    var trans = TransWithCommitted();
                    try
                    {
                        using (trans)
                        {
                            if (header != null || opportList!=null)
                            {
                                SalesOpport sales = db.SalesOpports.Where(a => a.DocEntry == header.DocEntry).FirstOrDefault();
                                if (sales == null)
                                {
                                    sales = new SalesOpport();
                                    sales = header;
                                    sales.CreatedDate = DateTime.Now;
                                    db.SalesOpports.InsertOnSubmit(sales);
                                    db.SalesOpports.Context.SubmitChanges();

                                    int i = 0;
                                    opportList.ForEach(a => { a.DocEntry = sales.DocEntry;a.RowStatus = "O" ; a.LineNum = i++; });
                                    db.SalesOpport1s.InsertAllOnSubmit(opportList);
                                    db.SalesOpport1s.Context.SubmitChanges();
                                }
                                else
                                {
                                    List<SalesOpport1> s1_List = new List<SalesOpport1>();
                                    SalesOpport1 s1 = null;
                                    if (del_list != null)
                                    {
                                        foreach(var s in del_list)
                                        {
                                            s1 = db.SalesOpport1s.Where(a => a.DocEntry == s.DocEntry && a.LineNum == s.LineNum).FirstOrDefault();
                                            if (s1 != null)
                                            {
                                                s1_List.Add(s1);
                                            }
                                        }
                                        db.SalesOpport1s.DeleteAllOnSubmit(s1_List);
                                        db.SalesOpport1s.Context.SubmitChanges();
                                    }
                                    sales.ClosedDate = header.ClosedDate;
                                    sales.ClosedPrcnt = header.ClosedPrcnt;
                                    sales.DocStatus = header.DocStatus;
                                    sales.UpdatedBy = header.CreatedBy;
                                    sales.UpdatedDate = DateTime.Now;
                                    db.SalesOpports.Context.SubmitChanges();

                                    int lastLine = sales.SalesOpport1s.ToList().LastOrDefault().LineNum;

                                    s1_List = new List<SalesOpport1>();
                                    s1 = new SalesOpport1();
                                    foreach (var s in opportList)
                                    {
                                        s1 = db.SalesOpport1s.Where(a => a.DocEntry == s.DocEntry && a.LineNum == s.LineNum).FirstOrDefault();
                                        if (s1 == null)
                                        {
                                            lastLine++;
                                            s.LineNum = lastLine;
                                            s1_List.Add(s);
                                        }
                                        else
                                        {
                                            s1.StartDate = s.StartDate;
                                            s1.ClosedDate = s.ClosedDate;
                                            s1.SalesEmployee = s.SalesEmployee;
                                            s1.Stage = s.Stage;
                                            s1.StagePrcnt = s.StagePrcnt;
                                            s1.PotentialAmt = s.PotentialAmt;
                                            db.SalesOpport1s.Context.SubmitChanges();
                                        }
                                    }
                                    if (s1_List.Count > 0)
                                    {
                                        db.SalesOpport1s.InsertAllOnSubmit(s1_List);
                                        db.SalesOpport1s.Context.SubmitChanges();
                                    }
                                }
                            }
                            else
                            {
                                status = "error";
                            }
                            if (status == "OK")
                            {
                                trans.Complete();
                                trans.Dispose();
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        status = "Failed";
                        //ErrorDes = ex.Message;
                    }
                }
                return Json(new
                {
                    status = status,
                    //Message = ErrorDes,
                    lastEntry = LastEntry,
                    //docNum = DocNum
                });
            }
            catch (Exception ex)
            {
                status = "Failed";
                //ErrorDes = ex.Message;
            }
            return Json(new
            {
                status = status,
                //Message = ErrorDes
            });
        }
        public JsonResult update_payment_shcedule(List<InstallmentRow> installment_row)
        {
            status = "OK";
            int LastEntry = 0;
            if (status == "OK")
            {
                var trans = TransWithCommitted();
                try
                {
                    using (trans)
                    {
                        if (installment_row != null)
                        {
                            int lastInstanc = 0;
                            List<InstallmentRowHistory> rowList = new List<InstallmentRowHistory>();
                            InstallmentRow in_st = new InstallmentRow();
                            foreach(var in_1 in installment_row)
                            {
                                in_st = db.InstallmentRows.Where(a => a.ID == in_1.ID).FirstOrDefault();
                                if (in_st != null)
                                {
                                    //// add old installmentRow to installment row history
                                    lastInstanc = (int)(db.InstallmentRowHistories.Where(a => a.BaseEntry == in_st.BaseEntry && a.BaseLine == in_st.BaseLine).ToList().LastOrDefault() == null ? 0 : db.InstallmentRowHistories.Where(a => a.BaseEntry == in_st.BaseEntry && a.BaseLine == in_st.BaseLine).ToList().LastOrDefault().logInstanc);                                        
                                    rowList.Add(
                                                new InstallmentRowHistory
                                                {
                                                    ID = in_st.ID,
                                                    BaseEntry = in_st.BaseEntry,
                                                    BaseLine = in_st.BaseLine,
                                                    VisOrder = in_st.VisOrder,
                                                    ItemCode = in_st.ItemCode,
                                                    Principle = in_st.Principle,
                                                    Interest = in_st.Interest,
                                                    Monthly = in_st.Monthly,
                                                    PaymentDate = in_st.PaymentDate,
                                                    DueDate = in_st.DueDate,
                                                    Remaining = in_st.Remaining,
                                                    ReIncloudInter = in_st.ReIncloudInter,
                                                    RowStatus = in_st.RowStatus,
                                                    CuInterest = in_st.CuInterest,
                                                    CuPayment = in_st.CuPayment,
                                                    FixedPayment = in_st.FixedPayment,
                                                    ARNo = in_st.ARNo,
                                                    PaymentNo = in_st.PaymentNo,
                                                    Method = in_st.Method,
                                                    InstallmentAmt = in_st.InstallmentAmt,
                                                    DiscountAmt = in_st.DiscountAmt,
                                                    DepositAmt = in_st.DepositAmt,
                                                    AnnualRate = in_st.AnnualRate,
                                                    PeriodMonths = in_st.PeriodMonths,
                                                    HouseStatus = in_st.HouseStatus,
                                                    Remarks = in_st.Remarks,
                                                    Syn = in_st.Syn,
                                                    ErrorLog = in_st.ErrorLog,
                                                    DiscountAmount = in_st.DiscountAmount,
                                                    DiscountPer = in_st.DiscountPer,
                                                    SpecialDisAmount = in_st.SpecialDisAmount,
                                                    SpecialDisPer = in_st.SpecialDisPer,
                                                    AdditionalDisAmount = in_st.AdditionalDisAmount,
                                                    AdditionalDisPer = in_st.AdditionalDisPer,
                                                    ItemName = in_st.ItemName,
                                                    OcrCode = in_st.OcrCode,
                                                    OcrCode2 = in_st.OcrCode2,
                                                    OcrCode3 = in_st.OcrCode3,
                                                    logInstanc = lastInstanc + 1,
                                                    HistoryDate = DateTime.Now
                                                }
                                            );
                                }
                                in_st.PaymentDate = in_1.PaymentDate;
                                in_st.DueDate = in_1.DueDate;
                                db.InstallmentRows.Context.SubmitChanges();
                            }

                            db.InstallmentRowHistories.InsertAllOnSubmit(rowList);
                            db.InstallmentRowHistories.Context.SubmitChanges();
                            if (status == "OK")
                            {
                                trans.Complete();
                                trans.Dispose();
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    status = "Failed";
                    //ErrorDes = ex.Message;
                }
            }
            return Json(new { status = status,LastEntry=LastEntry }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult save_updateOldSchedule(SO header)
        {
            string status = "OK";
            int lastEntry = 0;

            try
            {
                using (var trans = TransWithCommitted())
                {
                    try
                    {
                        var so = db.SOs.FirstOrDefault(x => x.DocEntry == header.DocEntry);
                  
                        if (so == null)
                        {
                            return Json(new { status = "Error", lastEntry = 99 });
                        }

                        // Update fields
                        so.ChangeReason = header.ChangeReason;
                        so.UpdatedBy = header.CreatedBy;
                        so.ChangeItemRefNo = header.ChangeItemRefNo;
                        so.UpdatedDate = DateTime.Now; // Assuming there is an UpdatedDate column

                        ///Insert Data to History Table 
                        int lastInstanc = 0;
                        List<InstallmentRowHistory> rowList = new List<InstallmentRowHistory>();
                        InstallmentRow in_st = new InstallmentRow();
                        foreach (var in_1 in db.InstallmentRows.Where(a => a.BaseEntry == header.DocEntry && a.RowStatus == "O").ToList())
                        {
                            in_st = db.InstallmentRows.Where(a => a.ID == in_1.ID).FirstOrDefault();
                            if (in_st != null)
                            {
                                //// add old installmentRow to installment row history
                                lastInstanc = (int)(db.InstallmentRowHistories.Where(a => a.BaseEntry == in_st.BaseEntry && a.BaseLine == in_st.BaseLine).ToList().LastOrDefault() == null ? 0 : db.InstallmentRowHistories.Where(a => a.BaseEntry == in_st.BaseEntry && a.BaseLine == in_st.BaseLine).ToList().LastOrDefault().logInstanc);
                                rowList.Add(
                                            new InstallmentRowHistory
                                            {
                                                ID = in_st.ID,
                                                BaseEntry = in_st.BaseEntry,
                                                BaseLine = in_st.BaseLine,
                                                VisOrder = in_st.VisOrder,
                                                ItemCode = in_st.ItemCode,
                                                Principle = in_st.Principle,
                                                Interest = in_st.Interest,
                                                Monthly = in_st.Monthly,
                                                PaymentDate = in_st.PaymentDate,
                                                DueDate = in_st.DueDate,
                                                Remaining = in_st.Remaining,
                                                ReIncloudInter = in_st.ReIncloudInter,
                                                RowStatus = in_st.RowStatus,
                                                CuInterest = in_st.CuInterest,
                                                CuPayment = in_st.CuPayment,
                                                FixedPayment = in_st.FixedPayment,
                                                ARNo = in_st.ARNo,
                                                PaymentNo = in_st.PaymentNo,
                                                Method = in_st.Method,
                                                InstallmentAmt = in_st.InstallmentAmt,
                                                DiscountAmt = in_st.DiscountAmt,
                                                DepositAmt = in_st.DepositAmt,
                                                AnnualRate = in_st.AnnualRate,
                                                PeriodMonths = in_st.PeriodMonths,
                                                HouseStatus = in_st.HouseStatus,
                                                Remarks = in_st.Remarks,
                                                Syn = in_st.Syn,
                                                ErrorLog = in_st.ErrorLog,
                                                DiscountAmount = in_st.DiscountAmount,
                                                DiscountPer = in_st.DiscountPer,
                                                SpecialDisAmount = in_st.SpecialDisAmount,
                                                SpecialDisPer = in_st.SpecialDisPer,
                                                AdditionalDisAmount = in_st.AdditionalDisAmount,
                                                AdditionalDisPer = in_st.AdditionalDisPer,
                                                ItemName = in_st.ItemName,
                                                OcrCode = in_st.OcrCode,
                                                OcrCode2 = in_st.OcrCode2,
                                                OcrCode3 = in_st.OcrCode3,
                                                logInstanc = lastInstanc + 1,
                                                HistoryDate = DateTime.Now
                                            }
                                        );
                            }
                            in_st.PaymentDate = in_1.PaymentDate;
                            in_st.DueDate = in_1.DueDate;
                            db.InstallmentRows.Context.SubmitChanges();
                        }

                        db.InstallmentRowHistories.InsertAllOnSubmit(rowList);
                        db.InstallmentRowHistories.Context.SubmitChanges();


                        ///

                        if (header.ChangeReason == "ChangingProduct")
                        {
                            ///Update Installment Row for the change Item only 
                            db.ICC_Installment_ChangeItem_AutoGenerateRow(header.ChangeItemRefNo, so.SapDocEntry.ToString());
                            ///Update SAP Document Status back
                            db.ICC_UpdateSAPDocumentStatus("ChangingProduct", header.ChangeItemRefNo, "Sync");
                        }

                        //if (header.ChangeReason == "ChangingProduct" || header.ChangeReason == "Reprocessing")
                        //{
                        //    //Remove from exitsing installment Row 
                        //    db.ICC_Installment_ChangeItem_RemoveOpenRow(header.DocEntry.ToString());

                        //}
                       

                        if (header.ChangeReason == "Reprocessing")
                        {
                            db.ICC_UpdateSAPDocumentStatus("Reprocessing", so.SapDocEntry.ToString(), "Sync");
                        }

                        if (header.ChangeReason == "ChangeOwner")
                        {
                            ///Update SAP Document Status back
                            db.ICC_UpdateSAPDocumentStatus("ChangeOwner", so.SapDocEntry.ToString(), "Sync");
                        }



                        db.SOs.Context.SubmitChanges();

           

                        if (status == "OK")
                        {
                            trans.Complete();
                            trans.Dispose();
                        }
                    }
                    catch (Exception ex)
                    {
                        status = "Error";
                        return Json(new { status, error = ex.Message });
                    }
                }
            }
            catch (Exception ex)
            {
                status = "Error";
                return Json(new { status, error = ex.Message });
            }

            return Json(new { status, lastEntry });
        }

        public ActionResult LoanListing()
        {
            ViewBag.ChangeOwnerApporovalListing = db.ICC_Get_List_Loan(
                "SLD",
                new DateTime(1999, 1, 1),
                new DateTime(1999, 1, 1),
                "", "", ""
            ).ToList();

            return View();
        }

        public ActionResult PreviewLoan(int DocEntry)
        {

            ViewBag.installment = db.InstallmentRows.Where(x => x.BaseEntry == DocEntry).ToList();
            ViewBag.HeaderLoan = db.ICC_Loan_List_By_ID (DocEntry).ToList();

            return View();
        }


        public JsonResult get_restructure_schedule_by_so(string soEntry, string rowStatus)

        {
            rowStatus = "C";
            string sqltext = "exec ICC_AddOn_Installment_Table_For_Reschedule '" + soEntry + "','" + rowStatus + "'";
            List<Payment_Schedule> list = new List<Payment_Schedule>();
            list = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable()
                    select new Payment_Schedule()
                    {
                        ID = x["ID"].ToString(),
                        Remove = x["Remove"].ToString(),
                        Method = x["Method"].ToString(),
                        ItemCode = x["ItemCode"].ToString(),
                        ItemName = x["ItemName"].ToString(),
                        RowNo = x["RowNo"].ToString(),
                        MonthlyPay = x["MonthlyPay"].ToString(),
                        Principle = x["Principle"].ToString(),
                        Interest = x["Interest"].ToString(),
                        AccAmt = x["AccAmt"].ToString(),
                        RemainingAmt = x["RemainingAmt"].ToString(),
                        InstallmentDate = Convert.ToDateTime(x["InstallmentDate"].ToString()).ToString("dd-MMM-yyyy"),
                        DueDate = Convert.ToDateTime(x["DueDate"].ToString()).ToString("dd-MMM-yyyy"),
                        U_Period = x["U_Period"].ToString(),
                        U_AnnulRate = x["U_AnnulRate"].ToString(),
                        DepositAmt = x["DepositAmt"].ToString(),
                        CuInterest = x["CuInterest"].ToString(),
                        CuPayment = x["CuPayment"].ToString(),
                        BaseEntry = x["BaseEntry"].ToString(),
                        Status = x["Status"].ToString(),
                        BaseLine = x["BaseLine"].ToString(),
                        ARNo = x["ARNo"].ToString(),
                        PaymentNo = x["PaymentNo"].ToString(),
                        FixedPayment = x["FixedPayment"].ToString(),
                        HouseStatus = x["HouseStatus"].ToString(),
                        Remarks = x["Remarks"].ToString(),
                        CardCode = x["CardCode"].ToString(),
                        CardName = x["CardName"].ToString(),
                        DocNum = x["DocNum"].ToString(),
                        DocDate = Convert.ToDateTime(x["DocDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        DeliveryDate = Convert.ToDateTime(x["DueDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        OcrCode = x["OcrCode"].ToString(),
                        OcrCode2 = x["OcrCode2"].ToString(),
                        OcrCode3 = x["OcrCode3"].ToString(),
                        HouseAmount = x["HouseAmount"].ToString(),
                        DiscountAmount = x["DiscountAmount"].ToString(),
                        DiscountPer = x["DiscountPer"].ToString(),
                        SpecialDisAmount = x["SpecialDisAmount"].ToString(),
                        SpecialDisPer = x["SpecialDisPer"].ToString(),
                        InstallmentAmt = x["InstallmentAmt"].ToString(),
                        DocStatus = x["DocStatus"].ToString(),
                        PaidDate = x["PaidDate"].ToString() == "" ? "" : Convert.ToDateTime(x["PaidDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        PaidAmt = x["PaidAmt"].ToString(),

                        NewItemCode = x["NewItemCode"].ToString(),
                        NewItemName = x["NewItemName"].ToString(),
                        BuybackAmt = x["BuybackAmt"].ToString(),
                        GeneratedARAmt = x["GeneratedARAmt"].ToString(),
                        OutstandingAmt = x["OutstandingAmt"].ToString(),
                        VarianAmt = x["VarianAmt"].ToString(),
                        DistNumber = x["SerialNo"].ToString(),
                        ARNoInterest = x["ARNoInterest"].ToString(),
                        PaymentNoInterest = x["PaymentNoInterest"].ToString()

                    }).ToList();
            var data = list.Select(x => new {
                x.ID,
                x.Remove,
                x.Method,
                x.ItemCode,
                x.ItemName,
                x.RowNo,
                x.MonthlyPay,
                x.Principle,
                x.Interest,
                x.AccAmt,
                x.RemainingAmt,
                x.InstallmentDate,
                x.DueDate,
                x.U_Period,
                x.U_AnnulRate,
                x.DepositAmt,
                x.CuInterest,
                x.CuPayment,
                x.BaseEntry,
                x.Status,
                x.BaseLine,
                x.ARNo,
                x.PaymentNo,
                x.FixedPayment,
                x.HouseStatus,
                x.Remarks,
                x.CardCode,
                x.CardName,
                x.DocNum,
                x.DocDate,
                x.DeliveryDate,
                x.OcrCode,
                x.OcrCode2,
                x.OcrCode3,
                x.HouseAmount,
                x.DiscountAmount,
                x.DiscountPer,
                x.SpecialDisAmount,
                x.SpecialDisPer,
                x.InstallmentAmt,
                x.DocStatus,
                x.PaidDate,
                x.PaidAmt,
                x.NewItemCode,
                x.NewItemName,
                x.BuybackAmt,
                x.GeneratedARAmt,
                x.OutstandingAmt,
                x.VarianAmt,
                x.DistNumber,
                x.ARNoInterest,
                x.PaymentNoInterest
            }).ToList();
            return Json(new
            {
                status = status,
                data = data,
            });
        }

        public JsonResult get_restructure_amt_schedule_by_so(string soEntry, string rowStatus,String periodM)

        {
            rowStatus = "ALL";
            string sqltext = "exec ICC_AddOn_Installment_Table_For_Reschedule_Amt '" + soEntry + "','" + rowStatus + "','" + periodM + "'";
            List<Payment_Schedule> list = new List<Payment_Schedule>();
            list = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable()
                    select new Payment_Schedule()
                    {
                        ID = x["ID"].ToString(),
                        Remove = x["Remove"].ToString(),
                        Method = x["Method"].ToString(),
                        ItemCode = x["ItemCode"].ToString(),
                        ItemName = x["ItemName"].ToString(),
                        RowNo = x["RowNo"].ToString(),
                        MonthlyPay = x["MonthlyPay"].ToString(),
                        Principle = x["Principle"].ToString(),
                        Interest = x["Interest"].ToString(),
                        AccAmt = x["AccAmt"].ToString(),
                        RemainingAmt = x["RemainingAmt"].ToString(),
                        InstallmentDate = Convert.ToDateTime(x["InstallmentDate"].ToString()).ToString("dd-MMM-yyyy"),
                        DueDate = Convert.ToDateTime(x["DueDate"].ToString()).ToString("dd-MMM-yyyy"),
                        U_Period = x["U_Period"].ToString(),
                        U_AnnulRate = x["U_AnnulRate"].ToString(),
                        DepositAmt = x["DepositAmt"].ToString(),
                        CuInterest = x["CuInterest"].ToString(),
                        CuPayment = x["CuPayment"].ToString(),
                        BaseEntry = x["BaseEntry"].ToString(),
                        Status = x["Status"].ToString(),
                        BaseLine = x["BaseLine"].ToString(),
                        ARNo = x["ARNo"].ToString(),
                        PaymentNo = x["PaymentNo"].ToString(),
                        FixedPayment = x["FixedPayment"].ToString(),
                        HouseStatus = x["HouseStatus"].ToString(),
                        Remarks = x["Remarks"].ToString(),
                        CardCode = x["CardCode"].ToString(),
                        CardName = x["CardName"].ToString(),
                        DocNum = x["DocNum"].ToString(),
                        DocDate = Convert.ToDateTime(x["DocDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        DeliveryDate = Convert.ToDateTime(x["DueDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        OcrCode = x["OcrCode"].ToString(),
                        OcrCode2 = x["OcrCode2"].ToString(),
                        OcrCode3 = x["OcrCode3"].ToString(),
                        HouseAmount = x["HouseAmount"].ToString(),
                        DiscountAmount = x["DiscountAmount"].ToString(),
                        DiscountPer = x["DiscountPer"].ToString(),
                        SpecialDisAmount = x["SpecialDisAmount"].ToString(),
                        SpecialDisPer = x["SpecialDisPer"].ToString(),
                        InstallmentAmt = x["InstallmentAmt"].ToString(),
                        DocStatus = x["DocStatus"].ToString(),
                        PaidDate = x["PaidDate"].ToString() == "" ? "" : Convert.ToDateTime(x["PaidDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        PaidAmt = x["PaidAmt"].ToString(),

                        NewItemCode = x["NewItemCode"].ToString(),
                        NewItemName = x["NewItemName"].ToString(),
                        BuybackAmt = x["BuybackAmt"].ToString(),
                        GeneratedARAmt = x["GeneratedARAmt"].ToString(),
                        OutstandingAmt = x["OutstandingAmt"].ToString(),
                        VarianAmt = x["VarianAmt"].ToString(),
                        DistNumber = x["SerialNo"].ToString(),
                        PaymentDateNew = Convert.ToDateTime(x["PaymentDateNew"].ToString()).ToString("dd-MMM-yyyy"),
                        ChnageDateStatus = x["ChnageDateStatus"].ToString(),
                        ARNoInterest = x["ARNoInterest"].ToString(),
                        PaymentNoInterest = x["PaymentNoInterest"].ToString()

                    }).ToList();
            var data = list.Select(x => new {
                x.ID,
                x.Remove,
                x.Method,
                x.ItemCode,
                x.ItemName,
                x.RowNo,
                x.MonthlyPay,
                x.Principle,
                x.Interest,
                x.AccAmt,
                x.RemainingAmt,
                x.InstallmentDate,
                x.DueDate,
                x.U_Period,
                x.U_AnnulRate,
                x.DepositAmt,
                x.CuInterest,
                x.CuPayment,
                x.BaseEntry,
                x.Status,
                x.BaseLine,
                x.ARNo,
                x.PaymentNo,
                x.FixedPayment,
                x.HouseStatus,
                x.Remarks,
                x.CardCode,
                x.CardName,
                x.DocNum,
                x.DocDate,
                x.DeliveryDate,
                x.OcrCode,
                x.OcrCode2,
                x.OcrCode3,
                x.HouseAmount,
                x.DiscountAmount,
                x.DiscountPer,
                x.SpecialDisAmount,
                x.SpecialDisPer,
                x.InstallmentAmt,
                x.DocStatus,
                x.PaidDate,
                x.PaidAmt,
                x.NewItemCode,
                x.NewItemName,
                x.BuybackAmt,
                x.GeneratedARAmt,
                x.OutstandingAmt,
                x.VarianAmt,
                x.DistNumber,
                x.PaymentDateNew,
                x.ChnageDateStatus,
                x.ARNoInterest,
                x.PaymentNoInterest
            }).ToList();
            return Json(new
            {
                status = status,
                data = data,
            });
        }


        public JsonResult get_payment_schedule_by_so_BuyBack(string soEntry, string rowStatus)
        {
            rowStatus = "C";
            string sqltext = "exec ICC_AddOn_Installment_Table_BuyBack '" + soEntry + "','" + rowStatus + "'";
            List<Payment_Schedule> list = new List<Payment_Schedule>();
            list = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable()
                    select new Payment_Schedule()
                    {
                        ID = x["ID"].ToString(),
                        Remove = x["Remove"].ToString(),
                        Method = x["Method"].ToString(),
                        ItemCode = x["ItemCode"].ToString(),
                        ItemName = x["ItemName"].ToString(),
                        RowNo = x["RowNo"].ToString(),
                        MonthlyPay = x["MonthlyPay"].ToString(),
                        Principle = x["Principle"].ToString(),
                        Interest = x["Interest"].ToString(),
                        AccAmt = x["AccAmt"].ToString(),
                        RemainingAmt = x["RemainingAmt"].ToString(),
                        InstallmentDate = Convert.ToDateTime(x["InstallmentDate"].ToString()).ToString("dd-MMM-yyyy"),
                        DueDate = Convert.ToDateTime(x["DueDate"].ToString()).ToString("dd-MMM-yyyy"),
                        U_Period = x["U_Period"].ToString(),
                        U_AnnulRate = x["U_AnnulRate"].ToString(),
                        DepositAmt = x["DepositAmt"].ToString(),
                        CuInterest = x["CuInterest"].ToString(),
                        CuPayment = x["CuPayment"].ToString(),
                        BaseEntry = x["BaseEntry"].ToString(),
                        Status = x["Status"].ToString(),
                        BaseLine = x["BaseLine"].ToString(),
                        ARNo = x["ARNo"].ToString(),
                        PaymentNo = x["PaymentNo"].ToString(),
                        FixedPayment = x["FixedPayment"].ToString(),
                        HouseStatus = x["HouseStatus"].ToString(),
                        Remarks = x["Remarks"].ToString(),
                        CardCode = x["CardCode"].ToString(),
                        CardName = x["CardName"].ToString(),
                        DocNum = x["DocNum"].ToString(),
                        DocDate = Convert.ToDateTime(x["DocDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        DeliveryDate = Convert.ToDateTime(x["DueDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        OcrCode = x["OcrCode"].ToString(),
                        OcrCode2 = x["OcrCode2"].ToString(),
                        OcrCode3 = x["OcrCode3"].ToString(),
                        HouseAmount = x["HouseAmount"].ToString(),
                        DiscountAmount = x["DiscountAmount"].ToString(),
                        DiscountPer = x["DiscountPer"].ToString(),
                        SpecialDisAmount = x["SpecialDisAmount"].ToString(),
                        SpecialDisPer = x["SpecialDisPer"].ToString(),
                        InstallmentAmt = x["InstallmentAmt"].ToString(),
                        DocStatus = x["DocStatus"].ToString(),
                        PaidDate = x["PaidDate"].ToString() == "" ? "" : Convert.ToDateTime(x["PaidDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        PaidAmt = x["PaidAmt"].ToString(),

                        NewItemCode = x["NewItemCode"].ToString(),
                        NewItemName = x["NewItemName"].ToString(),
                        BuybackAmt = x["BuybackAmt"].ToString(),
                        GeneratedARAmt = x["GeneratedARAmt"].ToString(),
                        OutstandingAmt = x["OutstandingAmt"].ToString(),
                        VarianAmt = x["VarianAmt"].ToString(),
                        DistNumber = x["SerialNo"].ToString(),
                        ARNoInterest = x["ARNoInterest"].ToString(),
                        PaymentNoInterest = x["PaymentNoInterest"].ToString()

                    }).ToList();
            var data = list.Select(x => new {
                x.ID,
                x.Remove,
                x.Method,
                x.ItemCode,
                x.ItemName,
                x.RowNo,
                x.MonthlyPay,
                x.Principle,
                x.Interest,
                x.AccAmt,
                x.RemainingAmt,
                x.InstallmentDate,
                x.DueDate,
                x.U_Period,
                x.U_AnnulRate,
                x.DepositAmt,
                x.CuInterest,
                x.CuPayment,
                x.BaseEntry,
                x.Status,
                x.BaseLine,
                x.ARNo,
                x.PaymentNo,
                x.FixedPayment,
                x.HouseStatus,
                x.Remarks,
                x.CardCode,
                x.CardName,
                x.DocNum,
                x.DocDate,
                x.DeliveryDate,
                x.OcrCode,
                x.OcrCode2,
                x.OcrCode3,
                x.HouseAmount,
                x.DiscountAmount,
                x.DiscountPer,
                x.SpecialDisAmount,
                x.SpecialDisPer,
                x.InstallmentAmt,
                x.DocStatus,
                x.PaidDate,
                x.PaidAmt,
                x.NewItemCode,
                x.NewItemName,
                x.BuybackAmt,
                x.GeneratedARAmt,
                x.OutstandingAmt,
                x.VarianAmt,
                x.DistNumber,
                x.ARNoInterest,
                x.PaymentNoInterest
            }).ToList();
            return Json(new
            {
                status = status,
                data = data,
            });
        }

        public JsonResult save_buyback(CNDraf header, List<CN1Draf> cn_inList, List<CNInstallmentRowDraf> detail, List<CNInstallmentRowDraf> ar_inList)
        {
            string status = "OK";
            int LastEntry = 0;

            try
            {
                if (header == null || detail == null || cn_inList == null || ar_inList == null)
                {
                    return Json(new { status = "blank", LastEntry }, JsonRequestBehavior.AllowGet);
                }

                var monthlyTotal = detail.Sum(x => x.Monthly);

                // Get Approval Template
                var rawResult = db.ICC_ApprovalTempate_Check("RE", "A", monthlyTotal);
                var list = rawResult.Select(x => new ApprovalTemplate
                {
                    AppStageCode = Convert.ToInt32(x.AppStageCode),
                    AppTemplateID = x.AppTemplateID,
                    TemplateDesc = x.TemplateDesc,
                    Type = x.Type.ToString(),
                    FromAmt = Convert.ToDecimal(x.FromAmt),
                    ToAmt = Convert.ToDecimal(x.ToAmt),
                    DocID = x.DocID,
                    NextApprover = x.NextApprover
                }).ToList();

                if (!list.Any())
                {
                    return Json(new { status = "Error: No approval template found.", LastEntry }, JsonRequestBehavior.AllowGet);
                }

                var AppTemplate = list.First();
                var trans = TransWithCommitted();

                using (trans)
                {
                    // Check if document already exists
                    var cn = db.CNDrafs.FirstOrDefault(a => a.DocEntry == header.DocEntry);
                    if (cn == null)
                    {

                        var origninalSO = detail[0].BaseEntry;

                        // Create new CN draft
                        header.CreatedDate = DateTime.Now;
                        header.ApprovalStage = AppTemplate.AppStageCode.ToString();
                        header.NextApprover = AppTemplate.NextApprover;
                        header.ApprovalTemplate = AppTemplate.AppTemplateID.ToString();

                        // Insert and save the header (this generates DocEntry)
                        db.CNDrafs.InsertOnSubmit(header);
                        db.SubmitChanges(); // Ensures DocEntry is created in DB

                        LastEntry = header.DocEntry; // Now safe to use

                        // Assign BaseEntry to all details
                        cn_inList.ForEach(a => a.DocEntry = LastEntry);

                        // Insert detail rows
                        db.CN1Drafs.InsertAllOnSubmit(cn_inList);
                        db.SubmitChanges(); // This will now work correctly



                        // Insert installment rows
                        detail.ForEach(a => a.BaseEntry = header.DocEntry);
                        db.CNInstallmentRowDrafs.InsertAllOnSubmit(detail);
                        db.SubmitChanges();

                        ar_inList.ForEach(a => a.BaseEntry = header.DocEntry);
                        db.CNInstallmentRowDrafs.InsertAllOnSubmit(ar_inList);
                        db.SubmitChanges();

                        // Update SO if exists
                        var so = db.SOs.FirstOrDefault(a => a.DocEntry == origninalSO);
                        if (so != null)
                        {
                            so.DocStatus = "Closed";
                            so.Frozenfor = "Y";
                            so.Comment = (so.Comment ?? "") + $", This SO was closed by Reprocessing number {header.DocEntry}";
                            db.SubmitChanges();
                        }
                        else
                        {
                            status = "Error: SO not found.";
                        }

                        // Generate Approval Document
                        var res = db.ICC_ApprovalDocument_Generate(AppTemplate.AppStageCode, header.DocEntry, "Reprocessing");
                        var resultValue = res.Select(x => x.Result).FirstOrDefault();

                        if (resultValue != "Success")
                        {
                            status = "Fail";
                        }


                        var link = "/amendments/PreviewReprocessing?DocEntry=" + LastEntry;

                        // For Update Generate approval ALERT Document Generate
                        var resut3 = db.ICC_ApprovalDocumentAlert_Generate(AppTemplate.AppStageCode, LastEntry, "Reprocessing", AppTemplate.AppTemplateID.ToString(), Session["UCode"].ToString(), link, header.NextApprover);

                        var list3 = resut3.Select(x => new ExcecResult
                        {
                            Result = x.Result

                        }).ToList();
                        var resultvalue3 = list3.FirstOrDefault();
                        if (resultvalue3.Result != "Success")
                        {
                            status = "Fail";
                        }

                    }

                    // Finalize transaction if everything is OK
                    if (status == "OK")
                    {
                        trans.Complete();
                    }
                }

                return Json(new { status, LastEntry }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // Log error here if needed
                return Json(new { status = "Failed", message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult PreviewReprocessing(int DocEntry)
        {

            ViewBag.installment = db.CNInstallmentRowDrafs
                .Where(x => x.BaseEntry == DocEntry)
                .OrderBy(x => x.PaymentDate)
                .ToList();

            ViewBag.Header = db.ICC_Get_List_Reprocessing_By_ID(DocEntry).ToList();
            ViewBag.Checkbutton = db.ICC_Approval_Check_EnableButton("Reprocessing", DocEntry, Session["UCode"].ToString()).ToList();
            return View();
        }


        public ActionResult PreviewRepocessingApproved(int DocEntry)
        {

            ViewBag.installment = db.CNInstallmentRows
                .Where(x => x.BaseEntry == DocEntry)
                .OrderBy(x => x.PaymentDate)
                .ToList();

            ViewBag.Header = db.ICC_Get_List_Repocessing_By_ID_Approved(DocEntry).ToList();
            ViewBag.Checkbutton = db.ICC_Approval_Check_EnableButton("Reprocessing", DocEntry, Session["UCode"].ToString()).ToList();
            return View();
        }

        public JsonResult save_approval_Reprocessing(SO header)
        {
            string status = "OK";
            int lastEntry = 0;

            try
            {
                using (var trans = TransWithCommitted())
                {
                    try
                    {
                        try
                        {
                            // For Update Generate approval Document Generate
                            var resut = db.ICC_Approval_ReprocessDraf_Submit_Doc(header.DocStatus, Session["UCode"].ToString(), header.DocEntry, header.Comment?.ToString() ?? "");

                            var list2 = resut.Select(x => new ExcecResult
                            {
                                Result = x.Result
                            }).ToList();
                            var resultvalue = list2.FirstOrDefault();
                            if (resultvalue.Result != "Success")
                            {
                                status = "Fail";
                            }
                        }
                        catch (Exception ex)
                        {
                            status = "Error";
                        }


                        if (status == "OK")
                        {
                            trans.Complete();
                            trans.Dispose();
                        }
                    }
                    catch (Exception ex)
                    {
                        status = "Error";
                        return Json(new { status, error = ex.Message });
                    }
                }
            }
            catch (Exception ex)
            {
                status = "Error";
                return Json(new { status, error = ex.Message });
            }

            return Json(new { status, lastEntry });
        }

        public JsonResult get_payment_schedule_changeitem_by_so(string soEntry, string rowStatus,string refer)
        {
            string sqltext = "exec ICC_AddOn_Installment_Table_For_ChangeItem '" + soEntry + "','" + rowStatus + "','" + refer + "'";
            List<Payment_Schedule> list = new List<Payment_Schedule>();
            list = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable()
                    select new Payment_Schedule()
                    {
                        ID = x["ID"].ToString(),
                        Remove = x["Remove"].ToString(),
                        Method = x["Method"].ToString(),
                        ItemCode = x["ItemCode"].ToString(),
                        ItemName = x["ItemName"].ToString(),
                        RowNo = x["RowNo"].ToString(),
                        MonthlyPay = x["MonthlyPay"].ToString(),
                        Principle = x["Principle"].ToString(),
                        Interest = x["Interest"].ToString(),
                        AccAmt = x["AccAmt"].ToString(),
                        RemainingAmt = x["RemainingAmt"].ToString(),
                        InstallmentDate = Convert.ToDateTime(x["InstallmentDate"].ToString()).ToString("dd-MMM-yyyy"),
                        DueDate = Convert.ToDateTime(x["DueDate"].ToString()).ToString("dd-MMM-yyyy"),
                        U_Period = x["U_Period"].ToString(),
                        U_AnnulRate = x["U_AnnulRate"].ToString(),
                        DepositAmt = x["DepositAmt"].ToString(),
                        CuInterest = x["CuInterest"].ToString(),
                        CuPayment = x["CuPayment"].ToString(),
                        BaseEntry = x["BaseEntry"].ToString(),
                        Status = x["Status"].ToString(),
                        BaseLine = x["BaseLine"].ToString(),
                        ARNo = x["ARNo"].ToString(),
                        PaymentNo = x["PaymentNo"].ToString(),
                        FixedPayment = x["FixedPayment"].ToString(),
                        HouseStatus = x["HouseStatus"].ToString(),
                        Remarks = x["Remarks"].ToString(),
                        CardCode = x["CardCode"].ToString(),
                        CardName = x["CardName"].ToString(),
                        DocNum = x["DocNum"].ToString(),
                        DocDate = Convert.ToDateTime(x["DocDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        DeliveryDate = Convert.ToDateTime(x["DueDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        OcrCode = x["OcrCode"].ToString(),
                        OcrCode2 = x["OcrCode2"].ToString(),
                        OcrCode3 = x["OcrCode3"].ToString(),
                        HouseAmount = x["HouseAmount"].ToString(),
                        DiscountAmount = x["DiscountAmount"].ToString(),
                        DiscountPer = x["DiscountPer"].ToString(),
                        SpecialDisAmount = x["SpecialDisAmount"].ToString(),
                        SpecialDisPer = x["SpecialDisPer"].ToString(),
                        InstallmentAmt = x["InstallmentAmt"].ToString(),
                        DocStatus = x["DocStatus"].ToString(),
                        PaidDate = x["PaidDate"].ToString() == "" ? "" : Convert.ToDateTime(x["PaidDate"].ToString()).Date.ToString("dd-MMM-yyyy"),
                        PaidAmt = x["PaidAmt"].ToString(),

                        NewItemCode = x["NewItemCode"].ToString(),
                        NewItemName = x["NewItemName"].ToString(),
                        BuybackAmt = x["BuybackAmt"].ToString(),
                        GeneratedARAmt = x["GeneratedARAmt"].ToString(),
                        OutstandingAmt = x["OutstandingAmt"].ToString(),
                        VarianAmt = x["VarianAmt"].ToString(),
                        DistNumber = x["SerialNo"].ToString(),
                        HiglightStatus = x["HiglightStatus"].ToString()
                    }).ToList();
            var data = list.Select(x => new {
                x.ID,
                x.Remove,
                x.Method,
                x.ItemCode,
                x.ItemName,
                x.RowNo,
                x.MonthlyPay,
                x.Principle,
                x.Interest,
                x.AccAmt,
                x.RemainingAmt,
                x.InstallmentDate,
                x.DueDate,
                x.U_Period,
                x.U_AnnulRate,
                x.DepositAmt,
                x.CuInterest,
                x.CuPayment,
                x.BaseEntry,
                x.Status,
                x.BaseLine,
                x.ARNo,
                x.PaymentNo,
                x.FixedPayment,
                x.HouseStatus,
                x.Remarks,
                x.CardCode,
                x.CardName,
                x.DocNum,
                x.DocDate,
                x.DeliveryDate,
                x.OcrCode,
                x.OcrCode2,
                x.OcrCode3,
                x.HouseAmount,
                x.DiscountAmount,
                x.DiscountPer,
                x.SpecialDisAmount,
                x.SpecialDisPer,
                x.InstallmentAmt,
                x.DocStatus,
                x.PaidDate,
                x.PaidAmt,
                x.NewItemCode,
                x.NewItemName,
                x.BuybackAmt,
                x.GeneratedARAmt,
                x.OutstandingAmt,
                x.VarianAmt,
                x.DistNumber,
                x.HiglightStatus
            }).ToList();
            return Json(new
            {
                status = status,
                data = data,
            });
        }
    }
}