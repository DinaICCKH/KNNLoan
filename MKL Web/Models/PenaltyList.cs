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

        public int InstallmentRow { get; set; }
        public int InstallmentID { get; set; }

        public string FromPaymentDate { get; set; }   // dd-MMM-yyyy
        public string TOPaymentDate { get; set; }     // dd-MMM-yyyy

        public decimal CHQAmt { get; set; }
        public decimal PrincipleAmt { get; set; }
        public decimal PenaltyPercent { get; set; }

        public int TotalOverDay { get; set; }
        public decimal TotalPenalty { get; set; }
        public decimal TotalWaiveAmt { get; set; }
        public decimal TotalNetAmt { get; set; }

        public string OcrCode { get; set; }
        public string OcrCode2 { get; set; }
        public string OcrCode3 { get; set; }
        public string OcrCode4 { get; set; }
        public string OcrCode5 { get; set; }

        public string Status { get; set; }
        public string ApprovalTemplate { get; set; }
        public string ApprovalDate { get; set; }      // dd-MMM-yyyy
        public string LastApproval { get; set; }

        public string WaiveName { get; set; }
        public decimal ApplyPercent { get; set; }

        public string IDs { get; set; }               // 29224;29225;29226...
        public string Remark { get; set; }
    }


    public class InterestWizardItem
    {
        public int ID { get; set; }
        public string PaymentDate { get; set; }
        public string DueDate { get; set; }
        public string BaseEntry { get; set; } = string.Empty;
        public string ItemCode { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public string DistNumber { get; set; } = string.Empty; // Serial number
        public decimal OriginalInterest { get; set; } = 0;
        public decimal ApplyInterest { get; set; } = 0;
        public decimal Remaining { get; set; } = 0;
        public string Method { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public string CardCode { get; set; } = string.Empty;
        public string CardName { get; set; } = string.Empty;
    }

}