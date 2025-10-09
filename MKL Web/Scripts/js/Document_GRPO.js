
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
function tr_pop_batch_item_selected(selectedindex, status) {
    var def_status = "";
    if (status == 1) {
        def_status = "New";
    }
    else {
        def_status = "Update";
    }
    $("#table_pop_item_batch_item > tbody > tr").each(function (index) {
        //var detail_id = $(this).attr('id').replace("tr_detail_", "");
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
    ////clear status="New"
    //$("#table_pop_item_batch_creation >tbody >tr").each(function () {
    //    var get_id = $(this).attr('id').replace("tr_pop_batch_creation_line_", "").split("_");
    //    if ($("#td_pop_batch_creation_status_" + get_id[0] + "_" + get_id[1]).text() == "New") {
    //        $(this).remove();
    //    }
    //});
    var lastrowindex = 0;
    var balqty = 0;
    var sumqty = 0;
    $("#table_pop_item_batch_creation >tbody >tr").each(function () {
        if ($(this).find("td:eq(0)").text() == detailid) {
            $(this).show();
            lastrowindex = $(this).attr('id').replace("tr_pop_batch_creation_line_"+detailid +"_", "");
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

    var qty = $("#txt_pop_batch_creation_qty_" + detail_id+ "_" + id).val();
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
    else if (balqty>0) {
        NewBlankBatch(detail_id, itemcode, itemname, brandname, balqty,"");
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
    var data = "<tr name='name_tr_pop_batch_creation_line_" + detailid + "' id='tr_pop_batch_creation_line_" + detailid + "_" + lastrowindex + "'>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_detail_id_" + detailid + "_" + lastrowindex + "'>" + detailid + "</td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_item_code_" + detailid + "_" + lastrowindex + "'>" + itemcode + "</td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_item_name_" + detailid + "_" + lastrowindex + "'>" + itemname + "</td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_uom_entry_" + detailid + "_" + lastrowindex + "'>" + uomentry + "</td>";

    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_pop_batch_creation_remove(/"+param+"/)'></i></td>";
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
    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_pop_batch_creation_remove(" + detailid + "," + lastrowindex + ")'></i></td>";
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
function cmd_pop_batch_creation_remove(creation_id,rowindex) {
    //var x = creation_id.ToString().split("_");
    //var id = x[0].replace("/", "") + "_" + x[1].replace("/", "");
    $("#tr_pop_batch_creation_line_" + creation_id + "_" + rowindex).remove();
    //$("#td_pop_batch_creation_status_" + id).text("deleted");
    //$("#tr_pop_batch_creation_line_" + id).hide();
    //Running_Total_Qty_Created(x[0].replace("/", ""));
    Running_Total_Qty_Created(creation_id);
}
function cmd_line_summary_show_manage_by_click(showpop,def_status) {
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
    var status = "New";
    $("#table_summary_detail >tbody>tr").each(function (index) {
        var detail_id = $(this).attr('id').replace("tr_detail_", "");
        if ($("#line_detail_item_managed_by_" + detail_id).text() == "B") {
            var data = "<tr id='tr_pop_batch_item_" + index + "' onclick='tr_pop_batch_item_selected(" + index + ",1)'>";
            data = data + "<td id='td_pop_batch_item_brand_name_" + index + "'>" + $("#line_detail_item_brand_name_" + detail_id).text() + "</td>";
            data = data + "<td id='td_pop_batch_item_item_code_" + index + "'>" + $("#line_detail_item_code_" + detail_id).text() + "</td>";
            data = data + "<td id='td_pop_batch_item_item_name_" + index + "'>" + $("#line_detail_item_name_" + detail_id).text() + "</td>";
            data = data + "<td>" + $("#line_detail_item_house_name_" + detail_id).text() + "</td>";
            data = data + "<td>" + $("#line_detail_item_floor_name_" + detail_id).text() + "</td>";
            data = data + "<td  id='td_pop_batch_item_total_qty_" + index + "'>" + $("#txt_line_detail_qty_" + detail_id).val() + "</td>";
            data = data + "<td>" + $("#cbo_line_detail_uom_" + detail_id + " option:selected").text() + "</td>";
            data = data + "<td id='td_pop_batch_item_total_qty_creation_" + index + "'>0.00</td>";
            data = data + "<td  style='display:none' id='td_pop_batch_item_detail_id_" + index + "'>" + detail_id + "</td>";
            data = data + "<td style='display:none' id='td_pop_batch_item_uom_entry_" + index + "'>" + $("#cbo_line_detail_uom_" + detail_id).val() + "</td>";
            data = data + "</tr>";
            $("#table_pop_item_batch_item >tbody").append(data);
            tr_pop_batch_item_selected(index,2);
        }
    });
    tr_pop_batch_item_selected("-1", 1);
}
function cmd_line_summary_show_manage_by_click_edit(showpop, def_status) {
    if (showpop == 1) {
        $("#modal_batch_list").modal('show');
    }
    else {
        $("#modal_batch_list").modal('hide');
    }
}

//for Bin
function cmd_line_detail_show_bin_location_click(detailid) {
    $("#modal_bin_list").modal('show');
    $("#table_pop_item_bin_item >tbody >tr").remove();

    $("#table_summary_detail >tbody>tr").each(function (index) {
        var detail_id = $(this).attr('id').replace("tr_detail_", "");
        if ($("#line_detail_item_enable_bin_" + detail_id).text() == "Y") {
            var data = "<tr id='tr_pop_bin_item_" + index + "' onclick='tr_pop_bin_item_selected(" + index + ")'>";
            data = data + "<td id='td_pop_bin_item_item_code_" + index + "'>" + $("#line_detail_item_code_" + detail_id).text() + "</td>";
            data = data + "<td id='td_pop_bin_item_item_name_" + index + "'>" + $("#line_detail_item_name_" + detail_id).text() + "</td>";
            data = data + "<td style='display:none' id='cbo_pop_bin_item_whs_code_" + index + "'>" + $("#cbo_line_detail_whs_" + detail_id).val() + "</td>";
            data = data + "<td>" + $("#cbo_line_detail_whs_" + detail_id + " option:selected").text() + "</td>";
            data = data + "<td  id='td_pop_bin_item_total_qty_" + index + "'>" + $("#txt_line_detail_qty_" + detail_id).val() + "</td>";
            data = data + "<td>" + $("#cbo_line_detail_uom_" + detail_id + " option:selected").text() + "</td>";
            data = data + "<td id='td_pop_bin_item_total_qty_creation_" + index + "'>0.00</td>";
            data = data + "<td  style='display:none' id='td_pop_bin_item_detail_id_" + index + "'>" + detail_id + "</td>";
            data = data + "<td  style='display:none' id='td_pop_bin_item_uom_entry_" + index + "'>" + $("#cbo_line_detail_uom_" + detail_id).val() + "</td>";
            data = data + "</tr>";
            $("#table_pop_item_bin_item >tbody").append(data);
            tr_pop_bin_item_selected(index);
        }
    });
    tr_pop_bin_item_selected("-1");
}
function cmd_line_detail_show_bin_location_click_edit(detailid) {
    $("#modal_bin_list").modal('show');
}

function tr_pop_bin_item_selected(selectedindex) {
    $("#table_pop_item_bin_item > tbody > tr").each(function (index) {
        //var detail_id = $(this).attr('id').replace("tr_detail_", "");
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
                var data = "<tr name='name_tr_pop_bin_creation_line_" + detailid + "' id='tr_pop_bin_creation_line_" + detailid + "_" + lastrowindex + "'>";
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
                        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='td_pop_bin_creation_qty_" + detailid + "_" + lastrowindex + "' placeholder='Allowcation Qty' value='" + convert2digit(balqty) + "' ​onchange='txt_pop_bin_creation_qty_change(" + lastrowindex + ")'></div></td>";
                    }
                    else {
                        //alert("AA");
                        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='td_pop_bin_creation_qty_" + detailid + "_" + lastrowindex + "' placeholder='Allowcation Qty' value='0.00' onchange='txt_pop_bin_creation_qty_change(" + lastrowindex + ")'></div></td>";
                    }
                }
                else {
                    if (item_def_bin == $(this).find("td:eq(0)").text()) {
                        //alert("B");
                        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='td_pop_bin_creation_qty_" + detailid + "_" + lastrowindex + "' placeholder='Allowcation Qty' value='" + convert2digit(balqty) + "' onchange='txt_pop_bin_creation_qty_change(" + lastrowindex + ")'></div></td>";
                    }
                    else {
                        //alert("BB");
                        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='td_pop_bin_creation_qty_" + detailid + "_" + lastrowindex + "' placeholder='Allowcation Qty' value='0.00' onchange='txt_pop_bin_creation_qty_change(" + lastrowindex + ")'></div></td>";
                    }
                }
                data = data + "<td style='display:none' id='td_pop_bin_creation_status_" + detailid + "_" + lastrowindex + "'>New</td>";
                data = data + "<td style='display:none' id='td_pop_bin_creation_line_num_" + detailid + "_" + lastrowindex + "'>-1</td>";
                data = data + "</tr>";
                $("#table_pop_item_bin_creation >tbody").append(data);
            }
            lastrowindex++;
        });
    }
    Running_Bin_Total_Qty_Created(detailid);
}
function txt_pop_bin_creation_qty_change(id) {
    var detailid = $("#txt_pop_bin_item_selected_detail_id").val();
    var qty = $("#td_pop_bin_creation_qty_" + detailid + "_" + id).val();
    $("#td_pop_bin_creation_qty_" + detailid + "_" + id).val(convert2digit(qty));
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
            sum_bin_qty = parseFloat(returnstringvalue(sum_bin_qty)) + parseFloat(returnstringvalue($("#td_pop_bin_creation_qty_" + d_id + "_" + row_id).val()));
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
function cbo_line_detail_whs_change(summaryid,detailid) {
    var whscode = $("#cbo_line_detail_whs_" + detailid).val();
    var isbin = "";
    $("#table_whs > tbody >tr").each(function () {
        if (whscode == $(this).find("td:eq(0)").text()) {
            isbin = $(this).find("td:eq(3)").text();
        }
    });
    $("#line_detail_item_enable_bin_" + detailid).text(isbin);
    if (isbin == "Y") {
        $("#dv_line_detail_bin_location_" + detailid).show();
    } else {
        $("#dv_line_detail_bin_location_" + detailid).hide();
    }
} 
function remove_bin_batch_by_detail(detailid) {
    var binHead = "tr_pop_bin_item_" + detailid;
    var binDetatil = "name_tr_pop_bin_creation_line_" + detailid;
    var batchHead = "tr_pop_batch_item_" + detailid;
    var batchDetatil = "name_tr_pop_batch_creation_line_" + detailid;
    $("#" + binHead).remove();
    $("[name=" + binDetatil + "]").remove();
    $("#" + batchHead).remove();
    $("[name=" + batchDetatil + "]").remove();
}
//event Change
function sum_sub_total_by_detail() {
    var sum_sub_total = 0;
    $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text() == "S") {
            sum_sub_total = returnstringvalue(sum_sub_total);
        }
        else {
            var detailid = $(this).attr('id').replace("tr_detail_", "");
            sum_sub_total = parseFloat(returnstringvalue(sum_sub_total)) + parseFloat(returnstringvalue($("#txt_line_detail_total_" + detailid).val()));
        }
    });
    $("#txt_sub_total").val(convert2digit(returnstringvalue(sum_sub_total)));
    sum_doc_total(sum_sub_total);
}
function cmd_line_remove_grpo_summary(summaryid) {
    var namedetail = "";
    if ($("#txt_line_summary_line_num_" + summaryid).text() != -1) {
        add_to_tbl_remove_by_summary_grpo(summaryid);
    }
    else {
        namedetail= "name_tr_detail_" + summaryid;
        $("[name=" + namedetail + "]").each(function () {
            var detail_id = $(this).attr('id').replace("tr_detail_", "");
            remove_bin_batch_by_detail($("#line_detail_item_detail_id_" + detail_id).text());
        });
    }
    namedetail = "name_tr_detail_" + summaryid;
    $("#td_summary_" + summaryid).remove();
    $("[name=" + namedetail + "]").remove();
    ReCalculate_detail_Total_for_Last_Line_grpo(summaryid);
    sum_sub_total_by_detail();
}
function cmd_line_remove_grpo_detail_document(detail_id, summaryid) {
    if ($("#line_detail_line_num_" + detail_id).text() != -1) {
        add_to_tbl_remove($("#txt_line_summary_line_num_" + summaryid).text(), $("#line_detail_line_num_" + detail_id).text());
    }
    remove_bin_batch_by_detail($("#line_detail_item_detail_id_" + detail_id).text());
    $("#tr_detail_" + detail_id).remove();
    ReCalculate_detail_Total_for_Last_Line_grpo(summaryid);
    sum_sub_total_by_detail();
}
function cmd_remove_grpo_summary_detail_all_document_row() {
    $("#table_summary_detail > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var detail_id = this.id.replace("checkbox_line_detail_checkbox_", "");
            var summary_id = $(this).attr('name').replace("name_line_detail_checkbox_", "");
            cmd_line_remove_grpo_detail_document(detail_id, summary_id);
        }
    });
}
function change_line_qty_summary_grpo(summaryid) {
    var rowCounter = 0;
    var qty = returnstringvalue($("#txt_line_summary_qty_" + summaryid).val());
    $("#txt_line_summary_qty_" + summaryid).val(convert2digit(qty));
    var name_qty_detail = "name_detail_qty_" + summaryid;
    rowCounter = $("input[name=" + name_qty_detail + "]").length;
    qty = parseFloat(qty) / parseFloat(rowCounter);
    $("input[name=" + name_qty_detail + "]").each(function () {
        var detail_id = $(this).attr('id').replace("txt_line_detail_qty_", "");
        $("#txt_line_detail_qty_" + detail_id).val(convert2digit(qty)).change();
    });
}
function change_line_detail_grpo(detailid, summaryid, type) {
    var qty = returnstringvalue($("#txt_line_detail_qty_" + detailid).val());
    var price = returnstringvalue($("#txt_line_detail_price_" + detailid).val());
    var discper = returnstringvalue($("#txt_line_detail_disc_per_" + detailid).val());
    var discamt = returnstringvalue($("#txt_line_detail_disc_amt_" + detailid).val());
    var total = returnstringvalue($("#txt_line_detail_total_" + detailid).val());
    var price_after_discount = 0;

    $("#txt_line_detail_qty_" + detailid).val(convert2digit(qty));
    $("#txt_line_detail_price_" + detailid).val(convert4digit(price));
    $("#txt_line_detail_disc_per_" + detailid).val(convert2digit(discper));
    $("#txt_line_detail_total_" + detailid).val(convert2digit(discamt));

    if (type == 3) {
        ///Change Dis %
        if (parseFloat(discper) == 0) {
            price_after_discount = price;
        }
        else {
            //price_after_discount = parseFloat(qty) * parseFloat(price);
            price_after_discount = parseFloat(price) - (price * (parseFloat(discper) / 100));
            discamt = (price * (parseFloat(discper) / 100));
            $("#txt_line_detail_disc_amt_" + detailid).val(convert2digit(discamt));
        }
    }
    else if (type == 4) {
        //Change Dis Amount
        if (parseFloat(discamt) == 0) {
            price_after_discount = price;
        }
        else {
            //price_after_discount = parseFloat(qty) * parseFloat(price);
            $("#txt_line_detail_disc_per_" + detailid).val("0.00");
            discper = (discamt / price) * 100;
            price_after_discount = parseFloat(price) - (price * (parseFloat(discper) / 100));
            $("#txt_line_detail_disc_per_" + detailid).val(convert2digit(discper));
        }
    }
    else {
        discamt = (price * (parseFloat(discper) / 100));
        $("#txt_line_detail_disc_amt_" + detailid).val(convert2digit(discamt));
        price_after_discount = parseFloat(price) - parseFloat(discamt);
    }

    $("#txt_line_detail_price_after_dis_" + detailid).text(price_after_discount);
    total = parseFloat(qty) * parseFloat(price_after_discount)
    total = convert4digit(total);
    var str = returnstringvalue(total).toString();
    var total2digit = str.slice(0, str.indexOf(".") + 3);

    $("#txt_line_detail_total_" + detailid).val(convert2digit(total2digit));
    $("#txt_line_detail_net_total_price_" + detailid).text(returnstringvalue(total));
    ReCalculate_detail_Total_for_Last_Line_grpo(summaryid);
    sum_sub_total_by_detail();
}
function ReCalculate_detail_Total_for_Last_Line_grpo(summaryid) {
    var name_qty_detail = "name_detail_qty_" + summaryid;
    var amount_after_4digit = 0.0000;
    var count_sub = $("input[name=" + name_qty_detail + "]").length;
    var index = 0;
    var sum_total = 0;
    var sum_qty = 0;

    $("input[name=" + name_qty_detail + "]").each(function () {
        index++;
        var detail_id = $(this).attr('id').replace("txt_line_detail_qty_", "");
        var net_total = convert4digit(returnstringvalue($("#txt_line_detail_net_total_price_" + detail_id).text()));

        var str = convert4digit(returnstringvalue(net_total)).toString();

        var total2digit = str.slice(0, str.indexOf(".") + 3);
        amount_after_4digit = parseFloat(amount_after_4digit) + parseFloat("0.00" + str.slice(str.indexOf(".") + 3, str.length));
        if (count_sub == index) {
            total2digit = parseFloat(total2digit) + parseFloat(amount_after_4digit);
            $("#txt_line_detail_total_" + detail_id).val(convert2digit(total2digit));
        }
        sum_total = parseFloat(returnstringvalue(sum_total)) + parseFloat(returnstringvalue($("#txt_line_detail_total_" + detail_id).val()));
        sum_qty = parseFloat(returnstringvalue(sum_qty)) + parseFloat(returnstringvalue($("#txt_line_detail_qty_" + detail_id).val()));
    });
    $("#txt_line_summary_total_" + summaryid).val(convert2digit(sum_total));
    $("#txt_line_summary_qty_" + summaryid).val(convert2digit(sum_qty));
}
function add_to_tbl_remove_by_summary_grpo(summaryid) {
    var namedetail = "name_tr_detail_" + summaryid;
    $("[name=" + namedetail + "]").each(function () {
        var detail_id = $(this).attr('id').replace("tr_detail_", "");
        if ($("#line_detail_line_num_" + detail_id).text() != -1) {
            add_to_tbl_remove($("#txt_line_summary_line_num_" + summaryid).text(), $("#line_detail_line_num_" + detail_id).text());
        }
        remove_bin_batch_by_detail($("#line_detail_item_detail_id_" + detail_id).text());
    });
}

function cmd_choose_document(action) {
    if (action == "Add") {
        $('#table_summary_detail >tbody>tr').remove();
    }
    var option = "";
    var whs = "";
    $("#table_whs > tbody >tr").each(function () {
        if ($("#cbo_ocrcode").val() == $(this).find("td:eq(4)").text()) {
            whs = whs + "<option value='" + $(this).find("td:eq(0)").text() + "'>" + $(this).find("td:eq(1)").text() + "</option>";
        }
    });
    var list_distinct_item = [];
    var list_item = [];
    var list_selected_item = [];

    //collect data from selected boq
    $("#table_popup_document_list > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("check_pop_boq_", "");
            list_item.push($("#td_pop_line_filer_item_code_" + id).text());
            var d = {
                BaseEntry: $("#td_pop_line_filer_base_entry_" + id).text(),
                BaseLine: $("#td_pop_line_filer_base_line_" + id).text(),
                BaseObj: $("#td_pop_line_filer_base_obj_" + id).text(),

                GlobalCode: $("#td_pop_line_filer_globalcode_" + id).text(),
                ItemBrandCode: $("#td_pop_line_filer_brand_code_" + id).text(),
                ItemBrandName:$("#td_pop_line_filer_brand_name_" + id).text(),
                ItemCode: $("#td_pop_line_filer_item_code_" + id).text(),
                UgpEntry: $("#td_pop_line_filer_ugpentry_" + id).text(),
                UoMName: $("#td_pop_line_filer_uom_name_" + id).text(),
                ItemName: $("#td_pop_line_filer_item_name_" + id).text(),
                Quantity: $("#td_pop_line_filer_boq_qty_" + id).text(),
                OcrCode: $("#td_pop_line_filer_ocrcode_" + id).text(),
                OcrCodeName: $("#td_pop_line_filer_ocrcode_name_" + id).text(),
                OcrCode2: $("#td_pop_line_filer_ocrcode2_" + id).text(),
                OcrCode2Name: $("#td_pop_line_filer_ocrcode2_name_" + id).text(),
                OcrCode3: $("#td_pop_line_filer_ocrcode3_" + id).text(),
                OcrCode3Name: $("#td_pop_line_filer_ocrcode3_name_" + id).text(),
                MainworkCode: $("#td_pop_line_filer_main_code_" + id).text(),
                MainWorkName: $("#td_pop_line_filer_main_name_" + id).text(),
                SubWorkCode: $("#td_pop_line_filer_sub_code_" + id).text(),
                SubWorkName: $("#td_pop_line_filer_floor_name_" + id).text(),
                FloorWorkCode: $("#td_pop_line_filer_floor_code_" + id).text(),
                FloorName: $("#td_pop_line_filer_floor_name_" + id).text(),
                LastPurchasePrice: $("#td_pop_line_filer_last_pur_" + id).text(),
                BalanceQuantity: $("#td_pop_line_filer_avail_qty_" + id).text(),
                ManageBy: $("#td_pop_line_filer_manage_by_" + id).text(),

                UPrice: $("#td_pop_line_filer_uprice_" + id).text(),
                DiscountPer: $("#td_pop_line_filer_dis_per_" + id).text(),
                DiscountAmt: $("#td_pop_line_filer_dis_amt_" + id).text(),
                LineTotal: $("#td_pop_line_filer_line_total_" + id).text(),
                NetPrice: $("#td_pop_line_filer_net_price_" + id).text(),
                PriceAftDisc: $("#td_pop_line_filer_price_after_dis_" + id).text()
            };
            list_selected_item.push(d);
        }
    });
    var list_distinct_item = list_item.filter(function (item, i, list_item) {
        return i == list_item.indexOf(item);
    });
    ////Finding Table Row Index
    var headerrowindex = 0;
    $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
        var index = $(this).attr('id').replace("td_summary_", "");
        if ($("#td_summary_is_Sumamry_" + index).text() == "Header") {
            headerrowindex = index;//$(this).attr("id").replace("tr_po_head_", "");
        }
    });
    headerrowindex++;

    var counthouse = 0;
    var itemname = "";
    var detailrowindex = 0;
    var housename = "";
    var total_sub_qty = 0;
    var total_sub_amt = 0;
    var uomname = "";
    var manageby = "";
    var brandname = "";
    var brandcode = "";
    var whsline = "";
    var enablebin = "";

    var checkReady = 0;
    var appendIndext = 0;

    for (i = 0; i < list_distinct_item.length; i++) {
        detailrowindex = 1;
        total_sub_qty = 0;
        option = "";
        brandcode = "";
        brandname = "";
        enablebin = "";
        total_sub_amt = 0;
        checkReady = 0;

        ////finding item already exists or not
        $('#table_summary_detail > tbody  > tr').each(function () {
            var index = $(this).attr('id').replace("td_summary_", "");
            if ($("#td_summary_is_Sumamry_" + index).text() == "Header") {
                if ($("#txt_line_summary_item_code_" + index).text() == list_distinct_item[i]) {
                    checkReady = 1;
                    headerrowindex = index;
                    return false;
                } else {
                    headerrowindex = parseInt(index) + 1;
                }
            }
        });
        if (checkReady == 1) {
            var namedetail = "name_tr_detail_" + headerrowindex;
            $("[name=" + namedetail + "]").each(function () {
                detailrowindex = $(this).attr('id').replace("tr_detail_", "");
                appendIndext = $(this).index();
                total_sub_qty = total_sub_qty + parseFloat(returnstringvalue($("#txt_line_detail_qty_" + headerrowindex + "" + detailrowindex)).val());
            });
            option = "";
            $.each(list_selected_item, function (key, value) {
                option = "";
                whsline = "";
                if (value.ItemCode == list_distinct_item[i]) {
                    if (value.UgpEntry == "-1") {
                        option = "<option value='-1'>" + value.UoMName + "</option>";
                    }
                    else {
                        $("#table_uom_group > tbody >tr").each(function () {
                            if ($(this).find("td:eq(0)").text() == value.UgpEntry) {
                                option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                            }
                        });
                    }
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
                    total_sub_qty = total_sub_qty + parseFloat(returnstringvalue(value.Quantity));
                    total_sub_amt = total_sub_amt + parseFloat(returnstringvalue(value.LineTotal));
                    var data = "<tr name='name_tr_detail_" + headerrowindex + "' style='display:none' id='tr_detail_" + headerrowindex + "" + detailrowindex + "'>";
                    data = data + "<td><input type='checkbox' id='checkbox_line_detail_checkbox_" + headerrowindex + "" + detailrowindex + "' name='name_line_detail_checkbox_" + headerrowindex + "'></td>";
                    data = data + "<td></td>";
                    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_grpo_detail_document(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></i></td>"
                    data = data + "<td colspan='3'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' readonly='readonly' id='txt_line_detail_avail_po_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.BalanceQuantity) + "'></div></td>";

                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Quantity) + "' onchange='change_line_detail_grpo(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ",1)'></div></td>";

                    data = data + "<td><div class='form-group'><select class='form-control form-control-insde' disabled name='name_line_detail_uom_" + headerrowindex + "' id='cbo_line_detail_uom_" + headerrowindex + "" + detailrowindex + "'>" + option + "</select></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_price_" + headerrowindex + "' id='txt_line_detail_price_" + headerrowindex + "" + detailrowindex + "' readonly='readonly' placeholder='Price' value='" + convert4digit(value.UPrice) + "' onchange='change_line_detail_grpo(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_dis_per_" + headerrowindex + "' id='txt_line_detail_disc_per_" + headerrowindex + "" + detailrowindex + "' readonly='readonly' placeholder='Disc%' value='" + convert2digit(value.DiscountPer) + "' onchange='change_line_detail_grpo(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_dis_amt_" + headerrowindex + "' id='txt_line_detail_disc_amt_" + headerrowindex + "" + detailrowindex + "' readonly='readonly' placeholder='Disc.Amt' value='" + convert2digit(value.DiscountAmt) + "' onchange='change_line_detail_grpo(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_total_amount_" + headerrowindex + "' readonly='readonly' id='txt_line_detail_total_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.LineTotal) + "'></div></td>";

                    data = data + "<td><div class='form-group'><table><tr><td><select style='width:97%' class='form-control form-control-insde'  name='name_line_detail_whs_" + headerrowindex + "' id='cbo_line_detail_whs_" + headerrowindex + "" + detailrowindex + "' onchange='cbo_line_detail_whs_change(" + headerrowindex + "," + headerrowindex + "" + detailrowindex + ")'>" + whs + "</select></div></td>";
                    data = data + "<td><div class='input-group'><div class='input-group-addon' style='display:none;background-color:transparent;border:0px;' id='dv_line_detail_bin_location_" + headerrowindex + "" + detailrowindex + "'><i class='fa fa-circle  text-danger' onclick='cmd_line_detail_show_bin_location_click(" + headerrowindex + "" + detailrowindex + ")' style='cursor: pointer'></i></div></div></td></tr ></table ></div ></td > ";

                    data = data + "<td>" + value.OcrCode2Name + "</td>";
                    data = data + "<td style='display:none' id='line_detail_line_num_" + headerrowindex + "" + detailrowindex + "'>-1</td>";
                    data = data + "<td style='display:none' id='line_detail_base_entry_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseEntry + "</td>";
                    data = data + "<td style='display:none' id='line_detail_base_line_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseLine + "</td>";
                    data = data + "<td style='display:none' id='line_detail_base_obj_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseObj + "</td>";

                    data = data + "<td style='display:none' id='line_detail_item_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_name_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemName + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_brand_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemBrandCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode2_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode2 + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode3_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode3 + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_main_code_" + headerrowindex + "" + detailrowindex + "'>" + value.MainworkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_sub_code_" + headerrowindex + "" + detailrowindex + "'>" + value.SubWorkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_floor_code_" + headerrowindex + "" + detailrowindex + "'>" + value.FloorWorkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_floor_name_" + headerrowindex + "" + detailrowindex + "'>" + value.FloorName + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_managed_by_" + headerrowindex + "" + detailrowindex + "'>" + value.ManageBy + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_house_name_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode3Name + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_brand_name_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemBrandName + "</td>";
                    data = data + "<td style='display:none' name='name_line_detail_enable_bin_" + headerrowindex + "' id='line_detail_item_enable_bin_" + headerrowindex + "" + detailrowindex + "'></td>";
                    data = data + "<td style='display:none' id='line_detail_item_detail_id_" + headerrowindex + "" + detailrowindex + "'>" + headerrowindex + "" + detailrowindex + "</td>";
                    data = data + "<td style='display:none' name='name_detail_net_total_price_" + headerrowindex + "' id='txt_line_detail_net_total_price_" + headerrowindex + "" + detailrowindex + "'>" + value.NetPrice + "</td>";
                    data = data + "<td style='display:none' name='name_detail_price_after_disc_" + headerrowindex + "' id='txt_line_detail_price_after_dis_" + headerrowindex + "" + detailrowindex + "'>" + value.PriceAftDisc + "</td>";
                    data = data + "<td style='display:none' id='line_detail_brand_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemBrandName + "</td>";

                    data = data + "</tr>";
                    detailrowindex++;
                    itemname = value.ItemName;
                    uomname = option;
                    brandname = value.ItemBrandName;
                    manageby = value.ManageBy;
                    brandcode = value.ItemBrandCode;
                    $('#table_summary_detail tbody tr').filter(':nth-child(' + (appendIndext + 1) + ')').after(data);
                    $("[name=" + namedetail + "]").hide();
                    $("#td_is_summary_" + headerrowindex).text("H");
                }
            });
        }
        else {
            var data = "<tr id='td_summary_" + headerrowindex + "' class='header-color'>";
            data = data + "<td id='td_summary_is_Sumamry_" + headerrowindex + "' style='display:none'>Header</td>";
            data = data + "<td style='display:none' id='td_is_summary_" + headerrowindex + "'>H</td>";
            data = data + "<td><i class='fa fa-circle text-danger' style='cursor:pointer;' id='td_summary_check_all_" + headerrowindex + "' onclick='check_document_summary_detail(" + headerrowindex + ")'></i><i class='fa fa-circle text-yellow' id='td_summary_uncheck_all_" + headerrowindex + "' style='cursor:pointer; display:none' onclick='uncheck_document_summary_detail(" + headerrowindex + ")'></i></td>";
            data = data + "<td><i class='fa fa-plus text-info' onclick='cmd_line_show_detail(" + headerrowindex + ")' style='cursor:pointer'></i></td>";
            data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_grpo_summary(" + headerrowindex + ")'></i></td>";

            data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_brand_" + headerrowindex + "' placeholder='Brand' readonly='readonly' value=''></div></td>";
            data = data + "<td colspan='2'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_item_name_" + headerrowindex + "' placeholder='Description' readonly='readonly' value=''></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_avail_po_" + headerrowindex + "' readonly='readonly' value='0.00' ></div></td>";

            data = data + "<td><div class='input-group'>";
            data = data + "<input type='text' style='text-align:right;' class='form-control form-control-insde header-color' id='txt_line_summary_qty_" + headerrowindex + "' value='0.00' onchange='change_line_qty_summary_grpo(" + headerrowindex + ")' >";
            data = data + "<div class='input-group-addon' style='display:none;background-color:transparent;border:0px;' id='dv_line_summary_qty_" + headerrowindex + "'>";
            data = data + "<i class='fa fa-circle  text-danger' onclick='cmd_line_summary_show_manage_by_click(1)' style='cursor: pointer'></i>";
            data = data + "</div>";
            data = data + "</div></td>";

            data = data + "<td><div class='form-group'></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_price_" + headerrowindex + "' value='0.0000' readonly='readonly'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_dis_per_" + headerrowindex + "' value='0.00' readonly='readonly'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_dis_amt_" + headerrowindex + "' value='0.00' readonly='readonly'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_total_" + headerrowindex + "' value='0.00' readonly='readonly'></div></td>";
            data = data + "<td colspan='2'></td>";
            data = data + "<td style='display:none' id='txt_line_summary_price_after_discount_" + headerrowindex + "'>0</td>";
            data = data + "<td style='display:none' id='txt_line_summary_item_code_" + headerrowindex + "'>" + list_distinct_item[i] + "</td>";
            data = data + "<td style='display:none' id='txt_line_summary_brand_code_" + headerrowindex + "'></td>";
            data = data + "<td style='display:none' id='txt_line_summary_brand_name_" + headerrowindex + "'></td>";
            data = data + "<td style='display:none'  id='txt_line_summary_manage_by_" + headerrowindex + "'></td>";
            data = data + "<td style='display:none'  id='txt_line_summary_line_num_" + headerrowindex + "'>-1</td>";
            data = data + "</tr>";
            $.each(list_selected_item, function (key, value) {
                option = "";
                whsline = "";
                if (value.ItemCode == list_distinct_item[i]) {
                    if (value.UgpEntry == "-1") {
                        option = "<option value='-1'>" + value.UoMName + "</option>";
                    }
                    else {
                        $("#table_uom_group > tbody >tr").each(function () {
                            if ($(this).find("td:eq(0)").text() == value.UgpEntry) {
                                option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                            }
                        });
                    }
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
                    total_sub_qty = total_sub_qty + parseFloat(returnstringvalue(value.Quantity));
                    total_sub_amt = total_sub_amt + parseFloat(returnstringvalue(value.LineTotal));
                    data = data + "<tr name='name_tr_detail_" + headerrowindex + "' style='display:none' id='tr_detail_" + headerrowindex + "" + detailrowindex + "'>";
                    data = data + "<td><input type='checkbox' id='checkbox_line_detail_checkbox_" + headerrowindex + "" + detailrowindex + "' name='name_line_detail_checkbox_" + headerrowindex + "'></td>";
                    data = data + "<td></td>";
                    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_grpo_detail_document(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></i></td>"
                    data = data + "<td colspan='3'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' readonly='readonly' id='txt_line_detail_avail_po_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.BalanceQuantity) + "'></div></td>";

                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Quantity) + "' onchange='change_line_detail_grpo(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ",1)'></div></td>";

                    data = data + "<td><div class='form-group'><select class='form-control form-control-insde' disabled name='name_line_detail_uom_" + headerrowindex + "' id='cbo_line_detail_uom_" + headerrowindex + "" + detailrowindex + "'>" + option + "</select></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_price_" + headerrowindex + "' id='txt_line_detail_price_" + headerrowindex + "" + detailrowindex + "' readonly='readonly' placeholder='Price' value='" + convert4digit(value.UPrice) + "' onchange='change_line_detail_grpo(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_dis_per_" + headerrowindex + "' id='txt_line_detail_disc_per_" + headerrowindex + "" + detailrowindex + "' readonly='readonly' placeholder='Disc%' value='" + convert2digit(value.DiscountPer) + "' onchange='change_line_detail_grpo(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_dis_amt_" + headerrowindex + "' id='txt_line_detail_disc_amt_" + headerrowindex + "" + detailrowindex + "' readonly='readonly' placeholder='Disc.Amt' value='" + convert2digit(value.DiscountAmt) + "' onchange='change_line_detail_grpo(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_total_amount_" + headerrowindex + "' readonly='readonly' id='txt_line_detail_total_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.LineTotal) + "'></div></td>";

                    data = data + "<td><div class='form-group'><table><tr><td><select style='width:97%' class='form-control form-control-insde'  name='name_line_detail_whs_" + headerrowindex + "' id='cbo_line_detail_whs_" + headerrowindex + "" + detailrowindex + "' onchange='cbo_line_detail_whs_change(" + headerrowindex + "," + headerrowindex + "" + detailrowindex + ")'>" + whs + "</select></div></td>";
                    data = data + "<td><div class='input-group'><div class='input-group-addon' style='display:none;background-color:transparent;border:0px;' id='dv_line_detail_bin_location_" + headerrowindex + "" + detailrowindex + "'><i class='fa fa-circle  text-danger' onclick='cmd_line_detail_show_bin_location_click(" + headerrowindex + "" + detailrowindex + ")' style='cursor: pointer'></i></div></div></td></tr ></table ></div ></td > ";

                    data = data + "<td>" + value.OcrCode2Name + "</td>";
                    data = data + "<td style='display:none' id='line_detail_line_num_" + headerrowindex + "" + detailrowindex + "'>-1</td>";
                    data = data + "<td style='display:none' id='line_detail_base_entry_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseEntry + "</td>";
                    data = data + "<td style='display:none' id='line_detail_base_line_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseLine + "</td>";
                    data = data + "<td style='display:none' id='line_detail_base_obj_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseObj + "</td>";

                    data = data + "<td style='display:none' id='line_detail_item_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_name_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemName + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_brand_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemBrandCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode2_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode2 + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode3_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode3 + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_main_code_" + headerrowindex + "" + detailrowindex + "'>" + value.MainworkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_sub_code_" + headerrowindex + "" + detailrowindex + "'>" + value.SubWorkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_floor_code_" + headerrowindex + "" + detailrowindex + "'>" + value.FloorWorkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_floor_name_" + headerrowindex + "" + detailrowindex + "'>" + value.FloorName + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_managed_by_" + headerrowindex + "" + detailrowindex + "'>" + value.ManageBy + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_house_name_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode3Name + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_brand_name_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemBrandName + "</td>";
                    data = data + "<td style='display:none' name='name_line_detail_enable_bin_" + headerrowindex + "' id='line_detail_item_enable_bin_" + headerrowindex + "" + detailrowindex + "'></td>";
                    data = data + "<td style='display:none' id='line_detail_item_detail_id_" + headerrowindex + "" + detailrowindex + "'>" + headerrowindex + "" + detailrowindex + "</td>";
                    data = data + "<td style='display:none' name='name_detail_net_total_price_" + headerrowindex + "' id='txt_line_detail_net_total_price_" + headerrowindex + "" + detailrowindex + "'>" + value.NetPrice + "</td>";
                    data = data + "<td style='display:none' name='name_detail_price_after_disc_" + headerrowindex + "' id='txt_line_detail_price_after_dis_" + headerrowindex + "" + detailrowindex + "'>" + value.PriceAftDisc + "</td>";
                    data = data + "<td style='display:none' id='line_detail_brand_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemBrandName + "</td>";

                    data = data + "</tr>";
                    detailrowindex++;
                    itemname = value.ItemName;
                    uomname = option;
                    brandname = value.ItemBrandName;
                    manageby = value.ManageBy;
                    brandcode = value.ItemBrandCode;
                }
            });
            $("#table_summary_detail >tbody").append(data);
            $("#txt_line_summary_item_name_" + headerrowindex).val(itemname);
            $("#txt_line_summary_qty_" + headerrowindex).val(convert2digit(total_sub_qty));
            $("#txt_line_summary_total_" + headerrowindex).val(convert2digit(total_sub_amt));
            $("#txt_line_summary_avail_po_" + headerrowindex).val(convert2digit(total_sub_qty));
            $("#txt_line_summary_brand_code_" + headerrowindex).text(brandcode);
            $("#txt_line_summary_brand_name_" + headerrowindex).text(brandname);
            $("#txt_line_summary_brand_" + headerrowindex).val(brandname);
            $("#txt_line_summary_manage_by_" + headerrowindex).text(manageby);


            if (manageby == "B") {
                $("#dv_line_summary_qty_" + headerrowindex).show();
            }
            else {
                $("#dv_line_summary_qty_" + headerrowindex).hide();
            }
            headerrowindex++;
        }
    }
    $("#modal_document").modal('hide');
    $("#cbo_ocrcode").attr('disabled', 'disabled');
    cmd_line_summary_show_manage_by_click(0,'Update');
    sum_sub_total_by_detail();
}
//get data from database
function cmd_view_data_document(isboq, boqtype) {
    var itemgroup = $("#cbo_pop_up_search_sub_group").val();
    var itemdesc = $("#txt_pop_up_search_item").val();
    var copy_from = $("#txt_copy_from").val();
    var url = "";
    switch ($("#txt_copy_from").val()) {
        case "PR":
            url = "/getData/get_pr1";
            break;
        case "PQ":
            url = "/getData/get_pq1";
            break;
        case "PO":
            url = "/getData/get_po1";
            break;
        case "GRPO":
            url = "/getData/get_grpo1";
            break;
    }
    $.ajax({
        url: url,
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
function check_batch_qty(detailid) {
    var sum_batch_qty = 0;
    $("#table_pop_item_batch_creation >tbody>tr").each(function () {
        var get_detail_id = $(this).attr('id').replace("tr_pop_batch_creation_line_", "").split("_");
        var d_id = get_detail_id[0];
        var id = get_detail_id[1];
        if (detailid == d_id) {
            sum_batch_qty = parseFloat(returnstringvalue(sum_batch_qty)) + parseFloat(returnstringvalue($("#txt_pop_batch_creation_qty_" + d_id + "_" + id).val()));
        }
    });
    return returnstringvalue(sum_batch_qty);
}
//saving Database
function cmd_save_grpo_summary_detail(type, boqtype) {
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
    //Checking Batch Information
    var itemname = "";
    $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(1)").text() != "H" || $(this).find("td:eq(1)").text() != "S") {
            var detailid = $(this).attr('id').replace("tr_detail_", "");
            if ($("#line_detail_item_managed_by_" + detailid).text() == "B") {
                $("#table_pop_item_batch_creation >tbody>tr").each(function () {
                    var get_detail_id = $(this).attr('id').replace("tr_pop_batch_creation_line_", "").split("_");
                    var d_id = get_detail_id[0];
                    var id = get_detail_id[1];
                    var det_id=d_id + "_" + id;
                    if (detailid == d_id) {
                        if ($("#td_pop_batch_creation_batch_num_" + det_id).val() == "") {
                            allow = 60;
                            return false;
                        }
                        var sum_batch_qty = check_batch_qty(detailid);
                        if (parseFloat(returnstringvalue($("#txt_line_detail_qty_" + detailid).val())) != parseFloat(sum_batch_qty)) {
                            allow = 50;
                            itemname = $("#line_detail_item_name_" + detailid).text();
                            return false;
                        } 
                    }
                });
            }
        }
    });
    var summaryid;
    if (allow == 50) {
        //ShowAlert("Total Need and Total Batch Quantity is not the same [" + itemname + "]");
        cmd_line_summary_show_manage_by_click_edit(1,'New');
    }
    if (allow == 60) {
        cmd_line_summary_show_manage_by_click_edit(1, 'New');
    }
    //alert(allow);
    //allow = 11;
    if (allow == 0) {
        $('#tbl_Remove_List > tbody  > tr').each(function (i, t) {
            var del = {
                DocEntry: $("#txt_pq_dockey").val(),
                GRPOHLine: $("#HeadLine_" + i).text(),
                LineNum: $("#DetailLine_" + i).text()
            };
            del_list.push(del);
        });
        var docdate = $('#txt_doc_date').val().trim().split("-");
        var reqdate = $('#txt_due_date').val().trim().split("-");
        var head = {
            DocEntry: $("#txt_pq_dockey").val(),
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
        $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
            if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text() == "S") {
                summaryid = $(this).attr('id').replace("td_summary_", "");
                var summary = {
                    LineNum: summaryid,
                    Brand: $("#txt_line_summary_brand_" + summaryid).val(),
                    ItemCode: $("#txt_line_summary_item_code_" + summaryid).text(),
                    ItemName: $("#txt_line_summary_item_name_" + summaryid).val(),
                    NoofHouse: $("#txt_line_summary_noofhouse_" + summaryid).val(),
                    POQty: returnstringvalue($("#txt_line_summary_avail_po_" + summaryid).val()),
                    Quantity: returnstringvalue($("#txt_line_summary_qty_" + summaryid).val()),
                    ActQty: "0.00",
                    UPrice: returnstringvalue($("#txt_line_summary_price_" + summaryid).val()),
                    PriceAftDisc: returnstringvalue($("#txt_line_summary_price_after_discount_" + summaryid).text()),
                    DisPer: returnstringvalue($("#txt_line_summary_dis_per_" + summaryid).val()),
                    DisAmount: returnstringvalue($("#txt_line_summary_dis_amt_" + summaryid).val()),
                    LineTotal: returnstringvalue($("#txt_line_summary_total_" + summaryid).val())
                };
                summary_list.push(summary);
            }
            else {
                var detailid = $(this).attr('id').replace("tr_detail_", "");
                var detail = {
                    LineNum: $("#line_detail_line_num_" + detailid).text(),
                    GRPOHLine: summaryid,
                    BaseEntry: $("#line_detail_base_entry_" + detailid).text(),
                    BaseLine: $("#line_detail_base_line_" + detailid).text(),
                    BaseType: $("#line_detail_base_obj_" + detailid).text(),
                    ItemCode: $("#line_detail_item_code_" + detailid).text(),
                    ItemName: $("#line_detail_item_name_" + detailid).text(),
                    NoofHouse: "0",
                    POQty: returnstringvalue($("#txt_line_detail_avail_po_"+detailid).val()),
                    Quantity: returnstringvalue($("#txt_line_detail_qty_" + detailid).val()),
                    ActQty:"0.00",
                    ApplyQuantity: "0.00",
                    UoMEntry: $("#cbo_line_detail_uom_" + detailid).val(),
                    UPrice: returnstringvalue($("#txt_line_detail_price_" + detailid).val()),
                    DisPer: returnstringvalue($("#txt_line_detail_disc_per_" + detailid).val()),
                    DisAmount: returnstringvalue($("#txt_line_detail_disc_amt_" + detailid).val()),
                    LineTotal: returnstringvalue($("#txt_line_detail_total_" + detailid).val()),
                    WhsCode: $("#cbo_line_detail_whs_" + detailid).val(),
                    OcrCode: $("#cbo_ocrcode").val(),
                    OcrCode2: $("#line_detail_item_ocrcode2_" + detailid).text(),
                    OcrCode3: $("#line_detail_item_ocrcode3_" + detailid).text(),
                    MainworkCode: $("#line_detail_item_main_code_" + detailid).text(),
                    SubWorkCode: $("#line_detail_item_sub_code_" + detailid).text(),
                    FloorWorkCode: $("#line_detail_item_floor_code_" + detailid).text(),
                    GlobalCode: $("#line_detail_global_code_" + detailid).text(),
                    NetPrice: returnstringvalue($("#txt_line_detail_net_total_price_" + detailid).text()),
                    PriceAftDisc: returnstringvalue($("#txt_line_detail_price_after_dis_" + detailid).text()),
                    DetailWorkCode: $("#line_detail_item_detail_id_" + detailid).text(),
                    CompleteTerm1: $("#line_detail_item_enable_bin_" + detailid).text(),
                    Brand: $("#line_detail_brand_" + detailid).text()
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
                    BatchQty: returnstringvalue($("#txt_pop_batch_creation_qty_" + detailid).val()),
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
            if (returnstringvalue($("#td_pop_bin_creation_qty_" + detailid).val())>0) {
                var summary = {
                    ItemCode: $("#td_pop_bin_creation_item_code_" + detailid).text(),
                    ItemName: $("#td_pop_bin_creation_item_name_" + detailid).text(),
                    BinEntry: $("#td_pop_bin_creation_bin_entry_" + detailid).text(),
                    WhsCode: $("#td_pop_bin_creation_whs_code_" + detailid).text(),
                    BinQty: returnstringvalue($("#td_pop_bin_creation_qty_" + detailid).val()),
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






