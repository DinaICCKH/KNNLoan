
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
                tr = tr + "</tr>";
                $("#table_popup_document_list >tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
//client Action
function cmd_line_summary_show_manage_by_click(summaryid) {
    $("#modal_batch_list").modal('show');
    var itemcode = $("#txt_line_summary_item_code_" + summaryid).text();
    var itemname = $("#txt_line_summary_item_name_" + summaryid).val();
    $("#txt_pop_batch_summary_id").val(summaryid);

    cmd_pop_cancel_batch();
    pop_batch_check_batch(summaryid);
    pop_batch_new_row(summaryid, itemcode, itemname);
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
function pop_batch_new_row(summaryid, itemcode, itemname) {
    var docdate = $("#txt_doc_date").val();
    var brandname = $("#txt_line_summary_brand_name_" + summaryid).text();
    var qty = $("#txt_line_summary_qty_" + summaryid).val();

    var tr = "<tr>";
    tr = tr + "<td style='display:none'>" + summaryid + "</td>";
    tr = tr + "<td name='td_pop_batch_summary_id_status_" + summaryid + "' style='display:none'>new</td>";
    tr = tr + "<td id='td_pop_batch_item_code'><input type='text' class='form-control form-control-insde' readonly='readonly' placeholder='Item Code' value='" + itemcode + "'></td>";
    tr = tr + "<td id='td_pop_batch_item_code'><input type='text' class='form-control form-control-insde' readonly='readonly' placeholder='Description' value='" + itemname + "'></td>";
    tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' placeholder='Batch Num' onchange='pop_batch_num_change(" + summaryid + ")' value='" + brandname+"'></div></td>";
    tr = tr + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' placeholder='Quantity' onchange='pop_quantity_change(" + summaryid + ")' value='" + convert2digit(qty) +"'></div></td>";
    tr = tr + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' placeholder='Exp-Date'></div></div></td>";
    tr = tr + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' placeholder='Mfr-Date'></div></div></td>";
    tr = tr + "<td><div class='form-group'><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' readonly='readonly' placeholder='Admission-Date' value='" + docdate+"'></div></div></td>";
    tr = tr + "</tr>";
    $("#table_pop_item_batch >tbody").append(tr);
    $('.datetime').datepicker({
        autoclose: true,
        format: 'dd-mm-yyyy'
    });
}

function cmd_choose_document() {
    $('#table_summary_detail >tbody>tr').remove();
    var option = "";
    var whs = "";
    $("#table_whs > tbody >tr").each(function () {
        whs = whs + "<option value='" + $(this).find("td:eq(0)").text() + "'>" + $(this).find("td:eq(1)").text() + "</option>";
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
                GlobalCode: $("#td_pop_line_filer_globalcode_" + id).text(),
                ItemBrandCode: $("#td_pop_line_filer_brand_code_" + id).text(),
                ItemBrandName: $("#td_pop_line_filer_brand_name_" + id).text(),
                ItemCode: $("#td_pop_line_filer_item_code_" + id).text(),
                UgpEntry: $("#td_pop_line_filer_ugpentry_" + id).text(),
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
                ManageBy: $("#td_pop_line_filer_manage_by_" + id).text()
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
    var uomname = "";
    var manageby = "";
    var brandname = "";
    var brandcode = "";
    var whsline = "";
    var enablebin = "";
    for (i = 0; i < list_distinct_item.length; i++) {
        detailrowindex = 1;
        total_sub_qty = 0;
        option = "";
        brandcode = "";
        brandname = "";
        enablebin = "";
        var data = "<tr id='td_summary_" + headerrowindex + "' class='header-color'>";
        data = data + "<td id='td_summary_is_Sumamry_" + headerrowindex + "' style='display:none'>Header</td>";
        data = data + "<td style='display:none' id='td_is_summary_" + headerrowindex + "'>H</td>";
        data = data + "<td><i class='fa fa-circle text-danger' style='cursor:pointer;' id='td_summary_check_all_" + headerrowindex + "' onclick='check_document_summary_detail(" + headerrowindex + ")'></i><i class='fa fa-circle text-yellow' id='td_summary_uncheck_all_" + headerrowindex + "' style='cursor:pointer; display:none' onclick='uncheck_document_summary_detail(" + headerrowindex + ")'></i></td>";
        data = data + "<td><i class='fa fa-plus text-info' onclick='cmd_line_show_detail(" + headerrowindex + ")' style='cursor:pointer'></i></td>";
        data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_summary(" + headerrowindex + ")'></i></td>";
        data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_brand_" + headerrowindex + "' readonly='readonly'></div></td>";
        data = data + "<td colspan='2'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_item_name_" + headerrowindex + "' placeholder='Description' readonly='readonly' value=''></div></td>";
        data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_avail_po_" + headerrowindex + "' readonly='readonly' value='0.00' ></div></td>";

        data = data + "<td><div class='input-group'>";
        data = data + "<input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_qty_" + headerrowindex + "' value='0.00' onchange='change_line_summary(" + headerrowindex + ",1)' >";
        data = data + "<div class='input-group-addon' style='display:none;background-color:transparent;border:0px;' id='dv_line_summary_qty_" + headerrowindex + "'>";
        data = data + "<i class='fa fa-circle' onclick='cmd_line_summary_show_manage_by_click(" + headerrowindex + ")' style='cursor: pointer'></i>";
        data = data + "</div>";
        data = data + "</div></td>";

        data = data + "<td><div class='form-group'></td>";
        data = data + "<td colspan='4'></td>";
        data = data + "<td><div class='form-group'><select class='form-control form-control-insde header-color' id='cbo_line_summary_whs_" + headerrowindex + "' onchange='change_line_summary(" + headerrowindex + ",9)'>" + whs + "</select></td>";
        data = data + "<td colspan='5'></td>";
        data = data + "<td style='display:none' id='txt_line_summary_item_code_" + headerrowindex + "'>" + list_distinct_item[i] + "</td>";
        data = data + "<td style='display:none' id='txt_line_summary_brand_code_" + headerrowindex + "'></td>";
        data = data + "<td style='display:none' id='txt_line_summary_brand_name_" + headerrowindex + "'></td>";
        data = data + "</tr>";
        $.each(list_selected_item, function (key, value) {
            option = "";
            whsline = "";
            if (value.ItemCode == list_distinct_item[i]) {

                $("#table_uom_group > tbody >tr").each(function () {
                    if ($(this).find("td:eq(0)").text() == value.UgpEntry) {
                        option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                    }
                });

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
                data = data + "<tr name='name_tr_detail_" + headerrowindex + "' style='display:none' id='tr_pr_detail_" + headerrowindex + "" + detailrowindex + "'>";
                data = data + "<td><input type='checkbox' id='checkbox_line_detail_checkbox_" + headerrowindex + "" + detailrowindex + "' name='name_line_detail_checkbox_" + headerrowindex + "'></td>";
                data = data + "<td></td>";
                data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></i></td>"
                data = data + "<td colspan='3'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' readonly='readonly' id='txt_line_detail_avail_po_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.BalanceQuantity) + "'></div></td>";

                data = data + "<td><div class='input-group'>";
                data = data + "<input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Quantity) + "'>";
                data = data + "<div class='input-group-addon' style='display:none;background-color:transparent;border:0px;' id='dv_line_summary_qty_" + headerrowindex + "'>";
                data = data + "<i class='fa fa-circle' onclick='cmd_line_summary_show_manage_by_click(" + headerrowindex + ")' style='cursor: pointer'></i>";
                data = data + "</div>";
                data = data + "</div></td>";

                data = data + "<td><div class='form-group'><select class='form-control form-control-insde' disabled name='name_line_detail_uom_" + headerrowindex + "' id='cbo_line_detail_uom_" + headerrowindex + "" + detailrowindex + "'>" + option + "</select></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_line_detail_price_" + headerrowindex + "' readonly='readonly' id='txt_line_detail_price_" + headerrowindex + "" + detailrowindex + "' placeholder='Price' value='0.0000' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";

                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_line_detail_dis_per_" + headerrowindex + "' readonly='readonly' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' placeholder='Disc%' value='0.00' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_line_detail_dis_amt_" + headerrowindex + "' readonly='readonly' id='txt_line_detail_dis_per_" + headerrowindex + "" + detailrowindex + "' placeholder='Disc.Amt' value='0.00' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_line_detail_line_total_" + headerrowindex + "' readonly='readonly' id='txt_line_detail_bal_dis_amt_" + headerrowindex + "" + detailrowindex + "' value='0.00'></div></td>";
                data = data + "<td><div class='form-group'><select class='form-control form-control-insde' name='name_line_detail_whs_" + headerrowindex + "' id='cbo_line_detail_whs_" + headerrowindex + "" + detailrowindex + "'>" + whs + "</select></td>";
                
                data = data + "<td>" + value.OcrCode2Name + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_name_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemName + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_brand_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemBrandCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_ocrcode2_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode2 + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_ocrcode3_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode3 + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_main_code_" + headerrowindex + "" + detailrowindex + "'>" + value.U_MainWork + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_sub_code_" + headerrowindex + "" + detailrowindex + "'>" + value.U_SubWork + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_floor_code_" + headerrowindex + "" + detailrowindex + "'>" + value.U_Floor + "</td>";
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
        $("#txt_line_summary_avail_po_" + headerrowindex).val(convert2digit(total_sub_qty));
        $("#txt_line_summary_brand_code_" + headerrowindex).text(brandcode);
        $("#txt_line_summary_brand_name_" + headerrowindex).text(brandname);

        if (manageby != "N") {
            $("#dv_line_summary_qty_" + headerrowindex).show();
        }
        else {
            $("#dv_line_summary_qty_" + headerrowindex).hide();
        }
        
        headerrowindex++;
    }
    $("#modal_document").modal('hide');
}