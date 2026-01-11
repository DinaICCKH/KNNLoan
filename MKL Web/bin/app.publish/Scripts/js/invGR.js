
function cmd_line_summary_show_manage_by_click(showpop, def_status) {
    if (showpop == 1) {
        $("#modal_batch_list").modal('show');
    }
    else {
        $("#modal_batch_list").modal('hide');
    }
    $("#table_pop_item_batch_item >tbody >tr").remove();
    var status = "";
    $("#table_summary_detail >tbody>tr").each(function (index) {
        var detail_id = $(this).attr('id').replace("tr_detail_", "");
        if ($("#line_detail_item_managed_by_" + detail_id).text() == "B") {
            var data = "<tr id='tr_pop_batch_item_" + index + "' onclick='tr_pop_batch_item_selected(" + index + "," + status + ")'>";
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
            tr_pop_batch_item_selected(index, def_status);
        }
    });
    tr_pop_batch_item_selected("-1", def_status);
}

function get_boq(type) {
    allow = 0;
    if ($("#cbo_ocrcode").val() == "") {
        ShowAlert("Search BOQ is required for project");
        allow = 1;
    }
    if ($("#cbo_ocrcode2").val() == "" && allow == 0) {
        ShowAlert("Search BOQ is required for block");
        allow = 1;
    }
    if (allow == 0) {
        $.ajax({
            url: '/getData/get_boq',
            type: 'POST',
            data: {
                procode: $("#cbo_ocrcode").val(), zonecode: $("#cbo_ocrcode2").val(), housecode: $("#cbo_ocrcode3").val()
                , maincode: $("#cbo_main_work").val(), subcode: $("#cbo_sub_work").val(), detailcode: ""
                , floorcode: $("#cbo_floor_work").val(), type: type
            },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                $("#table_popup_document_list > tbody  > tr").remove();
                if (data.data.length > 0) {
                    var tr = "";
                    for (i = 0; i < data.data.length; i++) {
                        var x = data.data[i];
                        tr = tr + "<tr id='tr_pop_boq_" + rowindex + "'>";
                        tr = tr + "<td><input type='checkbox' name='pop_boq_chk' id='check_pop_boq_" + rowindex + "'></td>";
                        tr = tr + "<td>" + x.ChildCode + "</td>";
                        tr = tr + "<td id='boq_line_filer_item_name_" + rowindex + "'>" + x.ChildName + "</td>";
                        tr = tr + "<td id='boq_line_filer_boq_qty_" + rowindex + "'>" + convert2digit(x.Quantity) + "</td>";
                        tr = tr + "<td id='boq_line_filer_ocrcode3_name_" + rowindex + "'>" + x.OcrCode3Name + "</td>";
                        tr = tr + "<td id='boq_line_filer_main_name_" + rowindex + "'>" + x.MainWorkName + "</td>";
                        tr = tr + "<td id='boq_line_filer_sub_name_" + rowindex + "'>" + x.SubWorkName + "</td>";
                        tr = tr + "<td id='boq_line_filer_floor_name_" + rowindex + "'>" + x.FloorWorkName + "</td>";

                        tr = tr + "<td style='display:none' id='boq_line_filer_line_num_" + rowindex + "'>" + x.ChildNum + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_base_type_" + rowindex + "'>BOQ</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_brand_code_" + rowindex + "'>" + x.ItemBrandCode + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_brand_name_" + rowindex + "'>" + x.ItemBrandName + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_parent_code_" + rowindex + "'>" + x.ParentCode + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_globalcode_" + rowindex + "'>" + x.GlobalCode + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_item_code_" + rowindex + "'>" + x.ChildCode + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_ugpentry_" + rowindex + "'>" + x.UgpEntry + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode_" + rowindex + "'>" + x.OcrCode + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode_name_" + rowindex + "'>" + x.OcrCodeName + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode2_" + rowindex + "'>" + x.OcrCodeName + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode2_name_" + rowindex + "'>" + x.OcrCode2Name + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode3_" + rowindex + "'>" + x.OcrCode3 + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_main_code_" + rowindex + "'>" + x.U_MainWork + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_main_name_" + rowindex + "'>" + x.MainWorkName + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_subcode_" + rowindex + "'>" + x.U_SubWork + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_sub_name_" + rowindex + "'>" + x.SubWorkName + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_floorcode_" + rowindex + "'>" + x.U_Floor + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_floor_name_" + rowindex + "'>" + x.FloorWorkName + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_uom_code_" + rowindex + "'></td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_whs_" + rowindex + "'></td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_bal_qty_" + rowindex + "'>" + x.PRBalQty + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_bal_amt_" + rowindex + "'>" + x.PRBalAmount + "</td>";

                        tr = tr + "</tr >";
                        rowindex = rowindex + 1;
                    }
                    $("#table_popup_document_list >tbody").append(tr);
                    $("#modal_boq_ist").modal('show');
                }
                else {
                    ShowAlert("No BOQ List");
                }
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
    //uncheck_all();
    //uncheck_pop_document_all();
    //set_default_boq();
}
function cmd_choose_document() {
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
            list_item.push($("#boq_line_filer_item_code_" + id).text());
            var d = {
                GlobalCode: $("#boq_line_filer_globalcode_" + id).text(),
                ItemBrandCode: $("#boq_line_filer_brand_code_" + id).text(),
                ItemBrandName: $("#boq_line_filer_brand_name_" + id).text(),
                ItemCode: $("#boq_line_filer_item_code_" + id).text(),
                UgpEntry: $("#boq_line_filer_ugpentry_" + id).text(),
                ItemName: $("#boq_line_filer_item_name_" + id).text(),
                Quantity: $("#boq_line_filer_boq_qty_" + id).text(),
                PRBalQty: $("#boq_line_filer_bal_qty_" + id).text(),
                PRBalAmount: $("#boq_line_filer_bal_amt_" + id).text(),
                OcrCode: $("#boq_line_filer_ocrcode_" + id).text(),
                OcrCodeName: $("#boq_line_filer_ocrcode_name_" + id).text(),
                OcrCode2: $("#boq_line_filer_ocrcode2_" + id).text(),
                OcrCode2Name: $("#boq_line_filer_ocrcode2_name_" + id).text(),
                OcrCode3: $("#boq_line_filer_ocrcode3_" + id).text(),
                OcrCode3Name: $("#boq_line_filer_ocrcode3_name_" + id).text(),
                MainworkCode: $("#boq_line_filer_main_code_" + id).text(),
                MainWorkName: $("#boq_line_filer_main_name_" + id).text(),
                SubWorkCode: $("#boq_line_filer_sub_code_" + id).text(),
                SubWorkName: $("#boq_line_filer_sub_name_" + id).text(),
                FloorWorkCode: $("#boq_line_filer_floor_code_" + id).text(),
                FloorName: $("#boq_line_filer_floor_name_" + id).text()
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
    var itembrandname = "";
    for (i = 0; i < list_distinct_item.length; i++) {
        detailrowindex = 1;
        total_sub_qty = 0;
        option = "";
        var data = "<tr id='td_summary_" + headerrowindex + "' class='header-color'>";
        data = data + "<td id='td_summary_is_Sumamry_" + headerrowindex + "' style='display:none'>Header</td>";
        data = data + "<td style='display:none' id='td_is_summary_" + headerrowindex + "'>H</td>";
        data = data + "<td><i class='fa fa-plus text-info' onclick='cmd_line_show_detail(" + headerrowindex + ")' style='cursor:pointer'></i></td>";
        data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_summary(" + headerrowindex + ")'></i></td>";
        data = data + "<td colspan='2'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_item_name_" + headerrowindex + "' placeholder='Description' readonly='readonly' value=''></div></td>";
        data = data + "<td><div class='input-group'>";
        data = data + "<input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_qty_" + headerrowindex + "' placeholder='Quantity' value='0.00' onchange='change_line_summary(" + headerrowindex + ",1)' >";
        data = data + "<div class='input-group-addon' style='background-color:transparent;border:0px;'>";
        data = data + "<i class='fa fa-circle text-info' onclick='cmd_show_vendor()' style='cursor: pointer'></i>";
        data = data + "</div></div></td>";
        data = data + "<td><div class='form-group'><select class='form-control form-control-insde header-color' id='cbo_line_summary_uom_" + headerrowindex + "' onchange='change_line_summary(" + headerrowindex + ",8)'>" + option + "</select></td>";
        data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' name='name_line_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "' placeholder='Price' value='0.0000' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></td>";
        data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' name='name_line_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex+ "' placeholder='Total' value='0.00' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></td>";

        data = data + "<td><div class='form-group'><select class='form-control form-control-insde header-color' id='cbo_line_summary_whs_" + headerrowindex + "' onchange='change_line_summary(" + headerrowindex + ",9)'>" + whs + "</select></td>";
        data = data + "<td colspan='8'></td>";
        data = data + "</tr>";
        $.each(list_selected_item, function (key, value) {
            option = "";
            if (value.ItemCode == list_distinct_item[i]) {

                $("#table_uom_group > tbody >tr").each(function () {
                    if ($(this).find("td:eq(0)").text() == value.UgpEntry) {
                        option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                    }
                });

                total_sub_qty = total_sub_qty + parseFloat(returnstringvalue(value.Quantity));
                data = data + "<tr name='name_tr_detail_" + headerrowindex + "' style='display:none' id='tr_pr_detail_" + headerrowindex + "" + detailrowindex + "'>";
                data = data + "<td></td>";
                data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></i></td>"
                data = data + "<td colspan='2'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";
                
                data = data + "<td><div class='input-group'>";
                data = data + "<input type='text' style='text-align:right' class='form-control form-control-insde' name='name_line_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' placeholder='Quantity' value='" + convert2digit(value.PRBalQty) + "' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'>";
                data = data + "<div class='input-group-addon'>";
                data = data + "<i class='fa fa-circle text-info' onclick='cmd_show_vendor()' style='cursor: pointer'></i>";
                data = data + "</div></div></td>";

                data = data + "<td><div class='form-group'><select class='form-control form-control-insde' disabled name='name_line_detail_uom_" + headerrowindex + "' id='cbo_line_detail_uom_" + headerrowindex + "" + detailrowindex + "'>" + option + "</select></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_line_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' placeholder='Price' value='0.0000' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_line_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' placeholder='Total' value='0.00' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></td>";

                data = data + "<td><div class='form-group'><select class='form-control form-control-insde' name='name_line_detail_whs_" + headerrowindex + "' id='cbo_line_detail_whs_" + headerrowindex + "" + detailrowindex + "'>" + whs + "</select></td>";
                data = data + "<td></td>";
                data = data + "<td>" + value.OcrCode2Name + "</td>";
                data = data + "<td>" + value.MainWorkName + "</td>";
                data = data + "<td>" + value.SubWorkName + "</td>";
                data = data + "<td>" + value.FloorName + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_name_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemName + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_brand_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemBrandCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_ocrcode_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_ocrcode2_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode2 + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_ocrcode3_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode3 + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_main_code_" + headerrowindex + "" + detailrowindex + "'>" + value.U_MainWork + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_sub_code_" + headerrowindex + "" + detailrowindex + "'>" + value.U_SubWork + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_floor_code_" + headerrowindex + "" + detailrowindex + "'>" + value.U_Floor + "</td>";
                data = data + "</tr>";
                detailrowindex++;
                itemname = value.ItemName;
                uomname = option;
                itembrandname = value.ItemBrandName;
            }
        });
        $("#table_summary_detail >tbody").append(data);
        $("#txt_line_summary_item_name_" + headerrowindex).val(itemname);
        $("#txt_line_summary_qty_" + headerrowindex).val(convert2digit(total_sub_qty));
        $("#cbo_line_summary_uom_" + headerrowindex).append(uomname);
        headerrowindex++;
    }
    $("#modal_boq_ist").modal('hide');
}
function cmd_pr_show_Item_list(selectedrowIndex) {
    $("#txtselectrowindex").val(selectedrowIndex);
    $('input:checkbox[name="ck_pop_item"]').prop('checked', false);
    $("#modal-pr-item_ist").modal('show');
    cmd_pr_filter_pop_boq_uncheck_all();
}
function cmd_pr_filter_pop_boq_uncheck_all() {
    $("#table_pr_pop_boq_list>tbody>tr").each(function (index) {
        if ($("#tr_pop_boq_" + index).is(":visible")) {
            $("#ck_pop_boq_" + index).prop('checked', false);
        }
        else {
            $("#ck_pop_boq_" + index).prop('checked', false);
        }
    });
    $("#th_pr_pop_check").show();
    $("#th_pr_pop_uncheck").hide();
}
function cmd_pr_filter_pop_boq_check_all() {
    $("#table_pr_pop_boq_list>tbody>tr").each(function (index) {
        var id = $(this).attr('id').replace("tr_pop_boq_", "");

        if ($("#tr_pop_boq_" + id).css('display') == 'none') {
            $("#ck_pop_boq_" + id).prop('checked', false);
        }
        else {
            $("#ck_pop_boq_" + id).prop('checked', true);
        }
    });
    $("#th_pr_pop_check").hide();
    $("#th_pr_pop_uncheck").show();
}

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
                    tr = tr + "<td><div class='form-group'><input type ='text' style='text-align:center' class='form-control form-control-inside' id='txt_line_qty_" + rowindex + "' placeholder = 'Qty' value='0.00' onchange='change_line_pr(" + rowindex + ")'></div></td>";
                }
                else {
                    tr = tr + "<td><div class='input-group'>";
                    tr = tr + "<input type ='text' style='text-align:center' class='form-control form-control-inside' id='txt_line_qty_" + rowindex + "' placeholder = 'Qty' value='0.00' onchange='change_line_pr(" + rowindex + ")'>";
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
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_whs_code_" + rowindex + "' onchange='get_line_house_list_by_block(" + rowindex + ")'>" + whs + "</select></td>";
                tr = tr + "<td id='td_line_qty_whs_" + rowindex + "'>0</td>";

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
                tr = tr + "<td style='display:none' id='line_detail_item_whs_code_" + rowindex + "'><select class='form-control form-control-insde' disabled name='name_line_detail_item_whs_code_" + rowindex + "' id='cbo_line_detail_item_whs_code_" + rowindex + "'>" + whs + "</select></td>";
                tr = tr + "</tr >";
                $("#table_line_item>tbody").append(tr);
                rowindex++;
            }
        }
    });
    AddBlank();
    $("#modal_item_list").modal('hide');
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
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_whs_code_" + rowindex + "' onchange='get_line_house_list_by_block(" + rowindex + ")'></select></td>";
    tr = tr + "<td id='td_line_qty_whs_" + rowindex + "'>0</td>";

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

function cmd_pq_line_summary_manage_by_by_item_click(id) {
    $("#modal-batch_list").modal('show');
    var itemcode = $("#txt_line_pr_item_code_" + id).text();
    var itemname = $("#txt_line_pr_itemname_" + id).val();
    $("#txt_pop_batch_summary_id").val(id);
    cmd_pop_cancel_batch();
    pop_batch_check_batch(id);
    pop_batch_new_row(id, itemcode, itemname);
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
function change_line_whs_pq(id) {
    var isbin = "";
    $("#table_whs > tbody>tr").each(function () {
        if ($("#txt_line_pr_whs_code_" + id).val() == $(this).find("td:eq(0)").text()) {
            isbin = $(this).find("td:eq(3)").text();
            return false;
        }
    });
    if (isbin == "N") {
        $("#btn_line_pr_bin_" + id).hide();
    } else {
        $("#btn_line_pr_bin_" + id).show();
    }
}
function cmd_pq_line_summary_bin_by_item_click(summaryid) {
    var whscode = $("#txt_line_pr_whs_code_" + summaryid).val();
    var whsname = $("#txt_line_pr_whs_code_" + summaryid).find(":selected").text();
    $("#modal-bin_list").modal('show');
    var found = 0;
    pop_bing_check();
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
        });
    }
    $("#table_pop_whs_bin >tbody >tr").each(function () {
        if ($(this).find("td:eq(3) input[type='text']").val() == whscode) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}
function pop_bing_check() {
    $("#table_pop_whs_bin >tbody >tr").each(function () {
        if ($(this).find("td:eq(1)").text() == "new") {
            $(this).remove();
        }
    });
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
//get data from SAP
function cbo_cost_center_change(type) {
    var cboval = "";
    var id = "";
    switch (type) {
        case 2:
            cboval = $("#cbo_pr_project").val();
            id = "cbo_pr_zone";
            //$("#cbo_pr_street").empty();
            $("#cbo_pr_house").empty();
            break;
        case 3:
            cboval = $("#cbo_pr_zone").val();
            id = "cbo_pr_house";
            $("#cbo_pr_house").empty();
            break;
        case 4:
            cboval = $("#cbo_pr_street").val();
            id = "cbo_pr_house";
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
function cbo_cost_work_change(type) {
    var cboval = "";
    var id = "";
    switch (type) {
        case 1:
            cboval = $("#cbo_pr_main_work").val();
            id = "cbo_pr_sub_work";
            $("#cbo_pr_detail_work").empty();
            break;
        case 2:
            cboval = $("#cbo_pr_sub_work").val();
            id = "cbo_pr_detail_work";
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
function txt_line_pr_costcenter_change(index, type) {
    var cboval = "";
    var id = "";
    switch (type) {
        case 2:
            cboval = $("#txt_line_pr_ocrcode_" + index).val();
            id = "txt_line_pr_ocrcode2_" + index;
            $("#txt_line_pr_ocrcode3_" + index).empty();
            break;
        case 3:
            cboval = $("#txt_line_pr_ocrcode2_" + index).val()
            id = "txt_line_pr_ocrcode3_" + index;
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
function txt_line_pr_work_change(index, type) {
    var cboval = "";
    var id = "";
    switch (type) {
        case 1:
            cboval = $("#txt_line_pr_mainwork_" + index).val();
            id = "txt_line_pr_subwork_" + index;
            $("#txt_line_pr_detailwork_" + index).empty();
            break;
        case 2:
            cboval = $("#txt_line_pr_subwork_" + index).val();
            id = "txt_line_pr_detailwork_" + index;
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
function cmd_pr_update_all_row() {
    var ocrcode = "";
    var ocrcode2 = "";
    var ocrcode3 = "";
    var ocrcode4 = "";
    var mainworkoption = "";
    var subwork = "";
    var detailwork = "";
    var floorwork = "";
    ///projectoption = "<option value=''></option>";
    $("#cbo_pr_project > option").each(function () {
        if (this.value == $("#cbo_pr_project").val()) {
            ocrcode = ocrcode + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            ocrcode = ocrcode + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });
    $("#cbo_pr_zone > option").each(function () {
        if (this.value == $("#cbo_pr_zone").val()) {
            ocrcode2 = ocrcode2 + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            ocrcode2 = ocrcode2 + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });
    $("#cbo_pr_house > option").each(function () {
        if (this.value == $("#cbo_pr_house").val()) {
            ocrcode3 = ocrcode3 + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            ocrcode3 = ocrcode3 + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });

    //mainworkoption = "<option value=''></option>";
    $("#cbo_pr_main_work > option").each(function () {
        if (this.value == $("#cbo_pr_main_work").val()) {
            mainworkoption = mainworkoption + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            mainworkoption = mainworkoption + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });

    $("#cbo_pr_sub_work > option").each(function () {
        if (this.value == $("#cbo_pr_sub_work").val()) {
            subwork = subwork + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            subwork = subwork + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });

    $("#cbo_pr_detail_work > option").each(function () {
        if (this.value == $("#cbo_pr_detail_work").val()) {
            detailwork = detailwork + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            detailwork = detailwork + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });

    ///worktype = "<option value=''></option>";
    $("#cbo_pr_floor_work > option").each(function () {
        if (this.value == $("#cbo_pr_floor_work").val()) {
            floorwork = floorwork + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            floorwork = floorwork + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });


    $('#table_pr > tbody  > tr').each(function (index, tr) {
        var id = tr.id.replace("tr_pr_", "");
        if (id != "999") {
            $("#txt_line_pr_ocrcode_" + id).empty();
            $("#txt_line_pr_ocrcode_" + id).append(ocrcode);
            $("#txt_line_pr_ocrcode2_" + id).empty();
            $("#txt_line_pr_ocrcode2_" + id).append(ocrcode2);
            $("#txt_line_pr_ocrcode3_" + id).empty();
            $("#txt_line_pr_ocrcode3_" + id).append(ocrcode3);
            //$("#txt_line_pr_ocrcode4_" + id).empty();
            //$("#txt_line_pr_ocrcode4_" + id).append(ocrcode4);

            $("#txt_line_pr_mainwork_" + id).empty();
            $("#txt_line_pr_mainwork_" + id).append(mainworkoption);

            $("#txt_line_pr_subwork_" + id).empty();
            $("#txt_line_pr_subwork_" + id).append(subwork);

            $("#txt_line_pr_detailwork_" + id).empty();
            $("#txt_line_pr_detailwork_" + id).append(detailwork);

            $("#txt_line_pr_floor_work_" + id).empty();
            $("#txt_line_pr_floor_work_" + id).append(floorwork);

        }
    });
}