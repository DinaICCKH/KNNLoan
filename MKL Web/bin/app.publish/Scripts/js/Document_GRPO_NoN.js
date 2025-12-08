
function check_batch_qty(detailid) {
    var sum_batch_qty = 0;
    $("#table_pop_item_batch_creation >tbody>tr").each(function () {
        var get_detail_id = $(this).attr('id').replace("tr_pop_batch_creation_line_", "").split("_");
        var d_id = get_detail_id[0];
        var id = get_detail_id[1];
        //alert("Detail" + detailid + " And :" + d_id);
        if (detailid == d_id) {
            sum_batch_qty = parseFloat(returnstringvalue(sum_batch_qty)) + parseFloat(returnstringvalue($("#txt_pop_batch_creation_qty_" + d_id + "_" + id).val()));
        }
    });
    return returnstringvalue(sum_batch_qty);
}
function cmd_pop_update_batch_creation() {
    ///Find Blank Batch
    var found = 0;
    $("#table_pop_item_batch_creation >tbody>tr").each(function () {
        var get_detail_id = $(this).attr('id').replace("tr_pop_batch_creation_line_", "").split("_");
        var detail_id = get_detail_id[0];
        var id = get_detail_id[1];
        if ($("#td_pop_batch_creation_batch_num_" + detail_id + "_" + id).val() == "") {
            found = 1;
            return false;
        }
    });
    if (found == 0) {
        var sum_batch_qty = 0;

        $("#table_pop_item_batch_creation >tbody>tr").each(function () {
            var get_detail_id = $(this).attr('id').replace("tr_pop_batch_creation_line_", "").split("_");
            var detail_id = get_detail_id[0];
            var id = get_detail_id[1];
            if ($("#td_pop_batch_creation_detail_id_" + detail_id + "_" + id).text() == $("#txt_pop_batch_item_selected_detail_id").val()) {
                $("#td_pop_batch_creation_status_" + detail_id + "_" + id).text("Update");
                sum_batch_qty = parseFloat(returnstringvalue(sum_batch_qty)) + parseFloat(returnstringvalue($("#txt_pop_batch_creation_qty_" + detail_id + "_" + id).val()));
            }
        });
        $("#line_detail_item_total_batch_apply_" + $("#txt_pop_batch_item_selected_detail_id").val()).text(returnstringvalue(sum_batch_qty));
        ShowAlert("Batch was updated");
    }
    else {
        ShowAlert("Batch Number is required");
    }
}
function tr_pop_batch_item_selected(selectedindex, def_status) {
    $("#table_pop_item_batch_item > tbody > tr").each(function (index) {
        //var detail_id = $(this).attr('id').replace("tr_line_", "");
        //$("#tr_pop_batch_item_" + (index + 1)).css("background-color", "white");
        $(this).css("background-color", "white");
    });
    $("#tr_pop_batch_item_" + selectedindex).css("background-color", "#e6f0ff");
    $("#txt_pop_batch_item_selected_detail_id").val($("#td_pop_batch_item_detail_id_" + selectedindex).text());
    $("#txt_pop_batch_item_selected_line_index").val(selectedindex);

    var itemcode = $("#td_pop_batch_item_item_code_" + selectedindex).text();
    var itemname = $("#td_pop_batch_item_item_name_" + selectedindex).text();
    var brandname = $("#td_pop_batch_item_brand_name_" + selectedindex).text();
    var detailid = $("#txt_pop_batch_item_selected_detail_id").val(); //$("#td_pop_batch_item_detail_id_" + selectedindex).text();
    
    var balqty = parseFloat(returnstringvalue($("#td_pop_batch_item_total_qty_" + selectedindex).text())) - parseFloat(returnstringvalue($("#td_pop_batch_item_total_qty_creation_" + selectedindex).text()));
    load_batch_info_by_item(detailid, itemcode, itemname, brandname, balqty, def_status);
}
function load_batch_info_by_item(detailid, itemcode, itemname, brandname, balqty, def_status) {
    //clear status="New"
    $("#table_pop_item_batch_creation >tbody >tr").each(function () {
        var get_id = $(this).attr('id').replace("tr_pop_batch_creation_line_", "").split("_");
        if ($("#td_pop_batch_creation_status_" + get_id[0] + "_" + get_id[1]).text() == "New") {
            $(this).remove();
        }
    });
    var lastrowindex = 0;
    var balqty = 0;
    var sumqty = 0;
    $("#table_pop_item_batch_creation >tbody >tr").each(function () {
        if ($(this).find("td:eq(0)").text() == detailid) {
            $(this).show();
            lastrowindex = $(this).attr('id').replace("tr_pop_batch_creation_line_" + detailid + "_", "");
            sumqty = parseFloat(returnstringvalue(sumqty)) + parseFloat(returnstringvalue($("#txt_pop_batch_creation_qty_" + lastrowindex).val()));
        }
        else {
            $(this).hide();
        }
    });
    var oriqty = 0;
    var ori_index = -1;
    $("#table_pop_item_batch_item >tbody >tr").each(function () {
        var item_id = $(this).attr('id').replace("tr_pop_batch_item_", "");
        if ($("#td_pop_batch_item_detail_id_" + item_id).text() == detailid) {
            oriqty = $("#td_pop_batch_item_total_qty_" + item_id).text();
            ori_index = item_id;
            return false;
        }
    });
    balqty = parseFloat(returnstringvalue(oriqty)) - parseFloat(returnstringvalue(sumqty));
    //alert(balqty + "And SumQty:" + sumqty + " And Ori:" + oriqty);
    if (balqty < 0) {
        ShowAlert("Total Batch Creation Quantity is greater than Total Need");
        $("#txt_pop_batch_creation_qty_" + id).val("0.00");
        sumqty = parseFloat(returnstringvalue(sumqty)) - parseFloat(returnstringvalue(qty));
    }
    else if (balqty > 0) {
        $("#td_pop_batch_item_total_qty_creation_" + ori_index).text(convert2digit(balqty));
        NewBlankBatch(detailid, itemcode, itemname, brandname, balqty, def_status);
    }
    Running_Total_Qty_Created(detailid);
}
function txt_pop_batch_creation_qty_change(id) {

    var detail_id = $("#txt_pop_batch_item_selected_detail_id").val();// $("#td_pop_batch_creation_detail_id_" + id).text();

    var qty = $("#txt_pop_batch_creation_qty_" + detail_id + "_" + id).val();
    $("#txt_pop_batch_creation_qty_" + detail_id + "_" + id).val(convert2digit(qty));


    //var itemcode = $("#td_pop_batch_creation_item_code_" + id).text();
    //var itemname = $("#td_pop_batch_creation_item_name_" + id).text();
    var itemcode = $("#td_pop_batch_item_item_code_" + $("#txt_pop_batch_item_selected_line_index").val()).text();
    var itemname = $("#td_pop_batch_item_item_name_" + $("#txt_pop_batch_item_selected_line_index").val()).text();

    var brandname = "";
    var sumqty = 0;
    var balqty = 0;
    $("#table_pop_item_batch_creation >tbody>tr").each(function () {
        var createionline_num = "tr_pop_batch_creation_line_" + detail_id + "_";
        var creationid = $(this).attr('id').replace(createionline_num, "");
        //var d_id = $("#td_pop_batch_creation_detail_id_" + detail_id + "_" + creationid).text();
        if ($("#td_pop_batch_creation_detail_id_" + detail_id + "_" + creationid).text() == detail_id) {
            sumqty = parseFloat(returnstringvalue(sumqty)) + parseFloat(returnstringvalue($("#txt_pop_batch_creation_qty_" + detail_id + "_" + creationid).val()));
        }
    });
    var oriqty = 0;
    var ori_index = -1;
    $("#table_pop_item_batch_item >tbody >tr").each(function () {
        var item_id = $(this).attr('id').replace("tr_pop_batch_item_", "");
        if ($("#td_pop_batch_item_detail_id_" + item_id).text() == detail_id) {
            oriqty = $("#td_pop_batch_item_total_qty_" + item_id).text();
            ori_index = item_id;
            return false;
        }
    });
    balqty = parseFloat(returnstringvalue(oriqty)) - parseFloat(returnstringvalue(sumqty));
    if (balqty < 0) {
        ShowAlert("Total Batch Creation Quantity is greater than Total Need");
        $("#txt_pop_batch_creation_qty_" + detail_id + "_" + id).val("0.00");
        sumqty = parseFloat(returnstringvalue(sumqty)) - parseFloat(returnstringvalue(qty));
    }
    else if (balqty > 0) {
        NewBlankBatch(detail_id, itemcode, itemname, brandname, balqty);
        sumqty = parseFloat(returnstringvalue(sumqty)) + parseFloat(returnstringvalue(qty));
    }
    Running_Total_Qty_Created(detail_id);
    //NewBlankBatch();
}
function Running_Total_Qty_Created(detail_id) {
    var sumqty = 0;
    $("#table_pop_item_batch_creation >tbody>tr").each(function () {
        var get_detail_id = $(this).attr('id').replace("tr_pop_batch_creation_line_", "").split("_");
        var d_id = get_detail_id[0];
        var id = get_detail_id[1];
        if ($("#td_pop_batch_creation_detail_id_" + d_id + "_" + id).text() == detail_id) {
            if ($("#td_pop_batch_creation_status_" + d_id + "_" + id).text() != "deleted") {
                sumqty = parseFloat(returnstringvalue(sumqty)) + parseFloat(returnstringvalue($("#txt_pop_batch_creation_qty_" + d_id + "_" + id).val()));
            }
        }
    });
    var ori_index = -1;
    $("#table_pop_item_batch_item >tbody >tr").each(function () {
        var item_id = $(this).attr('id').replace("tr_pop_batch_item_", "");
        if ($("#td_pop_batch_item_detail_id_" + item_id).text() == detail_id) {
            ori_index = item_id;
            return false;
        }
    });
    $("#td_pop_batch_item_total_qty_creation_" + ori_index).text(convert2digit(sumqty));
}
function NewBlankBatch(detailid, itemcode, itemname, brandname, balqty, def_status) {
    
    var lastrowindex = 0;
    $("#table_pop_item_batch_creation >tbody >tr").each(function () {
        if ($(this).find("td:eq(0)").text() == detailid) {
            $(this).show();
            lastrowindex = $(this).attr('id').replace("tr_pop_batch_creation_line_" + detailid + "_", "");
        }
        else {
            $(this).hide();
        }
    });
    lastrowindex++;
    var uomentry = $("#td_pop_batch_item_uom_entry_" + $("#txt_pop_batch_item_selected_line_index").val()).text();
    var param = detailid.toString() + "_" + lastrowindex.toString();
    var docdate = $("#txt_doc_date").val();
    var data = "<tr id='tr_pop_batch_creation_line_" + detailid + "_" + lastrowindex + "'>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_detail_id_" + detailid + "_" + lastrowindex + "'>" + detailid + "</td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_item_code_" + detailid + "_" + lastrowindex + "'>" + itemcode + "</td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_item_name_" + detailid + "_" + lastrowindex + "'>" + itemname + "</td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_uom_entry_" + detailid + "_" + lastrowindex + "'>" + uomentry + "</td>";

    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_pop_batch_creation_remove(/" + param + "/)'></i></td>";
    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='td_pop_batch_creation_batch_num_" + detailid + "_" + lastrowindex + "' placeholder='Batch Num' value='" + brandname + "'></div></td>";
    data = data + "<td><input type='text' class='form-control form-control-insde' placeholder='Quantity' value='" + convert2digit(balqty) + "' id='txt_pop_batch_creation_qty_" + detailid + "_" + lastrowindex + "' onchange='txt_pop_batch_creation_qty_change(" + lastrowindex + ")'></div></td>";
    data = data + "<td><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' id='td_pop_batch_creation_expired_date_" + detailid + "_" + lastrowindex + "' class='form-control pull-right datetime form-control-insde' readonly='readonly' placeholder='Exp-Date'></div></div></td>";
    data = data + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' id='td_pop_batch_creation_man_date_" + detailid + "_" + lastrowindex + "' class='form-control pull-right datetime form-control-insde' readonly='readonly' placeholder='Mfr-Date'></div></div></td>";
    data = data + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' id='td_pop_batch_creation_adm_date_" + detailid + "_" + lastrowindex + "' class='form-control pull-right datetime form-control-insde' readonly='readonly' placeholder='Admission-Date' value='" + docdate + "'></div></div></td>";
    if (def_status == "") {
        data = data + "<td style='display:none' id='td_pop_batch_creation_status_" + detailid + "_" + lastrowindex + "'>New</td>";
    }
    else {
        data = data + "<td style='display:none' id='td_pop_batch_creation_status_" + detailid + "_" + lastrowindex + "'>Update</td>";
    }
    data = data + "<td style='display:none' id='td_pop_batch_creation_line_num_" + detailid + "_" + lastrowindex + "'>-1</td>";
    data = data + "</tr>";
    $("#table_pop_item_batch_creation >tbody").append(data);
    $('.datetime').datepicker({
        autoclose: true,
        format: 'd-M-yyyy'
    });
}
function BlankBatch(detailid, itemcode, itemname, brandname, balqty) {
    $("#table_pop_item_batch_creation >tbody >tr").each(function () {
        if ($(this).find("td:eq(0)").text() == detailid) {
            $(this).show();
            lastrowindex = $(this).attr('id').replace("tr_pop_batch_creation_line_" + detailid + "_", "");
        }
        else {
            $(this).hide();
        }
    });
    lastrowindex++;
    var param = detailid.toString() + "_" + lastrowindex.toString();
    var docdate = $("#txt_doc_date").val();
    var data = "<tr id='tr_pop_batch_creation_line_" + detailid + "_" + lastrowindex + "'>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_detail_id_" + detailid + "_" + lastrowindex + "'>" + detailid + "</td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_item_code_" + detailid + "_" + lastrowindex + "'>" + itemcode + "</td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_item_name_" + detailid + "_" + lastrowindex + "'>" + itemname + "</td>";
    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_pop_batch_creation_remove(/" + param + "/)'></i></td>";
    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='td_pop_batch_creation_batch_num_" + detailid + "_" + lastrowindex + "' placeholder='Batch Num' value='" + brandname + "'></div></td>";
    data = data + "<td><input type='text' class='form-control form-control-insde' placeholder='Quantity' value='0.00' id='txt_pop_batch_creation_qty_" + detailid + "_" + lastrowindex + "' onchange='txt_pop_batch_creation_qty_change(" + lastrowindex + ")'></div></td>";
    data = data + "<td><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' id='td_pop_batch_creation_expired_date_" + detailid + "_" + lastrowindex + "' class='form-control pull-right datetime form-control-insde' readonly='readonly' placeholder='Exp-Date'></div></div></td>";
    data = data + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' placeholder='Mfr-Date'></div></div></td>";
    data = data + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' placeholder='Admission-Date' value='" + docdate + "'></div></div></td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_status_" + detailid + "_" + lastrowindex + "'>Blank</td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_line_num_" + detailid + "_" + lastrowindex + "'>-1</td>";
    data = data + "</tr>";
    $("#table_pop_item_batch_creation >tbody").append(data);
    $('.datetime').datepicker({
        autoclose: true,
        format: 'd-M-yyyy'
    });
}
function cmd_pop_batch_creation_remove(creation_id) {
    var x = creation_id.toString().split("_");
    var id = x[0].replace("/", "") + "_" + x[1].replace("/", "");
    $("#tr_pop_batch_creation_line_" + id).remove();
    //$("#td_pop_batch_creation_status_" + id).text("deleted");
    //$("#tr_pop_batch_creation_line_" + id).hide();
    Running_Total_Qty_Created(x[0].replace("/", ""));
}
function cmd_line_summary_show_manage_by_click(showpop, def_status) {
    if (showpop == 1) {
        $("#modal_batch_list").modal('show');
    }
    else {
        $("#modal_batch_list").modal('hide');
    }
    //var itemcode = $("#txt_line_summary_item_code_" + summaryid).text();
    //var itemname = $("#txt_line_summary_item_name_" + summaryid).val();
    //$("#txt_pop_batch_summary_id").val(summaryid);

    //cmd_pop_cancel_batch();
    //pop_batch_check_batch(summaryid);
    //pop_batch_new_row(summaryid, itemcode, itemname);
    $("#table_pop_item_batch_item >tbody >tr").remove();
    var status = "";
    $("#table_line_item >tbody>tr").each(function (index) {
        var detail_id = $(this).attr('id').replace("tr_line_", "");
        if ($("#td_line_is_batch_" + detail_id).text() == "B") {
            var data = "<tr id='tr_pop_batch_item_" + index + "' onclick='tr_pop_batch_item_selected(" + index + "," + status + ")'>";
            data = data + "<td id='td_pop_batch_item_brand_name_" + index + "'>" + $("#td_line_brand_code_" + detail_id).text() + "</td>";
            data = data + "<td id='td_pop_batch_item_item_code_" + index + "'>" + $("#td_line_item_code_" + detail_id).text() + "</td>";
            data = data + "<td id='td_pop_batch_item_item_name_" + index + "'>" + $("#td_line_item_name_" + detail_id).text() + "</td>";
            data = data + "<td>" + $("#td_line_ocrcode3_name_" + detail_id).text() + "</td>";
            data = data + "<td>" + $("#td_line_floor_name_" + detail_id).text() + "</td>";

            data = data + "<td  id='td_pop_batch_item_total_qty_" + index + "'>" + $("#txt_line_qty_" + detail_id).val() + "</td>";
            data = data + "<td>" + $("#cbo_line_uom_" + detail_id + " option:selected").text() + "</td>";
            data = data + "<td id='td_pop_batch_item_total_qty_creation_" + index + "'>0.00</td>";
            data = data + "<td  style='display:none' id='td_pop_batch_item_detail_id_" + index + "'>" + detail_id + "</td>";
            data = data + "<td style='display:none' id='td_pop_batch_item_uom_entry_" + index + "'>" + $("#cbo_line_uom_" + detail_id).val() + "</td>";
            data = data + "</tr>";
            $("#table_pop_item_batch_item >tbody").append(data);
            //tr_pop_batch_item_selected(index, def_status);
        }
    });
    //tr_pop_batch_item_selected("-1", def_status);
}
function cmd_line_summary_show_manage_by_click_edit(showpop, def_status) {
    if (showpop == 1) {
        $("#modal_batch_list").modal('show');
    }
    else {
        $("#modal_batch_list").modal('hide');
    }
}
function cmd_remove_all_row_grpo_non() {
    $("#table_line_item > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("check_", "");
            remove_by_line_grpo_non(id);
            remove_bin_batch_by_detail_grpo_non($("#td_line_detail_id_" + id).text().trim());
        }
    });
    uncheck_all();
}
function remove_bin_batch_by_detail_grpo_non(detailid) {
    var binHead = "tr_pop_bin_item_" + detailid;
    var binDetatil = "name_tr_pop_bin_creation_line_" + detailid;
    var batchHead = "tr_pop_batch_item_" + detailid;
    var batchDetatil = "name_tr_pop_batch_creation_line_" + detailid;
    $("#" + binHead).remove();
    $("[name=" + binDetatil + "]").remove();
    $("#" + batchHead).remove();
    $("[name=" + batchDetatil + "]").remove();
}
function remove_by_line_grpo_non(rowindex) {
    if ($("#td_line_num_" + rowindex).text() != -1) {
        add_to_tbl_remove(0, $("#td_line_num_" + rowindex).text());
    }
    remove_bin_batch_by_detail_grpo_non(rowindex);
    $("#tr_line_" + rowindex).remove();
}
//for Bin
function cmd_line_summary_show_bin_location_click(summaryid) {
    $("#modal_bin_list").modal('show');
    $("#table_pop_item_bin_item >tbody >tr").remove();

    $("#table_line_item >tbody>tr").each(function (index) {
        var detail_id = $(this).attr('id').replace("tr_line_", "");
        if ($("#td_line_enable_bin_" + detail_id).text() == "Y") {
            var data = "<tr id='tr_pop_bin_item_" + index + "' onclick='tr_pop_bin_item_selected(" + index + ")'>";
            data = data + "<td id='td_pop_bin_item_item_code_" + index + "'>" + $("#td_line_item_code_" + detail_id).text() + "</td>";
            data = data + "<td id='td_pop_bin_item_item_name_" + index + "'>" + $("#td_line_item_name_" + detail_id).text() + "</td>";
            data = data + "<td style='display:none' id='cbo_pop_bin_item_whs_code_" + index + "'>" + $("#cbo_line_whs_" + detail_id).val() + "</td>";
            data = data + "<td>" + $("#cbo_line_whs_" + detail_id + " option:selected").text() + "</td>";
            data = data + "<td  id='td_pop_bin_item_total_qty_" + index + "'>" + $("#txt_line_qty_" + detail_id).val() + "</td>";
            data = data + "<td>" + $("#cbo_line_uom_" + detail_id + " option:selected").text() + "</td>";
            data = data + "<td id='td_pop_bin_item_total_qty_creation_" + index + "'>0.00</td>";
            data = data + "<td  style='display:none' id='td_pop_bin_item_detail_id_" + index + "'>" + detail_id + "</td>";
            data = data + "<td  style='display:none' id='td_pop_bin_item_uom_entry_" + index + "'>" + $("#cbo_line_uom_" + detail_id).val() + "</td>";
            data = data + "</tr>";
            $("#table_pop_item_bin_item >tbody").append(data);
            tr_pop_bin_item_selected(index);
        }
    });
    tr_pop_bin_item_selected("-1");

}
function cmd_line_summary_show_bin_location_click_edit(summaryid) {
    $("#modal_bin_list").modal('show');
}
function tr_pop_bin_item_selected(selectedindex) {
    $("#table_pop_item_bin_item > tbody > tr").each(function (index) {
        //var detail_id = $(this).attr('id').replace("tr_line_", "");
        //$("#tr_pop_bin_item_" + (index + 1)).css("background-color", "white");
        $(this).css("background-color", "white");
    });
    $("#tr_pop_bin_item_" + selectedindex).css("background-color", "#e6f0ff");
    $("#txt_pop_bin_item_selected_detail_id").val($("#td_pop_bin_item_detail_id_" + selectedindex).text());
    $("#txt_pop_bin_item_selected_line_index").val(selectedindex);

    var itemcode = $("#td_pop_bin_item_item_code_" + selectedindex).text();
    var itemname = $("#td_pop_bin_item_item_name_" + selectedindex).text();
    var detailid = $("#txt_pop_bin_item_selected_detail_id").val(); //$("#td_pop_batch_item_detail_id_" + selectedindex).text();
    var whscode = $("#cbo_pop_bin_item_whs_code_" + selectedindex).text();
    var item_def_bin = get_def_bin_by_item_whs(itemcode, whscode);

    var balqty = parseFloat(returnstringvalue($("#td_pop_bin_item_total_qty_" + selectedindex).text())) - parseFloat(returnstringvalue($("#td_pop_bin_item_total_qty_creation_" + selectedindex).text()));

    var lastrowindex = 0;
    $("#table_pop_item_bin_creation >tbody >tr").each(function () {
        if ($(this).find("td:eq(0)").text() == detailid) {
            $(this).show();
            lastrowindex = $(this).attr('id').replace("tr_pop_bin_creation_line_" + detailid + "_", "");
        }
        else {
            $(this).hide();
        }
    });

    var found = 0;
    $("#table_pop_item_bin_creation >tbody >tr").each(function () {
        if ($(this).find("td:eq(0)").text() == detailid) {
            found = 1;
            return false;
        }
    });
    if (found == 0) {
        lastrowindex++;
        $("#table_bin > tbody >tr").each(function () {
            if ($(this).find("td:eq(3)").text() == whscode) {
                var uomentry = $("#td_pop_bin_item_uom_entry_" + $("#txt_pop_bin_item_selected_line_index").val()).text();
                var data = "<tr id='tr_pop_bin_creation_line_" + detailid + "_" + lastrowindex + "'>";
                data = data + "<td style='display:none' id='td_pop_bin_creation_detail_id_" + detailid + "_" + lastrowindex + "'>" + detailid + "</td>";
                data = data + "<td style='display:none' id='td_pop_bin_creation_item_code_" + detailid + "_" + lastrowindex + "'>" + itemcode + "</td>";
                data = data + "<td style='display:none' id='td_pop_bin_creation_item_name_" + detailid + "_" + lastrowindex + "'>" + itemname + "</td>";
                data = data + "<td style='display:none' id='td_pop_bin_creation_whs_code_" + detailid + "_" + lastrowindex + "'>" + whscode + "</td>";
                data = data + "<td style='display:none' id='td_pop_bin_creation_bin_entry_" + detailid + "_" + lastrowindex + "'>" + $(this).find("td:eq(0)").text() + "</td>";
                data = data + "<td style='display:none' id='td_pop_bin_creation_uom_entry_" + detailid + "_" + lastrowindex + "'>" + uomentry + "</td>";
                data = data + "<td>" + $(this).find("td:eq(1)").text() + "</td>";
                if (item_def_bin == "") {
                    if ($(this).find("td:eq(5)").text() == $(this).find("td:eq(0)").text()) {
                        //alert("A");
                        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde quantity' id='td_pop_bin_creation_quantity_" + detailid + "_" + lastrowindex + "' onchange='txt_pop_bin_creation_quantity_change(" + lastrowindex + ")' placeholder='Allowcation Qty' value='" + convert2digit(balqty) + "'></div></td>";
                    }
                    else {
                        //alert("AA");
                        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde quantity' id='td_pop_bin_creation_quantity_" + detailid + "_" + lastrowindex + "' onchange='txt_pop_bin_creation_quantity_change(" + lastrowindex + ")' placeholder='Allowcation Qty' value='0.00' ></div></td>";
                    }
                }
                else {
                    if (item_def_bin == $(this).find("td:eq(0)").text()) {
                        //alert("B");
                        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde quantity' id='td_pop_bin_creation_quantity_" + detailid + "_" + lastrowindex + "' onchange='txt_pop_bin_creation_quantity_change(" + lastrowindex + ")' placeholder='Allowcation Qty' value='" + convert2digit(balqty) + "'></div></td>";
                    }
                    else {
                        //alert("BB");
                        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde quantity' id='td_pop_bin_creation_quantity_" + detailid + "_" + lastrowindex + "' onchange='txt_pop_bin_creation_quantity_change(" + lastrowindex + ")' placeholder='Allowcation Qty' value='0.00'></div></td>";
                    }
                }
                data = data + "<td style='display:none' id='td_pop_bin_creation_status_" + detailid + "_" + lastrowindex + "'>New</td>";
                data = data + "<td style='display:none' id='td_pop_bin_creation_line_num_" + detailid + "_" + lastrowindex + "'>-1</td>";
                data = data + "</tr>";
                $("#table_pop_item_bin_creation >tbody").append(data);
                $(".quantity").change(function () {
                    txt_pop_bin_creation_quantity_change(lastrowindex);
                    //var detailid = $("#txt_pop_bin_item_selected_detail_id").val();
                    //var qty = $("#td_pop_bin_creation_quantity_" + detailid + "_" + lastrowindex).val();
                    //alert(detailid);
                });
            }
            lastrowindex++;
        });
    }
    Running_Bin_Total_Qty_Created(detailid);
}
function txt_pop_bin_creation_quantity_change(id) {
    var detailid = $("#txt_pop_bin_item_selected_detail_id").val();
    var qty = $("#td_pop_bin_creation_quantity_" + detailid + "_" + id).val();
    $("#td_pop_bin_creation_quantity_" + detailid + "_" + id).val(convert2digit(qty));

    var sum_bin_qty = Running_Bin_Total_Qty_Created(detailid);
    var ori_qty = returnstringvalue($("#td_pop_bin_item_total_qty_" + $("#txt_pop_bin_item_selected_line_index").val()).text());
    if (parseFloat(ori_qty) < parseFloat(sum_bin_qty)) {
        ShowAlert("Bin Allocation quantity is greater than Total need");
        $("#td_pop_bin_creation_qty_" + detailid + "_" + id).val("0.00");
    }
    else {
        var balqty = parseFloat(ori_qty) - parseFloat(sum_bin_qty);
        $("#table_pop_item_bin_creation >tbody >tr").each(function () {
            var get_detail_id = $(this).attr('id').replace("tr_pop_bin_creation_line_", "").split("_");
            var d_id = get_detail_id[0];
            var row_id = get_detail_id[1];
            if ($("#td_pop_bin_creation_detail_id_" + d_id + "_" + row_id).text() == detailid) {
                if (parseFloat(returnstringvalue($("#td_pop_bin_creation_qty_" + d_id + "_" + row_id).val())) == 0) {
                    $("#td_pop_bin_creation_qty_" + d_id + "_" + row_id).val(convert2digit(balqty));
                    return false;
                }
            }
        });
    }
    Running_Bin_Total_Qty_Created(detailid);
}
function Running_Bin_Total_Qty_Created(detailid) {
    var sum_bin_qty = 0;
    $("#table_pop_item_bin_creation >tbody >tr").each(function () {
        var get_detail_id = $(this).attr('id').replace("tr_pop_bin_creation_line_", "").split("_");
        var d_id = get_detail_id[0];
        var row_id = get_detail_id[1];
        if ($("#td_pop_bin_creation_detail_id_" + d_id + "_" + row_id).text() == detailid) {
            var allowcateqty = $("#td_pop_bin_creation_quantity_" + d_id + "_" + row_id).val();
            sum_bin_qty = parseFloat(returnstringvalue(sum_bin_qty)) + parseFloat(returnstringvalue(allowcateqty));
        }
    });
    $("#td_pop_bin_item_total_qty_creation_" + $("#txt_pop_bin_item_selected_line_index").val()).text(convert2digit(sum_bin_qty));
    return sum_bin_qty;
}
function cmd_pop_update_bin_creation() {
    var detailid = $("#td_pop_bin_item_detail_id_" + $("#txt_pop_bin_item_selected_line_index").val()).text();
    //var sum_bin_qty = 0;
    //$("#table_pop_item_bin_creation >tbody>tr").each(function () {
    //    var get_detail_id = $(this).attr('id').replace("tr_pop_bin_creation_line_", "").split("_");
    //    var d_id = get_detail_id[0];
    //    var row_id = get_detail_id[1];
    //    if ($("#td_pop_bin_creation_detail_id_" + d_id + "_" + row_id).text() == detailid) {
    //        sum_bin_qty = parseFloat(returnstringvalue(sum_bin_qty)) + parseFloat(returnstringvalue($("#td_pop_bin_creation_qty_" + d_id + "_" + row_id).text()));
    //    }
    //});
    var allow = 0;
    var ori_qty = returnstringvalue($("#td_pop_bin_item_total_qty_" + $("#txt_pop_bin_item_selected_line_index").val()).text());
    var allocat_qty = returnstringvalue($("#td_pop_bin_item_total_qty_creation_" + $("#txt_pop_bin_item_selected_line_index").val()).text());
    if (parseFloat(ori_qty) > parseFloat(allocat_qty)) {
        ShowAlert("Allocation Quantity is smaller than Total Need");
        allow = 1;
    }
    if (allow == 0) {
        $("#table_pop_item_bin_creation >tbody>tr").each(function () {
            var get_detail_id = $(this).attr('id').replace("tr_pop_bin_creation_line_", "").split("_");
            var d_id = get_detail_id[0];
            var row_id = get_detail_id[1];
            if ($("#td_pop_bin_creation_detail_id_" + d_id + "_" + row_id).text() == detailid) {
                $("#td_pop_bin_creation_status_" + d_id + "_" + row_id).text("Update");
            }
        });
        ShowAlert("Bin was updated");
    }
}
function change_line_summary_whs(summary_id) {
    var whs_name = "name_line_detail_whs_" + summary_id;
    $("select[name=" + whs_name + "]").empty();
    var option = "";

    $("#cbo_line_summary_whs_" + summary_id + " > option").each(function () {
        if (this.value == $("#cbo_line_summary_whs_" + summary_id).val()) {
            option = option + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            option = option + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });
    $("select[name=" + whs_name + "]").append(option);
    var isbin = "";
    var whscode = $("#cbo_line_summary_whs_" + summary_id).val();
    $("#table_whs > tbody >tr").each(function () {
        if (whscode == $(this).find("td:eq(0)").text()) {
            isbin = $(this).find("td:eq(3)").text();
        }
    });
    if (isbin == "Y") {
        $("#dv_line_summary_bin_location_" + summary_id).show();
    }
    else {
        $("#dv_line_summary_bin_location_" + summary_id).hide();
    }
    var name = "name_line_detail_qty_" + summary_id;
    $("input[name=" + name + "]").each(function () {
        var d_id = $(this).attr('id').replace("txt_line_qty_", "");
        $("#td_line_enable_bin_" + d_id).text(isbin);
    });
}
function cbo_line_detail_whs_change(summaryid, detailid) {
    var whscode = $("#cbo_line_whs_" + detailid).val();
    var isbin = "";
    $("#table_whs > tbody >tr").each(function () {
        if (whscode == $(this).find("td:eq(0)").text()) {
            isbin = $(this).find("td:eq(3)").text();
        }
    });
    $("#td_line_enable_bin_" + detailid).text(isbin);
    if (isbin == "Y") {
        $("#dv_line_summary_bin_location_" + summaryid).show();
    }
}

function cmd_pop_choose_item(type) {
    //var option = "";
    var whs = "";
    var projectoption = "";
    var block = "";
    var mainworkoption = "";
    var floorwork = "";
    
    $("#cbo_ocrcode > option").each(function () {
        projectoption = projectoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });

    $("#table_block > tbody >tr").each(function () {
        block = block + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(1)").text() + "</option>";
    });

    $("#cbo_main_work > option").each(function () {
        mainworkoption = mainworkoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });

    worktype = "<option value=''></option>";
    $("#cbo_floor_work > option").each(function () {
        floorwork = floorwork + "<option value='" + this.value + "'>" + this.text + "</option>";
    });

    $('#table_line_item > tbody > tr:last').remove();
    var rowindex = $("#table_line_item >tbody >tr").length;
    if (typeof ($("#table_line_item >tbody").find("tr:last").attr("id")) == "undefined") {
        rowindex = 0;
    }
    else {
        var newrow = $("#table_line_item >tbody").find("tr:last").attr("id").replace("tr_line_", "");
        rowindex = parseInt(newrow) + 1;
    }
    $("#tr_line_999").remove();
    $("#table_popup_item_list > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("check_pop_master_", "");
            var itemname = $("#td_pop_master_item_name_" + id).text();
            if ($("#txtselectrowindex").val() != "999") {
                $("#txt_line_itemname_" + $("#txtselectrowindex").val()).val(itemname);
                $("#txtselectrowindex").val("999");
            }
            else {
                var option = "";
                var whs = "";
                var isbin = "";
                $("#table_uom_group > tbody >tr").each(function () {
                    if ($(this).find("td:eq(0)").text() == $("#td_pop_master_ugpentry_" + id).text()) {
                        option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                    }
                });

                $("#table_whs > tbody >tr").each(function () {
                    whs = whs + "<option value='" + $(this).find("td:eq(0)").text() + "'>" + $(this).find("td:eq(1)").text() + "</option>";
                    if (isbin == "") {
                        isbin = $(this).find("td:eq(3)").text();
                    }
                });

                tr = "<tr id='tr_line_" + rowindex + "'>";
                tr = tr + "<td><input type='checkbox' name='check' id='check_" + rowindex + "'></td>";
                tr = tr + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_by_line_grpo_non(" + rowindex + ")'><i class='fa fa-fw fa-remove'></i></span></td>";
                tr = tr + "<td><div class='input-group'><input type='text' class='form-control noborder' id='txt_line_item_name_" + rowindex + "' placeholder='Description' value='" + itemname + "'><div class='input-group-addon'><i class='fa fa-industry text-info' onclick='cmd_show_Item_list(" + rowindex + ")' style='cursor:pointer'></i></div></div></td >";

                if ($("#td_pop_master_manage_by_" + id).text() == "N") {
                    tr = tr + "<td><div class='form-group'><input type='text' style='text-align:left' class='form-control form-control-insde' id='txt_line_qty_" + rowindex + "' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
                }
                else {
                    tr = tr + "<td><div class='input-group'>";
                    tr = tr + "<input type='text' style='text-align:left' class='form-control form-control-insde' id='txt_line_qty_" + rowindex + "' value='0.00' onchange='change_line(" + rowindex + ")'>";
                    tr = tr + "<div class='input-group-addon'>";
                    tr = tr + "<i class='fa fa-circle text-info' onclick='cmd_line_summary_show_manage_by_click(1)' style='cursor: pointer'></i>";
                    tr = tr + "</div>";
                    tr = tr + "</div></td>";
                }

                tr = tr + "<td><div class='form-group'><select class='form-control' id='cbo_line_uom_" + rowindex + "'>" + option + "</select></div></td>";
                tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' readonly='readonly' id='txt_line_price_" + rowindex + "' placeholder = 'Price' value='0.0000'></div></td>";
                tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' readonly='readonly' id='txt_line_disc_per_" + rowindex + "' placeholder = 'Dis%' value='0.00'></div></td>";
                tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' readonly='readonly' id='txt_line_disc_amt_" + rowindex + "' placeholder = 'Dis Amt' value='0.00'></div></td>";
                tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' readonly='readonly' id='txt_line_total_" + rowindex + "' placeholder = 'Total' value='0.00'></div></td>";

                tr = tr + "<td><div class='input-group'>";
                tr = tr + "<select class='form-control' id='cbo_line_whs_" + rowindex + "' onchange='change_line_whs(" + rowindex + ")'>" + whs + "</select>";
                tr = tr + "<div class='input-group-addon' style='display:none' id='dv_line_isbin_" + rowindex + "'>";
                tr = tr + "<i class='fa fa-circle text-info' style='cursor: pointer' onclick='cmd_line_summary_show_bin_location_click(" + rowindex + ")'></i>";
                tr = tr + "</div>";
                tr = tr + "</div></td>"; 
                
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_ocrcode2_" + rowindex + "' onchange='get_line_house_list(" + rowindex + ")'>" + block + "</select></td>";


                tr = tr + "<td style='display:none' id='td_line_base_entry_" + rowindex + "'>-1</td>";
                tr = tr + "<td style='display:none' id='td_line_base_line_" + rowindex + "'>-1</td>";
                tr = tr + "<td style='display:none' id='td_line_base_obj_" + rowindex + "'>NA</td>";
                tr = tr + "<td style='display:none' id='td_line_line_num_" + rowindex + "'>-1</td>";
                tr = tr + "<td style='display:none' id='td_line_line_status_" + rowindex + "'>Active</td>";
                tr = tr + "<td style='display:none' id='td_line_brand_code_" + rowindex + "'></td>";
                tr = tr + "<td style='display:none' id='td_line_item_code_" + rowindex + "'>" + $("#td_pop_master_item_code_" + id).text() + "</td>";
                tr = tr + "<td style='display:none' id='td_line_item_name_" + rowindex + "'>" + itemname + "</td>";
                tr = tr + "<td style='display:none' id='td_line_global_code_" + rowindex + "'>" + $("#td_pop_master_global_code_" + id).text() + "</td>";

                tr = tr + "<td style='display:none' id='td_line_price_after_dis_" + rowindex + "'>0</td>";
                tr = tr + "<td style='display:none' id='td_line_net_total_price_" + rowindex + "'>0</td>";
                tr = tr + "<td style='display:none' id='td_line_vat_amount_" + rowindex + "'>0</td>";


                tr = tr + "<td style='display:none' id='td_line_cbo_ocrcode_" + rowindex + "'>" + $("#cbo_ocrcode").val() + "</td>";
                tr = tr + "<td style='display:none' id='td_line_ocrcode3_" + rowindex + "'></td>";

                tr = tr + "<td style='display:none' id='td_line_main_code_" + rowindex + "'></td>";
                tr = tr + "<td style='display:none' id='td_line_sub_code_" + rowindex + "'></td>";
                tr = tr + "<td style='display:none' id='td_line_floor_code_" + rowindex + "'></td>";


                tr = tr + "<td style='display:none' id='td_line_avail_po_" + rowindex + "'>0</td>";
                tr = tr + "<td style='display:none' id='td_line_enable_bin_" + rowindex + "'>N</td>";
                tr = tr + "<td style='display:none' id='td_line_is_batch_" + rowindex + "'>" + $("#td_pop_master_manage_by_" + id).text()+"</td>";
                tr = tr + "<td style='display:none' id='td_line_detail_id_" + rowindex + "'>" + rowindex + "</td>";
                

                tr = tr + "</tr >";
                $("#table_line_item>tbody").append(tr);
                rowindex++;
            }
        }
    });
    AddBlank();
    $("#modal_item_list").modal('hide');
    
    //cmd_pr_filter_pop_boq_check_all();
}
function AddBlank() {
    var rowindex = "999";
    tr = "<tr id='tr_line_" + rowindex + "'>";
    tr = tr + "<td></td>";
    tr = tr + "<td><span class='input-group-addon input-group-addon-remove' ><i class='fa fa-fw fa-remove'></i></span></td>";
    tr = tr + "<td><div class='input-group'><input type='text' class='form-control noborder' id='txt_line_itemname_" + rowindex + "' placeholder='Description'><div class='input-group-addon'><i class='fa fa-industry text-info' onclick='cmd_show_Item_list(" + rowindex + ")' style='cursor:pointer'></i></div></div></td >";

    tr = tr + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_qty_" + rowindex + "' value='0.00'></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control' id='cbo_line_uom_" + rowindex + "'></select></div></td>";
    tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_price_" + rowindex + "' placeholder = 'Price' value='0.0000' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_dis_per_" + rowindex + "' placeholder = 'Dis%' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_dis_amt_" + rowindex + "' placeholder = 'Dis Amt' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_line_total_" + rowindex + "' placeholder = 'Total' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control' id='cbo_line_whs_" + rowindex + "'></select></div></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_ocrcode2_" + rowindex + "' onchange='get_line_house_list(" + rowindex + ")'></select></td>";
    tr = tr + "<td style='display:none' id='td_base_line_num_" + rowindex + "'>-1</td>";
    tr = tr + "<td style='display:none' id='td_base_doc_entry_" + rowindex + "'>-1</td>";
    tr = tr + "<td style='display:none' id='td_base_obj_type_" + rowindex + "'>NA</td>";
    tr = tr + "<td style='display:none' id='td_line_num_" + rowindex + "'>-1</td>";
    tr = tr + "<td style='display:none' id='td_line_line_status_" + rowindex + "'>Active</td>";
    tr = tr + "<td style='display:none' id='td_line_brand_code_" + rowindex + "'></td>";
    tr = tr + "<td style='display:none' id='td_line_item_code_" + rowindex + "'></td>";
    tr = tr + "<td style='display:none' id='td_line_global_code_" + rowindex + "'></td>";
    tr = tr + "<td style='display:none' id='td_line_price_after_discount_" + rowindex + "'>0</td>";
    tr = tr + "<td style='display:none' id='td_line_vat_amount_" + rowindex + "'>0</td>";
    tr = tr + "</tr >";
    $("#table_line_item>tbody").append(tr);
}
function cmd_update_cost_all_row_grpo_non() {
    var ocrcode = "";
    var ocrcode2 = "";
    var ocrcode3 = "";
    var ocrcode4 = "";
    var mainworkoption = "";
    var subwork = "";
    var detailwork = "";
    var floorwork = "";
    ///projectoption = "<option value=''></option>";
    //$("#cbo_ocrcode > option").each(function () {
    //    if (this.value == $("#cbo_ocrcode").val()) {
    //        ocrcode = ocrcode + "<option value='" + this.value + "' selected>" + this.text + "</option>";
    //    }
    //    else {
    //        ocrcode = ocrcode + "<option value='" + this.value + "'>" + this.text + "</option>";
    //    }
    //});
    $("#cbo_ocrcode2 > option").each(function () {
        if (this.value == $("#cbo_ocrcode2").val()) {
            ocrcode2 = ocrcode2 + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            ocrcode2 = ocrcode2 + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });
    //$("#cbo_ocrcode3 > option").each(function () {
    //    if (this.value == $("#cbo_ocrcode3").val()) {
    //        ocrcode3 = ocrcode3 + "<option value='" + this.value + "' selected>" + this.text + "</option>";
    //    }
    //    else {
    //        ocrcode3 = ocrcode3 + "<option value='" + this.value + "'>" + this.text + "</option>";
    //    }
    //});

    ////mainworkoption = "<option value=''></option>";
    //$("#cbo_main_work > option").each(function () {
    //    if (this.value == $("#cbo_main_work").val()) {
    //        mainworkoption = mainworkoption + "<option value='" + this.value + "' selected>" + this.text + "</option>";
    //    }
    //    else {
    //        mainworkoption = mainworkoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    //    }
    //});

    //$("#cbo_sub_work > option").each(function () {
    //    if (this.value == $("#cbo_sub_work").val()) {
    //        subwork = subwork + "<option value='" + this.value + "' selected>" + this.text + "</option>";
    //    }
    //    else {
    //        subwork = subwork + "<option value='" + this.value + "'>" + this.text + "</option>";
    //    }
    //});

    /////worktype = "<option value=''></option>";
    //$("#cbo_floor_work > option").each(function () {
    //    if (this.value == $("#cbo_floor_work").val()) {
    //        floorwork = floorwork + "<option value='" + this.value + "' selected>" + this.text + "</option>";
    //    }
    //    else {
    //        floorwork = floorwork + "<option value='" + this.value + "'>" + this.text + "</option>";
    //    }
    //});


    $('#table_line_item > tbody  > tr').each(function (index, tr) {
        var id = tr.id.replace("tr_line_", "");
        if (id != "999") {
            //$("#txt_line_ocrcode_" + id).empty();
            //$("#txt_line_ocrcode_" + id).append(ocrcode);
            $("#txt_line_ocrcode2_" + id).empty();
            $("#txt_line_ocrcode2_" + id).append(ocrcode2);
            //$("#txt_line_ocrcode3_" + id).empty();
            //$("#txt_line_ocrcode3_" + id).append(ocrcode3);

            //$("#txt_line_main_work_" + id).empty();
            //$("#txt_line_main_work_" + id).append(mainworkoption);

            //$("#txt_line_sub_work_" + id).empty();
            //$("#txt_line_sub_work_" + id).append(subwork);

            //$("#txt_line_pr_floor_work_" + id).empty();
            //$("#txt_line_pr_floor_work_" + id).append(floorwork);

            $("#td_line_ocrcode3_" + id).text($("#cbo_ocrcode3").val());
            $("#td_line_main_code_" + id).text($("#cbo_main_work").val());
            $("#td_line_sub_code_" + id).text($("#cbo_sub_work").val());
            $("#td_line_floor_code_" + id).text($("#cbo_floor_work").val());
            ////alert("ocr3" + $("#cbo_ocrcode3").val() + "/main" + $("#cbo_main_work").val() + "/sub" + $("#cbo_sub_work").val() + "/floor" + $("#cbo_floor_work").val());

        }
    });
}

function cmd_view_data_document(isboq, boqtype) {
    var itemgroup = $("#cbo_pop_up_search_sub_group").val();
    var itemdesc = $("#txt_pop_up_search_item").val();
    //var copy_from = $("#txt_copy_from").val();
    //var url = "";
    //alert($("#txt_copy_from").val());
    //switch ($("#txt_copy_from").val()) {
    //    case "PR":
    //        url = "/getData/get_pr1";
    //        break;
    //    case "PQ":
    //        url = "/getData/get_pq1";
    //        break;
    //    case "PO":
    //        url = "/getData/get_po1";
    //        break;
    //    case "GRPO":
    //        url = "/getData/get_grpo1";
    //        break;
    //}
    $.ajax({
        url: "/getData/get_po1",
        type: 'POST',
        data: {
            prn: $("#txt_pop_up_search_doc_num").val(), itemgroup: itemgroup, itemdesc: itemdesc
            , isBoq: isboq, BoqType: boqtype, procode: $("#cbo_ocrcode").val(), cardcode: $("#txt_vendor_code").val()
        },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#table_popup_document_list >tbody>tr").remove();
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                var tr = "<tr id='tr_pop_boq_" + i + "'>";
                tr = tr + "<td><input type='checkbox' name='chk' id='check_pop_boq_" + i + "'/></td>";
                tr = tr + "<td id='td_pop_line_filer_base_doc_num_" + i + "'>" + x.DocNum + "</td>";
                tr = tr + "<td id='td_pop_line_filer_type_" + i + "'>" + x.Type + "</td>";
                tr = tr + "<td id='td_pop_line_filer_item_name_" + i + "'>" + x.ItemName + "</td>";
                tr = tr + "<td id='td_pop_line_filer_boq_qty_" + i + "'>" + convert2digit(x.Quantity) + "</td>";
                tr = tr + "<td id='td_pop_line_filer_ocrcode3_name_" + i + "'>" + x.OcrCode3Name + "</td>";
                tr = tr + "<td id='td_pop_line_filer_main_name_" + i + "'>" + x.MainWorkName + "</td>";
                tr = tr + "<td id='td_pop_line_filer_floor_name_" + i + "'>" + x.SubWorkName + "</td>";

                tr = tr + "<td style='display:none' id='td_pop_line_filer_base_entry_" + i + "'>" + x.DocEntry + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_base_line_" + i + "'>" + x.LineNum + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_base_obj_" + i + "'>" + $("#txt_copy_from").val() + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_globalcode_" + i + "'>" + x.GlobalCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_item_code_" + i + "'>" + x.ItemCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_uom_" + i + "'>" + x.UoMEntry + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_ugpentry_" + i + "'>" + x.UgpEntry + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_whs_" + i + "'>" + x.WhsCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_ocrcode_" + i + "'>" + x.OcrCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_ocrcode_name_" + i + "'>" + x.OcrCodeName + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_ocrcode2_" + i + "'>" + x.OcrCode2 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_ocrcode2_name_" + i + "'>" + x.OcrCode2Name + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_ocrcode3_" + i + "'>" + x.OcrCode3 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_ocrcode3_name_" + i + "'>" + x.OcrCode3Name + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_main_code_" + i + "'>" + x.MainworkCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_sub_code_" + i + "'>" + x.SubWorkCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_floor_code_" + i + "'>" + x.FloorWorkCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_floor_name_" + i + "'>" + x.FloorName + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_last_pur_" + i + "'>" + x.LastPurchasePrice + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_avail_qty_" + i + "'>" + x.BalanceQuantity + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_manage_by_" + i + "'>" + x.ManageBy + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_qty_" + i + "'>" + returnstringvalue(x.BalanceQuantity) + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_brand_code_" + i + "'>" + x.ItemBrandCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_brand_name_" + i + "'>" + x.ItemBrandName + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_brand_code_" + i + "'>" + x.ItemBrandCode + "</td>";

                tr = tr + "<td style='display:none' id='td_pop_line_filer_uprice_" + i + "'>" + x.UPrice + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_dis_per_" + i + "'>" + x.DiscountPer + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_dis_amt_" + i + "'>" + x.DiscountAmt + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_line_total_" + i + "'>" + x.LineTotal + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_net_price_" + i + "'>" + x.NetPrice + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_price_after_dis_" + i + "'>" + x.PriceAftDisc + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_uom_name_" + i + "'>" + x.UoMName + "</td>";
                tr = tr + "</tr>";
                $("#table_popup_document_list >tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}

function cmd_save_grpo_detail(type, boqtype) {
    allow = 0;
    lineno = 0;
    var summary_list = [];
    var detail_list = [];
    var batch_list = [];
    var bin_list = [];
    var del_list = [];

    if ($("#txt_vendor_name").val() == "") {
        ShowAlert("Vendor Name is required");
        allow = 1;
    }
    $('#table_line_item > tbody  > tr').each(function (index, tr) {
        var detailid = $(this).attr('id').replace("tr_line_", "");
        if ($("#td_line_is_batch_" + detailid).text() == "B") {
            //$("#table_pop_item_batch_creation >tbody>tr").each(function () {
            //    var get_detail_id = $(this).attr('id').replace("tr_pop_batch_creation_line_", "").split("_");
            //    var d_id = get_detail_id[0];
            //    var id = get_detail_id[1];
            //    var det_id = d_id + "_" + id;
            //    if ($("#td_pop_batch_creation_batch_num_" + det_id).val() == "") {
            //        allow = 60;
            //        return false;
            //    }
            //});
            
            var det_id = $("#td_line_detail_id_" + detailid).text();
            var sum_batch_qty = check_batch_qty(det_id);
            
            if (parseFloat(returnstringvalue($("#txt_line_qty_" + detailid).val())) != parseFloat(sum_batch_qty)) {
                allow = 50;
                itemname = $("#line_detail_item_name_" + detailid).val();
                return false;
            }
        }
    });
    $('#table_line_item > tbody  > tr').each(function (index, tr) {
        var detailid = $(this).attr('id').replace("tr_line_", "");
        if (detailid != "999") {
            if ($("#td_line_ocrcode3_" + detailid).text() == "" || $("#td_line_main_code_" + detailid).text() == ""
                || $("#td_line_sub_code_" + detailid).text() == "" || $("#td_line_floor_code_" + detailid).text() == "") {
                allow = 2;
                return false;
            }
        }
    });

    if (allow == 50) {
        if ($("#txt_dockey").val() != -1) {
            cmd_line_summary_show_manage_by_click_edit(1);
        } else {
            cmd_line_summary_show_manage_by_click(1);
        }
    }
    if (allow == 2) {
        ShowAlert("Make sure you update House No, Main Work, Sub Work and Floor Work");
    }
    if (allow == 0) {
        $('#tbl_Remove_List > tbody  > tr').each(function (i, t) {
            var del = {
                DocEntry: $("#txt_dockey").val(),
                GRPOHLine: $("#HeadLine_" + i).text(),
                LineNum: $("#DetailLine_" + i).text()
            };
            del_list.push(del);
        });
        var docdate = $('#txt_doc_date').val().trim().split("-");
        var reqdate = $('#txt_due_date').val().trim().split("-");
        var head = {
            DocEntry: $("#txt_dockey").val(),
            DocDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            ValidDate: reqdate[2] + "/" + reqdate[1] + "/" + reqdate[0],
            CardCode: $("#txt_vendor_code").val(),
            CardName: $("#txt_vendor_name").val(),
            ContactPer: $("#cbo_vendor_contact").val(),
            DocType: "I",
            SubTotal: returnstringvalue($("#txt_sub_total").val()),
            Discount: returnstringvalue($("#txt_doc_dis_amt").val()),
            DiscountPer: returnstringvalue($("#txt_doc_dis_per").val()),
            VATAmt: returnstringvalue($("#txt_tax").val()),
            DocTotal: returnstringvalue($("#txt_doc_total").val()),
            TermCode: $("#cbo_payment_term").val(),
            TaxGroup: $("#cbo_payment_term").val(),
            CreatedBy: $("#txt_shared_userid").val(),
            OcrCode: $("#cbo_ocrcode").val(),
            Memo: $("#txt_remark").val(),
            NumatCard: $("#txt_vendor_ref").val(),
            IsBOQ: type,
            BOQType: boqtype,
            Receiver: $("#txt_receiver").val()
        };
        
        $('#table_line_item > tbody  > tr').each(function (index, tr) {
            var detailid = $(this).attr('id').replace("tr_line_", "");
            if (detailid != "999") {
                var detail = {
                    LineNum: $("#td_line_line_num_" + detailid).text(),
                    BaseEntry: $("#td_line_base_entry_" + detailid).text(),
                    BaseLine: $("#td_line_base_line_" + detailid).text(),
                    BaseType: $("#td_line_base_obj_" + detailid).text(),
                    ItemCode: $("#td_line_item_code_" + detailid).text(),
                    ItemName: $("#td_line_item_name_" + detailid).text(),
                    GRPOHLine:0,
                    NoofHouse: "0",
                    POQty: returnstringvalue($("#td_line_avail_po_" + detailid).text()),
                    Quantity: returnstringvalue($("#txt_line_qty_" + detailid).val()),
                    ActQty: "0.00",
                    ApplyQuantity: "0.00",
                    UoMEntry: $("#cbo_line_uom_" + detailid).val(),
                    UPrice: returnstringvalue($("#txt_line_price_" + detailid).val()),
                    DisPer: returnstringvalue($("#txt_line_disc_per_" + detailid).val()),
                    DisAmount: returnstringvalue($("#txt_line_disc_amt_" + detailid).val()),
                    LineTotal: returnstringvalue($("#txt_line_total_" + detailid).val()),
                    WhsCode: $("#cbo_line_whs_" + detailid).val(),
                    OcrCode: $("#cbo_ocrcode").val(),
                    OcrCode2: $("#txt_line_ocrcode2_" + detailid).val(),
                    OcrCode3: $("#td_line_ocrcode3_" + detailid).text(),

                    MainworkCode: $("#td_line_main_code_" + detailid).text(),
                    SubWorkCode: $("#td_line_sub_code_" + detailid).text(),
                    FloorWorkCode: $("#td_line_floor_code_" + detailid).text(),

                    GlobalCode: $("#td_line_global_code_" + detailid).text(),
                    NetPrice: returnstringvalue($("#td_line_net_total_price_" + detailid).text()),
                    PriceAftDisc: returnstringvalue($("#td_line_price_after_dis_" + detailid).text()),
                    DetailWorkCode: $("#td_line_detail_id_" + detailid).text(),
                    CompleteTerm1: $("#td_line_enable_bin_" + detailid).text()
                };
                detail_list.push(detail);
            }
        });
        $("#table_pop_item_batch_creation >tbody>tr").each(function () {
            var get_detail_id = $(this).attr('id').replace("tr_pop_batch_creation_line_", "").split("_");
            var d_id = get_detail_id[0];
            var id = get_detail_id[1];
            var detailid = d_id + "_" + id;
            var status = $("#td_pop_batch_creation_status_" + detailid).text();
            if (status == "Update") {
                var exp = ($("#td_pop_batch_creation_expired_date_" + detailid).val() == "" ? "01-Jan-1999" : $("#td_pop_batch_creation_expired_date_" + detailid).val()).split("-");
                var man = ($("#td_pop_batch_creation_man_date_" + detailid).val() == "" ? "01-Jan-1999" : $("#td_pop_batch_creation_man_date_" + detailid).val()).split("-");
                var adm = ($("#td_pop_batch_creation_adm_date_" + detailid).val() == "" ? "01-Jan-1999" : $("#td_pop_batch_creation_adm_date_" + detailid).val()).split("-");

                var summary = {
                    ItemCode: $("#td_pop_batch_creation_item_code_" + detailid).text(),
                    ItemName: $("#td_pop_batch_creation_item_name_" + detailid).text(),
                    BatchNum: $("#td_pop_batch_creation_batch_num_" + detailid).val(),
                    BatchQty: $("#txt_pop_batch_creation_qty_" + detailid).val(),
                    ExpDate: exp[2] + "/" + exp[1] + "/" + exp[0],
                    ManDate: man[2] + "/" + man[1] + "/" + man[0],
                    AdmDate: adm[2] + "/" + adm[1] + "/" + adm[0],
                    //BaseType: "GRPO",
                    //BaseEntry: $("#td_pop_batch_creation_detail_id_" + detailid).val(),
                    //Baseline: $("#td_pop_batch_creation_detail_id_" + detailid).val(),
                    UoMEntry: $("#td_pop_batch_creation_uom_entry_" + detailid).text(),
                    Detail_ID: d_id
                };
                batch_list.push(summary);
            }
        });
        $("#table_pop_item_bin_creation >tbody>tr").each(function () {
            var get_detail_id = $(this).attr('id').replace("tr_pop_bin_creation_line_", "").split("_");
            var d_id = get_detail_id[0];
            var id = get_detail_id[1];
            var detailid = d_id + "_" + id;
            var status = $("#td_pop_bin_creation_status_" + detailid).text();
            if (returnstringvalue($("#td_pop_bin_creation_quantity_" + detailid).val()) > 0) {
                var summary = {
                    ItemCode: $("#td_pop_bin_creation_item_code_" + detailid).text(),
                    ItemName: $("#td_pop_bin_creation_item_name_" + detailid).text(),
                    BinEntry: $("#td_pop_bin_creation_bin_entry_" + detailid).text(),
                    WhsCode: $("#td_pop_bin_creation_whs_code_" + detailid).text(),
                    BinQty: returnstringvalue($("#td_pop_bin_creation_quantity_" + detailid).val()),
                    UoMEntry: $("#td_pop_bin_creation_uom_entry_" + detailid).text(),
                    Detail_ID: d_id
                };
                bin_list.push(summary);
            }
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/purgrpo/cmd_save_summary_detail_material',
            data: JSON.stringify(
                {
                    'header': head,
                    'detail': detail_list,
                    'summary': summary_list,
                    'batch': batch_list,
                    'bin': bin_list,
                    'delList': del_list
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
                        ShowAlert("PR Quantity is greater than BOQ Quantity");
                    }
                    if (data.status == "400") {
                        ShowAlert("Not found BOQ information for PR input");
                    }
                    if (data.status == "500") {
                        ShowAlert("This Purchase Request No already integrated to SAP");
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


