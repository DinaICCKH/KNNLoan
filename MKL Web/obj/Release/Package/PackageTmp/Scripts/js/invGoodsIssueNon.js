function cmd_pop_choose_item(type) {
    var option = "";
    var whs = "";
    var projectoption = "";
    var block = "";
    var mainworkoption = "";
    var floorwork = "";
    //$("#cbo_pr_uom > option").each(function () {
    //    option = option + "<option value='" + this.value + "'>" + this.text + "</option>";
    //});
    whs = "<option value=''></option>";
    $("#table_whs > tbody >tr").each(function () {
        if ($("#cbo_ocrcode").val() == $(this).find("td:eq(4)").text()) {
            whs = whs + "<option value='" + $(this).find("td:eq(0)").text() + "'>" + $(this).find("td:eq(1)").text() + "</option>";
        }
    });
    $("#cbo_ocrcode > option").each(function () {
        projectoption = projectoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    $("#cbo_ocrcode2 > option").each(function () {
        block = block + "<option value='" + this.value + "'>" + this.text + "</option>";
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
                if ($("#td_pop_master_ugpentry_" + id).text() == "-1") {
                    option = option + "<option value='-1'>" + $("#td_pop_master_uom_name_" + id).text() + "</option>";
                }
                else {
                    $("#table_uom_group > tbody >tr").each(function () {
                        if ($(this).find("td:eq(0)").text() == $("#td_pop_master_ugpentry_" + id).text()) {
                            if ($(this).find("td:eq(1)").text() == $("#td_pop_master_uom_entry_" + id).text()) {
                                option = option + "<option value='" + $(this).find("td:eq(1)").text() + "' selected>" + $(this).find("td:eq(2)").text() + "</option>";
                            }
                            else {
                                option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                            }
                        }
                    });
                }
                tr = "<tr id='tr_line_" + rowindex + "'>";
                tr = tr + "<td><input type='checkbox' name='check' id='check_" + rowindex + "'></td>";
                tr = tr + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_by_line(" + rowindex + ")'><i class='fa fa-fw fa-remove'></i></span></td>";
                tr = tr + "<td><div class='input-group'><input type='text' class='form-control noborder' id='txt_line_itemname_" + rowindex + "' placeholder='Description' value='" + itemname + "'><div class='input-group-addon'><i class='fa fa-industry text-info' onclick='cmd_show_Item_list(" + rowindex + ")' style='cursor:pointer'></i></div></div></td >";

                if ($("#td_pop_master_manage_by_" + id).text() == "N") {
                    tr = tr + "<td><div class='form-group'><input type ='text' style='text-align:center' class='form-control form-control-inside' id='txt_line_qty_" + rowindex + "' placeholder = 'Qty' value='0.00'></div></td>";
                }
                else {
                    tr = tr + "<td><div class='input-group'>";
                    tr = tr + "<input type ='text' style='text-align:center' class='form-control form-control-inside' id='txt_line_qty_" + rowindex + "' placeholder = 'Qty' value='0.00'>";
                    tr = tr + "<div class='input-group-addon'>";
                    tr = tr + "<i class='fa fa-circle text-info' onclick='cmd_line_show_manage_by_click(1)' style='cursor: pointer'></i>";
                    tr = tr + "</div>";
                    tr = tr + "</div></td>";
                }
                tr = tr + "<td><div class='form-group'><select class='form-control' id='cbo_line_uom_" + rowindex + "'>" + option + "</select></div></td>";
                tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' readonly='readonly' id='txt_line_price_" + rowindex + "' placeholder = 'Price' value='0.0000' onchange='change_line(" + rowindex + ")'></div></td>";
                tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' class='form-control form-control-inside' readonly='readonly' id='txt_line_dis_per_" + rowindex + "' placeholder = 'Dis%' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
                tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' class='form-control form-control-inside' readonly='readonly' id='txt_line_dis_amt_" + rowindex + "' placeholder = 'Dis Amt' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
                tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' readonly='readonly' id='txt_line_line_total_" + rowindex + "' placeholder = 'Total' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";

                tr = tr + "<td><div class='input-group'>";
                tr = tr + "<select class='form-control' name='name_line_whs' id='txt_line_whs_code_" + rowindex + "' onchange='txt_line_whs_code_change(" + rowindex + ")'>" + whs + "</select>";
                tr = tr + "<div class='input-group-addon' style='display:none' id='dv_show_bin_" + rowindex + "'>";
                tr = tr + "<i class='fa fa-circle text-info' onclick='cmd_line_show_bin_by_click()' style='cursor: pointer'></i>";
                tr = tr + "</div>";
                tr = tr + "<td style='display:none' id='td_line_qty_whs_" + rowindex + "'>0</td>";

                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_ocrcode2_" + rowindex + "' onchange='get_line_house_list_by_block(" + rowindex + ")'>" + block + "</select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_ocrcode3_" + rowindex + "' ​></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_main_work_" + rowindex + "' onchange='get_line_sub_work_list(" + rowindex + ")'>" + mainworkoption + "</select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_sub_work_" + rowindex + "' ></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_floor_work_" + rowindex + "' name='floorwork'>" + floorwork + "</select></td>";
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
                tr = tr + "<td style='display:none' id='td_line_enable_bin_" + rowindex + "'>N</td>";
                tr = tr + "<td style='display:none' id='td_line_is_batch_" + rowindex + "'>" + $("#td_pop_master_manage_by_" + id).text() + "</td>";
                tr = tr + "</tr >";
                $("#table_line_item>tbody").append(tr);
                rowindex++;
            }
        }
    });
    AddBlank();
    $("#modal_item_list").modal('hide');
    cmd_line_show_manage_by_click(0);
}
function AddBlank() {
    var rowindex = "999";
    var tr = "<tr id='tr_line_" + rowindex + "'>";
    tr = tr + "<td><input type='checkbox' name='check' id='check_" + rowindex + "'></td>";
    tr = tr + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_by_line(" + rowindex + ")'><i class='fa fa-fw fa-remove'></i></span></td>";
    tr = tr + "<td><div class='input-group'><input type='text' class='form-control noborder' id='txt_line_itemname_" + rowindex + "' placeholder='Description' value=''><div class='input-group-addon'><i class='fa fa-industry text-info' onclick='cmd_show_Item_list(" + rowindex + ")' style='cursor:pointer'></i></div></div></td >";
    tr = tr + "<td><div class='form-group'><input type ='text' style='text-align:center' class='form-control form-control-inside' id='txt_line_qty_" + rowindex + "' placeholder = 'Qty' value='0.00'></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control' id='cbo_line_uom_" + rowindex + "'></select></div></td>";
    tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' readonly='readonly' id='txt_line_price_" + rowindex + "' placeholder = 'Price' value='0.0000' ></div></td>";
    tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' class='form-control form-control-inside' readonly='readonly' id='txt_line_dis_per_" + rowindex + "' placeholder = 'Dis%' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' class='form-control form-control-inside' readonly='readonly' id='txt_line_dis_amt_" + rowindex + "' placeholder = 'Dis Amt' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><input type ='text' class='form-control form-control-inside' readonly='readonly' id='txt_line_line_total_" + rowindex + "' placeholder = 'Total' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_whs_code_" + rowindex + "'></select></td>";
    tr = tr + "<td style='display:none' id='td_line_qty_whs_" + rowindex + "'>0</td>";

    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_ocrcode2_" + rowindex + "' onchange='get_line_house_list_by_block(" + rowindex + ")'></select></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_ocrcode3_" + rowindex + "' ​></select></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_main_work_" + rowindex + "' onchange='get_line_sub_work_list(" + rowindex + ")'></select></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_sub_work_" + rowindex + "' ></select></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_floor_work_" + rowindex + "' name='floorwork'></select></td>";
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
/////For Batch
function Check_Item_Exist_Batch(ItemCode) {
    var found = 0;
    $("#table_batch_item>tbody>tr").each(function (index) {
        var id = $(this).attr('id').replace("tr_batch_item_", "");
        if ($("#td_batch_item_item_code_" + id).text() == ItemCode) {
            found = 1;
            return false;
        }
    });
    return found;
}
function Update_Item_Exist_Batch(ItemCode,qty) {
    $("#table_batch_item>tbody>tr").each(function (index) {
        var id = $(this).attr('id').replace("tr_batch_item_", "");
        if ($("#td_batch_item_item_code_" + id).text() == ItemCode) {
            $("#td_batch_item_total_qty_" + id).text(convert2digit(qty));
            return false;
        }
    });
}
function cmd_line_show_manage_by_click(show) {
    if (show == 1) {
        $("#modal_batch_list").modal('show');
    }
    else {
        $("#modal_batch_list").modal('hide');
    }
    $("#table_line_item>tbody>tr").each(function (index) {
        var detail_id = $(this).attr('id').replace("tr_line_", "");
        if ($("#td_line_is_batch_" + detail_id).text() == "B") {
            //Find item already exist
            if (Check_Item_Exist_Batch($("#td_line_item_code_" + detail_id).text()) == 0) {
                var data = "<tr id='tr_batch_item_" + index + "' onclick='tr_pop_batch_item_selected(" + index + "," + detail_id + ")'>";
                data = data + "<td id='td_batch_item_item_code_" + index + "'>" + $("#td_line_item_code_" + detail_id).text() + "</td>";
                data = data + "<td id='td_batch_item_item_name_" + index + "'>" + $("#td_line_item_name_" + detail_id).text() + "</td>";
                data = data + "<td  id='td_batch_item_total_qty_" + index + "'>" + $("#txt_line_qty_" + detail_id).val() + "</td>";
                data = data + "<td>" + $("#cbo_line_uom_" + detail_id + " option:selected").text() + "</td>";
                data = data + "<td id='td_batch_item_total_qty_creation_" + index + "'>0.00</td>";
                data = data + "<td  style='display:none' id='td_batch_item_detail_id_" + index + "'>" + detail_id + "</td>";
                data = data + "<td style='display:none' id='td_batch_item_uom_entry_" + index + "'>" + $("#cbo_line_uom_" + detail_id).val() + "</td>";
                data = data + "</tr>";
                $("#table_batch_item >tbody").append(data);
                tr_pop_batch_item_selected(index, detail_id);
            }
            else {
                Update_Item_Exist_Batch($("#td_line_item_code_" + detail_id).text(), $("#txt_line_qty_" + detail_id).val())
            }
            var sum_apply = sum_apply_batch_by_detail_id(detail_id);
            $("#td_batch_item_total_qty_creation_" + rowindex).text(convert2digit(sum_apply));
        }
    });
}
function ResetSelected_Background_Color(selectedindex, detail_id) {
    $("#table_batch_item > tbody > tr").each(function (index) {
        $(this).css("background-color", "white");
    });
    $("#tr_batch_item_" + selectedindex).css("background-color", "#e6f0ff");
    $("#txt_pop_batch_item_selected_detail_id").val(detail_id);
    $("#txt_pop_batch_item_selected_line_index").val(selectedindex);
}
function tr_pop_batch_item_selected(rowindex, detail_id) {
    ResetSelected_Background_Color(rowindex);
    var itemcode = $("#td_batch_item_item_code_" + rowindex).text();
    if (check_batch_list(detail_id) == 0) {
        $.ajax({
            url: '/invgi/get_batch_by_item',
            type: 'POST',
            data: { itemcode: itemcode },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (dt) {
                for (i = 0; i < dt.data.length; i++) {
                    var x = dt.data[i];
                    var BatchNum = x.ItemName;
                    var BatchQty = x.Quantity;
                    var exp = x.ItemBrandCode;
                    var data = "<tr id='tr_batch_item1_line_" + detail_id + "_" + i + "'>";
                    data = data + "<td style='display:none'></td>";
                    data = data + "<td style='display:none' id='td_batch_item1_item_code_" + detail_id + "_" + i + "'></td>";
                    data = data + "<td style='display:none'></td>";
                    data = data + "<td style='display:none'></td>";
                    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_remove_batch_item1(" + detail_id + "," + i + ")'></i></td>";
                    data = data + "<td id='td_batch_item1_batch_num_" + detail_id + "_" + i + "'>" + BatchNum + "</td>";
                    data = data + "<td id='td_batch_item1_batch_qty_" + detail_id + "_" + i + "'>" + BatchQty + "</td>";
                    data = data + "<td id='td_batch_item1_exp_" + detail_id + "_" + i + "'>" + exp + "</td>";
                    data = data + "<td><input type='text' class='form-control form-control-insde' id='txt_batch_item1_creation_qty_" + detail_id + "_" + i + "' placeholder='Quantity' value='0.00' onchange='change_batch_item1_qty(" + detail_id + "," + i + ")' ></td>";
                    data = data + "<td id='td_batch_item1_batch_balance_" + detail_id + "_" + i + "'>" + BatchQty + "</td>";
                    data = data + "<td  style='display:none' id='td_batch_item1_detail_id_" + detail_id + "_" + i + "'>" + detail_id + "</td>";
                    data = data + "<td style='display:none'>-1</td>";
                    data = data + "</tr>";
                    $("#table_batch_item1 >tbody").append(data);
                }
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
    Hide_batch_by_Detail(detail_id);
}
function cmd_remove_batch_item1(detail, row) {
    var id = detail + "_" + row;
    $("#tr_batch_item1_line_" + id).remove();
    var sum_apply = sum_apply_batch_by_detail_id(detail);
    $("#td_batch_item_total_qty_creation_" + detail).text(convert2digit(sum_apply));
}
function Hide_batch_by_Detail(detail) {
    $("#table_batch_item1 >tbody >tr").each(function () {
        if (typeof ($(this).attr('id')) == "undefined") {
            sumqty = sumqty;
        }
        else {
            var id = $(this).attr('id').replace("tr_batch_item1_line_", "");
            if ($("#td_batch_item1_detail_id_" + id).text() == detail) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
        }
    });
}
function change_batch_item1_qty(detail,row) {
    var id = detail + "_" + row;
    var oriqty = returnstringvalue($("#td_batch_item1_batch_qty_" + id).text());
    var qty = returnstringvalue($("#txt_batch_item1_creation_qty_" + id).val());
    if (parseFloat(qty) > parseFloat(oriqty)) {
        ShowAlert("Creation Batch Quantity is over");
        $("#txt_batch_item1_creation_qty_" + id).val("0.00");
    }
    var sum_apply = sum_apply_batch_by_detail_id(detail);
    var batch_item_qty_need = returnstringvalue($("#td_batch_item_total_qty_" + detail).text());
    if (parseFloat(sum_apply) > parseFloat(batch_item_qty_need)) {
        ShowAlert("Creation Batch Quantity is over");
        $("#txt_batch_item1_creation_qty_" + id).val("0.00");
    }
    sum_apply = 0;
    sum_apply = sum_apply_batch_by_detail_id(detail);
    var qty = returnstringvalue($("#txt_batch_item1_creation_qty_" + id).val());
    var balace = parseFloat(oriqty) - parseFloat(qty);
    $("#td_batch_item1_batch_balance_" + id).text(convert2digit(balace));
    $("#td_batch_item_total_qty_creation_" + detail).text(convert2digit(sum_apply));
}
function check_batch_list(detail_id) {
    var found = 0;
    if ($("#table_batch_item1 >tbody").length > 0) {
        $("#table_batch_item1 >tbody >tr").each(function () {
            //var id = $(this).attr('id').replace("tr_batch_item1_line_", "");
            if (typeof ($(this).attr('id')) == "undefined") {
                found = 0;
            }
            else {
                var id = $(this).attr('id').replace("tr_batch_item1_line_", "");
                if ($("#td_batch_item1_detail_id_" + id).text() == detail_id) {
                    found = 1;
                    return false;
                }
                //if ($("#td_batch_item1_item_code_" + id).text() == itemcode && $("#td_batch_item1_batch_num_" + id).text() == batchnum && $("#td_batch_item1_exp_" + id).text() == exp) {
                //    found = 1;
                //    return false;
                //}
            }
            
        });
    }
    return found;
}
function sum_apply_batch_by_detail_id(detail_id) {
    var sumqty = 0;
    if ($("#table_batch_item1 >tbody").length > 0) {
        $("#table_batch_item1 >tbody >tr").each(function () {
            if (typeof ($(this).attr('id')) != "undefined") {
                var id = $(this).attr('id').replace("tr_batch_item1_line_", "");
                if ($("#td_batch_item1_detail_id_" + id).text() == detail_id) {
                    sumqty = sumqty + parseFloat(returnstringvalue($("#txt_batch_item1_creation_qty_" + id).val()));
                }
            }
        });
    }
    return sumqty;
}
function NewBatch(detailid, apply_qty, rowindex) {
    var lastrowindex = $("#table_batch_item1 >tbody >tr").length;
    if (typeof ($("#table_batch_item1 >tbody").find("tr:last").attr("id")) == "undefined") {
        lastrowindex = 0;
    }
    else {
        var newrow = $("#table_batch_item1 >tbody").find("tr:last").attr("id").replace("tr_batch_item1_line_", "");
        lastrowindex = parseInt(newrow) + 1;
    }

    var data = "<tr id='tr_batch_item1_line_" + detailid + "_" + lastrowindex + "'>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_detail_id_" + detailid + "_" + lastrowindex + "'>" + detailid + "</td>";
    data = data + "<td style='display:none' id='td_batch_item1_item_code_" + detailid + "_" + lastrowindex + "'>" + itemcode + "</td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_item_name_" + detailid + "_" + lastrowindex + "'>" + itemname + "</td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_uom_entry_" + detailid + "_" + lastrowindex + "'>" + uomentry + "</td>";

    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_pop_batch_creation_remove(/" + param + "/)'></i></td>";
    data = data + "<td></td>";
    data = data + "<td></td>";
    data = data + "<td></td>";
    data = data + "<td style='display:none' id='td_pop_batch_creation_line_num_" + detailid + "_" + lastrowindex + "'>-1</td>";
    data = data + "</tr>";
    $("#table_batch_item1 >tbody").append(data);
}

function change_project(type) {
    var proid = "cbo_ocrcode";
    var blockid = "cbo_ocrcode2";
    var houseid = "cbo_ocrcode3";
    if (type == 1) {
        $("#" + blockid).val("");
        $("#" + houseid).empty();
    }
    get_house_data(proid, blockid, houseid);
    var whs = "";
    whs = "<option value=''></option>";
    $("#table_whs > tbody >tr").each(function () {
        if ($("#cbo_ocrcode").val() == $(this).find("td:eq(4)").text()) {
            whs = whs + "<option value='" + $(this).find("td:eq(0)").text() + "'>" + $(this).find("td:eq(1)").text() + "</option>";
        }
    });
    $("#table_line_item>tbody>tr").each(function () {
        var id = $(this).attr('id').replace("tr_line_", "");
        $("#txt_line_whs_code_" + id).empty();
        $("#txt_line_whs_code_" + id).append(whs);
    });
}
function txt_line_whs_code_change(id) {
    var whs = $("#txt_line_whs_code_" + id).val();
    var isbin = "N";
    $("#table_whs > tbody >tr").each(function () {
        if ($("#cbo_ocrcode").val() == $(this).find("td:eq(4)").text()) {
            if (whs == $(this).find("td:eq(0)").text()) {
                isbin = $(this).find("td:eq(3)").text();
            }
        }
    });
    if (isbin == "Y") {
        $("#dv_show_bin_" + id).show();
    }
    else {
        $("#dv_show_bin_" + id).hide();
    }
    //
}