

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
            , isBoq: isboq, BoqType: boqtype, procode: $("#cbo_ocrcode").val()
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

                tr = tr + "</tr>";
                $("#table_popup_document_list >tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function cmd_pop_choose_item(type) {
    //var option = "";
    var whs = "";
    var projectoption = "";
    var block = "";
    var mainworkoption = "";
    var floorwork = "";
    
    //$("#cbo_whs > option").each(function () {
    //    whs = whs + "<option value='" + this.value + "'>" + this.text + "</option>";
    //});

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
                tr = tr + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_by_line(" + rowindex + ")'><i class='fa fa-fw fa-remove'></i></span></td>";
                tr = tr + "<td><div class='input-group'><input type='text' class='form-control noborder' id='txt_line_itemname_" + rowindex + "' placeholder='Description' value='" + itemname + "'><div class='input-group-addon'><i class='fa fa-industry text-info' onclick='cmd_show_Item_list(" + rowindex + ")' style='cursor:pointer'></i></div></div></td >";

                if ($("#td_pop_master_manage_by_" + id).text() == "N") {
                    tr = tr + "<td><div class='form-group'><input type='text' style='text-align:left' class='form-control form-control-insde' id='txt_line_qty_" + rowindex + "' value='0.00'></div></td>";
                }
                else {
                    tr = tr + "<td><div class='input-group'>";
                    tr = tr + "<input type='text' style='text-align:left' class='form-control form-control-insde' id='txt_line_qty_" + rowindex + "' value='0.00'>";
                    tr = tr + "<div class='input-group-addon'>";
                    tr = tr + "<i class='fa fa-circle text-info' onclick='cmd_show_vendor()' style='cursor: pointer'></i>";
                    tr = tr + "</div>";
                    tr = tr + "</div></td>";
                }
                tr = tr + "<td><div class='form-group'><select class='form-control' id='cbo_line_uom_" + rowindex + "'>" + option + "</select></div></td>";
                tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_price_" + rowindex + "' placeholder = 'Price' value='0.0000' onchange='change_line(" + rowindex + ")'></div></td>";
                tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_dis_per_" + rowindex + "' placeholder = 'Dis%' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
                tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_dis_amt_" + rowindex + "' placeholder = 'Dis Amt' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
                tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_line_total_" + rowindex + "' placeholder = 'Total' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
                tr = tr + "<td><div class='form-group'><select class='form-control' id='cbo_line_whs_" + rowindex + "'>" + whs + "</select></div></td>";
                if (isbin == "N") {
                    tr = tr + "<td><button type='button' class='btn btn-primary btn-flat' style='display:none'>...</button></td>";
                }
                else {
                    tr = tr + "<td><button type='button' class='btn btn-primary btn-flat'>...</button></td>";
                }
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_ocrcode2_" + rowindex + "' onchange='get_line_house_list(" + rowindex + ")'>" + block + "</select></td>";
                tr = tr + "<td style='display:none' id='td_base_line_num_" + rowindex + "'>-1</td>";
                tr = tr + "<td style='display:none' id='td_base_doc_entry_" + rowindex + "'>-1</td>";
                tr = tr + "<td style='display:none' id='td_base_obj_type_" + rowindex + "'>NA</td>";
                tr = tr + "<td style='display:none' id='td_line_num_" + rowindex + "'>-1</td>";
                tr = tr + "<td style='display:none' id='td_line_line_status_" + rowindex + "'>Active</td>";
                tr = tr + "<td style='display:none' id='td_line_brand_code_" + rowindex + "'>" + $("#td_pop_master_item_brand_" + id).text() + "</td>";
                tr = tr + "<td style='display:none' id='td_line_item_code_" + rowindex + "'>" + $("#td_pop_master_item_code_" + id).text() + "</td>";
                tr = tr + "<td style='display:none' id='td_line_global_code_" + rowindex + "'>" + $("#td_pop_master_global_code_" + id).text() + "</td>";
                tr = tr + "<td style='display:none' id='td_line_price_after_discount_" + rowindex + "'>0</td>";
                tr = tr + "<td style='display:none' id='td_line_vat_amount_" + rowindex + "'>0</td>";
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
    tr = tr + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_by_line(" + rowindex + ")'><i class='fa fa-fw fa-remove'></i></span></td>";
    tr = tr + "<td><div class='input-group'><input type='text' class='form-control noborder' id='txt_line_itemname_" + rowindex + "' placeholder='Description'><div class='input-group-addon'><i class='fa fa-industry text-info' onclick='cmd_show_Item_list(" + rowindex + ")' style='cursor:pointer'></i></div></div></td >";

    tr = tr + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_qty_" + rowindex + "' value='0.00'></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control' id='cbo_line_uom_" + rowindex + "'></select></div></td>";
    tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_price_" + rowindex + "' placeholder = 'Price' value='0.0000' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_dis_per_" + rowindex + "' placeholder = 'Dis%' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_dis_amt_" + rowindex + "' placeholder = 'Dis Amt' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_line_total_" + rowindex + "' placeholder = 'Total' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control' id='cbo_line_whs_" + rowindex + "'></select></div></td>";
    tr = tr + "<td></td>";
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