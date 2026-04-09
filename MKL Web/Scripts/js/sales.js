
//Client Action

/// global variable

let payment_option;


function get_nextd_date(date) {
    var date = date.split("-");
    var docdate = new Date(date[2] + "/" + date[1] + "/" + date[0]);
    var d = new Date(docdate.setMonth(docdate.getMonth() + 1));
    var day = (d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate());
    var month = (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1);
    var year = d.getFullYear();
    var fulldate = day + "-" + month + "-" + year;
    return fulldate;
}
function cmd_pop_special_payment_add_row() {
    if ($("#txt_pop_remaining_amount").val() == 0) {
        ShowAlert("Remaining amount equal to zero,Can not append row!");
    } else {
        var fulldate = null;
        var rowindex = $("#table_pop_special_payment >tbody >tr").length;
        if (rowindex == 0) {
            if ($("#table_payment_schedule >tbody >tr").length <= 1) {
                fulldate = $("#txt_start_payment").val();
            } else {
                var date = new Date($("#txt_maturity_payment").val()).addMonths(1);
                var strDate = date.toString().split(' ');
                fulldate = strDate[2] + '-' + strDate[1] + '-' + strDate[3];
            }
            
        }
        else {
            var newrow = $("#table_pop_special_payment >tbody").find("tr:last").attr("id").replace("tr_pop_speical_payment_", "");
            rowindex = parseInt(newrow);
            var date = new Date($("#txt_pop_special_payment_date_" + rowindex).val()).addMonths($("#txt_pop_special_payment_period_" + rowindex).val());
            var strDate = date.toString().split(' ');
            fulldate = strDate[2] + '-' + strDate[1] + '-' + strDate[3];
        }
        if (rowindex != 0) {
            if ($("#txt_pop_special_payment_amount_" + rowindex).val() == 0) {
                ShowAlertCus("Payment amount cannot be zero!","warning");
            } else {
                disable_enable_element(rowindex, '0');
                rowindex++;
                var data = "<tr id='tr_pop_speical_payment_" + rowindex + "'>";
                data = data + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_pop_special_by_line(" + rowindex + ")'  id='remove_pop_special_by_line_" + rowindex +"'><i class='fa fa-fw fa-remove' style='cursor:pointer;'></i></span></td>";
                data = data + "<td><div class='form-group'><select class='form-control' id='cbo_pop_special_payment_payment_option_" + rowindex + "' onchange='cbo_pop_special_payment_payment_option_change(" + rowindex + ")'>";
                data = data + "<option value ='DPS'>Deposit</option>";
                data = data + "<option value ='PNI'>Payment without interest</option>";
                data = data + "<option value ='PIA'>Payment with interest(Amount)</option>";
                data = data + "<option value ='PIP'>Payment with interest(Period)</option>";
                data = data + "<option value ='FPM'>Final Payment</option></select></div></td>";
                data = data + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' id='txt_pop_special_payment_date_" + rowindex + "' placeholder='Payment Date' value='" + fulldate + "'></div></div></td>";
                data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pop_special_payment_amount_" + rowindex + "' value='0.00' onchange='txt_special_line_payment_amount_change(" + rowindex + ")'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pop_special_payment_per_" + rowindex + "' value='0.00' onchange='txt_special_line_payment_per_change(" + rowindex + ")'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pop_special_payment_rate_" + rowindex + "' value='0.00' onchange='txt_pop_special_line_payment_rate_change(" + rowindex + ")' readonly></div></td>";
                data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pop_special_payment_period_" + rowindex + "' value='1'  onchange='txt_special_line_payment_period_change(" + rowindex + ")'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pop_special_payment_remark_" + rowindex + "' ​placeholder='Remark'></div></td>";
                data = data + "<td style='display:none;'><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pop_special_payment_current_select_" + rowindex + "'></div></td>";
                data = data + "</tr>";
                $("#table_pop_special_payment >tbody").append(data);
                $('.datetime').datepicker({
                    autoclose: true,
                    format: 'dd-M-yyyy'
                });
            }
        } else {
            rowindex++;
            var data = "<tr id='tr_pop_speical_payment_" + rowindex + "'>";
            data = data + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_pop_special_by_line(" + rowindex + ")'  id='remove_pop_special_by_line_" + rowindex +"'><i class='fa fa-fw fa-remove'  style='cursor:pointer;'></i></span></td>";
            data = data + "<td><div class='form-group'><select class='form-control' id='cbo_pop_special_payment_payment_option_" + rowindex + "' onchange='cbo_pop_special_payment_payment_option_change(" + rowindex + ")'>";
            data = data + "<option value ='DPS'>Deposit</option>";
            data = data + "<option value ='PNI'>Payment without interest</option>";
            data = data + "<option value ='PIA'>Payment with interest(Amount)</option>";
            data = data + "<option value ='PIP'>Payment with interest(Period)</option>";
            data = data + "<option value ='FPM'>Final Payment</option></select></div></td>";
            data = data + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' id='txt_pop_special_payment_date_" + rowindex + "' placeholder='Payment Date' value='" + fulldate + "'></div></div></td>";
            data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pop_special_payment_amount_" + rowindex + "' value='0.00' onchange='txt_special_line_payment_amount_change(" + rowindex + ")'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pop_special_payment_per_" + rowindex + "' value='0.00' onchange='txt_special_line_payment_per_change(" + rowindex + ")'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pop_special_payment_rate_" + rowindex + "' value='0.00' onchange='txt_pop_special_line_payment_rate_change(" + rowindex + ")' readonly></div></td>";
            data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pop_special_payment_period_" + rowindex + "' value='1'  onchange='txt_special_line_payment_period_change(" + rowindex + ")'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pop_special_payment_remark_" + rowindex + "' ​placeholder='Remark'></div></td>";
            data = data + "<td style='display:none;'><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pop_special_payment_current_select_" + rowindex + "'></div></td>";
            data = data + "</tr>";
            $("#table_pop_special_payment >tbody").append(data);
            $('.datetime').datepicker({
                autoclose: true,
                format: 'dd-M-yyyy'
            });
        }
    }
}
function cbo_pop_special_payment_payment_option_change(rowindex) {
    
    switch ($("#cbo_pop_special_payment_payment_option_" + rowindex).val()) {
        case "DPS":
            $("#txt_pop_special_payment_amount_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_amount_" + rowindex).removeAttr('readonly');
            $("#txt_pop_special_payment_per_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_per_" + rowindex).removeAttr('readonly');
            $("#txt_pop_special_payment_period_" + rowindex).val("1");
            $("#txt_pop_special_payment_period_" + rowindex).removeAttr('readonly');
            $("#txt_pop_special_payment_rate_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_rate_" + rowindex).attr('readonly', 'readonly');
            $("#txt_pop_special_payment_current_select_" + rowindex).val("DPS");
            break;
        case "PNI":
            $("#txt_pop_special_payment_amount_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_amount_" + rowindex).removeAttr('readonly');
            $("#txt_pop_special_payment_per_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_per_" + rowindex).removeAttr('readonly');
            $("#txt_pop_special_payment_period_" + rowindex).val("1");
            $("#txt_pop_special_payment_period_" + rowindex).removeAttr('readonly');
            $("#txt_pop_special_payment_rate_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_rate_" + rowindex).attr('readonly', 'readonly');
            $("#txt_pop_special_payment_current_select_" + rowindex).val("PNI");
            break;
        case "PIA":
            $("#txt_pop_special_payment_amount_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_amount_" + rowindex).removeAttr('readonly');
            $("#txt_pop_special_payment_per_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_per_" + rowindex).attr('readonly', 'readonly');
            $("#txt_pop_special_payment_period_" + rowindex).val("1");
            $("#txt_pop_special_payment_period_" + rowindex).attr('readonly', 'readonly');
            $("#txt_pop_special_payment_rate_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_rate_" + rowindex).removeAttr('readonly');
            $("#txt_pop_special_payment_current_select_" + rowindex).val("PIA");
            break;
        case "PIP":
            $("#txt_pop_special_payment_amount_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_amount_" + rowindex).attr('readonly', 'readonly');
            $("#txt_pop_special_payment_per_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_per_" + rowindex).attr('readonly', 'readonly');
            $("#txt_pop_special_payment_period_" + rowindex).val("0");
            $("#txt_pop_special_payment_period_" + rowindex).removeAttr('readonly');
            $("#txt_pop_special_payment_rate_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_rate_" + rowindex).removeAttr('readonly');
            $("#txt_pop_special_payment_current_select_" + rowindex).val("PIP");
            break;
        case "FPM":
            $("#txt_pop_special_payment_amount_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_amount_" + rowindex).attr('readonly', 'readonly');
            $("#txt_pop_special_payment_per_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_per_" + rowindex).attr('readonly', 'readonly');
            $("#txt_pop_special_payment_period_" + rowindex).val("1");
            $("#txt_pop_special_payment_period_" + rowindex).attr('readonly', 'readonly');
            $("#txt_pop_special_payment_rate_" + rowindex).val("0.00");
            $("#txt_pop_special_payment_rate_" + rowindex).attr('readonly', 'readonly');
            $("#txt_pop_special_payment_current_select_" + rowindex).val("FPM");
            break;
    }
    txt_special_line_payment_amount_change(rowindex);
} 
function txt_deposit_amount_change() {
    var deposit = returnstringvalue($("#txt_deposit_amount").val());
    $("#txt_deposit_amount").val(convert2digit(deposit));
    var installment_amount = returnstringvalue($("#txt_installment_amount").val());
    var depositrate = parseFloat(deposit) / parseFloat(installment_amount);
    $("#txt_deposit_per").val(convert2digit(depositrate));
    var remaining = parseFloat(returnstringvalue($("#txt_installment_amount").val())) - parseFloat(returnstringvalue($("#txt_deposit_amount").val()));
    $("#txt_installment_amount").val(convert2digit(remaining));
}
function txt_deposit_per_change() {
    var installment_amount = returnstringvalue($("#txt_installment_amount").val());
    var deposit = installment_amount * (returnstringvalue($("#txt_deposit_per").val()) / 100);
    $("#txt_deposit_amount").val(convert2digit(deposit));
    var remaining = parseFloat(returnstringvalue($("#txt_installment_amount").val())) - parseFloat(returnstringvalue($("#txt_deposit_amount").val()));
    $("#txt_installment_amount").val(convert2digit(remaining));
}
function txt_special_line_payment_amount_change(rowindex) {
    if ($("#cbo_pop_special_payment_payment_option_" + rowindex).val() == "PIA") {
        txt_pop_special_payment_amount_change(rowindex);
    } else if ($("#cbo_pop_special_payment_payment_option_" + rowindex).val() == "PIP") {
        txt_pop_special_payment_period_change(rowindex);
    }else 
    {
        var remaining = returnstringvalue($("#txt_installment_amount").val());
        var amount = returnstringvalue($("#txt_pop_special_payment_amount_" + rowindex).val());
        $("#txt_pop_special_payment_amount_" + rowindex).val(convert2digit(amount));
        var total = 0.00;
        $("#table_pop_special_payment > tbody >tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_speical_payment_", "");
            total = parseFloat(returnstringvalue(total)) + parseFloat(returnstringvalue($("#txt_pop_special_payment_amount_" + id).val()) * returnstringvalue($("#txt_pop_special_payment_period_" + id).val()));
        });
        var balance = parseFloat(remaining) - parseFloat(returnstringvalue(total));
        if (balance < 0) {
            check_remaining_amount(rowindex);
        } else {
            $("#txt_pop_remaining_amount").val(convert2digit(balance));
            if ($("#cbo_pop_special_payment_payment_option_" + rowindex).val() == "FPM") {
                $("#txt_pop_special_payment_amount_" + rowindex).val(convert2digit(balance));
                $("#txt_pop_remaining_amount").val("0.00");
            }
        }
    }
}
function txt_special_line_payment_per_change(rowindex) {
    //// if allow edit only menthor Deposit and payment without interest, so no need to discuss on other menthor
    var remaining = returnstringvalue($("#txt_installment_amount").val());
    var per = returnstringvalue($("#txt_pop_special_payment_per_" + rowindex).val());
    var payment_amount = remaining * (parseFloat(returnstringvalue(per)) / 100);
    $("#txt_pop_special_payment_amount_" + rowindex).val(convert2digit(payment_amount));
    $("#txt_pop_special_payment_per_" + rowindex).val(convert2digit(per));
    var total = 0.00;
    $("#table_pop_special_payment > tbody >tr").each(function(){
        var id = $(this).attr('id').replace("tr_pop_speical_payment_", "");
        total = parseFloat(returnstringvalue(total)) + parseFloat(returnstringvalue($("#txt_pop_special_payment_amount_" + id).val()) * returnstringvalue($("#txt_pop_special_payment_period_" + id).val()));
    });
    var balance = parseFloat(remaining) - parseFloat(returnstringvalue(total));
    $("#txt_pop_remaining_amount").val(convert2digit(balance));
    if (parseFloat(convert2digit($("#txt_pop_remaining_amount").val())) < 0) {  
        ShowAlertCus("Payment Amount grater than Remaining Amount!","warning");
        $("#txt_pop_special_payment_amount_" + rowindex).val("0.00");
        $("#txt_pop_special_payment_per_" + rowindex).val("0.00");
        var total = 0.00;
        $("#table_pop_special_payment > tbody >tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_speical_payment_", "");
            total = parseFloat(returnstringvalue(total)) + parseFloat(returnstringvalue($("#txt_pop_special_payment_amount_" + id).val()));
        });
        var balance = parseFloat(remaining) - parseFloat(returnstringvalue(total));

        $("#txt_pop_remaining_amount").val(convert2digit(balance));
    }
}
function txt_special_line_payment_period_change(rowindex) {
    if ($("#cbo_pop_special_payment_payment_option_" + rowindex).val() == "PIP") {
        txt_pop_special_payment_period_change(rowindex);
    } else {
        var remaining = returnstringvalue($("#txt_installment_amount").val());
        var total = 0.00;
        $("#table_pop_special_payment > tbody >tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_speical_payment_", "");
            total = parseFloat(returnstringvalue(total)) + parseFloat(returnstringvalue($("#txt_pop_special_payment_amount_" + id).val()) * returnstringvalue($("#txt_pop_special_payment_period_" + id).val()));
        });
        var balance = parseFloat(remaining) - parseFloat(returnstringvalue(total));
        if (balance < 0) {
            check_remaining_amount(rowindex);
        } else {
            $("#txt_pop_remaining_amount").val(convert2digit(balance));
        }
    }
}
function cbo_payment_option_change() {
    if ($("#cbo_payment_option").val() == "A") {
        $("#btn_generate_payment_shcedule").text("Set Payment");
        $("#txt_installment_rate").val("0.00");
        $("#txt_installment_rate").attr('readonly', 'readonly');
        $("#txt_period").val("0");
        $("#txt_period").attr('readonly', 'readonly');
        $("#txt_fixed_monthly_payment").val('0.00');
        $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
        $("#check_manual_payment").prop('checked', false);
        $("#check_manual_payment").attr('disabled', 'disabled');
    } else if ($("#cbo_payment_option").val() == "F") {
        $("#btn_generate_payment_shcedule").text("Generate");
        $("#txt_installment_rate").val("0.00");
        $("#txt_installment_rate").removeAttr('readonly');
        $("#txt_period").val("0");
        $("#txt_period").removeAttr('readonly');
        $("#txt_fixed_monthly_payment").val('0.00');
        $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
        $("#check_manual_payment").prop('checked', false);
        $("#check_manual_payment").removeAttr('disabled');
    } else if ($("#cbo_payment_option").val() == "D") {
        $("#btn_generate_payment_shcedule").text("Generate");
        $("#txt_installment_rate").val("0.00");
        $("#txt_installment_rate").removeAttr('readonly');
        $("#txt_period").val("0");
        $("#txt_period").removeAttr('readonly');
        $("#txt_fixed_monthly_payment").val('0.00');
        $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
        $("#check_manual_payment").prop('checked', false);
        $("#check_manual_payment").attr('disabled', 'disabled');
    } else {//if ($("#cbo_payment_option").val() == "Option 1" || $("#cbo_payment_option").val() == "Option 2" || $("#cbo_payment_option").val() == "Option 3") {
        $("#btn_generate_payment_shcedule").text("Generate");
        $("#txt_installment_rate").val("0.00");
        $("#txt_installment_rate").attr('readonly', 'readonly');
        $("#txt_period").val("0");
        $("#txt_period").attr('readonly', 'readonly');
        $("#txt_fixed_monthly_payment").val('0.00');
        $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
        $("#check_manual_payment").prop('checked', false);
        $("#check_manual_payment").attr('disabled', 'disabled');
    }
}
function txt_special_discount_change() {
    var before_discount = returnstringvalue($("#txt_before_discount_amount").val());
    var discount_amount = returnstringvalue($("#txt_discount_amount").val());
    var special_discount = returnstringvalue($("#txt_special_discount").val());
    var after_discount = parseFloat(before_discount) - (parseFloat(discount_amount) + parseFloat(special_discount));
    $("#txt_special_discount").val(convert2digit(special_discount));
    $("#txt_after_discount").val(convert2digit(after_discount));
    $("#txt_installment_amount").val(convert2digit(after_discount));
}
function remove_pop_special_by_line(rowindex) {
    $("#tr_pop_speical_payment_" + rowindex).remove();
    var rowindex = $("#table_pop_special_payment >tbody >tr").length;
    if (rowindex > 0) {
        var newrow = $("#table_pop_special_payment >tbody").find("tr:last").attr("id").replace("tr_pop_speical_payment_", "");
        var rowindex = parseInt(newrow);
        disable_enable_element(rowindex, '1');
        txt_special_line_payment_amount_change(rowindex);
    }
}
function cmd_payment_generate() {
    if ($("#cbo_payment_option").val() == "") {
        ShowAlertCus("Please choose Payment Option", "warning");
    } else if (parseFloat(returnstringvalue($("#txt_installment_amount").val())) <= 0) {
        ShowAlertCus("Installment Amount can not less than or equal to zero!", "warning");
    }
    else {
        var allow = 0;
        switch ($("#cbo_payment_option").val()) {
            case "B":
                if (parseFloat(convert2digit($("#txt_deposit_amount").val())) == 0) {
                    alert("Deposit Amount is required");
                    allow = 1;
                }
                break;
            case "F":
                if ($("#check_manual_payment").is(":checked") == true) {
                    if (parseFloat(convert2digit($("#txt_fixed_monthly_payment").val())) == 0) {
                        alert("Monthly Payment is required");
                        allow = 2;
                    }
                } else {
                    if (parseFloat(convert2digit($("#txt_period").val())) == 0) {
                        alert("Period(M) is required");
                        allow = 3;
                    }
                }
                break;
            case "D":
                if (parseFloat(convert2digit($("#txt_installment_rate").val())) == 0 || parseFloat(convert2digit($("#txt_period").val())) == 0) {
                    alert("Annual Rate and Period(M) are required");
                    allow = 2;
                }
                break;
        }
        if (allow == 0) {
            generate_schedule();
        }
    }
}


function check_cmd_generate_payment_option() {
    if ($("#btn_generate_payment_shcedule").text() == "Generate") {
        var rowindex = $("#table_pop_special_payment >tbody >tr").length;
        if (rowindex > 0) {
            $("#table_pop_special_payment >tbody >tr").remove();
        }
        cmd_payment_generate();
    } else {
        
        if (returnstringvalue($("#txt_installment_amount").val()) > 0) {
            $("#modal_special_payment").modal('show');
            var rowindex = $("#table_pop_special_payment >tbody >tr").length;

            var serialElement = document.getElementById("txt_new_serail");
            var serial = serialElement ? serialElement.value : "";

            if (rowindex > 0) {
              
                txt_special_line_payment_amount_change(1);
            } else {
           
                var installment_discount = returnstringvalue($("#txt_installment_amount").val());
                $("#txt_pop_remaining_amount").val(convert2digit(installment_discount));

                cmd_pop_special_payment_add_row();
            }
            var before_discount = parseFloat(returnstringvalue($("#txt_before_discount_amount").val())) || 0;
            var after_discount = parseFloat(returnstringvalue($("#txt_after_discount").val())) || 0;
            var total = before_discount + after_discount;

            $("#txt_pop_special_installment_amount").val(convert2digit(total));
            $("#txt_serial").val(serial);
        } else {
            ShowAlertCus("Remaining amount equal to zero,Can not append row!", "warning");
        }
    }
}



function check_cmd_generate_penalty_List() {

    var rowindex = $("#table_customer_list >tbody >tr").length;

    var customerCodesString = getCustomerCodesAsString();
    var penaltyDate = $("#txt_penalty_date").val();
    var docDate = $("#txt_doc_date").val();
    var fromdueDate = $("#txt_fdue_date").val();
    var todueDate = $("#txt_tdue_date").val();
    var frompostDate = $("#txt_fposting_date").val();
    var topostDate = $("#txt_tposting_date").val();
    var penaltyoption = $("#cbo_penalty_option").val();


    if (penaltyoption == "") {
        ShowAlertCus("Please choose Panalty Option","warning");
    }
    else if (rowindex <= 0) {
        ShowAlertCus("Please load the customer list first","warning");
    }

    // Function use for calculate the List of Penalty

    $.ajax({
        url: '/sales/get_penalty_list',
        type: 'POST',
        data:{
            bpCode: customerCodesString
            , PenaltyDate: penaltyDate
            , option: penaltyoption
            , DateFrom: frompostDate
            , DateTo: topostDate
            , DueDateFrom: fromdueDate
            , DueDateTo: todueDate
        },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            var rowindex = $("#table_penalty_list >tbody >tr").length;
            var mydata = data.data;
            if (rowindex > 0) {
                var lasttr = $("#table_penalty_list >tbody >tr:last");
                rowindex = lasttr.attr('id').replace("tr_penalty_", "");
            }
            rowindex = parseInt(rowindex) + 1;

            for (i = 0; i < mydata.length; i++) {
                var x = mydata[i];
                var data = "<tr id='tr_penalty_" + rowindex + "'>";
                data += "<td><i class='fa fa-fw fa-remove' style='cursor:pointer; color:red;' onclick='removeCurrentRow(this)'></i></td>";
                data = data + "<td style='text-align:Left;'>" + rowindex + "</td>";
                data = data + "<td style='text-align:right;' id='tr_penalty_detail_CustomerCode_line_" + rowindex + "'>" + x.CustomerCode + "</td>";
                data = data + "<td style='text-align:right;' id='tr_penalty_detail_CustomerName_line_" + rowindex + "'>" + x.CustomerName + "</td>";
                data = data + "<td style='text-align:right;' id='tr_penalty_detail_HouseNo_line_" + rowindex + "'>" + x.HouseNo + "</td>";
                data = data + "<td style='text-align:right;' id='tr_penalty_detail_DocNo_line_" + rowindex + "'>" + x.DocNo + "</td>";
                data = data + "<td style='text-align:right;' id='tr_penalty_detail_DocumentNumber_line_" + rowindex + "'>" + x.DocumentNumber + "</td>";
                data = data + "<td style='text-align:right;' id='tr_penalty_detail_DueDate_line_" + rowindex + "'>" + x.DueDate + "</td>";
                data = data + "<td style='text-align:right;' id='tr_penalty_detail_DocumentAmountLC_line_" + rowindex + "'>" + convert2digit(x.DocumentAmountLC) + "</td>";
                data = data + "<td style='text-align:right;' id='tr_penalty_detail_OpenAmountLC_line_" + rowindex + "'>" + convert2digit(x.OpenAmountLC) + "</td>";
                data = data + "<td style='text-align:right;' id='tr_penalty_detail_InterestMonths_line_" + rowindex + "'>" + x.InterestMonths + "</td>";
                data = data + "<td style='text-align:right;' id='tr_penalty_detail_InterestAmountLC_line_" + rowindex + "'>" + convert2digit(x.InterestAmountLC) + "</td>";
                data = data + "<td style='text-align:right;' id='tr_penalty_detail_TotalInclInterestLC_line_" + rowindex + "'>" + convert2digit(x.TotalInclInterestLC) + "</td>";
                data = data + "</tr>";
                $("#table_penalty_list >tbody").append(data);
                rowindex++;
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });

}

function check_cmd_generate_customerlist() {

    let fromCard = $("#txt_card_code").val();
    let toCard = $("#txt_tcard_code").val();

    if (fromCard == "") {
        ShowAlertCus("Please choose From Customer.", "warning");
        $("#txt_card_code").focus();
        return;
    }

    if (toCard == "") {
        ShowAlertCus("Please choose To Customer.", "warning");
        $("#txt_tcard_code").focus();
        return;
    }

    get_customer_List();
}

function getCustomerCodesAsString() {
    var codes = [];

    $("#table_customer_list > tbody > tr").each(function () {
        // Assuming the "Customer Code" is the 3rd column (index 2, 0-based)
        var code = $(this).find("td:eq(2)").text().trim();
        if (code) {
            codes.push(code);
        }
    });

    return codes.join(";");
}


function get_customer_List() {

        $.ajax({
            url: '/sales/get_customer_list',
            type: 'POST',
            data: {
                fcustomer: $("#txt_card_code").val(),
                tcustomer: $("#txt_tcard_code").val()
            },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {


                var rowindex = $("#table_customer_list >tbody >tr").length;
                var mydata = data.data;
                if (rowindex > 0) {
                    var lasttr = $("#table_customer_list >tbody >tr:last");
                    rowindex = lasttr.attr('id').replace("tr_payment_", "");
                }
                rowindex = parseInt(rowindex) + 1;


                for (i = 0; i < mydata.length; i++) {
                    var x = mydata[i];
                    var data = "<tr id='tr_payment_" + rowindex + "'>";
                    data += "<td><i class='fa fa-fw fa-remove' style='cursor:pointer; color:red;' onclick='removeCurrentRow(this)'></i></td>";
                    data += "<td style='text-align:Left;'>" + rowindex + "</td>";
                    data += "<td style='text-align:left;'>" + x.CardCode + "</td>";
                    data += "<td style='text-align:left;'>" + x.CardName + "</td>";
                    data += "<td style='text-align:right;'>" + convert2digit(x.Balance) + "</td>";
                    data += "<td style='text-align:right;'>" + convert2digit(x.BalanceFC) + "</td>";
                    data += "</tr>";

                    $("#table_customer_list > tbody").append(data);
                    rowindex++;
                }

                $("#modal_special_payment").modal('hide');
                $("#table_pop_special_payment >tbody >tr").remove();
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    
}   

function removeCurrentRow(element) {
    $(element).closest('tr').remove();
}


////----- change Item

function cmd_copy_from_payment_schedule(type) {
    

    var cardcode = "";
    cardcode = $("#txt_card_code").val();

    if (!cardcode) {
        ShowAlertCus("Please choose customer information", "danger");
        $("#txt_cardcode").focus();
        return false;
    }

    else {

        if (type == "1") {

            var ref = $("#txt_changeitem_ref").val();
            var cardcode = $("#txt_card_code").val();

            if (ref === "" && pageID === "ChangeItem") {
                ShowAlertCus("Please choose Change Reference first", "danger");
                return;
            }

            $("#modal-schedule-list").modal('show');
            get_payment_schedule_list(cardcode);
        }


        if (type == "2") {
            let PeriodM = parseInt($("#txt_period").val()) || 0;
            let AnnualRate = parseFloat($("#txt_installment_rate").val()) || 0;

            if (PeriodM === 0 || AnnualRate === 0) {
                ShowAlertCus("Period(M) and Annual Rate(%) cannot be zero", "danger");
            }
            else {
                cardcode = $("#txt_card_code").val();
                $("#modal-schedule-list").modal('show');
                get_payment_schedule_list(cardcode);
            }
        }

    }
}


function cmd_copy_from_loanActivity() {


    var cardcode = "";
    cardcode = $("#txt_customer_code").val();

    if (!cardcode) {
        ShowAlertCus("Please choose customer", "danger");
        $("#txt_customer_code").focus();
        return false;
    }

    else {
        $("#modal-schedule-list").modal('show');
        get_payment_schedule_list(cardcode);
    }
}


function ShowAlertCus(message, type = 'warning') {
    const alertId = 'alert_' + Date.now();

    const bgColor = {
        success: '#d4edda',
        warning: '#fff3cd',
        danger: '#f8d7da',
        info: '#d1ecf1'
    };

    const textColor = {
        success: '#155724',
        warning: '#856404',
        danger: '#721c24',
        info: '#0c5460'
    };

    const alertHtml = `
        <div id="${alertId}" style="
            display: none;
            background-color: ${bgColor[type] || '#fff3cd'};
            color: ${textColor[type] || '#856404'};
            border-left: 5px solid ${textColor[type] || '#856404'};
            border-radius: 4px;
            padding: 12px 15px;
            margin-bottom: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            min-width: 280px;
            max-width: 400px;
            font-size: 14px;
            position: relative;
        ">
            <div style="margin-bottom: 10px;">${message}</div>
            <div style="text-align: right;">
                <button onclick="removeAlert('${alertId}')" 
                        style="padding: 5px 12px; background-color: ${textColor[type]}; 
                               color: white; border: none; border-radius: 3px; cursor: pointer;">
                    OK
                </button>
            </div>
        </div>
    `;

    $("#alert-container").append(alertHtml);
    $("#" + alertId).fadeIn(400); // fade in smoothly

    setTimeout(() => {
        removeAlert(alertId);
    }, 6000); // auto-remove after 6s
}

function removeAlert(id) {
    $("#" + id).fadeOut(400, function () {
        $(this).remove();
    });
}





function cmd_change_house_choose_item() {
    if ($("#txt_card_code").val() == "") {
        ShowAlertCus("Please Choose Customer Information!", "warning");
    } else if ($("#txt_old_house_code").val() == "") {
        ShowAlertCus("Please Choose Old Information Of House!", "warning");
    } else {
        cmd_show_item();
    }
}

function update_info_payment(paymnet_info, row) {

    if (!paymnet_info) {
        ShowAlertCus("Payment info is undefined or null.");
        return;
    }
    else {
        if ($("#txt_module_id").val() == "PaymentSchedule") {
            $("#txt_item_code").val($("#td_pop_payment_schedule_so_itemcode_" + row).text().trim());
            $("#txt_house_code").val($("#td_pop_payment_schedule_ocrcode3_" + row).text().trim());
            $("#txt_item_name").val($("#td_pop_payment_schedule_so_itemname_" + row).text().trim());
        } else if ($("#txt_module_id").val() == "ChangeHouse") {
            $("#txt_old_house_code").val($("#td_pop_payment_schedule_ocrcode3_" + row).text().trim());
            $("#txt_old_item_code").val($("#td_pop_payment_schedule_so_itemcode_" + row).text().trim());
            $("#txt_old_item_name").val($("#td_pop_payment_schedule_so_itemname_" + row).text().trim());
        } else if ($("#txt_module_id").val() == "ChangeSchedule") {
            $("#txt_item_code").val($("#td_pop_payment_schedule_so_itemcode_" + row).text().trim());
            $("#txt_house_code").val($("#td_pop_payment_schedule_ocrcode3_" + row).text().trim());
            $("#txt_item_name").val($("#td_pop_payment_schedule_so_itemname_" + row).text().trim());
        } else if ($("#txt_module_id").val() == "ChangeOwner") {
            $("#txt_item_code").val($("#td_pop_payment_schedule_so_itemcode_" + row).text().trim());
            $("#txt_house_code").val($("#td_pop_payment_schedule_ocrcode3_" + row).text().trim());
            $("#txt_item_name").val($("#td_pop_payment_schedule_so_itemname_" + row).text().trim());
        }

        $("#txt_so_entry").val($("#td_pop_payment_schedule_so_entry_" + row).text().trim());
        $("#txt_so_line").val($("#td_pop_payment_schedule_so_line_" + row).text().trim());
        $("#txt_project").val($("#td_pop_payment_schedule_ocrcode_" + row).text().trim());
        $("#txt_ocrcode").val($("#td_pop_payment_schedule_ocrcode_" + row).text().trim());
        $("#txt_ocrcode2").val($("#td_pop_payment_schedule_ocrcode2_" + row).text().trim());
        $("#txt_ocrcode3").val($("#td_pop_payment_schedule_ocrcode3_" + row).text().trim());
        $("#txt_referral").val($("#td_pop_payment_schedule_so_referral_" + row).text().trim());
        $("#txt_con_period").val($("#td_pop_payment_schedule_so_conperiod_" + row).text().trim());
        $("#txt_doc_num").val(paymnet_info.DocNum);
        $("#txt_doc_num").val($("#td_pop_payment_schedule_so_entry_" + row).text().trim());

        var strDate = null;
        var date = null;
        ////
        strDate = paymnet_info.DocDate.toString().split('-');
        date = new Date(strDate[1] + '-' + strDate[0] + '-' + strDate[2]);
        strDate = date.toString().split(' ');
        $("#txt_doc_date").val($("#td_pop_payment_schedule_so_docdate_" + row).text().trim());
        ////
        strDate = paymnet_info.DueDate.toString().split('-');
        date = new Date(strDate[1] + '-' + strDate[0] + '-' + strDate[2]);
        strDate = date.toString().split(' ');
        $("#txt_due_date").val($("#td_pop_payment_schedule_so_duedate_" + row).text().trim());
        $('.datetime').datepicker({
            autoclose: true,
            format: 'dd-M-yyyy'
        });

        $("#txt_before_discount_amount").val(convert2digit(returnstringvalue($("#td_pop_payment_schedule_so_houseamount_" + row).text().trim())));
        $("#txt_discount_per").val(convert2digit(paymnet_info.DiscountPer));
        $("#txt_discount_amount").val(convert2digit(paymnet_info.DiscountAmount));
        $("#txt_special_dis_per").val(convert2digit(paymnet_info.SpecialDisPer));
        $("#txt_special_dis_amount").val(convert2digit(paymnet_info.SpecialDisAmount));
        $("#txt_booking_amount").val(convert2digit(paymnet_info.DepositAmt));
        var add_amt = returnstringvalue($("#td_pop_payment_schedule_so_additionalamt_" + row).text().trim());
        $("#txt_additional_amt").val(convert2digit(add_amt));

        var InstallmentAmt = parseFloat(returnstringvalue($("#td_pop_payment_schedule_so_houseamount_" + row).text().trim())) - (parseFloat(paymnet_info.DiscountAmount) + parseFloat(paymnet_info.SpecialDisAmount) + parseFloat(add_amt));

        $("#txt_after_discount").val(convert2digit(InstallmentAmt));
    }
}
function disable_enable_element(id, disable) {
    if (disable == 0) {
        $("#remove_pop_special_by_line_" + id).hide();
        $("#cbo_pop_special_payment_payment_option_" + id).attr('disabled', 'disabled');
        $("#txt_pop_special_payment_amount_" + id).attr('readonly', 'readonly');
        $("#txt_pop_special_payment_per_" + id).attr('readonly', 'readonly');
        $("#txt_pop_special_payment_period_" + id).attr('readonly', 'readonly');
        $("#txt_pop_special_payment_rate_" + id).attr('readonly', 'readonly');
    } else {
        $("#remove_pop_special_by_line_" + id).show();
        $("#cbo_pop_special_payment_payment_option_" + id).removeAttr('disabled');
        switch ($("#cbo_pop_special_payment_payment_option_" + id).val()) {
            case "DPS":
                $("#txt_pop_special_payment_amount_" + id).removeAttr('readonly');
                $("#txt_pop_special_payment_per_" + id).removeAttr('readonly');
                $("#txt_pop_special_payment_period_" + id).removeAttr('readonly');
                break;
            case "PNI":
                $("#txt_pop_special_payment_amount_" + id).removeAttr('readonly');
                $("#txt_pop_special_payment_per_" + id).removeAttr('readonly');
                $("#txt_pop_special_payment_period_" + id).removeAttr('readonly');
                break;
            case "PIA":
                $("#txt_pop_special_payment_amount_" + id).removeAttr('readonly');
                $("#txt_pop_special_payment_rate_" + id).removeAttr('readonly');
                break;
            case "PIP":
                $("#txt_pop_special_payment_period_" + id).removeAttr('readonly');
                $("#txt_pop_special_payment_rate_" + id).removeAttr('readonly');
                break;
        }
    }
}
function disable_enable_remove_by_line() {
    $("#table_payment_schedule >tbody>tr").each(function (index) {
        $("#tr_payment_detail_remove_line_" + index).hide();
    });
    var rowindex = $("#table_payment_schedule >tbody >tr").length;
    if (rowindex > 0) {
        var lasttr = $("#table_payment_schedule >tbody >tr:last");
        rowindex = lasttr.attr('id').replace("tr_payment_", "");
        if ($("#tr_payment_detail_status_line_" + rowindex).text().trim() == "O") {
            $("#tr_payment_detail_remove_line_" + rowindex).show();   
        }
    }
}

function set_date_of_payment() {
    const setStartMaturity = (tableId) => {
        const rows = $(`${tableId} >tbody >tr`);
        if (rows.length > 0) {
            const firstIndex = rows.first().attr("id")?.replace("tr_payment_", "");
            const lastIndex = rows.last().attr("id")?.replace("tr_payment_", "");
            if (firstIndex && lastIndex) {
                $("#txt_start_payment").val($(`#tr_payment_detail_paymentdate_line_${firstIndex}`).text().trim());
                $("#txt_maturity_payment").val($(`#tr_payment_detail_paymentdate_line_${lastIndex}`).text().trim());
            }
        }
    };

    setStartMaturity("#table_payment_schedule");
    setStartMaturity("#table_penalty_list");

    // Reinitialize datepicker
    $('.datetime').datepicker('destroy').datepicker({
        autoclose: true,
        format: 'dd-M-yyyy'
    });
}


function manualPaymentCheck() {
    if ($("#check_manual_payment").is(":checked") == true) {
        $("#txt_period").attr('readonly', 'readonly');
        $("#txt_fixed_monthly_payment").removeAttr('readonly');
        $("#txt_fixed_monthly_payment").val('0.00');
        $("#txt_period").val('0');
    } else {
        $("#btn_generate_payment_shcedule").removeAttr('disabled');
        $("#txt_period").removeAttr('readonly');
        $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
        $("#txt_fixed_monthly_payment").val('0.00');
        $("#txt_period").val('0');
    }    
}
function txt_period_change() {
    if ($("#cbo_payment_option").val()=="F") {
        var in_amount = returnstringvalue($("#txt_installment_amount").val());
        var in_rate_y = returnstringvalue($("#txt_installment_rate").val());
        var in_period = returnstringvalue($("#txt_period").val());
        if (in_amount != 0 && in_rate_y != 0 && in_period != 0) {
            var in_rate = (in_rate_y / 100) / 12;
            var payment = pmt(in_rate, in_period, in_amount, 0, 0);
            $("#txt_fixed_monthly_payment").val(convert2digit(returnstringvalue(payment)));
        }
    }
}
function txt_fixed_monthly_payment_change(){
    var in_amount = returnstringvalue($("#txt_installment_amount").val());
    var in_rate_y = returnstringvalue($("#txt_installment_rate").val());
    var in_payment = returnstringvalue($("#txt_fixed_monthly_payment").val());
    if (in_amount != 0 && in_rate_y != 0 && in_payment != 0) {
        var in_rate = (in_rate_y / 100) / 12;
        var in_period = Nper(in_rate, in_payment, in_amount, 0, 1);
        if (isNaN(in_period)) {
            $("#txt_period").val(returnstringvalue("0"));
            $("#btn_generate_payment_shcedule").attr('disabled', 'disabled');
            ShowAlertCus("Monthly Payment must grater than " + convert2digit(returnstringvalue(in_rate * in_amount))+"!","warning");
        } else {
            $("#txt_period").val(returnstringvalue(in_period));
            $("#btn_generate_payment_shcedule").removeAttr('disabled');
        }
    }
}
function txt_pop_special_payment_period_change(rowindex) {
    var in_amount = returnstringvalue($("#txt_installment_amount").val());
    var total = 0.00;
    $("#table_pop_special_payment > tbody >tr").each(function () {
        var id = $(this).attr('id').replace("tr_pop_speical_payment_", "");
        if (rowindex != id) {
            total = parseFloat(returnstringvalue(total)) + parseFloat(returnstringvalue($("#txt_pop_special_payment_amount_" + id).val()) * returnstringvalue($("#txt_pop_special_payment_period_" + id).val()));
        }
    });
    in_amount = parseFloat(returnstringvalue(in_amount)) - parseFloat(returnstringvalue(total));
    if (in_amount < 0) {
        check_remaining_amount(rowindex);
    } else {
        var in_rate_y = returnstringvalue($("#txt_pop_special_payment_rate_" + rowindex).val());
        var in_period = returnstringvalue($("#txt_pop_special_payment_period_" + rowindex).val());

        if (in_amount != 0 && in_rate_y != 0 && in_period != 0) {
            var in_rate = (in_rate_y / 100) / 12;
            var payment = pmt(in_rate, in_period, in_amount, 0, 0);
            if (in_amount < payment) {
                check_remaining_amount(rowindex);
            } else {
                $("#txt_pop_special_payment_amount_" + rowindex).val(convert2digit(returnstringvalue(payment)));
                $("#txt_pop_remaining_amount").val(convert2digit("0"));
            }
        } else {
            $("#txt_pop_remaining_amount").val(convert2digit(in_amount));
        }
    }
}
function txt_pop_special_payment_amount_change(rowindex) {
    var in_amount = returnstringvalue($("#txt_installment_amount").val());
    var total = 0.00;
    $("#table_pop_special_payment > tbody >tr").each(function () {
        var id = $(this).attr('id').replace("tr_pop_speical_payment_", "");
        if (rowindex != id) {
            total = parseFloat(returnstringvalue(total)) + parseFloat(returnstringvalue($("#txt_pop_special_payment_amount_" + id).val()) * returnstringvalue($("#txt_pop_special_payment_period_" + id).val()));
        }
    });
    in_amount = parseFloat(returnstringvalue(in_amount)) - parseFloat(returnstringvalue(total));

    if (in_amount < returnstringvalue($("#txt_pop_special_payment_amount_" + rowindex).val())) {
        check_remaining_amount(rowindex);
    } else{
        var in_rate_y = returnstringvalue($("#txt_pop_special_payment_rate_" + rowindex).val());
        var in_payment = returnstringvalue($("#txt_pop_special_payment_amount_" + rowindex).val());
        if (in_amount != 0 && in_rate_y != 0 && in_payment != 0) {
            var in_rate = (in_rate_y / 100) / 12;
            var in_period = Nper(in_rate, in_payment, in_amount, 0, 1);
            if (isNaN(in_period)) {
                $("#txt_pop_special_payment_period_" + rowindex).val(returnstringvalue("0"));
                ShowAlertCus("Monthly Payment must grater than " + convert2digit(returnstringvalue(in_rate * in_amount)) + "!","warning");
            } else {
                $("#txt_pop_special_payment_period_" + rowindex).val(returnstringvalue(in_period));
                $("#txt_pop_remaining_amount").val(convert2digit("0"));
            }
        } else {
            $("#txt_pop_remaining_amount").val(convert2digit(in_amount));
        }
    }
}
function txt_pop_special_line_payment_rate_change(rowindex) {
    if ($("#cbo_pop_special_payment_payment_option_" + rowindex).val() == "PIA") {
        txt_pop_special_payment_amount_change(rowindex);
    } else if ($("#cbo_pop_special_payment_payment_option_" + rowindex).val() == "PIP"){
        txt_pop_special_payment_period_change(rowindex);
    }
}
function txt_installment_rate_change() {
    if ($("#check_manual_payment").is(":checked") == true) {
        txt_fixed_monthly_payment_change();
    } else {
        txt_period_change();
    } 
}



function recalculate_remaining() {

    var totalBeforeDis = returnstringvalue($("#txt_before_discount_amount").val());
    $("#table_payment_schedule >tbody>tr").each(function (index) {
        index++;
        var principle = $("#tr_payment_detail_principle_line_" + index).text().trim();
        var interest = $("#tr_payment_detail_interest_line_" + index).text().trim();
        var totalMonthlyPay = parseFloat(returnstringvalue(principle));// + parseFloat(returnstringvalue(interest));
        totalAfterDis = parseFloat(returnstringvalue(totalAfterDis)) - parseFloat(returnstringvalue(totalMonthlyPay));
        $("#tr_payment_detail_remainingamt_line_" + index).text(convert2digit(totalAfterDis));
    });
    $("#txt_remaining_amount").val(convert2digit(totalBeforeDis));
    $("#txt_installment_amount").val(convert2digit(totalBeforeDis));
    if (parseFloat(convert2digit(totalBeforeDis)) == 0) {
        $("#txt_installment_rate").attr('readonly', 'readonly');
        $("#txt_period").attr('readonly', 'readonly');
        $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
        $("#check_manual_payment").prop('checked', false);
        $("#check_manual_payment").attr('disabled', 'disabled');
        $("#cbo_payment_option").val('');
        $("#cbo_payment_option").attr('disabled', 'disabled');
        $("#btn_generate_payment_shcedule").text('Generate');
        $("#txt_remaining_amount").val('0.00');
        $("#txt_installment_amount").val('0.00');
    } else {
        $("#cbo_payment_option").removeAttr('disabled');
        $("#cbo_payment_option").val('');
        $("#txt_remaining_amount").val(convert2digit(remainingAmt));
        $("#txt_installment_amount").val(convert2digit(remainingAmt));
    }
}
function recalculate_total_remaining() {
    var totalPrinciple = 0.00;
    var totalInterest = 0.00;
    var totalMonthlyPay = 0.00;
    var totalNewRemain = 0.00;

    $("#table_payment_schedule >tbody>tr").each(function (index) {
        index++;
        var Principle = $("#tr_payment_detail_principle_line_" + index).text().trim();
        var Interest = $("#tr_payment_detail_interest_line_" + index).text().trim();
        var MonthlyPay = $("#tr_payment_detail_monthlypay_line_" + index).text().trim();

        totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue(Principle));
        totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue(Interest));
        totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue(MonthlyPay));
    });

    $("#txt_total_principle").text(convert2digit(totalPrinciple));
    $("#txt_total_interest").text(convert2digit(totalInterest));
    $("#txt_total_monthly").text(convert2digit(totalMonthlyPay));

    var afterdis = returnstringvalue($("#txt_after_discount").val());
    var beforedis = returnstringvalue($("#txt_before_discount_amount").val());

    if (!beforedis) {
        beforedis = afterdis;
    }


    var buybackAmt = returnstringvalue($("#txt_buyback_amt").val());



    beforedis = parseFloat(beforedis) - parseFloat(0);




    var remainingAmt = parseFloat(beforedis) - parseFloat(totalPrinciple);

 

    newremainingAmt = parseFloat(buybackAmt) - parseFloat(totalPrinciple);






    if (parseFloat(convert2digit(remainingAmt)) == 0) {
        $("#txt_installment_rate").attr('readonly', 'readonly');
        $("#txt_period").attr('readonly', 'readonly');
        $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
        $("#check_manual_payment").prop('checked', false);
        $("#check_manual_payment").attr('disabled', 'disabled');
        $("#cbo_payment_option").val('');
        $("#cbo_payment_option").attr('disabled', 'disabled');
        $("#btn_generate_payment_shcedule").text('Generate');
        $("#txt_remaining_amount").val('0.00');
        $("#txt_installment_amount").val('0.00');
    } else {
        $("#cbo_payment_option").removeAttr('disabled');
        $("#cbo_payment_option").val('');
        $("#txt_remaining_amount").val(convert2digit(remainingAmt));
        $("#txt_installment_amount").val(convert2digit(remainingAmt));
    }

    /// This condition apply for the reprocess
    if (parseFloat(convert2digit(newremainingAmt)) == 0) {
        $("#txt_installment_rate").attr('readonly', 'readonly');
        $("#txt_period").attr('readonly', 'readonly');
        $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
        $("#check_manual_payment").prop('checked', false);
        $("#check_manual_payment").attr('disabled', 'disabled');
        $("#cbo_payment_option").val('');
        $("#cbo_payment_option").attr('disabled', 'disabled');
        $("#btn_generate_payment_shcedule").text('Generate');
        $("#txt_remaining_amount").val('0.00');
        $("#txt_installment_amount").val('0.00');
    } else if (parseFloat(convert2digit(newremainingAmt)) > 0) {
        $("#cbo_payment_option").removeAttr('disabled');
        $("#cbo_payment_option").val('');
        $("#txt_remaining_amount").val(convert2digit(newremainingAmt));
        $("#txt_installment_amount").val(convert2digit(newremainingAmt));
    }
}
function check_remaining_amount(rowindex) {
    ShowAlertCus("Payment Amount grater than Remaining Amount!","warning");
    $("#txt_pop_special_payment_amount_" + rowindex).val('0.00');
    $("#txt_pop_special_payment_per_" + rowindex).val('0.00');
    $("#txt_pop_special_payment_period_" + rowindex).val('1');
    $("#txt_pop_special_payment_rate_" + rowindex).val('0.00');
    var remaining = returnstringvalue($("#txt_installment_amount").val());
    var total = 0.00;
    $("#table_pop_special_payment > tbody >tr").each(function () {
        var id = $(this).attr('id').replace("tr_pop_speical_payment_", "");
        total = parseFloat(returnstringvalue(total)) + parseFloat(returnstringvalue($("#txt_pop_special_payment_amount_" + id).val()));
    });
    var balance = parseFloat(remaining) - parseFloat(returnstringvalue(total));

    $("#txt_pop_remaining_amount").val(convert2digit(balance));
}
function pmt(monthlyRate, monthlyPayments, presentValue, residualValue, advancedPayments) {
    t1 = 1 + monthlyRate
    t2 = Math.pow(t1, monthlyPayments)
    t3 = Math.pow(t1, (monthlyPayments - advancedPayments))
    return (presentValue - (residualValue / t2)) / (((1 - (1 / (t3))) / monthlyRate) + advancedPayments);
}
function Nper(monthlyRate, monthlPayment, principalAmount, fv, k) {
    var nper = 0;
    //int fv = 0;
    //int k = 1;
    var t1 = returnstringvalue((-fv * (monthlyRate / k) + -monthlPayment) / (-monthlPayment + (monthlyRate / k) * principalAmount));
    var t2 = returnstringvalue(1 + monthlyRate);
    ///alert(t1 + "===" + t2 + "===" + (-fv * (monthlyRate / k) + -monthlPayment) + "===" + (-monthlPayment) + "==" + (monthlyRate / k) * principalAmount);
    nper = Math.log10(t1) / Math.log10(t2);

    return Math.round(nper);
}


//// chagne owner
function get_contact_person_by_card_code_new(cardcode) {
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
            $("#cbo_new_contact_person").empty();
            var option = "";
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                option = option + "<option value='" + x.Cntctcode + "'>" + x.ENName + "</option>";
            }
            $("#cbo_new_contact_person").append(option);
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}

var range;


function cmd_pop_choose_customer_activity() {

    var id = $("#txt_bp_selected_row").val();
    var cardcode = $("#td_pop_vendor_cust_code_" + id).text();
    var cardname = $("#td_pop_vendor_cust_name_" + id).text();

    $("#txt_customer_code").val(cardcode);
    $("#txt_card_name").val(cardname);
    $("#txt_phone").val($("#td_pop_vendor_phone_" + id).text().trim());
    $("#modal-cust_list").modal('hide');

    $("#txt_bp_selected_row").val("-1");

    /// Clean Old Data 
    $("#txt_ar_balance").val(0);  
    $("#txt_loanID").val("");
    $("#txt_item_name").val("");
    $("#txt_serial").val("");

    // ✅ Clear Loan Table
    $("#table_loan_list tbody").empty();

    // Optional: reset select icon
    $("#tr_payment_detail_uncheck_all").hide();

    tr_pop_customer_selected('-1');
}

function cmd_pop_choose_customer_change_owner() {


    var cartType = $("#txt_cardtype").val();

    if (cartType == '1') {

        var id = $("#txt_bp_selected_row").val();
        var cardcode = $("#td_pop_vendor_cust_code_" + id).text();
        var cardname = $("#td_pop_vendor_cust_name_" + id).text();


        if (range == "2") {
            $("#txt_tcard_code").val(cardcode);


        }
        else {
            $("#txt_card_code").val(cardcode);
        }

        $("#txt_card_name").val(cardname);
        $("#txt_phone").val($("#td_pop_vendor_phone_" + id).text().trim());
        $("#modal-cust_list").modal('hide');
        get_contact_person_by_card_code(cardcode);
        $("#txt_bp_selected_row").val("-1");
        ///Clean Old Data 
        $("#txt_house_code").val("");
        $("#txt_after_discount").val(0);
        $("#txt_after_serial").val("");

        $("#txt_item_name").val("");
        $("#txt_start_payment").val("");
        $("#txt_docentry").val("");

        $("#txt_new_card_code").val("");
        $("#txt_new_card_name").val("");
        $("#txt_new_phone").val("");

        //clear_form_data();

        tr_pop_customer_selected('-1');

    } else if (cartType == '2') {
        var id = $("#txt_bp_selected_row").val();
        var cardcode = $("#td_pop_vendor_cust_code_new_" + id).text();
        var cardname = $("#td_pop_vendor_cust_name_new_" + id).text();
        $("#txt_new_card_code").val(cardcode);
        $("#txt_new_card_name").val(cardname);
        $("#txt_new_phone").val($("#td_pop_vendor_phone_new_" + id).text().trim());
        $("#modal-cust_new_list").modal('hide');
        get_contact_person_by_card_code_new(cardcode);
        $("#txt_bp_selected_row").val("-1");
        tr_pop_customer_new_selected('-1');
    }
}



function cmd_show_customer_change_house(type, r) {

    range = r;

    $("#txt_cardtype").val(type);
    if (type == '2' && ($("#txt_card_code").val() == '' || $("#table_payment_schedule >tbody >tr").length == 0)) {
        ShowAlertCus("Please choose old customer and house infomation first!", "warning");
    } else if (type == '2') {
        $("#modal-cust_new_list").modal('show');
    } else {
        $("#modal-cust_list").modal('show');
    }
}




function cmd_show_customer_Activity() {
    $("#modal-cust_list").modal('show');
}



function cmd_show_customer_penaltywizard() {
    $("#modal-cust_list").modal('show');
}

////invoice 
function get_invoice_listing() {
    var pro = $("#cbo_sales_holdunit_project").val();
    var block = $("#cbo_sales_holdunit_block").val();
    var cardcode = $("#txt_card_code").val();

    $.ajax({
        url: '/getDataSales/get_invoice_listing',
        type: 'POST',
        data: { procode: pro, block: block, cardcode: cardcode},
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (dt) {
            var oslp = "<option value=''></option>";
            $("#table_sales_invoice_list >tbody>tr").remove();
            if (dt.data.length == 0) {
                ShowAlertCus("No data found!", "warning");
            }
            for (i = 0; i < dt.data.length; i++) {
                var x = dt.data[i];
                data = "<tr>";
                data = data + "<td>"+(i+1)+"</td>";
                data = data + "<td id='tr_invoice_list_docnum_" + i + "'><a href='/othersales/Invoice?Key=" + x.DocEntry + "'>" + x.DocNum + "</a></td>";
                data = data + "<td id='tr_invoice_list_docdate_" + i + "'>" + x.DocDate + "</td>";
                data = data + "<td id='tr_invoice_list_duedate_" + i + "'>" + x.DueDate + "</td>";
                data = data + "<td id='tr_invoice_list_cardname_" + i + "'>" + x.CardCode + "</td>";
                data = data + "<td id='tr_invoice_list_cardname_" + i + "'>" + x.CardName + "</td>";
                data = data + "<td id='tr_invoice_list_ocrcode_" + i + "'>" + x.OcrCode + "</td>";
                data = data + "<td id='tr_invoice_list_ocrcode2_" + i + "'>" + x.OcrCode2 + "</td>";
                data = data + "<td id='tr_invoice_list_ocrcode3_" + i + "'>" + x.OcrCode3 + "</td>";
                data = data + "<td id='tr_invoice_list_subtotal_" + i + "'>" + convert2digit(x.SubTotal) + "</td>";
                data = data + "<td id='tr_invoice_list_docstatus_" + i + "'>" + x.DocStatus + "</td>";
                data = data + "<td id='tr_invoice_list_syn_" + i + "'>" + x.SAPIntegrationStatus + "</td>";
                data = data + "<td id='tr_invoice_list_docentry_" + i + "' style='display:none;'>" + x.DocEntry + "</td>";
                data = data + "</tr>";
                $("#table_sales_invoice_list >tbody").append(data);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function cmd_pop_choose_customer_InvoiceList() {
    var id = $("#txt_bp_selected_row").val();
    var cardcode = $("#td_pop_vendor_cust_code_" + id).text();
    var cardname = $("#td_pop_vendor_cust_name_" + id).text();
    $("#txt_card_code").val(cardcode);
    $("#txt_card_name").val(cardname);
    $("#modal-cust_list").modal('hide');
    $("#txt_item_selected_row").val("-1");
    tr_pop_customer_selected('-1');
}
function cmd_copy_to_memo() {
    var dockey = $("#txt_entry").val();
    window.location.replace("/othersales/MemoInvoice?Key=" + dockey);
    //location.href = "/othersales/MemoInvoice?Key="+ dockey;
}

//// AR Memo
function txt_docdate_memo_change() {
    Get_Document_Number_Booking("CNR");
}
function txt_line_memo_total_change(selectedIndex) {

    var line = returnstringvalue($("#txt_line_memo_total_" + selectedIndex).val());
    var ori = returnstringvalue($("#txt_line_total_ar_" + selectedIndex).text());
    $("#txt_line_memo_total_" + selectedIndex).val(convert2digit(line));

    if (parseFloat(line) > parseFloat(ori)) {
        $("#txt_line_memo_total_" + selectedIndex).val(convert2digit(ori));
        ShowAlertCus("Input amount over original amount!", "warning");
    }

    var totalLine = 0;
    $("#table_invoice_list >tbody>tr").each(function (index) {
        totalLine = parseFloat(totalLine) + parseFloat(returnstringvalue($("#txt_line_memo_total_" + index).val()));
    });
    $("#txt_total_applied").text(convert2digit(totalLine));
}
function cmd_save_memo() {
    var totalApplied = returnstringvalue($("#txt_total_applied").text().trim());
    var totalDue = returnstringvalue($("#txt_total_balance_due").text().trim());
    var remainingAmt = parseFloat(totalDue) - parseFloat(totalApplied);
    if (parseFloat(remainingAmt)<0) {
        ShowAlertCus("Applied Amount over Balance Due!", "warning");
    } else {
        var cn_list = [];
        var docdate = $('#txt_doc_date').val().trim().split("-");
        var reqdate = $('#txt_due_date').val().trim().split("-");

        var head = {
            DocEntry: $("#txt_entry").val(),
            DocDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            DueDate: reqdate[2] + "/" + reqdate[1] + "/" + reqdate[0],
            DocumentDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            CardCode: $("#txt_card_code").val(),
            CardName: $("#txt_card_name").val(),
            ContactPerson: $("#cbo_contact_person").val(),
            SlpCode: '-1',
            NumatCard: $("#txt_house_code").val(),
            SubTotal: totalApplied,
            DocTotal: totalApplied,
            DiscountAmt: '0.00',
            DiscountPer: '0.00',
            BalanceDue: totalApplied,
            OcrCode: $("#txt_project").val(),
            CreatedBy: $("#txt_shared_userid").val(),
            DocStatus: 'Closed'
        };
        //// CN Detail
        $("#table_invoice_list >tbody>tr").each(function (index) {
            var row1 = {
                LineNum: $("#txt_linenum_memo_" + index).text().trim(),
                ItemCode: $("#txt_itemcode_memo_" + index).text().trim(),
                ItemName: $("#txt_itemname_memo_" + index).text().trim(),
                Quantity: '1',
                UPrice: returnstringvalue($("#txt_line_memo_total_" + index).val()),
                UomEntry: '-1',
                LineTotal: returnstringvalue($("#txt_line_memo_total_" + index).val()),
                Discount: '0.00',
                SlpCode: '-1',
                ProjectCode: $("#txt_ocrcode_memo_" + index).text().trim(),
                OcrCode: $("#txt_ocrcode_memo_" + index).text().trim(),
                OcrCode2: $("#txt_ocrcode2_memo_" + index).text().trim(),
                OcrCode3: $("#txt_ocrcode3_memo_" + index).text().trim(),
                BaseEntry: $("#txt_base_entry_memo_" + index).text().trim(),
                BaseLine: $("#txt_base_line_memo_" + index).text().trim(),
                LineStatus: 'Closed'
            };
            cn_list.push(row1);
        });
               
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/sales/save_memo',
            data: JSON.stringify(
                {
                    'header': head,
                    'detail': cn_list
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    ShowAlertCus("AR Memo was saved", "success");
                    window.location.replace("/othersales/MemoInvoiceEdit?Key=" + data.lastEntry);
                } else {
                    ShowAlertCus("Somethings wrong!", "warning");
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}

//// BuyBack
function cmd_pop_choose_customer_buyBack() {
    var id = $("#txt_bp_selected_row").val();
    var cardcode = $("#td_pop_vendor_cust_code_" + id).text();
    var cardname = $("#td_pop_vendor_cust_name_" + id).text();
    $("#txt_card_code").val(cardcode);
    $("#txt_card_name").val(cardname);
    $("#modal-cust_list").modal('hide');
    get_contact_person_by_card_code(cardcode);
    $("#txt_item_selected_row").val("-1");
    $("#txt_item_code").val('');
    $("#txt_house_code").val('');
    $("#txt_ar_amt").val('0.00');
    $("#txt_item_name").val('');
    $("#txt_buyback_amt").val('0.00');
    $("#table_payment_schedule >tbody >tr").remove();
    $("#table_payment_schedule_AR >tbody >tr").remove();
    $("#txt_generatedar_amt").val('0.00');
    $("#txt_remaining_installment").val('0.00');
    $("#txt_before_discount_amount").val('0.00');
    $("#txt_doc_num").val('');
}
function cmd_pop_choose_payment_schedule_buyBack() {
    var row = $("#txt_payment_schedule_selected_row").val();
    if (row == -1) {
        ShowAlertCus("No booking selected!", "warning");
    } else {
        var docentry = $("#td_pop_payment_schedule_so_entry_" + row).text();
        var linenum = $("#td_pop_payment_schedule_so_line_" + row).text();

        $.ajax({
            url: '/sales/get_payment_schedule_by_so_BuyBack',
            type: 'POST',
            data: {
                soEntry: docentry,
                rowStatus: 'ALL'
            },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                var mydata = data.data;
                var totalPrinciple = 0.00;
                var totalInterest = 0.00;
                var totalMonthlyPay = 0.00;
                var ItemPrice = 0.00;
                var DocEntry = null;
                var GeneratedAR = 0.00;
                var SerialNumber = null;

                $("#table_payment_schedule >tbody >tr").remove();
                $("#table_payment_schedule_AR >tbody >tr").remove();
                var index = 1;
                for (i = 0; i < mydata.length; i++) {


                    var x = mydata[i];
                    ItemPrice = x.HouseAmount;
                    DocEntry = x.BaseEntry;
                    SerialNumber = x.DistNumber;

                    var data = "<tr id='tr_payment_" + index + "'>";
                    data = data + "<td><i class='fa fa-fw fa-remove' id='tr_payment_detail_remove_line_" + index + "'  style='cursor:pointer;display:none;' onclick='cmd_tr_payment_detail_remove_line(" + index + ")'></i></td>";

                    data = data + "<td><input type='checkbox' id='tr_payment_detail_checkbox_remove_line_" + index + "' style='cursor:not-allowed;' disabled></td>";

                    data = data + "<td style='text-align:Left;'>" + index + "</td>";

                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_InstallmentDate_line_" + index + "'>" + x.InstallmentDate + "</td>";

                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_paymentdate_line_" + index + "'>" + x.DueDate + "</td>";

                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_principle_line_ar_" + index + "'>" + convert2digit(x.Principle) + "</td>";
                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_interest_line_ar_" + index + "'>" + convert2digit(x.Interest) + "</td>";
                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_monthlypay_line_ar_" + index + "'>" + convert2digit(x.MonthlyPay) + "</td>";
                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_remainingamt_line_ar_" + index + "'>" + convert2digit(x.RemainingAmt) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamtandinterest_line_" + index + "'>" + convert2digit(parseFloat(x.RemainingAmt) + parseFloat(x.Interest)) + "</td>";
                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_culnterest_line_ar_" + index + "'>" + convert2digit(x.CuInterest) + "</td>";
                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_cupayment_line_ar_" + index + "'>" + convert2digit(x.CuPayment) + "</td>";
                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_cupayment_line_ar_" + index + "'>" + convert2digit(x.CuPayment + x.CuInterest) + "</td>";

                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_method_line_ar_" + index + "'>" + x.Method + "</td>";
               
                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_arno_line_ar_" + index + "'>" + x.ARNo + "</td>";
                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_paymentno_line_ar_" + index + "'>" + x.PaymentNo + "</td>";
                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_arnointerest_line_ar_" + index + "'>" + x.ARNoInterest + "</td>";
                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_paymentnointerest_line_ar_" + index + "'>" + x.PaymentNoInterest + "</td>";
                    data = data + "<td style='text-align:Left;' id='tr_payment_detail_remarks_line_ar_" + index + "'>" + x.Remarks + "</td>";

                    data = data + "<td style='display:none;' id='tr_payment_detail_itemcode_line_ar_" + index + "'>" + x.ItemCode + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemname_line_ar_" + index + "'>" + x.ItemName + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_rowno_line_ar_" + index + "'>" + x.RowNo + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_accamt_line_ar_" + index + "'>" + convert2digit(x.AccAmt) + "</td>";


                    data = data + "<td style='display:none;' id='tr_payment_detail_period_line_ar_" + index + "'>" + convert2digit(x.U_Period) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_annulrate_line_ar_" + index + "'>" + convert2digit(x.U_AnnulRate) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_depositamt_line_ar_" + index + "'>" + convert2digit(x.DepositAmt) + "</td>";

                    data = data + "<td style='display:none;' id='tr_payment_detail_baseentry_line_ar_" + index + "'>" + docentry + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_status_line_ar_" + index + "'>" + x.Status.trim() + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseline_line_ar_" + index + "'>" + linenum + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_arno_line_ar_" + index + "'>" + x.ARNo + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_paymentno_line_ar_" + index + "'>" + x.PaymentNo + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_fixedpayment_line_ar_" + index + "'>" + convert2digit(x.FixedPayment) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_housestatus_line_ar_" + index + "'>" + x.HouseStatus + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_remarks_line_ar_" + index + "'>" + x.Remarks + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_installmentid_line_ar_" + index + "'>" + x.ID + "</td>";
                    data = data + "</tr>";
                    $("#table_payment_schedule_AR >tbody").append(data);

                    totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue(x.Principle));
                    totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue(x.Interest));
                    totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue(x.MonthlyPay));

                    if (x.ARNo !== "-1" && x.PaymentNo !== "-1") {
                        GeneratedAR += parseFloat(returnstringvalue(x.Principle));
                    }

                    index++;
                }

                totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue($("#txt_total_principle_ar").text()));


                $("#txt_total_principle_ar").text(convert2digit(totalPrinciple));
                totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue($("#txt_total_interest_ar").text()));
                $("#txt_total_interest_ar").text(convert2digit(totalInterest));
                totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue($("#txt_total_monthly_ar").text()));
                $("#txt_total_monthly_ar").text(convert2digit(totalMonthlyPay));

                var add_amt = returnstringvalue($("#td_pop_payment_schedule_so_additionalamt_" + row).text().trim());
                /*var InstallmentAmt = parseFloat(returnstringvalue($("#td_pop_payment_schedule_so_houseamount_" + row).text().trim())) - (parseFloat(mydata[0].DiscountAmount) + parseFloat(mydata[0].SpecialDisAmount) + parseFloat(add_amt));*/
                var InstallmentAmt = ItemPrice;
                $("#txt_before_discount_amount").val(convert2digit(InstallmentAmt));

                $("#txt_ar_amt").val(convert2digit(totalPrinciple));

                $("#txt_generatedar_amt").val(convert2digit(GeneratedAR));

                var re_installment = parseFloat(InstallmentAmt) - parseFloat(GeneratedAR);


                update_data_buyBack(row);
                $("#txt_buyback_amt").val('0.00');
                $("#txt_after_discount").val('0.00');
                $("#txt_installment_amount").val('0.00');
                $("#txt_remaining_amount").val('0.00');

/*                $("#txt_remaining_installment").val(re_installment);*/

                $("#txt_remaining_installment").val(convert2digit(re_installment));

                $("#txt_doc_num").val(DocEntry);
                $("#modal-schedule-list").modal('hide');
                $("#txt_payment_schedule_selected_row").val("-1");
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}

function update_data_buyBack(row) {

    $("#txt_item_code").val($("#td_pop_payment_schedule_so_itemcode_" + row).text().trim());
    $("#txt_house_code").val($("#td_pop_payment_schedule_ocrcode3_" + row).text().trim());
    $("#txt_item_name").val($("#td_pop_payment_schedule_so_itemname_" + row).text().trim());

    $("#txt_so_entry").val($("#td_pop_payment_schedule_so_entry_" + row).text().trim());
    $("#txt_so_line").val($("#td_pop_payment_schedule_so_line_" + row).text().trim());
    $("#txt_project").val($("#td_pop_payment_schedule_ocrcode_" + row).text().trim());
    $("#txt_ocrcode").val($("#td_pop_payment_schedule_ocrcode_" + row).text().trim());
    $("#txt_ocrcode2").val($("#td_pop_payment_schedule_ocrcode2_" + row).text().trim());
    $("#txt_ocrcode3").val($("#td_pop_payment_schedule_ocrcode3_" + row).text().trim());
}

function txt_change_buyback_amt() {
    var buyback_amt = returnstringvalue($("#txt_buyback_amt").val());
    var remaininginstall_amt = returnstringvalue($("#txt_remaining_installment").val());
    var remainingamount = convert2digit(buyback_amt);

    $("#txt_remaining_amount").val(convert2digit(buyback_amt));
    $("#txt_installment_amount").val(convert2digit(remainingamount));
    $("#txt_varian_amount").val(convert2digit(remaininginstall_amt - buyback_amt));
    $("#txt_buyback_amt").val(convert2digit(buyback_amt));
    /*recalculate_total_remaining();*/
    if (parseFloat(returnstringvalue($("#txt_installment_amount").val())) <= 0) {
        ShowAlertCus("Installment Amount can not less than zero!", "warning");
    }
}

function cmd_save_buyback() {

    if ($("#txt_card_code").val() == "" || convert2digit(returnstringvalue($("#txt_buyback_amt").val())) == '0.00' || convert2digit(returnstringvalue($("#txt_ar_amt").val())) == '0.00') {
        ShowAlertCus("Data not enough!", "warning");
    } else {
        var cn_list = [];
        var docdate = $('#txt_doc_date').val().trim().split("-");
        var reqdate = $('#txt_due_date').val().trim().split("-");
        var AR_amt = returnstringvalue($("#txt_before_discount_amount").val());
        var buyback_amt = returnstringvalue($("#txt_buyback_amt").val());
        var varian_amt = returnstringvalue($("#txt_varian_amount").val());

        //// CN Header
        var head = {
            DocEntry: '-1',
            DocDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            DueDate: reqdate[2] + "/" + reqdate[1] + "/" + reqdate[0],
            DocumentDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            CardCode: $("#txt_card_code").val(),
            CardName: $("#txt_card_name").val(),
            ContactPerson: $("#cbo_contact_person").val(),
            SlpCode: '-1',
            NumatCard: $("#txt_house_code").val(),
            SubTotal: buyback_amt,
            DocTotal: buyback_amt,
            DiscountAmt: '0.00',
            DiscountPer: '0.00',
            BalanceDue: buyback_amt,
            TotalAR: AR_amt,
            VarianAmt: varian_amt,
            OcrCode: $("#txt_ocrcode").val(),
            RefNo: $("#txt_refno").val(),
            Comment: $("#txt_remark").val(),
            CreatedBy: $("#txt_shared_userid").val(),
            DocStatus: 'Draf',
            DocNum: $("#txt_doc_num").val(),
            GeneratedAR: $("#txt_generatedar_amt").val()
        };
        //// CN Detail
        var row1 = {
            LineNum: "0",
            ItemCode: $("#txt_item_code").val(),
            ItemName: $("#txt_item_name").val(),
            Quantity: '1',
            UPrice: buyback_amt,
            UomEntry: '-1',
            LineTotal: buyback_amt,
            Discount: '0.00',
            SlpCode: '-1',
            ProjectCode: $("#txt_ocrcode").val(),
            OcrCode: $("#txt_ocrcode").val(),
            OcrCode2: $("#txt_ocrcode2").val(),
            OcrCode3: $("#txt_ocrcode3").val(),
            BaseEntry: $("#txt_doc_num").val(),
            BaseLine: '-99',
            LineStatus: 'C'
        };
        cn_list.push(row1);

        //// Installment Row
        var installmentRow_List = [];
        var ar_list = [];
        $("#table_payment_schedule >tbody >tr").each(function (index) {
            index++;
            if ($("#tr_payment_detail_installmentid_line_" + index).text().trim() == '-1') {
                var docdate = $('#InstallmentDate_' + index).val().split("-");
                var docduedate = $('#tr_payment_detail_paymentdate_line_' + index).text().split("-");
                var detail = {
                    ID: $("#tr_payment_detail_installmentid_line_" + index).text().trim(),
                    BaseEntry: $("#tr_payment_detail_baseentry_line_" + index).text().trim(),
                    BaseLine: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                    VisOrder: (index - 1),
                    ItemCode: $("#tr_payment_detail_itemcode_line_" + index).text().trim(),
                    Principle: returnstringvalue($("#tr_payment_detail_principle_line_" + index).text().trim()),
                    Interest: returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim()),
                    Monthly: returnstringvalue($("#tr_payment_detail_monthlypay_line_" + index).text().trim()),
                    PaymentDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
                    DueDate: docduedate[2] + "/" + docduedate[1] + "/" + docduedate[0],
                    Remaining: returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim()),
                    ReIncloudInter: parseFloat(returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim())) + parseFloat(returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim())),
                    RowStatus: "C",
                    CuInterest: returnstringvalue($("#tr_payment_detail_culnterest_line_" + index).text().trim()),
                    CuPayment: returnstringvalue($("#tr_payment_detail_cupayment_line_" + index).text().trim()),
                    FixedPayment: returnstringvalue($("#tr_payment_detail_fixedpayment_line_" + index).text().trim()),
                    ARNo: -1,
                    PaymentNo: -1,
                    Method: $("#select_method_" + index).val(),
                    InstallmentAmt: returnstringvalue($("#txt_after_discount").val().trim()),
                    DiscountAmt: "0.00",
                    DepositAmt: returnstringvalue($("#tr_payment_detail_depositamt_line_" + index).text().trim()),
                    AnnualRate: returnstringvalue($("#tr_payment_detail_annulrate_line_" + index).text().trim()),
                    PeriodMonths: returnstringvalue($("#tr_payment_detail_period_line_" + index).text().trim()),
                    HouseStatus: $("#tr_payment_detail_housestatus_line_" + index).text().trim(),
                    Remarks: $("#tr_payment_detail_remarks_line_" + index).text(),
                    DiscountAmount: "0.00",
                    DiscountPer: "0.00",
                    SpecialDisAmount: "0.00",
                    SpecialDisPer: "0.00",
                    AdditionalDisAmount: "0.00",
                    AdditionalDisPer: "0.00",
                    ItemName: $("#tr_payment_detail_itemname_line_" + index).text().trim(),
                    OcrCode: $("#txt_ocrcode").val(),
                    OcrCode2: $("#txt_ocrcode2").val(),
                    OcrCode3: $("#txt_ocrcode3").val(),
                    RowType:'Installment'
                };
                installmentRow_List.push(detail);
            }
        });
        $("#table_payment_schedule_AR >tbody >tr").each(function (index) {
            index++;

            var ar = {
                ID: $("#tr_payment_detail_installmentid_line_ar_" + index).text().trim(),
                BaseEntry: $("#tr_payment_detail_baseentry_line_ar_" + index).text().trim(),
                BaseLine: $("#tr_payment_detail_baseline_line_ar_" + index).text().trim(),
                VisOrder: (index - 1),
                ItemCode: $("#tr_payment_detail_itemcode_line_ar_" + index).text().trim(),
                Principle: returnstringvalue($("#tr_payment_detail_principle_line_ar_" + index).text().trim()),
                Interest: returnstringvalue($("#tr_payment_detail_interest_line_ar_" + index).text().trim()),
                Monthly: returnstringvalue($("#tr_payment_detail_monthlypay_line_ar_" + index).text().trim()),
                PaymentDate: $("#tr_payment_detail_InstallmentDate_line_" + index).text(),
                DueDate: $("#tr_payment_detail_paymentdate_line_" + index).text(),
                Remaining: returnstringvalue($("#tr_payment_detail_remainingamt_line_ar_" + index).text().trim()),
                ReIncloudInter: parseFloat(returnstringvalue($("#tr_payment_detail_remainingamt_line_ar_" + index).text().trim())) + parseFloat(returnstringvalue($("#tr_payment_detail_interest_line_ar_" + index).text().trim())),
                RowStatus: $("#tr_payment_detail_status_line_ar_" + index).text().trim(),
                CuInterest: returnstringvalue($("#tr_payment_detail_culnterest_line_ar_" + index).text().trim()),
                CuPayment: returnstringvalue($("#tr_payment_detail_cupayment_line_ar_" + index).text().trim()),
                FixedPayment: returnstringvalue($("#tr_payment_detail_fixedpayment_line_ar_" + index).text().trim()),
                ARNo: $("#tr_payment_detail_arno_line_ar_" + index).text().trim(),
                PaymentNo: $("#tr_payment_detail_paymentno_line_ar_" + index).text().trim(),
                Method: $("#tr_payment_detail_method_line_ar_" + index).text().trim(),
                InstallmentAmt: "0.00",
                DiscountAmt: "0.00",
                DepositAmt: returnstringvalue($("#tr_payment_detail_depositamt_line_ar_" + index).text().trim()),
                AnnualRate: returnstringvalue($("#tr_payment_detail_annulrate_line_ar_" + index).text().trim()),
                PeriodMonths: returnstringvalue($("#tr_payment_detail_period_line_ar_" + index).text().trim()),
                HouseStatus: $("#tr_payment_detail_housestatus_line_ar_" + index).text().trim(),
                Remarks: $("#tr_payment_detail_remarks_line_ar_" + index).text().trim(),
                DiscountAmount: "0.00",
                DiscountPer: "0.00",
                SpecialDisAmount: "0.00",
                SpecialDisPer: "0.00",
                AdditionalDisAmount: "0.00",
                AdditionalDisPer: "0.00",
                ItemName: $("#tr_payment_detail_itemname_line_ar_" + index).text().trim(),
                OcrCode: $("#txt_ocrcode").val(),
                OcrCode2: $("#txt_ocrcode2").val(),
                OcrCode3: $("#txt_ocrcode3").val(),
                RowType:'AR'
            };
            ar_list.push(ar);
        });

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/sales/save_buyback',
            data: JSON.stringify(
                {
                    'header': head,
                    'cn_inList': cn_list,
                    'detail': installmentRow_List,
                    'ar_inList': ar_list,
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status === "OK") {
                    ShowAlertCus("Buyback was saved", "success");
                    location.reload();
                } else {
                    ShowAlertCus(data.status, "warning"); // 👈 show server message
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}

//// payment option 
function cmd_pop_choose_customer_PaymentOption() {
    cmd_pop_choose_customer();
    $("#cbo_payment_option").val('');
    $("#btn_generate_payment_shcedule").text('Generate');
    $("#txt_total_principle").text('0.00');
    $("#txt_total_interest").text('0.00');
    $("#txt_total_monthly").text('0.00');
}


function cmd_pop_choose_customer_interest() {
    var id = $("#txt_bp_selected_row").val();
    var cardcode = $("#td_pop_vendor_cust_code_" + id).text();
    var cardname = $("#td_pop_vendor_cust_name_" + id).text();
    var serial = $("#td_pop_vendor_cust_distnumber_" + id).text();
    var ref = $("#td_pop_vendor_cust_baseentry_" + id).text();
    $("#txt_card_code").val(cardcode);
    $("#txt_card_name").val(cardname);
    $("#txt_serial").val(serial);
    $("#txt_ref").val(ref);
    $("#modal-cust_list").modal('hide');
    $("#txt_bp_selected_row").val("-1");
    // 🔹 Clear existing rows before adding new ones
    $("#table_interestwizard_list > tbody").empty();
}


//Get Data from Datbase
function tr_pop_payment_schedule_selected(rowindex) {
    $("#table_pop_schedule_list > tbody > tr").each(function (index) {
        $("#tr_pop_payment_schedule_" + index).css("background-color", "white");
    });
    $("#tr_pop_payment_schedule_" + rowindex).css("background-color", "#e6f0ff");
    $("#txt_payment_schedule_selected_row").val(rowindex);
}

function tr_pop_payment_schedule_selected_ChangeItem(rowindex) {
    $("#table_pop_schedule_changeitem_list > tbody > tr").each(function (index) {
        $("#tr_pop_payment_schedule_changeitem_" + index).css("background-color", "white");
    });
    $("#tr_pop_payment_schedule_changeitem_" + rowindex).css("background-color", "#e6f0ff");
    $("#txt_payment_schedule_changeitem_selected_row").val(rowindex);
}

function tr_pop_schedule_list_selected(selectedindex) {
    $("#table_pop_schedule_list > tbody > tr").each(function (index) {
        $("#tr_pop_schedule_list_" + (index + 1)).css("background-color", "white");
    });
    $("#tr_pop_schedule_list_" + selectedindex).css("background-color", "#e6f0ff");
    $("#txt_item_selected_row").val(selectedindex);
}

// Define the options
const methodOptions = [
    { code: 'BKN', name: 'Booking' },
    { code: 'BUY', name: 'Buyback' },
    { code: 'CHI', name: 'Changed Item' },
    { code: 'CON', name: 'Changed Owner' },
    { code: 'CSD', name: 'Changed Schedule' },
    { code: 'FPM', name: 'Final Payment' },
    { code: 'INS', name: 'Installment' },
    { code: 'PNT', name: 'Penalty' },
    { code: 'REP', name: 'Reprocessing' },
    { code: 'RES', name: 'Reschedule' },
    { code: 'SLD', name: 'Sold' }
];

/*document.getElementById('select_method_' + index).value*/

function safeParseFloat(value) {
    const num = parseFloat((value + '').replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
}





function get_selected_payment_schedule_changeitem_by_so() {

    var row = $("#txt_payment_schedule_selected_row").val();
    var Refer = $("#txt_changeitem_ref").val();
    var BuyBack = parseFloat($("#txt_buyback_amt").val().replace(/,/g, '')) || 0;

    var ARNo = $("#txt_doc_num").val();

    if (!row && !ARNo) {
        ShowAlertCus("No AR Memo selected!", "warning");
    } else {
        var docentry = $("#td_pop_payment_schedule_so_entry_" + row).text();
        var serialno = $("#td_pop_payment_schedule_serial_" + row).text();
        var linenum = $("#td_pop_payment_schedule_so_line_" + row).text();
        var BaseEntry = $("#txt_doc_num").val();
        // If BaseEntry is not null/empty, use it; otherwise keep docentry
        docentry = BaseEntry ? BaseEntry : docentry;

        $.ajax({
            url: '/sales/get_payment_schedule_changeitem_by_so',
            type: 'POST',
            data: {
                soEntry: docentry,
                rowStatus: 'All',
                refer: Refer,
                buyback: BuyBack
            },
            datatype: 'json',
            async: false,
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                var mydata = data.data;
                var totalPrinciple = 0.00;
                var totalInterest = 0.00;
                var totalMonthlyPay = 0.00;
                var ItemPrice = 0.00;

                var BuybackAmt = 0.00;
                var GeneratedARAmt = 0.00;
                var OutstandingAmt = 0.00;
                var VarianAmt = 0.00;
                var SerialNumber = "";


                BuybackAmt = $("#txt_buyback_amt").text('0.00'); +

                    $("#txt_total_principle").text('0.00');
                $("#txt_total_interest").text('0.00');
                $("#txt_total_monthly").text('0.00');
                $("#txt_docentry").val(docentry);



                update_info_payment(mydata[0], row);

                $("#table_payment_schedule >tbody >tr").remove();
                var index = 1;
                for (let i = 0; i < mydata.length; i++) {
                    const x = mydata[i];


                    // Assign the price to Item 
                    ItemPrice = x.HouseAmount;
                    GeneratedARAmt = x.GeneratedARAmt;
                    OutstandingAmt = x.OutstandingAmt;
                    VarianAmt = x.VarianAmt;
                    if (x.Method === "BKN") {
                        SerialNumber = x.DistNumber;
                    }

                    BuybackAmt = x.BuybackAmt;

                    let highlightStyle = (x.HiglightStatus === "M") ? "background-color:#d9edf7;" : "";

                    let data = `<tr id='tr_payment_${index}' style='${highlightStyle}'>`;

                    data += `<td><i class='fa fa-fw fa-remove' id='tr_payment_detail_remove_line_${index}' style='cursor:pointer;display:none;' onclick='cmd_tr_payment_detail_remove_line(${index})'></i></td>`;

                    if (x.Status.trim() === "O") {
                        data += `<td><input type='checkbox' id='tr_payment_detail_checkbox_remove_line_${index}' style='cursor:pointer;' onclick='checkbox_tr_payment_detail(${index})'></td>`;
                    } else {
                        data += `<td><input type='checkbox' id='tr_payment_detail_checkbox_remove_line_${index}' style='cursor:not-allowed;' disabled></td>`;
                    }

                    data += `<td style='text-align:Left;'>${index}</td>`;

                    const isOpen = x.Status.trim() === "O";

                    data += `
                    <td style='text-align:Left; color:blue'>
                        <div class='form-group'>
                            <div class='input-group date'>
                           
                                <input type='text' style='text-align:Left; color:blue' class='form-control pull-right datetime form-control-insde'
                                    name='InstallmentDate_${index}' id='InstallmentDate_${index}' value='${x.InstallmentDate}' placeholder='Choose Date'
                                    ${isOpen ? "" : "disabled"} />
                            </div>
                        </div>
                    </td>`;

                    data += `<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_paymentdate_line_${index}'>${x.DueDate}</td>`;
                    data += `<td style='text-align:left; vertical-align: middle;' id='tr_payment_detail_serial_line_${index}'>${x.DistNumber}</td>`;
                    data += `<td style='text-align:left; vertical-align: middle;' id='tr_payment_detail_principle_line_${index}'>${convert2digit(x.Principle)}</td>`;
                    data += `<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_interest_line_${index}'>${convert2digit(x.Interest)}</td>`;
                    data += `<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_monthlypay_line_${index}'>${convert2digit(x.MonthlyPay)}</td>`;
                    data += `<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamt_line_${index}'>${convert2digit(x.RemainingAmt)}</td>`;
                    data += `<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamtandinterest_line_${index}'>${convert2digit(parseFloat(x.RemainingAmt) + parseFloat(x.Interest))}</td>`;
                    data += `<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupayment_line_${index}'>${convert2digit(x.CuPayment)}</td>`;
                    data += `<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_culnterest_line_${index}'>${convert2digit(x.CuInterest)}</td>`;
                    data += `<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupaymentandculnterest_line_${index}'>${convert2digit(parseFloat(x.CuPayment) + parseFloat(x.CuInterest))}</td>`;

                    data += `<td style='text-align:left; vertical-align:middle;' id='tr_payment_detail_method_line_${index}'>
                        <div class='form-group'>
                            <select class='form-control' style='width:100%; color:blue' id='select_method_${index}' ${isOpen ? "" : "disabled"}>`;

                    for (let m = 0; m < methodOptions.length; m++) {
                        const opt = methodOptions[m];
                        const selected = (opt.code === x.HouseStatus) ? "selected" : "";
                        data += `<option value='${opt.code}' ${selected}>${opt.code} - ${opt.name}</option>`;
                    }

                    data += `</select>
                        </div>
                    </td>`;


                    data += `<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arno_line_${index}'>${x.ARNo}</td>`;
                    data += `<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentno_line_${index}'>${x.PaymentNo}</td>`;
                    data += `<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arnointerest_line_${index}'>${x.ARNoInterest}</td>`;
                    data += `<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentnointerest_line_${index}'>${x.PaymentNoInterest}</td>`;
                    data += `<td ${(isOpen ? "contenteditable='true'" : "")} style='text-align:Left; vertical-align: middle; color:blue' id='tr_payment_detail_remarks_line_${index}'>${x.Remarks}</td>`;

                    // Hidden fields
                    data += `<td style='display:none;' id='tr_payment_detail_status_line_${index}'>${x.Status.trim()}</td>`;
                    data += `<td style='display:none;' id='tr_payment_detail_itemcode_line_${index}'>${x.ItemCode}</td>`;
                    data += `<td style='display:none;' id='tr_payment_detail_itemname_line_${index}'>${x.ItemName}</td>`;
                    data += `<td style='display:none;' id='tr_payment_detail_rowno_line_${index}'>${x.RowNo}</td>`;
                    data += `<td style='display:none;' id='tr_payment_detail_accamt_line_${index}'>${convert2digit(x.AccAmt)}</td>`;
                    data += `<td style='display:none;' id='tr_payment_detail_period_line_${index}'>${convert2digit(x.U_Period)}</td>`;
                    data += `<td style='display:none;' id='tr_payment_detail_annulrate_line_${index}'>${convert2digit(x.U_AnnulRate)}</td>`;
                    data += `<td style='display:none;' id='tr_payment_detail_depositamt_line_${index}'>${convert2digit(x.DepositAmt)}</td>`;
                    data += `<td style='display:none;' id='tr_payment_detail_baseentry_line_${index}'>${docentry}</td>`;
                    data += `<td style='display:none;' id='tr_payment_detail_baseline_line_${index}'>${linenum}</td>`;
                    data += `<td style='display:none;' id='tr_payment_detail_fixedpayment_line_${index}'>${convert2digit(x.FixedPayment)}</td>`;
                    data += `<td style='display:none;' id='tr_payment_detail_housestatus_line_${index}'>${x.HouseStatus}</td>`;
                    data += `<td style='display:none;' id='tr_payment_detail_installmentid_line_${index}'>${x.ID}</td>`;
                    data += `</tr>`;

                    $("#table_payment_schedule >tbody").append(data);

                    totalPrinciple += parseFloat(returnstringvalue(x.Principle));
                    totalInterest += parseFloat(returnstringvalue(x.Interest));
                    totalMonthlyPay += parseFloat(returnstringvalue(x.MonthlyPay));

                    index++;


                }

                totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue($("#txt_total_principle").text()));
                $("#txt_total_principle").text(convert2digit(totalPrinciple));
                totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue($("#txt_total_interest").text()));
                $("#txt_total_interest").text(convert2digit(totalInterest));
                totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue($("#txt_total_monthly").text()));
                $("#txt_total_monthly").text(convert2digit(totalMonthlyPay));

                var remainingAmt = parseFloat(ItemPrice) - parseFloat(BuybackAmt) - parseFloat(OutstandingAmt);

              
                $("#txt_before_discount_amount").val(convert2digit(ItemPrice));
                $("#txt_after_discount").val(convert2digit(ItemPrice));
                $("#txt_oldserial").val(SerialNumber);
                $("#txt_generated_ar_amt").val(convert2digit(GeneratedARAmt));
                $("#txt_outstanding_amount").val(convert2digit(OutstandingAmt));
                $("#txt_varian_amount").val(convert2digit(VarianAmt));
                $("#txt_buyback_amt").val(convert2digit(BuybackAmt));

                var OldAmt = parseFloat(GeneratedARAmt) + parseFloat(OutstandingAmt);

                $("#txt_oldafter_discount").val(convert2digit(OldAmt));

                /// This is condition to put Isnull 0
                remainingAmt = parseFloat(remainingAmt);

                if (parseFloat(convert2digit(remainingAmt)) == 0) {
                    $("#txt_installment_rate").attr('readonly', 'readonly');
                    $("#txt_period").attr('readonly', 'readonly');
                    $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
                    $("#check_manual_payment").prop('checked', false);
                    $("#check_manual_payment").attr('disabled', 'disabled');
                    $("#cbo_payment_option").val('');
                    $("#cbo_payment_option").attr('disabled', 'disabled');
                    $("#btn_generate_payment_shcedule").text('Generate');
                    $("#txt_remaining_amount").val('0.00');
                    $("#txt_installment_amount").val('0.00');
                } else {
                    $("#txt_remaining_amount").val(convert2digit(remainingAmt));
                    $("#txt_installment_amount").val(convert2digit(remainingAmt));
                    $("#cbo_payment_option").prop('disabled', false);
                    $("#txt_installment_rate").prop('readonly', false);
                    $("#txt_period").prop('readonly', false);
                }

                disable_enable_remove_by_line();
                set_date_of_payment();

                $("#modal-schedule-list").modal('hide');
                $("#txt_payment_schedule_selected_row").val("-1");
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}


function get_selected_payment_schedule_by_so() {

    var row = $("#txt_payment_schedule_selected_row").val();
    if (row == -1) {
        ShowAlertCus("No AR Memo selected!", "warning");
    } else {
        var docentry = $("#td_pop_payment_schedule_so_entry_" + row).text();
        var serialno = $("#td_pop_payment_schedule_serial_" + row).text();
        var linenum = $("#td_pop_payment_schedule_so_line_" + row).text();
        $.ajax({
            url: '/sales/get_payment_schedule_by_so',
            type: 'POST',
            data: {
                soEntry: docentry,
                rowStatus: 'All'
            },
            datatype: 'json',
            async: false,
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                var mydata = data.data;
                var totalPrinciple = 0.00;
                var totalInterest = 0.00;
                var totalMonthlyPay = 0.00;
                var ItemPrice = 0.00;

                var NewItemCode = "";
                var NewItemName = "";
                var BuybackAmt = 0.00;
                var GeneratedARAmt = 0.00;
                var OutstandingAmt = 0.00;
                var VarianAmt = 0.00;
                var SerialNumber = "";

                $("#txt_total_principle").text('0.00');
                $("#txt_total_interest").text('0.00');
                $("#txt_total_monthly").text('0.00');
                $("#txt_docentry").val(docentry);
                $("#txt_after_serial").val(serialno);

                update_info_payment(mydata[0], row);
                
                $("#table_payment_schedule >tbody >tr").remove();
                var index = 1;
                for (i = 0; i < mydata.length; i++) {
                    var x = mydata[i];

                    //Assign the price to Item 
                    ItemPrice = x.HouseAmount;

                    NewItemCode = x.NewItemCode;
                    NewItemName = x.NewItemName;
                    BuybackAmt = x.BuybackAmt;
                    GeneratedARAmt = x.GeneratedARAmt;
                    OutstandingAmt = x.OutstandingAmt;
                    VarianAmt = x.VarianAmt;
                    SerialNumber = x.DistNumber;

                    var data = "<tr id='tr_payment_" + index + "'>";
                    data = data + "<td><i class='fa fa-fw fa-remove' id='tr_payment_detail_remove_line_" + index + "'  style='cursor:pointer;display:none;' onclick='cmd_tr_payment_detail_remove_line(" + index + ")'></i></td>";
                    if (x.Status.trim() == "O") {
                        data = data + "<td><input type='checkbox' id='tr_payment_detail_checkbox_remove_line_" + index + "' style='cursor:pointer;' onclick='checkbox_tr_payment_detail(" + index + ")'></td>";
                    } else {
                        data = data + "<td><input type='checkbox' id='tr_payment_detail_checkbox_remove_line_" + index + "' style='cursor:not-allowed;' disabled></td>";
                    }
                    data = data + "<td style='text-align:Left;'>" + index + "</td>";
                    /*data = data + "<td style='text-align:Left;' id='tr_payment_detail_installment_date_line_" + index + "'>" + x.InstallmentDate + "</td>";*/

                    let isOpen = x.Status.trim() === "O";

                    data += "<td style='text-align:Left; color:blue'>" +
                        "<div class='form-group'>" +
                        "<div class='input-group date'>" +
                        "<input type='text' style='text-align:Left; color:blue' class='form-control pull-right datetime form-control-insde' " +
                        "name='InstallmentDate_" + index + "' " +
                        "id='InstallmentDate_" + index + "' " +
                        "value='" + x.InstallmentDate + "' placeholder='Choose Date' " +
                        (isOpen ? "" : "disabled") + " />" +
                        "</div>" +
                        "</div>" +
                        "</td>";

                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_paymentdate_line_" + index + "'>" + x.DueDate + "</td>";
                    data = data + "<td style='text-align:left; vertical-align: middle;' id='tr_payment_detail_principle_line_" + index + "'>" + convert2digit(x.Principle) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_interest_line_" + index + "'>" + convert2digit(x.Interest) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_monthlypay_line_" + index + "'>" + convert2digit(x.MonthlyPay) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamt_line_" + index + "'>" + convert2digit(x.RemainingAmt) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamtandinterest_line_" + index + "'>" + convert2digit(parseFloat(x.RemainingAmt) + parseFloat(x.Interest)) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupayment_line_" + index + "'>" + convert2digit(x.CuPayment) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_culnterest_line_" + index + "'>" + convert2digit(x.CuInterest) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupaymentandculnterest_line_" + index + "'>" + convert2digit(parseFloat(x.CuPayment) + parseFloat(x.CuInterest)) + "</td>";

                    data += "<td style='text-align:left; vertical-align:middle;' id='tr_payment_detail_method_line_" + index + "'>";
                    data += "<div class='form-group'>";
                    data += "<select class='form-control' style='width:100%; color:blue' id='select_method_" + index + "' " + (isOpen ? "" : "disabled") + ">";

                    for (let i = 0; i < methodOptions.length; i++) {
                        const opt = methodOptions[i];
                        const selected = (opt.code === x.HouseStatus) ? "selected" : "";
                        data += "<option value='" + opt.code + "' " + selected + ">" + opt.code + " - " + opt.name + "</option>";
                    }

                    data += "</select>";
                    data += "</div>";
                    data += "</td>";

                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arno_line_" + index + "'>" + x.ARNo + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentno_line_" + index + "'>" + x.PaymentNo + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arnointerest_line_" + index + "'>" + x.ARNoInterest + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentnointerest_line_" + index + "'>" + x.PaymentNoInterest + "</td>";
                    data = data + "<td " +
                        (isOpen ? "contenteditable='true'" : "") +
                        " style='text-align:Left; vertical-align: middle; color:blue' " +
                        "id='tr_payment_detail_remarks_line_" + index + "'>" + x.Remarks + "</td>";

                    data = data + "<td contenteditable='true' style='text-align:Left; vertical-align: middle; color:blue' id='tr_chequeno_line_" + index + "'></td>";

                    data = data + "<td contenteditable='true' style='text-align:Left; vertical-align: middle; color:blue' id='tr_nameoncheque_line_" + index + "'></td>";

                    var bankOptions = "<option value=''></option>";
                    $.each(window.bankList, function (i, bank) {
                        bankOptions += "<option value='" + bank.Code + "'>" + bank.Name + "</option>";
                    });

                    data += "<td style='vertical-align: middle;'>" +
                        "<select class='form-control' id='tr_bank_line_" + index + "'>" +
                        bankOptions +
                        "</select>" +
                        "</td>";
                    data = data + "<td contenteditable='true' style='text-align:Left; vertical-align: middle; color:blue' id='tr_payee_line_" + index + "'></td>";

                    data = data + "<td style='display:none;' id='tr_payment_detail_status_line_" + index + "'>" + x.Status.trim() + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemcode_line_" + index + "'>" + x.ItemCode + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemname_line_" + index + "'>" + x.ItemName + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_rowno_line_" + index + "'>" + x.RowNo + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_accamt_line_" + index + "'>" + convert2digit(x.AccAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_period_line_" + index + "'>" + convert2digit(x.U_Period) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_annulrate_line_" + index + "'>" + convert2digit(x.U_AnnulRate) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_depositamt_line_" + index + "'>" + convert2digit(x.DepositAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseentry_line_" + index + "'>" + docentry + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseline_line_" + index + "'>" + linenum + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_fixedpayment_line_" + index + "'>" + convert2digit(x.FixedPayment) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_housestatus_line_" + index + "'>" + x.HouseStatus + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_installmentid_line_" + index + "'>" + x.ID + "</td>";
                    data = data + "</tr>";

                    /// This condition I just add to make it work with Document that no AR Downpayment 
                    if (parseFloat(x.MonthlyPay) !== 0) {
                        $("#table_payment_schedule >tbody").append(data);
                    } 

                    totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue(x.Principle));
                    totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue(x.Interest));
                    totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue(x.MonthlyPay));

                    index++;
                }

                totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue($("#txt_total_principle").text()));
                $("#txt_total_principle").text(convert2digit(totalPrinciple));
                totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue($("#txt_total_interest").text()));
                $("#txt_total_interest").text(convert2digit(totalInterest));
                totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue($("#txt_total_monthly").text()));
                $("#txt_total_monthly").text(convert2digit(totalMonthlyPay));

                var remainingAmt = parseFloat(ItemPrice) - parseFloat(totalPrinciple);

                $("#txt_before_discount_amount").val(convert2digit(ItemPrice));
                $("#txt_after_discount").val(convert2digit(ItemPrice));

                if (NewItemCode !== "") {
                    $("#txt_item_code").val(NewItemCode);
                    $("#txt_item_name").val(NewItemName || "");
                }
                $("#txt_serial_no").val(SerialNumber);
                //$("#txt_item_name").val(NewItemName || "");
                

                $("#txt_buyback_amt").val(convert2digit(BuybackAmt));
                $("#txt_generated_ar_amt").val(convert2digit(GeneratedARAmt));
                $("#txt_outstanding_amount").val(convert2digit(OutstandingAmt));
                $("#txt_varian_amount").val(convert2digit(VarianAmt));

                var OldAmt = parseFloat(GeneratedARAmt) + parseFloat(OutstandingAmt);


                $("#txt_oldafter_discount").val(convert2digit(OldAmt));

                /// This is condition to put Isnull 0
                remainingAmt = parseFloat(remainingAmt);
           
                if (parseFloat(convert2digit(remainingAmt)) == 0) {
                    $("#txt_installment_rate").attr('readonly', 'readonly');
                    $("#txt_period").attr('readonly', 'readonly');
                    $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
                    $("#check_manual_payment").prop('checked', false);
                    $("#check_manual_payment").attr('disabled', 'disabled');
                    $("#cbo_payment_option").val('');
                    $("#cbo_payment_option").attr('disabled', 'disabled');
                    $("#btn_generate_payment_shcedule").text('Generate');
                    $("#txt_remaining_amount").val('0.00');
                    $("#txt_installment_amount").val('0.00');
                } else {
                    $("#txt_remaining_amount").val(convert2digit(remainingAmt));
                    $("#txt_installment_amount").val(convert2digit(remainingAmt));
                }

                disable_enable_remove_by_line();
                set_date_of_payment();

                $("#modal-schedule-list").modal('hide');
                $("#txt_payment_schedule_selected_row").val("-1");
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}


var originalInstallmentDates = [];

function storeOriginalDates() {
    originalInstallmentDates = [];
    $("#table_payment_schedule tbody tr").each(function (i) {
        let index = i + 1;
        let val = $("#InstallmentDate_" + index).val();
        let parsedDate = moment(val, "DD-MMM-YYYY");

        if (!parsedDate.isValid()) {
            console.log("Invalid date format at row:", index, "value:", val);
        }

        originalInstallmentDates.push(parsedDate);
    });
}

function get_changeitem_information() {
    var rowi = $("#txt_payment_schedule_changeitem_selected_row").val();
    if (rowi == -1) {
        ShowAlertCus("No AR Memo selected!", "warning");
    } else {
        var Reference = $("#td_pop_payment_schedule_changeitem_so_entry_" + rowi).text();
        var NewItemCode = $("#td_pop_payment_schedule_ocrcode3_" + rowi).text();
        var NewItemName = $("#td_pop_payment_schedule_ocrcode_" + rowi).text();
        var serialno = $("#td_pop_payment_schedule_serial_" + rowi).text();
        /*var BuybackAmt = $("#td_pop_payment_schedule_so_houseamount_" + rowi).text();*/

        $("#txt_changeitem_ref").val(Reference || "");
        $("#txt_item_code").val(NewItemCode || "");
        $("#txt_item_name").val(NewItemName || "");
        $("#txt_new_serail").val(serialno);
        /* $("#txt_buyback_amt").val(convert2digit(BuybackAmt));*/



        $("#modal-schedule-changeitem-list").modal('hide');
        $("#txt_payment_schedule_changeitem_selected_row").val("-1");
    }
}

function get_special_payment() {
    var method = "";
    var paymentdate = "";
    var amount = "";
    var percent = "";
    var anual = "";
    var period = "";
    var remark = "";
    var decimal = 0;
    var index = 0;
    var checkDate = check_special_payment_date();
    if (checkDate == 2) {
        ShowAlertCus("Payment amount cannot be zero!", "warning")
    } else if (checkDate == 1) {
        ShowAlertCus("Invalid selected payment date!", "warning")
    } else {

        var moduleEl = document.getElementById("txt_module_id");
        var serialEl = document.getElementById("txt_serial");

        var moduleId = moduleEl ? moduleEl.value : "";
        var cserial = serialEl ? serialEl.value : "";
        var finalRemark = "";



        $("#table_pop_special_payment >tbody>tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_speical_payment_", "");
            var docdate = $("#txt_pop_special_payment_date_" + id).val().split("-");
            method = (index == 0 ? "" : method + ";") + $("#cbo_pop_special_payment_payment_option_" + id).val();
            paymentdate = (index == 0 ? "" : paymentdate + ";") + docdate[2] + "/" + docdate[1] + "/" + docdate[0];
            amount = (index == 0 ? "" : amount + ";") + returnstringvalue($("#txt_pop_special_payment_amount_" + id).val());
            percent = (index == 0 ? "" : percent + ";") + returnstringvalue($("#txt_pop_special_payment_per_" + id).val());
            anual = (index == 0 ? "" : anual + ";") + returnstringvalue($("#txt_pop_special_payment_rate_" + id).val());
            period = (index == 0 ? "" : period + ";") + returnstringvalue($("#txt_pop_special_payment_period_" + id).val());
            var value = $("#txt_pop_special_payment_remark_" + id).val() || "";
            remark = (index === 0 ? value : remark + ";" + value);
            index++;
        });

        finalRemark = (cserial != null && cserial !== "")
            ? cserial
            : remark;

        var el = $("#txtdecimal");
        var decimal = 0;

        if (el.length) {
            var val = parseInt(el.val());
            decimal = isNaN(val) ? 0 : val;
        }

        $.ajax({
            url: '/sales/get_special_schedule',
            type: 'POST',
            data: {
                itemcode: $("#txt_item_code").val(), installment: returnstringvalue($("#txt_installment_amount").val()), LastRowno: $("#table_payment_schedule>tbody>tr").length
                , BaseLine: -1, method: method, paymentdate: paymentdate, amount: amount, percent: percent, anualrate: anual, period: period
                , remark: finalRemark, decimalplace: decimal
            },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                var totalPrinciple = 0.00;
                var totalInterest = 0.00;
                var totalMonthlyPay = 0.00;
                var rowindex = $("#table_payment_schedule >tbody >tr").length;
                var mydata = data.data;
                if (rowindex > 0) {
                    var lasttr = $("#table_payment_schedule >tbody >tr:last");
                    rowindex = lasttr.attr('id').replace("tr_payment_", "");
                }
                rowindex = parseInt(rowindex) + 1;

                //// Find first cumalative 

                let cumulativePrinciple = 0;
                let cumulativeInterest = 0;
                $('#table_payment_schedule tbody tr').each(function () {
                    const principleText = $(this).find("td[id^='tr_payment_detail_principle_line_']").text().replace(/,/g, '');
                    const principle = parseFloat(principleText);
                    if (!isNaN(principle)) {
                        cumulativePrinciple += principle;
                    }

                    const interestText = $(this).find("td[id^='tr_payment_detail_interest_line_']").text().replace(/,/g, '');
                    const interest = parseFloat(interestText);
                    if (!isNaN(interest)) {
                        cumulativeInterest += interest;
                    }
                });

                for (i = 0; i < mydata.length; i++) {
                    var x = mydata[i];

                    const principle = safeParseFloat(x.Principle);
                    const interest = safeParseFloat(x.Interest);

                    cumulativePrinciple += principle;
                    cumulativeInterest += interest;


                    var data = "<tr id='tr_payment_" + rowindex + "'>";
                    data = data + "<td><i class='fa fa-fw fa-remove' id='tr_payment_detail_remove_line_" + rowindex + "'  style='cursor:pointer;display:none;' onclick='cmd_tr_payment_detail_remove_line(" + rowindex + ")'></i></td>";
                    if (x.Status.trim() == "O") {
                        data = data + "<td><input type='checkbox' id='tr_payment_detail_checkbox_remove_line_" + rowindex + "' style='cursor:pointer;' onclick='checkbox_tr_payment_detail(" + rowindex + ")'></td>";
                    } else {
                        data = data + "<td><input type='checkbox' id='tr_payment_detail_checkbox_remove_line_" + rowindex + "' style='cursor:not-allowed;' disabled></td>";
                    }
                    data = data + "<td style='text-align:Left;'>" + rowindex + "</td>";

                    data += "<td style='text-align:Left; color:blue'>" +
                        "<div class='form-group'>" +
                        "<div class='input-group date'>" +
                        "<input type='text' style='text-align:Left; color:blue' class='form-control pull-right datetime form-control-insde' name='InstallmentDate_" + rowindex + "' id='InstallmentDate_" + rowindex + "' value='" + x.InstallmentDate + "' placeholder='Choose Date' />" +
                        "</div>" +
                        "</div>" +
                        "</td>";


                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_paymentdate_line_" + rowindex + "'>" + x.DueDate + "</td>";


                    if (moduleId === "ChangeHouse") {
                        data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_serial_line_" + rowindex + "'>" + x.DistNumber + "</td>";
                    }
                    data = data + "<td style='text-align:left; vertical-align: middle;' id='tr_payment_detail_principle_line_" + rowindex + "'>" + convert2digit(x.Principle) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_interest_line_" + rowindex + "'>" + convert2digit(x.Interest) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_monthlypay_line_" + rowindex + "'>" + convert2digit(x.MonthlyPay) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamt_line_" + rowindex + "'>" + convert2digit(x.RemainingAmt) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamtandinterest_line_" + rowindex + "'>" + convert2digit(parseFloat(x.RemainingAmt) + parseFloat(x.Interest)) + "</td>";

                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupayment_line_" + rowindex + "'>" + convert2digit(cumulativePrinciple) + "</td>";

                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_culnterest_line_" + rowindex + "'>" + convert2digit(cumulativeInterest) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupaymentandculnterest_line_" + rowindex + "'>" + convert2digit(parseFloat(cumulativeInterest) + parseFloat(cumulativePrinciple)) + "</td>";
                    data += "<td style='text-align:left; vertical-align:middle;' id='tr_payment_detail_method_line_" + rowindex + "'>";
                    data += "<div class='form-group'>";
                    data += "<select class='form-control' style='width:100%; color:blue' id='select_method_" + rowindex + "'>";

                    for (let i = 0; i < methodOptions.length; i++) {
                        const opt = methodOptions[i];
                        const selected = (opt.code === x.HouseStatus) ? "selected" : "";
                        data += "<option value='" + opt.code + "' " + selected + ">" + opt.code + " - " + opt.name + "</option>";
                    }

                    data += "</select>";
                    data += "</div>";
                    data += "</td>";


                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arno_line_" + rowindex + "'>" + x.ARNo + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentno_line_" + rowindex + "'>" + x.PaymentNo + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arnointerest_line_" + rowindex + "'>" + x.ARNoInterest + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentnointerest_line_" + rowindex + "'>" + x.PaymentNoInterest + "</td>";
                    data = data + "<td contenteditable='true' style='text-align:Left; vertical-align: middle; color:blue' id='tr_payment_detail_remarks_line_" + rowindex + "'>" + x.Remarks + "</td>";

                    data = data + "<td contenteditable='true' style='text-align:Left; vertical-align: middle; color:blue' id='tr_chequeno_line_" + rowindex + "'></td>";

                    data = data + "<td contenteditable='true' style='text-align:Left; vertical-align: middle; color:blue' id='tr_nameoncheque_line_" + rowindex + "'></td>";

                    var bankOptions = "<option value=''></option>";
                    $.each(window.bankList, function (i, bank) {
                        bankOptions += "<option value='" + bank.Code + "'>" + bank.Name + "</option>";
                    });

                    data += "<td style='vertical-align: middle;'>" +
                        "<select class='form-control' id='tr_bank_line_" + rowindex + "'>" +
                        bankOptions +
                        "</select>" +
                        "</td>";
                    data = data + "<td contenteditable='true' style='text-align:Left; vertical-align: middle; color:blue' id='tr_payee_line_" + rowindex + "'></td>";

                    data = data + "<td style='display:none;' id='tr_payment_detail_status_line_" + rowindex + "'>" + x.Status.trim() + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemcode_line_" + rowindex + "'>" + x.ItemCode + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemname_line_" + rowindex + "'>" + x.ItemName + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_rowno_line_" + rowindex + "'>" + x.RowNo + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_accamt_line_" + rowindex + "'>" + convert2digit(x.AccAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_period_line_" + rowindex + "'>" + convert2digit(x.U_Period) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_annulrate_line_" + rowindex + "'>" + convert2digit(x.U_AnnulRate) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_depositamt_line_" + rowindex + "'>" + convert2digit(x.DepositAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseentry_line_" + rowindex + "'>" + $("#txt_so_entry").val() + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseline_line_" + rowindex + "'>" + $("#txt_so_line").val() + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_fixedpayment_line_" + rowindex + "'>" + convert2digit(x.FixedPayment) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_housestatus_line_" + rowindex + "'>" + x.HouseStatus + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_installmentid_line_" + rowindex + "'>" + x.ID + "</td>";

                    data = data + "</tr>";
                    $("#table_payment_schedule >tbody").append(data);

                    totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue(x.Principle));
                    totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue(x.Interest));
                    totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue(x.MonthlyPay));

                    rowindex++;
                }

                totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue($("#txt_total_principle").text()));
                $("#txt_total_principle").text(convert2digit(totalPrinciple));
                totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue($("#txt_total_interest").text()));
                $("#txt_total_interest").text(convert2digit(totalInterest));
                totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue($("#txt_total_monthly").text()));
                $("#txt_total_monthly").text(convert2digit(totalMonthlyPay));



                var beforedis = returnstringvalue($("#txt_before_discount_amount").val());
            /*    var afterdis = returnstringvalue($("#txt_after_discount").val());*/

                var remainingAmt = parseFloat(beforedis) - parseFloat(totalPrinciple);
                var newremainingAmt = parseFloat(returnstringvalue($("#txt_remaining_amount").val())) - parseFloat(totalPrinciple);



                if (parseFloat(convert2digit(remainingAmt)) == 0) {

                    

                    $("#txt_installment_rate").attr('readonly', 'readonly');
                    $("#txt_period").attr('readonly', 'readonly');
                    $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
                    $("#check_manual_payment").prop('checked', false);
                    $("#check_manual_payment").attr('disabled', 'disabled');
                    $("#cbo_payment_option").val('');
                    $("#cbo_payment_option").attr('disabled', 'disabled');
                    $("#btn_generate_payment_shcedule").text('Generate');
                    $("#txt_remaining_amount").val('0.00');
                    $("#txt_installment_amount").val('0.00');
                }

                //// 🔧 FIX 1: move reprocess condition UP
                //else if (parseFloat(convert2digit(newremainingAmt)) <= 0) {

                //    $("#txt_installment_rate").attr('readonly', 'readonly');
                //    $("#txt_period").attr('readonly', 'readonly');
                //    $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
                //    $("#check_manual_payment").prop('checked', false);
                //    $("#check_manual_payment").attr('disabled', 'disabled');
                //    $("#cbo_payment_option").val('');
                //    $("#cbo_payment_option").attr('disabled', 'disabled');
                //    $("#btn_generate_payment_shcedule").text('Generate');
                //    $("#txt_remaining_amount").val('0.00');
                //    $("#txt_installment_amount").val('0.00');
                //}

                // 🔧 FIX 2: change || → &&
                else if (parseFloat(convert2digit(remainingAmt)) != 0
                    && parseFloat(convert2digit(newremainingAmt)) != 0) {

                    $("#txt_remaining_amount").val(convert2digit(remainingAmt));
                    $("#txt_installment_amount").val(convert2digit(remainingAmt));
                }

                disable_enable_remove_by_line();
                set_date_of_payment();

                $("#modal_special_payment").modal('hide');
                $("#table_pop_special_payment >tbody >tr").remove();
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}
function get_payment_schedule() {

    var moduleId = document.getElementById("txt_module_id").value;


    var el = document.getElementById("txt_new_serail");
    var newserial = el ? el.value : "";

    var checkDate = 0;
    var lenRow = $("#table_payment_schedule >tbody >tr").length;
    if (lenRow > 0) {
        var lasttr = $("#table_payment_schedule >tbody >tr:last");
        lenRow = lasttr.attr('id').replace("tr_payment_", "");
        if (new Date($("#tr_payment_detail_paymentdate_line_" + lenRow).text().trim()) > new Date($("#txt_maturity_payment").val())) {
            checkDate = 1;
            ShowAlertCus("Invalid selected Maturity Payment!", "warning");
        }
    }

    if (checkDate == 0) {
        if ($("#table_payment_schedule >tbody >tr").length <= 1) {
            var startdate = $("#txt_maturity_payment").val().trim().split("-");
            startdate = startdate[2] + "/" + startdate[1] + "/" + startdate[0];
        } else {
            var date = new Date($("#txt_maturity_payment").val()).addMonths(1);
            var strDate = date.toString().split(' ');
            var startdate = strDate[2] + '-' + strDate[1] + '-' + strDate[3];
        }

        var monthlyPay = 0;
        if ($("#check_manual_payment").is(":checked") == true) {
            monthlyPay = $("#txt_fixed_monthly_payment").val();
        } else {
            monthlyPay = 0;
        }

        $.ajax({
            url: '/sales/get_payment_schedule',
            type: 'POST',
            data: {
                itemcode: $("#txt_item_code").val()
                , method: $("#cbo_payment_option").val()
                , fullamount: returnstringvalue($("#txt_installment_amount").val())
                , installment: returnstringvalue($("#txt_installment_amount").val())
                , monthlypayment: returnstringvalue(monthlyPay)
                , date: startdate
                , installmentperiod: $("#txt_period").val()
                , DPM: 0//returnstringvalue($("#txt_deposit_amount").val())
                , AnnualRate: $("#txt_installment_rate").val()
                , LastRowno: $("#table_payment_schedule>tbody>tr").length
                , BaseLine: -1
                , Remarks: newserial
                , Decimal: $("#txtdecimal").val()
            },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                var totalPrinciple = 0.00;
                var totalInterest = 0.00;
                var totalMonthlyPay = 0.00;
                var rowindex = $("#table_payment_schedule >tbody >tr").length;
                var mydata = data.data;
                if (rowindex > 0) {
                    var lasttr = $("#table_payment_schedule >tbody >tr:last");
                    rowindex = lasttr.attr('id').replace("tr_payment_", "");
                }
                rowindex = parseInt(rowindex) + 1;

                //// Find first cumalative 

                let cumulativePrinciple = 0;
                let cumulativeInterest = 0;
                $('#table_payment_schedule tbody tr').each(function () {
                    const principleText = $(this).find("td[id^='tr_payment_detail_principle_line_']").text().replace(/,/g, '');
                    const principle = parseFloat(principleText);
                    if (!isNaN(principle)) {
                        cumulativePrinciple += principle;
                    }

                    const interestText = $(this).find("td[id^='tr_payment_detail_interest_line_']").text().replace(/,/g, '');
                    const interest = parseFloat(interestText);
                    if (!isNaN(interest)) {
                        cumulativeInterest += interest;
                    }
                });

                for (i = 0; i < mydata.length; i++) {
                    var x = mydata[i];
                    const principle = safeParseFloat(x.Principle);
                    const interest = safeParseFloat(x.Interest);

                    cumulativePrinciple += principle;
                    cumulativeInterest += interest;


                    var data = "<tr id='tr_payment_" + rowindex + "'>";



                    /*              data = data + "<td><i class='fa fa-fw fa-remove' id='tr_payment_detail_remove_line_" + rowindex + "'  style='cursor:pointer;display:none;' onclick='cmd_tr_payment_detail_remove_line(" + rowindex + ")'></i></td>";*/

                    data = data + "<td><i class='fa fa-fw fa-remove' id='tr_payment_detail_remove_line_" + rowindex + "'  style='cursor:pointer;' onclick='cmd_tr_payment_detail_remove_line(" + rowindex + ")'></i></td>";

                    if (x.Status.trim() == "O") {
                        data = data + "<td><input type='checkbox' id='tr_payment_detail_checkbox_remove_line_" + rowindex + "' style='cursor:pointer;' onclick='checkbox_tr_payment_detail(" + rowindex + ")'></td>";
                    } else {
                        data = data + "<td><input type='checkbox' id='tr_payment_detail_checkbox_remove_line_" + rowindex + "' style='cursor:not-allowed;' disabled></td>";
                    }



                    data = data + "<td style='text-align:Left;'>" + rowindex + "</td>";

                    data += "<td style='text-align:Left; color:blue'>" +
                        "<div class='form-group'>" +
                        "<div class='input-group date'>" +
                        "<input type='text' style='text-align:Left; color:blue' class='form-control pull-right datetime form-control-insde' " +
                        "name='InstallmentDate_" + rowindex + "' " +
                        "id='InstallmentDate_" + rowindex + "' " +
                        "value='" + x.InstallmentDate + "' placeholder='Choose Date' />" +
                        "</div>" +
                        "</div>" +
                        "</td>";


                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_paymentdate_line_" + rowindex + "'>" + x.DueDate + "</td>";

                    if (moduleId === "ChangeHouse") {
                        data += "<td style='text-align:left; vertical-align: middle;' id='tr_payment_detail_serial_line_" + rowindex + "'>" + x.DistNumber + "</td>";
                    }


                    data = data + "<td style='text-align:left; vertical-align: middle;' id='tr_payment_detail_principle_line_" + rowindex + "'>" + convert2digit(x.Principle) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_interest_line_" + rowindex + "'>" + convert2digit(x.Interest) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_monthlypay_line_" + rowindex + "'>" + convert2digit(x.MonthlyPay) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamt_line_" + rowindex + "'>" + convert2digit(x.RemainingAmt) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamtandinterest_line_" + rowindex + "'>" + convert2digit(parseFloat(x.RemainingAmt) + parseFloat(x.Interest)) + "</td>";

                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupayment_line_" + rowindex + "'>" + convert2digit(cumulativePrinciple) + "</td>";

                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_culnterest_line_" + rowindex + "'>" + convert2digit(cumulativeInterest) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupaymentandculnterest_line_" + rowindex + "'>" + convert2digit(parseFloat(cumulativeInterest) + parseFloat(cumulativePrinciple)) + "</td>";
                    data += "<td style='text-align:left; vertical-align:middle;' id='tr_payment_detail_method_line_" + rowindex + "'>";
                    data += "<div class='form-group'>";
                    data += "<select class='form-control' style='width:100%; color:blue' id='select_method_" + rowindex + "'>";

                    for (let i = 0; i < methodOptions.length; i++) {
                        const opt = methodOptions[i];
                        const selected = (opt.code === x.HouseStatus) ? "selected" : "";
                        data += "<option value='" + opt.code + "' " + selected + ">" + opt.code + " - " + opt.name + "</option>";
                    }

                    data += "</select>";
                    data += "</div>";
                    data += "</td>";


                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arno_line_" + rowindex + "'>" + x.ARNo + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentno_line_" + rowindex + "'>" + x.PaymentNo + "</td>";

                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arnointerest_line_" + rowindex + "'>" + x.ARNoInterest + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentnointerest_line_" + rowindex + "'>" + x.PaymentNoInterest + "</td>";
                    data = data + "<td contenteditable='true' style='text-align:Left; vertical-align: middle; color:blue' id='tr_payment_detail_remarks_line_" + rowindex + "'>" + x.Remarks + "</td>";

                    data = data + "<td contenteditable='true' style='text-align:Left; vertical-align: middle; color:blue' id='tr_chequeno_line_" + rowindex + "'></td>";

                    data = data + "<td contenteditable='true' style='text-align:Left; vertical-align: middle; color:blue' id='tr_nameoncheque_line_" + rowindex + "'></td>";

                    var bankOptions = "<option value=''></option>";
                    $.each(window.bankList, function (i, bank) {
                        bankOptions += "<option value='" + bank.Code + "'>" + bank.Name+ "</option>";
                    });

                    data += "<td style='vertical-align: middle;'>" +
                        "<select class='form-control' id='tr_bank_line_" + rowindex + "'>" +
                        bankOptions +
                        "</select>" +
                        "</td>";



                    data = data + "<td contenteditable='true' style='text-align:Left; vertical-align: middle; color:blue' id='tr_payee_line_" + rowindex + "'></td>";


                    data = data + "<td style='display:none;' id='tr_payment_detail_status_line_" + rowindex + "'>" + x.Status.trim() + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemcode_line_" + rowindex + "'>" + x.ItemCode + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemname_line_" + rowindex + "'>" + x.ItemName + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_rowno_line_" + rowindex + "'>" + x.RowNo + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_accamt_line_" + rowindex + "'>" + convert2digit(x.AccAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_period_line_" + rowindex + "'>" + convert2digit(x.U_Period) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_annulrate_line_" + rowindex + "'>" + convert2digit(x.U_AnnulRate) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_depositamt_line_" + rowindex + "'>" + convert2digit(x.DepositAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseentry_line_" + rowindex + "'>" + $("#txt_so_entry").val() + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseline_line_" + rowindex + "'>" + $("#txt_so_line").val() + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_fixedpayment_line_" + rowindex + "'>" + convert2digit(x.FixedPayment) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_housestatus_line_" + rowindex + "'>" + x.HouseStatus + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_installmentid_line_" + rowindex + "'>" + x.ID + "</td>";

                    data = data + "</tr>";
                    $("#table_payment_schedule >tbody").append(data);

                    totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue(x.Principle));
                    totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue(x.Interest));
                    totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue(x.MonthlyPay));

                    rowindex++;
                }

                totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue($("#txt_total_principle").text()));
                $("#txt_total_principle").text(convert2digit(totalPrinciple));
                totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue($("#txt_total_interest").text()));
                $("#txt_total_interest").text(convert2digit(totalInterest));
                totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue($("#txt_total_monthly").text()));
                $("#txt_total_monthly").text(convert2digit(totalMonthlyPay));

                var afterdis = returnstringvalue($("#txt_after_discount").val());

                var beforedis = returnstringvalue($("#txt_before_discount_amount").val());

                var remainingAmt = parseFloat(beforedis) - parseFloat(totalPrinciple);

                var newremainingAmt = parseFloat(returnstringvalue($("#txt_remaining_amount").val())) - parseFloat(totalPrinciple);



                if (parseFloat(convert2digit(remainingAmt)) == 0) {
                    $("#txt_installment_rate").attr('readonly', 'readonly');
                    $("#txt_period").attr('readonly', 'readonly');
                    $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
                    $("#check_manual_payment").prop('checked', false);
                    $("#check_manual_payment").attr('disabled', 'disabled');
                    $("#cbo_payment_option").val('');
                    $("#cbo_payment_option").attr('disabled', 'disabled');
                    $("#btn_generate_payment_shcedule").text('Generate');
                    $("#txt_remaining_amount").val('0.00');
                    $("#txt_installment_amount").val('0.00');
                } else if (parseFloat(convert2digit(remainingAmt)) == 0 && parseFloat(convert2digit(newremainingAmt)) != 0) {

                    $("#txt_remaining_amount").val(convert2digit(remainingAmt));
                    $("#txt_installment_amount").val(convert2digit(remainingAmt));
                }
                // This condition is put for the calculation of reprocess 
                else if (parseFloat(convert2digit(remainingAmt)) != 0 && parseFloat(convert2digit(newremainingAmt)) <= 0) {

                    $("#txt_remaining_amount").val('0.00');
                    $("#txt_installment_amount").val('0.00');
                    $("#txt_buyback_amt").attr('disabled', 'disabled');
                    $("#txt_installment_rate").attr('readonly', 'readonly');
                    $("#txt_period").attr('readonly', 'readonly');
                    $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
                    $("#check_manual_payment").prop('checked', false);
                    $("#check_manual_payment").attr('disabled', 'disabled');
                    $("#cbo_payment_option").val('');
                    $("#cbo_payment_option").attr('disabled', 'disabled');
                    $("#btn_generate_payment_shcedule").text('Generate');
                }

                disable_enable_remove_by_line();
                set_date_of_payment();

                $("#modal_special_payment").modal('hide');
                $("#table_pop_special_payment >tbody >tr").remove();
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}
function get_AR_Memo_ChangeItemList() {
    var row = $("#txt_payment_schedule_selected_row").val();
    if (row == -1) {
        ShowAlertCus("No AR Memo selected!", "warning");
    } else {
        var docentry = $("#td_pop_payment_schedule_so_entry_" + row).text();
        var newitemcode = $("#td_pop_payment_schedule_so_itemcode_" + row).text();
        var newitemname = $("#td_pop_payment_schedule_so_itemname_" + row).text();

        $("#txt_ar_memo_ref").val(docentry);
        $("#txt_new_item_code").val(newitemcode);
        $("#txt_new_item_name").val(newitemname);

        $("#modal-schedule-list").modal('hide');
        $("#txt_payment_schedule_selected_row").val("-1");
    }
}
function get_cost_center_change(type) {
    var cboval = "";
    var id = "cbo_sales_holdunit_house_no";
    $.ajax({
        url: '/getData/get_cost_center',
        type: 'POST',
        data: { type: type, projectcode: $("#cbo_sales_holdunit_project").val(), blockcode: $("#cbo_sales_holdunit_block").val() },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {

            var cbooption = "<option value=''></option>";
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                cbooption = cbooption + "<option value='" + x.Code + "'>" + x.Name + "</option>";
            }
            $("#" + id).empty();
            $("#" + id).append(cbooption);
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_sales_change_price_get_house(type) {
    var house = ($("#txt_sales_holdunit_search_by").val() == "1" ? $("#cbo_sales_holdunit_house_no").val() : $("#txt_sales_holdunit_house_no").val());
    $.ajax({
        url: '/getData/get_house_item',
        type: 'POST',
        data: { type: type, projectcode: $("#cbo_sales_holdunit_project").val(), blockcode: $("#cbo_sales_holdunit_block").val(), housecode: house, status: "A" },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#table_sales_hold_unit >tbody >tr").remove();
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                var tr = "<tr>";
                tr = tr + "<td>" + x.ItemCode + "</td>";
                tr = tr + "<td>" + x.ItemName + "</td>";
                tr = tr + "<td>" + convert2digit(x.HouseAmount) + "</td>";
                tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_change_price_new_price_" + i + "' placeholder='New Price' value='" + convert2digit(x.HouseAmount) + "'></div></td>";
                tr = tr + "<td>" + x.ProjectName + "</td>";
                tr = tr + "<td>" + x.ZoneName + "</td>";
                tr = tr + "<td>" + x.HouseName + "</td>";
                tr = tr + "<td>" + x.U_Street + "</td>";
                tr = tr + "<td>" + x.HouseNo + "</td>";
                tr = tr + "<td>" + x.U_ConstrArea + "</td>";
                tr = tr + "</tr>";
                $("#table_sales_hold_unit >tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function generate_schedule() {
    if ($("#cbo_payment_option").val() != "A") {
        get_payment_schedule();
    }
    else {
        get_special_payment();
    }
}

var pageID = "";


function get_payment_schedule_list_ChangeItem(cardcode) {
    var cardcode = "";
    cardcode = $("#txt_card_code").val();

    if (cardcode === "") {
        ShowAlertCus("Please choose customer information", "danger");
    }
    else {
        $("#modal-schedule-changeitem-list").modal('show');

        var status = "";
        status = "ALL";
        $.ajax({
            url: '/sales/get_payment_schedule_list_ChangeItem',
            type: 'POST',
            data: {
                cardcode: cardcode,
                status: status,
                type: "A"
            },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                $("#table_pop_schedule_changeitem_list >tbody >tr").remove();
                var mydata = data.data;
                for (i = 0; i < mydata.length; i++) {
                    var x = mydata[i];
                    var data = "<tr id='tr_pop_payment_schedule_changeitem_" + i + "' onclick='tr_pop_payment_schedule_selected_ChangeItem(" + i + ")'>";
                    data = data + "<td>" + x.DocNum + "</td>";
                    data = data + "<td>" + x.CardCode + "</td>";
                    data = data + "<td>" + x.CardName + "</td>";
                    data = data + "<td id='td_pop_payment_schedule_ocrcode3_" + i + "'>" + x.ItemCode + "</td>";
                    data = data + "<td id='td_pop_payment_schedule_ocrcode_" + i + "'>" + x.ItemName + "</td>";
                    data = data + "<td id='td_pop_payment_schedule_serial_" + i + "'>" + x.DistNumber + "</td>";
                    data = data + "<td style='display:none'>" + x.PaymentOptionName + "</td>";
                    data = data + "<td style='display:none' id='td_pop_payment_schedule_changeitem_so_entry_" + i + "'>" + x.DocEntry + "</td>";
                    data = data + "<td style='display:none' id='td_pop_payment_schedule_so_line_" + i + "'>" + x.LineNum + "</td>";
                    data = data + "<td style='display:none' id='td_pop_payment_schedule_so_itemcode_" + i + "'>" + x.ItemCode + "</td>";
                    data = data + "<td style='display:none' id='td_pop_payment_schedule_so_itemname_" + i + "'>" + x.ItemName + "</td>";
                    data = data + "<td style='display:none' id='td_pop_payment_schedule_so_referral_" + i + "'>" + x.Referral + "</td>";
                    data = data + "<td style='display:none' id='td_pop_payment_schedule_so_conperiod_" + i + "'>" + x.ConPeriod + "</td>";
                    data = data + "<td style='display:none' id='td_pop_payment_schedule_so_houseamount_" + i + "'>" + x.HouseAmount + "</td>";
                    data = data + "<td style='display:none' id='td_pop_payment_schedule_so_additionalamt_" + i + "'>" + x.AdditionalAmt + "</td>";
                    data = data + "<td style='display:none' id='td_pop_payment_schedule_so_docdate_" + i + "'>" + x.DocDate + "</td>";
                    data = data + "<td style='display:none' id='td_pop_payment_schedule_so_duedate_" + i + "'>" + x.DueDate + "</td>";
                    data = data + "</tr>";
                    $("#table_pop_schedule_changeitem_list >tbody").append(data);
                }
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    } 
}

function get_payment_schedule_list(cardcode) {

    var status = "";
    status = "ALL";


    if ($("#txt_module_id").val() == "PaymentSchedule") {
        status = "INS";
        type = "NewLoan";
    } else if ($("#txt_module_id").val() == "ChangeSchedule") {
        status = "SLD";
        type = "RenewLoan";

    } else if ($("#txt_module_id").val() == "ChangeOwner") {

        status = "CON";
        type = "NewChangeOwner";

    } else if ($("#txt_module_id").val() == "ChangeHouse") {
        status = "ChangingProduct";
        type = "ChangeProduct";

    } else if ($("#txt_module_id").val() == "BuyBack") {
        status = "REP";
        type = "NewReprocessing";
    }  

    $.ajax({
        url: '/sales/get_payment_schedule_list',
        type: 'POST',
        data: {
            cardcode: cardcode,
            status: status,
            type: type
        },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#table_pop_schedule_list >tbody >tr").remove();
            var mydata = data.data;
            for (i = 0; i < mydata.length; i++) {
                var x = mydata[i];
                var data = "<tr id='tr_pop_payment_schedule_" + i + "' onclick='tr_pop_payment_schedule_selected(" + i + ")'>";
                data = data + "<td>" + x.DocNum + "</td>";
                data = data + "<td>" + x.CardCode + "</td>";
                data = data + "<td>" + x.CardName + "</td>";
                data = data + "<td id='td_pop_payment_schedule_ocrcode3_" + i + "'>" + x.ItemCode + "</td>";
                data = data + "<td id='td_pop_payment_schedule_ocrcode_" + i + "'>" + x.ItemName + "</td>";
                data = data + "<td id='td_pop_payment_schedule_serial_" + i + "'>" + x.DistNumber + "</td>";
               /* data = data + "<td id='td_pop_payment_schedule_ocrcode2_" + i + "'>" + x.OcrCode2 + "</td>";*/
                data = data + "<td style='display:none'>" + x.PaymentOptionName + "</td>";
                data = data + "<td style='display:none' id='td_pop_payment_schedule_so_entry_" + i + "'>" + x.DocEntry + "</td>";
                data = data + "<td style='display:none' id='td_pop_payment_schedule_so_line_" + i + "'>" + x.LineNum + "</td>";
                data = data + "<td style='display:none' id='td_pop_payment_schedule_so_itemcode_" + i + "'>" + x.ItemCode + "</td>";
                data = data + "<td style='display:none' id='td_pop_payment_schedule_so_itemname_" + i + "'>" + x.ItemName + "</td>";
                data = data + "<td style='display:none' id='td_pop_payment_schedule_so_referral_" + i + "'>" + x.Referral + "</td>";
                data = data + "<td style='display:none' id='td_pop_payment_schedule_so_conperiod_" + i + "'>" + x.ConPeriod + "</td>";
                data = data + "<td style='display:none' id='td_pop_payment_schedule_so_houseamount_" + i + "'>" + x.HouseAmount + "</td>";
                data = data + "<td style='display:none' id='td_pop_payment_schedule_so_additionalamt_" + i + "'>" + x.AdditionalAmt + "</td>";
                data = data + "<td style='display:none' id='td_pop_payment_schedule_so_docdate_" + i + "'>" + x.DocDate + "</td>";
                data = data + "<td style='display:none' id='td_pop_payment_schedule_so_duedate_" + i + "'>" + x.DueDate + "</td>";
                data = data + "</tr>";
                $("#table_pop_schedule_list >tbody").append(data);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}


function get_selected_payment_schedule_by_DocEntry() {
    var row = $("#txt_payment_schedule_selected_row").val();
    if (row == -1) {
        ShowAlertCus("No booking selected!", "warning");
    } else {
        var docentry = $("#td_pop_payment_schedule_so_entry_" + row).text();
        var linenum = $("#td_pop_payment_schedule_so_line_" + row).text();
        $.ajax({
            url: '/sales/get_payment_schedule_by_so',
            type: 'POST',
            data: {
                soEntry: docentry,
                rowStatus: 'All'
            },
            datatype: 'json',
            async: false,
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                var mydata = data.data;
                var totalPrinciple = 0.00;
                var totalInterest = 0.00;
                var totalMonthlyPay = 0.00;
                $("#txt_total_principle").text('0.00');
                $("#txt_total_interest").text('0.00');
                $("#txt_total_monthly").text('0.00');

                update_info_payment(mydata[0], row);

                $("#table_payment_schedule >tbody >tr").remove();
                var index = 1;
                for (i = 0; i < mydata.length; i++) {
                    var x = mydata[i];

                    var data = "<tr id='tr_payment_" + index + "'>";
                    data = data + "<td><i class='fa fa-fw fa-remove' id='tr_payment_detail_remove_line_" + index + "'  style='cursor:pointer;display:none;' onclick='cmd_tr_payment_detail_remove_line(" + index + ")'></i></td>";

                    data = data + "<td><input type='checkbox' id='tr_payment_detail_checkbox_remove_line_" + index + "' style='cursor:not-allowed;' disabled></td>";
                    data = data + "<td style='text-align:Left;'>" + index + "</td>";
                    //data = data + "<td style='text-align:right;' id='tr_payment_detail_paymentdate_line_" + index + "'>" + x.DueDate + "</td>";
                    if (x.Status.trim() == "O") {
                        data = data + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' id='tr_payment_detail_paymentdate_line_" + index + "' placeholder='Payment Date' value='" + x.DueDate + "' onchange='tr_payment_detail_paymentdate_line_change(" + index + ")'></div></div></td>";
                    } else {
                        data = data + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' id='tr_payment_detail_paymentdate_line_" + index + "' placeholder='Payment Date' value='" + x.DueDate + "' disabled></div></div></td>";
                    }
                    data = data + "<td style='text-align:right;' id='tr_payment_detail_principle_line_" + index + "'>" + convert2digit(x.Principle) + "</td>";
                    data = data + "<td style='text-align:right;' id='tr_payment_detail_interest_line_" + index + "'>" + convert2digit(x.Interest) + "</td>";
                    data = data + "<td style='text-align:right;' id='tr_payment_detail_monthlypay_line_" + index + "'>" + convert2digit(x.MonthlyPay) + "</td>";
                    data = data + "<td style='text-align:right;' id='tr_payment_detail_remainingamt_line_" + index + "'>" + convert2digit(x.RemainingAmt) + "</td>";
                    data = data + "<td style='text-align:right;' id='tr_payment_detail_paiddate_line_" + index + "'>" + x.PaidDate + "</td>";
                    data = data + "<td style='text-align:right;' id='tr_payment_detail_docstatus_line_" + index + "'>" + x.DocStatus + "</td>";
                    data = data + "<td style='text-align:right;display:none;' id='tr_payment_detail_paidamt_line_" + index + "'>" + convert2digit(x.PaidAmt) + "</td>";
                    data = data + "<td style='text-align:right;display:none;'><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' id='tr_payment_detail_oldpaymentdate_line_" + index + "' placeholder='Payment Date' value='" + x.DueDate + "' onchange='tr_payment_detail_oldpaymentdate_line_change(" + index + ")'></div></div></td>";
                    //data = data + "<td style='text-align:right;display:none;' id='tr_payment_detail_oldpaymentdate_line_" + index + "'>" + x.DueDate + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_method_line_" + index + "'>" + x.Method + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemcode_line_" + index + "'>" + x.ItemCode + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemname_line_" + index + "'>" + x.ItemName + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_rowno_line_" + index + "'>" + x.RowNo + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_accamt_line_" + index + "'>" + convert2digit(x.AccAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_installment_date_line_" + index + "'>" + x.InstallmentDate + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_period_line_" + index + "'>" + convert2digit(x.U_Period) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_annulrate_line_" + index + "'>" + convert2digit(x.U_AnnulRate) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_depositamt_line_" + index + "'>" + convert2digit(x.DepositAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_culnterest_line_" + index + "'>" + convert2digit(x.CuInterest) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_cupayment_line_" + index + "'>" + convert2digit(x.CuPayment) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseentry_line_" + index + "'>" + docentry + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_status_line_" + index + "'>" + x.Status.trim() + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseline_line_" + index + "'>" + linenum + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_arno_line_" + index + "'>" + x.ARNo + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_paymentno_line_" + index + "'>" + x.PaymentNo + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_fixedpayment_line_" + index + "'>" + convert2digit(x.FixedPayment) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_housestatus_line_" + index + "'>" + x.HouseStatus + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_remarks_line_" + index + "'>" + x.Remarks + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_installmentid_line_" + index + "'>" + x.ID + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_invaliddate_line_" + index + "'>N</td>";
                    data = data + "</tr>";
                    $("#table_payment_schedule >tbody").append(data);

                    totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue(x.Principle));
                    totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue(x.Interest));
                    totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue(x.MonthlyPay));

                    index++;
                }

                totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue($("#txt_total_principle").text()));
                $("#txt_total_principle").text(convert2digit(totalPrinciple));
                totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue($("#txt_total_interest").text()));
                $("#txt_total_interest").text(convert2digit(totalInterest));
                totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue($("#txt_total_monthly").text()));
                $("#txt_total_monthly").text(convert2digit(totalMonthlyPay));

                var remainingAmt = parseFloat(returnstringvalue($("#txt_before_discount_amount").val())) - parseFloat(totalPrinciple);

                if (parseFloat(convert2digit(remainingAmt)) == 0) {
                    $("#txt_installment_rate").attr('readonly', 'readonly');
                    $("#txt_period").attr('readonly', 'readonly');
                    $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
                    $("#check_manual_payment").prop('checked', false);
                    $("#check_manual_payment").attr('disabled', 'disabled');
                    $("#cbo_payment_option").val('');
                    $("#cbo_payment_option").attr('disabled', 'disabled');
                    $("#btn_generate_payment_shcedule").text('Generate');
                    $("#txt_remaining_amount").val('0.00');
                    $("#txt_installment_amount").val('0.00');
                } else {
                    $("#txt_remaining_amount").val(convert2digit(remainingAmt));
                    $("#txt_installment_amount").val(convert2digit(remainingAmt));
                }
                //disable_enable_remove_by_line();
                set_date_of_payment_DocEntry();

                $("#modal-schedule-list").modal('hide');
                $("#txt_payment_schedule_selected_row").val("-1");
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}
function set_date_of_payment_DocEntry() {
    var rowindex = $("#table_payment_schedule >tbody >tr").length;
    if (rowindex > 0) {
        var fisttr = $("#table_payment_schedule >tbody >tr:first");
        rowindex = fisttr.attr('id').replace("tr_payment_", "");
        $("#txt_start_payment").val($("#tr_payment_detail_paymentdate_line_" + rowindex).val().trim());

        var lasttr = $("#table_payment_schedule >tbody >tr:last");
        rowindex = lasttr.attr('id').replace("tr_payment_", "");
        $("#txt_maturity_payment").val($("#tr_payment_detail_paymentdate_line_" + rowindex).val().trim());
        $('.datetime').datepicker({
            autoclose: true,
            format: 'dd-M-yyyy'
        });
    }
}
function tr_payment_detail_paymentdate_line_change(selectedIndex) {
    if (selectedIndex > 1) {
        var date1 = new Date($("#tr_payment_detail_paymentdate_line_" + (selectedIndex-1)).val());
        var date2 = new Date($("#tr_payment_detail_paymentdate_line_" + selectedIndex).val());
        if (date1 > date2) {
            ShowAlertCus("Invalid date changed!", "warning");
            $("#tr_payment_detail_paymentdate_line_" + selectedIndex).val($("#tr_payment_detail_oldpaymentdate_line_" + selectedIndex).val());
            $("#tr_payment_detail_invaliddate_line_" + selectedIndex).text('Y');
        } else {
            $("#tr_payment_detail_oldpaymentdate_line_" + selectedIndex).val($("#tr_payment_detail_paymentdate_line_" + selectedIndex).val());
            $("#tr_payment_detail_invaliddate_line_" + selectedIndex).text('U');
        }
    }
}

function insert_to_remove_table(installment_id) {
    var rowindex = $("#tbl_Remove_List >tbody >tr").length;
    var data = "<tr>";
    data = data + "<td id='tr_remove_head_id_" + rowindex+"'>" + installment_id+"</td>";
    data = data + "<td id='tr_remove_detail_id_" + rowindex +"'>"+0+"</td>";
    data = data + "</tr>";
    $("#tbl_Remove_List >tbody").append(data);
}

function cmd_tr_payment_detail_remove_line(index) {



    var in_id = $("#tr_payment_detail_installmentid_line_" + index).text().trim();
    if (in_id != '-1') {
        insert_to_remove_table(in_id);
    }
    $("#tr_payment_" + index).remove();
    var rowindex = $("#table_payment_schedule >tbody >tr").length;

    if (rowindex > 0) {
        if ($("#tr_payment_detail_status_line_" + rowindex).text().trim() == "O") {
            $("#tr_payment_detail_remove_line_" + rowindex).show();
        }
        $("#txt_maturity_payment").val($("#tr_payment_detail_paymentdate_line_" + rowindex).text().trim());
    }

    // 🔒 SAFE moduleId check
    if (typeof moduleId !== "undefined" && moduleId === "ChangeHouse") {
        recalculate_total_remaining_ChangeProduct();
    } else {
        recalculate_total_remaining();
    }
}

function recalculate_total_remaining_ChangeProduct() {

    var totalPrinciple = 0.00;
    var totalInterest = 0.00;
    var totalMonthlyPay = 0.00;

    $("#table_payment_schedule >tbody>tr").each(function (index) {
        index++;
        var Principle = $("#tr_payment_detail_principle_line_" + index).text().trim();
        var Interest = $("#tr_payment_detail_interest_line_" + index).text().trim();
        var MonthlyPay = $("#tr_payment_detail_monthlypay_line_" + index).text().trim();

        totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue(Principle));
        totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue(Interest));
        totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue(MonthlyPay));
    });

    $("#txt_total_principle").text(convert2digit(totalPrinciple));
    $("#txt_total_interest").text(convert2digit(totalInterest));
    $("#txt_total_monthly").text(convert2digit(totalMonthlyPay));

    var afterdis = returnstringvalue($("#txt_after_discount").val());
    var remainingAmt = parseFloat(afterdis) - parseFloat(totalPrinciple);


    if (parseFloat(convert2digit(remainingAmt)) == 0) {
        $("#txt_installment_rate").attr('readonly', 'readonly');
        $("#txt_period").attr('readonly', 'readonly');
        $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
        $("#check_manual_payment").prop('checked', false);
        $("#check_manual_payment").attr('disabled', 'disabled');
        $("#cbo_payment_option").val('');
        $("#cbo_payment_option").attr('disabled', 'disabled');
        $("#btn_generate_payment_shcedule").text('Generate');
        $("#txt_remaining_amount").val('0.00');
        $("#txt_installment_amount").val('0.00');
    } else {
        $("#cbo_payment_option").removeAttr('disabled');
        $("#cbo_payment_option").val('');
        $("#txt_remaining_amount").val(convert2digit(remainingAmt));
        $("#txt_installment_amount").val(convert2digit(remainingAmt));
    }
}


function cmd_remove_all_row_payment_schedule() {
    $("#table_payment_schedule > tbody  > tr").each(function (index) {
        index++;
        if ($("#tr_payment_detail_checkbox_remove_line_" + index).is(":checked") == true) {
            cmd_tr_payment_detail_remove_line(index);
        }
    });

    $("#table_penalty_list > tbody  > tr").each(function (index) {
        index++;
        if ($("#tr_payment_detail_checkbox_remove_line_" + index).is(":checked") == true) {
            cmd_tr_payment_detail_remove_line(index);
        }
    });
}

function cmd_copy_from(action) {
    if ($("#txt_card_code").val() == "") {
        ShowAlertCus("Please Choose Customer Information first", "warning");
    }
    else {
        $("#modal-schedule-list").modal('show');
        get_payment_schedule_list($("#txt_card_code").val());
    }
}
function cmd_remove_payment_schedule() {
    $("#table_payment_schedule > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("td_checkbox_payment_schedule_", "");
            $("#tr_schedule_" + id).remove();
        }
    });
}
function cmd_pop_choose_payment_schedule() {
    get_selected_payment_schedule_by_so();
}

function cmd_pop_choose_AR_Memo_ChangeItem() {
    get_AR_Memo_ChangeItemList();
}

function check_special_payment_date() {
    var checkDate = 0;
    var lenpopRow = $("#table_pop_special_payment >tbody >tr").length;
    if (lenpopRow > 0) {
        var lasttr = $("#table_pop_special_payment >tbody >tr:last");
        lenpopRow = lasttr.attr('id').replace("tr_pop_speical_payment_", "");
        var lastAmt = returnstringvalue($("#txt_pop_special_payment_amount_" + lenpopRow).val());
        if (lastAmt == 0) {
            return 2;
        }
    }

    var lenRow = $("#table_payment_schedule >tbody >tr").length;
    if (lenRow > 0) {
        var lasttr = $("#table_payment_schedule >tbody >tr:last");
        lenRow = lasttr.attr('id').replace("tr_payment_", "");
        var date1 = new Date($("#tr_payment_detail_paymentdate_line_" + lenRow).text().trim());
    } else {
        var date1 = new Date($("#txt_maturity_payment").val());
    }
    $("#table_pop_special_payment >tbody>tr").each(function () {
        var id = $(this).attr('id').replace("tr_pop_speical_payment_", "");
        var date2 = new Date($("#txt_pop_special_payment_date_" + id).val());
        if (date1 > date2) {
            checkDate = 1;
            return false;
        } else{
            var addNum = $("#txt_pop_special_payment_period_" + id).val();
            if (addNum == 1) {
                date1 = new Date($("#txt_pop_special_payment_date_" + id).val());
            } else {
                date1 = new Date($("#txt_pop_special_payment_date_" + id).val()).addMonths(addNum);
            }  
        }
    });

    console.log(checkDate)
    return checkDate;
}
function check_tr_payment_detail() {
    $("#tr_payment_detail_check_all").hide();
    $("#tr_payment_detail_uncheck_all").show();
    $("#table_payment_schedule >tbody>tr").each(function (index) {
        index++;
        if ($("#tr_payment_detail_status_line_" + index).text() == "O") {
            $("#tr_payment_detail_checkbox_remove_line_" + index).prop('checked', true);
        }
    });
}
function uncheck_tr_payment_detail() {
    $("#tr_payment_detail_check_all").show();
    $("#tr_payment_detail_uncheck_all").hide();
    $("#table_payment_schedule >tbody>tr").each(function (index) {
        index++;
        if ($("#tr_payment_detail_status_line_" + index).text() == "O") {
            $("#tr_payment_detail_checkbox_remove_line_" + index).prop('checked', false);
        }
    });
}
function checkbox_tr_payment_detail(selectIndex) {

    $("#table_payment_schedule >tbody>tr").each(function (index) {
        index++;
        if ($("#tr_payment_detail_status_line_" + index).text() == "O") {
            if (selectIndex < index) {
                $("#tr_payment_detail_checkbox_remove_line_" + index).prop('checked', true);
            } else if (selectIndex != index) {
                $("#tr_payment_detail_checkbox_remove_line_" + index).prop('checked', false);
            }
        }
    });

    $("#table_penalty_list >tbody>tr").each(function (index) {
        index++;

        if (selectIndex < index) {
            $("#tr_payment_detail_checkbox_remove_line_" + index).prop('checked', true);
        } else if (selectIndex != index) {
            $("#tr_payment_detail_checkbox_remove_line_" + index).prop('checked', false);
        }
    });
}

function cmd_save_interest_wizard() {

    if ($("#table_interestwizard_list >tbody >tr").length <= 0) {
        ShowAlertCus("No data to save!", "warning");
    } else {
        var postingdate = $('#txt_posting_date').val().trim().split("-");
        var reqdate = $('#txt_due_date').val().trim().split("-");
        var cardcode = $('#txt_card_code').val();
        var cardname = $('#txt_card_name').val();
        var Ref = $('#txt_ref').val();
        var Remark = $('#txt_remark').val();
        var installmentRow_List = [];
        var head = {
  
            DocDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            DueDate: reqdate[2] + "/" + reqdate[1] + "/" + reqdate[0],
            CardCode: $("#txt_card_code").val(),
            CardName: $("#txt_card_name").val(),
            CardCode: $("#txt_card_code").val(),
            CardName: $("#txt_card_name").val(),
            CardCode: $("#txt_card_code").val()
        };
        $("#table_interestwizard_list >tbody >tr").each(function (index) {
            index++;

            var docpostingdate = $('#tr_payment_detail_paymentdate_line_' + index).val().split("-");
            var docduedate = $('#tr_payment_detail_paymentdate_line_' + index).text().trim().split("-");
            var detail = {
                ID: $("#tr_payment_detail_installmentid_line_" + index).text().trim(),
                BaseEntry: $("#tr_payment_detail_baseentry_line_" + index).text().trim(),
                BaseLine: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                InstallmentBaseID: $("#tr_payment_detail_baseentry_line_" + index).text().trim(),
                InstallmentBaseVisorder: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                VisOrder: (index - 1),
                ItemCode: $("#txt_item_code").val(),
                Principle: returnstringvalue($("#tr_payment_detail_principle_line_" + index).text().trim()),
                Interest: returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim()),
                Monthly: returnstringvalue($("#tr_payment_detail_monthlypay_line_" + index).text().trim()),
                PaymentDate: $("#InstallmentDate_" + index).val(),
                DueDate: docduedate[2] + "/" + docduedate[1] + "/" + docduedate[0],
                Remaining: returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim()),
                ReIncloudInter: parseFloat(returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim())) + parseFloat(returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim())),
                RowStatus: $("#tr_payment_detail_status_line_" + index).text().trim(),
                CuInterest: returnstringvalue($("#tr_payment_detail_culnterest_line_" + index).text().trim()),
                CuPayment: returnstringvalue($("#tr_payment_detail_cupayment_line_" + index).text().trim()),
                FixedPayment: returnstringvalue($("#tr_payment_detail_fixedpayment_line_" + index).text().trim()),
                ARNo: $("#tr_payment_detail_arno_line_" + index).text().trim(),
                PaymentNo: $("#tr_payment_detail_paymentno_line_" + index).text().trim(),

                Method: $("#select_method_" + index).val(),
                InstallmentAmt: returnstringvalue($("#txt_before_discount_amount").val().trim()),
                DiscountAmt: "0.00",
                DepositAmt: returnstringvalue($("#tr_payment_detail_depositamt_line_" + index).text().trim()),
                AnnualRate: returnstringvalue($("#tr_payment_detail_annulrate_line_" + index).text().trim()),
                PeriodMonths: returnstringvalue($("#tr_payment_detail_period_line_" + index).text().trim()),
                HouseStatus: $("#tr_payment_detail_housestatus_line_" + index).text().trim(),
                Remarks: $("#tr_payment_detail_remarks_line_" + index).text().trim(),
                DiscountAmount: 0,
                DiscountPer: 0,
                SpecialDisAmount: 0,
                SpecialDisPer: 0,
                AdditionalDisAmount: 0,
                AdditionalDisPer: "0.00",
                ItemName: $("#txt_item_name").val(),
                OcrCode: $("#txt_ocrcode").val(),
                OcrCode2: $("#txt_ocrcode2").val(),
                OcrCode3: $("#txt_ocrcode3").val(),
                ARNoInterest: $("#tr_payment_detail_arnointerest_line_" + index).text().trim(),
                PaymentNoInterest: $("#tr_payment_detail_paymentnointerest_line_" + index).text().trim(),
                VarianDay: $("#tr_payment_detail_varianday_line_" + index).text().trim(),
                InterestonsheduleVarian: returnstringvalue($("#tr_payment_detail_interestonscheduleamt_line_" + index).text().trim())
            };
            installmentRow_List.push(detail);

        });
        $("#tbl_Remove_List >tbody>tr").each(function (index) {
            var tr_remve = {
                ID: $("#tr_remove_head_id_" + index).text().trim(),
                BaseEntry: $("#tr_remove_detail_id_" + index).text().trim()
            };
            del_list.push(tr_remve);
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/amendments/save_change_schedule',
            data: JSON.stringify(
                {
                    'header': head,
                    'installment_row': installmentRow_List,
                    'del_list': del_list
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    ShowAlertCus("Payment Shcedule was saved", "success");
                    location.reload();
                } else {
                    ShowAlertCus("Error while saving Change Payment Shcedule!", "warning");
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}

function cmd_save_payment_shcedule() {
    var remainingAmt = returnstringvalue($("#txt_remaining_amount").val());
    if ($("#table_payment_schedule >tbody >tr").length <= 0) {
        ShowAlertCus("No data to save!", "warning");
    } else if (parseFloat(remainingAmt) != 0) {
        ShowAlertCus("Remaining amount must equal to zero!", "warning");
    } else {    
        
        var installmentRow_List = [];
        var del_list = [];
        var docdate = $('#txt_doc_date').val().trim().split("-");
        var reqdate = $('#txt_due_date').val().trim().split("-");
        var del_list = [];
        var befDis = returnstringvalue($("#txt_before_discount_amount").val());
        var disAmt =
            (
                isNaN(parseFloat(returnstringvalue($("#txt_discount_amount").val()))) ? 0 : parseFloat(returnstringvalue($("#txt_discount_amount").val()))) +
                (isNaN(parseFloat(returnstringvalue($("#txt_special_dis_amount").val()))) ? 0 : parseFloat(returnstringvalue($("#txt_special_dis_amount").val()))
            );

        var disPer = (parseFloat(disAmt) / parseFloat(befDis)) * 100;

        

        var head = {
            DocEntry: $("#txt_so_entry").val(),
            PostingDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            DueDate: reqdate[2] + "/" + reqdate[1] + "/" + reqdate[0],
            CardCode: $("#txt_card_code").val(),
            CardName: $("#txt_card_name").val(),
            ContactPerson: ($("#cbo_contact_person").val() || "-1"),
            NumatCard: ($("#txt_house_code").val()  || "-1"),
            SubTotal: returnstringvalue($("#txt_before_discount_amount").val()),
            DiscountAmt: disAmt,
            DiscountPer: disPer,
            BalanceDue: returnstringvalue($("#txt_before_discount_amount").val()),
            DocTotalBef: befDis,
            CreatedBy: $("#txt_shared_userid").val(),
            Referral: ($("#txt_referral").val() || "-1"),
            ConPeriod: 1,
            Rate: $("#txt_installment_rate").val(),
            PeriodM: $("#txt_period").val(),
            StartPayDate: $("#txt_start_payment").val(),
            DocNumRef: $("#txt_doc_num").val(),
            RestructureOption: payment_option  // global variable
        };

        $("#table_payment_schedule >tbody >tr").each(function (index) {
            index++;
            if ($("#tr_payment_detail_installmentid_line_" + index).text().trim() != '-99') {
                var docdate = $('#tr_payment_detail_paymentdate_line_' + index).text().trim().split("-");
                var detail = {
                    ID: $("#tr_payment_detail_installmentid_line_" + index).text().trim(),
                    BaseEntry: $("#tr_payment_detail_baseentry_line_" + index).text().trim(),
                    BaseLine: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                    VisOrder: (index - 1),
                    ItemCode: $("#tr_payment_detail_itemcode_line_" + index).text().trim(),
                    Principle: returnstringvalue($("#tr_payment_detail_principle_line_" + index).text().trim()),
                    Interest: returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim()),
                    Monthly: returnstringvalue($("#tr_payment_detail_monthlypay_line_" + index).text().trim()),
                    PaymentDate: $("#InstallmentDate_" + index).val(),
                    DueDate: $("#tr_payment_detail_paymentdate_line_" + index).text(),
                    Remaining: returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim()),
                    ReIncloudInter: parseFloat(returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim())) + parseFloat(returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim())),
                    RowStatus: "O",
                    CuInterest: returnstringvalue($("#tr_payment_detail_culnterest_line_" + index).text().trim()),
                    CuPayment: returnstringvalue($("#tr_payment_detail_cupayment_line_" + index).text().trim()),
                    FixedPayment: returnstringvalue($("#tr_payment_detail_fixedpayment_line_" + index).text().trim()),
                    ARNo: returnstringvalue($("#tr_payment_detail_arno_line_" + index).text().trim()),
                    PaymentNo: returnstringvalue($("#tr_payment_detail_paymentno_line_" + index).text().trim()),
                    /*Method: $("#tr_payment_detail_method_line_" + index).text().trim(),*/
                    Method: $("#select_method_" + index).val(),
                    InstallmentAmt: returnstringvalue($("#txt_before_discount_amount").val().trim()),
                    DiscountAmt: "0.00",
                    DepositAmt: returnstringvalue($("#tr_payment_detail_depositamt_line_" + index).text().trim()),
                    AnnualRate: returnstringvalue($("#tr_payment_detail_annulrate_line_" + index).text().trim()),
                    PeriodMonths: returnstringvalue($("#tr_payment_detail_period_line_" + index).text().trim()),
                    HouseStatus: $("#tr_payment_detail_housestatus_line_" + index).text().trim(),
                    Remarks: $("#tr_payment_detail_remarks_line_" + index).text().trim(),
                    DiscountAmount: 0,
                    DiscountPer: 0,
                    SpecialDisAmount: 0,
                    SpecialDisPer: 0,
                    AdditionalDisAmount: "0.00",
                    AdditionalDisPer: "0.00",
                    ItemName: $("#tr_payment_detail_itemname_line_" + index).text().trim(),
                    OcrCode: $("#txt_ocrcode").val(),
                    OcrCode2: $("#txt_ocrcode2").val(),
                    OcrCode3: $("#txt_ocrcode3").val(),
                    ARNoInterest: returnstringvalue($("#tr_payment_detail_arnointerest_line_" + index).text().trim()),
                    PaymentNoInterest: returnstringvalue($("#tr_payment_detail_paymentnointerest_line_" + index).text().trim()),


                    ChequeNo: $("#tr_chequeno_line_" + index).text().trim() || "",
                    ChequeName: $("#tr_nameoncheque_line_" + index).text().trim() || "",
                    ChequeBankName: $("#tr_bank_line_" + index + " option:selected").text() || "",
                    PayeeName: $("#tr_payee_line_" + index).text().trim() || ""
                };
                installmentRow_List.push(detail);
            }
        });

        console.log(installmentRow_List);
        $("#tbl_Remove_List >tbody>tr").each(function (index) {
            var tr_remve = {
                ID: $("#tr_remove_head_id_" + index).text().trim(),
                BaseEntry: $("#tr_remove_detail_id_" + index).text().trim()
            };
            del_list.push(tr_remve);
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/sales/save_payment_shcedule',
            data: JSON.stringify(
                {
                    'header': head,
                    'installment_row': installmentRow_List,
                    'del_list': del_list
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    ShowAlertCus("Payment Shcedule was saved", "success");
                    location.reload();
                    
                } else {
                    ShowAlertCus("Error while saving Payment Shcedule!","warning");
                }

            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}

function cmd_save_change_schedule() {

    var remainingAmt = returnstringvalue($("#txt_remaining_amount").val());

    if ($("#table_payment_schedule >tbody >tr").length <= 0) {
        ShowAlertCus("No data to save!", "warning");
    } else if (parseFloat(remainingAmt) < 0) {
        ShowAlertCus("Remaining amount less than zero!", "warning");
    } else {
        var docdate = $('#txt_doc_date').val().trim().split("-");
        var reqdate = $('#txt_due_date').val().trim().split("-");
        var effDate = $('#txt_effective_date').val().trim().split("-");
        var installmentRow_List = [];
        var del_list = [];
        var head = {
            DocEntry: $("#txt_so_entry").val(),
            DocDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            DueDate: reqdate[2] + "/" + reqdate[1] + "/" + reqdate[0],
            CardCode: $("#txt_card_code").val(),
            CardName: $("#txt_card_name").val(),
            ContactPerson: $("#cbo_contact_person").val(),
            NumatCard: $("#txt_house_code").val(),
            SubTotal: returnstringvalue($("#txt_before_discount_amount").val()),
            DiscountAmt: 0,
            DiscountPer: 0,
            BalanceDue: returnstringvalue($("#txt_before_discount_amount").val()),
            CreatedBy: $("#txt_shared_userid").val(),
            Referral: $("#txt_referral").val(),
            ConPeriod: 1,
            PostingDate: $('#txt_doc_date').val(),
            Remark: $("#txt_remark").val(),
            EffictiveDate: $('#txt_effective_date').val()
        };
        $("#table_payment_schedule >tbody >tr").each(function (index) {
            index++;
            
            var docdate = $('#InstallmentDate_' + index).val().split("-");
            var docduedate = $('#tr_payment_detail_paymentdate_line_' + index).text().trim().split("-");
            var detail = {
                ID: $("#tr_payment_detail_installmentid_line_" + index).text().trim(),
                BaseEntry: $("#tr_payment_detail_baseentry_line_" + index).text().trim(),
                BaseLine: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                InstallmentBaseID: $("#tr_payment_detail_baseentry_line_" + index).text().trim(),
                InstallmentBaseVisorder: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                VisOrder: (index - 1),
                ItemCode: $("#txt_item_code").val(),
                Principle: returnstringvalue($("#tr_payment_detail_principle_line_" + index).text().trim()),
                Interest: returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim()),
                Monthly: returnstringvalue($("#tr_payment_detail_monthlypay_line_" + index).text().trim()),
                PaymentDate: $("#InstallmentDate_" + index).val(),
                DueDate: docduedate[2] + "/" + docduedate[1] + "/" + docduedate[0],
                Remaining: returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim()),
                ReIncloudInter: parseFloat(returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim())) + parseFloat(returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim())),
                RowStatus: $("#tr_payment_detail_status_line_" + index).text().trim(),
                CuInterest: returnstringvalue($("#tr_payment_detail_culnterest_line_" + index).text().trim()),
                CuPayment: returnstringvalue($("#tr_payment_detail_cupayment_line_" + index).text().trim()),
                FixedPayment: returnstringvalue($("#tr_payment_detail_fixedpayment_line_" + index).text().trim()),
                ARNo: $("#tr_payment_detail_arno_line_" + index).text().trim(),
                PaymentNo: $("#tr_payment_detail_paymentno_line_" + index).text().trim(),
                
                Method: $("#select_method_" + index).val(),
                InstallmentAmt: returnstringvalue($("#txt_before_discount_amount").val().trim()),
                DiscountAmt: "0.00",
                DepositAmt: returnstringvalue($("#tr_payment_detail_depositamt_line_" + index).text().trim()),
                AnnualRate: returnstringvalue($("#tr_payment_detail_annulrate_line_" + index).text().trim()),
                PeriodMonths: returnstringvalue($("#tr_payment_detail_period_line_" + index).text().trim()),
                HouseStatus: $("#tr_payment_detail_housestatus_line_" + index).text().trim(),
                Remarks: $("#tr_payment_detail_remarks_line_" + index).text().trim(),
                DiscountAmount: 0,
                DiscountPer: 0,
                SpecialDisAmount: 0,
                SpecialDisPer: 0,
                AdditionalDisAmount: 0,
                AdditionalDisPer: "0.00",
                ItemName: $("#txt_item_name").val(),
                OcrCode: $("#txt_ocrcode").val(),
                OcrCode2: $("#txt_ocrcode2").val(),
                OcrCode3: $("#txt_ocrcode3").val(),
                ARNoInterest: $("#tr_payment_detail_arnointerest_line_" + index).text().trim(),
                PaymentNoInterest: $("#tr_payment_detail_paymentnointerest_line_" + index).text().trim(),
                VarianDay: $("#tr_payment_detail_varianday_line_" + index).text().trim(),
                InterestonsheduleVarian: returnstringvalue($("#tr_payment_detail_interestonscheduleamt_line_" + index).text().trim())
            };
            installmentRow_List.push(detail);
   
        });
        $("#tbl_Remove_List >tbody>tr").each(function (index) {
            var tr_remve = {
                ID: $("#tr_remove_head_id_" + index).text().trim(),
                BaseEntry: $("#tr_remove_detail_id_" + index).text().trim()
            };
            del_list.push(tr_remve);
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/amendments/save_change_schedule',
            data: JSON.stringify(
                {
                    'header': head,
                    'installment_row': installmentRow_List,
                    'del_list': del_list
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    ShowAlertCus("Payment Shcedule was saved", "success");
                    location.reload();
                } else {
                    ShowAlertCus("Error while saving Change Payment Shcedule!","warning");
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}

function cmd_save_change_owner() {
   
    var remainingAmt = returnstringvalue($("#txt_remaining_amount").val());

    var newcustomer = returnstringvalue($("#txt_new_card_code").val());
    var oldcustomer = returnstringvalue($("#txt_card_code").val());


    if ($("#table_payment_schedule >tbody >tr").length <= 0) {
        ShowAlertCus("No data to save!","success");
    } else if (newcustomer == null || newcustomer == "") {
        ShowAlertCus("Please select new customer first!","warning");
    } else if (newcustomer == oldcustomer) {
        ShowAlertCus("The new customer and old customer is the same!","warning");
    } else {
        var installmentRow_List = [];
        var del_list = [];
        var head = {

            DocEntry: $("#txt_docentry").val(),
            CardCode: $("#txt_new_card_code").val(),
            CardName: $("#txt_new_card_name").val(),
            OldCardCode: $("#txt_card_code").val(),
            OldCardName: $("#txt_card_name").val(),
            ContactPerson: $("#cbo_new_contact_person").val(),
            CreatedBy: $("#txt_shared_userid").val(),
            ItemCode: $("#txt_house_code").val(),
            ItemName: $("#txt_item_name").val(),
            Serial: $("#txt_after_serial").val(),
            PhoneNo: $("#txt_new_phone").val()

                    
        };
      
        $("#table_payment_schedule >tbody >tr").each(function (index) {
            index++;
            if ($("#tr_payment_detail_status_line_" + index).text().trim() == 'O') {
                var docdate = $('#tr_payment_detail_paymentdate_line_' + index).text().trim().split("-");
                var detail = {
                    ID: $("#tr_payment_detail_installmentid_line_" + index).text().trim(),
                    BaseEntry: $("#tr_payment_detail_baseentry_line_" + index).text().trim(),
                    BaseLine: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                    VisOrder: (index - 1),
                    ItemCode: $("#txt_item_code").val(),
                    Principle: returnstringvalue($("#tr_payment_detail_principle_line_" + index).text().trim()),
                    Interest: returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim()),
                    Monthly: returnstringvalue($("#tr_payment_detail_monthlypay_line_" + index).text().trim()),
                    PaymentDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
                    DueDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
                    Remaining: returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim()),
                    ReIncloudInter: parseFloat(returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim())) + parseFloat(returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim())),
                    RowStatus: $("#tr_payment_detail_status_line_" + index).text().trim(),
                    CuInterest: returnstringvalue($("#tr_payment_detail_culnterest_line_" + index).text().trim()),
                    CuPayment: returnstringvalue($("#tr_payment_detail_cupayment_line_" + index).text().trim()),
                    FixedPayment: returnstringvalue($("#tr_payment_detail_fixedpayment_line_" + index).text().trim()),
                    ARNo: -1,
                    PaymentNo: -1,
                    Method: $("#tr_payment_detail_method_line_" + index).text().trim(),
                    InstallmentAmt: returnstringvalue($("#txt_after_discount").val().trim()),
                    DiscountAmt: "0.00",
                    DepositAmt: returnstringvalue($("#tr_payment_detail_depositamt_line_" + index).text().trim()),
                    AnnualRate: returnstringvalue($("#tr_payment_detail_annulrate_line_" + index).text().trim()),
                    PeriodMonths: returnstringvalue($("#tr_payment_detail_period_line_" + index).text().trim()),
                    HouseStatus: $("#tr_payment_detail_housestatus_line_" + index).text().trim(),
                    Remarks: $("#tr_payment_detail_remarks_line_" + index).text().trim(),
                    DiscountAmount:0,
                    DiscountPer: 0,
                    SpecialDisAmount: 0,
                    SpecialDisPer: 0,
                    AdditionalDisAmount: 0,
                    AdditionalDisPer: "0.00",
                    ItemName: $("#txt_item_name").val()
                };
                installmentRow_List.push(detail);
            }
        });
        $("#tbl_Remove_List >tbody>tr").each(function (index) {
            var tr_remve = {
                ID: $("#tr_remove_head_id_" + index).text().trim(),
                BaseEntry: $("#tr_remove_detail_id_" + index).text().trim()
            };
            del_list.push(tr_remve);
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/amendments/save_change_owner',
            data: JSON.stringify({
                header: head,
                installment_row: installmentRow_List,
                del_list: del_list
            }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status === "OK") {
                    ShowAlertCus("Changing owner was saved", "success");
                    location.reload();
                } else {
                    ShowAlertCus(data.status, "warning");
                }
            },
            error: function (xhr) {
                ShowAlertCus(
                    xhr.responseJSON?.status || "Unexpected server error",
                    "warning"
                );
            }
        });

    }
}
function cmd_cancel_reload() {
    history.back();
}
function cmd_update_payment_shcedule() {
    var checkvaliddate = 0;
    var installmentRow_List = [];
    $("#table_payment_schedule >tbody >tr").each(function (index) {
        index++;
        var docdate = $('#tr_payment_detail_paymentdate_line_' + index).val().trim().split("-");
        if ($("#tr_payment_detail_invaliddate_line_" + index).text().trim() == 'Y') {
            checkvaliddate = index;
            return false;
        }
        if ($("#tr_payment_detail_invaliddate_line_" + index).text().trim()=='U') {
            var detail = {
                ID: $("#tr_payment_detail_installmentid_line_" + index).text().trim(),
                BaseEntry: $("#tr_payment_detail_baseentry_line_" + index).text().trim(),
                BaseLine: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                VisOrder: (index - 1),
                ItemCode: $("#tr_payment_detail_itemcode_line_" + index).text().trim(),
                Principle: returnstringvalue($("#tr_payment_detail_principle_line_" + index).text().trim()),
                Interest: returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim()),
                Monthly: returnstringvalue($("#tr_payment_detail_monthlypay_line_" + index).text().trim()),
                PaymentDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
                DueDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
                Remaining: returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim()),
                ReIncloudInter: parseFloat(returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim())) + parseFloat(returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim())),
                RowStatus: "O",
                CuInterest: returnstringvalue($("#tr_payment_detail_culnterest_line_" + index).text().trim()),
                CuPayment: returnstringvalue($("#tr_payment_detail_cupayment_line_" + index).text().trim()),
                FixedPayment: returnstringvalue($("#tr_payment_detail_fixedpayment_line_" + index).text().trim()),
                ARNo: -1,
                PaymentNo: -1,
                Method: $("#tr_payment_detail_method_line_" + index).text().trim(),
                InstallmentAmt: returnstringvalue($("#txt_before_discount_amount").val().trim()),
                DiscountAmt: "0.00",
                DepositAmt: returnstringvalue($("#tr_payment_detail_depositamt_line_" + index).text().trim()),
                AnnualRate: returnstringvalue($("#tr_payment_detail_annulrate_line_" + index).text().trim()),
                PeriodMonths: returnstringvalue($("#tr_payment_detail_period_line_" + index).text().trim()),
                HouseStatus: $("#tr_payment_detail_housestatus_line_" + index).text().trim(),
                Remarks: $("#tr_payment_detail_remarks_line_" + index).text().trim(),
                DiscountAmount: 0,
                DiscountPer: 0,
                SpecialDisAmount: 0,
                SpecialDisPer: 0,
                AdditionalDisAmount: "0.00",
                AdditionalDisPer: "0.00",
                ItemName: $("#tr_payment_detail_itemname_line_" + index).text().trim(),
                OcrCode: $("#txt_ocrcode").val(),
                OcrCode2: $("#txt_ocrcode2").val(),
                OcrCode3: $("#txt_ocrcode3").val()
            };
            installmentRow_List.push(detail);
        }
    });

    if (checkvaliddate != 0) {
        ShowAlertCus("Changing payment date invalid(Row Number " + checkvaliddate + ")!","warning");
    } else if (installmentRow_List.length == 0) {
        ShowAlertCus("No data to update!","warning");
    } else  {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/sales/update_payment_shcedule',
            data: JSON.stringify(
                {
                    'installment_row': installmentRow_List
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    ShowAlertCus("Payment Shcedule was saved", "success");
                    location.reload();
                    
                } else {
                    ShowAlertCus("Error while saving Payment Shcedule!","warning");
                }

            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}

function ShowAlert(message, callback) {
    // Assuming ShowAlert shows a modal with an "OK" button
    alert(message); // Replace with your custom modal logic
    if (callback) callback(); // Execute callback after alert
}

function cmd_save_updateOldSchedule() {

        var head = {
            DocEntry: $("#txt_doc_num").val(),
            ChangeReason: $("#ddl_action").val(),
            ChangeItemRefNo: $("#txt_ar_memo_ref").val()
        };
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/sales/save_updateOldSchedule',
            data: JSON.stringify(
                {
                    'header': head
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {

                if (data.status == "OK") {
                    ShowAlert("Update Record  was saved", function () {
                        if (head.ChangeItemRefNo && head.ChangeItemRefNo.trim() !== "") {
                            window.location.assign("/sales/OldScheduleListingChangeItem");
                        } else {
                            window.location.assign("/sales/OldScheduleListing");
                        }
                    });
                }


                else {
                    ShowAlertCus("Error while saving Payment Shcedule","warning");
                }

            },
            failure: function (response) {
                $('#result').html(response);
            }
        });

}

function cmd_save_approval_changeowner(Type) {

    var head = {
        DocEntry: $("#txt_draf_ID").val(),
        Comment: $("#txt_approverComment").val(),
        DocStatus: Type
    };
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/amendments/save_approval_changeowner',
        data: JSON.stringify(
            {
                'header': head
            }),
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status === "OK") {
                ShowAlertCus("Update Record was saved", "success");

                setTimeout(function () {
                    window.location.href = "/amendments/ChangeOwnerApporovalListing";
                }, 1500); // Wait 1.5 seconds before redirect
            }
            else {
                ShowAlertCus("Error while saving Payment Shcedule","warning");
            }
        },
        failure: function (response) {
            $('#result').html(response);
        }
    });

}


function get_selected_payment_schedule_by_so_forReschedule() {

    var row = $("#txt_payment_schedule_selected_row").val();
    if (row == -1) {
        ShowAlertCus("No AR Memo selected!", "warning");
    } else {
        var docentry = $("#td_pop_payment_schedule_so_entry_" + row).text();
        var serialno = $("#td_pop_payment_schedule_serial_" + row).text();
        var linenum = $("#td_pop_payment_schedule_so_line_" + row).text();
        $.ajax({
            url: '/sales/get_payment_schedule_by_so',
            type: 'POST',
            data: {
                soEntry: docentry,
                rowStatus: 'All'
            },
            datatype: 'json',
            async: false,
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                var mydata = data.data;
                var totalPrinciple = 0.00;
                var totalInterest = 0.00;
                var totalMonthlyPay = 0.00;
                var ItemPrice = 0.00;

                var NewItemCode = "";
                var NewItemName = "";
                var BuybackAmt = 0.00;
                var GeneratedARAmt = 0.00;
                var OutstandingAmt = 0.00;
                var VarianAmt = 0.00;
                var SerialNumber = "";

                $("#txt_total_principle").text('0.00');
                $("#txt_total_interest").text('0.00');
                $("#txt_total_monthly").text('0.00');
                $("#txt_docentry").val(docentry);
                $("#txt_after_serial").val(serialno);

                update_info_payment(mydata[0], row);

                $("#table_payment_schedule >tbody >tr").remove();
                var index = 1;
                for (i = 0; i < mydata.length; i++) {
                    var x = mydata[i];

                    //Assign the price to Item 
                    ItemPrice = x.HouseAmount;

                    NewItemCode = x.NewItemCode;
                    NewItemName = x.NewItemName;
                    BuybackAmt = x.BuybackAmt;
                    GeneratedARAmt = x.GeneratedARAmt;
                    OutstandingAmt = x.OutstandingAmt;
                    VarianAmt = x.VarianAmt;
                    SerialNumber = x.DistNumber;

                    var data = "<tr id='tr_payment_" + index + "'>";
                    data = data + "<td style='text-align:Left;'>" + index + "</td>";


                    let isOpen = x.Status.trim() === "O";

                    data += "<td style='text-align:Left; color:blue'>" +
                        "<input type='text' " +
                        "style='text-align:Left; color:blue' " +
                        "class='form-control datetime form-control-insde' " +
                        "name='InstallmentDate_" + index + "' " +
                        "id='InstallmentDate_" + index + "' " +
                        "value='" + x.InstallmentDate + "' " +
                        "placeholder='Choose Date' " +
                        (isOpen ? "" : "disabled") + " />" +
                        "</td>";


                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_newduedate_line_" + index + "'>" + x.InstallmentDate + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_paymentdate_line_" + index + "'>" + x.DueDate + "</td>";
                    data = data + "<td style='text-align:left; vertical-align: middle;' id='tr_payment_detail_principle_line_" + index + "'>" + convert2digit(x.Principle) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_interest_line_" + index + "'>" + convert2digit(x.Interest) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_monthlypay_line_" + index + "'>" + convert2digit(x.MonthlyPay) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamt_line_" + index + "'>" + convert2digit(x.RemainingAmt) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamtandinterest_line_" + index + "'>" + convert2digit(parseFloat(x.RemainingAmt) + parseFloat(x.Interest)) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupayment_line_" + index + "'>" + convert2digit(x.CuPayment) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_culnterest_line_" + index + "'>" + convert2digit(x.CuInterest) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupaymentandculnterest_line_" + index + "'>" + convert2digit(parseFloat(x.CuPayment) + parseFloat(x.CuInterest)) + "</td>";

                    data += "<td style='text-align:left; vertical-align:middle;' id='tr_payment_detail_method_line_" + index + "'>";
                    data += "<div class='form-group'>";
                    data += "<select class='form-control' style='width:100%; color:blue' id='select_method_" + index + "' " + (isOpen ? "" : "disabled") + ">";

                    for (let i = 0; i < methodOptions.length; i++) {
                        const opt = methodOptions[i];
                        const selected = (opt.code === x.HouseStatus) ? "selected" : "";
                        data += "<option value='" + opt.code + "' " + selected + ">" + opt.code + " - " + opt.name + "</option>";
                    }

                    data += "</select>";
                    data += "</div>";
                    data += "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arno_line_" + index + "'>" + x.ARNo + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentno_line_" + index + "'>" + x.PaymentNo + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arnointerest_line_" + index + "'>" + x.ARNoInterest + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentnointerest_line_" + index + "'>" + x.PaymentNoInterest + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_varianday_line_" + index + "'>" + 0 + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_interestonscheduleamt_line_" + index + "'>" + 0.00 + "</td>";

                    data = data + "<td " +
                        (isOpen ? "contenteditable='true'" : "") +
                        " style='text-align:Left; vertical-align: middle; color:blue' " +
                        "id='tr_payment_detail_remarks_line_" + index + "'>" + x.Remarks + "</td>";

                    data = data + "<td style='display:none;' id='tr_payment_detail_status_line_" + index + "'>" + x.Status.trim() + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemcode_line_" + index + "'>" + x.ItemCode + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemname_line_" + index + "'>" + x.ItemName + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_rowno_line_" + index + "'>" + x.RowNo + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_accamt_line_" + index + "'>" + convert2digit(x.AccAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_period_line_" + index + "'>" + convert2digit(x.U_Period) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_annulrate_line_" + index + "'>" + convert2digit(x.U_AnnulRate) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_depositamt_line_" + index + "'>" + convert2digit(x.DepositAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseentry_line_" + index + "'>" + docentry + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseline_line_" + index + "'>" + linenum + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_fixedpayment_line_" + index + "'>" + convert2digit(x.FixedPayment) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_housestatus_line_" + index + "'>" + x.HouseStatus + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_installmentid_line_" + index + "'>" + x.ID + "</td>";
                    data = data + "</tr>";
                    $("#table_payment_schedule >tbody").append(data);


                    totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue(x.Principle));
                    totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue(x.Interest));
                    totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue(x.MonthlyPay));

                    index++;
                }
                storeOriginalDates();

                totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue($("#txt_total_principle").text()));
                $("#txt_total_principle").text(convert2digit(totalPrinciple));
                totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue($("#txt_total_interest").text()));
                $("#txt_total_interest").text(convert2digit(totalInterest));
                totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue($("#txt_total_monthly").text()));
                $("#txt_total_monthly").text(convert2digit(totalMonthlyPay));

                var remainingAmt = parseFloat(ItemPrice) - parseFloat(totalPrinciple);

                $("#txt_before_discount_amount").val(convert2digit(ItemPrice));
                $("#txt_after_discount").val(convert2digit(ItemPrice));

                if (NewItemCode !== "") {
                    $("#txt_item_code").val(NewItemCode);
                    $("#txt_item_name").val(NewItemName || "");
                }
                $("#txt_serial_no").val(SerialNumber);
                //$("#txt_item_name").val(NewItemName || "");


                $("#txt_buyback_amt").val(convert2digit(BuybackAmt));
                $("#txt_generated_ar_amt").val(convert2digit(GeneratedARAmt));
                $("#txt_outstanding_amount").val(convert2digit(OutstandingAmt));
                $("#txt_varian_amount").val(convert2digit(VarianAmt));

                var OldAmt = parseFloat(GeneratedARAmt) + parseFloat(OutstandingAmt);


                $("#txt_oldafter_discount").val(convert2digit(OldAmt));

                /// This is condition to put Isnull 0
                remainingAmt = parseFloat(remainingAmt);

                if (parseFloat(convert2digit(remainingAmt)) == 0) {
                    $("#txt_installment_rate").attr('readonly', 'readonly');
                    $("#txt_period").attr('readonly', 'readonly');
                    $("#txt_fixed_monthly_payment").attr('readonly', 'readonly');
                    $("#check_manual_payment").prop('checked', false);
                    $("#check_manual_payment").attr('disabled', 'disabled');
                    $("#cbo_payment_option").val('');
                    $("#cbo_payment_option").attr('disabled', 'disabled');
                    $("#btn_generate_payment_shcedule").text('Generate');
                    $("#txt_remaining_amount").val('0.00');
                    $("#txt_installment_amount").val('0.00');
                } else {
                    $("#txt_remaining_amount").val(convert2digit(remainingAmt));
                    $("#txt_installment_amount").val(convert2digit(remainingAmt));
                }

                disable_enable_remove_by_line();
                set_date_of_payment();
                $("#txt_effective_date").prop("disabled", true);

                $("#modal-schedule-list").modal('hide');
                $("#txt_payment_schedule_selected_row").val("-1");
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}

function cmd_save_approval_penaltyDraf(Type) {

    var head = {
        DocEntry: $("#txt_draf_ID").val(),
        Comment: $("#txt_approverComment").val(),
        DocStatus: Type
    };
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/amendments/save_approval_penaltyDraft',
        data: JSON.stringify(
            {
                'header': head
            }),
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status == "OK") {
                ShowAlertCus("Record updated successfully", "success");

                setTimeout(function () {
                    window.location.href = "/amendments/PenaltyApporovalListing";
                }, 1500);
            }
            else {
                ShowAlertCus("Error while saving","warning");
            }
        },
        failure: function (response) {
            $('#result').html(response);
        }
    });

}

function cmd_penaltydraf_waive_generate() {

    let waiveOption = parseFloat($("#txt_waive_option").val());

    if (!waiveOption || waiveOption <= 0) {
        ShowAlertCus("Please enter a valid waive % number", "warning");
        $("#txt_waive_option").focus();
        return;
    }

    else if ($("#table_customer_list tbody tr").length === 0) {
        ShowAlertCus("Customer Detail Information  cannot be empty", "warning");
        return;
    }

    else {
        get_penaltydraf_waive();
    }
}


function cmd_interestwizard_generate() {
    if ($("#txt_card_code").val() == "") {
        ShowAlertCus("Please choose customer", "warning");
    }
    else {
        get_interestwizard();
    }
}


function get_interestwizard() {

    var CardCode = $("#txt_card_code").val();
    var serial = $("#txt_serial").val();

    $.ajax({
        url: '/sales/get_interest_List',
        type: 'POST',
        data: { CardCode: CardCode, serial: serial },
        datatype: 'json',
        beforeSend: function () { $("#loading").show(); },
        complete: function () { $("#loading").hide(); },
        success: function (data) {

            var rowindex = 1;
            var mydata = data.data;

            $("#table_interestwizard_list > tbody").empty();

            for (var i = 0; i < mydata.length; i++) {
                var x = mydata[i];

                var row = "<tr id='tr_interestwizard_" + rowindex + "'>";

                // 1. Row index #
                row += "<td id='tr_interestwizard_index_" + rowindex + "' style='text-align:center; vertical-align: middle;'>" + rowindex + "</td>";

                // 2. Checkbox
                row += "<td id='tr_interestwizard_checkbox_" + rowindex + "' style='text-align:center; vertical-align: middle;'>" +
                    "<input type='checkbox' id='chk_interest_wizard_line_" + rowindex + "' />" +
                    "</td>";

                // 3. BaseEntry
                row += "<td id='tr_interestwizard_baseentry_" + rowindex + "' style='text-align:left; vertical-align: middle;'>" + (x.BaseEntry || "") + "</td>";

                //// 4. LoanID (ID)
                //row += "<td id='tr_interestwizard_loanid_" + rowindex + "' style='text-align:left; vertical-align: middle;'>" + (x.ID || "") + "</td>";

                // 4. LoanID (ID)
                row += "<td id='tr_interestwizard_loanid_" + rowindex + "' " +
                    "class='loanid-cell' " +
                    "data-loanid='" + (x.ID || "") + "' " +
                    "style='text-align:left; vertical-align: middle; cursor:pointer;'>" +
                    (x.ID || "") +
                    "</td>";

                // 5. Posting Date
                row += "<td id='tr_interestwizard_postingdate_" + rowindex + "' style='text-align:left; vertical-align: middle;'>" + (x.PaymentDate || "") + "</td>";

                // 6. Due Date
                row += "<td id='tr_interestwizard_duedate_" + rowindex + "' style='text-align:left; vertical-align: middle;'>" + (x.DueDate || "") + "</td>";

                // 7. Item Code
                row += "<td id='tr_interestwizard_itemcode_" + rowindex + "' style='text-align:left; vertical-align: middle;'>" + (x.ItemCode || "") + "</td>";

                // 8. Item Name
                row += "<td id='tr_interestwizard_itemname_" + rowindex + "' style='text-align:left; vertical-align: middle;'>" + (x.ItemName || "") + "</td>";

                // 9. Serial (DistNumber)
                row += "<td id='tr_interestwizard_serial_" + rowindex + "' style='text-align:left; vertical-align: middle;'>" + (x.DistNumber || "") + "</td>";

                // 10. Reason (Method)
                row += "<td id='tr_interestwizard_reason_" + rowindex + "' style='text-align:left; vertical-align: middle;'>" + (x.Method || "") + "</td>";

                // 11. Interest Amt
                row += "<td id='tr_interestwizard_interestamt_" + rowindex + "' style='text-align:right; vertical-align: middle;'>" + convert2digit(x.OriginalInterest) + "</td>";

                // 12. Generated Amt
                row += "<td id='tr_interestwizard_generatedamt_" + rowindex + "' style='text-align:right; vertical-align: middle;'>" + convert2digit(x.ApplyInterest) + "</td>";

                // 13. Remaining
                row += "<td id='tr_interestwizard_remaining_" + rowindex + "' style='text-align:right; vertical-align: middle;'>" + convert2digit(x.Remaining) + "</td>";

                // 14. Apply Amt
                row += "<td id='tr_interestwizard_applyamt_" + rowindex + "' style='text-align:right; vertical-align: middle;'>" +
                    "<input type='number' class='form-control apply-amt-input' " +
                    "id='applyamt_interest_wizard_line_" + rowindex + "' " +
                    "style='text-align:right; color:blue;' />" +
                    "</td>";

                // 15. New Remaining
                row += "<td id='tr_interestwizard_newremaining_" + rowindex + "' style='text-align:right; vertical-align: middle;'>" +
                    convert2digit(x.Remaining) +
                    "</td>";

                // 16. Remark
                row += "<td id='tr_interestwizard_remark_" + rowindex + "' style='text-align:left; vertical-align: middle;'>" +
                    "<textarea id='remark_interest_wizard_line_" + rowindex + "' rows='1' class='form-control'>" +
                    (x.Remarks || "") +
                    "</textarea>" +
                    "</td>";

                row += "</tr>";

                $("#table_interestwizard_list >tbody").append(row);
                rowindex++;
            }

            disable_enable_remove_by_line();
        },
        error: function (error) {
            alert('Error while reading data => ' + error);
        }
    });
}

function validateApplyAmt(rowindex) {
    var input = $("#applyamt_" + rowindex);
    var remaining = parseFloat(input.data("remaining"));
    var val = parseFloat(input.val());

    // Default to 0 if invalid
    if (isNaN(val) || val < 0) {
        input.val("0.00");
        val = 0;
    }

    // If user enters more than Remaining
    if (val > remaining) {
        ShowAlertCus("Apply Amount cannot be greater than Remaining (" + remaining.toFixed(2) + ")");
        input.val(remaining.toFixed(2)); // Reset to Remaining
        val = remaining;
    }

    // Update New Remaining column dynamically
    $("#newremaining_" + rowindex).text((remaining - val).toFixed(2));
}

// Helper to format numbers to 2 decimals
function convert2digit(val) {
    return val != null ? parseFloat(val).toFixed(2) : "0.00";
}

function get_penaltydraf_waive() {

    var checkDate = 0;
    var lenRow = $("#table_penalty_list >tbody >tr").length;

    if (checkDate == 0) {
        var ToDueDate = $("#txt_tdue_date").val();
        var WaiveOption = $("#txt_waive_option").val();

        var PenaltyDate = $("#txt_penalty_date").val();

        let codes = [];
        const tableRows = document.querySelectorAll("#table_customer_list tbody tr");

        tableRows.forEach(row => {
            const tds = row.querySelectorAll("td");
            if (tds.length >= 3) {
                const customerCode = tds[2].textContent.trim();
                if (customerCode) {
                    codes.push(customerCode);
                }
            }
        });

        const result = codes.join("; ");


        $.ajax({
            url: '/amendments/get_penalty_drafList',
            type: 'POST',
            data: {
                Customer: result
                , ToDueDate: ToDueDate
                , WaiveOption: WaiveOption
            },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {

                var rowindex = $("#table_penalty_list >tbody >tr").length;
                var mydata = data.data;
                if (rowindex > 0) {
                    var lasttr = $("#table_penalty_list >tbody >tr:last");
                    rowindex = lasttr.attr('id').replace("tr_penalty__", "");
                }
                rowindex = parseInt(rowindex) + 1;


                for (i = 0; i < mydata.length; i++) {

                    var x = mydata[i];

                    var data = "<tr id='tr_payment_" + rowindex + "'>";

                    // 1. Empty column
                    data += "<td></td>";

                    // 2. Remove icon + checkbox
                    data += "<td style='text-align:center; vertical-align: middle;'>"
                        + "<i class='fa fa-fw fa-remove' style='cursor:pointer; margin-right:8px; color:red;' title='Remove row' onclick='cmd_tr_payment_detail_remove_line(" + rowindex + ")'></i>"
                        + "<input type='checkbox' id='tr_payment_detail_checkbox_remove_line_" + rowindex + "' style='cursor:pointer;' onclick='checkbox_tr_payment_detail(" + rowindex + ")'>"
                        + "</td>";

                    // 3. Row number
                    data += "<td style='text-align:left; vertical-align: middle;'>" + rowindex + "</td>";

                    //// 4. Posting Date
                    //data += "<td style='text-align:left; color:blue; vertical-align: middle;'>"
                    //    + "<div class='form-group'>"
                    //    + "<div class='input-group date'>"
                    //    + "<div class='input-group-addon'><i class='fa fa-calendar'></i></div>"
                    //    + "<input type='text' style='text-align:left; color:blue;' class='form-control pull-right datetime form-control-insde'"
                    //    + " name='InstallmentDate_" + rowindex + "'"
                    //    + " id='InstallmentDate_" + rowindex + "'"
                    //    + " value='" + PenaltyDate + "' placeholder='Choose Date' />"
                    //    + "</div></div></td>";

                   

                    // Customer
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_cardcode_" + rowindex + "'>" + x.CardCode + "</td>";
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_cardname_" + rowindex + "'>" + x.CardName + "</td>";

                    

                    // Installment
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_installmentrow_" + rowindex + "'>" + x.InstallmentRow + "</td>";
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_installmentid_" + rowindex + "'>" + x.InstallmentID + "</td>";

                    // Amounts
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_principle_" + rowindex + "'>" + convert2digit(x.PrincipleAmt) + "</td>";
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_interest_" + rowindex + "'>" + convert2digit(x.interestAmt) + "</td>";
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_chqamt_" + rowindex + "'>" + convert2digit(x.CHQAmt) + "</td>";

                    // NEW: From Payment Date
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_frompaymentdate_" + rowindex + "'>" + x.FromPaymentDate + "</td>";

                    // NEW: To Payment Date
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_topaymentdate_" + rowindex + "'>" + x.TOPaymentDate + "</td>";

                    data += "<td style='text-align:left; vertical-align: middle;' id='td_overday_" + rowindex + "'>" + x.TotalOverDay + "</td>";

                    // Penalty Percent
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_penaltypercent_" + rowindex + "'>" + convert2digit(x.PenaltyPercent) + "</td>";


                    // NEW: Total Penalty
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_totalpenalty_" + rowindex + "'>" + convert2digit(x.TotalPenalty) + "</td>";

                    // Waive
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_waivename_" + rowindex + "'>" + x.WaiveName + "</td>";
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_applypercent_" + rowindex + "'>" + convert2digit(x.ApplyPercent) + "</td>";

                    // NEW: Total Waive Amount
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_totalwaiveamt_" + rowindex + "'>" + convert2digit(x.TotalWaiveAmt) + "</td>";

                    // Net Amount
                    data += "<td style='text-align:left; vertical-align: middle;' id='td_totalnetamt_" + rowindex + "'>" + convert2digit(x.TotalNetAmt) + "</td>";

                    // Remark
                    data += "<td style='text-align:left vertical-align: middle;; color:blue;'>"
                        + "<textarea id='remark_" + rowindex + "' name='remark_" + rowindex + "' rows='1' class='form-control' style='color:blue;'>"
                        + (x.Remark || "")
                        + "</textarea></td>";

                    // IDs (hidden for processing)
                    data += "<td style='display:none;' id='td_ids_" + rowindex + "'>" + x.IDs + "</td>";
                    // Hidden Item Info
                    data += "<td style='display:none;' id='td_itemcode_" + rowindex + "'>" + x.ItemCode + "</td>";
                    data += "<td style='display:none;' id='td_itemname_" + rowindex + "'>" + x.ItemName + "</td>";
                    data += "<td style='display:none;' id='td_serialno_" + rowindex + "'>" + x.SerialNo + "</td>";

                    data += "</tr>";

                    $("#table_penalty_list >tbody").append(data);

                    rowindex++;
                }
                disable_enable_remove_by_line();
                set_date_of_payment();
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}  


function cmd_save_penaltyDraf() {

    if ($("#table_penalty_list >tbody >tr").length <= 0) {
        ShowAlertCus("No data to save!","warning");
    } else {
        var rowsList = [];
        var head = {
            PenaltyDate: $("#txt_penalty_date").val(),
            DocNumRef: $("#txt_doc_num").val(),
            Remark: $("#txt_remark").val(),
            WaiveOption: $("#txt_waive_option").val()
        };

        $("#table_penalty_list >tbody >tr").each(function (index) {
            index++;
            var fromAccDate = $('#td_frompaymentdate_' + index).text().trim().split("-");
            var toAccDate = $('#td_topaymentdate_' + index).text().trim().split("-");
            var detail = {
                VisOrder: (index - 1),
                FromAccDate: fromAccDate[2] + "/" + fromAccDate[1] + "/" + fromAccDate[0],
                ToAccDate: toAccDate[2] + "/" + toAccDate[1] + "/" + toAccDate[0],
                OverDay: $("#td_overday_" + index).text().trim(),
                PenaltyRef: $("#txt_doc_num").val(),
                BPCode: $("#td_cardcode_" + index).text().trim(),
                BPName: $("#td_cardname_" + index).text().trim(),
                ItemCode: $("#td_itemcode_" + index).text().trim(),
                SerialNo: $("#td_serialno_" + index).text().trim(),
                InstallmentID: $("#td_installmentid_" + index).text().trim(),
                InstallmentRow: $("#td_installmentrow_" + index).text().trim(),
                AccraulID: $("#td_ids_" + index).text().trim(),
                PrincipleAmt: $("#td_principle_" + index).text().trim(),
                InterestAmt: $("#td_interest_" + index).text().trim(),
                CHQAmt: $("#td_chqamt_" + index).text().trim(),
                PenaltyPercent: returnstringvalue($("#td_penaltypercent_" + index).text().trim()),
                PenaltyAmt: returnstringvalue($("#td_totalpenalty_" + index).text().trim()),
                ApplyPercent: returnstringvalue($("#td_applypercent_" + index).text().trim()),
                WaiveAmt: returnstringvalue($("#td_totalwaiveamt_" + index).text().trim()),
                NetAmt: returnstringvalue($("#td_totalnetamt_" + index).text().trim()),
                Remark: $("#td_remark_" + index).text(),
                Status: "O"
               
            };
            rowsList.push(detail);

            
        });



        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/amendments/save_penalty_wizard',
            data: JSON.stringify(
                {
                    'header': head,
                    'rows': rowsList
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {

                if (data.status == "OK") {
                    ShowAlertCus("Penalty wizard was saved", "success");
                    location.reload();
                    
                } else {
                    ShowAlertCus("Error while saving penalty Wizard!","warning");
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}

function cmd_save_interestwizard() {

    // 1️⃣ Check if table has rows
    if ($("#table_interestwizard_list >tbody >tr").length <= 0) {
        ShowAlertCus("No data of interest to save!", "warning");
        return;
    }

    var rowsList = [];
    var hasError = false;

    // 2️⃣ Header Object
    var head = {
        PostingDate: $("#txt_posting_date").val(),
        DueDate: $("#txt_due_date").val(),

        CardCode: $("#txt_card_code").val(),
        CardName: $("#txt_card_name").val(),
        Ref: $("#txt_ref").val(),
        Remark: $("#txt_remark").val(),
        Serial: $("#txt_serial").val(),

        TotalInterestAmt: returnstringvalue($("#sum_interest_amt").text().trim()),
        TotalGeneratedAmt: returnstringvalue($("#sum_generated_amt").text().trim()),
        TotalRemainingAmt: returnstringvalue($("#sum_remaining").text().trim()),
        TotalApplyAmt: returnstringvalue($("#sum_apply_amt").text().trim()),
        TotalNewremainingAmt: returnstringvalue($("#sum_new_remaining").text().trim())
    };

    // 3️⃣ Loop Rows
    $("#table_interestwizard_list >tbody >tr").each(function (index) {

        index++;

        // ✅ Only process checked rows
        if ($("#chk_interest_wizard_line_" + index).is(":checked")) {

            // Get Apply Amount correctly
            var ApplyAmt = parseFloat($("#applyamt_interest_wizard_line_" + index).val()) || 0;

            // 🚫 Block zero or negative ApplyAmt
            if (ApplyAmt <= 0) {
                ShowAlertCus("Apply Amount must be greater than zero! (Row " + index + ")", "warning");
                hasError = true;
                return false; // break loop
            }

            // Get Dates
            var postingdate = $("#tr_interestwizard_postingdate_" + index).text().trim();
            var duedate = $("#tr_interestwizard_duedate_" + index).text().trim();

            var postArr = postingdate ? postingdate.split("-") : [];
            var dueArr = duedate ? duedate.split("-") : [];



            // Safety date format check
            if (postArr.length !== 3 || dueArr.length !== 3) {
                ShowAlertCus("Invalid date format in row " + index, "warning");
                hasError = true;
                return false;
            }

            var detail = {
                VisOrder: (index - 1),
                LineNum: (index - 1),
                OldPostingDate: postArr[2] + "/" + postArr[1] + "/" + postArr[0],
                OldDueDate: dueArr[2] + "/" + dueArr[1] + "/" + dueArr[0],
                NewPostingDate: $("#txt_posting_date").val(),
                NewDueDate: $("#txt_due_date").val(),


                BaseEntry: $("#tr_interestwizard_baseentry_" + index).text().trim(),
                LoanID: $("#tr_interestwizard_loanid_" + index).text().trim(),
                ItemCode: $("#tr_interestwizard_itemcode_" + index).text().trim(),
                ItemName: $("#tr_interestwizard_itemname_" + index).text().trim(),
                Serial: $("#tr_interestwizard_serial_" + index).text().trim(),
                Reason: $("#tr_interestwizard_reason_" + index).text().trim(),

                InterestAmt: returnstringvalue($("#tr_interestwizard_interestamt_" + index).text().trim()),
                GeneratedAmt: returnstringvalue($("#tr_interestwizard_generatedamt_" + index).text().trim()),
                RemainingAmt: returnstringvalue($("#tr_interestwizard_remaining_" + index).text().trim()),
                ApplyAmt: ApplyAmt,
                NewRemainingAmt: returnstringvalue($("#tr_interestwizard_newremaining_" + index).text().trim()),

                Remark: $("#remark_interest_wizard_line_" + index).val()
            };

            rowsList.push(detail);
        }
    });

    // 4️⃣ Stop if validation failed
    if (hasError) return;

    // 5️⃣ Ensure at least one row selected
    if (rowsList.length === 0) {
        ShowAlertCus("Please select at least one row!", "warning");
        return;
    }

    // 6️⃣ AJAX Save
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/sales/save_interest_wizard',
        data: JSON.stringify({
            header: head,
            rows: rowsList
        }),
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {

            if (data.status === "OK") {
                ShowAlertCus("Interest wizard was saved", "success");
                location.reload();
            } else {
                ShowAlertCus("Error while saving Interest Wizard!", "warning");
            }
        },
        error: function (error) {
            ShowAlertCus("Server error while saving!", "danger");
            console.log(error);
        }
    });
}


function cmd_save_activity() {
    var tbody = $("#loan_list_body > tr");

    if (tbody.length <= 0) {
        ShowAlertCus("No data to save!", "warning");
        return;
    }

    // Collect header info
    var head = {
        HeaderID: $("#txt_docNum").val(),
        Activity: $("#cbo_activity").val(),
        Type: $("#cbo_type").val(),
        Priority: $("#cbo_priority").val(),
        HandledBy: $("#txt_handled_by").val(),
        AssignedBy: $("#txt_assign_by").val(),
        Status: $("#cbo_status").val(),
        Recurrence: $("#cbo_recurrence").val(),
        StartDate: $("#txt_start_date").val(),
        EndDate: $("#txt_end_date").val(),
        ActivityRemark: $("#txt_activity_remark").val(),
        CustomerResponse: $("#txt_customer_response").val(),
        NextAction: $("#txt_next_action").val(),
        Content: $("#txt_content").val(),
        CustomerCode: $("#txt_customer_code").val(),
        CardName: $("#txt_card_name").val(),
        Phone: $("#txt_phone").val(),
        Ref: $("#txt_ref").val(),
        LoanID: $("#txt_loanID").val(),
        ItemName: $("#txt_item_name").val(),
        Serial: $("#txt_serial").val(),
        TotalARBalance: $("#txt_ar_balance").val()
    };

    // Collect loan/penalty rows
    var rowsList = [];
    tbody.each(function (index) {
        index++; // match row numbering in IDs
        var detail = {
            HeaderID: $("#txt_docNum").val(),
            RowNo: index,
            PaymentDate: $("#td_paymentdate_" + index).text().trim(),
            DueDate: $("#td_duedate_" + index).text().trim(),
            Principle: returnstringvalue($("#td_principle_" + index).text().trim()),
            Interest: returnstringvalue($("#td_interest_" + index).text().trim()),
            Monthly: returnstringvalue($("#td_monthly_" + index).text().trim()),
            PaymentType: $("#td_method_" + index).text().trim(),
            ARNo: $("#td_arno_" + index).text().trim(),
            ARBalance: returnstringvalue($("#td_arbalance_" + index).text().trim()),
            OpenBalanceAR: returnstringvalue($("#td_openbalar_" + index).text().trim()),
            IntNo: returnstringvalue($("#td_intno_" + index).text().trim()),
            IntBalance: returnstringvalue($("#td_intbalance_" + index).text().trim()),
            OpenIntBalance: returnstringvalue($("#td_openbalint_" + index).text().trim()),
            AccrualPenalty: returnstringvalue($("#td_accrualpenalty_" + index).text().trim()),
            Remarks: $("#td_remark_" + index).text().trim()
        };

        rowsList.push(detail);
    });
    // Send data to server
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/sales/save_activity', // adjust URL if different
        data: JSON.stringify({
            header: head,
            rows: rowsList
        }),
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            // Show server status message
            if (data.status === "OK") {
                ShowAlertCus("Activity was saved successfully!", "success");
                location.reload();
            } else {
                ShowAlertCus(data.status, "warning");
            }
        },
        error: function (err) {
            console.error(err);
            ShowAlertCus("Unexpected error occurred!", "error");
        }
    });
}


function cmd_pop_choose_payment_schedule_restructure(OptionType) {
    if (OptionType == 1) {
        get_selected_payment_schedule_by_so_restructure();
    }
    else {
        get_selected_payment_schedule_by_so_restructure_Amt();
    }
}


function get_selected_payment_schedule_by_so_restructure_Amt() {
    
    var row = $("#txt_payment_schedule_selected_row").val();
    if (row == -1) {
        ShowAlertCus("No AR Memo selected!","warning");
    } else {
        var docentry = $("#td_pop_payment_schedule_so_entry_" + row).text();
        var serialno = $("#td_pop_payment_schedule_serial_" + row).text();
        var linenum = $("#td_pop_payment_schedule_so_line_" + row).text();
        var PeriodM = $("#txt_period").val();
        var Rate = $("#txt_installment_rate").val();
        $.ajax({
            url: '/sales/get_restructure_amt_schedule_by_so',
            type: 'POST',
            data: {
                soEntry: docentry,
                rowStatus: 'ALL',
                periodM: PeriodM
            },
            datatype: 'json',
            async: false,
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                var mydata = data.data;
                var totalPrinciple = 0.00;
                var totalInterest = 0.00;
                var totalMonthlyPay = 0.00;
                var ItemPrice = 0.00;
                var SerialNumber = "";

                $("#txt_total_principle1").text('0.00');
                $("#txt_total_interest1").text('0.00');
                $("#txt_total_monthly1").text('0.00');
                $("#txt_docentry").val(docentry);
                $("#txt_after_serial").val(serialno);

                update_info_payment(mydata[0], row);

                $("#table_payment_schedule_restructureAmt >tbody >tr").remove();
                var index = 1;
                for (i = 0; i < mydata.length; i++) {
                    var x = mydata[i];

                    //Assign the price to Item 
                    ItemPrice = x.HouseAmount;
                    SerialNumber = x.DistNumber;

                    let isOpen = x.Status.trim() === "O";

                    let rowStyle = (x.ChnageDateStatus === "Y") ? "background-color: #cbe0ef;" : "";

                    var data = "<tr id='tr_payment_" + index + "' style='" + rowStyle + "'>";

              
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:#00008B'>" + index + "</td>";


                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='InstallmentDate_" + index + "'>" + x.InstallmentDate + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_paymentdate_line_" + index + "'>" + x.DueDate + "</td>";
                    data = data + "<td style='text-align:left; vertical-align: middle;' id='tr_payment_detail_principle_line_" + index + "'>" + convert2digit(x.Principle) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_interest_line_" + index + "'>" + convert2digit(x.Interest) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_monthlypay_line_" + index + "'>" + convert2digit(x.MonthlyPay) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamt_line_" + index + "'>" + convert2digit(x.RemainingAmt) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamtandinterest_line_" + index + "'>" + convert2digit(parseFloat(x.RemainingAmt) + parseFloat(x.Interest)) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupayment_line_" + index + "'>" + convert2digit(x.CuPayment) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_culnterest_line_" + index + "'>" + convert2digit(x.CuInterest) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupaymentandculnterest_line_" + index + "'>" + convert2digit(parseFloat(x.CuPayment) + parseFloat(x.CuInterest)) + "</td>";


                    let isChangeData = x.ChnageDateStatus === "Y";
                    data += "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_spe_amt_line_" + index + "'>" +
                        "<input type='number' class='form-control' style='width:100%; text-align:right;' " +
                        "placeholder='0.00' " +
                        "id='spe_amt_" + index + "' " +
                        (isChangeData ? "" : "readonly ") +
                        "oninput='onSpeAmtInput(" + index + ")' />" +
                        "</td>";



                    data += "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remaining_old_line_" + index + "'>" +
                        "<input type='number' class='form-control' style='width:100%; text-align:right;' " +
                        "placeholder='0.00' disabled id='remaining_old_" + index + "' " +
                        "oninput='this.value = this.value.replace(/[^0-9.]/g, \"\");' />" +
                        "</td>";



                    data += "<td style='text-align:Left; color:blue'>" +
                        "<div class='form-group'>" +

                        // hidden input: keeps real value and has id for JS access
                        "<input type='hidden' id='NewDate_" + index + "' name='NewDate_" + index + "' value='" + x.PaymentDateNew + "' />" +

                        // visible input: disabled, shows value if isChangeData, else blank
                        "<input type='text' style='text-align:Left; color:blue' " +
                        "class='form-control pull-right' " +
                        "id='NewDate_" + index + "_display' " +
                        "value='" + (isChangeData ? x.PaymentDateNew : "") + "' placeholder='' disabled />" +

                        "</div>" +
                        "</td>";




                    data += "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_interest_schedule_line_" + index + "'>" +
                        "<input type='number' class='form-control' style='width:100%; text-align:right;' " +
                        "placeholder='0.00' disabled id='interest_schedule_" + index + "' " +
                        "oninput='this.value = this.value.replace(/[^0-9.]/g, \"\");' />" +
                        "</td>";


           

                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_method_line_" + index + "'>" + x.Method + "</td>";
             
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arno_line_" + index + "'>" + x.ARNo + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentno_line_" + index + "'>" + x.PaymentNo + "</td>";

                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arnointerest_line_" + index + "'>" + x.ARNoInterest + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentnointerest_line_" + index + "'>" + x.PaymentNoInterest + "</td>";
                    data = data + "<td " +
                        (isOpen ? "contenteditable='true'" : "") +
                        " style='text-align:Left; vertical-align: middle; color:blue' " +
                        "id='tr_payment_detail_remarks_line_" + index + "'>" + x.Remarks + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_status_line_" + index + "'>" + x.Status.trim() + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemcode_line_" + index + "'>" + x.ItemCode + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemname_line_" + index + "'>" + x.ItemName + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_rowno_line_" + index + "'>" + x.RowNo + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_accamt_line_" + index + "'>" + convert2digit(x.AccAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_period_line_" + index + "'>" + convert2digit(x.U_Period) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_annulrate_line_" + index + "'>" + convert2digit(x.U_AnnulRate) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_depositamt_line_" + index + "'>" + convert2digit(x.DepositAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseentry_line_" + index + "'>" + docentry + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseline_line_" + index + "'>" + linenum + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_fixedpayment_line_" + index + "'>" + convert2digit(x.FixedPayment) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_housestatus_line_" + index + "'>" + x.HouseStatus + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_installmentid_line_" + index + "'>" + x.ID + "</td>";
                    data = data + "</tr>";
                    $("#table_payment_schedule_restructureAmt >tbody").append(data);

                    totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue(x.Principle));
                    totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue(x.Interest));
                    totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue(x.MonthlyPay));

                    index++;
                }

                totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue($("#txt_total_principle1").text()));
                $("#txt_total_principle1").text(convert2digit(totalPrinciple));
                totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue($("#txt_total_interest1").text()));
                $("#txt_total_interest1").text(convert2digit(totalInterest));
                totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue($("#txt_total_monthly1").text()));
                $("#txt_total_monthly1").text(convert2digit(totalMonthlyPay));


                
                $("#txt_serial_no").val(SerialNumber);
                //$("#txt_item_name").val(NewItemName || "")

                $("#txt_period").prop("disabled", true);
                $("#txt_installment_rate").prop("disabled", true);

                $("#txt_remaining_amount").val(convert2digit(0));
                $("#txt_installment_amount").val(convert2digit(0))

                disable_enable_remove_by_line();
                set_date_of_payment();

                $("#modal-schedule-list").modal('hide');
                $("#txt_payment_schedule_restructureAmt_selected_row").val("-1");
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}

function onSpeAmtInput(index) {
    const speAmtInput = document.getElementById("spe_amt_" + index);
    const speAmt = parseFloat(speAmtInput?.value) || 0;

    const monthlyPayCell = document.getElementById("tr_payment_detail_monthlypay_line_" + index);
    const monthlyPay = parseFloat(monthlyPayCell?.textContent.replace(/,/g, "")) || 0;

    const remainingOldInput = document.getElementById("remaining_old_" + index);
    const interestScheduleInput = document.getElementById("interest_schedule_" + index);

    const Rate = parseFloat($("#txt_installment_rate").val()) || 0;
    const PeriodM = parseFloat($("#txt_period").val()) || 0;

    let remainingOld = 0.00;

    if (speAmt > 0) {
        remainingOld = monthlyPay - speAmt;
        remainingOldInput.value = remainingOld.toFixed(2);
    } else {
        remainingOld = 0.00;
        remainingOldInput.value = "0.00";
    }

    // 🔢 Calculate InterestSchedule
    const interestSchedule = remainingOld * (Rate / 100) * PeriodM;

    if (interestScheduleInput) {
        interestScheduleInput.value = interestSchedule.toFixed(2);
    }
}




function get_selected_payment_schedule_by_so_restructure() {
    var row = $("#txt_payment_schedule_selected_row").val();
    if (row == -1) {
        ShowAlertCus("No AR Memo selected!","warning");
    } else {
        var docentry = $("#td_pop_payment_schedule_so_entry_" + row).text();
        var serialno = $("#td_pop_payment_schedule_serial_" + row).text();
        var linenum = $("#td_pop_payment_schedule_so_line_" + row).text();
        $.ajax({
            url: '/sales/get_restructure_schedule_by_so',
            type: 'POST',
            data: {
                soEntry: docentry,
                rowStatus: 'C'
            },
            datatype: 'json',
            async: false,
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                var mydata = data.data;
                var totalPrinciple = 0.00;
                var totalInterest = 0.00;
                var totalMonthlyPay = 0.00;
                var ItemPrice = 0.00;

                var NewItemCode = "";
                var NewItemName = "";
                var BuybackAmt = 0.00;
                var GeneratedARAmt = 0.00;
                var OutstandingAmt = 0.00;
                var VarianAmt = 0.00;
                var SerialNumber = "";

                $("#txt_total_principle").text('0.00');
                $("#txt_total_interest").text('0.00');
                $("#txt_total_monthly").text('0.00');
                $("#txt_docentry").val(docentry);
                $("#txt_after_serial").val(serialno);

                update_info_payment(mydata[0], row);

                $("#table_payment_schedule >tbody >tr").remove();
                var index = 1;
                for (i = 0; i < mydata.length; i++) {
                    var x = mydata[i];

                    //Assign the price to Item 
                    ItemPrice = x.HouseAmount;

                    NewItemCode = x.NewItemCode;
                    NewItemName = x.NewItemName;
                    BuybackAmt = x.BuybackAmt;
                    GeneratedARAmt = x.GeneratedARAmt;
                    OutstandingAmt = x.OutstandingAmt;
                    VarianAmt = x.VarianAmt;
                    SerialNumber = x.DistNumber;

                    var data = "<tr id='tr_payment_" + index + "'>";
                    data = data + "<td><i class='fa fa-fw fa-remove' id='tr_payment_detail_remove_line_" + index + "'  style='cursor:pointer;display:none;' onclick='cmd_tr_payment_detail_remove_line(" + index + ")'></i></td>";
                    if (x.Status.trim() == "O") {
                        data = data + "<td><input type='checkbox' id='tr_payment_detail_checkbox_remove_line_" + index + "' style='cursor:pointer;' onclick='checkbox_tr_payment_detail(" + index + ")'></td>";
                    } else {
                        data = data + "<td><input type='checkbox' id='tr_payment_detail_checkbox_remove_line_" + index + "' style='cursor:not-allowed;' disabled></td>";
                    }
                    data = data + "<td style='text-align:Left;'>" + index + "</td>";


                    let isOpen = x.Status.trim() === "O";

                    data += "<td style='text-align:Left; color:blue'>" +
                        "<div class='form-group'>" +
                        "<div class='input-group date'>" +
                        "<input type='text' style='text-align:Left; color:blue' class='form-control pull-right datetime form-control-insde' " +
                        "name='InstallmentDate_" + index + "' " +
                        "id='InstallmentDate_" + index + "' " +
                        "value='" + x.InstallmentDate + "' placeholder='Choose Date' " +
                        (isOpen ? "" : "disabled") + " />" +
                        "</div>" +
                        "</div>" +
                        "</td>";



                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_paymentdate_line_" + index + "'>" + x.DueDate + "</td>";
                    data = data + "<td style='text-align:left; vertical-align: middle;' id='tr_payment_detail_principle_line_" + index + "'>" + convert2digit(x.Principle) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_interest_line_" + index + "'>" + convert2digit(x.Interest) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_monthlypay_line_" + index + "'>" + convert2digit(x.MonthlyPay) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamt_line_" + index + "'>" + convert2digit(x.RemainingAmt) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_remainingamtandinterest_line_" + index + "'>" + convert2digit(parseFloat(x.RemainingAmt) + parseFloat(x.Interest)) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupayment_line_" + index + "'>" + convert2digit(x.CuPayment) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_culnterest_line_" + index + "'>" + convert2digit(x.CuInterest) + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle;' id='tr_payment_detail_cupaymentandculnterest_line_" + index + "'>" + convert2digit(parseFloat(x.CuPayment) + parseFloat(x.CuInterest)) + "</td>";

                    data += "<td style='text-align:left; vertical-align:middle;' id='tr_payment_detail_method_line_" + index + "'>";
                    data += "<div class='form-group'>";
                    data += "<select class='form-control' style='width:100%; color:blue' id='select_method_" + index + "' " + (isOpen ? "" : "disabled") + ">";

                    for (let i = 0; i < methodOptions.length; i++) {
                        const opt = methodOptions[i];
                        const selected = (opt.code === x.HouseStatus) ? "selected" : "";
                        data += "<option value='" + opt.code + "' " + selected + ">" + opt.code + " - " + opt.name + "</option>";
                    }

                    data += "</select>";
                    data += "</div>";
                    data += "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arno_line_" + index + "'>" + x.ARNo + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentno_line_" + index + "'>" + x.PaymentNo + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_arnointerest_line_" + index + "'>" + x.ARNoInterest + "</td>";
                    data = data + "<td style='text-align:Left; vertical-align: middle; color:red' id='tr_payment_detail_paymentnointerest_line_" + index + "'>" + x.PaymentNoInterest + "</td>";

                    data = data + "<td " +
                        (isOpen ? "contenteditable='true'" : "") +
                        " style='text-align:Left; vertical-align: middle; color:blue' " +
                        "id='tr_payment_detail_remarks_line_" + index + "'>" + x.Remarks + "</td>";

                    data = data + "<td style='display:none;' id='tr_payment_detail_status_line_" + index + "'>" + x.Status.trim() + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemcode_line_" + index + "'>" + x.ItemCode + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_itemname_line_" + index + "'>" + x.ItemName + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_rowno_line_" + index + "'>" + x.RowNo + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_accamt_line_" + index + "'>" + convert2digit(x.AccAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_period_line_" + index + "'>" + convert2digit(x.U_Period) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_annulrate_line_" + index + "'>" + convert2digit(x.U_AnnulRate) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_depositamt_line_" + index + "'>" + convert2digit(x.DepositAmt) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseentry_line_" + index + "'>" + docentry + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_baseline_line_" + index + "'>" + linenum + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_fixedpayment_line_" + index + "'>" + convert2digit(x.FixedPayment) + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_housestatus_line_" + index + "'>" + x.HouseStatus + "</td>";
                    data = data + "<td style='display:none;' id='tr_payment_detail_installmentid_line_" + index + "'>" + x.ID + "</td>";
                    data = data + "</tr>";
                    $("#table_payment_schedule >tbody").append(data);

                    totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue(x.Principle));
                    totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue(x.Interest));
                    totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue(x.MonthlyPay));

                    index++;
                }

                totalPrinciple = parseFloat(returnstringvalue(totalPrinciple)) + parseFloat(returnstringvalue($("#txt_total_principle").text()));
                $("#txt_total_principle").text(convert2digit(totalPrinciple));
                totalInterest = parseFloat(returnstringvalue(totalInterest)) + parseFloat(returnstringvalue($("#txt_total_interest").text()));
                $("#txt_total_interest").text(convert2digit(totalInterest));
                totalMonthlyPay = parseFloat(returnstringvalue(totalMonthlyPay)) + parseFloat(returnstringvalue($("#txt_total_monthly").text()));
                $("#txt_total_monthly").text(convert2digit(totalMonthlyPay));

                var remainingAmt = parseFloat(ItemPrice) - parseFloat(totalPrinciple);

                $("#txt_before_discount_amount").val(convert2digit(ItemPrice));
                $("#txt_after_discount").val(convert2digit(ItemPrice));

                if (NewItemCode !== "") {
                    $("#txt_item_code").val(NewItemCode);
                    $("#txt_item_name").val(NewItemName || "");
                }
                $("#txt_serial_no").val(SerialNumber);
                //$("#txt_item_name").val(NewItemName || "")

                $("#txt_remaining_amount").val(convert2digit(remainingAmt));
                $("#txt_installment_amount").val(convert2digit(remainingAmt))

                disable_enable_remove_by_line();
                set_date_of_payment();

                $("#modal-schedule-list").modal('hide');
                $("#txt_payment_schedule_selected_row").val("-1");
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}





function cmd_save_RestructurePeriod() {

    var remainingAmt = returnstringvalue($("#txt_remaining_amount").val());

    if ($("#table_payment_schedule >tbody >tr").length <= 0) {
        ShowAlertCus("No data to save!","danger");
    } else if (parseFloat(remainingAmt) < 0) {
        ShowAlertCus("Remaining amount less than zero!", "danger");
    } else {

        var docdate = $('#txt_doc_date').val();
        var installmentRow_List = [];
        var del_list = [];

        var head = {
            PostingDate: docdate,
            DocNumRef: $("#txt_ref_num").val(),
            Remark: $("#txt_remark").val(),
            RestructureOption: $("#cbo_option").val()
        };
        $("#table_payment_schedule >tbody >tr").each(function (index) {
            index++;
     
            var docdate = $('#tr_payment_detail_paymentdate_line_' + index).text().trim().split("-");
            var detail = {
                DocEntry: $("#tr_payment_detail_installmentid_line_" + index).text().trim(),
                VisOrder: (index - 1),
                BaseEntry: $("#tr_payment_detail_baseentry_line_" + index).text().trim(),
                BaseLine: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                InstallmentBaseID: $("#tr_payment_detail_installmentid_line_" + index).text().trim(),
                InstallmentBaseVisorder: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                ItemCode: $("#txt_item_code").val(),
                Principle: returnstringvalue($("#tr_payment_detail_principle_line_" + index).text().trim()),
                Interest: returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim()),
                Monthly: returnstringvalue($("#tr_payment_detail_monthlypay_line_" + index).text().trim()),
                PaymentDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
                DueDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
                Remaining: returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim()),
                ReIncloudInter: parseFloat(returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim())) + parseFloat(returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim())),
                RowStatus: $("#tr_payment_detail_status_line_" + index).text().trim(),
                CuInterest: returnstringvalue($("#tr_payment_detail_culnterest_line_" + index).text().trim()),
                CuPayment: returnstringvalue($("#tr_payment_detail_cupayment_line_" + index).text().trim()),
                FixedPayment: returnstringvalue($("#tr_payment_detail_fixedpayment_line_" + index).text().trim()),
                ARNo: $("#tr_payment_detail_arno_line_" + index).text().trim(),
                PaymentNo: $("#tr_payment_detail_paymentno_line_" + index).text().trim(),
                Method: $("#select_method_" + index).val(),
                InstallmentAmt: returnstringvalue($("#txt_before_discount_amount").val().trim()),
                DiscountAmt: "0.00",
                DepositAmt: returnstringvalue($("#tr_payment_detail_depositamt_line_" + index).text().trim()),
                AnnualRate: returnstringvalue($("#tr_payment_detail_annulrate_line_" + index).text().trim()),
                PeriodMonths: returnstringvalue($("#tr_payment_detail_period_line_" + index).text().trim()),
                HouseStatus: $("#tr_payment_detail_housestatus_line_" + index).text().trim(),
                Remarks: $("#tr_payment_detail_remarks_line_" + index).text().trim(),
                DiscountAmount: 0,
                DiscountPer: 0,
                SpecialDisAmount: 0,
                SpecialDisPer: 0,
                AdditionalDisAmount: 0,
                AdditionalDisPer: "0.00",
                ItemName: $("#txt_item_name").val(),
                OcrCode: $("#txt_ocrcode").val(),
                OcrCode2: $("#txt_ocrcode2").val(),
                OcrCode3: $("#txt_ocrcode3").val(),
                DrafStatus: "D",
                ARNoInterest: $("#tr_payment_detail_arnointerest_line_" + index).text().trim(),
                PaymentNoInterest: $("#tr_payment_detail_paymentnointerest_line_" + index).text().trim(),
            };
            installmentRow_List.push(detail);
            
        });

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/amendments/save_RestructurePeriod',
            data: JSON.stringify(
                {
                    'header': head,
                    'installment_row': installmentRow_List
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    ShowAlertCus("Payment Shcedule was saved", "success");
                    location.reload();
                    
                } else {
                    ShowAlertCus("Error while saving Shcedule!", "danger");
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}

function cmd_save_RestructureAmt() {

    var remainingAmt = returnstringvalue($("#txt_remaining_amount").val());

    if ($("#table_payment_schedule_restructureAmt >tbody >tr").length <= 0) {
        ShowAlertCus("No data to save!", "danger");
    } else if (parseFloat(remainingAmt) < 0) {
        ShowAlertCus("Remaining amount less than zero!", "danger");
    } else {

        var docdate = $('#txt_doc_date').val();
        var installmentRow_List = [];


        var head = {
            PostingDate: docdate,
            DocNumRef: $("#txt_ref_num").val(),
            Remark: $("#txt_remark").val(),
            RestructureOption: $("#cbo_option").val(),
            Rate: $("#txt_installment_rate").val(),
            PeriodM: $("#txt_period").val(),
            StartPayDate: $("#txt_start_payment").val(),
            MaturityDate: $("#txt_maturity_payment").val()
        };
        $("#table_payment_schedule_restructureAmt >tbody >tr").each(function (index) {
            index++;

            var docdate = $('#InstallmentDate_' + index).text().trim().split("-");
            var docduedate = $('#tr_payment_detail_paymentdate_line_' + index).text().trim().split("-");

            var detail = {
                DocEntry: $("#tr_payment_detail_installmentid_line_" + index).text().trim(),
                VisOrder: (index - 1),
                BaseEntry: $("#tr_payment_detail_baseentry_line_" + index).text().trim(),
                BaseLine: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                InstallmentBaseID: $("#tr_payment_detail_installmentid_line_" + index).text().trim(),
                InstallmentBaseVisorder: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                ItemCode: $("#txt_item_code").val(),
                Principle: returnstringvalue($("#tr_payment_detail_principle_line_" + index).text().trim()),
                Interest: returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim()),
                Monthly: returnstringvalue($("#tr_payment_detail_monthlypay_line_" + index).text().trim()),
                PaymentDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
                DueDate: docduedate[2] + "/" + docduedate[1] + "/" + docduedate[0],
                Remaining: returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim()),
                ReIncloudInter: parseFloat(returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim())) + parseFloat(returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim())),
                RowStatus: $("#tr_payment_detail_status_line_" + index).text().trim(),
                CuInterest: returnstringvalue($("#tr_payment_detail_culnterest_line_" + index).text().trim()),
                CuPayment: returnstringvalue($("#tr_payment_detail_cupayment_line_" + index).text().trim()),
                FixedPayment: returnstringvalue($("#tr_payment_detail_fixedpayment_line_" + index).text().trim()),
                ARNo: $("#tr_payment_detail_arno_line_" + index).text().trim(),
                PaymentNo: $("#tr_payment_detail_paymentno_line_" + index).text().trim(),
                Method: $("#tr_payment_detail_method_line_" + index).text().trim(),
                InstallmentAmt: returnstringvalue($("#txt_before_discount_amount").val().trim()),
                DiscountAmt: "0.00",
                DepositAmt: returnstringvalue($("#tr_payment_detail_depositamt_line_" + index).text().trim()),
                AnnualRate: returnstringvalue($("#tr_payment_detail_annulrate_line_" + index).text().trim()),
                PeriodMonths: returnstringvalue($("#tr_payment_detail_period_line_" + index).text().trim()),
                HouseStatus: $("#tr_payment_detail_housestatus_line_" + index).text().trim(),
                Remarks: $("#tr_payment_detail_remarks_line_" + index).text().trim(),
                DiscountAmount: 0,
                DiscountPer: 0,
                SpecialDisAmount: 0,
                SpecialDisPer: 0,
                AdditionalDisAmount: 0,
                AdditionalDisPer: "0.00",
                ItemName: $("#txt_item_name").val(),
                OcrCode: $("#txt_ocrcode").val(),
                OcrCode2: $("#txt_ocrcode2").val(),
                OcrCode3: $("#txt_ocrcode3").val(),
                DrafStatus: "D",
                NewPaymentDate: $("#NewDate_" + index +"_display").val(),
                SpecialAmt: parseFloat($("#spe_amt_" + index).val()) || 0,
                RemaingOld: parseFloat($("#remaining_old_" + index).val()) || 0,
                InterestonSchedule: parseFloat($("#interest_schedule_" + index).val()) || 0
            };
            installmentRow_List.push(detail);

        });

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/amendments/save_RestructureAmt',
            data: JSON.stringify(
                {
                    'header': head,
                    'installment_row': installmentRow_List
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    ShowAlertCus("Payment Shcedule was saved", "success");
                    location.reload();
                    
                } else {
                    ShowAlertCus("Error while saving Shcedule!", "danger");
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}

function cmd_save_approval_Restructure(Type) {

    var head = {
        DocEntry: $("#txt_draf_ID").val(),
        Comment: $("#txt_approverComment").val(),
        DocStatus: Type
    };
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/amendments/save_approval_RestructureDraf',
        data: JSON.stringify(
            {
                'header': head
            }),
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status === "OK") {
                ShowAlertCus("Update Record was saved", "success");

                setTimeout(function () {
                    window.location.href = "/amendments/RestructureApporovalListing";
                }, 1500); // Wait 1.5 seconds before redirect
            } else {
                ShowAlertCus("Error while saving", "danger");
            }
        },

        failure: function (response) {
            $('#result').html(response);
        }
    });

}

function cmd_save_approval_Reschedule(Type) {

    var head = {
        DocEntry: $("#txt_draf_ID").val(),
        Comment: $("#txt_approverComment").val(),
        DocStatus: Type
    };

    // Initialize array to hold row data
    var rows = [];

    $("#table_payment_schedule tbody tr").each(function (index) {
        var rowIndex = index + 1;

        // Get the values from the specific cells
        var visOrder = parseInt($("#tr_visorder_" + rowIndex).text()) || 0;
        var varianDay = parseInt($("#tr_payment_detail_varianday_line_" + rowIndex).text()) || 0;
        var interestAmt = parseFloat(
            $("#tr_payment_detail_interestonscheduleamt_line_" + rowIndex).text().replace(/,/g, '')
        ) || 0;

        // Push an object for this row
        rows.push({
            VisOrder: visOrder-1,
            VarianDay: varianDay,
            InterestonsheduleVarian: interestAmt
        });
    });

    console.log(rows);

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/amendments/save_approval_Reschedule',
        data: JSON.stringify(
            {
                header: head,      // existing header object
                details: rows      // the array we just generated from the table
            }),
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status === "OK") {
                ShowAlertCus("Update Record was saved", "success");

                setTimeout(function () {
                    window.location.href = "/amendments/RescheduleApporovalListing";
                }, 1500); // Wait 1.5 seconds before redirect
            } else {
                ShowAlertCus("Error while saving", "danger");
            }
        },

        failure: function (response) {
            $('#result').html(response);
        }
    });

}

function cmd_save_approval_Loan(Type) {

    var head = {
        DocEntry: $("#txt_draf_ID").val(),
        Comment: $("#txt_approverComment").val(),
        DocStatus: Type
    };
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/sales/save_approval_loan',
        data: JSON.stringify(
            {
                'header': head
            }),
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status === "OK") {
                ShowAlertCus("Update Record was saved", "success");

                setTimeout(function () {
                    window.location.href = "/sales/LoanInstallmentApprovalListing";
                }, 1500); // Wait 1.5 seconds before redirect
            } else {
                ShowAlertCus("Error while saving", "danger");
            }
        },

        failure: function (response) {
            $('#result').html(response);
        }
    });
}
function cmd_save_approval_Reprocessing(Type) {

    var head = {
        DocEntry: $("#txt_draf_ID").val(),
        Comment: $("#txt_approverComment").val(),
        DocStatus: Type
    };
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/sales/save_approval_Reprocessing',
        data: JSON.stringify(
            {
                'header': head
            }),
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status === "OK") {
                ShowAlertCus("Update Record was saved", "success");

                setTimeout(function () {
                    window.location.href = "/amendments/ResprocessingApporovalListing";
                }, 1500); // Wait 1.5 seconds before redirect
            } else {
                ShowAlertCus("Error while saving", "danger");
            }
        },

        failure: function (response) {
            $('#result').html(response);
        }
    });

}

function cmd_save_change_item() {

    var remainingAmt = returnstringvalue($("#txt_remaining_amount").val());

    if ($("#table_payment_schedule >tbody >tr").length <= 0) {
        ShowAlertCus("No data change Item to save!", "warning");
    } else if (parseFloat(remainingAmt) != 0) {
        ShowAlertCus("Remaining amount must Zero!", "warning");
    } else {
        var docdate = $('#txt_doc_date').val().trim().split("-");
        var reqdate = $('#txt_due_date').val().trim().split("-");
        var installmentRow_List = [];
        var del_list = [];
        var befDis = returnstringvalue($("#txt_after_discount").val());
        var DisAmt = 0;
        var disPer = 0;
        var head = {

            PostingDate: $("#txt_doc_date").val(),
            DeliveryDate: $("#txt_due_date").val(),
            StartPayDate: $("#txt_start_payment").val(),
            MaturityDate: $("#txt_maturity_payment").val(),

            CardCode: $("#txt_card_code").val(),
            CardName: $("#txt_card_name").val(),
            DocNumRef: $("#txt_doc_num").val(),

            OldItemCode: $("#txt_old_house_code").val(),
            OldSerial: $("#txt_oldserial").val(),
            OldItemName: $("#txt_old_item_name").val(),
            ChangeRef: $("#txt_changeitem_ref").val(),
            NewItemCode: $("#txt_item_code").val(),
            NewItemName: $("#txt_item_name").val(),
            NewSerial: $("#txt_new_serail").val(),


            OldAR: returnstringvalue($("#txt_oldafter_discount").val()),
            NewAR: returnstringvalue($("#txt_before_discount_amount").val()),
            GeneratedAR: returnstringvalue($("#txt_generated_ar_amt").val()),
            OutstandingAmt: returnstringvalue($("#txt_outstanding_amount").val()),
            InstallmentAmt: returnstringvalue($("#txt_installment_amount").val()),
            BuyBackAmt: returnstringvalue($("#txt_buyback_amt").val()),
            VarainAmt: returnstringvalue($("#txt_varian_amount").val()),
            Remark: $("#txt_reamark").val()
        };
        $("#table_payment_schedule >tbody >tr").each(function (index) {
            index++;

            var docdate = $('#tr_payment_detail_paymentdate_line_' + index).text().trim().split("-");
            var detail = {
                ID: $("#tr_payment_detail_installmentid_line_" + index).text().trim(),
                BaseEntry: $("#tr_payment_detail_baseentry_line_" + index).text().trim(),
                BaseLine: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                VisOrder: (index - 1),
                ItemCode: $("#txt_item_code").val(),
                Principle: returnstringvalue($("#tr_payment_detail_principle_line_" + index).text().trim()),
                Interest: returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim()),
                Monthly: returnstringvalue($("#tr_payment_detail_monthlypay_line_" + index).text().trim()),
                PaymentDate: $("#InstallmentDate_" + index).val(),
                DueDate: $("#tr_payment_detail_paymentdate_line_" + index).text(),
                Remaining: returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim()),
                ReIncloudInter: parseFloat(returnstringvalue($("#tr_payment_detail_remainingamt_line_" + index).text().trim())) + parseFloat(returnstringvalue($("#tr_payment_detail_interest_line_" + index).text().trim())),
                RowStatus: $("#tr_payment_detail_status_line_" + index).text().trim(),
                CuInterest: returnstringvalue($("#tr_payment_detail_culnterest_line_" + index).text().trim()),
                CuPayment: returnstringvalue($("#tr_payment_detail_cupayment_line_" + index).text().trim()),
                FixedPayment: returnstringvalue($("#tr_payment_detail_fixedpayment_line_" + index).text().trim()),
                ARNo: $("#tr_payment_detail_arno_line_" + index).text().trim(),
                PaymentNo: $("#tr_payment_detail_paymentno_line_" + index).text().trim(),
                ARNoInterest: $("#tr_payment_detail_arnointerest_line_" + index).text().trim(),
                PaymentNoInterest: $("#tr_payment_detail_paymentnointerest_line_" + index).text().trim(),
                InstallmentBaseID: $("#tr_payment_detail_baseentry_line_" + index).text().trim(),
                InstallmentBaseVisorder: $("#tr_payment_detail_baseline_line_" + index).text().trim(),
                Method: $("#select_method_" + index).val(),
                InstallmentAmt: returnstringvalue($("#txt_before_discount_amount").val().trim()),
                DiscountAmt: "0.00",
                DepositAmt: returnstringvalue($("#tr_payment_detail_depositamt_line_" + index).text().trim()),
                AnnualRate: returnstringvalue($("#tr_payment_detail_annulrate_line_" + index).text().trim()),
                PeriodMonths: returnstringvalue($("#tr_payment_detail_period_line_" + index).text().trim()),
                HouseStatus: $("#tr_payment_detail_housestatus_line_" + index).text().trim(),
                Remarks: $("#tr_payment_detail_remarks_line_" + index).text().trim(),
                DiscountAmount: 0,
                DiscountPer: 0,
                SpecialDisAmount: 0,
                SpecialDisPer: 0,
                AdditionalDisAmount: "0.00",
                AdditionalDisPer: "0.00",
                ItemName: $("#txt_item_name").val(),
                OcrCode: $("#txt_ocrcode").val(),
                OcrCode2: $("#tr_payment_detail_serial_line_" + index).text().trim(),
                OcrCode3: $("#txt_ocrcode3").val()
            };
            installmentRow_List.push(detail);

        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/amendments/save_change_Item',
            data: JSON.stringify(
                {
                    'header': head,
                    'installment_row': installmentRow_List
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    ShowAlertCus("Record was saved", "success");
                    location.reload();

                } else {
                    ShowAlertCus("Error while saving record!", "warning");
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}

function cmd_save_approval_ChangeItem(Type) {

    var head = {
        DocEntry: $("#txt_draf_ID").val(),
        Comment: $("#txt_approverComment").val(),
        DocStatus: Type
    };
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/amendments/save_approval_ChangeItemDraf',
        data: JSON.stringify(
            {
                'header': head
            }),
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status === "OK") {
                ShowAlertCus("Update Record was saved", "success");

                setTimeout(function () {
                    window.location.href = "/amendments/ChangeproductApporovalListing";
                }, 1500); // Wait 1.5 seconds before redirect
            } else {
                ShowAlertCus("Error while saving", "danger");
            }
        },

        failure: function (response) {
            $('#result').html(response);
        }
    });

}

function cmd_save_approval_InterestWizard(Type) {

    var head = {
        DocEntry: $("#txt_draf_ID").val(),
        Comment: $("#txt_approverComment").val(),
        DocStatus: Type
    };
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/sales/save_approval_interestWizard',
        data: JSON.stringify(
            {
                'header': head
            }),
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status === "OK") {
                ShowAlertCus("Update Record was saved", "success");

                setTimeout(function () {
                    window.location.href = "/sales/InterestWizardApprovalListing";
                }, 1500); // Wait 1.5 seconds before redirect
            } else {
                ShowAlertCus("Error while saving", "danger");
            }
        },

        failure: function (response) {
            $('#result').html(response);
        }
    });
}