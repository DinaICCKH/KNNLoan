using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MKL_Web.Models;
namespace MKL_Web.Controllers
{
    public class getDataSalesController : Controller
    {
        // GET: getDataSales
        private MKLDataContext db = null;
        private string status = "OK";
        public getDataSalesController()
        {
            db = new MKLDataContext(ConfigurationManager.AppSettings["sql"].ToString());
        }
        public JsonResult get_contact_person(string cardcode)
        {
            List<OCPR> list = new List<OCPR>();
            list = db.OCPRs.Where(x => x.CardCode==cardcode).ToList();
            if (list == null)
            {
                list = new List<OCPR>();
            }
            var data = list.Select(x => new {
                x.Cntctcode,
                x.CardCode,
                x.ENName,
                x.KHName
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
        public JsonResult get_bocking(string cardcode)
        {
            List<v_InstallmentRow> list = new List<v_InstallmentRow>();
            list = db.v_InstallmentRows.Where(x => x.CardCode == cardcode && x.Method=="B").ToList();
            if (list == null)
            {
                list = new List<v_InstallmentRow>();
            }
            var data = list.OrderBy(x=> new {x.BaseEntry,x.VisOrder}).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
        public JsonResult get_installmentrow_list(int BaseEntry)
        {
            List<v_InstallmentRow> list = new List<v_InstallmentRow>();
            list = db.v_InstallmentRows.Where(x => x.BaseEntry == BaseEntry).ToList();
            if (list == null)
            {
                list = new List<v_InstallmentRow>();
            }
            var data = list.OrderBy(x => new { x.BaseEntry, x.VisOrder }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
        public JsonResult get_district_by_province(string procode)
        {
            List<v_District> list = new List<v_District>();
            list = db.v_Districts.Where(x=>x.U_Province==procode).ToList();
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
            list = db.v_Communes.Where(x=>x.U_Khan==districtcode).ToList();
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
            list = db.v_Communes.Where(x => x.Code==commcode).ToList();
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

        public JsonResult get_availabl_house_change_price(string procode, string block, string housecode,string subitemgroup,string houseother)
        {
            List<v_Item_House> list = db.v_Item_Houses.ToList();
            if (procode != "")
            {
                list = list.Where(x => x.Project == procode).ToList();
            }
            if (block != "")
            {
                list = list.Where(x => x.Zone == block).ToList();
            }
            if (housecode != "")
            {
                list = list.Where(x => x.HouseCode.ToLower().Contains(housecode.ToLower())).ToList();
            }
            if (subitemgroup != "")
            {
                list = list.Where(x => x.U_SubGroup== subitemgroup).ToList();
            }
            if (houseother != "")
            {
                list = list.Where(x => x.U_Other == houseother).ToList();
            }
            var data = list.Select(x => new {
                x.ItemCode,
                x.ItemName,
                x.HouseAmount,
                x.Project,
                x.ProjectName,
                x.Zone,
                x.ZoneName,
                x.HouseCode,
                x.HouseName,
                x.U_SubGroup,
                x.U_Street,
                x.HouseNo,
                x.U_ConstrArea,
                x.U_LandSize,
                x.U_Walkway,
                x.SubGroupName,
                x.U_Other,
                x.OtherName,
                UpdatedDate=x.UpdatedDate==null?"": x.UpdatedDate.Value.ToString("dd-MMM-yyyy"),
                currentDate = DateTime.Now.ToString("dd-MMM-yyyy")
            }).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
        public JsonResult get_invoice_listing(string procode, string block, string cardcode)
        {
            List<v_AR_List> list = db.v_AR_Lists.ToList();
            if (procode != "")
            {
                list = list.Where(x => x.OcrCode == procode).ToList();
            }
            if (block != "")
            {
                list = list.Where(x => x.OcrCode2 == block).ToList();
            }
            if (cardcode != "")
            {
                list = list.Where(x => x.CardCode==cardcode).ToList();
            }
            var data = list.Select(x => new {
                x.DocEntry,
                x.DocNum,
                DocDate=x.DocDate.Value.ToString("dd-MMM-yyyy"),
                DueDate=x.DueDate.Value.ToString("dd-MMM-yyyy"),
                x.NumatCard,
                x.CardCode,
                x.CardName,
                x.SubTotal,
                x.OcrCode,
                x.OcrCode2,
                x.OcrCode3,
                x.DocStatus,
                x.SAPIntegrationStatus
            }).OrderBy(a=>a.DocNum).ToList();
            return Json(new
            {
                status = "OK",
                data = data
            });
        }
        public JsonResult Get_Document_Number(string project, DateTime docdate,string docType)
        {

            string sqltext = "exec ICC_Get_DocNum '" + project + "','"+ docdate + "','"+ docType+"'";
            string docnum = (from x in view.getTable(sqltext, ConfigurationManager.AppSettings["sql"].ToString()).AsEnumerable() select x["DocNum"].ToString()).FirstOrDefault();
                
            return Json(new
            {
                status = "OK",
                data = docnum
            });
        }
    }
}