using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MKL_Web_Borey.Models
{
    public class Payment_Schedule
    {        
        public string ID { get; set; }
        public string Remove { get; set; }
        public string Method { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string RowNo { get; set; }
        public string MonthlyPay { get; set; }
        public string Principle { get; set; }
        public string Interest { get; set; }
        public string AccAmt { get; set; }
        public string RemainingAmt { get; set; }
        public string InstallmentDate { get; set; }
        public string DueDate { get; set; }
        public string U_Period { get; set; }
        public string U_AnnulRate { get; set; }
        public string DepositAmt { get; set; }
        public string CuInterest { get; set; }
        public string CuPayment { get; set; }
        public string BaseEntry { get; set; }
        public string Status { get; set; }
        public string BaseLine { get; set; }
        public string ARNo { get; set; }
        public string PaymentNo { get; set; }
        public string FixedPayment { get; set; }
        public string HouseStatus { get; set; }
        public string Remarks { get; set; }
        public string CardCode { get; set; }
        public string CardName { get; set; }
        public string DocNum { get; set; }
        public string DocDate { get; set; }
        public string DeliveryDate { get; set; }
        public string OcrCode { get; set; }
        public string OcrCode2 { get; set; }
        public string OcrCode3 { get; set; }
        public string HouseAmount { get; set; }
        public string AdditionalAmt { get; set; }
        public string DiscountAmount { get; set; }
        public string DiscountPer { get; set; }
        public string SpecialDisAmount { get; set; }
        public string SpecialDisPer { get; set; }
        public string DocEntry { get; set; }
        public string PaymentOptionName { get; set; }
        public string InstallmentAmt { get; set; }
        public string LineNum { get; set; }
        public string Referral { get; set; }
        public string ConPeriod { get; set; }
        public string DocStatus { get; set; }
        public string PaidDate { get; set; }
        public string PaidAmt { get; set; }

        public string NewItemCode { get; set; }
        public string NewItemName { get; set; }
        public string BuybackAmt { get; set; }
        public string GeneratedARAmt { get; set; }
        public string OutstandingAmt { get; set; }
        public string VarianAmt { get; set; }
        public string DistNumber { get; set; }

        public string PaymentDateNew { get; set; }
        public string ChnageDateStatus { get; set; }
        public string HiglightStatus { get; set; }
        public string ARNoInterest { get; set; }
        public string PaymentNoInterest { get; set; }
    }

    public class LoanActivityDto
    {
        public string Remove { get; set; }

        public int? ID { get; set; }
        public int? VisOrder { get; set; }

        public string ItemCode { get; set; }
        public string ItemName { get; set; }

        public decimal? Principle { get; set; }
        public decimal? Interest { get; set; }
        public decimal? Monthly { get; set; }

        public DateTime? PaymentDate { get; set; }
        public DateTime? DueDate { get; set; }

        public string Method { get; set; }
        public int? ARNo { get; set; }

        public decimal? ARBalance { get; set; }
        public decimal? OpenBalanceAR { get; set; }

        public int? ARNoInterest { get; set; }

        public decimal? IntBalance { get; set; }
        public decimal? OpenIntBalance { get; set; }
        public decimal? AccrualPenalty { get; set; }

        public string Remarks { get; set; }
        public string Serial { get; set; }

        

        public string Model { get; set; }
        public string SaleEmp1 { get; set; }
        public string SaleEmp2 { get; set; }
        public int? RemaincheqQty { get; set; }
        public int? OverDuecheqQty { get; set; }
        public decimal? SumOverDuecheq { get; set; }
        public decimal? SumOpenAR { get; set; }
        public int? OverDueDay { get; set; }

        public int? BaseEntry { get; set; }
        public int? BaseID { get; set; }

    }
}