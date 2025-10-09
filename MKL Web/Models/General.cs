using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MKL_Web.Models
{
    public class ARMemo
    {
        public int DocEntry { get; set; }
        public string DocNum { get; set; }
        public string DocCur { get; set; }
        public decimal ExchangeRate { get; set; }
        public string CardCode { get; set; }
        public string CardName { get; set; }
        public int? CntctCode { get; set; }
        public string NumAtCard { get; set; }
        public DateTime DocDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime DocumentDate { get; set; }
        public int SlpCode { get; set; }
        public int OwnerCode { get; set; }
        public string Term { get; set; }
        public string Reason { get; set; }
        public string Comment { get; set; }
        public decimal SubTotal { get; set; }
        public decimal DiscountAmt { get; set; }
        public decimal DiscountPer { get; set; }
        public decimal DownAmt { get; set; }
        public decimal DepositAmt { get; set; }
        public decimal DocTotalBef { get; set; }
        public decimal TaxAmt { get; set; }
        public decimal PaidAmt { get; set; }
        public decimal BalanceDue { get; set; }
        public int SAPDocEntry { get; set; }
        public string LastError { get; set; }
        public string DocStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int UpdatedBy { get; set; }
        public string CancelledBy { get; set; }
        public DateTime? CancelledDate { get; set; }
        public string PaymentOption { get; set; }
        public string Referral { get; set; }
        public int ConPeriod { get; set; }
        public string OcrCode { get; set; }
        public string SapCancelStatus { get; set; }
        public string SAPIntegrationStatus { get; set; }
    }


    public class WizardHeader
    {
        public DateTime PenaltyDate { get; set; }
        public string DocNumRef { get; set; }
        public string Remark { get; set; }
        public string WaiveOption { get; set; }
    }

}