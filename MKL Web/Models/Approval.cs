using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MKL_Web.Models
{
    public class ApprovalTemplate
    {
        public int AppStageCode { get; set; }
        public int AppTemplateID { get; set; }
        public string TemplateDesc { get; set; }
        public string Type { get; set; }
        public decimal FromAmt { get; set; }
        public decimal ToAmt { get; set; }
        public string DocID { get; set; }
        public string NextApprover { get; set; }
    }

    public class ExcecResult
    {
        public string Result { get; set; }
        public int AutoGenerateID { get; set; }
    }

}