using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MKL_Web.Models
{
    public class view
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public static DataTable getTable(string sqltext,string constr)
        {
            DataTable tbl = new DataTable();
            SqlDataAdapter dap = new SqlDataAdapter(sqltext, constr);
            dap.Fill(tbl);
            return tbl;
        }
        public static DataTable getTable(string sqltext)
        {
            DataTable tbl = new DataTable();
            SqlDataAdapter dap = new SqlDataAdapter(sqltext, ConfigurationManager.AppSettings["sql"].ToString());
            dap.Fill(tbl);
            return tbl;
        }
        public static string getSalesDocNum(string sqltext, string constr)
        {
            string docnum = "";
            DataTable tbl = new DataTable();
            SqlDataAdapter dap = new SqlDataAdapter(sqltext, constr);
            dap.Fill(tbl);
            if (tbl.Rows.Count > 0)
            {
                docnum = tbl.Rows[0][0].ToString();
            }
            return docnum;
        }
    }
}