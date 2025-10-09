using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using MKL_Web.Models;

namespace MKL_Web.Controllers
{

    public class masterController : Controller
    {
        // GET: master
        private MKLDataContext db = null;
        public masterController()
        {
            db = new MKLDataContext(ConfigurationManager.AppSettings["sql"].ToString());
        }
        public ActionResult addBP()
        {
            ViewBag.province = db.v_Provinces.ToList();
            ViewBag.infosource = db.v_InforSources.ToList();
            ViewBag.term = db.v_PaymentTerms.ToList();
            ViewBag.pricelist = db.v_PriceLists.ToList();
            ViewBag.cur = db.v_Currencies.ToList();
            ViewBag.bpgroup = db.v_BPGroups.Where(x => x.GroupType != 'S').ToList();
            ViewBag.relation = db.v_Relationships.ToList();
            return View();
        }

        public ActionResult editBP(string key)
        {
            ViewBag.vender = db.v_Vendors.Where(x => x.CardCode == key).FirstOrDefault();
            ViewBag.address = db.CRD1s.Where(x => x.CardCode == key).ToList();
            ViewBag.contact = db.OCPRs.Where(x => x.CardCode == key).ToList();
            ViewBag.province = db.v_Provinces.ToList();
            ViewBag.district = db.v_Districts.ToList();
            ViewBag.commune = db.v_Communes.ToList();
            ViewBag.infosource = db.v_InforSources.ToList();
            ViewBag.term = db.v_PaymentTerms.ToList();
            ViewBag.pricelist = db.v_PriceLists.ToList();
            ViewBag.cur = db.v_Currencies.ToList();
            ViewBag.bpgroup = db.v_BPGroups.Where(x => x.GroupType != 'S').ToList();
            ViewBag.relation = db.v_Relationships.ToList();
            return View();
        }

        public ActionResult viewBP()
        {
            ViewBag.vender = db.v_Vendors.Where(x => x.CardType.ToString() != "S").ToList();
            return View();
        }

        public ActionResult viewItem()
        {
            ViewBag.Item = db.v_Items.ToList();
            return View();
        }

        public ActionResult addVendor()
        {
            ViewBag.province = db.v_Provinces.ToList();
            ViewBag.infosource = db.v_InforSources.ToList();
            ViewBag.term = db.v_PaymentTerms.ToList();
            ViewBag.pricelist = db.v_PriceLists.ToList();
            ViewBag.cur = db.v_Currencies.ToList();
            ViewBag.bpgroup = db.v_BPGroups.Where(x => x.GroupType == 'S').ToList();
            ViewBag.relation = db.v_Relationships.ToList();
            return View();
        }
        public ActionResult editVendor(string key)
        {
            ViewBag.vender = db.v_Vendors.Where(x => x.CardCode == key).FirstOrDefault();
            ViewBag.address = db.CRD1s.Where(x => x.CardCode == key).ToList();
            ViewBag.contact = db.OCPRs.Where(x => x.CardCode == key).ToList();
            ViewBag.province = db.v_Provinces.ToList();
            ViewBag.district = db.v_Districts.ToList();
            ViewBag.commune = db.v_Communes.ToList();
            ViewBag.infosource = db.v_InforSources.ToList();
            ViewBag.term = db.v_PaymentTerms.ToList();
            ViewBag.pricelist = db.v_PriceLists.ToList();
            ViewBag.cur = db.v_Currencies.ToList();
            ViewBag.bpgroup = db.v_BPGroups.Where(x => x.GroupType == 'S').ToList();
            ViewBag.relation = db.v_Relationships.ToList();
            return View();
        }
        public ActionResult viewVendor()
        {
            ViewBag.vender = db.v_Vendors.Where(x => x.CardType.ToString() == "S").ToList();
            return View();
        }
        public TransactionScope TransWithCommitted()
        {
            return new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = System.Transactions.IsolationLevel.ReadCommitted });
        }
        public string get_BPCode(string cardtype, int groupcode)
        {
            string docnum = "";
            DataTable tbl = view.getTable("exec BP_Generator '" + cardtype + "','" + groupcode + "'", ConfigurationManager.AppSettings["sql"]);
            if (tbl.Rows.Count > 0)
            {
                docnum = tbl.Rows[0][0].ToString();
            }
            return docnum;
        }
        public JsonResult cmd_remove_bp(OCRD header)
        {
            string status = "OK";
            try
            {

                    var trans = TransWithCommitted();
                    using (trans)
                    {
                        OCRD ocrd = db.OCRDs.Where(x => x.CardCode == header.CardCode).FirstOrDefault();
                        if (ocrd != null)
                        {
                            List<CRD1> add = db.CRD1s.Where(x => x.CardCode == header.CardCode).ToList();
                            List<OCPR> contact = db.OCPRs.Where(x => x.CardCode == header.CardCode).ToList();
                            db.CRD1s.DeleteAllOnSubmit(add);
                            db.CRD1s.Context.SubmitChanges();
                            db.OCPRs.DeleteAllOnSubmit(contact);
                            db.OCPRs.Context.SubmitChanges();
                            db.OCRDs.DeleteOnSubmit(ocrd);
                            db.OCRDs.Context.SubmitChanges();
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
            return Json(new
            {
                status = status
            });
        }
        public JsonResult cmd_save_bp(OCRD header, List<CRD1> address, List<OCPR> contact)
        {
            string status = "OK";
            try
            {
                try
                {
                    string cardcode = get_BPCode(header.CardType, (int)header.GroupCode);
                    var trans = TransWithCommitted();
                    using (trans)
                    {
                        OCRD ocrd = db.OCRDs.Where(x => x.CardCode == header.CardCode).FirstOrDefault();
                        if (ocrd == null)
                        {
                            DateTime d = Convert.ToDateTime(header.DOB);
                            ocrd = header;
                            ocrd.CardCode = cardcode;
                            ocrd.Status = "Active";
                            if (d.Year == 1999)
                            {
                                ocrd.DOB = null;
                            }
                            ocrd.CreatedDate = DateTime.Now;
                            db.OCRDs.InsertOnSubmit(ocrd);
                            db.OCRDs.Context.SubmitChanges();
                            if (address != null)
                            {
                                List<CRD1> addrss = address.Where(x => x.Khan != null).ToList();
                                db.CRD1s.InsertAllOnSubmit(addrss);
                                db.CRD1s.Context.SubmitChanges();
                            }
                            if (contact != null)
                            {
                                List<OCPR> newcontact = contact.Where(x => x.ENName != null).ToList();
                                db.OCPRs.InsertAllOnSubmit(newcontact);
                                db.OCPRs.Context.SubmitChanges();
                            }
                        }
                        else
                        {
                            ocrd.CardType = header.CardType;
                            ocrd.CardName = header.CardName;
                            ocrd.FrgnName = header.FrgnName;
                            ocrd.GroupCode = header.GroupCode;
                            ocrd.Currency = header.Currency;
                            ocrd.Tel1 = header.Tel1;
                            ocrd.Tel2 = header.Tel2;
                            ocrd.Email = header.Email;
                            ocrd.IDNo = header.IDNo;
                            ocrd.Gender = header.Gender;
                            DateTime d = Convert.ToDateTime(header.DOB);
                            if (d.Year == 1999)
                            {
                                ocrd.DOB = null;
                            }
                            else
                            {
                                ocrd.DOB = header.DOB;
                            }
                            ocrd.Source = header.Source;
                            ocrd.Pricelist = header.Pricelist;
                            ocrd.PaymentTerm = header.PaymentTerm;
                            ocrd.CreditLimit = header.CreditLimit;
                            ocrd.UpdatedBy = header.CreatedBy;
                            ocrd.UpdatedDate = DateTime.Now;
                            db.OCRDs.Context.SubmitChanges();
                            if (address != null)
                            {
                                CRD1 add = db.CRD1s.Where(x => x.CardCode == header.CardCode).ToList().LastOrDefault();
                                int lastaddline = 0;
                                if (add == null)
                                {
                                    lastaddline = 0;
                                }
                                else
                                {
                                    lastaddline = add.Linenum;
                                }
                                lastaddline++;
                                List<CRD1> addrss = address.Where(x => x.Khan != null).ToList();
                                foreach (var x in addrss)
                                {
                                    add = null;
                                    add = db.CRD1s.Where(y => y.CardCode == x.CardCode && y.Linenum == x.Linenum).FirstOrDefault();
                                    if (add == null)
                                    {
                                        if (x.Telegram != "Delete")
                                        {
                                            x.Linenum = lastaddline;
                                            add = x;
                                            db.CRD1s.InsertOnSubmit(add);
                                            db.CRD1s.Context.SubmitChanges();
                                            lastaddline++;
                                        }
                                    }
                                    else
                                    {
                                        if (x.Telegram != "Delete")
                                        {
                                            add.Province = x.Province;
                                            add.Khan = x.Khan;
                                            add.Sangkat = x.Sangkat;
                                            add.FullAddressKH = x.FullAddressKH;
                                            add.FullAddressEN = x.FullAddressEN;
                                            add.PostCode = x.PostCode;
                                            add.AddressType = x.AddressType;
                                            db.CRD1s.Context.SubmitChanges();
                                        }
                                        else
                                        {
                                            db.CRD1s.DeleteOnSubmit(add);
                                            db.CRD1s.Context.SubmitChanges();
                                        }
                                    }
                                }
                            }
                            if (contact != null)
                            {
                                OCPR con = null;
                                List<OCPR> newcontact = contact.Where(x => x.ENName != null).ToList();
                                foreach (var x in newcontact)
                                {
                                    con = null;
                                    con = db.OCPRs.Where(y => y.CardCode == x.CardCode && y.Cntctcode == x.Cntctcode).FirstOrDefault();
                                    if (con == null)
                                    {
                                        if (x.Status != "Delete")
                                        {
                                            con = x;
                                            db.OCPRs.InsertOnSubmit(con);
                                            db.OCPRs.Context.SubmitChanges();
                                        }
                                    }
                                    else
                                    {
                                        if (x.Status == "Delete")
                                        {
                                            db.OCPRs.DeleteOnSubmit(con);
                                            db.OCRDs.Context.SubmitChanges();
                                        }
                                        else
                                        {
                                            con.ENName = x.ENName;
                                            con.KHName = x.KHName;
                                            con.Gender = x.Gender;
                                            con.ID = x.ID;
                                            con.Relationship = x.Relationship;
                                            con.Address = x.Address;
                                            con.Tel1 = x.Tel1;
                                            con.Tel2 = x.Tel2;
                                            con.Email = x.Email;
                                            con.Telegram = x.Telegram;
                                            con.Facebook = x.Facebook;
                                            con.Whatapp = x.Whatapp;
                                            con.Line = x.Line;
                                            db.OCPRs.Context.SubmitChanges();
                                        }
                                    }
                                }
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
            catch (Exception ex)
            {
                status = "Failed";
            }
            return Json(new
            {
                status = status
            });
        }
    }
}