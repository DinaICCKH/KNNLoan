var allow = 0;
//For Summary and Detail
function change_line_detail(detailid, summaryid) {
    var qty = returnstringvalue($("#txt_line_detail_qty_" + detailid).val());
    var boqty = returnstringvalue($("#txt_line_detail_bal_qty_" + detailid).val());
    if (parseFloat(qty) > parseFloat(boqty)) {
        ShowAlert("Request Quantity is greater than BOQ Quantity");
        qty = boqty;
    }
    $("#txt_line_detail_qty_" + detailid).val(convert2digit(qty));
    sum_detail_by_header_id(summaryid);
}
function change_line_summary(summaryid,rowtype) {

    var namedetail = "";
    if (rowtype == 1) {
        var qty = $("#txt_line_summary_qty_" + summaryid).val();
        $("#txt_line_summary_qty_" + summaryid).val(convert2digit(qty));

        namedetail= "name_line_detail_qty_" + summaryid;

        $("input[name=" + namedetail + "]").each(function () {
            $(this).val(convert2digit(qty));
        });
    }
    else {
        var cboval = "";
        var cboid = "";
        namedetail="name_line_detail_qty_" + summaryid;
        if (rowtype == 8) {
            cboval = $("#cbo_line_summary_uom_" + summaryid).val();
            cboid = "cbo_line_detail_uom_";
        }
        if (rowtype == 9) {
            cboval = $("#cbo_line_summary_whs_" + summaryid).val();
            cboid = "cbo_line_detail_whs_";
        }
        $("input[name=" + namedetail + "]").each(function () {
            var id = $(this).attr('id').replace("txt_line_detail_qty_", "");
            $("#" + cboid + id).val(cboval);
        });
    }
}
function sum_detail_by_header_id(summaryid) {
    var namedetail = "name_line_detail_qty_" + summaryid;
    var sumQty = 0;
    $("input[name=" + namedetail + "]").each(function () {
        sumQty = sumQty + parseFloat(returnstringvalue($(this).val()));
    });
    $("#txt_line_summary_qty_" + summaryid).val(convert2digit(sumQty));
}
function cmd_choose_document() {
    var option = "";
    var whs = "";
    $("#table_whs > tbody >tr").each(function () {
        if ($("#cbo_ocrcode").val() == $(this).find("td:eq(4)").text()){
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
            list_item.push($("#boq_line_filer_item_code_" + id).text());
            var d = {
                GlobalCode: $("#boq_line_filer_globalcode_" + id).text(),
                ItemBrandCode: $("#boq_line_filer_brand_code_" + id).text(),
                ItemBrandName: $("#boq_line_filer_brand_name_" + id).text(),
                ItemCode: $("#boq_line_filer_item_code_" + id).text(),
                UgpEntry: $("#boq_line_filer_ugpentry_"+id).text(),
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
                SubWorkCode: $("#boq_line_filer_subcode_" + id).text(),
                SubWorkName: $("#boq_line_filer_sub_name_" + id).text(),
                FloorWorkCode: $("#boq_line_filer_floorcode_" + id).text(),
                FloorName: $("#boq_line_filer_floor_name_" + id).text(),
                BaseEntry: $("#boq_line_filer_base_entry_" + id).text(),
                BaseLine: $("#boq_line_filer_base_line_" + id).text(),
                BaseType: "BOQ",
                UoMName: $("#boq_line_filer_uom_name_" + id).text(),
                WhsCode: $("#boq_line_filer_whs_" + id).text()
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
        if($("#td_summary_is_Sumamry_"+index).text() == "Header"){
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
        data = data + "<td><i class='fa fa-circle text-danger' style='cursor:pointer;' id='td_summary_check_all_" + headerrowindex + "' onclick='check_document_summary_detail(" + headerrowindex + ")'></i><i class='fa fa-circle text-yellow' id='td_summary_uncheck_all_" + headerrowindex + "' style='cursor:pointer; display:none' onclick='uncheck_document_summary_detail(" + headerrowindex + ")'></i></td>";
        data = data + "<td><i class='fa fa-plus text-info' onclick='cmd_line_show_detail(" + headerrowindex + ")' style='cursor:pointer'></i></td>";
        data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_summary(" + headerrowindex + ")'></i></td>";

        data = data + "<td colspan='2'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_item_name_" + headerrowindex + "' placeholder='Description' readonly='readonly' value=''></div></td>";
        data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_qty_" + headerrowindex + "' placeholder='Quantity' value='0.00' onchange='change_line_summary(" + headerrowindex + ",1)' ></div></td>";
        data = data + "<td colspan='2'></td>";
        //data = data + "<td><div class='form-group'><select class='form-control form-control-insde header-color' id='cbo_line_summary_uom_" + headerrowindex + "' onchange='change_line_summary(" + headerrowindex + ",8)'>" + option + "</select></td>";
        data = data + "<td><div class='form-group'></td>";
        data = data + "<td><div class='form-group'></div></td>";
        data = data + "<td colspan='7'></td>";
        data = data + "<td style='display:none' id='td_line_summary_item_code_" + headerrowindex + "'>" + list_distinct_item[i] + "</td>";
        data = data + "<td style='display:none' id='td_line_summary_line_num_" + headerrowindex + "'>" + headerrowindex + "</td>";
        data = data + "</tr>";
        $.each(list_selected_item, function (key, value) {
            option = "";
            if (value.ItemCode == list_distinct_item[i]) {
                if (value.UgpEntry == "-1") {
                    option = option + "<option value='-1'>" + value.UoMName + "</option>";
                }
                else {
                    $("#table_uom_group > tbody >tr").each(function () {
                        if ($(this).find("td:eq(0)").text() == value.UgpEntry) {
                            option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                    });
                }
                total_sub_qty = total_sub_qty + parseFloat(returnstringvalue(value.Quantity));
                data = data + "<tr name='name_tr_detail_" + headerrowindex + "' style='display:none' id='tr_pr_detail_" + headerrowindex + "" + detailrowindex + "'>";
                data = data + "<td><input type='checkbox' id='checkbox_line_detail_checkbox_" + headerrowindex + "" + detailrowindex + "' name='name_line_detail_checkbox_" + headerrowindex + "'></td>";
                data = data + "<td style='display:none'>D</td>";
                data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></i></td>"
                data = data + "<td colspan='3'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_line_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' placeholder='Quantity' value='" + convert2digit(value.PRBalQty) + "' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='BOQ Quantity' readonly='readonly' id='txt_line_detail_ori_qty_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Quantity) + "'></div></td>";
                
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='BOQ Quantity' readonly='readonly' id='txt_line_detail_bal_qty_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.PRBalQty) + "'></div></td>";
                data = data + "<td><div class='form-group'><select class='form-control form-control-insde' disabled name='name_line_detail_uom_" + headerrowindex +"' id='cbo_line_detail_uom_"+ headerrowindex + "" + detailrowindex + "'>" + option + "</select></td>";
                
                data = data + "<td>" + value.OcrCode2Name + "</td>";
                data = data + "<td>" + value.MainWorkName + "</td>";
                data = data + "<td>" + value.SubWorkName + "</td>";
                data = data + "<td>" + value.FloorName + "</td>";
                data = data + "<td style='display:none' id='line_detail_global_code_" + headerrowindex + "" + detailrowindex + "'>" + value.GlobalCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_name_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemName + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_brand_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemBrandCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_ocrcode_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_ocrcode2_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode2 + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_ocrcode3_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode3 + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_main_code_" + headerrowindex + "" + detailrowindex + "'>" + value.MainworkCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_sub_code_" + headerrowindex + "" + detailrowindex + "'>" + value.SubWorkCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_floor_code_" + headerrowindex + "" + detailrowindex + "'>" + value.FloorWorkCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_line_num_" + headerrowindex + "" + detailrowindex + "'>" + detailrowindex + "</td>";
                //data = data + "<td style='display:none' id='line_detail_item_whs_code_" + headerrowindex + "" + detailrowindex + "'><select class='form-control form-control-insde' disabled name='name_line_detail_item_whs_code_" + headerrowindex + "' id='cbo_line_detail_item_whs_code_" + headerrowindex + "" + detailrowindex + "'>" + whs + "</select></td>";
                data = data + "<td style='display:none' id='line_detail_item_whs_code_" + headerrowindex + "" + detailrowindex + "'>" + value.WhsCode + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_base_entry_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseEntry + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_base_line_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseLine + "</td>";
                data = data + "<td style='display:none' id='line_detail_item_base_type_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseType + "</td>";
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
        //$("#cbo_line_summary_uom_" + headerrowindex).append(uomname);
        headerrowindex++;
    }
    $("#modal_boq_ist").modal('hide');
}
function cmd_choose_document_edit() {
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
                SubWorkCode: $("#boq_line_filer_subcode_" + id).text(),
                SubWorkName: $("#boq_line_filer_sub_name_" + id).text(),
                FloorWorkCode: $("#boq_line_filer_floorcode_" + id).text(),
                FloorName: $("#boq_line_filer_floor_name_" + id).text(),
                BaseEntry: $("#boq_line_filer_base_entry_" + id).text(),
                BaseLine: $("#boq_line_filer_base_line_" + id).text(),
                BaseType: "BOQ",
                UoMName: $("#boq_line_filer_uom_name_" + id).text(),
                WhsCode: $("#boq_line_filer_whs_" + id).text()
            };
            list_selected_item.push(d);
        }
    });
    var list_distinct_item = list_item.filter(function (item, i, list_item) {
        return i == list_item.indexOf(item);
    });

    ////Finding Table Row Index
    var headerrowindex = 0;
    var checkReady = 0;
    var appendIndext = 0;
    var itemname = "";
    var detailrowindex = 0;
    var total_sub_qty = 0;
    var uomname = "";
    var itembrandname = "";
    for (i = 0; i < list_distinct_item.length; i++) {
        total_sub_qty = 0;
        checkReady = 0;
        ////finding item already exists or not
        $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
            var index = $(this).attr('id').replace("td_summary_", "");
            if ($("#td_summary_is_Sumamry_" + index).text() == "Header") {
                if ($("#td_line_summary_item_code_" + index).text() == list_distinct_item[i]) {
                    checkReady = 1;
                    headerrowindex = index;
                    return false;
                } else {
                    headerrowindex = index;//$(this).attr("id").replace("tr_po_head_", "");
                }
            }
        });
        if (checkReady == 1) {
            var namedetail = "name_tr_detail_" + headerrowindex;
            $("[name=" + namedetail + "]").each(function () {
                detailrowindex = $(this).attr('id').replace("tr_pr_detail_", "");
                appendIndext = $(this).index();
                total_sub_qty = total_sub_qty + parseFloat($("#txt_line_detail_qty_" + headerrowindex + "" + detailrowindex).val());
            });
            option = "";
            $.each(list_selected_item, function (key, value) {
                option = "";
                if (value.ItemCode == list_distinct_item[i]) {
                    if (value.UgpEntry == "-1") {
                        option = option + "<option value='-1'>" + value.UoMName + "</option>";
                    }
                    else {
                        $("#table_uom_group > tbody >tr").each(function () {
                            if ($(this).find("td:eq(0)").text() == value.UgpEntry) {
                                option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                            }
                        });
                    }
                    //$("#table_uom_group > tbody >tr").each(function () {
                    //    if ($(this).find("td:eq(0)").text() == value.UgpEntry) {
                    //        option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                    //    }
                    //});
                    total_sub_qty = total_sub_qty + parseFloat(returnstringvalue(value.Quantity));
                    var data = "<tr name='name_tr_detail_" + headerrowindex + "' style='display:none' id='tr_pr_detail_" + headerrowindex + "" + detailrowindex + "'>";
                    data = data + "<td><input type='checkbox' id='checkbox_line_detail_checkbox_" + headerrowindex + "" + detailrowindex + "' name='name_line_detail_checkbox_" + headerrowindex + "'></td>";
                    data = data + "<td style='display:none'>D</td>";
                    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></i></td>"
                    data = data + "<td colspan='3'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_line_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' placeholder='Quantity' value='" + convert2digit(value.PRBalQty) + "' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='BOQ Quantity' readonly='readonly' id='txt_line_detail_ori_qty_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Quantity) + "'></div></td>";

                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='BOQ Quantity' readonly='readonly' id='txt_line_detail_bal_qty_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.PRBalQty) + "'></div></td>";
                    data = data + "<td><div class='form-group'><select class='form-control form-control-insde' disabled name='name_line_detail_uom_" + headerrowindex + "' id='cbo_line_detail_uom_" + headerrowindex + "" + detailrowindex + "'>" + option + "</select></td>";

                    data = data + "<td>" + value.OcrCode2Name + "</td>";
                    data = data + "<td>" + value.MainWorkName + "</td>";
                    data = data + "<td>" + value.SubWorkName + "</td>";
                    data = data + "<td>" + value.FloorName + "</td>";
                    data = data + "<td style='display:none' id='line_detail_global_code_" + headerrowindex + "" + detailrowindex + "'>" + value.GlobalCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_name_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemName + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_brand_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemBrandCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode2_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode2 + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode3_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode3 + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_main_code_" + headerrowindex + "" + detailrowindex + "'>" + value.MainworkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_sub_code_" + headerrowindex + "" + detailrowindex + "'>" + value.SubWorkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_floor_code_" + headerrowindex + "" + detailrowindex + "'>" + value.FloorWorkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_line_num_" + headerrowindex + "" + detailrowindex + "'>-1</td>";

                    //data = data + "<td style='display:none' id='line_detail_item_whs_code_" + headerrowindex + "" + detailrowindex + "'><select class='form-control form-control-insde' disabled name='name_line_detail_uom_" + headerrowindex + "' id='cbo_line_detail_item_whs_code_" + headerrowindex + "" + detailrowindex + "'>" + whs + "</select></td>";

                    data = data + "<td style='display:none' id='line_detail_item_whs_code_" + headerrowindex + "" + detailrowindex + "'>" + value.WhsCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_base_entry_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseEntry + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_base_line_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseLine + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_base_type_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseType + "</td>";

                    data = data + "</tr>";
                    detailrowindex++;
                    $('#table_summary_detail tbody tr').filter(':nth-child(' + (appendIndext + 1) + ')').after(data);
                    $("[name=" + namedetail + "]").hide();
                    $("#td_is_summary_" + headerrowindex).text("H");
                }
            });
        } else {
            headerrowindex++;
            detailrowindex = 1;
            option = "";
            var data = "<tr id='td_summary_" + headerrowindex + "' class='header-color'>";
            data = data + "<td id='td_summary_is_Sumamry_" + headerrowindex + "' style='display:none'>Header</td>";
            data = data + "<td style='display:none' id='td_is_summary_" + headerrowindex + "'>H</td>";
            data = data + "<td><i class='fa fa-circle text-danger' style='cursor:pointer;' id='td_summary_check_all_" + headerrowindex + "' onclick='check_document_summary_detail(" + headerrowindex + ")'></i><i class='fa fa-circle text-yellow' id='td_summary_uncheck_all_" + headerrowindex + "' style='cursor:pointer; display:none' onclick='uncheck_document_summary_detail(" + headerrowindex + ")'></i></td>";
            data = data + "<td><i class='fa fa-plus text-info' onclick='cmd_line_show_detail(" + headerrowindex + ")' style='cursor:pointer'></i></td>";
            data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_summary(" + headerrowindex + ")'></i></td>";

            data = data + "<td colspan='2'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_item_name_" + headerrowindex + "' placeholder='Description' readonly='readonly' value=''></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_qty_" + headerrowindex + "' placeholder='Quantity' value='0.00' onchange='change_line_summary(" + headerrowindex + ",1)' ></div></td>";
            data = data + "<td colspan='2'></td>";
            //data = data + "<td><div class='form-group'><select class='form-control form-control-insde header-color' id='cbo_line_summary_uom_" + headerrowindex + "' onchange='change_line_summary(" + headerrowindex + ",8)'>" + option + "</select></td>";
            data = data + "<td><div class='form-group'></td>";
            data = data + "<td><div class='form-group'></div></td>";
            data = data + "<td colspan='7'></td>";
            data = data + "<td style='display:none' id='td_line_summary_item_code_" + headerrowindex + "'>" + list_distinct_item[i] + "</td>";
            data = data + "<td style='display:none' id='td_line_summary_line_num_" + headerrowindex + "'>-1</td>";
            data = data + "</tr>";
            $.each(list_selected_item, function (key, value) {
                option = "";
                if (value.ItemCode == list_distinct_item[i]) {
                    //$("#table_uom_group > tbody >tr").each(function () {
                    //    if ($(this).find("td:eq(0)").text() == value.UgpEntry) {
                    //        option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                    //    }
                    //});
                    if (value.UgpEntry == "-1") {
                        option = option + "<option value='-1'>" + value.UoMName + "</option>";
                    }
                    else {
                        $("#table_uom_group > tbody >tr").each(function () {
                            if ($(this).find("td:eq(0)").text() == value.UgpEntry) {
                                option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                            }
                        });
                    }


                    total_sub_qty = total_sub_qty + parseFloat(returnstringvalue(value.Quantity));
                    data = data + "<tr name='name_tr_detail_" + headerrowindex + "' style='display:none' id='tr_pr_detail_" + headerrowindex + "" + detailrowindex + "'>";
                    data = data + "<td><input type='checkbox' id='checkbox_line_detail_checkbox_" + headerrowindex + "" + detailrowindex + "' name='name_line_detail_checkbox_" + headerrowindex + "'></td>";
                    data = data + "<td style='display:none'>D</td>";
                    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></i></td>"
                    data = data + "<td colspan='3'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_line_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' placeholder='Quantity' value='" + convert2digit(value.PRBalQty) + "' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='BOQ Quantity' readonly='readonly' id='txt_line_detail_ori_qty_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Quantity) + "'></div></td>";

                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='BOQ Quantity' readonly='readonly' id='txt_line_detail_bal_qty_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.PRBalQty) + "'></div></td>";
                    data = data + "<td><div class='form-group'><select class='form-control form-control-insde' disabled name='name_line_detail_uom_" + headerrowindex + "' id='cbo_line_detail_uom_" + headerrowindex + "" + detailrowindex + "'>" + option + "</select></td>";

                    data = data + "<td>" + value.OcrCode2Name + "</td>";
                    data = data + "<td>" + value.MainWorkName + "</td>";
                    data = data + "<td>" + value.SubWorkName + "</td>";
                    data = data + "<td>" + value.FloorName + "</td>";
                    data = data + "<td style='display:none' id='line_detail_global_code_" + headerrowindex + "" + detailrowindex + "'>" + value.GlobalCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_name_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemName + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_brand_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemBrandCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode2_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode2 + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode3_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode3 + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_main_code_" + headerrowindex + "" + detailrowindex + "'>" + value.MainworkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_sub_code_" + headerrowindex + "" + detailrowindex + "'>" + value.SubWorkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_floor_code_" + headerrowindex + "" + detailrowindex + "'>" + value.FloorWorkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_line_num_" + headerrowindex + "" + detailrowindex + "'>-1</td>";
                    //data = data + "<td style='display:none' id='line_detail_item_whs_code_" + headerrowindex + "" + detailrowindex + "'><select class='form-control form-control-insde' disabled name='name_line_detail_uom_" + headerrowindex + "' id='cbo_line_detail_item_whs_code_" + headerrowindex + "" + detailrowindex + "'>" + whs + "</select></td>";

                    data = data + "<td style='display:none' id='line_detail_item_whs_code_" + headerrowindex + "" + detailrowindex + "'>" + value.WhsCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_base_entry_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseEntry + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_base_line_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseLine + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_base_type_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseType + "</td>";

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
    }
    $("#modal_boq_ist").modal('hide');
}
//Get Data from Database
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
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode2_" + rowindex + "'>" + x.OcrCode2 + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode2_name_" + rowindex + "'>" + x.OcrCode2Name + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode3_" + rowindex + "'>" + x.OcrCode3 + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode3_name_" + rowindex + "'>" + x.OcrCode3Name + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_main_code_" + rowindex + "'>" + x.U_MainWork + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_main_name_" + rowindex + "'>" + x.MainWorkName + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_subcode_" + rowindex + "'>" + x.U_SubWork + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_sub_name_" + rowindex + "'>" + x.SubWorkName + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_floorcode_" + rowindex + "'>" + x.U_Floor + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_floor_name_" + rowindex + "'>" + x.FloorWorkName + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_uom_code_" + rowindex + "'></td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_whs_" + rowindex + "'>"+x.WhsCode+"</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_bal_qty_" + rowindex + "'>" + x.PRBalQty + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_bal_amt_" + rowindex + "'>" + x.PRBalAmount + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_base_entry_" + rowindex + "'>" + x.ParentCode + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_base_line_" + rowindex + "'>" + x.ChildNum + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_uom_name_" + rowindex + "'>" + x.InvntryUom + "</td>";

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
    uncheck_all();
    uncheck_pop_document_all();
    set_default_boq();
}
function get_boq_edit(type) {
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
            url: '/getData/get_boq_edit',
            type: 'POST',
            data: {
                procode: $("#cbo_ocrcode").val(), zonecode: $("#cbo_ocrcode2").val(), housecode: $("#cbo_ocrcode3").val()
                , maincode: $("#cbo_main_work").val(), subcode: $("#cbo_sub_work").val(), detailcode: ""
                , floorcode: $("#cbo_floor_work").val(), type: type, Dockey: $("#txt_pr_dockey").val()
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
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode2_" + rowindex + "'>" + x.OcrCode2 + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode2_name_" + rowindex + "'>" + x.OcrCode2Name + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode3_" + rowindex + "'>" + x.OcrCode3 + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_ocrcode3_name_" + rowindex + "'>" + x.OcrCode3Name + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_main_code_" + rowindex + "'>" + x.U_MainWork + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_main_name_" + rowindex + "'>" + x.MainWorkName + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_subcode_" + rowindex + "'>" + x.U_SubWork + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_sub_name_" + rowindex + "'>" + x.SubWorkName + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_floorcode_" + rowindex + "'>" + x.U_Floor + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_floor_name_" + rowindex + "'>" + x.FloorWorkName + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_uom_code_" + rowindex + "'></td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_whs_" + rowindex + "'>" + x.WhsCode + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_bal_qty_" + rowindex + "'>" + x.PRBalQty + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_bal_amt_" + rowindex + "'>" + x.PRBalAmount + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_base_entry_" + rowindex + "'>" + x.ParentCode + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_base_line_" + rowindex + "'>" + x.ChildNum + "</td>";
                        tr = tr + "<td style='display:none' id='boq_line_filer_uom_name_" + rowindex + "'>" + x.InvntryUom + "</td>";


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
    uncheck_all();
    uncheck_pop_document_all();
    set_default_boq();
}

//Save Data
function cmd_save_summary_detail_pr(type,mode) {

    allow = 0;
    lineno = 0;
    var summary_list = [];
    var detail_list = [];
    var del_list = [];

    if ($("#txt_creator").val() == "") {
        ShowAlert("Creator is required");
        allow = 1;
    }
    if ($("#txt_posting_date").val() == "" && allow == 0) {
        ShowAlert("Posting Date is required");
        allow = 1;
    }
    if ($("#txt_req_date").val() == "" && allow == 0) {
        ShowAlert("Required Date is required");
        allow = 1;
    }
    if ($('#table_summary_detail > tbody  > tr').length == 0 && allow == 0) {
        ShowAlert("Please choose BOQ Information");
        allow = 1;
    }
    //$('#table_summary_detail > tbody  > tr').each(function (index, tr) {
    //    //if ($(this).find("td:eq(2)").text() != "Blank") {
    //    //    //if (parseFloat(returnstringvalue($(this).find("td:eq(14) input[type='text']").val())) == 0) {
    //    //    //    ShowAlert("Quantity cannot be zero");
    //    //    //    allow = 1;
    //    //    //    return;
    //    //    //}
    //    //}

    //});
    if (allow == 0) {
        var docdate = $('#txt_posting_date').val().trim().split("-");
        var reqdate = $('#txt_req_date').val().trim().split("-");
        var summaryid;
        if (mode == 'edit') {
            $('#tbl_Remove_List > tbody  > tr').each(function (i, t) {
                var del = {
                    DocEntry: $("#txt_pr_dockey").val(),
                    PRHLine: $("#HeadLine_" + i).text(),
                    LineNum: $("#DetailLine_" + i).text()
                };
                del_list.push(del);
            });
        }
        
        var head = {
            DocEntry: $("#txt_pr_dockey").val(),
            DocDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            ReqDate: reqdate[2] + "/" + reqdate[1] + "/" + reqdate[0],
            Requester: $("#txt_requestor").val(),
            RequestPur: $("#txt_remark").val(),
            Ref: $("#txt_ref_no").val(),
            IsBOQ: "Yes",
            CreatedBy: $("#txt_shared_userid").val(),
            BOQType: type,
            OcrCode: $("#cbo_ocrcode").val(),
        };
        $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
            if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text()=="S") {
                summaryid = $(this).attr('id').replace("td_summary_", "");
                var summary = {
                    LineNum: $("#td_line_summary_line_num_" + summaryid).text(),
                    ItemCode: $("#td_line_summary_item_code_" + summaryid).text().trim(),
                    ItemName: $("#txt_line_summary_item_name_" + summaryid).val().trim(),
                    Quantity: returnstringvalue($("#txt_line_summary_qty_" + summaryid).val()),
                    //UoM: $("#cbo_line_summary_uom_" + summaryid).val(),
                };
                summary_list.push(summary);
            }
            else {
                var detailid = $(this).attr('id').replace("tr_pr_detail_", "");
                var detail = {
                    LineNum: $("#line_detail_item_line_num_" + detailid).text().trim(),
                    PRHLine: $("#td_line_summary_line_num_" + summaryid).text().trim(),
                    ItemCode:$("#line_detail_item_code_" + detailid).text().trim(),
                    ItemName:$("#line_detail_item_name_" + detailid).text().trim(),
                    Quantity: returnstringvalue($("#txt_line_detail_qty_" + detailid).val()),
                    UoMEntry: $("#cbo_line_detail_uom_" + detailid).val(),
                    UPrice:"0.00",
                    LineTotal:"0.00",
                    //WhsCode: $("#cbo_line_detail_item_whs_code_" + detailid).val(),
                    WhsCode: $("#line_detail_item_whs_code_"+detailid).text(),
                    LineStatus:"Active",
                    OcrCode:$("#line_detail_item_ocrcode_" + detailid).text(),
                    OcrCode2:$("#line_detail_item_ocrcode2_" + detailid).text(),
                    OcrCode3:$("#line_detail_item_ocrcode3_" + detailid).text(),
                    MainworkCode: $("#line_detail_item_main_code_" + detailid).text(),
                    SubWorkCode:$("#line_detail_item_sub_code_" + detailid).text(),
                    FloorWorkCode:$("#line_detail_item_floor_code_" + detailid).text(),
                    GlobalCode:$("#line_detail_global_code_" + detailid).text(),
                    IsBOQ:"Yes",
                    BOQType: type,
                    BaseLine: $("#line_detail_item_base_line_" + detailid).text(),
                    BaseEntry: $("#line_detail_item_base_entry_" + detailid).text(),
                    BaseType: $("#line_detail_item_base_type_" + detailid).text(),
                    UoMName: $("#cbo_line_detail_uom_" + detailid + " option:selected").text(),
                };
                detail_list.push(detail);
            }
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/purpr/cmd_save_pr_summary_detail',
            data: JSON.stringify(
                {
                    'header': head,
                    'detail': detail_list,
                    'summary': summary_list,
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
function cmd_approver_action(action) {

}
