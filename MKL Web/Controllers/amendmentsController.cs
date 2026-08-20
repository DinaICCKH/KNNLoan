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
    public class amendmentsController : Controller
    {
        // GET: amendments
        private MKLDataContext db = null;
        private string status = "OK";
        public TransactionScope TransWithCommitted()
        {
            return new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = System.Transactions.IsolationLevel.ReadCommitted });
        }
        public amendmentsController()
        {
            db = new MKLDataContext(ConfigurationManager.AppSettings["sql"].ToString());
        }
        public ActionResult ChangeSchedule()
        {
            var soList = db.SOs.Where(a=>a.DocStatus=="Sold").ToList();
            ViewBag.cust = db.v_OCRDs.Where(x => x.cardtype == 'C' && soList.Select(a=>a.CardCode).Contains(x.CardCode)).ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();
            return View();
        }
        public ActionResult ChangeOwner()
        {
            var soList = db.SOs.Where(a => a.Reason == "SLD").ToList();
            ViewBag.cust = db.v_OCRDs.Where(x => x.cardtype == 'C' && soList.Select(a => a.CardCode).Contains(x.CardCode)).ToList();
            ViewBag.custNew = db.v_OCRDs.Where(x => x.cardtype == 'C').ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();
            return View();
        }
        public ActionResult ChangeHouse()
        {
            //var soList = db.SOs.Where(a => a.ChangeReason == "ChangingProduct").ToList();
            var soList = db.SOs.ToList();
            ViewBag.cust = db.v_OCRDs.Where(x => x.cardtype == 'C' && soList.Select(a => a.CardCode).Contains(x.CardCode)).ToList();
            ViewBag.houselist = db.v_Item_Houses.ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();
            ViewBag.BankList = db.ICC_BankLists.ToList();   // change table name if different
            return View();
        }

        public ActionResult EditChangeOwner(int DocEntry)
        {
            ViewBag.Checkbutton = db.ICC_Approval_Check_EnableButton("ChangeOwner",DocEntry, Session["UCode"].ToString()).ToList();
            ViewBag.HeaderChangeOwner = db.ICC_Get_List_Approval_ChangeOwnerDraf_By_ID(DocEntry).ToList();

            return View();
        }

        public ActionResult Penalty()
        {
            var soList = db.SOs.Where(a => a.ChangeReason == "ChangingProduct").ToList();
            //ViewBag.cust = db.v_OCRDs.Where(x => x.cardtype == 'C' && soList.Select(a => a.CardCode).Contains(x.CardCode)).ToList();

            ViewBag.cust = db.v_OCRD_Penalties.ToList();
            ViewBag.houselist = db.v_Item_Houses.ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();
            ViewBag.panaltyoption=db.ICC_GET_Penalty_Option().ToList();

            ViewBag.Waiveoption = db.ICC_GET_Waive_Option().ToList();
            return View();
        }

        public ActionResult ChangePrice()
        {
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.houseother = db.v_HouseOthers.ToList();
            return View();
        }

        public ActionResult ChangeOwnerApporovalListing(
             string Status,
             DateTime? fdate,
             DateTime? tdate,
             string Item,
             string Serial,
             string Customer
        )
        {
            // Default values (match stored procedure logic)
            Status = string.IsNullOrEmpty(Status) ? "Draf" : Status;

            DateTime fromDate = fdate ?? new DateTime(1999, 1, 1);
            DateTime toDate = tdate ?? new DateTime(1999, 1, 1);

            Item = Item ?? string.Empty;
            Serial = Serial ?? string.Empty;
            Customer = Customer ?? string.Empty;

            ViewBag.ChangeOwnerApporovalListing =
                db.ICC_Get_List_Approval_ChangeOwner(
                    Status,
                    fromDate,
                    toDate,
                    Item,
                    Serial,
                    Customer
                ).ToList();

            return View();
        }




        public ActionResult AccraulPenaltyListing(
            string Status = "D",
            DateTime? fdate = null,
            DateTime? tdate = null,
            string Item = "",
            string Serial = "",
            string Customer = "",
            string Frozen = "",
            int page = 1,           // Page number for paging
            int pageSize = 50       // Rows per page
        )
        {
            // Use default date if null
            DateTime fromDate = fdate ?? new DateTime(1999, 1, 1);
            DateTime toDate = tdate ?? new DateTime(1999, 1, 1);

            // Call stored procedure with paging
            var result = db.ICC_Get_List_PenaltyDraf_Accraul(
                Status ?? "D",
                fromDate,
                toDate,
                Item ?? "",
                Serial ?? "",
                Customer ?? "",
                Frozen ?? "",
                page,
                pageSize
            ).ToList();

            ViewBag.AccraulPenaltyListing = result;
            ViewBag.PageNumber = page;
            ViewBag.PageSize = pageSize;

            return View();
        }


        public ActionResult PenaltyApporovalListing(
             string Status = "Draf",
             DateTime? fdate = null,
             DateTime? tdate = null,
             string CreateBy = "",
             string Serial = "",
             string Customer = "")
        {
            // Use default date if null
            DateTime fromDate = fdate ?? new DateTime(1999, 1, 1);
            DateTime toDate = tdate ?? new DateTime(1999, 1, 1);

            var result = db.ICC_Get_List_Approval_Penalty(
                Status ?? "Draf",
                fromDate,
                toDate,
                CreateBy ?? "",
                Serial ?? "",
                Customer ?? ""
            ).ToList();

            ViewBag.ApprovalPenaltyListing = result;

            return View();
        }


        public JsonResult save_change_owner(SO header, List<InstallmentRow> installment_row, List<InstallmentRow> del_list)
        {
            string status = "OK";
            string message = "Success";
            int LastEntry = 0;

            if (header == null)
            {
                return Json(new { status = "Error", LastEntry, message = "Error while saving: Header is null" }, JsonRequestBehavior.AllowGet);
            }

            try
            {
                using (var trans = TransWithCommitted())
                {
                    using (trans)
                    {
                        // 1. Get Monthly Total & Approval Template
                        var monthlyTotal = installment_row?.Sum(x => x.Monthly) ?? 0;
                        var rawResult = db.ICC_ApprovalTempate_Check("CO", "A", monthlyTotal);

                        var list = rawResult.Select(x => new ApprovalTemplate
                        {
                            AppStageCode = Convert.ToInt32(x.AppStageCode),
                            AppTemplateID = x.AppTemplateID,
                            TemplateDesc = x.TemplateDesc,
                            Type = x.Type.ToString(),
                            FromAmt = Convert.ToDecimal(x.FromAmt),
                            ToAmt = Convert.ToDecimal(x.ToAmt),
                            DocID = x.DocID
                        }).ToList();

                        // 2. Check Unpaid Principal AR
                        var unpaidInvoices = db.InstallmentRows
                            .Where(x => ((x.ARNo != -1 && x.PaymentNo == -1) || (x.ARNo == -1 && x.PaymentNo != -1))
                                        && x.BaseEntry == header.DocEntry)
                            .ToList();

                        if (unpaidInvoices.Any())
                        {
                            return Json(new
                            {
                                status = "Error",
                                LastEntry,
                                message = "Error: Cancel Generated AR Invoice that not yet paid in SAP first before change owner."
                            }, JsonRequestBehavior.AllowGet);
                        }

                        // 3. Check Unpaid Interest AR
                        var checkInterest = db.InstallmentRows
                            .Where(x => ((x.ARNoInterest != -1 && x.PaymentNoInterest == -1) || (x.ARNoInterest == -1 && x.PaymentNoInterest != -1))
                                        && x.BaseEntry == header.DocEntry)
                            .ToList();

                        if (checkInterest.Any())
                        {
                            return Json(new
                            {
                                status = "Error",
                                LastEntry,
                                message = "Error: Cancel Generated AR Invoice interest that not yet paid in SAP first before change owner."
                            }, JsonRequestBehavior.AllowGet);
                        }

                        // 4. Check if Template Exists
                        if (!list.Any())
                        {
                            return Json(new
                            {
                                status = "Error",
                                LastEntry,
                                message = "Error: No approval template found."
                            }, JsonRequestBehavior.AllowGet);
                        }

                        var appTemplate = list.First();

                        // 5. Generate Draft Document
                        var result3 = db.ICC_ApprovalAddtoDrafChangeOwner(
                            "ChangeOwner",
                            header.DocEntry,
                            header.OldCardCode,
                            header.OldCardName,
                            header.CardCode,
                            header.CardName,
                            appTemplate.AppStageCode,
                            appTemplate.AppTemplateID,
                            header.CreatedBy,
                            header.Comment?.ToString() ?? "",
                            header.PhoneNo?.ToString() ?? "",
                            header.ContactPerson?.ToString() ?? "",
                            header.ItemCode,
                            header.ItemName,
                            header.Serial
                        );

                        var list3 = result3.Select(x => new ExcecResult
                        {
                            Result = x.Result,
                            AutoGenerateID = Convert.ToInt32(x.AutoGenerateID)
                        }).ToList();

                        var resultValue3 = list3.FirstOrDefault();

                        if (resultValue3 == null || resultValue3.Result != "Success")
                        {
                            return Json(new
                            {
                                status = "Fail",
                                LastEntry,
                                message = resultValue3?.Result ?? "Error during draft generation."
                            }, JsonRequestBehavior.AllowGet);
                        }

                        // 6. Update Approval Document Generation
                        var resut = db.ICC_ApprovalDocument_Generate(appTemplate.AppStageCode, resultValue3.AutoGenerateID, "ChangeOwner");
                        var list2 = resut.Select(x => new ExcecResult { Result = x.Result }).ToList();
                        var resultValue = list2.FirstOrDefault();

                        if (resultValue == null || resultValue.Result != "Success")
                        {
                            return Json(new
                            {
                                status = "Fail",
                                LastEntry,
                                message = resultValue?.Result ?? "Error during approval document generation."
                            }, JsonRequestBehavior.AllowGet);
                        }

                        // 7. Update SO Record
                        var sO = db.SOs.FirstOrDefault(a => a.DocEntry == header.DocEntry);
                        if (sO != null)
                        {
                            sO.LastError = $"This document is linked with pending approve Changer Owner draft No: {resultValue3.AutoGenerateID} -> Reference: {header.DocEntry}";
                            sO.Frozenfor = "Y";

                            db.SOs.Context.SubmitChanges();
                        }
                        else
                        {
                            return Json(new
                            {
                                status = "Error",
                                LastEntry,
                                message = "Error while saving data: SO document not found."
                            }, JsonRequestBehavior.AllowGet);
                        }

                        // 8. Commit Transaction
                        trans.Complete();
                    }
                }
            }
            catch (Exception ex)
            {
                status = "Failed";
                message = ex.Message;
            }

            return Json(new { status, LastEntry, message }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult save_change_price(List<ChangePrice> pr_List)
        {
            status = "OK";
            int LastEntry = 0;
            if (status == "OK")
            {
                var trans = TransWithCommitted();
                try
                {
                    if (pr_List != null)
                    {
                        using (trans)
                        {
                            pr_List.ForEach(a => a.UpdatedDate = DateTime.Now);
                            db.ChangePrices.InsertAllOnSubmit(pr_List);
                            db.ChangePrices.Context.SubmitChanges();
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
            return Json(new { status = status, LastEntry = LastEntry }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult save_approval_changeowner(SO header)
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
                            var resut = db.ICC_Approval_ChangeOwner_Submit_Doc(header.DocStatus, Session["UCode"].ToString(), header.DocEntry, header.Comment?.ToString() ?? "");

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
                        catch(Exception ex)
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

        public JsonResult get_penalty_drafList(string Customer, DateTime ToDueDate, decimal WaiveOption)
        {
            string sqltext = "exec ICC_Get_List_Penalty_Draf '" + Customer + "','" + ToDueDate + "','" + WaiveOption + "'";

            List<PenaltyGenerateTable> list = new List<PenaltyGenerateTable>();

            list = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable()
                    select new PenaltyGenerateTable()
                    {
                        CardCode = x["CardCode"] != DBNull.Value ? x["CardCode"].ToString() : "",
                        CardName = x["CardName"] != DBNull.Value ? x["CardName"].ToString() : "",
                        ItemCode = x["ItemCode"] != DBNull.Value ? x["ItemCode"].ToString() : "",
                        ItemName = x["ItemName"] != DBNull.Value ? x["ItemName"].ToString() : "",
                        Comment = x["Comment"] != DBNull.Value ? x["Comment"].ToString() : "",
                        SerialNo = x["SerialNo"] != DBNull.Value ? x["SerialNo"].ToString() : "",

                        InstallmentRow = x["InstallmentRow"] != DBNull.Value ? Convert.ToInt32(x["InstallmentRow"]) : 0,
                        InstallmentID = x["InstallmentID"] != DBNull.Value ? Convert.ToInt32(x["InstallmentID"]) : 0,

                        FromPaymentDate = x["FromPaymentDate"] != DBNull.Value ? Convert.ToDateTime(x["FromPaymentDate"]).ToString("dd-MMM-yyyy") : "",
                        TOPaymentDate = x["TOPaymentDate"] != DBNull.Value ? Convert.ToDateTime(x["TOPaymentDate"]).ToString("dd-MMM-yyyy") : "",

                        CHQAmt = x["CHQAmt"] != DBNull.Value ? Convert.ToDecimal(x["CHQAmt"]) : 0,
                        PrincipleAmt = x["PrincipleAmt"] != DBNull.Value ? Convert.ToDecimal(x["PrincipleAmt"]) : 0,
                        PenaltyPercent = x["PenaltyPercent"] != DBNull.Value ? Convert.ToDecimal(x["PenaltyPercent"]) : 0,

                        TotalOverDay = x["TotalOverDay"] != DBNull.Value ? Convert.ToInt32(x["TotalOverDay"]) : 0,
                        TotalPenalty = x["TotalPenalty"] != DBNull.Value ? Convert.ToDecimal(x["TotalPenalty"]) : 0,
                        TotalWaiveAmt = x["TotalWaiveAmt"] != DBNull.Value ? Convert.ToDecimal(x["TotalWaiveAmt"]) : 0,
                        TotalNetAmt = x["TotalNetAmt"] != DBNull.Value ? Convert.ToDecimal(x["TotalNetAmt"]) : 0,
                        OcrCode = x["OcrCode"] != DBNull.Value ? x["OcrCode"].ToString() : "",
                        OcrCode2 = x["OcrCode2"] != DBNull.Value ? x["OcrCode2"].ToString() : "",
                        OcrCode3 = x["OcrCode3"] != DBNull.Value ? x["OcrCode3"].ToString() : "",
                        OcrCode4 = x["OcrCode4"] != DBNull.Value ? x["OcrCode4"].ToString() : "",
                        OcrCode5 = x["OcrCode5"] != DBNull.Value ? x["OcrCode5"].ToString() : "",

                        Status = x["Status"] != DBNull.Value ? x["Status"].ToString() : "",
                        ApprovalTemplate = x["ApprovalTemplate"] != DBNull.Value ? x["ApprovalTemplate"].ToString() : "",
                        ApprovalDate = x["ApprovalDate"] != DBNull.Value ? Convert.ToDateTime(x["ApprovalDate"]).ToString("dd-MMM-yyyy") : "",
                        LastApproval = x["LastApproval"] != DBNull.Value ? x["LastApproval"].ToString() : "",

                        WaiveName = x["WaiveName"] != DBNull.Value ? x["WaiveName"].ToString() : "",
                        ApplyPercent = x["ApplyPercent"] != DBNull.Value ? Convert.ToDecimal(x["ApplyPercent"]) : 0,

                        IDs = x["IDs"] != DBNull.Value ? x["IDs"].ToString() : "",
                        Remark =""
                    }).ToList();

            var data = list.Select(x => new
            {
                x.CardCode,
                x.CardName,
                x.ItemCode,
                x.ItemName,
                x.Comment,
                x.SerialNo,
                x.InstallmentRow,
                x.InstallmentID,
                x.FromPaymentDate,
                x.TOPaymentDate,
                x.CHQAmt,
                x.PrincipleAmt,
                x.PenaltyPercent,
                x.TotalOverDay,
                x.TotalPenalty,
                x.TotalWaiveAmt,
                x.TotalNetAmt,
                x.OcrCode,
                x.OcrCode2,
                x.OcrCode3,
                x.OcrCode4,
                x.OcrCode5,
                x.Status,
                x.ApprovalTemplate,
                x.ApprovalDate,
                x.LastApproval,
                x.WaiveName,
                x.ApplyPercent,
                x.IDs,
                x.Remark
            }).ToList();

            string status = "success";

            return Json(new
            {
                status = status,
                data = data,
            });
        }


        public JsonResult save_penalty_wizard(PenaltyWizardH header, List<PenaltyWizard> rows)
        {
            status = "OK";
            int LastEntry = 0;
            string message = "Success";

            if (status == "OK")
            {
                var trans = TransWithCommitted();
                try
                {
                    if (header != null)
                    {
                        using (trans)
                        {

                            var resultHeader = db.ICC_Notification_PostingPeriod(header.PenaltyDate, "Header");

                            var checkHeader = resultHeader.FirstOrDefault();

                            if (checkHeader != null && checkHeader.Code == 0)
                            {
                                return Json(new
                                {
                                    status = checkHeader.Message,
                                    LastEntry = 0,
                                    message = checkHeader.Message,
                                }, JsonRequestBehavior.AllowGet);
                            }

                            var rawResult = db.ICC_ApprovalTempate_Check("PE", header.WaiveOption, 0);

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
                                status = "Error";
                                message = "Error: No approval template found.";
                                return Json(new { status, LastEntry,message }, JsonRequestBehavior.AllowGet);
                            }
                            else
                            {

                                var AppTemplate = list.FirstOrDefault();
                                if (AppTemplate != null)
                                {
                                    int AppStageCode = AppTemplate.AppStageCode;
                                    int AppTemplateID = AppTemplate.AppTemplateID;
                                    string TemplateDesc = AppTemplate.TemplateDesc;
                                    string Type = AppTemplate.Type;
                                    decimal FromAmt = AppTemplate.FromAmt;
                                    decimal ToAmt = AppTemplate.ToAmt;
                                    string DocID = AppTemplate.DocID;
                                    string NextApprover = AppTemplate.NextApprover;

                                    if (header == null || rows == null)
                                    {
                                        status = "blank";
                                        message = "Error: Blank Data.";
                                    }
                                    else
                                    {
                                        PenaltyWizardH H = new PenaltyWizardH();
                                        H = db.PenaltyWizardHs.Where(a => a.DocEntry == header.DocEntry).FirstOrDefault();
                                        if (H == null)
                                        {
                                            H = header;
                                            H.PenaltyDate = header.PenaltyDate;
                                            H.CreateDate = DateTime.Now;
                                            H.UpdateDate = DateTime.Now;
                                            H.CreateBy = Session["UCode"].ToString();
                                            H.DocNumRef = header.DocNumRef;
                                            H.Remark = header.Remark;
                                            H.WaiveOption = header.WaiveOption;
                                            H.ApprovalStage = AppStageCode.ToString();
                                            H.NextApprover = NextApprover;
                                            H.Status = "Draf";
                                            H.ApprovalTemplate = AppTemplateID.ToString();
                                            db.PenaltyWizardHs.InsertOnSubmit(H);
                                            db.PenaltyWizardHs.Context.SubmitChanges();

                                            LastEntry = H.DocEntry;

                                            List<PenaltyWizard> d = new List<PenaltyWizard>();
                                            rows.ForEach(a => a.DocEntry = H.DocEntry);
                                            d = rows;
                                            db.PenaltyWizards.InsertAllOnSubmit(d);
                                            db.PenaltyWizards.Context.SubmitChanges();

                                            // 1. Get all semicolon-separated Accrual IDs
                                            var accrualStrings = rows.Select(r => r.AccraulID).ToList(); // may contain "112;123;863;"

                                            // 2. Split by ';', remove empty entries, convert to int
                                            var accrualIDs = accrualStrings
                                                .SelectMany(s => s.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries))
                                                .Select(id => int.Parse(id))   // or Convert.ToInt32(id)
                                                .ToList();

                                            // 3. Fetch PenaltyDrafts matching those IDs
                                            var penaltyDrafts = db.PenaltyDrafts.Where(a => accrualIDs.Contains(a.ID)).ToList();

                                            if (penaltyDrafts.Any())
                                            {
                                                foreach (var pD in penaltyDrafts)
                                                {
                                                    pD.ProzenforRemark = "This document is linked with pending approve penalty draft No: " + LastEntry + " -> Reference: " + header.DocNumRef;
                                                    pD.Frozenfor = "Y";
                                                }

                                                db.PenaltyDrafts.Context.SubmitChanges(); // Commit all changes
                                            }
                                            else
                                            {
                                                status = "Error";
                                                message = "Error: Blank Data.";
                                            }


                                        }

                                        // For Update Generate approval Document Generate
                                        var resut = db.ICC_ApprovalDocument_Generate(AppStageCode, LastEntry, "PenaltyWizard");

                                        var list2 = resut.Select(x => new ExcecResult
                                        {
                                            Result = x.Result

                                        }).ToList();
                                        var resultvalue = list2.FirstOrDefault();
                                        if (resultvalue.Result != "Success")
                                        {
                                            status = "Fail";
                                            message = "Error: While saving the approval data.";
                                        }
                                    }


                                    if (status == "OK")
                                    {
                                        trans.Complete();
                                        trans.Dispose();
                                    }
                                    else
                                    {
                                        status = "Error";
                                        message = "Error: Blank Data.";
                                    }

                                }

                            }
                        }
                    }
                    else
                    {
                        status = "Error";
                        message = "Error: Blank Data.";
                    }
                }
                catch (Exception ex)
                {
                    status = "Failed";
         
                    message = ex.Message;
                }
            }
            return Json(new { status = status, LastEntry = LastEntry,message }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult EditPenaltyDraf(int DocEntry)
        {

            ViewBag.Checkbutton = db.ICC_Approval_Check_EnableButton("PenaltyDraf", DocEntry, Session["UCode"].ToString()).ToList();
            ViewBag.Header = db.ICC_Get_List_Approval_PenaltyDraf_By_ID(DocEntry).ToList();

            return View();
        }

        public JsonResult save_approval_penaltyDraft(SO header)
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
                            var resut = db.ICC_Approval_PenaltyDraf_Submit_Doc (header.DocStatus, Session["UCode"].ToString(), header.DocEntry, header.Comment?.ToString() ?? "");

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

        public ActionResult Restructure()
        {
            var soList = db.SOs.Where(a => a.DocStatus == "Sold").ToList();
            ViewBag.BankList = db.ICC_BankLists.ToList();   // change table name if different
            ViewBag.cust = db.v_OCRDs.Where(x => x.cardtype == 'C' && soList.Select(a => a.CardCode).Contains(x.CardCode)).ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.block = db.v_CostCenters.Where(x => x.DimCode == 2).ToList();
            ViewBag.installment = db.InstallmentLists.Where(x => x.InsCode != "B").ToList();
            return View();
        }


        public JsonResult save_RestructurePeriod(InstallmentRowDrafH header, List<InstallmentRowDraf> installment_row)
        {
            string status = "OK";
            string message = "OK";
            int LastEntry = 0;

            if (header == null)
                return Json(new { status = "Error: Header is null.", LastEntry ,message="Error"}, JsonRequestBehavior.AllowGet);

            var trans = TransWithCommitted();

            try
            {
                using (trans)
                {

                    // For check the posting period 
                    // Check Posting Period

                    var resultHeader = db.ICC_Notification_PostingPeriod(header.PostingDate, "Header");

                    var checkHeader = resultHeader.FirstOrDefault();

                    if (checkHeader != null && checkHeader.Code == 0)
                    {
                        return Json(new
                        {
                            status = checkHeader.Message,
                            LastEntry = 0,
                            message = checkHeader.Message,
                        }, JsonRequestBehavior.AllowGet);
                    }

                    foreach (var item in installment_row.Where(x => x.ARNo == -1))
                    {
                        if (!item.PaymentDate.HasValue)
                            continue;

                        var resultRow = db.ICC_Notification_PostingPeriod(item.PaymentDate.Value, "Row");

                        var check = resultRow.FirstOrDefault();

                        if (check != null && check.Code == 0)
                        {
                            return Json(new
                            {
                                status = check.Message,
                                LastEntry = 0,
                                message = check.Message,
                            }, JsonRequestBehavior.AllowGet);
                        }
                    }

                    int baseEntry = installment_row.FirstOrDefault()?.BaseEntry ?? 0;

                    var result = db.ICC_NOTIFICATION_FOR_CHANGE_SCHEDULE(baseEntry).FirstOrDefault();

                    if (result != null)
                    {
                        return Json(new
                        {
                            status = "Warning",
                            message = $"Loan {header.DocEntry} cannot be restructured because there are still open invoices: {result.DocNums}"
                        }, JsonRequestBehavior.AllowGet);
                    }
                    

                    // For Get Approval Template 
                    var monthlyTotal = installment_row.Sum(x => x.Monthly);
                    // Get approval template
                    var rawResult = db.ICC_ApprovalTempate_Check("RS", "A", monthlyTotal);

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
                        status = "Error";
                        message = "Error: No approval template found.";
                        return Json(new { status, LastEntry,message }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {

                        var AppTemplate = list.FirstOrDefault();
                        if (AppTemplate != null)
                        {
                            int AppStageCode = AppTemplate.AppStageCode;
                            int AppTemplateID = AppTemplate.AppTemplateID;
                            string TemplateDesc = AppTemplate.TemplateDesc;
                            string Type = AppTemplate.Type;
                            decimal FromAmt = AppTemplate.FromAmt;
                            decimal ToAmt = AppTemplate.ToAmt;
                            string DocID = AppTemplate.DocID;
                            string NextApprover = AppTemplate.NextApprover;

                            if (header == null || installment_row == null)
                            {
                                status = "blank";
                            }
                            else
                            {
                                InstallmentRowDrafH H = new InstallmentRowDrafH();
                                H = db.InstallmentRowDrafHs.Where(a => a.DocEntry == header.DocEntry).FirstOrDefault();
                                if (H == null)
                                {
                                    H = header;
                                    H.PostingDate = header.PostingDate;
                                    H.CreateDate = DateTime.Now;
                                    H.UpdateDate = DateTime.Now;
                                    H.CreateBy = Session["UCode"].ToString();
                                    H.DocNumRef = header.DocNumRef;
                                    H.Remark = header.Remark;
                                    H.RestructureOption = header.RestructureOption;
                                    H.ApprovalStage = AppStageCode.ToString();
                                    H.NextApprover = NextApprover;
                                    H.Status = "Draf";
                                    H.ApprovalTemplate = AppTemplateID.ToString();
                                    H.DocType = "RS";
                                    db.InstallmentRowDrafHs.InsertOnSubmit(H);
                                    db.InstallmentRowDrafHs.Context.SubmitChanges();

                                    LastEntry = H.DocEntry;

                                    List<InstallmentRowDraf> d = new List<InstallmentRowDraf>();
                                    installment_row.ForEach(a => a.DocEntry = H.DocEntry);
                                    d = installment_row;
                                    db.InstallmentRowDrafs.InsertAllOnSubmit(d);
                                    db.InstallmentRowDrafs.Context.SubmitChanges();

                                    /// This will be used to update the status of Accrual penalty
                                    var accrualIDs = installment_row.Select(r => r.BaseEntry).ToList();

                                    var sO = db.SOs.FirstOrDefault(a => accrualIDs.Contains(a.DocEntry));

                                    if (sO != null)
                                    {
                                        sO.LastError = "This document is linked with pending approve Restructure draft No: " + LastEntry + " -> Reference: " + header.DocNumRef;
                                        sO.Frozenfor = "Y";

                                        db.SOs.Context.SubmitChanges(); // Commit change
                                    }
                                    else
                                    {
                                        status = "Error";
                                        message = "Save to Draft Fail.";
                                    }
                                }


                                // For Update Generate approval Document Generate
                                var resut = db.ICC_ApprovalDocument_Generate(AppStageCode, LastEntry, "Restructure");

                                var list2 = resut.Select(x => new ExcecResult
                                {
                                    Result = x.Result

                                }).ToList();
                                var resultvalue = list2.FirstOrDefault();
                                if (resultvalue.Result != "Success")
                                {
                                    status = "Fail";
                                    message = "Save to approval step Fail.";
                                }

                                var link = "/amendments/PreviewRestructure?DocEntry=" + LastEntry;

                                // For Update Generate approval ALERT Document Generate
                                var resut3 = db.ICC_ApprovalDocumentAlert_Generate(AppStageCode, LastEntry, "Restructure", AppTemplateID.ToString(), Session["UCode"].ToString(), link, NextApprover);

                                var list3 = resut3.Select(x => new ExcecResult
                                {
                                    Result = x.Result

                                }).ToList();
                                var resultvalue3 = list3.FirstOrDefault();
                                if (resultvalue3.Result != "Success")
                                {
                                    status = "Fail";
                                    message = "Save to alert Fail.";
                                }

                            }


                            if (status == "OK")
                            {
                                trans.Complete();
                                trans.Dispose();
                            }
                            else
                            {
                                status = "Error";
                                message = "Error while saving the record";
                            }

                        }

                    }
                }
            }
            catch (Exception ex)
            {
                status = "Failed";
                message = ex.Message;
                // Optionally log ex.Message or ex.ToString() to file or database
            }

            return Json(new { status, LastEntry,message }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RestructureApporovalListing(
            string Status = "Draf",
            DateTime? fdate = null,
            DateTime? tdate = null,
            string CreateBy = "",
            string Serial = "",
            string Customer = "")
        {
            // Use default date if null
            DateTime fromDate = fdate ?? new DateTime(1999, 1, 1);
            DateTime toDate = tdate ?? new DateTime(1999, 1, 1);

            var result = db.ICC_Get_List_Approval_Restructure(
                Status ?? "Draf",
                fromDate,
                toDate,
                CreateBy ?? "",
                Serial ?? "",
                Customer ?? ""
            ).ToList();

            ViewBag.ApprovalRestructureListing = result;

            return View();
        }

        public ActionResult PreviewRestructure(int DocEntry)
        {

            ViewBag.installment = db.InstallmentRowDrafs.Where(x => x.DocEntry == DocEntry).ToList();
            ViewBag.Header = db.ICC_Get_List_Restructure_By_ID(DocEntry).ToList();
            ViewBag.Checkbutton = db.ICC_Approval_Check_EnableButton("Restructure", DocEntry, Session["UCode"].ToString()).ToList();

            return View();
        }


        public JsonResult save_approval_RestructureDraf(SO header)
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
                            var resut = db.ICC_Approval_RestructureDraf_Submit_Doc(header.DocStatus, Session["UCode"].ToString(), header.DocEntry, header.Comment?.ToString() ?? "");

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

        public JsonResult save_RestructureAmt(InstallmentRowDrafH header, List<InstallmentRowDraf> installment_row)
        {
            string status = "OK";
            int LastEntry = 0;

            if (header == null)
                return Json(new { status = "Error: Header is null.", LastEntry }, JsonRequestBehavior.AllowGet);

            var trans = TransWithCommitted();

            try
            {
                using (trans)
                {


                    // For check the posting period 
                    // Check Posting Period

                    var resultHeader = db.ICC_Notification_PostingPeriod(header.PostingDate, "Header");

                    var checkHeader = resultHeader.FirstOrDefault();

                    if (checkHeader != null && checkHeader.Code == 0)
                    {
                        return Json(new
                        {
                            status = checkHeader.Message,
                            LastEntry = 0,
                            message = checkHeader.Message,
                        }, JsonRequestBehavior.AllowGet);
                    }

                    foreach (var item in installment_row.Where(x => x.ARNo == -1))
                    {
                        if (!item.PaymentDate.HasValue)
                            continue;

                        var resultrow = db.ICC_Notification_PostingPeriod(item.PaymentDate.Value, "Row");

                        var check = resultrow.FirstOrDefault();

                        if (check != null && check.Code == 0)
                        {
                            return Json(new
                            {
                                status = check.Message,
                                LastEntry = 0,
                                message = check.Message,
                            }, JsonRequestBehavior.AllowGet);
                        }
                    }
                    // For check notification clean all related document from loan before can change it 

                    int baseEntry = installment_row.FirstOrDefault()?.BaseEntry ?? 0;

                    var result = db.ICC_NOTIFICATION_FOR_CHANGE_SCHEDULE(baseEntry).FirstOrDefault();

                    if (result != null)
                    {
                        return Json(new
                        {
                            status = "Warning",
                            message = $"Loan {header.DocEntry} cannot be restructured because there are still open invoices: {result.DocNums}"
                        }, JsonRequestBehavior.AllowGet);
                    }

                    // For Get Approval Template 
                    var monthlyTotal = installment_row.Sum(x => x.Monthly);
                    // Get approval template
                    var rawResult = db.ICC_ApprovalTempate_Check("RS", "A", monthlyTotal);

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
                        status = "Error: No approval template found.";
                        return Json(new { status, LastEntry }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {

                        var AppTemplate = list.FirstOrDefault();
                        if (AppTemplate != null)
                        {
                            int AppStageCode = AppTemplate.AppStageCode;
                            int AppTemplateID = AppTemplate.AppTemplateID;
                            string TemplateDesc = AppTemplate.TemplateDesc;
                            string Type = AppTemplate.Type;
                            decimal FromAmt = AppTemplate.FromAmt;
                            decimal ToAmt = AppTemplate.ToAmt;
                            string DocID = AppTemplate.DocID;
                            string NextApprover = AppTemplate.NextApprover;

                            if (header == null || installment_row == null)
                            {
                                status = "blank";
                            }
                            else
                            {
                                InstallmentRowDrafH H = new InstallmentRowDrafH();
                                H = db.InstallmentRowDrafHs.Where(a => a.DocEntry == header.DocEntry).FirstOrDefault();
                                if (H == null)
                                {
                                    H = header;
                                    H.PostingDate = header.PostingDate;
                                    H.CreateDate = DateTime.Now;
                                    H.UpdateDate = DateTime.Now;
                                    H.CreateBy = Session["UCode"].ToString();
                                    H.DocNumRef = header.DocNumRef;
                                    H.Remark = header.Remark;
                                    H.RestructureOption = header.RestructureOption;
                                    H.ApprovalStage = AppStageCode.ToString();
                                    H.NextApprover = NextApprover;
                                    H.Status = "Draf";
                                    H.ApprovalTemplate = AppTemplateID.ToString();
                                    H.Rate = header.Rate;
                                    H.PeriodM = header.PeriodM;
                                    H.StartPayDate = header.StartPayDate;
                                    H.MaturityDate = header.MaturityDate;
                                    H.DocType = "RS";
                                    db.InstallmentRowDrafHs.InsertOnSubmit(H);
                                    db.InstallmentRowDrafHs.Context.SubmitChanges();

                                    LastEntry = H.DocEntry;

                                    List<InstallmentRowDraf> d = new List<InstallmentRowDraf>();
                                    installment_row.ForEach(a => a.DocEntry = H.DocEntry);
                                    d = installment_row;
                                    db.InstallmentRowDrafs.InsertAllOnSubmit(d);
                                    db.InstallmentRowDrafs.Context.SubmitChanges();

                                    /// This will be used to update the status of Accrual penalty
                                    var accrualIDs = installment_row.Select(r => r.BaseEntry).ToList();

                                    var sO = db.SOs.FirstOrDefault(a => accrualIDs.Contains(a.DocEntry));

                                    if (sO != null)
                                    {
                                        sO.LastError = "This document is linked with pending approve Restructure draft No: " + LastEntry + " -> Reference: " + header.DocNumRef;
                                        sO.Frozenfor = "Y";
                                        db.SOs.Context.SubmitChanges(); // Commit change
                                    }
                                    else
                                    {
                                        status = "Error";
                                    }
                                }

                                // For Update Generate approval Document Generate
                                var resut = db.ICC_ApprovalDocument_Generate(AppStageCode, LastEntry, "Restructure");

                                var list2 = resut.Select(x => new ExcecResult
                                {
                                    Result = x.Result

                                }).ToList();
                                var resultvalue = list2.FirstOrDefault();
                                if (resultvalue.Result != "Success")
                                {
                                    status = "Fail";
                                }

                                var link = "/amendments/PreviewRestructureAmt?DocEntry=" + LastEntry;

                                // For Update Generate approval ALERT Document Generate
                                var resut3 = db.ICC_ApprovalDocumentAlert_Generate(AppStageCode, LastEntry, "Restructure", AppTemplateID.ToString(), Session["UCode"].ToString(), link, NextApprover);

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


                            if (status == "OK")
                            {
                                trans.Complete();
                                trans.Dispose();
                            }
                            else
                            {
                                status = "Error";
                            }

                        }

                    }
                }
            }
            catch (Exception ex)
            {
                status = "Failed";
                // Optionally log ex.Message or ex.ToString() to file or database
            }

            return Json(new { status, LastEntry }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult PreviewRestructureAmt(int DocEntry)
        {
            ViewBag.installment = db.InstallmentRowDrafs.Where(x => x.DocEntry == DocEntry).ToList();
            ViewBag.Header = db.ICC_Get_List_Restructure_By_ID(DocEntry).ToList();
            ViewBag.Checkbutton = db.ICC_Approval_Check_EnableButton("Restructure", DocEntry, Session["UCode"].ToString()).ToList();

            return View();
        }

        public JsonResult save_change_schedule(InstallmentRowDrafH header, List<InstallmentRowDraf> installment_row)
        {
            status = "OK";
            int LastEntry = 0;
            string Message = "Success";
            if (status == "OK")
            {
                var trans = TransWithCommitted();
                try
                {
                    if (header != null)
                    {
                        using (trans)
                        {


                            // For check the posting period 
                            // Check Posting Period

                            var resultHeader = db.ICC_Notification_PostingPeriod(header.PostingDate, "Header");

                            var checkHeader = resultHeader.FirstOrDefault();

                            if (checkHeader != null && checkHeader.Code == 0)
                            {
                                return Json(new
                                {
                                    status = checkHeader.Message,
                                    LastEntry = 0,
                                    message = checkHeader.Message,
                                }, JsonRequestBehavior.AllowGet);
                            }

                            foreach (var item in installment_row.Where(x => x.ARNo == -1))
                            {
                                if (!item.PaymentDate.HasValue)
                                    continue;

                                var result = db.ICC_Notification_PostingPeriod(item.PaymentDate.Value, "Row");

                                var check = result.FirstOrDefault();

                                if (check != null && check.Code == 0)
                                {
                                    return Json(new
                                    {
                                        status = check.Message,
                                        LastEntry = 0,
                                        message = check.Message,
                                    }, JsonRequestBehavior.AllowGet);
                                }
                            }


                            int baseEntry = installment_row.FirstOrDefault()?.BaseEntry ?? 0;

                            var result1 = db.ICC_NOTIFICATION_FOR_CHANGE_SCHEDULE(baseEntry).FirstOrDefault();

                            if (result1 != null)
                            {
                                return Json(new
                                {
                                    status = "Warning",
                                    message = $"Loan {header.DocEntry} cannot be restructured because there are still open invoices: {result1.DocNums}"
                                }, JsonRequestBehavior.AllowGet);
                            }

                            // For Get Approval Template 
                            var monthlyTotal = installment_row.Sum(x => x.Monthly);

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
                                status = "Error";
                                Message = "Error: No approval template found.";
                                return Json(new { status, LastEntry, Message }, JsonRequestBehavior.AllowGet);
                            }
                            else
                            {
                                var AppTemplate = list.FirstOrDefault();

                                // 1. Get the result (this returns an object with an 'IsApproved' property)
                                var result = db.ICC_Approval_CheckRequester(AppTemplate.AppTemplateID, Session["UCode"].ToString())
                                               .FirstOrDefault();

                                // 2. Check if the result is not null and if the property is 0
                                if (result == null || result.IsApproved == 0)
                                {
                                    status = "Error";
                                    Message = "Error: Not allow to submit, User not setup as requester in approval.";
                                    return Json(new { status, LastEntry, Message }, JsonRequestBehavior.AllowGet);
                                }

                                else
                                {
                                    if (AppTemplate != null)
                                    {
                                        int AppStageCode = AppTemplate.AppStageCode;
                                        int AppTemplateID = AppTemplate.AppTemplateID;
                                        string TemplateDesc = AppTemplate.TemplateDesc;
                                        string Type = AppTemplate.Type;
                                        decimal FromAmt = AppTemplate.FromAmt;
                                        decimal ToAmt = AppTemplate.ToAmt;
                                        string DocID = AppTemplate.DocID;
                                        string NextApprover = AppTemplate.NextApprover;

                                        if (header == null || installment_row == null)
                                        {
                                            status = "Error";
                                            Message = "blank";
                                            return Json(new { status, LastEntry, Message }, JsonRequestBehavior.AllowGet);
                                        }
                                        else
                                        {
                                            InstallmentRowDrafH H = new InstallmentRowDrafH();
                                            H = db.InstallmentRowDrafHs.Where(a => a.DocEntry == header.DocEntry).FirstOrDefault();
                                            if (H == null)
                                            {
                                                H = header;
                                                H.PostingDate = header.PostingDate;
                                                H.CreateDate = DateTime.Now;
                                                H.UpdateDate = DateTime.Now;
                                                H.CreateBy = Session["UCode"].ToString();
                                                H.DocNumRef = header.DocNumRef;
                                                H.Remark = header.Remark;
                                                H.RestructureOption = header.RestructureOption;
                                                H.ApprovalStage = AppStageCode.ToString();
                                                H.NextApprover = NextApprover;
                                                H.Status = "Draf";
                                                H.ApprovalTemplate = AppTemplateID.ToString();
                                                H.DocType = "RE";
                                                H.EffictiveDate = header.EffictiveDate;
                                                db.InstallmentRowDrafHs.InsertOnSubmit(H);
                                                db.InstallmentRowDrafHs.Context.SubmitChanges();

                                                LastEntry = H.DocEntry;

                                                List<InstallmentRowDraf> d = new List<InstallmentRowDraf>();
                                                installment_row.ForEach(a => a.DocEntry = H.DocEntry);
                                                d = installment_row;
                                                db.InstallmentRowDrafs.InsertAllOnSubmit(d);
                                                db.InstallmentRowDrafs.Context.SubmitChanges();

                                                /// This will be used to update the status of Accrual penalty
                                                var accrualIDs = installment_row.Select(r => r.BaseEntry).ToList();

                                                var sO = db.SOs.FirstOrDefault(a => accrualIDs.Contains(a.DocEntry));

                                                if (sO != null)
                                                {
                                                    sO.LastError = "This document is linked with pending approve Reschedule draft No: " + LastEntry + " -> Reference: " + header.DocNumRef;
                                                    sO.Frozenfor = "Y";

                                                    db.SOs.Context.SubmitChanges(); // Commit change
                                                }
                                                else
                                                {
                                                    status = "Error";
                                                    Message = "Can not save data.";
                                                    return Json(new { status, LastEntry, Message }, JsonRequestBehavior.AllowGet);
                                                }
                                            }

                                            // For Update Generate approval Document Generate
                                            var resut = db.ICC_ApprovalDocument_Generate(AppStageCode, LastEntry, "Reschedule");

                                            var list2 = resut.Select(x => new ExcecResult
                                            {
                                                Result = x.Result

                                            }).ToList();
                                            var resultvalue = list2.FirstOrDefault();
                                            if (resultvalue.Result != "Success")
                                            {
                                                status = "Error";
                                                Message = "Update generate approval not work.";
                                                return Json(new { status, LastEntry, Message }, JsonRequestBehavior.AllowGet);
                                            }

                                            var link = "/amendments/PreviewReschedule?DocEntry=" + LastEntry;

                                            // For Update Generate approval ALERT Document Generate
                                            var resut3 = db.ICC_ApprovalDocumentAlert_Generate(AppStageCode, LastEntry, "Reschedule", AppTemplateID.ToString(), Session["UCode"].ToString(), link, NextApprover);

                                            var list3 = resut3.Select(x => new ExcecResult
                                            {
                                                Result = x.Result

                                            }).ToList();
                                            var resultvalue3 = list3.FirstOrDefault();
                                            if (resultvalue3.Result != "Success")
                                            {
                                                status = "Error";
                                                Message = "Gemerate alert document fail";
                                                return Json(new { status, LastEntry, Message }, JsonRequestBehavior.AllowGet);
                                            }
                                        }


                                        if (status == "OK")
                                        {
                                            trans.Complete();
                                            trans.Dispose();
                                        }
                                        else
                                        {
                                            status = "Error";
                                            Message = "Fail to save Data";
                                            return Json(new { status, LastEntry, Message }, JsonRequestBehavior.AllowGet);
                                        }
                                    }

                                }
                                
                            }
                        }
                    }
                    else
                    {
                        status = "Error";
                        Message = "Fail to save data";
                        return Json(new { status, LastEntry, Message }, JsonRequestBehavior.AllowGet);
                    }
                }
                catch (Exception ex)
                {
                    status = "Error";
                    //ErrorDes = ex.Message;
                    Message = ex.Message.ToString();
                    return Json(new { status, LastEntry, Message }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { status = status, LastEntry = LastEntry , message = Message.ToString() }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RescheduleApporovalListing(
            string Status = "Draf",
            DateTime? fdate = null,
            DateTime? tdate = null,
            string CreateBy = "",
            string Item = "",
            string Serial = "",
            string Customer = "")
        {
            // Use default date if null
            DateTime fromDate = fdate ?? new DateTime(1999, 1, 1);
            DateTime toDate = tdate ?? new DateTime(1999, 1, 1);

            var result = db.ICC_Get_List_Approval_Reschedule(
                Status ?? "Draf",
                fromDate,
                toDate,
                CreateBy ?? "",
                Item ?? "",
                Serial ?? "",
                Customer ?? ""
            ).ToList();

            ViewBag.Listing = result;

            return View();
        }
        public ActionResult PreviewReschedule(int DocEntry)
        {

            ViewBag.installment = db.InstallmentRowDrafs
                .Where(x => x.DocEntry == DocEntry)
                .OrderBy(x => x.PaymentDate)
                .ToList();

            ViewBag.Header = db.ICC_Get_List_Reschedule_By_ID(DocEntry).ToList();
            ViewBag.Checkbutton = db.ICC_Approval_Check_EnableButton("Reschedule", DocEntry, Session["UCode"].ToString()).ToList();
            return View();
        }

        public JsonResult save_approval_Reschedule(SO header,List<InstallmentRowDraf> details)
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
                            var resut = db.ICC_Approval_RescheduleDraf_Submit_Doc(header.DocStatus, Session["UCode"].ToString(), header.DocEntry, header.Comment?.ToString() ?? "");

                            var list2 = resut.Select(x => new ExcecResult
                            {
                                Result = x.Result
                            }).ToList();
                            var resultvalue = list2.FirstOrDefault();

                            if (resultvalue.Result != "Success")
                            {
                                status = "Fail";
                            }
                            else
                            {
                                if (header.DocStatus == "Approve")
                                {
                                    //// Update the information of the draft follow last approver. 
                                    InstallmentRowDrafH H = new InstallmentRowDrafH();
                                    H = db.InstallmentRowDrafHs.Where(a => a.DocEntry == header.DocEntry).FirstOrDefault();
                                    if (H != null)
                                    {

                                        H.EffictiveDate = header.DocumentDate;
                                        db.InstallmentRowDrafHs.Context.SubmitChanges();

                                        foreach (var detail in details)
                                        {
                                            var row = db.InstallmentRowDrafs
                                                        .FirstOrDefault(r => r.DocEntry == header.DocEntry
                                                                             && r.VisOrder == detail.VisOrder);
                                            if (row != null)
                                            {
                                                row.VarianDay = detail.VarianDay;
                                                row.InterestonsheduleVarian = detail.InterestonsheduleVarian;
                                            }
                                        }
                                        db.SubmitChanges();
                                    }
                                }
                                
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

        public ActionResult ResprocessingApporovalListing(
             string Status = "Draf",
             DateTime? fdate = null,
             DateTime? tdate = null,
             string CreateBy = "",
             string Customer = "",
             string Serial = "")
        {
            // Use default date if null
            DateTime fromDate = fdate ?? new DateTime(1999, 1, 1);
            DateTime toDate = tdate ?? new DateTime(1999, 1, 1);

            var result = db.ICC_Get_List_Approval_Reprocessing(
                Status ?? "Draf",
                fromDate,
                toDate,
                CreateBy ?? "",
                Customer ?? "",
                Serial ?? ""
            ).ToList();

            ViewBag.Listing = result;

            return View();
        }




        public JsonResult save_change_Item(InstallmentRowDrafH header, List<InstallmentRowDraf> installment_row)
        {
            status = "OK";
            int LastEntry = 0;
            string message = "success";
            if (status == "OK")
            {
                var trans = TransWithCommitted();
                try
                {
                    if (header != null)
                    {
                        using (trans)
                        {

                            // For check the posting period 
                            // Check Posting Period

                            var resultHeader = db.ICC_Notification_PostingPeriod(header.PostingDate, "Header");

                            var checkHeader = resultHeader.FirstOrDefault();

                            if (checkHeader != null && checkHeader.Code == 0)
                            {
                                return Json(new
                                {
                                    status = checkHeader.Message,
                                    LastEntry = 0,
                                    message = checkHeader.Message,
                                }, JsonRequestBehavior.AllowGet);
                            }

                            foreach (var item in installment_row.Where(x => x.ARNo == -1))
                            {
                                if (!item.PaymentDate.HasValue)
                                    continue;

                                var resultRow = db.ICC_Notification_PostingPeriod(item.PaymentDate.Value, "Row");

                                var check = resultRow.FirstOrDefault();

                                if (check != null && check.Code == 0)
                                {
                                    return Json(new
                                    {
                                        status = check.Message,
                                        LastEntry = 0,
                                        message = check.Message,
                                    }, JsonRequestBehavior.AllowGet);
                                }
                            }


                            int baseEntry = installment_row.FirstOrDefault()?.BaseEntry ?? 0;

                            var result = db.ICC_NOTIFICATION_FOR_CHANGE_SCHEDULE(baseEntry).FirstOrDefault();

                            if (result != null)
                            {
                                return Json(new
                                {
                                    status = "Warning",
                                    message = $"Loan {header.DocEntry} cannot be restructured because there are still open invoices: {result.DocNums}"
                                }, JsonRequestBehavior.AllowGet);
                            }

                            // For Get Approval Template 
                            var monthlyTotal = installment_row.Sum(x => x.Monthly);

                            var rawResultConnectBP = db.ICC_ConnectedBP_Check(header.CardCode);

                            if (rawResultConnectBP.Any())
                            {
                                status = "Error";
                                message = "Please update connect Vendor in SAP first.";
                                return Json(new { status, LastEntry,message}, JsonRequestBehavior.AllowGet);
                            }

                            var rawResult = db.ICC_ApprovalTempate_Check("CP", "A", monthlyTotal);

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
                                status = "Error";
                                message = "Error: No approval template found.";
                                return Json(new { status, LastEntry,message }, JsonRequestBehavior.AllowGet);
                            }
                            else
                            {

                                var AppTemplate = list.FirstOrDefault();
                                if (AppTemplate != null)
                                {
                                    int AppStageCode = AppTemplate.AppStageCode;
                                    int AppTemplateID = AppTemplate.AppTemplateID;
                                    string TemplateDesc = AppTemplate.TemplateDesc;
                                    string Type = AppTemplate.Type;
                                    decimal FromAmt = AppTemplate.FromAmt;
                                    decimal ToAmt = AppTemplate.ToAmt;
                                    string DocID = AppTemplate.DocID;
                                    string NextApprover = AppTemplate.NextApprover;

                                    if (header == null || installment_row == null)
                                    {
                                        status = "blank";
                                    }
                                    else
                                    {
                                        InstallmentRowDrafH H = new InstallmentRowDrafH();
                                        H = db.InstallmentRowDrafHs.Where(a => a.DocEntry == header.DocEntry).FirstOrDefault();
                                        if (H == null)
                                        {
                                            H = header;
                                            H.PostingDate = header.PostingDate;
                                            H.CreateDate = DateTime.Now;
                                            H.UpdateDate = DateTime.Now;
                                            H.CreateBy = Session["UCode"].ToString();
                                            H.DocNumRef = header.DocNumRef;
                                            H.Remark = header.Remark;
                                            H.ApprovalStage = AppStageCode.ToString();
                                            H.NextApprover = NextApprover;
                                            H.Status = "Draf";
                                            H.ApprovalTemplate = AppTemplateID.ToString();
                                            H.DocType = "CP";


                                            db.InstallmentRowDrafHs.InsertOnSubmit(H);
                                            db.InstallmentRowDrafHs.Context.SubmitChanges();

                                            LastEntry = H.DocEntry;

                                            List<InstallmentRowDraf> d = new List<InstallmentRowDraf>();
                                            installment_row.ForEach(a => a.DocEntry = H.DocEntry);
                                            d = installment_row;
                                            db.InstallmentRowDrafs.InsertAllOnSubmit(d);
                                            db.InstallmentRowDrafs.Context.SubmitChanges();

                                            /// This will be used to update the status of Accrual penalty
                                            /// This will be used to update the status of Accrual penalty
                                            var accrualIDs = installment_row.Select(r => r.BaseEntry).ToList();

                                            // Get SO record based on accrual IDs
                                            var sO = db.SOs.FirstOrDefault(a => accrualIDs.Contains(a.DocEntry));

                                            if (sO != null)
                                            {
                                                int refNo = Convert.ToInt32(header.ChangeRef);

                                                // Update ChangeItemRefNo for main SO
                                                sO.ChangeItemRefNo = refNo.ToString();
                                                db.SOs.Context.SubmitChanges();

                                                // Now fetch the referenced SO based on ChangeItemRefNo
                                                var sORef = db.SOs.FirstOrDefault(a => Convert.ToInt32(a.ChangeItemRefNo) == refNo);

                                                // If both documents exist, update them
                                                if (sORef != null)
                                                {
                                                    string msg = $"This document is linked with pending approve change Item draft No: {LastEntry} -> Reference: {header.DocNumRef}";

                                                    sO.LastError = msg;
                                                    sO.Frozenfor = "Y";

                                                    sORef.LastError = msg;
                                                    sORef.Frozenfor = "Y";

                                                    // Commit both updates at once
                                                    db.SOs.Context.SubmitChanges();
                                                }
                                                else
                                                {
                                                    status = "Error";
                                                    message = "Error while saving data to draft";
                                                }
                                            }

                                        }

                                        // For Update Generate approval Document Generate
                                        var resut = db.ICC_ApprovalDocument_Generate(AppStageCode, LastEntry, "ChangeItem");

                                        var list2 = resut.Select(x => new ExcecResult
                                        {
                                            Result = x.Result

                                        }).ToList();
                                        var resultvalue = list2.FirstOrDefault();
                                        if (resultvalue.Result != "Success")
                                        {
                                            status = "Fail";
                                            message = resultvalue.Result;
                                        }
                                    }


                                    if (status == "OK")
                                    {
                                        trans.Complete();
                                        trans.Dispose();
                                    }
                                    else
                                    {
                                        status = "Error";
                                        message = "Error while saving data";
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        status = "Error";
                        message = "Error while saving data";
                    }
                }
                catch (Exception ex)
                {
                    status = "Failed";
                    message = ex.Message;
                }
            }
            return Json(new { status = status, LastEntry = LastEntry,message }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ChangeproductApporovalListing(
            string Status = "Draf",
            DateTime? fdate = null,
            DateTime? tdate = null,
            string CreateBy = "",
            string Serial = "",
            string Customer = "")
        {
            // Use default date if null
            DateTime fromDate = fdate ?? new DateTime(1999, 1, 1);
            DateTime toDate = tdate ?? new DateTime(1999, 1, 1);

            var result = db.ICC_Get_List_Approval_ChangeItem(
                Status ?? "Draf",
                fromDate,
                toDate,
                CreateBy ?? "",
                Serial ?? "",
                Customer ?? ""
            ).ToList();

            ViewBag.Listing = result;

            return View();
        }


        public ActionResult PreviewChangeItem(int DocEntry)
        {

            ViewBag.installment = db.InstallmentRowDrafs.Where(x => x.DocEntry == DocEntry).ToList();
            ViewBag.Header = db.ICC_Get_List_changeItem_By_ID(DocEntry).ToList();
            ViewBag.Checkbutton = db.ICC_Approval_Check_EnableButton("ChangeItem", DocEntry, Session["UCode"].ToString()).ToList();

            return View();
        }

        public JsonResult save_approval_ChangeItemDraf(SO header)
        {
            string status = "OK";
            string message = "success";
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
                            var resut = db.ICC_Approval_ChangeItemDraf_Submit_Doc(header.DocStatus, Session["UCode"].ToString(), header.DocEntry, header.Comment?.ToString() ?? "");

                            var list2 = resut.Select(x => new ExcecResult
                            {
                                Result = x.Result
                            }).ToList();
                            var resultvalue = list2.FirstOrDefault();
                            if (resultvalue.Result != "Success")
                            {
                                status = "Fail";
                                message = resultvalue.Result;
                            }
                        }
                        catch (Exception ex)
                        {
                            status = "Error";
                            message = ex.Message.ToString();
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
                        message = ex.Message.ToString();
                        return Json(new { status, error = ex.Message,message=message });
                    }
                }
            }
            catch (Exception ex)
            {
                status = "Error";
                return Json(new { status, error = ex.Message,message=message });
            }

            return Json(new { status, lastEntry,message });
        }

        //public JsonResult save_change_house(SO header, List<InstallmentRow> installment_row, List<InstallmentRow> del_list)
        //{
        //    status = "OK";
        //    int LastEntry = 0;
        //    if (status == "OK")
        //    {
        //        var trans = TransWithCommitted();
        //        try
        //        {
        //            if (header != null)
        //            {
        //                using (trans)
        //                {
        //                    SO sO = new SO();
        //                    sO = db.SOs.Where(a => a.DocEntry == header.DocEntry).FirstOrDefault();
        //                    if (sO != null)
        //                    {
        //                        //// update SO header
        //                        sO.DocDate = header.DocDate;
        //                        sO.DueDate = header.DueDate;
        //                        sO.ContactPerson = header.ContactPerson;
        //                        sO.NumatCard = header.NumatCard;
        //                        sO.DocTotalBef = header.DocTotalBef;
        //                        sO.DiscountAmt = header.DiscountAmt;
        //                        sO.DiscountPer = header.DiscountPer;
        //                        sO.SubTotal = sO.SubTotal + header.SubTotal;
        //                        sO.BalanceDue = header.BalanceDue;
        //                        sO.Comment = header.Comment;
        //                        sO.Referral = header.Referral;
        //                        sO.ConPeriod = header.ConPeriod;
        //                        sO.UpdatedBy = header.CreatedBy;
        //                        sO.UpdatedDate = DateTime.Now;
        //                        db.SOs.Context.SubmitChanges();

        //                        SO1 s = sO.SO1s.ToList().LastOrDefault();
        //                        s.Reason = "CHS";
        //                        db.SO1s.Context.SubmitChanges();

        //                        //// finding last detail row of SO1
        //                        int lastLine = sO.SO1s.LastOrDefault() == null ? 0 : sO.SO1s.LastOrDefault().LineNum;

        //                        //// add old installmentRow to installment row history
        //                        int lastInstanc = (int)(db.InstallmentRowHistories.Where(a => a.BaseLine == header.DocEntry).ToList().LastOrDefault() == null ? 0 : db.InstallmentRowHistories.Where(a => a.BaseLine == header.DocEntry).ToList().LastOrDefault().logInstanc);
        //                        List<InstallmentRowHistory> rowList = new List<InstallmentRowHistory>();
        //                        foreach (InstallmentRow a in db.InstallmentRows.Where(a => a.BaseEntry == header.DocEntry && a.BaseLine == lastLine).ToList())
        //                        {
        //                            rowList.Add(
        //                                        new InstallmentRowHistory
        //                                        {
        //                                            ID = a.ID,
        //                                            BaseEntry = a.BaseEntry,
        //                                            BaseLine = a.BaseLine,
        //                                            VisOrder = a.VisOrder,
        //                                            ItemCode = a.ItemCode,
        //                                            Principle = a.Principle,
        //                                            Interest = a.Interest,
        //                                            Monthly = a.Monthly,
        //                                            PaymentDate = a.PaymentDate,
        //                                            DueDate = a.DueDate,
        //                                            Remaining = a.Remaining,
        //                                            ReIncloudInter = a.ReIncloudInter,
        //                                            RowStatus = a.RowStatus,
        //                                            CuInterest = a.CuInterest,
        //                                            CuPayment = a.CuPayment,
        //                                            FixedPayment = a.FixedPayment,
        //                                            ARNo = a.ARNo,
        //                                            PaymentNo = a.PaymentNo,
        //                                            Method = a.Method,
        //                                            InstallmentAmt = a.InstallmentAmt,
        //                                            DiscountAmt = a.DiscountAmt,
        //                                            DepositAmt = a.DepositAmt,
        //                                            AnnualRate = a.AnnualRate,
        //                                            PeriodMonths = a.PeriodMonths,
        //                                            HouseStatus = a.HouseStatus,
        //                                            Remarks = a.Remarks,
        //                                            Syn = a.Syn,
        //                                            ErrorLog = a.ErrorLog,
        //                                            DiscountAmount = a.DiscountAmount,
        //                                            DiscountPer = a.DiscountPer,
        //                                            SpecialDisAmount = a.SpecialDisAmount,
        //                                            SpecialDisPer = a.SpecialDisPer,
        //                                            AdditionalDisAmount = a.AdditionalDisAmount,
        //                                            AdditionalDisPer = a.AdditionalDisPer,
        //                                            ItemName = a.ItemName,
        //                                            OcrCode = a.OcrCode,
        //                                            OcrCode2 = a.OcrCode2,
        //                                            OcrCode3 = a.OcrCode3,
        //                                            logInstanc = lastInstanc + 1,
        //                                            HistoryDate = DateTime.Now
        //                                        }
        //                                    );
        //                        }
        //                        db.InstallmentRowHistories.InsertAllOnSubmit(rowList);
        //                        db.InstallmentRowHistories.Context.SubmitChanges();

        //                        if (del_list != null)
        //                        {
        //                            InstallmentRow del = new InstallmentRow();
        //                            foreach (InstallmentRow a in del_list)
        //                            {
        //                                del = new InstallmentRow();
        //                                del = db.InstallmentRows.Where(b => b.ID == a.ID && b.RowStatus == "O").FirstOrDefault();
        //                                db.InstallmentRows.DeleteOnSubmit(del);
        //                                db.InstallmentRows.Context.SubmitChanges();
        //                            }
        //                        }
        //                        if (installment_row != null)
        //                        {
        //                            List<InstallmentRow> in_List = new List<InstallmentRow>();
        //                            InstallmentRow ro = new InstallmentRow();
        //                            foreach (InstallmentRow a in installment_row)
        //                            {
        //                                ro = db.InstallmentRows.Where(b => b.ID == a.ID).FirstOrDefault();
        //                                if (ro != null)
        //                                {
        //                                    ro.ItemCode = a.ItemCode;
        //                                    ro.ItemName = a.ItemName;
        //                                    //ro.BaseLine = lastLine + 1;
        //                                    db.InstallmentRows.Context.SubmitChanges();
        //                                }
        //                                else
        //                                {
        //                                    //a.BaseLine = lastLine + 1;
        //                                    in_List.Add(a);
        //                                }
        //                            }
        //                            db.InstallmentRows.InsertAllOnSubmit(in_List);
        //                            db.InstallmentRows.Context.SubmitChanges();
        //                        }
        //                        if (status == "OK")
        //                        {
        //                            trans.Complete();
        //                            trans.Dispose();
        //                        }
        //                    }
        //                    else
        //                    {
        //                        status = "Error";
        //                    }
        //                }
        //            }
        //            else
        //            {
        //                status = "Error";
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            status = "Failed";
        //            //ErrorDes = ex.Message;
        //        }
        //    }
        //    return Json(new { status = status, LastEntry = LastEntry }, JsonRequestBehavior.AllowGet);
        //}
    }


}