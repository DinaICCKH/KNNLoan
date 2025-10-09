using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MKL_Web.Models;
using System.Configuration;
using System.Data;
using System.Web.Script.Serialization;
using System.IO;
using System.Transactions;
using DataTable = System.Data.DataTable;
using static System.Net.Mime.MediaTypeNames;
using System.Net.Mail;
using System.Web.UI;

namespace MKL_Web.Controllers
{
    public class getDataController : Controller
    {
        // GET: getData
        //private SAPDataContext condb = null;
        private MKLDataContext db = null;
        private string status = "OK";
        private string ErrorDes = "";
        public getDataController()
        {
            db = new MKLDataContext(ConfigurationManager.AppSettings["sql"].ToString());
            db.CommandTimeout = Convert.ToInt32(ConfigurationManager.AppSettings["timeout"].ToString()) * 60;
            //condb = new SAPDataContext(ConfigurationManager.AppSettings["consql"].ToString());
        }
        
        //for Approval
        public JsonResult get_stage1(int stagecode)
        {
            string stagename = "";
            List<AppStage1> list = new List<AppStage1>();
            AppStage s = db.AppStages.Where(x => x.AppStageCode == stagecode).FirstOrDefault();
            stagename = s.AppName;
            list = db.AppStage1s.Where(x => x.AppStageCode == stagecode).ToList();
            var data = list.Select(x => new {
                x.UserCode,
                x.DocEntry,
                x.AppStageCode,
                x.VisOrder,
                x.Dscription,
                x.Location
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data,
                stagename = stagename
            });
        }
        //app template
        public JsonResult get_template_project(int tempid)
        {
            List<AppTemplateOcrCode> listocrcode = db.AppTemplateOcrCodes.Where(x => x.AppTemplateID == tempid).ToList();
            List<v_AppTemplateOcrCode> list_temp_orcode = new List<v_AppTemplateOcrCode>();
            v_AppTemplateOcrCode t = new v_AppTemplateOcrCode();
            foreach (var x in db.v_CostCenters.Where(a => a.DimCode == 1).ToList())
            {
                if (listocrcode.Where(a => a.OcrCode == x.PrcCode).FirstOrDefault() == null)
                {
                    list_temp_orcode.Add(new v_AppTemplateOcrCode()
                    {
                        PrcCode = x.PrcCode,
                        Selected = "N",
                    });
                }
                else
                {
                    list_temp_orcode.Add(new v_AppTemplateOcrCode()
                    {
                        PrcCode = x.PrcCode,
                        Selected = "Y",
                    });
                }
            }
            var data = list_temp_orcode.Select(x => new {
                x.PrcCode,
                x.Selected
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data,
            });
        }
        public JsonResult get_template_init(int tempid)
        {
            List<AppTemplateInit> listocrcode = db.AppTemplateInits.Where(x => x.AppTemplateID == tempid).ToList();
            List<v_AppTemplateInit> list_temp_orcode = new List<v_AppTemplateInit>();
            v_AppTemplateOcrCode t = new v_AppTemplateOcrCode();
            foreach (var x in db.USRs.ToList())
            {
                if (listocrcode.Where(a => a.UserCode == x.UserCode).FirstOrDefault() == null)
                {
                    list_temp_orcode.Add(new v_AppTemplateInit()
                    {
                        UserCode = x.UserCode,
                        Selected = "N",
                    });
                }
                else
                {
                    list_temp_orcode.Add(new v_AppTemplateInit()
                    {
                        UserCode = x.UserCode,
                        Selected = "Y",
                    });
                }
            }
            var data = list_temp_orcode.Select(x => new {
                x.UserCode,
                x.Selected
            }).ToList();

            return Json(new
            {
                status = "OK",
                data = data,
            });
        }
        public JsonResult get_uom_group()
        {
            List<v_UoMGroup> list = new List<v_UoMGroup>();
            list = db.v_UoMGroups.ToList();
            var data = list.Select(x => new {
                x.UgpEntry,
                x.UomEntry,
                x.AltQty,
                x.BaseQty,
                x.UomName
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
  


        public JsonResult get_def_bin(string ItemCode, string WhsCode)
        {
            string docnum = "";
            v_Item_Bin itm = db.v_Item_Bins.Where(x => x.ItemCode == ItemCode && x.WhsCode == WhsCode).FirstOrDefault();
            if (itm == null)
            {
                v_Wh wh = db.v_Whs.Where(x => x.WhsCode == WhsCode).FirstOrDefault();
                if (wh == null)
                {
                    docnum = "0";
                }
                else
                {
                    docnum = wh.DefBinEntry.Value.ToString();
                }
            }
            else
            {
                docnum = itm.BinEntry.Value.ToString();
            }
            return Json(new
            {
                status = "OK",
                docnum = docnum
            });
        }


        public JsonResult cmd_subcon_term(string docentry)
        {
            status = "OK";
            List<view> list = new List<view>();
            DataTable tbl = view.getTable("exec ICC_get_Sub_Con_Term '" + docentry + "'");
            list = (from x in tbl.AsEnumerable()
                    select new view
                    {
                        Code = x["TermCode"].ToString(),
                        Name = x["TermDesc"].ToString()
                    }).ToList();
            var data = list.Select(x => new {
                x.Code,
                x.Name
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
     

       
       
       
       
        public JsonResult get_contact(string cardcode)
        {
            List<OCPR> list = new List<OCPR>();
            list = db.OCPRs.Where(x => x.CardCode == cardcode).ToList();
            if (list == null)
            {
                list = new List<OCPR>();
            }
            var data = list.Select(x => new {
                x.Cntctcode,
                x.ENName
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
        public JsonResult get_currency(string cardcode)
        {
            OCRD crd = new OCRD();
            List<v_Currency> curList = new List<v_Currency>();
            crd = db.OCRDs.Where(x => x.CardCode == cardcode).FirstOrDefault();
            if (crd == null)
            {
                crd = new OCRD();
            }
            if (crd.Currency == "##" || crd.Currency == "*")
            {
                curList = db.v_Currencies.ToList();
            }
            else
            {
                curList = db.v_Currencies.Where(a => a.CurrCode == crd.Currency).ToList();
            }
            var data = curList.Select(x => new { x.CurrCode, x.CurrName }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
       
       

        public JsonResult get_boq_cost_center_list(string boqtype, string type, string ocrcode, string ocrcode2, string ocrcode3, string maincode, string subwork)
        {
            List<view> list = new List<view>();
            DataTable tbl = view.getTable("exec get_BOQ_Cost_Center '" + boqtype + "','" + type + "','" + ocrcode + "','" + ocrcode2 + "','" + ocrcode3 + "','" + maincode + "','" + subwork + "'");
            list = (from x in tbl.AsEnumerable()
                    select new view
                    {
                        Code = x["Code"].ToString(),
                        Name = x["Name"].ToString()
                    }).ToList();
            var data = list.Select(x => new {
                x.Code,
                x.Name
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
        public JsonResult get_Receiptient_list(string DocType, string Project)
        {
            List<view> list = new List<view>();
            DataTable tbl = view.getTable("exec ICC_Get_Receiptient_list '" + DocType + "','" + Project + "'");
            list = (from x in tbl.AsEnumerable()
                    select new view
                    {
                        Code = x["Code"].ToString(),
                        Name = x["Name"].ToString()
                    }).ToList();
            var data = list.Select(x => new {
                x.Code,
                x.Name
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
       

        public JsonResult get_parents_by_project(string housecode)
        {
            v_Item house = db.v_Items.Where(y => y.HouseCode == housecode && y.HouseCode != null).Select(a => new v_Item { ItemCode = a.ItemCode, ItemName = a.ItemName }).FirstOrDefault();

            if (house == null)
            {
                house = new v_Item();
            }
            return Json(new
            {
                status = "OK",
                ItemHouse = house
            });
        }

        

        
        

       
       
        
        /// </summary>
        /// <returns></returns>
        public JsonResult get_BPCode(int groupcode)
        {
            string docnum = "";
            DataTable tbl = view.getTable("exec BP_Generator 'S','" + groupcode + "'", ConfigurationManager.AppSettings["sql"]);
            if (tbl.Rows.Count > 0)
            {
                docnum = tbl.Rows[0][0].ToString();
            }
            return Json(new
            {
                status = "OK",
                docnum = docnum
            });
        }

        
        public JsonResult get_district_by_province(string procode)
        {
            List<v_District> list = new List<v_District>();
            list = db.v_Districts.Where(x => x.U_Province == procode).ToList();
            var data = list.Select(x => new {
                x.Code,
                x.Name,
                x.U_Khmer,
                x.U_Province
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
        public JsonResult get_commune_by_district(string districtcode)
        {
            List<v_Commune> list = new List<v_Commune>();
            list = db.v_Communes.Where(x => x.U_Khan == districtcode).ToList();
            var data = list.Select(x => new {
                x.Code,
                x.U_Sangkat,
                x.U_AddressEn,
                x.U_AddressKh
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
        public JsonResult get_address(string commcode)
        {
            List<v_Commune> list = new List<v_Commune>();
            list = db.v_Communes.Where(x => x.Code == commcode).ToList();
            var data = list.Select(x => new {
                x.Code,
                x.U_Sangkat,
                x.U_AddressEn,
                x.U_AddressKh
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
        public JsonResult view_pr_boq(string procode, string zonecode, string housecode, string maincode, string subcode, string floorcode, string type)
        {
            List<v_BOQ> list = new List<v_BOQ>();
            list = (from x in view.getTable("exec get_PR_BOQ_list '" + procode + "','" + zonecode + "','" + housecode + "','" + maincode + "','" + subcode + "','" + floorcode + "','" + type + "'").AsEnumerable()
                    select new v_BOQ
                    {
                        VisOrder = Convert.ToInt32(x["VisOrder"].ToString()),
                        ChildNum = Convert.ToInt32(x["ChildNum"].ToString()),
                        ParentCode = x["ParentCode"].ToString(),
                        ParentName = x["ParentName"].ToString(),
                        ChildCode = x["ChildCode"].ToString(),
                        ChildName = x["ChildName"].ToString(),
                        OcrCode2Name = x["OcrCode2Name"].ToString(),
                        OcrCode3Name = x["OcrCode3Name"].ToString(),
                        MainWorkName = x["MainWorkName"].ToString(),
                        SubWorkName = x["SubWorkName"].ToString(),
                        FloorWorkName = x["FloorWorkName"].ToString(),
                        InvntryUom = x["InvntryUom"].ToString(),
                        Quantity = Convert.ToDecimal(x["Quantity"].ToString()),//total boq amount
                        U_PRQty = Convert.ToDecimal(x["PRClaim"].ToString()),//retension
                        U_PurQty = Convert.ToDecimal(x["OB"].ToString()),//total avail claim
                        U_GRPOAmt = Convert.ToDecimal(x["Blanace"].ToString())
                    }).ToList();
            var data = list.Select(x => new
            {
                x.VisOrder,
                x.ChildNum,
                x.ParentCode,
                x.ParentName,
                x.ChildCode,
                x.ChildName,
                x.OcrCode2Name,
                x.OcrCode3Name,
                x.MainWorkName,
                x.SubWorkName,
                x.FloorWorkName,
                x.InvntryUom,
                x.TotalAmount,
                x.Quantity,
                x.U_PRQty,
                x.U_PurQty,
                x.U_GRPOAmt
            }).ToList().OrderBy(a => a.VisOrder).ToList();

            var serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = Int32.MaxValue;

            var jsonResult = Json(data, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;

            //return Json(new { status = "OK", data = data },JsonRequestBehavior.AllowGet,);
        }


        public JsonResult checkUser()
        {
            string status = "OK";
            string changenext = "N";
            string authdone = "N";
            List<MenuSub> menumain = new List<MenuSub>();
            List<MenuSub> subl1 = new List<MenuSub>();
            List<MenuSub> subl2 = new List<MenuSub>();
            try
            {
                USR u = (USR)Session["USR"];
                if (u == null)
                {
                    status = "Expired";
                }
                else
                {
                    changenext = u.ChangeNext.Value.ToString();
                    menumain = (List<MenuSub>)Session["mm"];
                    subl1 = (List<MenuSub>)Session["sub1"];
                    subl2 = (List<MenuSub>)Session["sub2"];
                    authdone = Session["AuthDone"].ToString();
                }
            }
            catch (Exception ex) { }
            if (menumain == null)
            {
                menumain = new List<MenuSub>();
            }
            if (subl1 == null)
            {
                subl1 = new List<MenuSub>();
            }
            if (subl2 == null)
            {
                subl2 = new List<MenuSub>();
            }
            var mm = menumain.Select(x => new
            {
                x.MMCode
            }).ToList();
            var s1 = subl1.Select(x => new
            {
                x.MMCode,
                x.DocType
            }).ToList();
            var s2 = subl2.Select(x => new
            {
                x.MMCode,
                x.DocType,
                x.VisOrder,
                x.SMName,
                x.IsBOQ
            }).ToList();
            return Json(new
            {
                status = status,
                changenext = changenext,
                mm = mm,
                s1 = s1,
                s2 = s2,
                authdone = authdone
            });
        }
        public JsonResult cmd_update_done_authorize()
        {
            try
            {
                USR u = (USR)Session["USR"];
                if (u == null)
                {
                    status = "Expired";
                }
                else
                {
                    status = "OK";
                    Session["AuthDone"] = "Y";
                }
            }
            catch (Exception ex) { }
            return Json(new
            {
                status = status
            });
        }

        ////Attachment File
        public TransactionScope TransWithCommitted()
        {
            return new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = System.Transactions.IsolationLevel.ReadCommitted });
        }
        //public JsonResult SaveAttachmentFile(string DocType, string DateAndTime, string UserID, string BaseEntry)
        //{
        //    string status = "OK";
        //    string ErrMessage = "";
        //    string fullPath = "";
        //    string savename = "", checkSave = "";
        //    var trans = TransWithCommitted();
        //    try
        //    {
        //        using (trans)
        //        {
        //            int lastEntry = -1;
        //            HttpFileCollectionBase files = Request.Files;
        //            HttpPostedFileBase file;
        //            List<Attachment1> attList = new List<Attachment1>();
        //            Attachment1 att1 = new Attachment1();
        //            Attachment att = new Attachment();
        //            if (BaseEntry == "-1")
        //            {
        //                att.BaseType = DocType;
        //                att.CreatedDate = DateTime.Now;
        //                db.Attachments.InsertOnSubmit(att);
        //                db.Attachments.Context.SubmitChanges();
        //                lastEntry = att.DocEntry;
        //                for (int i = 0; i < files.Count; i++)
        //                {
        //                    file = files[i];
        //                    savename = DocType + "_" + DateAndTime + "_" + UserID + "_" + file.FileName.Replace("+", "_").Replace("-", "_").Replace(")", "_").Replace("(", "_").Replace("*", "_").Replace("&", "_").Replace("^", "_").Replace("%", "_").Replace("$", "_").Replace("#", "_").Replace("@", "_").Replace("!", "_").Replace("~", "_").Replace(" ", "_");
        //                    fullPath = Server.MapPath("~/AttachmentFile/" + DocType);
        //                    if (Directory.Exists(fullPath) == false)
        //                        Directory.CreateDirectory(fullPath);
        //                    if (System.IO.File.Exists(fullPath + "\\" + savename))
        //                        System.IO.File.Delete(fullPath + "\\" + savename);
        //                    file.SaveAs(fullPath + "\\" + savename);

        //                    att1 = new Attachment1();
        //                    att1.DocEntry = lastEntry;
        //                    att1.LineNum = (i + 1);
        //                    att1.OriName = file.FileName;
        //                    att1.SaveName = savename;
        //                    attList.Add(att1);
        //                }
        //                db.Attachment1s.InsertAllOnSubmit(attList);
        //                db.Attachment1s.Context.SubmitChanges();
        //            }
        //            else
        //            {
        //                att = db.Attachments.Where(a => a.BaseEntry == Int64.Parse(BaseEntry) && a.BaseType == DocType).FirstOrDefault();
        //                if (att != null)
        //                {
        //                    lastEntry = att.DocEntry;
        //                    int rowid = att.Attachment1s.ToList().LastOrDefault().LineNum;
        //                    for (int i = 0; i < files.Count; i++)
        //                    {
        //                        file = files[i];
        //                        savename = DocType + "_" + DateAndTime + "_" + UserID + "_" + file.FileName.Replace("+", "_").Replace("-", "_").Replace(")", "_").Replace("(", "_").Replace("*", "_").Replace("&", "_").Replace("^", "_").Replace("%", "_").Replace("$", "_").Replace("#", "_").Replace("@", "_").Replace("!", "_").Replace("~", "_").Replace(" ", "_");
        //                        checkSave = att.Attachment1s.Where(a => a.SaveName == savename).Select(b => b.SaveName).FirstOrDefault();
        //                        if (checkSave != savename)
        //                        {
        //                            fullPath = Server.MapPath("~/AttachmentFile/" + DocType);
        //                            if (Directory.Exists(fullPath) == false)
        //                                Directory.CreateDirectory(fullPath);
        //                            if (System.IO.File.Exists(fullPath + "\\" + savename))
        //                                System.IO.File.Delete(fullPath + "\\" + savename);
        //                            file.SaveAs(fullPath + "\\" + savename);

        //                            att1 = new Attachment1();
        //                            att1.DocEntry = lastEntry;
        //                            att1.LineNum = (rowid + 1);
        //                            att1.OriName = file.FileName;
        //                            att1.SaveName = savename;
        //                            attList.Add(att1);
        //                        }
        //                    }
        //                    db.Attachment1s.InsertAllOnSubmit(attList);
        //                    db.Attachment1s.Context.SubmitChanges();
        //                }
        //                else
        //                {
        //                    att = new Attachment();
        //                    att.BaseType = DocType;
        //                    att.CreatedDate = DateTime.Now;
        //                    db.Attachments.InsertOnSubmit(att);
        //                    db.Attachments.Context.SubmitChanges();
        //                    lastEntry = att.DocEntry;
        //                    for (int i = 0; i < files.Count; i++)
        //                    {
        //                        file = files[i];
        //                        savename = DocType + "_" + DateAndTime + "_" + UserID + "_" + file.FileName.Replace("+", "_").Replace("-", "_").Replace(")", "_").Replace("(", "_").Replace("*", "_").Replace("&", "_").Replace("^", "_").Replace("%", "_").Replace("$", "_").Replace("#", "_").Replace("@", "_").Replace("!", "_").Replace("~", "_").Replace(" ", "_");
        //                        checkSave = att.Attachment1s.Where(a => a.SaveName == savename).Select(b => b.SaveName).FirstOrDefault();
        //                        if (checkSave != savename)
        //                        {
        //                            fullPath = Server.MapPath("~/AttachmentFile/" + DocType);
        //                            if (Directory.Exists(fullPath) == false)
        //                                Directory.CreateDirectory(fullPath);
        //                            if (System.IO.File.Exists(fullPath + "\\" + savename))
        //                                System.IO.File.Delete(fullPath + "\\" + savename);
        //                            file.SaveAs(fullPath + "\\" + savename);

        //                            att1 = new Attachment1();
        //                            att1.DocEntry = lastEntry;
        //                            att1.LineNum = (i + 1);
        //                            att1.OriName = file.FileName;
        //                            att1.SaveName = savename;
        //                            attList.Add(att1);
        //                        }
        //                    }
        //                    db.Attachment1s.InsertAllOnSubmit(attList);
        //                    db.Attachment1s.Context.SubmitChanges();
        //                }
        //            }

        //            trans.Complete();
        //            trans.Dispose();
        //            ErrMessage = lastEntry.ToString();
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
        //public FileResult DownloadAttachment(string saveName, string DocType)
        //{
        //    string ReportURL = "", oriName = "";
        //    ReportURL = Server.MapPath("~/AttachmentFile/" + DocType + "/" + saveName);
        //    oriName = db.Attachment1s.Where(a => a.SaveName == saveName).FirstOrDefault().OriName;
        //    byte[] FileBytes = System.IO.File.ReadAllBytes(ReportURL);
        //    var ext = Path.GetExtension(oriName).ToLowerInvariant();
        //    return File(FileBytes, GetMimeTypes()[ext], oriName);
        //}
        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.ms-excel"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"},
                {".zip", "application/zip"}
            };
        }
    }
}
