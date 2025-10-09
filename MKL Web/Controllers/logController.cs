using MKL_Web.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace MKL_Web.Controllers
{
    public class logController : Controller
    {
        private MKLDataContext db = null;
        EncryptDecrypt.EncryptDecrypt en = new EncryptDecrypt.EncryptDecrypt();
        // GET: log
        public logController()
        {
            db = new MKLDataContext(ConfigurationManager.AppSettings["sql"].ToString());
        }
        public ActionResult log()
        {
            return View();
        }
        public JsonResult login(string userid, string pwd)
        {
            string status = "OK";
            string UserCode = "";
            string UserName = "";
            USR u = db.USRs.Where(y => y.UserCode.ToLower() == userid.ToLower()).FirstOrDefault();
            if (u == null)
            {
                u = new USR();
                status = "Fail";
            }
            else if (u.UserStatus == "Inactive")
            {
                u = new USR();
                status = "Inactive";
            }
            else
            {
                if (en.Decryption(u.Pwd).Replace("\0", string.Empty) == pwd)
                {
                    UserCode = u.UserCode;
                    UserName = u.UserName;
                    Session["USR"] = u;
                    Session["UCode"] = u.UserCode;
                    v_USR usr = db.v_USRs.Where(x => x.UserCode == u.UserCode).FirstOrDefault();
                    Session["UProfile"] = usr; //
                    List<v_USRAuth> menumain = new List<v_USRAuth>();
                    List<v_USRAuth> subl1 = new List<v_USRAuth>();
                    List<v_USRAuth> subl2 = new List<v_USRAuth>();
                    DataTable tbl = view.getTable("exec get_MainMenu_BY_User '" + u.UserCode + "'");
                    menumain = (from x in tbl.AsEnumerable()
                                select new v_USRAuth
                                {
                                    MMCode = Convert.ToChar(x["MMCode"].ToString()),
                                    SMName = x["MName"].ToString(),
                                    VisOrder = Convert.ToInt16(x["VisOrder"].ToString())
                                }).ToList();
                    tbl = view.getTable("exec get_MenuSub_BY_User_Level '" + u.UserCode + "',1");
                    subl1 = (from x in tbl.AsEnumerable()
                             select new v_USRAuth
                             {
                                 MMCode = Convert.ToChar(x["MMCode"].ToString()),
                                 DocType = x["DocType"].ToString(),
                                 SMName = x["SMName"].ToString(),
                                 SMCode = Convert.ToInt16(x["SMCode"].ToString()),
                                 VisOrder = Convert.ToInt16(x["VisOrder"].ToString()),
                                 URL = x["URL"].ToString(),
                                 Auth = Convert.ToChar(x["Auth"].ToString()),
                                 HideAmount = Convert.ToChar(x["HideAmount"].ToString()),
                                 FaFa = x["FaFa"].ToString(),
                             }).ToList();
                    tbl = view.getTable("exec get_MenuSub_BY_User_Level '" + u.UserCode + "',2");
                    subl2 = (from x in tbl.AsEnumerable()
                             select new v_USRAuth
                             {
                                 MMCode = Convert.ToChar(x["MMCode"].ToString()),
                                 DocType = x["DocType"].ToString(),
                                 VisOrder = Convert.ToInt32(x["VisOrder"].ToString()),
                                 SMName = x["SMName"].ToString(),
                                 IsBOQ = x["IsBOQ"].ToString(),
                                 URL = x["URL"].ToString(),
                                 Auth = Convert.ToChar(x["Auth"].ToString()),
                                 HideAmount = Convert.ToChar(x["HideAmount"].ToString()),
                                 LinkID = Convert.ToInt32(x["LinkID"].ToString()),
                                 AppRetension = x["AppRetension"].ToString(),
                                 SMCode = Convert.ToInt32(x["SMCode"].ToString()),
                                 FaFa = x["FaFa"].ToString(),
                             }).ToList();
                    Session["mm"] = menumain;
                    Session["sub1"] = subl1;
                    Session["sub2"] = subl2;
                    Session["AuthDone"] = "N";
                }
                else
                {
                    status = "Fail";
                }
            }
            return Json(new
            {
                status = status,
                UserCode = UserCode,
                UserName = UserName
            });
        }
        public JsonResult change_password(string UserCode, string oldpwd, string Pwd)
        {
            string status = "OK";
            USR u = db.USRs.Where(x => x.UserCode == UserCode).FirstOrDefault();
            if (u != null)
            {
                if (u.Pwd == en.Encryption(oldpwd))
                {
                    u.Pwd = en.Encryption(Pwd);
                    u.ChangeNext = 'N';
                    db.USRs.Context.SubmitChanges();
                    Session["USR"] = u;
                }
                else
                {
                    status = "Incorrect Old Password";
                }
            }
            return Json(new
            {
                status = status
            });
        }
        public JsonResult get_acc_info(string id)
        {
            string status = "OK";
            MKL_Web.Models.USR u = db.USRs.Where(x => x.UserCode == id).FirstOrDefault();
            string uname = u.UserName;
            return Json(new
            {
                status = "OK",
                uname = uname
            });
        }
    }
}