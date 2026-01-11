var list = [];
var dellist = [];
var batchlist = [];
var allow = 0;
var lineno = 0;
var options = "";
//Bin
function cmd_pq_line_summary_bin_by_item_click(summaryid) {
    var whscode = $("#txt_pq_line_summary_whs_" + summaryid).val();
    var whsname = $("#txt_pq_line_summary_whs_" + summaryid).find(":selected").text();
    $("#modal-bin_list").modal('show');
    var found = 0;
    $("#table_pop_whs_bin >tbody >tr").each(function () {
        if ($(this).find("td:eq(3) input[type='text']").val() == whscode) {
            found = 1;
            return false;
        }
    });

    if (found == 0) {
        $("#table_bin > tbody > tr").each(function () {
            if ($(this).find("td:eq(3)").text() == whscode) {
                var binentry = $(this).find("td:eq(0)").text();
                var bincode = $(this).find("td:eq(1)").text();
                var tr = "<tr>";
                tr = tr + "<td style='display:none'>" + summaryid + "</td>";
                tr = tr + "<td style='display:none'>new</td>";
                tr = tr + "<td style='display:none'><input type='text' readonly='readonly' value='" + binentry + "'></td>";
                tr = tr + "<td id='td_pop_batch_item_code'><input type='text' class='form-control form-control-insde' readonly='readonly' placeholder='Item Code' value='" + whscode + "'></td>";
                tr = tr + "<td id='td_pop_batch_item_code'><input type='text' class='form-control form-control-insde' readonly='readonly' placeholder='Description' value='" + whsname + "'></td>";
                tr = tr + "<td id='td_pop_batch_item_code'><input type='text' class='form-control form-control-insde' readonly='readonly' placeholder='Description' value='" + bincode + "'></td>";
                tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' placeholder='Quantity' onchange='pop_bin_quantity_change(" + summaryid + ")' value='0.00'></div></td>";
                tr = tr + "</tr>";
                $("#table_pop_whs_bin >tbody").append(tr);
            }
            else {
                $(this).hide();
            }
        });
    }
    //else {
    //    $("#table_pop_whs_bin >tbody >tr").each(function () {
    //        if ($(this).find("td:eq(3) input[type='text']").val() == whscode) {
    //            $(this).show();
    //        }
    //        else {
    //            $(this).hide();
    //        }
    //    });
    //}
}
function pop_bin_quantity_change(summaryid) {
    $("#table_pop_whs_bin >tbody >tr").each(function (index, tr) {
        if ($(this).find("td:eq(0)").text() == summaryid) {
            var qty = $(this).find("td:eq(6) input[type='text']").val();
            if (qty != "") {
                $(this).find("td:eq(6) input[type='text']").val(convert2digit(qty));
            }
        }
    });
}
function cmd_pop_update_bin() {
    $("#table_pop_whs_bin >tbody >tr").each(function (index, tr) {
        $(this).find("td:eq(1)").text("Updated");
    });
    $("#modal-bin_list").modal('hide');
}
//batch
function pop_quantity_change(summaryid) {
    $("#table_pop_item_batch >tbody >tr").each(function (index, tr) {
        if ($(this).find("td:eq(0)").text() == summaryid) {
            var qty = $(this).find("td:eq(5) input[type='text']").val();
            if (qty != "") {
                $(this).find("td:eq(5) input[type='text']").val(convert2digit(qty));
            }
        }
    });
}
function pop_batch_num_change(summaryid) {
    var itemcode = "";
    var itemname = "";
    var found = 1;
    $("#table_pop_item_batch >tbody >tr").each(function (index, tr) {
        if ($(this).find("td:eq(0)").text() == summaryid) {
            itemcode = $(this).find("td:eq(2) input[type='text']").val();
            itemname = $(this).find("td:eq(3) input[type='text']").val();
            if ($(this).find("td:eq(4) input[type='text']").val() == "") {
                found = 0;
            }
        }
    });
    if (found == 1) {
        pop_batch_new_row(summaryid, itemcode, itemname);
    }
}
function cmd_pop_update_batch() {
    var summaryid = $("#txt_pop_batch_summary_id").val();
    var found = 0;
    $("#table_pop_item_batch >tbody >tr").each(function (index, tr) {
        if ($(this).find("td:eq(0)").text() == summaryid) {
            if ($(this).find("td:eq(4) input[type='text']").val() == "") {
                found == 1;
            }
            else {
                if ($(this).find("td:eq(5) input[type='text']").val() == "") {
                    found == 2;
                }
            }
        }
    });
    if (found == 1) {
        ShowAlert("Batch Number is required");
    }
    if (found == 2) {
        ShowAlert("Batch Quantity is required");
    }
    if (found == 0) {
        $("#table_pop_item_batch >tbody >tr").each(function (index, tr) {
            if ($(this).find("td:eq(0)").text() == summaryid) {
                $(this).find("td:eq(1)").text("Updated");
            }
        });
        $("#modal-batch_list").modal('hide');
    }
}
function cmd_pop_cancel_batch() {
    var summaryid = $("#txt_pop_batch_summary_id").val();
    $("#table_pop_item_batch >tbody >tr").each(function (index, tr) {
        if ($(this).find("td:eq(0)").text() == summaryid) {
            if ($(this).find("td:eq(1)").text() == "new") {
                $(this).remove();
            }
        }
    });
}
function pop_batch_check_batch(summaryid) {
    $("#table_pop_item_batch >tbody >tr").each(function (index, tr) {
        if ($(this).find("td:eq(0)").text() == summaryid) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
        if ($(this).find("td:eq(4) input[type='text']").val() == "") {
            $(this).remove();
        }
    });
}
function cmd_pq_line_summary_manage_by_by_item_click(summaryid) {
    $("#modal-batch_list").modal('show');
    var itemcode = $("#td_pq_line_summary_item_code_" + summaryid).text();
    var itemname = $("#txt_pq_line_summary_item_name_" + summaryid).val();
    $("#txt_pop_batch_summary_id").val(summaryid);
    cmd_pop_cancel_batch();
    pop_batch_check_batch(summaryid);
    pop_batch_new_row(summaryid, itemcode, itemname);
}
function pop_batch_new_row(summaryid, itemcode, itemname) {
    var tr = "<tr>";
    tr = tr + "<td style='display:none'>" + summaryid + "</td>";
    tr = tr + "<td name='td_pop_batch_summary_id_status_" + summaryid + "' style='display:none'>new</td>";
    tr = tr + "<td id='td_pop_batch_item_code'><input type='text' class='form-control form-control-insde' readonly='readonly' placeholder='Item Code' value='" + itemcode + "'></td>";
    tr = tr + "<td id='td_pop_batch_item_code'><input type='text' class='form-control form-control-insde' readonly='readonly' placeholder='Description' value='" + itemname + "'></td>";
    tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' placeholder='Batch Num' onchange='pop_batch_num_change(" + summaryid + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' placeholder='Quantity' onchange='pop_quantity_change(" + summaryid + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' placeholder='Exp-Date'></div></div></td>";
    tr = tr + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' placeholder='Mfr-Date'></div></div></td>";
    tr = tr + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' placeholder='Admission-Date'></div></div></td>";
    tr = tr + "</tr>";
    $("#table_pop_item_batch >tbody").append(tr);
    $('.datetime').datepicker({
        autoclose: true,
        format: 'dd-mm-yyyy'
    });
}

function cmd_copy_from(type) {
    $("#modal-pr-list").modal('show');
    //if (type == 1) {
    //    $("#pop_pq_h5").text("Purchase Request Filter");
    //    $("#pop_search_pr_title").text("PR No");
    //    $("#pop_table_pr_title").text("PR No");
    //    $("#txt_pq_pop_filter_num").attr("placeholder", "PR No");
    //}
    //else {
    //    $("#pop_pq_h5").text("Purchase Quotation Filter");
    //    $("#pop_search_pr_title").text("PQ No");
    //    $("#pop_table_pr_title").text("PQ No");
    //    $("#txt_pq_pop_filter_num").attr("placeholder", "PQ No");
    //}
    //$("#txt_copy_from").val(type);
    $("#table_pq_pop_pr_list >tbody>tr").remove();
}

//Summary Change
function txt_pq_line_summary_combo_change(summaryindex, type) {
    var uom_detail = "";
    var summaryid = "";
    if (type == 1) {
        uom_detail = "pq_line_sub_uom_" + summaryindex;
        summaryid = "txt_pq_line_summary_uom_" + summaryindex;
    }
    if (type == 2) {
        uom_detail = "pq_line_sub_whs_" + summaryindex;
        summaryid = "txt_pq_line_summary_whs_" + summaryindex;
    }
    $("select[name=" + uom_detail + "]").empty();
    var opt = "";
    $("#" + summaryid + " > option").each(function () {
        if (this.value == $("#" + summaryid).val()) {
            opt = opt + "<option value='" + this.value + "' selected=selected>" + this.text + "</option>";
        }
        else {
            opt = opt + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });
    $("select[name=" + uom_detail + "]").append(opt);
}
function txt_pq_line_summary_txt_change(summaryindex, type) {
    var detail_name = "";
    var detail_name_total = "pq_line_sub_total_" + summaryindex;
    var summary_id = "";
    var summary_total = "txt_pq_line_summary_line_total_" + summaryindex;
    var summary_qty = 0;
    var summary_price = 0;
    if (type == 1) {
        detail_name = "pq_line_sub_qty_" + summaryindex;
        summary_id = "txt_pq_line_summary_qty_" + summaryindex;
    }
    if (type == 2) {
        detail_name = "pq_line_sub_price_" + summaryindex;
        summary_id = "txt_pq_line_summary_price_" + summaryindex;
    }
    var summary_val = $("#" + summary_id).val();
    $("#" + summary_id).val((type == 1 ? convert2digit(summary_val) : convert4digit(summary_val)));

    //Calculate for summary
    summary_qty = convert2digit($("#txt_pq_line_summary_qty_" + summaryindex).val());
    summary_price = convert4digit($("#txt_pq_line_summary_price_" + summaryindex).val());
    var total = parseFloat(summary_qty) * parseFloat(summary_price);
    $("#txt_pq_line_summary_line_total_" + summaryindex).val(convert2digit(total));

    //calculate and update for detail
    $("input[name=" + detail_name + "]").val((type == 1 ? convert2digit(summary_val) : convert4digit(summary_val)));
    recalculate_price_last_total(detail_name, summaryindex, type);

}
function recalculate_price_last_total(detail_name, summaryindex, type) {

    var detail_index = 0;
    var str = "0";
    detail_name = "pq_line_sub_net_price_name_" + summaryindex;
    var count_sub = $("input[name=" + detail_name + "]").length;
    var amount_after_4digit = 0;
    var countlastrow = 0;
    $("input[name=" + detail_name + "]").each(function () {
        //alert($(this).attr('id'));
        countlastrow++;
        detail_index = $(this).attr('id').replace("txt_pq_line_sub_netprice_", "");
        var sub_qty = $("#txt_pq_line_sub_qty_" + detail_index).val();
        var sub_price = $("#txt_pq_line_sub_boq_price_" + detail_index).val();
        var sub_total = parseFloat(returnstringvalue(sub_qty)) * parseFloat(returnstringvalue(sub_price));

        $("#txt_pq_line_sub_netprice_" + detail_index).val(convert2digit(sub_total));

        str = returnstringvalue(convert2digit(sub_total)).toString();
        total2digit = str.slice(0, str.indexOf(".") + 3);

        $("#txt_pq_line_sub_boq_linetotal_" + detail_index).val(convert2digit(total2digit));
        amount_after_4digit = parseFloat(amount_after_4digit) + parseFloat("0.00" + str.slice(str.indexOf(".") + 3, str.length));
        if (count_sub == countlastrow) {
            total2digit = parseFloat(total2digit) + parseFloat(amount_after_4digit);
            $("#txt_pq_line_sub_boq_linetotal_" + detail_index).val(convert2digit(total2digit));
        }
    });
    if (type == 2) {
        var sumnetprice = 0;
        var headqty = $("#txt_pq_line_summary_qty_" + summaryindex).val();
        var sub_netpricename = "pq_line_sub_net_price_name_" + summaryindex;
        $("input[name=" + sub_netpricename + "]").each(function () {
            sumnetprice = sumnetprice + parseFloat(returnstringvalue($(this).val()));
        });
        var newavgprice = 0;
        newavgprice = sumnetprice / headqty;
        $("#txt_pq_line_summary_price_" + summaryindex).val(convert4digit(newavgprice));
    }
    var sub_line_total_name = "pq_line_sub_total_" + summaryindex;
    amount_after_4digit = 0.00;
    $("input[name=" + sub_line_total_name + "]").each(function () {
        amount_after_4digit = amount_after_4digit + parseFloat(returnstringvalue($(this).val()));
    });

    $("#txt_pq_line_summary_line_total_" + summaryindex).val(convert2digit(amount_after_4digit));

}
function cmd_pq_line_remove_summary(summaryindex) {
    var detail = "tr_pq_sub_" + summaryindex;
    $("#tr_pq_" + summaryindex).remove();
    $("[name=" + detail + "]").remove();

}
//Detail Change
function line_pq_detail_change(id, summaryid, type) {
    var detail_qty = convert2digit($("#txt_pq_line_sub_qty_" + id).val());
    var detail_price = convert4digit($("#txt_pq_line_sub_boq_price_" + id).val())
    var detail_name = "";
    if (type == 1) {
        $("#txt_pq_line_sub_qty_" + id).val(convert2digit(detail_qty));
        detail_name = "pq_line_sub_qty_" + summaryid;
    }
    if (type == 2) {
        $("#txt_pq_line_sub_boq_price_" + id).val(convert4digit(detail_price));
        detail_name = "pq_line_sub_price_" + summaryid;
    }
    recalculate_price_last_total(detail_name, summaryid, type);
}
function cmd_pq_line_remove_detail(id, headerindex) {
    $("#tr_pq_detail_" + id).remove();
    sum_detail_by_header_id(headerindex);
}
function sum_detail_by_header_id(headerid) {
    var namedetail = "pq_line_sub_qty_" + headerid;
    var sumQty = 0;
    $("input[name=" + namedetail + "]").each(function () {
        sumQty = sumQty + parseFloat(returnstringvalue($(this).val()));
    });
    $("#txt_pq_line_summary_qty_" + headerid).val(convert2digit(sumQty));
    recalculate_price_last_total(namedetail, headerid, 2);
}
function cmd_pq_copy_from() {
    $("#modal-pr-list").modal('show');
    cmd_pq_filter_pop_up_uncheck_all();
}
function cmd_pq_filter_pop_up_check_all() {
    $('input:checkbox[name="chk"]').prop('checked', true);
    $("#th_check").hide();
    $("#th_uncheck").show();
}
function cmd_pq_filter_pop_up_uncheck_all() {
    $('input:checkbox[name="chk"]').prop('checked', false);
    $("#th_uncheck").hide();
    $("#th_check").show();
}
function cmd_pq_line_show_detail(rowindex) {
    var detail = "tr_pq_sub_" + rowindex;
    if ($("#td_pq_summary_" + rowindex).text() == "H") {
        $("[name=" + detail + "]").show();
        $("#td_pq_summary_" + rowindex).text("S");
    }
    else {
        $("[name=" + detail + "]").hide();
        $("#td_pq_summary_" + rowindex).text("H");
    }
}
function cmd_pq_choose_pr() {
    var whs = "";
    $("#cbo_pq_whs > option").each(function () {
        whs = whs + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    var rowindex = $("#table_pq_line >tbody >tr").length;
    if (typeof ($("#table_pq_line >tbody").find("tr:last").attr("id")) == "undefined") {
        rowindex = 0;
    }
    else {
        var newrow = $("#table_pq_line >tbody").find("tr:last").attr("id").replace("tr_", "");
        rowindex = parseInt(newrow) + 1;
    }
    var list_distinct_item = [];
    var list_item = [];
    var list_selected_item = [];

    $("#table_pq_pop_pr_list > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id;
            list_item.push($("#td_pq_pop_base_item_code_" + id).text());
            var d = {
                DefBinEntry: $("#td_pq_pop_base_enabled_bin_" + id).text(),
                EnabledBin: $("#td_pq_pop_base_def_bin_entry_" + id).text(),
                BaseEntry: $("#td_pq_pop_base_entry_" + id).text(),
                BaseLine: $("#td_pq_pop_base_line_num_" + id).text(),
                BaseType: "PR",
                GlobalCode: $("#td_pq_pop_base_global_code_" + id).text(),
                ItemCode: $("#td_pq_pop_base_item_code_" + id).text(),
                ManageBy: $("#td_pq_pop_base_item_manage_by_" + id).text(),
                ItemName: $("#td_pq_pop_base_item_name_" + id).text(),
                Quantity: $("#td_pq_pop_base_qty_" + id).text(),
                WhsCode: $("#td_pq_pop_base_whs_code_" + id).text(),
                UoMEntry: $("#td_pq_pop_base_uom_code_" + id).text(),
                UgpEntry: $("#td_pq_pop_base_ugpentry_" + id).text(),
                OcrCode: $("#td_pq_pop_base_ocrcode_code_" + id).text(),
                OcrCodeName: $("#td_pq_pop_base_ocrcode_name_" + id).text(),

                OcrCode2: $("#td_pq_pop_base_ocrcode2_code_" + id).text(),
                OcrCode2Name: $("#td_pq_pop_base_ocrcode2_name_" + id).text(),

                OcrCode3: $("#td_pq_pop_base_ocrcode3_code_" + id).text(),
                OcrCode3Name: $("#td_pq_pop_base_ocrcode3name_" + id).text(),

                MainworkCode: $("#td_pq_pop_base_main_code_0" + id).text(),
                MainWorkName: $("#td_pq_pop_base_mainworkname_" + id).text(),

                SubWorkCode: $("#td_pq_pop_base_sub_code_0" + id).text(),
                SubWorkName: $("#td_pq_pop_base_subworkname_" + id).text(),

                DetailWorkCode: $("#td_pq_pop_base_detail_code_" + id).text(),
                DetailName: $("#td_pq_pop_base_detailworkname_" + id).text(),

                FloorWorkCode: $("#td_pq_pop_base_floor_code_" + id).text(),
                FloorName: $("#td_pq_pop_base_floorworkname_" + id).text()

                //IsBOQ: $("#tr_" + id).find("td:eq(1)").text(),
                //BOQType: $("#tr_" + id).find("td:eq(1)").text(),

            };
            list_selected_item.push(d);
        }
    });
    var list_distinct_item = list_item.filter(function (item, i, list_item) {
        return i == list_item.indexOf(item);
    });
    var headerrowindex = 0;
    $('#table_pq_line > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(0)").text() == "Header") {
            headerrowindex = $(this).attr("id").replace("tr_pq_summary_", "");
        }
    });
    headerrowindex++;
    var counthouse = 0;
    var itemname = "";
    var detailrowindex = 0;
    var housename = "";
    var itemcode = "";
    var whsline = "";
    var uomline = "";
    var uomsummary = "";
    var total_sub_qty = 0;
    var baseqty = 0;
    var manageby = "";
    var enablebin = "";
    var defwhs = "";
    for (i = 0; i < list_distinct_item.length; i++) {
        detailrowindex = 1;
        total_sub_qty = 0;
        whsline = "";
        uomline = "";
        uomsummary = "";
        defwhs = "";
        var data = "<tr id='tr_pq_" + headerrowindex + "' class='header-color'>";
        data = data + "<td style='display:none' id='td_pq_line_summary_line_num_" + headerrowindex + "'>" + headerrowindex + "</td>";
        data = data + "<td style='display:none' id='td_pq_line_summary_item_code_" + headerrowindex + "'></td>";
        data = data + "<td style='display:none'>Header</td>";
        data = data + "<td style='display:none' id='td_pq_summary_" + headerrowindex + "'>H</td>";
        data = data + "<td><i class='fa fa-plus text-info' onclick='cmd_pq_line_show_detail(" + headerrowindex + ")' style='cursor:pointer'></i></td>";
        data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_pq_line_remove_summary(" + headerrowindex + ")'></i></td>";
        data = data + "<td colspan='2'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_pq_line_summary_item_name_" + headerrowindex + "' placeholder='Description' readonly='readonly' value=''></div></td>";
        data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_pq_line_summary_qty_" + headerrowindex + "' onchange='txt_pq_line_summary_txt_change(" + headerrowindex + ",1)' placeholder='Quantity' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><button type='button' class='btn btn-default btn-flat header-color' id='btn_pq_line_summary_manage_by_" + headerrowindex + "' onclick='cmd_pq_line_summary_manage_by_by_item_click(" + headerrowindex + ")'>...</button></div></td>";
        data = data + "<td><div class='form-group'><select class='form-control form-control-insde header-color' id='txt_pq_line_summary_uom_" + headerrowindex + "' name='summary_uom' onchange='txt_pq_line_summary_combo_change(" + headerrowindex + ",1)'></select></div></td > ";
        data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_pq_line_summary_price_" + headerrowindex + "'  onchange='txt_pq_line_summary_txt_change(" + headerrowindex + ",2)' placeholder='Price' value='0.0000'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_pq_line_summary_line_total_" + headerrowindex + "' placeholder='Total' readonly='readonly' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><select class='form-control form-control-insde header-color' id='txt_pq_line_summary_whs_" + headerrowindex + "' name='summary_whs' onchange='txt_pq_line_summary_combo_change(" + headerrowindex + ",2)'>" + whs + "</select></div></td > ";
        data = data + "<td><div class='form-group'><button type='button' class='btn btn-default btn-flat header-color' id='btn_pq_line_summary_bin_" + headerrowindex + "' onclick='cmd_pq_line_summary_bin_by_item_click(" + headerrowindex + ")'>...</button></div></td>";
        data = data + "<td colspan='6'></td>";
        data = data + "</tr>";
        $.each(list_selected_item, function (key, value) {
            uomline = "";
            baseqty = 0;
            whsline = "";
            enablebin = "";
            if (value.ItemCode == list_distinct_item[i]) {
                //$("#cbo_pq_whs > option").each(function () {
                //    if (this.value == value.WhsCode) {
                //        whsline = whsline + "<option value='" + this.value + "' selected=selected>" + this.text + "</option>";
                //    }
                //    else {
                //        whsline = whsline + "<option value='" + this.value + "'>" + this.text + "</option>";
                //    }
                //});
                $("#table_whs > tbody >tr").each(function (whsindex) {
                    if ($("#td_whs_whs_code_" + whsindex).text() == value.WhsCode) {
                        whsline = whsline + "<option value='" + $("#td_whs_whs_code_" + whsindex).text() + "' selected=selected>" + $("#td_whs_whs_name_" + whsindex).text() + "</option>";
                        if (enablebin == "") {
                            enablebin = $("#td_whs_enabled_" + whsindex).text();
                        }
                        defwhs = $("#td_whs_whs_code_" + whsindex).text();
                    }
                    else {
                        whsline = whsline + "<option value='" + $("#td_whs_whs_code_" + whsindex).text() + "'>" + $("#td_whs_whs_name_" + whsindex).text() + "</option>";
                        if (enablebin == "") {
                            enablebin = "";
                        }
                    }
                });
                $('#table_uom_group > tbody  > tr').each(function (index, tr) {
                    if ($(this).find("td:eq(0)").text() == value.UgpEntry) {
                        if ($(this).find("td:eq(1)").text() == value.UoMEntry) {
                            uomline = uomline + "<option value='" + $(this).find("td:eq(1)").text() + "' selected=selected>" + $(this).find("td:eq(2)").text() + "</option>";
                            baseqty = returnstringvalue($(this).find("td:eq(4)").text());

                        }
                        else {
                            uomline = uomline + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                    }
                });
                uomsummary = uomline;
                total_sub_qty = total_sub_qty + parseFloat(returnstringvalue(value.Quantity));
                data = data + "<tr style='display:none' name='tr_pq_sub_" + headerrowindex + "' id='tr_pq_detail_" + headerrowindex + "" + detailrowindex + "'>";
                data = data + "<td style='display:none' id='td_pq_line_baseentry_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseEntry + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_baseline_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseLine + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_basetype_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseType + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_globalcode_" + headerrowindex + "" + detailrowindex + "'>" + value.GlobalCode + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_itemcode_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemCode + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_ugpentry_" + headerrowindex + "" + detailrowindex + "'>" + value.UgpEntry + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_baseqty_" + headerrowindex + "" + detailrowindex + "'>" + baseqty + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_ocrcode_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_ocrcode2_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode2 + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_ocrcode3_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode3 + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_mainwork_" + headerrowindex + "" + detailrowindex + "'>" + value.MainworkCode + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_subwork_" + headerrowindex + "" + detailrowindex + "'>" + value.SubWorkCode + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_detailwork_" + headerrowindex + "" + detailrowindex + "'>" + value.DetailWorkCode + "</td>"
                data = data + "<td style='display:none' id='td_pq_line_floorwork_" + headerrowindex + "" + detailrowindex + "'>" + value.FloorWorkCode + "</td>"
                data = data + "<td style='display:none' ><input type='text' name='pq_line_sub_net_price_name_" + headerrowindex + "' id='txt_pq_line_sub_netprice_" + headerrowindex + "" + detailrowindex + "' ></td>";
                data = data + "<td></td>";
                data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_pq_line_remove_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></i></td>"
                data = data + "<td colspan='2'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='Quantity' name='pq_line_sub_qty_" + headerrowindex + "' id='txt_pq_line_sub_qty_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Quantity) + "' onchange='line_pq_detail_change(" + headerrowindex + "" + detailrowindex + ", " + headerrowindex + ",1)'></div></td>";
                if (value.ManageBy != "N") {
                    data = data + "<td><div class='form-group'><button type='button' class='btn btn-default btn-flat'>...</button></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'></div></td>";
                }
                data = data + "<td><div class='form-group'><select class='form-control form-control-insde ' name='pq_line_sub_uom_" + headerrowindex + "' id='txt_pq_line_sub_uom_" + headerrowindex + "" + detailrowindex + "'>" + uomline + "</select></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='Price' name='pq_line_sub_price_" + headerrowindex + "' id='txt_pq_line_sub_boq_price_" + headerrowindex + "" + detailrowindex + "' onchange='line_pq_detail_change(" + headerrowindex + "" + detailrowindex + ", " + headerrowindex + ",2)' value='0.0000'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='Total' name='pq_line_sub_total_" + headerrowindex + "' readonly='readonly' id='txt_pq_line_sub_boq_linetotal_" + headerrowindex + "" + detailrowindex + "' value='0.00'></div></td>";
                data = data + "<td><div class='form-group'><select class='form-control form-control-insde ' name='pq_line_sub_whs_" + headerrowindex + "' name='whs'>" + whsline + "</select></div></td>";
                if (value.EnabledBin == "Y") {
                    data = data + "<td><div class='form-group'><button type='button' class='btn btn-default btn-flat' id='btn_pq_line_summary_bin_" + headerrowindex + "' onclick='cmd_pq_line_summary_bin_by_item_click(" + headerrowindex + ")'>...</button></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'></div></td>";
                }
                data = data + "<td>" + value.OcrCodeName + "</td>";
                data = data + "<td>" + value.OcrCode2Name + "</td>";
                data = data + "<td>" + value.MainWorkName + "</td>";
                data = data + "<td>" + value.SubWorkName + "</td>";
                data = data + "<td>" + value.DetailName + "</td>";
                data = data + "<td>" + value.FloorName + "</td>";
                data = data + "</tr>";
                detailrowindex++;
                itemname = value.ItemName;
                itemcode = value.ItemCode;
                manageby = value.ManageBy;
            }
        });
        $("#table_pq_line >tbody").append(data);
        $("#txt_pq_line_summary_item_name_" + headerrowindex).val(itemname);
        $("#td_pq_line_summary_item_code_" + headerrowindex).text(itemcode);
        $("#txt_pq_line_summary_uom_" + headerrowindex).append(uomsummary);

        $("#txt_pq_line_summary_whs_" + headerrowindex).val(defwhs);
        enablebin = "N";
        $("#table_whs > tbody >tr").each(function (whsindex) {
            if ($("#td_whs_whs_code_" + whsindex).text() == defwhs) {
                enablebin = $("#td_whs_enabled_" + whsindex).text();
                //alert($("#td_whs_whs_code_" + whsindex).text() + " Def Whs:" + defwhs + " Enable:" + enablebin);

                return false;
            }
        });
        if (enablebin == "Y") {
            $("#btn_pq_line_summary_bin_" + headerrowindex).show();
        }
        else {
            $("#btn_pq_line_summary_bin_" + headerrowindex).hide();
        }
        if (manageby != "N") {
            $("#btn_pq_line_summary_manage_by_" + headerrowindex).show();
        }
        else {
            $("#btn_pq_line_summary_manage_by_" + headerrowindex).hide();
        }

        $("#txt_pq_line_summary_qty_" + headerrowindex).val(convert2digit(total_sub_qty));

        headerrowindex++;
    }
    $("#modal-pr-list").modal('hide');
}

function remove_line(rowindex) {
    $("#tr_" + rowindex).remove();
}
function change_line(index) {
    var qty = returnstringvalue($("#txt_line_qty_" + index).val());
    var price = returnstringvalue($("#txt_line_price_" + index).val());
    var total = parseFloat(returnstringvalue(qty)) * parseFloat(returnstringvalue(price));

    $("#txt_line_qty_" + index).val(parseFloat(returnstringvalue(qty)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    $("#txt_line_price_" + index).val(parseFloat(returnstringvalue(price)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    $("#txt_line_total_" + index).val(parseFloat(returnstringvalue(total)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    SubTotalPQ('table_pq_line', 11);
}
function SubTotalPQ(id, columindex) {
    var total = 0;
    $("#" + id + " > tbody  > tr").not(':last').each(function (index, tr) {
        total = total + parseFloat(returnstringvalue($(this).find("td:eq(" + columindex + ")  input[type='text']").val()));
    });
    $("#txt_sub_total").val(parseFloat(returnstringvalue(total)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    var docdis = $("#txt_doc_discount").val();
    var balance = parseFloat(returnstringvalue(total)) - parseFloat(returnstringvalue(docdis));
    $("#txt_balance").val(parseFloat(returnstringvalue(balance)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}
function AddBlankPQ() {
    var uomoption = "";
    var whsoption = "";
    var projectoption = "";
    var mainworkoption = "";
    var floorwork = "";
    $("#cbo_pq_uom > option").each(function () {
        uomoption = uomoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    $("#cbo_pq_whs > option").each(function () {
        whsoption = whsoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });

    projectoption = "<option value=''></option>";
    $("#cbo_pq_project > option").each(function () {
        projectoption = projectoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    mainworkoption = "<option value=''></option>";
    $("#cbo_pq_main > option").each(function () {
        mainworkoption = mainworkoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });

    floorwork = "<option value=''></option>";
    $("#cbo_pq_floor > option").each(function () {
        floorwork = floorwork + "<option value='" + this.value + "'>" + this.text + "</option>";
    });

    var rowindex = 999;
    var tr = "<tr id='tr_" + rowindex + "'>";
    tr = tr + "<td style='display: none'>-1</td>";
    tr = tr + "<td style='display: none'>-1</td>";
    tr = tr + "<td style='display: none'></td>";
    tr = tr + "<td style='display: none'></td>";
    tr = tr + "<td style='display: none'>Blank</td>";
    tr = tr + "<td style='display: none'>" + rowindex + "</td>";
    tr = tr + "<td><span class='input-group-addon input-group-addon-remove'><i class='fa fa-fw fa-remove text-danger'></i></span></td>";
    tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pq_line_desc_" + rowindex + "' placeholder='Description' value='' onkeydown='txtautocompletelinepq(" + rowindex + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' placeholder='Quantity' value='0.00'></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' id='cbo_pq_boqtype'>" + uomoption + "</select></div></td>";
    tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde amount' id='txt_pq_vendor_ref' placeholder='Unit Price' value='0.00'></div></td>";
    tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde amount' readonly='readonly' id='txt_pq_vendor_ref' placeholder='Total'  value='0.00'></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='whs'>" + whsoption + "</select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='ocrcode'>" + projectoption + "</select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='ocrcode2'></select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='ocrcode3'></select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='ocrcode4'></select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='mainwork'>" + mainworkoption + "</option></select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='subwork'></select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='detailwork'></select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='floorwork'>" + floorwork + "</select></div></td>";
    tr = tr + "</tr>";
    $("#table_pq_line > tbody").append(tr);
}
function cmd_pop_choose_vendor() {
    var bprow = $("#txt_bp_selected_row").val();
    var bpcode = $("#td_pop_vendor_vendor_code_" + bprow).text();
    var bpname = $("#td_pop_vendor_vendor_name_" + bprow).text();
    $("#txt_vendor_code").val(bpcode);
    $("#txt_vendor_name").val(bpname);
    $("#modal-vendor_list").modal('hide');
    itemSelectByAutoSuggestionPQ(bpcode);
}
function tr_pop_vendor_selected(selectedindex) {
    $("#table_pop_vendor_list > tbody > tr").each(function (index) {
        $("#tr_pop_vendor_" + (index + 1)).css("background-color", "white");
    });
    $("#tr_pop_vendor_" + selectedindex).css("background-color", "#e6f0ff");
    $("#txt_bp_selected_row").val(selectedindex);
}
function cmd_show_vendor() {
    $("#modal-vendor_list").modal('show');
    tr_pop_vendor_selected(-1);
}
function cmd_pq_choose_pr_v1() {
    list = [];
    $("#table_pq_pr_list > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id;
            var d = {
                DocEntry: $("#tr_" + id).find("td:eq(0)").text(),
            };
            list.push(d);
        }
    });
    if (list.length > 0) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/purpq/cmd_pq_choose_pr',
            data: JSON.stringify(
                {
                    'detail': list
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    $('#table_pq_line > tbody > tr').remove();
                    var rowindex = $("#table_pq_line >tbody >tr").length;
                    if (typeof ($("#table_pq_line >tbody").find("tr:last").attr("id")) == "undefined") {
                        rowindex = 0;
                    }
                    else {
                        var newrow = $("#table_pq_line >tbody").find("tr:last").attr("id").replace("tr_", "");
                        rowindex = parseInt(newrow) + 1;
                    }
                    for (i = 0; i < data.data.length; i++) {
                        var x = data.data[i];
                        var tr = "<tr id='tr_" + rowindex + "'>";
                        tr = tr + "<td style='display: none'>" + x.DocEntry + "</td>";
                        tr = tr + "<td style='display: none'>" + x.LineNum + "</td>";
                        tr = tr + "<td style='display: none'>" + x.ItemCode + "</td>";
                        tr = tr + "<td style='display: none'>" + x.GlobalCode + "</td>";
                        tr = tr + "<td style='display: none'>Active</td>";
                        tr = tr + "<td style='display: none'>" + rowindex + "</td>";
                        tr = tr + "<td><span class='input-group-addon input-group-addon-remove'><i class='fa fa-fw fa-remove text-danger' onclick='remove_line(" + rowindex + ")'></i></span></td>";
                        tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' placeholder='Description' value='" + x.ItemName + "'></div></td>";
                        tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_line_qty_" + rowindex + "' onchange='change_line(" + rowindex + ")' placeholder='Quantity' value='" + parseFloat(returnstringvalue(x.BalanceQuantity)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "'></div></td>";
                        tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='uom'><option value='" + x.UoMEntry + "'> " + x.uomName + "</option></select></div></td>";
                        tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde amount' id='txt_line_price_" + rowindex + "' onchange='change_line(" + rowindex + ")' placeholder='Unit Price' value='0.00'></div></td>";
                        tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde amount' readonly='readonly' id='txt_line_total_" + rowindex + "' placeholder='Total'  value='0.00'></div></td>";
                        tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='whs'><option value='" + x.WhsCode + "'>" + x.whsname + "</option></select></div></td>";
                        tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='ocrcode'><option value='" + x.OcrCode + "'>" + x.OcrCodeName + "</option></select></div></td>";
                        tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='ocrcode2'><option value='" + x.OcrCode2 + "'>" + x.OcrCode2Name + "</option></select></div></td>";
                        tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='ocrcode3'><option value='" + x.OcrCode3 + "'>" + x.OcrCode3Name + "</option></select></div></td>";
                        tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='ocrcode4'><option value='" + x.OcrCode4 + "'>" + x.OcrCode4Name + "</option></select></div></td>";
                        tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='main'><option value='" + x.MainworkCode + "'>" + x.MainWorkName + "</option></select></div></td>";
                        tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='sub'><option value='" + x.SubWorkCode + "'>" + x.SubWorkName + "</option></select></div></td>";
                        tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='det'><option value='" + x.DetailWorkCode + "'>" + x.DetailName + "</option></select></div></td>";
                        tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='floor'><option value='" + x.FloorWorkCode + "'>" + x.FloorName + "</option></select></div></td>";
                        tr = tr + "</tr>";
                        $("#table_pq_line > tbody").append(tr);
                        rowindex++;
                    }
                    AddBlankPQ();
                    SubTotalPQ('table_pq_line', 11);
                    $("#modal-pq-pr-list").modal('hide');
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}
//get data from database
function txt_line_pq_costcenter_change(index, type) {
    var cboval = "";
    var id = "";
    switch (type) {
        case 2:
            cboval = $("#txt_line_pq_ocrcode_" + index).val();
            id = "txt_line_pq_ocrcode2_" + index;
            $("#txt_line_pq_ocrcode3_" + index).empty();
            $("#txt_line_pq_ocrcode4_" + index).empty();
            break;
        case 3:
            cboval = $("#txt_line_pq_ocrcode2_" + index).val()
            id = "txt_line_pq_ocrcode3_" + index;
            $("#txt_line_pq_ocrcode4_" + index).empty();
            break;
        case 4:
            cboval = $("#txt_line_pq_ocrcode3_" + index).val()
            id = "txt_line_pq_ocrcode4_" + index;
            break;
    }
    $.ajax({
        url: '/purpr/cbo_cost_center_change',
        type: 'POST',
        data: { type: type, code: cboval },
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
function txt_line_pq_work_change(index, type) {
    var cboval = "";
    var id = "";
    switch (type) {
        case 1:
            cboval = $("#txt_line_pq_mainwork_" + index).val();
            id = "txt_line_pq_subwork_" + index;
            $("#txt_line_pq_detailwork_" + index).empty();
            break;
        case 2:
            cboval = $("#txt_line_pq_subwork_" + index).val();
            id = "txt_line_pq_detailwork_" + index;
            break;
    }
    $.ajax({
        url: '/purpr/cbo_cost_work_change',
        type: 'POST',
        data: { type: type, code: cboval },
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
function cmd_pq_copy_from_view_click(isboq, boqtyp) {

    var itemgroup = $("#cbo_pq_pop_filter_item_group").val();
    var itemdesc = $("#txt_pq_pop_filter_item_desc").val();
    var url = "/getData/get_grpo1";
    $.ajax({
        url: url,
        type: 'POST',
        data: { prn: $("#txt_pq_pop_filter_num").val(), itemgroup: itemgroup, itemdesc: itemdesc, isBoq: isboq, BoqType: boqtyp },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#table_pq_pop_pr_list >tbody>tr").remove();
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                var tr = "<tr id='tr_" + i + "'>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_entry_" + i + "'>" + x.DocEntry + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_line_num_" + i + "'>" + x.LineNum + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_type_" + i + "'>PO</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_global_code_" + i + "'>" + x.GlobalCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_item_code_" + i + "'>" + x.ItemCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_item_manage_by_" + i + "'>" + x.ManageBy + "</td>";

                tr = tr + "<td style='display:none' id='td_pq_pop_base_enabled_bin_" + i + "'>" + x.DefBinEntry + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_def_bin_entry_" + i + "'>" + x.EnabledBin + "</td>";

                tr = tr + "<td style='display:none' id='td_pq_pop_base_uom_code_" + i + "'>" + x.UoMEntry + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_ugpentry_" + i + "'>" + x.UgpEntry + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_whs_code_" + i + "'>" + x.WhsCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_ocrcode_code_" + i + "'>" + x.OcrCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_ocrcode2_code_" + i + "'>" + x.OcrCode2 + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_ocrcode3_code_" + i + "'>" + x.OcrCode3 + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_main_code_" + i + "'>" + x.MainworkCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_sub_code_" + i + "'>" + x.SubWorkCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_detail_code_" + i + "'>" + x.DetailWorkCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_floor_code_" + i + "'>" + x.FloorWorkCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_floorworkname_" + i + "'>" + x.FloorName + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_ocrcode_name_" + i + "'>" + x.OcrCodeName + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_ocrcode2_name_" + i + "'>" + x.OcrCode2Name + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_qty_" + i + "'>" + returnstringvalue(x.BalanceQuantity) + "</td>";
                tr = tr + "<td><input type='checkbox' name='chk' id='" + i + "'/></td>";
                tr = tr + "<td id='td_pq_pop_base_base_num_" + i + "'>" + x.DocNum + "</td>";
                tr = tr + "<td id='td_pq_pop_base_boq_type_" + i + "'>" + x.Type + "</td>";
                tr = tr + "<td id='td_pq_pop_base_item_name_" + i + "'>" + x.ItemName + "</td>";
                tr = tr + "<td id='td_pq_pop_base_ocrcode3name_" + i + "'>" + x.OcrCode3Name + "</td>";
                tr = tr + "<td id='td_pq_pop_base_mainworkname_" + i + "'>" + x.MainWorkName + "</td>";
                tr = tr + "<td id='td_pq_pop_base_subworkname_" + i + "'>" + x.SubWorkName + "</td>";
                tr = tr + "<td id='td_pq_pop_base_detailworkname_" + i + "'>" + x.DetailName + "</td>";

                tr = tr + "</tr>";
                $("#table_pq_pop_pr_list >tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}

function cmd_pq_copy_from_pr() {
    allow = 0;
    if ($("#cbo_pq_isboq").val() == "") {
        ShowAlert("Is BOQ is required");
        allow = 1;
    }
    if ($("#cbo_pq_boqtype").val() == "" && allow == 0) {
        ShowAlert("BOQ Type is required");
        allow = 1;
    }
    if (allow == 0) {
        $.ajax({
            url: '/purpq/cmd_pq_copy_from_pr',
            type: 'POST',
            data: { isboq: $("#cbo_pq_isboq").val(), boqtype: $("#cbo_pq_boqtype").val() },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                $("#table_pq_pr_list >tbody >tr").remove();
                for (i = 0; i < data.data.length; i++) {
                    var x = data.data[i];
                    var boqtype = "";
                    switch (x.BOQType) {
                        case "M":
                            boqtype = "Material";
                            break;
                        case "S":
                            boqtype = "Sub-Con";
                            break;
                        case "L":
                            boqtype = "Labor";
                            break;
                        case "O":
                            boqtype = "Other";
                            break;
                    }
                    var tr = "<tr id='tr_" + i + "'>";
                    tr = tr + "<td style='display:none'>" + x.DocEntry + "</td>";
                    tr = tr + "<td><input type='checkbox' id='" + i + "'></td>";
                    tr = tr + "<td>" + x.DocNum + "</td>";
                    tr = tr + "<td>" + x.DocDate + "</td>";
                    tr = tr + "<td>" + x.ReqDate + "</td>";
                    tr = tr + "<td>" + x.Requester + "</td>";
                    tr = tr + "<td>" + x.IsBOQ + "</td>";
                    tr = tr + "<td>" + boqtype + "</td>";
                    tr = tr + "</tr>";
                    $("#table_pq_pr_list >tbody").append(tr);
                }
                $("#modal-pq-pr-list").modal('show');
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}
function getPQNumber() {
    $.ajax({
        type: 'POST',
        url: '/purpq/getLastPQ',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (x) {
            if (x.status == "OK") {
                $("#txt_pq_pq_no").val(x.docnum);
            }
            else {
                alert(data.Message);
            }
        },
        failure: function (response) {
            $('#result').html(response);
        }
    });
}
function txtautocompletelinepq(id) {
    $("#txt_pq_line_desc_" + id).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/purpq/txtautocompletelinepq",
                method: "POST",
                dataType: "json",
                data: {
                    Desc: $("#txt_pq_line_desc_" + id).val().trim(),
                    type: $("#cbo_pq_boqtype").val()
                },
                beforeSend: function () {
                    $("#loading").show();
                },
                complete: function () {
                    $("#loading").hide();
                },
                success: function (data) {
                    response(
                        $.map(data, function (item) {
                            return {
                                value: item.ItemCode,
                                label: item.ItemName,
                                GlobalCode: item.GlobalCode
                            };
                        })
                    );
                }
            });
        },
        minLength: 1,
        messages: {
            noResults: "No results",
            results: function (count) {
                return count + (count == 0 ? " result" : " results");
            }
        },
        select: function (event, _i) {
            $("#txt_line_pr_itemname_" + id).val(_i.item.label);
            itemSelectByAutoSuggestionLinePQ(_i.item.value, _i.item.label, _i.item.GlobalCode);
            event.preventDefault();
        }
    });
}
function itemSelectByAutoSuggestionLinePQ(itemcode, itemname, globalcode) {
    var uomoption = "";
    var whsoption = "";
    var projectoption = "";
    var mainworkoption = "";
    var floorwork = "";
    $("#cbo_pq_uom > option").each(function () {
        uomoption = uomoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    $("#cbo_pq_whs > option").each(function () {
        whsoption = whsoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });

    projectoption = "<option value=''></option>";
    $("#cbo_pq_project > option").each(function () {
        projectoption = projectoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    mainworkoption = "<option value=''></option>";
    $("#cbo_pq_main > option").each(function () {
        mainworkoption = mainworkoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });

    floorwork = "<option value=''></option>";
    $("#cbo_pq_floor > option").each(function () {
        floorwork = floorwork + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    $('#table_pq_line > tbody > tr:last').remove();
    var rowindex = 0;
    if (typeof ($("#table_pq_line >tbody").find("tr:last").attr("id")) == "undefined") {
        rowindex = 0;
    }
    else {
        var newrow = $("#table_pq_line >tbody").find("tr:last").attr("id").replace("tr_", "");
        rowindex = parseInt(newrow) + 1;
    }


    var tr = "<tr id='tr_" + rowindex + "'>";
    tr = tr + "<td style='display: none'>-1</td>";
    tr = tr + "<td style='display: none'>-1</td>";
    tr = tr + "<td style='display: none'>" + itemcode + "</td>";
    tr = tr + "<td style='display: none'>" + globalcode + "</td>";
    tr = tr + "<td style='display: none'>Active</td>";
    tr = tr + "<td style='display: none'>" + rowindex + "</td>";
    tr = tr + "<td><span class='input-group-addon input-group-addon-remove'><i class='fa fa-fw fa-remove text-danger'></i></span></td>";
    tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_pq_line_desc_" + rowindex + "' placeholder='Description' value='" + itemname + "'></div></td>";
    tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='txt_line_qty_" + rowindex + "' onchange='change_line(" + rowindex + ")' placeholder='Quantity' value='0.00'></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' id='cbo_pq_boqtype' name='uom'>" + uomoption + "</select></div></td>";
    tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde amount' id='txt_line_price_" + rowindex + "' onchange='change_line(" + rowindex + ")' placeholder='Unit Price' value='0.00'></div></td>";
    tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde amount' readonly='readonly' id='txt_line_total_" + rowindex + "' placeholder='Total'  value='0.00'></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='whs'>" + whsoption + "</select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='ocrcode' id='txt_line_pq_ocrcode_" + rowindex + "' onchange='txt_line_pq_costcenter_change(" + rowindex + ",2)'>" + projectoption + "</select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='ocrcode2' id='txt_line_pq_ocrcode2_" + rowindex + "' onchange='txt_line_pq_costcenter_change(" + rowindex + ",3)'></select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='ocrcode3' id='txt_line_pq_ocrcode3_" + rowindex + "' onchange='txt_line_pq_costcenter_change(" + rowindex + ",4)'></select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='ocrcode4' id='txt_line_pq_ocrcode4_" + rowindex + "'></select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='main' id='txt_line_pq_mainwork_" + rowindex + "' onchange='txt_line_pq_work_change(" + rowindex + ",1)'>" + mainworkoption + "</option></select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='sub' id='txt_line_pq_subwork_" + rowindex + "' onchange='txt_line_pq_work_change(" + rowindex + ",2)'></select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='det' id='txt_line_pq_detailwork_" + rowindex + "' ></select></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control form-control-insde' name='floor'>" + floorwork + "</select></div></td>";
    tr = tr + "</tr>";
    $("#table_pq_line > tbody").append(tr);
    AddBlankPQ();
}
function txtautocompletepq() {
    $("#txt_pq_vendor_name").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/purpq/autocomplete",
                method: "POST",
                dataType: "json",
                data: {
                    Desc: $("#txt_pq_vendor_name").val().trim(),
                },
                beforeSend: function () {
                    $("#loading").show();
                },
                complete: function () {
                    $("#loading").hide();
                },
                success: function (data) {
                    response(
                        $.map(data, function (item) {
                            return {
                                value: item.CardCode,
                                label: item.CardName
                            };
                        })
                    );
                }
            });
        },
        minLength: 1,
        messages: {
            noResults: "No results",
            results: function (count) {
                return count + (count == 0 ? " result" : " results");
            }
        },
        select: function (event, _i) {
            $("#txt_pq_vendor_name").val(_i.item.label);
            itemSelectByAutoSuggestionPQ(_i.item.value);
            event.preventDefault();
        }
    });
}
function itemSelectByAutoSuggestionPQ(cardcode) {
    //$("#txt_pq_vendor_code").val(cardcode);
    $.ajax({
        url: '/purpq/get_contact',
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
            $("#cbo_vendor_contact").empty();
            options = ""
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                options = options + "<option value='" + x.CntctCode + "'>" + x.Name + "</option>";
            }
            $("#cbo_vendor_contact").append(options);
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
//Saving Data to Database
function cmd_save_pq() {
    list = [];
    dellist = [];
    allow = 0;
    lineno = 0;
    if ($("#txt_pq_pq_no").val() == "") {
        ShowAlert("Vendor Code is required");
        allow = 1;
    }
    if ($("#txt_pq_vendor_name").val() == "") {
        ShowAlert("Vendor Code is required");
        allow = 1;
    }

    if ($("#txt_pq_docdate").val() == "" && allow == 0) {
        ShowAlert("Posting Date is required");
        allow = 1;
    }
    if ($("#txt_pq_valid_until").val() == "" && allow == 0) {
        ShowAlert("Valid Until is required");
        allow = 1;
    }
    if ($("#txt_pq_req_date").val() == "" && allow == 0) {
        ShowAlert("Required Date is required");
        allow = 1;
    }

    if ($('#table_pq_line > tbody  > tr').length == 0 && allow == 0) {
        ShowAlert("PQ Line cannot be blanked");
        allow = 1;
    }
    $('#table_pq_line > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(4)").text() != "Blank") {
            if (parseFloat(returnstringvalue($(this).find("td:eq(8) input[type='text']").val())) == 0) {
                ShowAlert("Quantity cannot be zero");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(13) select[name='ocrcode']").val() == "" && allow == 0) {
                ShowAlert("Project cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(14) select[name='ocrcode2']").val() == "" && allow == 0) {
                ShowAlert("Zone/Block cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(15) select[name='ocrcode3']").val() == "" && allow == 0) {
                ShowAlert("Street cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(16) select[name='ocrcode4']").val() == "" && allow == 0) {
                ShowAlert("House cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(17) select[name='main']").val() == "" && allow == 0) {
                ShowAlert("Main Work cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(18) select[name='sub']").val() == "" && allow == 0) {
                ShowAlert("Sub Work cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(19) select[name='det']").val() == "" && allow == 0) {
                ShowAlert("Detail Work cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(20) select[name='floor']").val() == "" && allow == 0) {
                ShowAlert("Floor Work cannot be blanked");
                allow = 1;
                return;
            }
        }
    });
    if (allow == 0) {
        var docdate = $('#txt_pq_docdate').val().trim().split("-");
        var reqdate = $('#txt_pq_req_date').val().trim().split("-");
        var valid = $('#txt_pq_valid_until').val().trim().split("-");
        var head = {
            DocEntry: $("#txt_pq_dockey").val(),
            CardCode: $("#txt_pq_vendor_code").val(),
            CardName: $("#txt_pq_vendor_name").val(),
            ContactPer: $("#cbo_pq_contact").val(),
            NumatCard: $("#txt_pq_vendor_ref").val(),
            DocDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            ValidDate: valid[2] + "/" + valid[1] + "/" + valid[0],
            ReqDate: reqdate[2] + "/" + reqdate[1] + "/" + reqdate[0],
            IsBOQ: $("#cbo_pq_isboq").val(),
            BOQType: $("#cbo_pq_boqtype").val(),
            Memo: $("#txtmemo").val(),
            CreatedBy: $("#txt_shared_userid").val(),
        };
        $('#table_pq_line > tbody  > tr').each(function (index, tr) {
            if ($(this).find("td:eq(4)").text() != "Blank") {
                var d = {
                    LineNum: -1,
                    BaseEntry: $(this).find("td:eq(0)").text(),
                    BaseLine: $(this).find("td:eq(1)").text(),
                    BaseType: ($(this).find("td:eq(0)").text() == "-1" ? "" : "PR"),
                    GlobalCode: $(this).find("td:eq(3)").text(),
                    AcctCode: ($("#cbo_pq_boqtype").val() == "O" ? $(this).find("td:eq(2)").text() : ""),
                    ItemCode: ($("#cbo_pq_boqtype").val() != "O" ? $(this).find("td:eq(2)").text() : ""),
                    ItemName: $(this).find("td:eq(7) input[type='text']").val(),
                    Quantity: returnstringvalue($(this).find("td:eq(8)  input[type='text']").val()),
                    UoMEntry: $(this).find("td:eq(9) select[name='uom']").val(),
                    UPrice: returnstringvalue($(this).find("td:eq(10)  input[type='text']").val()),
                    LineTotal: returnstringvalue($(this).find("td:eq(11)  input[type='text']").val()),
                    WhsCode: $(this).find("td:eq(12) select[name='whs']").val(),
                    OcrCode: $(this).find("td:eq(13) select[name='ocrcode']").val(),
                    OcrCode2: $(this).find("td:eq(14) select[name='ocrcode2']").val(),
                    OcrCode3: $(this).find("td:eq(15) select[name='ocrcode3']").val(),
                    OcrCode4: $(this).find("td:eq(16) select[name='ocrcode4']").val(),
                    MainworkCode: $(this).find("td:eq(17) select[name='main']").val(),
                    SubWorkCode: $(this).find("td:eq(18) select[name='sub']").val(),
                    DetailWorkCode: $(this).find("td:eq(19) select[name='det']").val(),
                    FloorWorkCode: $(this).find("td:eq(20) select[name='floor']").val(),
                    IsBOQ: $("#cbo_pq_isboq").val(),
                    BOQType: $("#cbo_pq_boqtype").val(),
                };
                list.push(d);
            }
            lineno = lineno + 1;
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/purpq/cmd_save_pq',
            data: JSON.stringify(
                {
                    'header': head,
                    'detail': list,
                    'deldetail': dellist
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
                    ShowAlert("Purchase Request was saved");
                }
                else {
                    if (data.status == "300") {
                        ShowAlert("PQ Quantity is greater than PR Quantity");
                    }
                    //alert(data.Message);
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}


