var list = [];
var dellist = [];
var allow = 0;
var lineno = 0;
var options = "";
////Summary Change
//function txt_pq_line_summary_combo_change(summaryindex, type) {
//    var uom_detail = "";
//    var summaryid = "";
//    if (type == 1) {
//        uom_detail = "pq_line_sub_uom_" + summaryindex;
//        summaryid = "txt_pq_line_summary_uom_" + summaryindex;
//    }
//    if (type == 2) {
//        uom_detail = "pq_line_sub_whs_" + summaryindex;
//        summaryid = "txt_pq_line_summary_whs_" + summaryindex;
//    }
//    $("select[name=" + uom_detail + "]").empty();
//    var opt = "";
//    $("#" + summaryid + " > option").each(function () {
//        if (this.value == $("#" + summaryid).val()) {
//            opt = opt + "<option value='" + this.value + "' selected=selected>" + this.text + "</option>";
//        }
//        else {
//            opt = opt + "<option value='" + this.value + "'>" + this.text + "</option>";
//        }
//    });
//    $("select[name=" + uom_detail + "]").append(opt);
//}
//function txt_pq_line_summary_txt_change(summaryindex, type) {
//    var detail_name = "";
//    var detail_name_total = "pq_line_sub_total_" + summaryindex;
//    var summary_id = "";
//    var summary_total = "txt_pq_line_summary_line_total_" + summaryindex;
//    var summary_qty = 0;
//    var summary_price = 0;
//    if (type == 1) {
//        detail_name = "pq_line_sub_qty_" + summaryindex;
//        summary_id = "txt_pq_line_summary_qty_" + summaryindex;
//    }
//    if (type == 2) {
//        detail_name = "pq_line_sub_price_" + summaryindex;
//        summary_id = "txt_pq_line_summary_price_" + summaryindex;
//    }
//    var summary_val = $("#" + summary_id).val();
//    $("#" + summary_id).val((type == 1 ? convert2digit(summary_val) : convert4digit(summary_val)));

//    //Calculate for summary
//    summary_qty = convert2digit($("#txt_pq_line_summary_qty_" + summaryindex).val());
//    summary_price = convert4digit($("#txt_pq_line_summary_price_" + summaryindex).val());
//    var total = parseFloat(summary_qty) * parseFloat(summary_price);
//    $("#txt_pq_line_summary_line_total_" + summaryindex).val(convert2digit(total));

//    //calculate and update for detail
//    $("input[name=" + detail_name + "]").val((type == 1 ? convert2digit(summary_val) : convert4digit(summary_val)));
//    recalculate_price_last_total(detail_name, summaryindex, type);

//}
//function recalculate_price_last_total(detail_name, summaryindex, type) {
//    var detail_index = 0;
//    var str = "0";
//    detail_name = "pq_line_sub_net_price_name_" + summaryindex;
//    var count_sub = $("input[name=" + detail_name + "]").length;
//    var amount_after_4digit = 0;
//    var countlastrow = 0;
//    $("input[name=" + detail_name + "]").each(function () {
//        //alert($(this).attr('id'));
//        countlastrow++;
//        detail_index = $(this).attr('id').replace("txt_pq_line_sub_netprice_", "");
//        var sub_qty = $("#txt_pq_line_sub_qty_" + detail_index).val();
//        var sub_price = $("#txt_pq_line_sub_boq_price_" + detail_index).val();
//        var sub_total = parseFloat(returnstringvalue(sub_qty)) * parseFloat(returnstringvalue(sub_price));
//        $("#txt_pq_line_sub_netprice_" + detail_index).val(convert2digit(sub_total));

//        str = returnstringvalue(convert2digit(sub_total)).toString();
//        total2digit = str.slice(0, str.indexOf(".") + 3);

//        $("#txt_pq_line_sub_boq_linetotal_" + detail_index).val(convert2digit(total2digit));
//        amount_after_4digit = parseFloat(amount_after_4digit) + parseFloat("0.00" + str.slice(str.indexOf(".") + 3, str.length));
//        if (count_sub == countlastrow) {
//            total2digit = parseFloat(total2digit) + parseFloat(amount_after_4digit);
//            $("#txt_pq_line_sub_boq_linetotal_" + detail_index).val(convert2digit(total2digit));
//        }
//    });
//    if (type == 2) {
//        var sumnetprice = 0;
//        var headqty = $("#txt_pq_line_summary_qty_" + summaryindex).val();
//        var sub_netpricename = "pq_line_sub_net_price_name_" + summaryindex;
//        $("input[name=" + sub_netpricename + "]").each(function () {
//            sumnetprice = sumnetprice + parseFloat(returnstringvalue($(this).val()));
//        });
//        var newavgprice = 0;
//        newavgprice = sumnetprice / headqty;
//        $("#txt_pq_line_summary_price_" + summaryindex).val(convert4digit(newavgprice));
//    }
//    var sub_line_total_name = "pq_line_sub_total_" + summaryindex;
//    amount_after_4digit = 0.00;
//    $("input[name=" + sub_line_total_name + "]").each(function () {
//        amount_after_4digit = amount_after_4digit + parseFloat(returnstringvalue($(this).val()));
//    });

//    $("#txt_pq_line_summary_line_total_" + summaryindex).val(convert2digit(amount_after_4digit));

//}
//function cmd_pq_line_remove_summary(summaryindex) {
//    var detail = "tr_pq_sub_" + summaryindex;
//    $("#tr_pq_" + summaryindex).remove();
//    $("[name=" + detail + "]").remove();

//}
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
    $("#table_pq_pop_pr_list >tbody>tr").remove();
    cmd_pq_filter_pop_up_uncheck_all();
}
function cmd_pq_filter_pop_up_check_all() {
    $('input:checkbox[name="chkpr"]').prop('checked', true);
    $("#th_pop_pr_check").hide();
    $("#th_pop_pr_uncheck").show();
}
function cmd_pq_filter_pop_up_uncheck_all() {
    $('input:checkbox[name="chkpr"]').prop('checked', false);
    $("#th_pop_pr_uncheck").hide();
    $("#th_pop_pr_check").show();
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
function cmd_pr_show_Item_list(selectedrowIndex) {
    $("#txtselectrowindex").val(selectedrowIndex);
    $('input:checkbox[name="ck_pop_item"]').prop('checked', false);
    $("#modal-pr-item_ist").modal('show');
    cmd_pr_filter_pop_boq_uncheck_all();
}
function cmd_pq_pop_choose_item(type) {
    var option = "";
    var whs = "";
    var projectoption = "";
    var mainworkoption = "";
    var floorwork = "";
    option = "<option value=''></option>";
    $("#cbo_pq_uom > option").each(function () {
        option = option + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    
    whs = "<option value=''></option>";
    $("#cbo_pq_whs > option").each(function () {
        whs = whs + "<option value='" + this.value + "'>" + this.text + "</option>";
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

    $('#table_pr > tbody > tr:last').remove();
    var rowindex = $("#table_pr >tbody >tr").length;
    if (typeof ($("#table_pr >tbody").find("tr:last").attr("id")) == "undefined") {
        rowindex = 0;
    }
    else {
        var newrow = $("#table_pr >tbody").find("tr:last").attr("id").replace("tr_pr_", "");
        rowindex = parseInt(newrow) + 1;
    }
    var selectedindex = $("#txtselectrowindex").val();
    $("#tr_999").remove();
    $("#table_pr_pop_boq_list > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("ck_pop_boq_", "");
            option = "";
            $("#table_uom_group >tbody>tr").each(function () {
                if ($(this).find("td:eq(0)").text() == $("#td_pr_pop_ugpentry_" + id).text()) {
                    if ($(this).find("td:eq(1)").text() == $("#td_pq_pop_base_uom_code_" + id).text()) {
                        option = option + "<option value='" + $(this).find("td:eq(1)").text() + "' selected=selected>" + $(this).find("td:eq(2)").text() + "</option>";
                    }
                    else {
                        option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                    }
                }
            });
            //var itemname = $("#tr_pop_boq_" + id).find("td:eq(2)").text() + "-" + $("#tr_pop_boq_" + id).find("td:eq(3)").text();
            var itemname = $("#td_pr_pop_item_code_" + id).text() + "-" + $("#td_pr_pop_item_name_" + id).text();
            if ($("#txtselectrowindex").val() != "999") {
                $("#txt_line_pr_itemname_" + $("#txtselectrowindex").val()).val(itemname);
                $("#txtselectrowindex").val("999");
            }
            else {
                tr = "<tr id='tr_pr_" + rowindex + "'>";
                tr = tr + "<td style='display:none' name='linenum'>-1</td>";
                tr = tr + "<td style='display:none' name='linestatus'>Active</td>";
                tr = tr + "<td style='display:none' name='itemcode'>" + $("#tr_pop_boq_" + id).find("td:eq(2)").text() + "</td>";
                tr = tr + "<td><input type='checkbox' name='chk_pr' id='ck_pr_" + rowindex + "'></td>";
                tr = tr + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_pq_line(" + rowindex + ")'><i class='fa fa-fw fa-remove'></i></span></td>";
                tr = tr + "<td name='itemname'><div class='input-group'><input type='text' class='form-control noborder form-control-inside' id='txt_line_pr_itemname_" + rowindex + "' placeholder='Description' value='" + itemname + "'><div class='input-group-addon'><i class='fa fa-industry text-info' onclick='cmd_pr_show_Item_list(" + rowindex + ")' style='cursor:pointer'></i></div></div></td >";
                tr = tr + "<td name='qty'><div class='form-group'><input type = 'text' class='form-control form-control-inside' id='txt_line_pr_qty_" + rowindex + "' placeholder = 'Qty' value='0.00' onchange='change_line_pq(" + rowindex + ",1)'></div></td>";
                tr = tr + "<td name='uom'><div class='form-group'><select class='form-control form-control-inside' name='uom'>" + option + "</select></div></td>";
                tr = tr + "<td><div class='form-group'><input type = 'text' class='form-control form-control-inside' id='txt_line_pr_price_" + rowindex + "' placeholder = 'Price' value='0.00' onchange='change_line_pq(" + rowindex + ",2)'></div></td>";
                tr = tr + "<td><div class='form-group'><input type = 'text' class='form-control form-control-inside' id='txt_line_pr_total_" + rowindex + "' readonly='readonly'  placeholder = 'Total' value='0.00'></div></td>";
                tr = tr + "<td name='whs'><div class='form-group'><select class='form-control form-control-inside' name='whs'>" + whs + "</select></div></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_ocrcode_" + rowindex + "' name='ocrcode' onchange='txt_line_pr_costcenter_change(" + rowindex + ",2)'>" + projectoption + "</select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_ocrcode2_" + rowindex + "' name='ocrcode' onchange='txt_line_pr_costcenter_change(" + rowindex + ",3)'></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_ocrcode3_" + rowindex + "' name='ocrcode3'​></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_mainwork_" + rowindex + "' name='mainwork' onchange='txt_line_pr_work_change(" + rowindex + ",1)'>" + mainworkoption + "</select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_subwork_" + rowindex + "' name='subwork' onchange='txt_line_pr_work_change(" + rowindex + ",2)'></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_detailwork_" + rowindex + "' name='detailwork'></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_floor_work_" + rowindex + "' name='floorwork'>" + floorwork + "</select></td>";
                tr = tr + "</tr >";
                $("#table_pr>tbody").append(tr);
                rowindex++;
            }
        }
    });
    AddBlankPR(type)
    $("#modal-pr-item_ist").modal('hide');
    cmd_pr_filter_pop_boq_check_all();
}
function cmd_pq_choose_pr(type) {
    
    $('#table_pr > tbody > tr:last').remove();
    var rowindex = $("#table_pr >tbody >tr").length;
    if (typeof ($("#table_pr >tbody").find("tr:last").attr("id")) == "undefined") {
        rowindex = 0;
    }
    else {
        var newrow = $("#table_pr >tbody").find("tr:last").attr("id").replace("tr_", "");
        rowindex = parseInt(newrow) + 1;
    }
    var selectedindex = $("#txtselectrowindex").val();
    $("#tr_999").remove();
    $("#table_pq_pop_pr_list > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id;
            var itemname = $("#tr_pop_boq_" + id).find("td:eq(2)").text() + "-" + $("#tr_pop_boq_" + id).find("td:eq(3)").text();

            if ($("#txtselectrowindex").val() != "999") {
                $("#txt_line_pr_itemname_" + $("#txtselectrowindex").val()).val(itemname);
                $("#txtselectrowindex").val("999");
            }
            else {
                //BaseEntry: $("#td_pq_pop_base_entry_" + id).text(),
                //BaseLine: $("#td_pq_pop_base_line_num_" + id).text(),
                //BaseType: "PR",
                //GlobalCode: $("#td_pq_pop_base_global_code_" + id).text(),
                //ItemCode: $("#td_pq_pop_base_item_code_" + id).text(),
                //ItemName: $("#td_pq_pop_base_item_name_" + id).text(),
                //Quantity: $("#td_pq_pop_base_qty_" + id).text(),
                //WhsCode: $("#td_pq_pop_base_whs_code_" + id).text(),
                //UoMEntry: $("#td_pq_pop_base_uom_code_" + id).text(),
                //UgpEntry: $("#td_pq_pop_base_ugpentry_" + id).text(),
                //OcrCode: $("#td_pq_pop_base_ocrcode_code_" + id).text(),
                //OcrCodeName: $("#td_pq_pop_base_ocrcode_name_" + id).text(),

                //OcrCode2: $("#td_pq_pop_base_ocrcode2_code_" + id).text(),
                //OcrCode2Name: $("#td_pq_pop_base_ocrcode2_name_" + id).text(),

                //OcrCode3: $("#td_pq_pop_base_ocrcode3_code_" + id).text(),
                //OcrCode3Name: $("#td_pq_pop_base_ocrcode3name_" + id).text(),

                //MainworkCode: $("#td_pq_pop_base_main_code_0" + id).text(),
                //MainWorkName: $("#td_pq_pop_base_mainworkname_" + id).text(),

                //SubWorkCode: $("#td_pq_pop_base_sub_code_0" + id).text(),
                //SubWorkName: $("#td_pq_pop_base_subworkname_" + id).text(),

                //DetailWorkCode: $("#td_pq_pop_base_detail_code_" + id).text(),
                //DetailName: $("#td_pq_pop_base_detailworkname_" + id).text(),

                //FloorWorkCode: $("#td_pq_pop_base_floor_code_" + id).text(),
                //    FloorName: $("#td_pq_pop_base_floorworkname_" + id).text()

                var option = "";
                var whs = "";
                var projectoption = "";
                var blockoption = "";
                var houseoption = "";
                var mainworkoption = "";
                var suboption = "";
                var detailoption = "";
                var floorwork = "";

                $("#table_uom_group >tbody>tr").each(function () {
                    if ($(this).find("td:eq(0)").text() == $("#td_pq_pop_base_ugpentry_" + id).text()) {

                        if ($(this).find("td:eq(1)").text() == $("#td_pq_pop_base_uom_code_" + id).text()) {
                            option = option + "<option value='" + $(this).find("td:eq(1)").text() + "' selected=selected>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                        else {
                            option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                    }
                });
                
                $("#cbo_pq_whs > option").each(function () {
                    if ($("#td_pq_pop_base_whs_code_" + id).text() == this.value) {
                        whs = whs + "<option value='" + this.value + "' selected=selected>" + this.text + "</option>";
                    }
                    else {
                        whs = whs + "<option value='" + this.value + "'>" + this.text + "</option>";
                    }
                });

                $("#cbo_pr_project > option").each(function () {
                    if (this.value == $("#td_pq_pop_base_ocrcode_code_" + id).text()) {
                        projectoption = projectoption + "<option value='" + this.value + "' selected=selected>" + this.text + "</option>";
                    }
                    else {
                        projectoption = projectoption + "<option value='" + this.value + "'>" + this.text + "</option>";
                    }
                });
                $("#table_block >tbody>tr").each(function () {
                    if ($(this).find("td:eq(0)").text() == $("#td_pq_pop_base_ocrcode_code_" + id).text()) {
                        if ($(this).find("td:eq(1)").text() == $("#td_pq_pop_base_ocrcode2_code_" + id).text()) {
                            blockoption = blockoption + "<option value='" + $(this).find("td:eq(1)").text() + "' selected=selected>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                        else {
                            blockoption = blockoption + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                    }
                });

                $("#table_house >tbody>tr").each(function () {
                    if ($(this).find("td:eq(0)").text() == $("#td_pq_pop_base_ocrcode2_code_" + id).text()) {
                        if ($(this).find("td:eq(1)").text() == $("#td_pq_pop_base_ocrcode3_code_" + id).text()) {
                            houseoption = houseoption + "<option value='" + $(this).find("td:eq(1)").text() + "' selected=selected>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                        else {
                            houseoption = houseoption + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                    }
                });

                $("#cbo_pr_main_work > option").each(function () {
                    if ($("#td_pq_pop_base_main_code_" + id).text() == this.value) {
                        mainworkoption = mainworkoption + "<option value='" + this.value + "' selected=selected>" + this.text + "</option>";
                    }
                    else {
                        mainworkoption = mainworkoption + "<option value='" + this.value + "'>" + this.text + "</option>";
                    }
                });

                $("#table_sub >tbody>tr").each(function () {
                    if ($(this).find("td:eq(0)").text() == $("#td_pq_pop_base_main_code_" + id).text()) {
                        if ($(this).find("td:eq(1)").text() == $("#td_pq_pop_base_sub_code_" + id).text()) {
                            suboption = suboption + "<option value='" + $(this).find("td:eq(1)").text() + "' selected=selected>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                        else {
                            suboption = suboption + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                    }
                });

                $("#table_detail >tbody>tr").each(function () {
                    if ($(this).find("td:eq(0)").text() == $("#td_pq_pop_base_sub_code_" + id).text()) {
                        if ($(this).find("td:eq(1)").text() == $("#td_pq_pop_base_detail_code_" + id).text()) {
                            detailoption = detailoption + "<option value='" + $(this).find("td:eq(1)").text() + "' selected=selected>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                        else {
                            detailoption = detailoption + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                    }
                });

                $("#cbo_pr_floor_work > option").each(function () {
                    if (this.value == $("#td_pq_pop_base_floor_code_" + id).text()) {
                        floorwork = floorwork + "<option value='" + this.value + "' selected=selected>" + this.text + "</option>";
                    }
                    else {
                        floorwork = floorwork + "<option value='" + this.value + "'>" + this.text + "</option>";
                    }
                });

                tr = "<tr id='tr_pr_" + rowindex + "'>";
                tr = tr + "<td style='display:none' id='txt_line_pr_base_line_" + rowindex + "'>" + $("#td_pq_pop_base_entry_" + id).text() +"</td>";
                tr = tr + "<td style='display:none' id='txt_line_pr_base_entry_" + rowindex + "'>" + $("#td_pq_pop_base_line_num_" + id).text()+"</td>";
                tr = tr + "<td style='display:none' id='txt_line_pr_base_type_" + rowindex + "'>PR</td>";
                tr = tr + "<td style='display:none' id='txt_line_pr_item_code_" + rowindex + "'>" + $("#td_pq_pop_base_item_code_" + id).text() +"</td>";
                tr = tr + "<td style='display:none' id='txt_line_pr_global_code_" + rowindex + "'>" + $("#td_pq_pop_base_global_code_" + id).text() +"</td>";
                tr = tr + "<td><input type='checkbox' name='chk_pr' id='ck_pr_" + rowindex + "'></td>";
                tr = tr + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_pq_line(" + rowindex + ")'><i class='fa fa-fw fa-remove'></i></span></td>";
                tr = tr + "<td><div class='input-group'><input type='text' class='form-control noborder' id='txt_line_pr_itemname_" + rowindex + "' placeholder='Description' value='" + $("#td_pq_pop_base_item_name_" + id).text() + "'><div class='input-group-addon'><i class='fa fa-industry text-info' onclick='cmd_pr_show_Item_list(" + rowindex + ")' style='cursor:pointer'></i></div></div></td >";
                tr = tr + "<td><div class='form-group'><input type = 'text' class='form-control form-control-inside' id='txt_line_pr_qty_" + rowindex + "' placeholder = 'Qty' value='" + convert2digit($("#td_pq_pop_base_qty_"+id).text()) + "' onchange='change_line_pq(" + rowindex + ",1)'></div></td>";
                tr = tr + "<td><div class='form-group'><select class='form-control' name='uom' id='txt_line_pr_uom_code_" + rowindex + "'>" + option + "</select></div></td>";
                tr = tr + "<td><div class='form-group'><input type = 'text' class='form-control form-control-inside' id='txt_line_pr_price_" + rowindex + "' placeholder = 'Price' value='0.0000' onchange='change_line_pq(" + rowindex + ",2)'></div></td>";
                tr = tr + "<td><div class='form-group'><input type = 'text' class='form-control form-control-inside' id='txt_line_pr_total_" + rowindex + "' readonly='readonly'  placeholder = 'Total' value='0.00'></div></td>";

                tr = tr + "<td><div class='form-group'><select class='form-control' name='whs' id='txt_line_pr_whs_code_" + rowindex + "'>" + whs + "</select></div></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_ocrcode_" + rowindex + "' name='ocrcode' onchange='txt_line_pr_costcenter_change(" + rowindex + ",2)'>" + projectoption + "</select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_ocrcode2_" + rowindex + "' name='ocrcode' onchange='txt_line_pr_costcenter_change(" + rowindex + ",3)'>" + blockoption+"</select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_ocrcode3_" + rowindex + "' name='ocrcode3'​>" + houseoption+"</select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_mainwork_" + rowindex + "' name='mainwork' onchange='txt_line_pr_work_change(" + rowindex + ",1)'>" + mainworkoption + "</select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_subwork_" + rowindex + "' name='subwork' onchange='txt_line_pr_work_change(" + rowindex + ",2)'>"+suboption+"</select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_detailwork_" + rowindex + "' name='detailwork'>"+detailoption +"</select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control form-control-inside' id='txt_line_pr_floor_work_" + rowindex + "' name='floorwork'>" + floorwork + "</select></td>";
                tr = tr + "</tr >";
                $("#table_pr>tbody").append(tr);
                rowindex++;
            }
        }
    });
    AddBlankPR(type)
    $("#modal-pr-list").modal('hide');
    cmd_pr_filter_pop_boq_check_all();
}
function remove_pq_line(rowindex) {
    $("#tr_pr_" + rowindex).remove();
    running_total();
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
function cmd_pq_check_all() {
    $('input:checkbox[name="chk_pr"]').prop('checked', true);
    $("#th_pr_check").hide();
    $("#th_pr_uncheck").show();
}
function cmd_pq_uncheck_all() {
    $('input:checkbox[name="chk_pr"]').prop('checked', false);
    $("#th_pr_check").show();
    $("#th_pr_uncheck").hide();
}
function cmd_pq_remove_row() {
    $("#table_pr > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("ck_pr_", "");
            remove_pq_line(id);
        }
    });
    cmd_pq_uncheck_all();
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
function AddBlankPR(type) {
    var uomoption = "";
    var whsoption = "";
    var projectoption = "";
    var mainworkoption = "";
    var floorwork = "";

    $("#cbo_pr_uom > option").each(function () {
        uomoption = uomoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    $("#cbo_pr_whs > option").each(function () {
        whsoption = whsoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });

    ///projectoption = "<option value=''></option>";
    $("#cbo_pr_project > option").each(function () {
        projectoption = projectoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    //mainworkoption = "<option value=''></option>";
    $("#cbo_pr_main_work > option").each(function () {
        mainworkoption = mainworkoption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });

    ///worktype = "<option value=''></option>";
    $("#cbo_pr_floor_work > option").each(function () {
        floorwork = floorwork + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    var tr = "<tr id='tr_pr_999'>";
    tr = tr + "<td style='display:none' name='linenum'>-1</td>";
    tr = tr + "<td style='display:none' name='linestatus'>Blank</td>";
    tr = tr + "<td style='display:none' name='itemcode'></td>";
    tr = tr + "<td name='checkremove'></td>";
    tr = tr + "<td style='text-align:center;'><span class='input-group-addon input-group-addon-remove'><i class='fa fa-fw fa-remove'></i></span></td>";
    tr = tr + "<td name='itemname'><div class='input-group'><input type='text' class='form-control noborder' id='txt_line_pr_itemname_999' placeholder='Description'><div class='input-group-addon'><i class='fa fa-industry text-info' onclick='cmd_pr_show_Item_list(999)' style='cursor:pointer'></i></div></div></td >";
    tr = tr + "<td name='qty'><div class='form-group'><input type = 'text' class='form-control form-control-inside' id='txt_line_pr_qty_999' placeholder = 'Qty' value='0.00' onchange='change_line_pr(999)'></div></td>";
    if (type == 4) {
        tr = tr + "<td style='text-align:center;display:none' class='smart_table_border'><select class='form-control' id='txtpa_pur_group' name='uom'>" + uomoption + "</select></td>";
    }
    else {
        tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txtpa_pur_group' name='uom'>" + uomoption + "</select></td>";
    }
    tr = tr + "<td><div class='form-group'><input type = 'text' class='form-control form-control-inside' id='txt_line_pr_price_999' placeholder = 'Price' value='0.00' onchange='change_line_pq(999,2)'></div></td>";
    tr = tr + "<td><div class='form-group'><input type = 'text' class='form-control form-control-inside' id='txt_line_pr_total_999' placeholder = 'Total' value='0.00' onchange='change_line_pq(999)'></div></td>";
    tr = tr + "<td style='text-align:center;display:none' class='smart_table_border'><input type='text' style='text-align:right' class='form-control noborder' id='txt_line_pr_price_999' placeholder='Unit Price' value='0.0000'></td>";
    tr = tr + "<td style='text-align:center;display:none' class='smart_table_border'><input type='text' style='text-align:right' class='form-control noborder' id='txt_line_pr_linetotal_999' placeholder='Total' readonly='readonly' value='0.00'></td>";
    if (type == 4) {
        tr = tr + "<td style='text-align:center;display:none' class='smart_table_border'><select class='form-control' id='txtpa_pur_group' name='whs'>" + whsoption + "</select></td>";
    }
    else {
        tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txtpa_pur_group' name='whs'>" + whsoption + "</select></td>";
    }
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_ocrcode_999' name='ocrcode'>" + projectoption + "</select></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_ocrcode2_999' name='ocrcode2'></select></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_ocrcode3_999' name='ocrcode3'></select></td>";
    tr = tr + "<td style='text-align:center;display:none' class='smart_table_border'><select class='form-control' id='txt_line_pr_ocrcode4_999' name='ocrcode4'></select></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_mainwork_999' name='mainwork'>" + mainworkoption + "</select></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_subwork_999' name='subwork'></select></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_detailwork_999' name='detailwork'></select></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_floor_work_999' name='floorwork'>" + floorwork + "</select></td>";
    tr = tr + "</tr>";
    $("#table_pr>tbody").append(tr);
}
function change_line_pq(rowindex, type) {
    var qty = returnstringvalue($("#txt_line_pr_qty_" + rowindex).val());
    var price = returnstringvalue($("#txt_line_pr_price_" + rowindex).val());
    var total = parseFloat(returnstringvalue(qty)) * parseFloat(returnstringvalue(price));

    $("#txt_line_pr_qty_" + rowindex).val(convert2digit(qty));
    $("#txt_line_pr_price_" + rowindex).val(convert4digit(price));
    $("#txt_line_pr_total_" + rowindex).val(convert2digit(total));
    running_total();
}
function doc_dis_per_change() {
    $("#txt_pq_doc_dis_amt").val("0.00");
    var dis_per = returnstringvalue($("#txt_pq_doc_dis_per").val());
    $("#txt_pq_doc_dis_per").val(convert2digit(dis_per));
    var sub_total = returnstringvalue($("#txt_pq_sub_total").val());
    var dis_amt = returnstringvalue(sub_total) * (dis_per / 100);
    $("#txt_pq_doc_dis_amt").val(convert2digit(dis_amt));
    var total_bal = sub_total - dis_amt;
    $("#txt_pq_total").val(convert2digit(total_bal));

    //txt_pq_total
}
function doc_dis_amount_change() {
    $("#txt_pq_doc_dis_per").val("0.00");
    var dis_per = returnstringvalue($("#txt_pq_doc_dis_per").val());
    $("#txt_pq_doc_dis_per").val(convert2digit(dis_per));
    var sub_total = returnstringvalue($("#txt_pq_sub_total").val());
    var dis_amt = returnstringvalue(sub_total) * (dis_per / 100);
    $("#txt_pq_doc_dis_amt").val(convert2digit(dis_amt));
    var total_bal = sub_total - dis_amt;
    $("#txt_pq_total").val(convert2digit(total_bal));
}
function running_total() {
    var sub_total = 0;
    $("#table_pr >tbody >tr").each(function () {
        var id = $(this).attr('id').replace("tr_pr_", "");
        if (id != "999") {
            sub_total = parseFloat(returnstringvalue(sub_total)) + parseFloat(returnstringvalue($("#txt_line_pr_total_" + id).val()));
        }
    });
    $("#txt_pq_sub_total").val(convert2digit(sub_total));
    var doc_dis_amt = 0;
    doc_dis_amt = returnstringvalue($("#txt_pq_doc_dis_amt").val());
    sub_total = sub_total - doc_dis_amt;
    $("#txt_pq_total").val(convert2digit(sub_total));
    
}
function cmd_pop_choose_vendor() {
    var bprow = $("#txt_bp_selected_row").val();
    var bpcode = $("#td_pop_vendor_vendor_code_" + bprow).text();
    var bpname = $("#td_pop_vendor_vendor_name_" + bprow).text();
    $("#txt_vendor_code").val(bpcode);
    $("#txt_vendor_name").val(bpname);
    $("#modal-vendor_list").modal('hide');
    get_contact(bpcode);
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
//get data from database
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
    $.ajax({
        url: "/getData/get_pr1",
        type: 'POST',
        data: { prn: $("#txt_pq_pop_filter_pr_num").val(), itemgroup: itemgroup, itemdesc: itemdesc, isBoq: isboq, BoqType: boqtyp },
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
                tr = tr + "<td style='display:none' id='td_pq_pop_base_global_code_" + i + "'>" + x.GlobalCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pq_pop_base_item_code_" + i + "'>" + x.ItemCode + "</td>";
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
                tr = tr + "<td><input type='checkbox' name='chkpr' id='" + i + "'/></td>";
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
function get_contact(cardcode) {
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


