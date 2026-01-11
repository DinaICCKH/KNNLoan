
function txt_booking_amount_change() {
    var booking_amount = returnstringvalue($("#txt_booking_amount").val());
    var after_dis = returnstringvalue($("#txt_after_discount").val());
    var booking_per = (parseFloat(booking_amount) / parseFloat(after_dis))*100;
    $("#txt_booking_per").val(convert2digit(booking_per));
    $("#txt_booking_amount").val(convert2digit(booking_amount));

    var remaining_amount = parseFloat(after_dis) - parseFloat(booking_amount);
    $("#txt_remaining_amount").val(convert2digit(remaining_amount));
}
function txt_doc_date_change() {
    Get_Document_Number_Booking('SOR');
    txt_doc_update_delivery_box();
}
function txt_doc_update_delivery_box() {
    var docdate = $("#txt_doc_date").val();
    var conPeriod = $("#txt_con_period").val();
    if (conPeriod == "") {
        var date = new Date(docdate);
    } else {
        var date = new Date(docdate).addMonths(conPeriod);
    }
    var strDate = date.toString().split(' ');
    $("#txt_due_date").val(strDate[2] + '-' + strDate[1] + '-' + strDate[3]);
}
function txt_booking_per_change() {
    var booking_per = returnstringvalue($("#txt_booking_per").val());
    var after_dis = returnstringvalue($("#txt_after_discount").val());
    $("#txt_booking_per").val(convert2digit(booking_per));

    var booking_amount = parseFloat(after_dis) * (parseFloat(booking_per) / 100);

    $("#txt_booking_amount").val(convert2digit(booking_amount));
    
    var remaining_amount = parseFloat(after_dis) - parseFloat(booking_amount);
    $("#txt_remaining_amount").val(convert2digit(remaining_amount));
}
function save_booking() {
    var docdate = $('#txt_doc_date').val();
    var docdue = $('#txt_due_date').val();
    if ($("#txt_card_code").val() == "" || returnstringvalue($("#txt_booking_amount").val())==0) {
        ShowAlert("Customer code and booking amount can not empty!");
    }else if (new Date(docdate) > new Date()) {
        ShowAlert("Cannot post booking in future date!");
    } else if(new Date(docdate)>new Date(docdue)){
        ShowAlert("Delivery Date cannot less than Posting Date!");
    } else if ($("#txt_referral").val() == "") {
        ShowAlert("Referral cannot empty!");
    }else {
        var docdate = docdate.trim().split("-");
        var reqdate = docdue.trim().split("-");
        var befDis = returnstringvalue($("#txt_before_discount_amount").val());
        var DisAmt = parseFloat(returnstringvalue($("#txt_discount_amount").val())) + parseFloat(returnstringvalue($("#txt_special_dis_amount").val()));
        var disPer = (parseFloat(DisAmt) / parseFloat(befDis)) * 100;
        var head = {
            DocEntry: $("#txt_dockey").val(),
            DocDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            DueDate: reqdate[2] + "/" + reqdate[1] + "/" + reqdate[0],
            CardCode: $("#txt_card_code").val(),
            CardName: $("#txt_card_name").val(),
            ContactPerson: $("#cbo_contact_person").val(),
            NumatCard: $("#txt_house_code").val(),
            SubTotal: returnstringvalue($("#txt_after_discount").val()),
            DiscountAmt: DisAmt,
            DiscountPer: disPer,
            BalanceDue: returnstringvalue($("#txt_after_discount").val()),
            DepositAmt: returnstringvalue($("#txt_booking_amount").val()),
            DepositPer: returnstringvalue($("#txt_booking_per").val()),
            DocTotalBef: befDis,
            CreatedBy: $("#txt_shared_userid").val(),
            Referral: $("#txt_referral").val(),
            ConPeriod: $("#txt_con_period").val(),
            OcrCode: $("#txt_ocrcode").val()
        };
        var detail = {
            LineNum: "-1",
            ItemCode: $("#txt_item_code").val(),
            ItemName: $("#txt_item_name").val(),
            LineTotal: returnstringvalue($("#txt_after_discount").val()),
            Principle: returnstringvalue($("#txt_booking_amount").val()),
            Interest: "0",
            Monthly: returnstringvalue($("#txt_booking_amount").val()),
            PaymentDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            DueDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            Remaining: returnstringvalue($("#txt_remaining_amount").val()),
            ReIncloudInter: returnstringvalue($("#txt_remaining_amount").val()),
            RowStatus: "O",
            CuInterest: "0",
            CuPayment: returnstringvalue($("#txt_booking_amount").val()),
            FixedPayment: "0",
            Method: "B",
            InstallmentAmt: returnstringvalue($("#txt_after_discount").val()),
            DiscountAmt: "0",
            DepositAmt: returnstringvalue($("#txt_booking_amount").val()),
            AnnualRate: "0",
            PeriodMonths: "0",
            HouseStatus: "D",
            Remarks: "Deposit Closure",
            DiscountAmount: returnstringvalue($("#txt_discount_amount").val()),
            DiscountPer: returnstringvalue($("#txt_discount_per").val()),
            SpecialDisAmount: returnstringvalue($("#txt_special_dis_amount").val()),
            SpecialDisPer: returnstringvalue($("#txt_special_dis_per").val()),
            AdditionalDisAmount: "0",
            AdditionalDisPer: "0",
            OcrCode: $("#txt_ocrcode").val(),
            OcrCode2: $("#txt_ocrcode2").val(),
            OcrCode3: $("#txt_ocrcode3").val()
        };

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/sales/save_booking',
            data: JSON.stringify(
                {
                    'header': head,
                    'detail': detail
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    location.reload();
                    ShowAlert("Booking was saved");
                } else {
                    ShowAlert("Error while saving booking!");
                }

            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}
function cancel_booking(){
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/sales/cancel_booking',
        data: JSON.stringify(
            {
                'DocKey': $("#txt_dockey").val(),
                'user': $("#txt_shared_userid").val()
            }),
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status == "OK") {
                location.reload();
                ShowAlert("Booking was cancelled");
            } else {
                ShowAlert("Error while cancelling booking!");
            }

        },
        failure: function (response) {
            $('#result').html(response);
        }
    });
}
