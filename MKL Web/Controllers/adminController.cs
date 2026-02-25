using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using MKL_Web.Models;
using System.IO;
using System.Data.OleDb;
using System.Data;
using Antlr.Runtime;

namespace MKL_Web.Controllers
{
    public class adminController : Controller
    {
        // GET: admin
        private MKLDataContext db = null;
        private string status = "OK";
        private string ErrMessage = "";
        private EncryptDecrypt.EncryptDecrypt en = new EncryptDecrypt.EncryptDecrypt();
        public adminController()
        {
            db = new MKLDataContext(ConfigurationManager.AppSettings["sql"].ToString());
            //condb = new SAPDataContext(ConfigurationManager.AppSettings["consql"].ToString());
        }
        public ActionResult price()
        {
            ViewBag.itemgroup = db.v_Item_Groups.ToList();
            ViewBag.CurList = db.v_Currencies.ToList();
            return View();
        }
        //Approval
        public ActionResult AppStage()
        {
            ViewBag.appstage = db.AppStages.ToList();
            ViewBag.user = db.USRs.ToList();
            ViewBag.pro = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.dep = db.v_Departments.ToList();
            return View();
        }
        public ActionResult AppTemplate()
        {
            ViewBag.apptempalte = db.AppTemplates.ToList();
            ViewBag.ocrcode = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.user = db.USRs.ToList();
            ViewBag.appstage = db.AppStages.ToList();
            return View();
        }
        public ActionResult Index()
        {
            
            return View();
        }
        public ActionResult welcome(string id)
        {
            return View();
        }
        public JsonResult cbo_admin_check_user(string UserCode)
        {
            status = "OK";
            USR u = db.USRs.Where(x => x.UserCode == UserCode).FirstOrDefault();
            if (u != null)
            {
                status = "Exist";
            }
            return Json(new
            {
                status = status
            });
        }
        public ActionResult Adm(string id)
        {
            ViewBag.usrlist = db.USRs.ToList();
            ViewBag.user = id;
            return View();
        }
        public ActionResult newacct()
        {
            ViewBag.deplist = db.v_Departments.ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            ViewBag.Blocks = db.v_CostCenters.Where(a => a.DimCode == 2).ToList();
            return View();
        }
        public ActionResult editacct(string acct)
        {
            ViewBag.usr = db.USRs.Where(a => a.UserCode == acct).FirstOrDefault();
            ViewBag.deplist = db.v_Departments.ToList();
            ViewBag.project = db.v_CostCenters.Where(x => x.DimCode == 1).ToList();
            List<v_CostCenter> blocklist = new List<v_CostCenter>();
            ViewBag.blocklist = blocklist;
            List<v_CostCenter> blolist = db.v_CostCenters.Where(a => a.DimCode == 2).ToList();
            ViewBag.blolist = blolist;
            return View();
        }
        public ActionResult NewAccount(string id)
        {
            ViewBag.usrlist = db.USRs.ToList();
            ViewBag.user = id;
            return View();
        }
        public ActionResult Authorization()
        {
            ViewBag.usrlist = db.USRs.ToList();
            ViewBag.mainmenu = db.MenuMains.ToList();
            ViewBag.mainsub = db.MenuSubs.ToList();
            return View();
        }
        public ActionResult UserSubGroup()
        {
            ViewBag.itemgroup = db.v_Item_Groups.ToList();
            ViewBag.usrlist = db.USRs.Where(x => x.DepCode == 12).ToList();
            return View();
        }
        public ActionResult DepartMapping()
        {
            ViewBag.dep = db.v_Departments.Where(x => x.PrcCode != null).ToList();
            return View();
        }
        //public ActionResult AlertListDetail(string BaseType, string BoqType, string NotiType, string ListTitle)
        //{
        //    ViewBag.Title = ListTitle;
        //    USR u = (USR)Session["USR"];
        //    ViewBag.user = u;
        //    ViewBag.NotiType = NotiType;
        //    ViewBag.DocType = BaseType;

        //    string sqltext = "exec ICC_Notification_Alert_List '" + u.UserCode + "','" + BaseType + "','" + BoqType + "','" + NotiType + "'";
        //    DataTable table = view.getTable(sqltext);
        //    List<PO> list = new List<PO>();
        //    list = (from x in table.AsEnumerable()
        //            select new PO
        //            {
        //                DocEntry = Convert.ToInt32(x["DocEntry"].ToString()),
        //                DocNum = x["DocNum"].ToString(),
        //                DocStatus = x["DocStatus"].ToString(),
        //                DocDate = Convert.ToDateTime(x["DocDate"].ToString()),
        //                ReqDate = Convert.ToDateTime(x["ReqDate"].ToString()),
        //                OcrCode = x["OcrCode"].ToString(),
        //                SapDocEntry = Convert.ToInt32(x["AlertEntry"].ToString()),
        //                SapDocNum = x["SapDocNum"].ToString(),
        //                CardName = x["CardName"].ToString(),
        //                DocCur = x["DocCur"].ToString(),
        //                DocTotal = Convert.ToDecimal(x["DocTotal"].ToString()),
        //                IsBOQ = x["IsBOQ"].ToString(),
        //                BOQType = char.Parse(x["BOQType"].ToString()),
        //                Memo = x["Remark"].ToString(),
        //                PRNum = x["BaseNum"].ToString(),
        //                CreatedBy = x["CreatedBy"].ToString(),
        //                RejBy = x["NextUser"].ToString(),
        //                NextUser = x["UserL1"].ToString(),
        //                NextUser1 = x["UserL2"].ToString(),
        //                NextUser2 = x["UserL3"].ToString(),
        //                NextUser3 = x["UserL4"].ToString(),
        //                LastApprover = x["UserL5"].ToString(),
        //                AppBy = x["LastApprover"].ToString(),
        //                AppDate = Convert.ToDateTime(x["AppDate"].ToString()),
        //                CancelBy = x["ReadYet"].ToString(),
        //                ApprovalMemo = x["RejectionReason"].ToString()
        //            }).ToList();
        //    var data = list.Select(x => new
        //    {
        //        x.DocEntry,
        //        x.DocNum,
        //        x.DocStatus,
        //        DocDate = x.DocDate.Value.ToString("dd-MMM-yyyy"),
        //        ReqDate = x.ReqDate.Value.ToString("dd-MMM-yyyy"),
        //        x.OcrCode,
        //        x.SapDocEntry,
        //        x.SapDocNum,
        //        x.CardName,
        //        x.DocCur,
        //        x.DocTotal,
        //        x.IsBOQ,
        //        x.BOQType,
        //        x.Memo,
        //        x.PRNum,
        //        x.CreatedBy,
        //        x.RejBy,
        //        x.NextUser,
        //        x.NextUser1,
        //        x.NextUser2,
        //        x.NextUser3,
        //        x.LastApprover,
        //        x.AppBy,
        //        AppDate = x.AppDate.Value.ToString("dd-MMM-yyyy"),
        //        x.CancelBy,
        //        x.ApprovalMemo
        //    }).ToList();
        //    ViewBag.POList = list;

        //    return View();
        //}
        //public ActionResult AlertListDetailInv(string BaseType, string BoqType, string NotiType, string ListTitle)
        //{
        //    ViewBag.Title = ListTitle;
        //    USR u = (USR)Session["USR"];
        //    ViewBag.user = u;
        //    ViewBag.NotiType = NotiType;
        //    ViewBag.DocType = BaseType;

        //    string sqltext = "exec ICC_Notification_Alert_List '" + u.UserCode + "','" + BaseType + "','" + BoqType + "','" + NotiType + "'";
        //    DataTable table = view.getTable(sqltext);
        //    List<PO> list = new List<PO>();
        //    list = (from x in table.AsEnumerable()
        //            select new PO
        //            {
        //                DocEntry = Convert.ToInt32(x["DocEntry"].ToString()),
        //                DocNum = x["DocNum"].ToString(),
        //                DocStatus = x["DocStatus"].ToString(),
        //                DocDate = Convert.ToDateTime(x["DocDate"].ToString()),
        //                ReqDate = Convert.ToDateTime(x["ReqDate"].ToString()),
        //                OcrCode = x["OcrCode"].ToString(),
        //                SapDocEntry = Convert.ToInt32(x["AlertEntry"].ToString()),
        //                SapDocNum = x["SapDocNum"].ToString(),
        //                CardName = x["CardName"].ToString(),
        //                DocCur = x["DocCur"].ToString(),
        //                DocTotal = Convert.ToDecimal(x["DocTotal"].ToString()),
        //                IsBOQ = x["IsBOQ"].ToString(),
        //                BOQType = char.Parse(x["BOQType"].ToString()),
        //                Memo = x["Remark"].ToString(),
        //                PRNum = x["BaseNum"].ToString(),
        //                CreatedBy = x["CreatedBy"].ToString(),
        //                RejBy = x["NextUser"].ToString(),
        //                NextUser = x["UserL1"].ToString(),
        //                NextUser1 = x["UserL2"].ToString(),
        //                NextUser2 = x["UserL3"].ToString(),
        //                NextUser3 = x["UserL4"].ToString(),
        //                LastApprover = x["UserL5"].ToString(),
        //                AppBy = x["LastApprover"].ToString(),
        //                AppDate = Convert.ToDateTime(x["AppDate"].ToString()),
        //                CancelBy = x["ReadYet"].ToString(),
        //                ApprovalMemo = x["RejectionReason"].ToString()
        //            }).ToList();
        //    var data = list.Select(x => new
        //    {
        //        x.DocEntry,
        //        x.DocNum,
        //        x.DocStatus,
        //        DocDate = x.DocDate.Value.ToString("dd-MMM-yyyy"),
        //        ReqDate = x.ReqDate.Value.ToString("dd-MMM-yyyy"),
        //        x.OcrCode,
        //        x.SapDocEntry,
        //        x.SapDocNum,
        //        x.CardName,
        //        x.DocCur,
        //        x.DocTotal,
        //        x.IsBOQ,
        //        x.BOQType,
        //        x.Memo,
        //        x.PRNum,
        //        x.CreatedBy,
        //        x.RejBy,
        //        x.NextUser,
        //        x.NextUser1,
        //        x.NextUser2,
        //        x.NextUser3,
        //        x.LastApprover,
        //        x.AppBy,
        //        AppDate = x.AppDate.Value.ToString("dd-MMM-yyyy"),
        //        x.CancelBy,
        //        x.ApprovalMemo
        //    }).ToList();
        //    ViewBag.POList = list;

        //    return View();
        //}
        //public ActionResult AlertManagement()
        //{
        //    USR u = (USR)Session["USR"];
        //    ViewBag.user = u;
        //    List<USR> urList = db.USRs.Where(a => a.UserStatus == "Active").ToList();
        //    ViewBag.UrList = urList;
        //    return View();
        //}
        //public JsonResult cmd_save_alert_setup(AlertSetup head, List<AlertSetup1> detail)
        //{
        //    status = "OK";
        //    try
        //    {
        //        AlertSetup alt = db.AlertSetups.Where(a => a.DocID == head.DocID).FirstOrDefault();
        //        AlertSetup1 alt1 = new AlertSetup1();
        //        List<AlertSetup1> alList = new List<AlertSetup1>();
        //        if (alt == null)
        //        {
        //            alt = new AlertSetup();
        //            alt.DocID = head.DocID;
        //            alt.AfterReaded = head.AfterReaded;
        //            alt.BeforeDate = head.BeforeDate;
        //            alt.CreatedBy = Session["UCode"].ToString();
        //            alt.CreatedDate = DateTime.Now;
        //            db.AlertSetups.InsertOnSubmit(alt);
        //            db.AlertSetups.Context.SubmitChanges();

        //            if (detail != null && head.DocID == "PO")
        //            {
        //                foreach (AlertSetup1 a in detail)
        //                {
        //                    alt1 = new AlertSetup1();
        //                    alt1.DocEntry = alt.DocEntry;
        //                    alt1.UserCode = a.UserCode;
        //                    alList.Add(alt1);
        //                }
        //                db.AlertSetup1s.InsertAllOnSubmit(alList);
        //                db.AlertSetup1s.Context.SubmitChanges();
        //            }

        //        }
        //        else
        //        {
        //            alt.AfterReaded = head.AfterReaded;
        //            alt.BeforeDate = head.BeforeDate;
        //            alt.UpdatedBy = Session["UCode"].ToString();
        //            alt.UpdatedDate = DateTime.Now;

        //            if (detail != null)
        //            {
        //                alList = db.AlertSetup1s.Where(a => a.DocEntry == head.DocEntry && !detail.Select(b => b.UserCode).Contains(a.UserCode)).ToList();
        //                if (alList != null)
        //                {
        //                    db.AlertSetup1s.InsertAllOnSubmit(alList);
        //                    db.AlertSetup1s.Context.SubmitChanges();
        //                }
        //                foreach (AlertSetup1 a in detail)
        //                {
        //                    alt1 = db.AlertSetup1s.Where(b => b.DocEntry == alt.DocEntry && b.UserCode == a.UserCode).FirstOrDefault();
        //                    if (alt1 == null)
        //                    {
        //                        alt1 = new AlertSetup1();
        //                        alt1.DocEntry = alt.DocEntry;
        //                        alt1.UserCode = a.UserCode;

        //                        db.AlertSetup1s.InsertOnSubmit(alt1);
        //                        db.AlertSetup1s.Context.SubmitChanges();
        //                    }
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        status = "Failed";
        //        ErrMessage = ex.Message;
        //    }
        //    return Json(new
        //    {
        //        status = status,
        //        Message = ErrMessage
        //    });
        //}
        //public JsonResult get_alert_setup(string docID)
        //{
        //    List<AlertSetup1> list = new List<AlertSetup1>();
        //    AlertSetup alt = db.AlertSetups.Where(a => a.DocID == docID).FirstOrDefault();
        //    if (alt != null)
        //    {
        //        if (alt.DocID == "PR" || alt.DocID == "PO" || alt.DocID == "GRPO")
        //        {
        //            list = db.AlertSetup1s.Where(x => x.DocEntry == alt.DocEntry).ToList();
        //        }
        //    }
        //    else
        //    {
        //        alt = new AlertSetup();
        //    }

        //    var alt1 = list.Select(x => new
        //    {
        //        x.DocEntry,
        //        x.UserCode
        //    }).ToList();

        //    return Json(new
        //    {
        //        status = "OK",
        //        data = alt1,
        //        DocID = alt.DocID,
        //        AfterReaded = alt.AfterReaded,
        //        BeforeDate = alt.BeforeDate
        //    });
        //}


        public JsonResult get_user_auth(string usercode)
        {
            List<USRAuth> list = new List<USRAuth>();
            list = db.USRAuths.Where(x => x.UserCode == usercode).ToList();
            var data = list.Select(x => new {
                x.UserCode,
                x.SMCode,
                x.Auth,
                x.HideAmount
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
        //User
        public JsonResult cmd_save_reset_password(string usercode, string newpwd)
        {
            try
            {
                USR u = db.USRs.Where(x => x.UserCode == usercode).FirstOrDefault();
                if (u != null)
                {
                    u.Pwd = en.Encryption(newpwd);
                    db.USRs.Context.SubmitChanges();
                }
                status = "OK";
            }
            catch (Exception ex)
            {
                status = "Failed";
                ErrMessage = ex.Message;
            }
            return Json(new
            {
                status = status,
                Message = ErrMessage
            });
        }
        public JsonResult save_user_image(string UserID)
        {
            string status = "OK";
            string ErrMessage = "";
            string fullPath = "";
            string savename = "";
            try
            {
                int lastEntry = -1;
                HttpFileCollectionBase files = Request.Files;
                HttpPostedFileBase file;
                for (int i = 0; i < files.Count; i++)
                {
                    file = files[i];
                    savename = file.FileName.Replace("+", "_").Replace("-", "_").Replace(")", "_").Replace("(", "_").Replace("*", "_").Replace("&", "_").Replace("^", "_").Replace("%", "_").Replace("$", "_").Replace("#", "_").Replace("@", "_").Replace("!", "_").Replace("~", "_").Replace(" ", "_");
                    fullPath = Server.MapPath("~/UserProfile/" + UserID + "/");
                    if (Directory.Exists(fullPath) == false)
                        Directory.CreateDirectory(fullPath);
                    if (System.IO.File.Exists(fullPath + "\\" + savename))
                        System.IO.File.Delete(fullPath + "\\" + savename);
                    file.SaveAs(fullPath + "\\" + savename);
                }
                USR u = db.USRs.Where(x => x.UserCode == UserID).FirstOrDefault();
                if (u != null)
                {
                    if (u.Picture == null)
                    {
                        u.Picture = "../UserProfile/" + UserID + "/" + savename;
                    }
                    else if (savename != "")
                    {
                        u.Picture = "../UserProfile/" + UserID + "/" + savename;
                    }

                    db.USRs.Context.SubmitChanges();
                }
                ErrMessage = lastEntry.ToString();
            }
            catch (Exception ex)
            {
                status = "Failed";
                ErrMessage = ex.Message;
            }
            return Json(new
            {
                status = status,
                Message = ErrMessage
            });
        }
        public JsonResult cmd_save_user(USR header)
        {
            status = "OK";
            try
            {
                if (header.Addrss == "new")
                {
                    USR u = db.USRs.Where(x => x.UserCode == header.UserCode).FirstOrDefault();
                    if (u != null)
                    {
                        status = "Exist";
                    }
                    else
                    {
                        u = new USR();
                        header.UserStatus = "Active";
                        header.IsSuper = 'N';
                        if (header.Pwd != null)
                        {
                            header.Pwd = en.Encryption(header.Pwd);
                        }
                        u = header;
                        db.USRs.InsertOnSubmit(u);
                        db.USRs.Context.SubmitChanges();
                        status = "OK";
                    }
                }
                else
                {
                    USR u = db.USRs.Where(x => x.UserCode == header.UserCode).FirstOrDefault();
                    u.UserName = header.UserName;
                    u.Phone1 = header.Phone1;
                    u.Email = header.Email;
                    u.Gender = header.Gender;
                    u.Position = header.Position;
                    u.DepCode = header.DepCode;
                    u.ChangeNext = header.ChangeNext;
                    u.UserStatus = header.UserStatus;
                    db.USRs.Context.SubmitChanges();
                    status = "OK";
                }
            }
            catch (Exception ex)
            {
                status = "Failed";
                ErrMessage = ex.Message;
            }
            return Json(new
            {
                status = status,
                Message = ErrMessage
            });
        }
        public JsonResult cmd_save_user_auth(List<USRAuth> detail)
        {
            status = "OK";
            try
            {
                USRAuth auth = null;
                foreach (var x in detail)
                {
                    auth = db.USRAuths.Where(a => a.UserCode == x.UserCode && a.SMCode == x.SMCode).FirstOrDefault();
                    if (auth == null)
                    {
                        db.USRAuths.InsertOnSubmit(x);
                        db.USRAuths.Context.SubmitChanges();
                    }
                    else
                    {
                        auth.Auth = x.Auth;
                        auth.HideAmount = x.HideAmount;
                        db.USRAuths.Context.SubmitChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                status = "Failed";
                ErrMessage = ex.Message;
            }
            return Json(new
            {
                status = status,
                Message = ErrMessage
            });
        }

        //public JsonResult cmd_update_assing_to(List<PR1> detail, List<PRUser> usr)
        //{
        //    status = "OK";
        //    try
        //    {
        //        PR1 p1 = null;
        //        foreach (var x in detail)
        //        {
        //            p1 = db.PR1s.Where(a => a.DocEntry == x.DocEntry && a.LineNum == x.LineNum && a.LineStatus != "Closed").FirstOrDefault();
        //            if (p1 != null)
        //            {
        //                p1.AssignToUser = x.AssignToUser;
        //                db.PR1s.Context.SubmitChanges();
        //            }
        //        }
        //        //PRUser u = new PRUser();
        //        //foreach(var x in usr)
        //        //{
        //        //    //u = db.PRUsers.Where(a => a.DocEntry == x.DocEntry && a.UserId == x.UserId && a.ItemGroup == x.ItemGroup && a.ItemSubGroup == x.ItemSubGroup).FirstOrDefault();
        //        //    //if (u == null)
        //        //    //{

        //        //    //}
        //        //    List<PRUser> prlist = db.PRUsers.Where(a => a.DocEntry == x.DocEntry).ToList();
        //        //    db.PRUsers.DeleteAllOnSubmit(prlist);
        //        //    db.PRUsers.Context.SubmitChanges();
        //        //}
        //        //db.PRUsers.InsertAllOnSubmit(usr);
        //        //db.PRUsers.Context.SubmitChanges();
        //    }
        //    catch (Exception ex)
        //    {
        //        status = "Failed";
        //        ErrMessage = ex.Message;
        //    }
        //    return Json(new
        //    {
        //        status = status,
        //        Message = ErrMessage
        //    });
        //}
        //public JsonResult cmd_save_user_group(List<USRSubGroup> detail)
        //{
        //    status = "OK";
        //    try
        //    {
        //        USRSubGroup auth = null;
        //        foreach (var x in detail)
        //        {
        //            auth = db.USRSubGroups.Where(a => a.UserCode == x.UserCode && a.ItemGroup == x.ItemGroup && a.SubGroup == x.SubGroup).FirstOrDefault();
        //            if (auth == null)
        //            {
        //                db.USRSubGroups.InsertOnSubmit(x);
        //                db.USRSubGroups.Context.SubmitChanges();
        //            }
        //            else
        //            {
        //                if (x.DocStatus == "Deleted")
        //                {
        //                    db.USRSubGroups.DeleteOnSubmit(auth);
        //                    db.USRSubGroups.Context.SubmitChanges();
        //                }
        //                else
        //                {
        //                    auth.ItemGroup = x.ItemGroup;
        //                    auth.SubGroup = x.SubGroup;
        //                    db.USRSubGroups.Context.SubmitChanges();
        //                }

        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        status = "Failed";
        //        ErrMessage = ex.Message;
        //    }
        //    return Json(new
        //    {
        //        status = status,
        //        Message = ErrMessage
        //    });
        //}
        ////Approval
        public JsonResult cmd_save_stage(AppStage header, List<AppStage1> detail)
        {
            status = "OK";
            try
            {
                List<AppStage1> dnull = detail.Where(x => x.UserCode == null).ToList();
                foreach (var x in dnull)
                {
                    detail.Remove(x);
                }
                AppStage h = db.AppStages.Where(x => x.AppStageCode == header.AppStageCode).FirstOrDefault();
                if (h != null)
                {
                    h.AppDes = header.AppDes;
                    h.FNStock = header.FNStock;
                    h.OcrCode = header.OcrCode;
                    h.Department = header.Department;
                    db.AppStages.Context.SubmitChanges();
                    List<AppStage1> d = db.AppStage1s.Where(x => x.AppStageCode == header.AppStageCode).ToList();
                    db.AppStage1s.DeleteAllOnSubmit(d);
                    db.AppStage1s.Context.SubmitChanges();
                    detail.ForEach(x => x.AppStageCode = header.AppStageCode);

                    db.AppStage1s.InsertAllOnSubmit(detail);
                    db.AppStage1s.Context.SubmitChanges();
                }
                else
                {
                    h = header;
                    h.OcrCode = header.OcrCode;
                    db.AppStages.InsertOnSubmit(h);
                    db.AppStages.Context.SubmitChanges();
                    detail.ForEach(x => x.AppStageCode = h.AppStageCode);
                    db.AppStage1s.InsertAllOnSubmit(detail);
                    db.AppStage1s.Context.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                status = "Failed";
                ErrMessage = ex.Message;
            }
            return Json(new
            {
                status = status,
                Message = ErrMessage
            });
        }
        //Approval Template
        public JsonResult cmd_save_app_template(AppTemplate header, List<AppTemplateOcrCode> project, List<AppTemplateInit> init, List<AppTemplateWork> mainwork)
        {
            status = "OK";
            try
            {
                AppTemplate app = db.AppTemplates.Where(a => a.AppTemplateID == header.AppTemplateID).FirstOrDefault();
                if (app == null)
                {
                    app = header;
                    app.CreatedDate = DateTime.Now;
                    app.UpdatedDate = DateTime.Now;
                    db.AppTemplates.InsertOnSubmit(app);
                    db.AppTemplates.Context.SubmitChanges();
                    if (init != null)
                    {
                        init.ForEach(a => a.AppTemplateID = app.AppTemplateID);
                        db.AppTemplateInits.InsertAllOnSubmit(init);
                        db.AppTemplateInits.Context.SubmitChanges();
                    }
                }
                else
                {
                    app.TemplateDesc = header.TemplateDesc;
                    app.DocID = header.DocID;
                    app.AppStageCode = header.AppStageCode;
                    app.DocStatus = header.DocStatus;
                    app.FromAmt = header.FromAmt;
                    app.ToAmt = header.ToAmt;
                    app.Type = header.Type;
                    app.StoreName = header.StoreName;
                    app.UpdatedDate = header.UpdatedDate;
                    app.UpdatedBy = header.UpdatedBy;
                    db.AppTemplates.Context.SubmitChanges();
                    List<AppTemplateInit> oldinit = db.AppTemplateInits.Where(a => a.AppTemplateID == header.AppTemplateID).ToList();
                    db.AppTemplateInits.DeleteAllOnSubmit(oldinit);
                    db.AppTemplateInits.Context.SubmitChanges();
                    if (init != null)
                    {
                        init.ForEach(a => a.AppTemplateID = header.AppTemplateID);
                        db.AppTemplateInits.InsertAllOnSubmit(init);
                        db.AppTemplateInits.Context.SubmitChanges();
                    }
                }

            }
            catch (Exception ex)
            {
                status = "Failed";
                ErrMessage = ex.Message;
            }
            return Json(new
            {
                status = status,
                Message = ErrMessage
            });
        }
    }
}