using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MKL_Web.Models
{
    public class PenaltyList
    {
        public string Select { get; set; }
        public string CustomerCode { get; set; }
        public string Branch { get; set; }
        public string CustomerName { get; set; }
        public string HouseNo { get; set; }
        public string DocNo { get; set; }
        public string DocumentNumber { get; set; }
        public string DueDate { get; set; }
        public string DocumentAmountLC { get; set; }
        public string OpenAmountLC { get; set; }
        public string InterestDays { get; set; }
        public string InterestMonths { get; set; }
        public string InterestPercent { get; set; }
        public string InterestAmountLC { get; set; }
        public string TotalInclInterestLC { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
    }


    public class PenaltyGenerateTable
    {
        public string CardCode { get; set; }
        public string CardName { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string Comment { get; set; }
        public string SerialNo { get; set; }

        public int ID { get; set; }
        public int InstallmentID { get; set; }

        public string DueDate { get; set; }           // Formatted as "dd-MMM-yyyy"
        public string PaymentDate { get; set; }       // Formatted as "dd-MMM-yyyy"

        public decimal CHQAmt { get; set; }
        public decimal PrincipleAmt { get; set; }
        public decimal InterestAmt { get; set; }
        public decimal OutStandingAmt { get; set; }
        public decimal PenaltyPercent { get; set; }
        public decimal PenaltyAmt { get; set; }

        public int OverDay { get; set; }

        public string Remark { get; set; }
        public string OcrCode { get; set; }
        public string OcrCode2 { get; set; }
        public string OcrCode3 { get; set; }
        public string OcrCode4 { get; set; }
        public string OcrCode5 { get; set; }

        public string Status { get; set; }
        public string ApprovalTemplate { get; set; }

        public string ApprovalDate { get; set; }       // Formatted as "dd-MMM-yyyy"
        public string LastApproval { get; set; }

        public string WaiveName { get; set; }
        public decimal ApplyPercent { get; set; }
        public decimal WaiveAmt { get; set; }
        public decimal NetAmt { get; set; }
    }

}