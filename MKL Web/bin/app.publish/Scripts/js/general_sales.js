function cmd_show_customer() {
    $("#modal-cust_list").modal('show');
}
function tr_pop_customer_selected(selectedindex) {
    $("#table_pop_customer_list > tbody > tr").each(function (index) {
        $("#tr_pop_customer_" + (index + 1)).css("background-color", "white");
    });
    $("#tr_pop_customer_" + selectedindex).css("background-color", "#e6f0ff");
    $("#txt_bp_selected_row").val(selectedindex);
}
function tr_pop_customer_new_selected(selectedindex) {
    $("#table_pop_customer_new_list > tbody > tr").each(function (index) {
        $("#tr_pop_customer_new_" + (index + 1)).css("background-color", "white");
    });
    $("#tr_pop_customer_new_" + selectedindex).css("background-color", "#e6f0ff");
    $("#txt_bp_selected_row").val(selectedindex);
}
function pop_payment_schedule_selected(selectedindex) {
    $("#table_pop_schedule_list > tbody > tr").each(function (index) {
        $("#tr_pop_payment_schedule_" + (index + 1)).css("background-color", "white");
    });
    $("#tr_pop_payment_schedule_" + selectedindex).css("background-color", "#e6f0ff");
    $("#txt_payment_schedule_selected_row").val(selectedindex);
}

function cmd_pop_choose_customer() {
    var id = $("#txt_bp_selected_row").val();
    var cardcode = $("#td_pop_vendor_cust_code_" + id).text();
    var cardname = $("#td_pop_vendor_cust_name_" + id).text();
    $("#txt_card_code").val(cardcode);
    $("#txt_card_name").val(cardname);
    $("#modal-cust_list").modal('hide');
    get_contact_person_by_card_code(cardcode);
    $("#txt_bp_selected_row").val("-1");
    clear_form_data();
}
function clear_form_data() {
    $("#txt_so_entry").val('-1');
    $("#txt_so_line").val('-1');
    $("#txt_ocrcode").val('-1');
    $("#txt_ocrcode2").val('-1');
    $("#txt_ocrcode3").val('-1');

    $("#txt_item_code").val('');
    $("#txt_house_code").val('');
    $("#txt_item_name").val('');
    $("#txt_referral").val('');
    $("#txt_con_period").val('');

    if ($("#txt_effective_date").length > 0) {

        var effectiveDate = $("#txt_effective_date").val();

        if (effectiveDate) {
            $("#txt_effective_date").val('');
            $("#txt_effective_date").prop("disabled", false);
        }
    }

    $("#txt_before_discount_amount").val('0.00');
    $("#txt_project").val('');
    $("#txt_discount_per").val('0.00');
    $("#txt_discount_amount").val('0.00');
    $("#txt_special_dis_per").val('0.00');
    $("#txt_special_dis_amount").val('0.00');

    $("#txt_after_discount").val('0.00');
    $("#txt_remaining_amount").val('0.00');
    $("#txt_installment_amount").val('0.00');
    
    $("#table_payment_schedule >tbody >tr").remove();
}
function cmd_show_item() {
    if ($("#txt_card_code").val() == '') {
        ShowAlert("Please select customer!");
    } else {
        $("#modal-item-list").modal('show');
    }
}
function tr_pop_item_selected(selectedindex) {
    $("#table_pop_customer_list > tbody > tr").each(function (index) {
        $("#tr_pop_item_" + (index + 1)).css("background-color", "white");
    });
    $("#tr_pop_item_" + selectedindex).css("background-color", "#e6f0ff");
    $("#txt_item_selected_row").val(selectedindex);
}
function cmd_pop_choose_item() {
    if ($("#txt_item_selected_row").val() == '-1') {
        ShowAlert("No House selected!");
    } else {

        var id = $("#txt_item_selected_row").val();
        var itemcode = $("#td_pop_item_code_" + id).text();
        var itemname = $("#td_pop_item_name_" + id).text();
        var itemprice = $("#td_pop_item_amount_" + id).text();
        var housecode = $("#td_pop_item_house_code_" + id).text();
        var projectname = $("#td_pop_item_project_name_" + id).text();

        var ocrcode = $("#td_pop_item_ocrcode_" + id).text();
        var ocrcode2 = $("#td_pop_item_ocrcode2_" + id).text();
        var ocrcode3 = $("#td_pop_item_ocrcode3_" + id).text();

        $("#txt_house_code").val(housecode);
        $("#txt_item_code").val(itemcode);
        $("#txt_item_name").val(itemname);
        $("#txt_before_discount_amount").val(convert2digit(itemprice));

        var InstallmentAmt = parseFloat(returnstringvalue(itemprice)) - (parseFloat(0) + parseFloat(0));

        $("#txt_after_discount").val(convert2digit(InstallmentAmt));
        $("#txt_remaining_amount").val(convert2digit(InstallmentAmt));

        if ($("#txt_module_id").val() == "PaymentSchedule") {
            $("#txt_installment_amount").val(convert2digit(InstallmentAmt));
            recalculate_total_remaining();
        } else if ($("#txt_module_id").val() == "ChangeHouse") {
            $("#txt_installment_amount").val(convert2digit(InstallmentAmt));
            recalculate_total_remaining();
        }

        $("#txt_project").val(projectname);
        $("#txt_ocrcode").val(ocrcode);
        $("#txt_ocrcode2").val(ocrcode2);
        $("#txt_ocrcode3").val(ocrcode3);
        Get_Document_Number_Booking('SOR');

        $("#modal-item-list").modal('hide');
        $("#txt_item_selected_row").val("-1");
    }
}

////discount
function txt_discount_amount_change() {
    var before_discount = returnstringvalue($("#txt_before_discount_amount").val());
    var discount_amount = returnstringvalue($("#txt_discount_amount").val());
    var special_amount = returnstringvalue($("#txt_special_dis_amount").val());
    var amount_after_dis = parseFloat(before_discount) - parseFloat(discount_amount);
    var amount_after_special = parseFloat(amount_after_dis) - parseFloat(special_amount);

    $("#txt_after_discount").val(convert2digit(amount_after_special));
    $("#txt_discount_amount").val(convert2digit(discount_amount));
    var discount_per = (parseFloat(discount_amount) / parseFloat(before_discount)) * 100;
    $("#txt_discount_per").val(convert2digit(discount_per));

    var booking = returnstringvalue($("#txt_booking_amount").val());
    var remaining_amount = parseFloat(amount_after_special) - parseFloat(booking);
    $("#txt_remaining_amount").val(convert2digit(remaining_amount));
}
function txt_discount_per_change() {

    var before_discount = returnstringvalue($("#txt_before_discount_amount").val());
    var discount_per = returnstringvalue($("#txt_discount_per").val());
    var special_amount = returnstringvalue($("#txt_special_dis_amount").val());

    var discount_amount = returnstringvalue((parseFloat(before_discount) * parseFloat(discount_per / 100)));
    $("#txt_discount_amount").val(convert2digit(discount_amount));
    var amount_after_dis = parseFloat(before_discount) - parseFloat(discount_amount);
    var amount_after_special = parseFloat(amount_after_dis) - parseFloat(special_amount);
    $("#txt_after_discount").val(convert2digit(amount_after_special));
    $("#txt_discount_per").val(convert2digit(discount_per));

    var booking = returnstringvalue($("#txt_booking_amount").val());
    var remaining_amount = parseFloat(amount_after_special) - parseFloat(booking);
    $("#txt_remaining_amount").val(convert2digit(remaining_amount));
}
//Speical Discount
function txt_special_discount_per_change() {

    var before_discount = returnstringvalue($("#txt_before_discount_amount").val());
    var discount_amount = returnstringvalue($("#txt_discount_amount").val());
    var amount_after_dis = parseFloat(before_discount) - parseFloat(discount_amount);

    var special_per = returnstringvalue($("#txt_special_dis_per").val());
    $("#txt_special_dis_per").val(convert2digit(special_per));

    var special_amount = parseFloat(amount_after_dis) * (parseFloat(special_per) / 100);
    $("#txt_special_dis_amount").val(convert2digit(special_amount));

    var amount_after_special = parseFloat(amount_after_dis) - parseFloat(special_amount);
    $("#txt_after_discount").val(convert2digit(amount_after_special));

    var booking = returnstringvalue($("#txt_booking_amount").val());
    var remaining_amount = parseFloat(amount_after_special) - parseFloat(booking);
    $("#txt_remaining_amount").val(convert2digit(remaining_amount));
}
function txt_special_discount_amount_change() {

    var before_discount = returnstringvalue($("#txt_before_discount_amount").val());
    var discount_amount = returnstringvalue($("#txt_discount_amount").val());
    var special_amount = returnstringvalue($("#txt_special_dis_amount").val());
    var amount_after_dis = parseFloat(before_discount) - parseFloat(discount_amount);

    $("#txt_special_dis_amount").val(convert2digit(special_amount));

    var special_per = (parseFloat(special_amount) / parseFloat(amount_after_dis))*100;
    $("#txt_special_dis_per").val(convert2digit(special_per));

    var amount_after_special = parseFloat(amount_after_dis) - parseFloat(special_amount);
    $("#txt_after_discount").val(convert2digit(amount_after_special));

    var booking = returnstringvalue($("#txt_booking_amount").val());
    var remaining_amount = parseFloat(amount_after_special) - parseFloat(booking);
    $("#txt_remaining_amount").val(convert2digit(remaining_amount));
}

///// **** Change Schedule
////discount
function txt_discount_amount_change_change_schedule() {
    var before_discount = returnstringvalue($("#txt_before_discount_amount").val());
    var discount_amount = returnstringvalue($("#txt_discount_amount").val());
    var special_amount = returnstringvalue($("#txt_special_dis_amount").val());
    var amount_after_dis = parseFloat(before_discount) - parseFloat(discount_amount);
    var amount_after_special = parseFloat(amount_after_dis) - parseFloat(special_amount);

    $("#txt_after_discount").val(convert2digit(amount_after_special));
    $("#txt_discount_amount").val(convert2digit(discount_amount));
    var discount_per = (parseFloat(discount_amount) / parseFloat(before_discount)) * 100;
    $("#txt_discount_per").val(convert2digit(discount_per));

    var booking = returnstringvalue($("#txt_booking_amount").val());
    var remaining_amount = parseFloat(amount_after_special) - parseFloat(booking);
    $("#txt_remaining_amount").val(convert2digit(remaining_amount));
    $("#txt_installment_amount").val(convert2digit(remaining_amount));
    recalculate_remaining();
}
function txt_discount_per_change_change_schedule() {

    var before_discount = returnstringvalue($("#txt_before_discount_amount").val());
    var discount_per = returnstringvalue($("#txt_discount_per").val());
    var special_amount = returnstringvalue($("#txt_special_dis_amount").val());

    var discount_amount = returnstringvalue((parseFloat(before_discount) * parseFloat(discount_per / 100)));
    $("#txt_discount_amount").val(convert2digit(discount_amount));
    var amount_after_dis = parseFloat(before_discount) - parseFloat(discount_amount);
    var amount_after_special = parseFloat(amount_after_dis) - parseFloat(special_amount);
    $("#txt_after_discount").val(convert2digit(amount_after_special));
    $("#txt_discount_per").val(convert2digit(discount_per));

    var booking = returnstringvalue($("#txt_booking_amount").val());
    var remaining_amount = parseFloat(amount_after_special) - parseFloat(booking);
    $("#txt_remaining_amount").val(convert2digit(remaining_amount));
    $("#txt_installment_amount").val(convert2digit(remaining_amount));
    recalculate_remaining();
}
//Speical Discount
function txt_special_discount_per_change_change_schedule() {

    var before_discount = returnstringvalue($("#txt_before_discount_amount").val());
    var discount_amount = returnstringvalue($("#txt_discount_amount").val());
    var amount_after_dis = parseFloat(before_discount) - parseFloat(discount_amount);

    var special_per = returnstringvalue($("#txt_special_dis_per").val());
    $("#txt_special_dis_per").val(convert2digit(special_per));

    var special_amount = parseFloat(amount_after_dis) * (parseFloat(special_per) / 100);
    $("#txt_special_dis_amount").val(convert2digit(special_amount));

    var amount_after_special = parseFloat(amount_after_dis) - parseFloat(special_amount);
    $("#txt_after_discount").val(convert2digit(amount_after_special));

    var booking = returnstringvalue($("#txt_booking_amount").val());
    var remaining_amount = parseFloat(amount_after_special) - parseFloat(booking);
    $("#txt_remaining_amount").val(convert2digit(remaining_amount));
    $("#txt_installment_amount").val(convert2digit(remaining_amount));
    recalculate_remaining();
}
function txt_special_discount_amount_change_change_schedule() {

    var before_discount = returnstringvalue($("#txt_before_discount_amount").val());
    var discount_amount = returnstringvalue($("#txt_discount_amount").val());
    var special_amount = returnstringvalue($("#txt_special_dis_amount").val());
    var amount_after_dis = parseFloat(before_discount) - parseFloat(discount_amount);

    $("#txt_special_dis_amount").val(convert2digit(special_amount));

    var special_per = (parseFloat(special_amount) / parseFloat(amount_after_dis)) * 100;
    $("#txt_special_dis_per").val(convert2digit(special_per));

    var amount_after_special = parseFloat(amount_after_dis) - parseFloat(special_amount);
    $("#txt_after_discount").val(convert2digit(amount_after_special));

    var booking = returnstringvalue($("#txt_booking_amount").val());
    var remaining_amount = parseFloat(amount_after_special) - parseFloat(booking);
    $("#txt_remaining_amount").val(convert2digit(remaining_amount));
    $("#txt_installment_amount").val(convert2digit(remaining_amount));
    recalculate_remaining();
}

function txt_additional_Amt_change() {
    var remaining = returnstringvalue($("#txt_remaining_amount").val());
    var add_amt = 0;
    var remain_after_add_amt = parseFloat(remaining) - parseFloat(add_amt);
    $("#txt_remaining_amount").val(convert2digit(remain_after_add_amt));
    $("#txt_installment_amount").val(convert2digit(remain_after_add_amt));
}

//get Data from Database
function get_district_by_province_change() {
    var procode = $("#cbo_province").val();
    $.ajax({
        url: '/getDataSales/get_district_by_province',
        type: 'POST',
        data: { procode: procode },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#cbo_district").empty();
            options = "<option value=''></option>";
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                options = options + "<option value='" + x.Code + "'>" + x.Name + "</option>";
            }
            $("#cbo_district").append(options);
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_commune_by_district_change() {
    var distcode = $("#cbo_district").val();
    $.ajax({
        url: '/getDataSales/get_commune_by_district',
        type: 'POST',
        data: { districtcode: distcode },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#cbo_commune").empty();
            options = "<option value=''></option>";
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                options = options + "<option value='" + x.Code + "'>" + x.U_Sangkat + "</option>";
            }
            $("#cbo_commune").append(options);
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_address_change() {
    var commcode = $("#cbo_commune").val();
    $.ajax({
        url: '/getDataSales/get_address',
        type: 'POST',
        data: { commcode: commcode },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {

            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                $("#txt_address_en").val(x.U_AddressEn);
                $("#txt_address_kh").val(x.U_AddressKh);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_contact_person_by_card_code(cardcode) {
    $.ajax({
        url: '/getDataSales/get_contact_person',
        type: 'POST',
        data: { cardcode: cardcode },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#cbo_contact_person").empty();
            var option = "";
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                option = option + "<option value='" + x.Cntctcode + "'>" + x.ENName + "</option>";
            }
            $("#cbo_contact_person").append(option);
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}

//// get docnum
function Get_Document_Number_Booking(docType) {
    var project = $("#txt_project").val();
    var docdate = $('#txt_doc_date').val().trim().split("-");
    if (project != "") {
        $.ajax({
            url: '/getDataSales/Get_Document_Number',
            type: 'POST',
            data: {
                project: project,
                docdate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
                docType: docType
            },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                $("#txt_doc_num").val(data.data);
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}


//// date property
Date.prototype.addDays = function (s) {

    var targetDays = parseInt(s)
    var thisYear = parseInt(this.getFullYear())
    var thisDays = parseInt(this.getDate())
    var thisMonth = parseInt(this.getMonth() + 1)

    var currDays = thisDays;
    var currMonth = thisMonth;
    var currYear = thisYear;

    var monthArr;

    var nonleap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // leap year  
    var leap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if ((thisYear % 4) == 0) {
        if ((thisYear % 100) == 0 && (thisYear % 400) != 0) { monthArr = nonleap; }
        else { monthArr = leap; }
    }
    else { monthArr = nonleap; }

    var daysCounter = 0;
    var numDays = 0;
    var monthDays = 0;

    if (targetDays < 0) {

        while (daysCounter < (targetDays * -1)) {

            if (daysCounter == 0) {
                if ((targetDays * -1) < thisDays) {
                    break;
                } else {
                    daysCounter = thisDays;
                }
            } else {
                numDays = monthArr[currMonth - 1];
                daysCounter += parseInt(numDays)
            }

            if (daysCounter > (targetDays * -1)) {
                break;
            }

            currMonth = currMonth - 1;

            if (currMonth == 0) {
                currYear = currYear - 1;
                if ((currYear % 4) == 0) {
                    if ((currYear % 100) == 0 && (currYear % 400) != 0) { monthArr = nonleap; }
                    else { monthArr = leap; }
                }
                else { monthArr = nonleap; }
                currMonth = 12;
            }
        }

        t = this.getTime();
        t += (targetDays * 86400000);
        this.setTime(t)
        var thisDate = new Date(currYear, currMonth - 1, this.getDate())
        return thisDate;

    } else {

        var diffDays = monthArr[currMonth - 1] - thisDays;

        numDays = 0;
        var startedC = true;

        while (daysCounter < targetDays) {

            if (daysCounter == 0 && startedC == true) {
                monthDays = thisDays;
                startedC = false;
            } else {
                monthDays++;
                daysCounter++;

                if (monthDays > monthArr[currMonth - 1]) {
                    currMonth = currMonth + 1;
                    monthDays = 1;
                }

            }

            if (daysCounter > targetDays) {
                break;
            }

            if (currMonth == 13) {
                currYear = currYear + 1;
                if ((currYear % 4) == 0) {
                    if ((currYear % 100) == 0 && (currYear % 400) != 0) { monthArr = nonleap; }
                    else { monthArr = leap; }
                }
                else { monthArr = nonleap; }
                currMonth = 1;
            }
        }

        var thisDate = new Date(currYear, currMonth - 1, monthDays)
        return thisDate;
    }
}
Date.prototype.addMonths = function (m) {
    var d = new Date(this);
    var years = Math.floor(m / 12);
    var months = m - (years * 12);
    if (years) d.setFullYear(d.getFullYear() + years);
    if (months) d.setMonth(d.getMonth() + months);
    return d;
}
