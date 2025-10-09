using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MKL_Web.Models
{
    public class Customerlist
    {
        public String CardCode { get; set; }
        public String CardName { get; set; }
        public Decimal BalanceFC { get; set; }
        public Decimal Balance { get; set; }
    }
}