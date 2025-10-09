
var list = [];
var dellist = [];
var allow = 0;
var lineno = 0;
//Client Action
$(document).ready(function () {
    $("#txt_pr_boq_pop_filter_item_desc").keyup(function () {
        $("#table_pr_pop_boq_list>tbody>tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_boq_", "");
            var text = $("#pr_pop_boq_line_itemcode_" + id).text().toLowerCase() + $("#pr_pop_boq_line_itemname_" + id).text().toLowerCase();
            if (text.replace(/\s+/g, '').indexOf($("#txt_pr_boq_pop_filter_item_desc").val().replace(/\s+/g, '').toLowerCase()) == -1)
                $(this).hide();
            else
                $(this).show();
        });
    });
    $("#txt_pr_non_boq_pop_filter_item_desc").keyup(function () {
        $("#table_pr_pop_boq_list>tbody>tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_boq_", "");
            var text = $("#td_pr_pop_item_code_" + id).text().toLowerCase() + $("#td_pr_pop_item_name_" + id).text().toLowerCase();
            if (text.replace(/\s+/g, '').indexOf($("#txt_pr_non_boq_pop_filter_item_desc").val().replace(/\s+/g, '').toLowerCase()) == -1)
                $(this).hide();
            else
                $(this).show();
        });
    });
    $("#txt_pop_filter_vendor_name").keyup(function () {
        $("#table_pop_vendor_list>tbody>tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_vendor_", "");
            var text = $("#td_pop_vendor_vendor_code_" + id).text().toLowerCase() + $("#td_pop_vendor_vendor_name_" + id).text().toLowerCase();
            if (text.replace(/\s+/g, '').indexOf($("#txt_pop_filter_vendor_name").val().replace(/\s+/g, '').toLowerCase()) == -1)
                $(this).hide();
            else
                $(this).show();
        });
    });
});
//General
function change_line_pr(index) {
    var qty = $("#txt_line_pr_qty_" + index).val();
    var boqty = $("#txt_line_pr_boq_qty_" + index).val();
    if (parseFloat(returnstringvalue(qty)) > parseFloat(returnstringvalue(boqty))) {
        ShowAlert("Request Quantity is greater than BOQ Quantity");
        qty = boqty;
    }
    $("#txt_line_pr_qty_" + index).val(parseFloat(returnstringvalue(qty)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}
function remove_pr_line(rowindex) {
    $("#tr_" + rowindex).remove();
}
function ShowAlert(mes) {
    $("#modal_p_alert").text(mes);
    $("#modal-alert").modal('show');
}
function cmd_pr_uncheck_all() {
    $('input:checkbox[name="chk"]').prop('checked', false);
    $("#th_check").show();
    $("#th_uncheck").hide();
}
function cmd_pr_check_all() {
    $('input:checkbox[name="chk"]').prop('checked', true);
    $("#th_check").hide();
    $("#th_uncheck").show();
}
function cmd_pr_show_Item_list(selectedrowIndex) {
    $("#txtselectrowindex").val(selectedrowIndex);
    $('input:checkbox[name="ck_pop_item"]').prop('checked', false);
    $("#modal-pr-boq_ist").modal('show');
    cmd_pr_filter_pop_boq_uncheck_all();
}
function cmd_pr_line_remove_detail(id,headerindex) {
    $("#tr_pr_detail_" + id).remove();
    sum_detail_by_header_id(headerindex);
}
function cmd_pr_line_detail_change(type, rowindex, headerindex) {
    var qty = returnstringvalue($("#txt_pr_line_sub_qty_" + rowindex).val());
    var boqty = returnstringvalue($("#txt_pr_line_sub_boq_qty_" + rowindex).val());
    if (parseFloat(qty) > parseFloat(boqty)) {
        ShowAlert("Request Quantity is greater than BOQ Quantity");
        qty = boqty;
    }
    else {
        sum_detail_by_header_id(headerindex);
    }
    $("#txt_pr_line_sub_qty_" + rowindex).val(parseFloat(returnstringvalue(qty)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    
}
function sum_detail_by_header_id(headerid) {
    var namedetail = "pr_line_sub_qty_" + headerid;
    var sumQty = 0;
    $("input[name=" + namedetail + "]").each(function () {
        sumQty = sumQty + parseFloat(returnstringvalue($(this).val()));
    });
    $("#txt_pr_line_summary_qty_" + headerid).val(parseFloat(returnstringvalue(sumQty)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}
function cmd_pr_line_remove_summary(rowindex) {
    var namedetail = "tr_pr_sub_" + rowindex;
    $("#tr_pr_head_" + rowindex).remove();
    $("[name=" + namedetail + "]").remove();

}
function cmd_pr_line_show_detail(rowindex) {
    var detail = "tr_pr_sub_" + rowindex;
    if ($("#td_pr_header_" + rowindex).text() == "H") {
        $("[name=" + detail + "]").show();
        $("#td_pr_header_" + rowindex).text("S");
    }
    else {
        $("[name=" + detail + "]").hide();
        $("#td_pr_header_" + rowindex).text("H");
    }
}

//For BOQ
function cmd_pr_pop_choose_boq_material() {
    var option = "";
    var whs = "";
    $("#cbo_pr_uom > option").each(function () {
        option = option + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    $("#cbo_pr_whs > option").each(function () {
        whs = whs + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    var rowindex = $("#table_pr_material >tbody >tr").length;
    if (typeof ($("#table_pr_material >tbody").find("tr:last").attr("id")) == "undefined") {
        rowindex = 0;
    }
    else {
        var newrow = $("#table_pr_material >tbody").find("tr:last").attr("id").replace("tr_", "");
        rowindex = parseInt(newrow) + 1;
    }
    var list_distinct_item = [];
    var list_item = [];
    var list_selected_item = [];

    $("#table_pr_pop_boq_list > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("ck_pop_boq_", "");
            list_item.push($("#pr_pop_boq_line_itemcode_" + id).text());
            var d = {
                GlobalCode: $("#pr_pop_boq_line_globalcode_"+id).text(),
                ItemCode: $("#pr_pop_boq_line_itemcode_"+id).text(),
                ItemName: $("#pr_pop_boq_line_itemname_" + id).text(),
                Quantity: $("#pr_pop_boq_line_boq_qty_" + id).text(),

                OcrCode: $("#pr_pop_boq_line_ocrcode_" + id).text(),
                OcrCodeName: $("#pr_pop_boq_line_ocrcodename_"+id).text(),

                OcrCode2: $("#pr_pop_boq_line_ocrcode2_"+id).text(),
                OcrCode2Name: $("#pr_pop_boq_line_ocrcode2name_"+id).text(),

                OcrCode3: $("#pr_pop_boq_line_ocrcode3_" + id).text(),
                OcrCode3Name: $("#pr_pop_boq_line_ocrcode3name_"+id).text(),

                MainworkCode: $("#pr_pop_boq_line_maincode_"+id).text(),
                MainWorkName: $("#pr_pop_boq_line_main_name_"+id).text(),

                SubWorkCode: $("#pr_pop_boq_line_subcode_"+id).text(),
                SubWorkName: $("#pr_pop_boq_line_sub_name_"+id).text(),

                DetailWorkCode: $("#pr_pop_boq_line_detailcode_"+id).text(),
                DetailName: $("#pr_pop_boq_line_detail_name_"+id).text(),

                FloorWorkCode: $("#pr_pop_boq_line_floorcode_"+id).text(),
                FloorName: $("#pr_pop_boq_line_floor_name_"+id).text()

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
    $('#table_po_line > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(0)").text() == "Header") {
            headerrowindex = $(this).attr("id").replace("tr_po_head_", "");
        }
    });
    headerrowindex++;
    var counthouse = 0;
    var itemname = "";
    var detailrowindex = 0;
    var housename = "";
    var total_sub_qty = 0;
    for (i = 0; i < list_distinct_item.length; i++) {
        detailrowindex = 1;
        total_sub_qty = 0;
        var data = "<tr id='tr_pr_head_" + headerrowindex + "' class='header-color'>";
        data = data + "<td style='display:none'>Header</td>";
        data = data + "<td style='display:none' id='td_pr_header_" + headerrowindex + "'>H</td>";
        data = data + "<td><i class='fa fa-plus text-info' onclick='cmd_pr_line_show_detail(" + headerrowindex + ")' style='cursor:pointer'></i></td>";
        data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_pr_line_remove_summary(" + headerrowindex + ")'></i></td>";
        data = data + "<td colspan='2'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_pr_line_summary_item_name_" + headerrowindex + "' placeholder='Description' readonly='readonly' value=''></div></td>";
        data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_pr_line_summary_qty_" + headerrowindex + "' placeholder='Quantity' value='0.00'></div></td>";
        data = data + "<td colspan='9'></td>";
        data = data + "</tr>";
        $.each(list_selected_item, function (key, value) {
            if (value.ItemCode == list_distinct_item[i]) {
                total_sub_qty = total_sub_qty + parseFloat(returnstringvalue(value.Quantity));
                data = data + "<tr name='tr_pr_sub_" + headerrowindex + "' style='display:none' id='tr_pr_detail_" + headerrowindex + "" + detailrowindex + "'>";
                data = data + "<td></td>"
                data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_pr_line_remove_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></i></td>"
                data = data + "<td colspan='2'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='pr_line_sub_qty_" + headerrowindex + "' id='txt_pr_line_sub_qty_" + headerrowindex + "" + detailrowindex + "' placeholder='Quantity' value='" + value.Quantity + "' onchange='cmd_pr_line_detail_change(1," + headerrowindex + "" + detailrowindex + ", " + headerrowindex + ")'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='BOQ Quantity' readonly='readonly' id='txt_pr_line_sub_boq_qty_" + headerrowindex + "" + detailrowindex + "' value='" + value.Quantity + "'></div></td>";
                data = data + "<td><div class='form-group'><select class='form-control form-control-insde ' id='txtpa_pur_group' name='uom'>" + option + "</select></td>";
                data = data + "<td><div class='form-group'><select class='form-control form-control-insde ' id='txtpa_pur_group' name='uom'>" + whs + "</select></td>";
                data = data + "<td>" + value.OcrCodeName + "</td>";
                data = data + "<td>" + value.OcrCode2Name + "</td>";
                data = data + "<td>" + value.MainWorkName + "</td>";
                data = data + "<td>" + value.SubWorkName + "</td>";
                data = data + "<td>" + value.DetailName + "</td>";
                data = data + "<td>" + value.FloorName + "</td>";
                data = data + "</tr>";
                detailrowindex++;
                itemname = value.ItemName;
            }
        });
        $("#table_pr_material >tbody").append(data);
        $("#txt_pr_line_summary_item_name_" + headerrowindex).val(itemname);
        $("#txt_pr_line_summary_qty_" + headerrowindex).val(parseFloat(returnstringvalue(total_sub_qty)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        headerrowindex++;
    }
    $("#modal-pr-boq_ist").modal('hide');
}
//for Sub-Con
function cmd_pr_pop_choose_boq() {
    var option = "";
    var whs = "";
    $("#cbo_pr_uom > option").each(function () {
        option = option + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    $("#cbo_pr_whs > option").each(function () {
        whs = whs + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    var rowindex = $("#table_pr >tbody >tr").length;
    if (typeof ($("#table_pr >tbody").find("tr:last").attr("id")) == "undefined") {
        rowindex = 0;
    }
    else {
        var newrow = $("#table_pr >tbody").find("tr:last").attr("id").replace("tr_", "");
        rowindex = parseInt(newrow) + 1;
    }
    $("#table_pr_pop_boq_list > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("ck_pop_boq_","");
            tr = "<tr id='tr_" + rowindex + "'>";
            tr = tr + "<td><input type='checkbox' name='chk' id='ck_" + rowindex + "'></td>";
            tr = tr + "<td style='display:none'>-1</td>";
            tr = tr + "<td style='display:none'>Active</td>";
            tr = tr + "<td style='display:none' name='globalcode'>" + $("#tr_pop_boq_" + id).find("td:eq(1)").text() + "</td>";
            tr = tr + "<td style='display:none' name='itemcode'>" + $("#tr_pop_boq_" + id).find("td:eq(2)").text() + "</td>";
            tr = tr + "<td style='display:none' name='projectcode'>" + $("#tr_pop_boq_" + id).find("td:eq(3)").text() + "</td>";
            tr = tr + "<td style='display:none' name='blockcode'>" + $("#tr_pop_boq_" + id).find("td:eq(4)").text() + "</td>";
            tr = tr + "<td style='display:none' name='houseno'>" + $("#tr_pop_boq_" + id).find("td:eq(5)").text() + "</td>";
            tr = tr + "<td style='display:none' name='maincode'>" + $("#tr_pop_boq_" + id).find("td:eq(6)").text() + "</td>";
            tr = tr + "<td style='display:none' name='subcode'>" + $("#tr_pop_boq_" + id).find("td:eq(7)").text() + "</td>";
            tr = tr + "<td style='display:none' name='detailcode'>" + $("#tr_pop_boq_" + id).find("td:eq(8)").text() + "</td>";
            tr = tr + "<td style='display:none' name='floorcode'>" + $("#tr_pop_boq_" + id).find("td:eq(9)").text() + "</td>";
            tr = tr + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_pr_line(" + rowindex + ")'><i class='fa fa-fw fa-remove'></i></span></td>";
            tr = tr + "<td name='itemname'>"+ $("#tr_pop_boq_" + id).find("td:eq(2)").text()+"-"+$("#tr_pop_boq_" + id).find("td:eq(11)").text() + "</td>";
            tr = tr + "<td name='qty'><div class='form-group'><input type = 'text' class='form-control form-control-inside' id='txt_line_pr_qty_" + rowindex + "' placeholder = 'Qty' value='" + parseFloat(returnstringvalue($("#tr_pop_boq_" + id).find("td:eq(12)").text())).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' onchange='change_line_pr(" + rowindex + ")'></div></td>";
            tr = tr + "<td name='boqqty'><div class='form-group'><input type = 'text' class='form-control form-control-inside' id='txt_line_pr_boq_qty_" + rowindex + "' readonly='readonly' placeholder = 'BOQ Qty' value='" + parseFloat(returnstringvalue($("#tr_pop_boq_" + id).find("td:eq(12)").text())).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "'></div></td>";
            tr = tr + "<td name='uom'><div class='form-group'><select class='form-control' name='uom'>" + option + "</select></div></td>";
            tr = tr + "<td name='whs'><div class='form-group'><select class='form-control' name='whs'>" + whs + "</select></div></td>";
            tr = tr + "<td name='projectname'>" + $("#tr_pop_boq_" + id).find("td:eq(13)").text() + "</td>";
            tr = tr + "<td name='blockname'>" + $("#tr_pop_boq_" + id).find("td:eq(14)").text() + "</td>";
            tr = tr + "<td name='housename'>" + $("#tr_pop_boq_" + id).find("td:eq(15)").text() + "</td>";
            tr = tr + "<td name='mainname'>" + $("#tr_pop_boq_" + id).find("td:eq(16)").text() + "</td>";
            tr = tr + "<td name='subname'>" + $("#tr_pop_boq_" + id).find("td:eq(17)").text() + "</td>";
            tr = tr + "<td name='detailname'>" + $("#tr_pop_boq_" + id).find("td:eq(18)").text() + "</td>";
            tr = tr + "<td name='floorname'>" + $("#tr_pop_boq_" + id).find("td:eq(19)").text() + "</td>";
            tr = tr + "</tr >";
            $("#table_pr>tbody").append(tr);
            rowindex++;
        }
    });
    $("#modal-pr-boq_ist").modal('hide');
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
//For Non BOQ
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
        var id = tr.id.replace("tr_", "");
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
    var tr = "<tr id='tr_999'>";
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
    

    tr = tr + "<td style='text-align:center;display:none' class='smart_table_border'><input type='text' style='text-align:right' class='form-control noborder' id='txt_line_pr_price_999' placeholder='Unit Price' value='0.00'></td>";
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
    $("#table_pr tbody").append(tr);
}
function cmd_pr_remove_row() {
    $("#table_pr > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("ck_", "");
            remove_pr_line(id);
        }
    });
    cmd_pr_uncheck_all();
}
function cmd_pr_pop_choose_item(type) {
    var option = "";
    var whs = "";
    var projectoption = "";
    var mainworkoption = "";
    var floorwork = "";
    $("#cbo_pr_uom > option").each(function () {
        option = option + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    $("#cbo_pr_whs > option").each(function () {
        whs = whs + "<option value='" + this.value + "'>" + this.text + "</option>";
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
    $("#table_pr_pop_boq_list > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("ck_pop_boq_", "");
            var itemname = $("#tr_pop_boq_" + id).find("td:eq(2)").text() + "-" + $("#tr_pop_boq_" + id).find("td:eq(3)").text();
            
            if ($("#txtselectrowindex").val() != "999") {
                $("#txt_line_pr_itemname_" + $("#txtselectrowindex").val()).val(itemname);
                $("#txtselectrowindex").val("999");
            }
            else {
                tr = "<tr id='tr_" + rowindex + "'>";
                tr = tr + "<td style='display:none' name='linenum'>-1</td>";
                tr = tr + "<td style='display:none' name='linestatus'>Active</td>";
                tr = tr + "<td style='display:none' name='itemcode'>" + $("#tr_pop_boq_" + id).find("td:eq(2)").text() + "</td>";
                tr = tr + "<td><input type='checkbox' name='chk' id='ck_" + rowindex + "'></td>";
                tr = tr + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_pr_line(" + rowindex + ")'><i class='fa fa-fw fa-remove'></i></span></td>";
                tr = tr + "<td name='itemname'><div class='input-group'><input type='text' class='form-control noborder' id='txt_line_pr_itemname_" + rowindex + "' placeholder='Description' value='" + itemname + "'><div class='input-group-addon'><i class='fa fa-industry text-info' onclick='cmd_pr_show_Item_list(" + rowindex + ")' style='cursor:pointer'></i></div></div></td >";
                tr = tr + "<td name='qty'><div class='form-group'><input type = 'text' class='form-control form-control-inside' id='txt_line_pr_qty_" + rowindex + "' placeholder = 'Qty' value='0.00' onchange='change_line_pr(" + rowindex + ")'></div></td>";
                tr = tr + "<td name='uom'><div class='form-group'><select class='form-control' name='uom'>" + option + "</select></div></td>";
                tr = tr + "<td name='whs'><div class='form-group'><select class='form-control' name='whs'>" + whs + "</select></div></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_ocrcode_" + rowindex + "' name='ocrcode' onchange='txt_line_pr_costcenter_change(" + rowindex + ",2)'>" + projectoption + "</select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_ocrcode2_" + rowindex + "' name='ocrcode' onchange='txt_line_pr_costcenter_change(" + rowindex + ",3)'></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_ocrcode3_" + rowindex + "' name='ocrcode3'​></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_mainwork_" + rowindex + "' name='mainwork' onchange='txt_line_pr_work_change(" + rowindex + ",1)'>" + mainworkoption + "</select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_subwork_" + rowindex + "' name='subwork' onchange='txt_line_pr_work_change(" + rowindex + ",2)'></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_detailwork_" + rowindex + "' name='detailwork'></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_floor_work_" + rowindex + "' name='floorwork'>" + floorwork + "</select></td>";
                tr = tr + "</tr >";
                $("#table_pr>tbody").append(tr);
                rowindex++;
            }
        }
    });
    AddBlankPR(type)
    $("#modal-pr-boq_ist").modal('hide');
    cmd_pr_filter_pop_boq_check_all();
}

//Get Data from Database
//Get BOQ
function cmd_get_boq(type) {
    allow = 0;
    if ($("#cbo_pr_project").val() == "") {
        ShowAlert("Search BOQ is required for project");
        allow = 1;
    }
    if ($("#cbo_pr_zone").val() == "" && allow == 0) {
        ShowAlert("Search BOQ is required for block");
        allow = 1;
    }
    if (allow == 0) {
        $.ajax({
            url: '/purpr/get_boq',
            type: 'POST',
            data: { procode: $("#cbo_pr_project").val(), zonecode: $("#cbo_pr_zone").val(), housecode: $("#cbo_pr_house").val(), maincode: $("#cbo_pr_main_work").val(), subcode: $("#cbo_pr_sub_work").val(), detailcode: $("#cbo_pr_detail_work").val(), floorcode: $("#cbo_pr_floor_work").val(), type: type },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                $("#table_pr_pop_boq_list > tbody  > tr").remove();
                if (data.data.length > 0) {
                    var tr = "";
                    for (i = 0; i < data.data.length; i++) {
                        var x = data.data[i];
                        tr = tr + "<tr id='tr_pop_boq_" + rowindex + "'>";
                        tr = tr + "<td><input type='checkbox' name='pop_chk' id='ck_pop_boq_" + rowindex + "'></td>";
                        tr = tr + "<td style='display:none' id='pr_pop_boq_line_globalcode_" + rowindex + "'>" + x.GlobalCode + "</td>";
                        tr = tr + "<td style='display:none' id='pr_pop_boq_line_itemcode_" + rowindex + "'>" + x.ChildCode + "</td>";
                        tr = tr + "<td style='display:none' id='pr_pop_boq_line_ocrcode_" + rowindex + "'>" + x.OcrCode + "</td>";
                        tr = tr + "<td style='display:none' id='pr_pop_boq_line_ocrcode2_" + rowindex + "'>" + x.OcrCode2 + "</td>";
                        tr = tr + "<td style='display:none' id='pr_pop_boq_line_ocrcode3_" + rowindex + "'>" + x.OcrCode3 + "</td>";
                        tr = tr + "<td style='display:none' id='pr_pop_boq_line_maincode_" + rowindex + "'>" + x.U_MainWork + "</td>";
                        tr = tr + "<td style='display:none' id='pr_pop_boq_line_subcode_" + rowindex + "'>" + x.U_SubWork + "</td>";
                        tr = tr + "<td style='display:none' id='pr_pop_boq_line_detailcode_" + rowindex + "'>" + x.U_DecWork + "</td>";
                        tr = tr + "<td style='display:none' id='pr_pop_boq_line_floorcode_" + rowindex + "'>" + x.U_Floor + "</td>";
                        tr = tr + "<td>" + x.ChildCode + "</td>";
                        tr = tr + "<td id='pr_pop_boq_line_itemname_" + rowindex + "'>" + x.ChildName + "</td>";
                        tr = tr + "<td id='pr_pop_boq_line_boq_qty_" + rowindex + "'>" + parseFloat(returnstringvalue(x.Quantity)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
                        tr = tr + "<td style='display:none' id='pr_pop_boq_line_ocrcodename_" + rowindex + "'>" + x.OcrCodeName + "</td>";
                        tr = tr + "<td style='display:none' id='pr_pop_boq_line_ocrcode2name_" + rowindex + "'>" + x.OcrCode2Name + "</td>";
                        tr = tr + "<td id='pr_pop_boq_line_ocrcode3name_" + rowindex + "'>" + x.OcrCode3Name + "</td>";
                        tr = tr + "<td id='pr_pop_boq_line_main_name_" + rowindex + "'>" + x.MainWorkName + "</td>";
                        tr = tr + "<td id='pr_pop_boq_line_sub_name_" + rowindex + "'>" + x.SubWorkName + "</td>";
                        tr = tr + "<td id='pr_pop_boq_line_detail_name_" + rowindex + "'>" + x.DetailWorkName + "</td>";
                        tr = tr + "<td id='pr_pop_boq_line_floor_name_" + rowindex + "'>" + x.FloorWorkName + "</td>";
                        tr = tr + "</tr >";
                        rowindex = rowindex + 1;
                    }
                    $("#table_pr_pop_boq_list >tbody").append(tr);
                    $("#modal-pr-boq_ist").modal('show');
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
    cmd_pr_uncheck_all();
    cmd_pr_filter_pop_boq_uncheck_all()
}
//General
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

function getPRNumber() {
    $.ajax({
        type: 'POST',
        url: '/purpr/getLastPR',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (x) {
            if (x.status == "OK") {
                $("#txt_doc_num").val(x.docnum);
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
//Auto Suggestion 
function txtautocomplete(id,type) {
    $("#txtselectrowindex").val(id);
    var doctype = "";
    switch (type) {
        case 1:
            doctype = "M";
            break;
        case 2:
            doctype = "S";
            break;
        case 3:
            doctype = "L";
            break;
        case 4:
            doctype = "O";
            break;
    }
    $("#txt_line_pr_itemname_" + id).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/purpr/autocomplete",
                method: "POST",
                dataType: "json",
                data: {
                    Desc: $("#txt_line_pr_itemname_" + id).val().trim(),
                    type: doctype
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
                                GlobalCode:item.GlobalCode
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
            itemSelectByAutoSuggestion(_i.item.value, _i.item.label, _i.item.GlobalCode,type);
            event.preventDefault();
        }
    });
}
function itemSelectByAutoSuggestion(itemcode, itemname, globalcode,type) {
    var selectedindex = $("#txtselectrowindex").val();
    $('#table_pr > tbody > tr:last').remove();
    if (itemcode != null || itemcode != "") {
        if ($("#txt_line_pr_itemcode_" + selectedindex).val() != "" && (selectedindex != -1 && selectedindex != 999)) {
            $("#txt_line_pr_itemcode_" + selectedindex).val(itemcode);
            $("#txt_line_pr_itemname_" + selectedindex).val(itemname);
            $("#td_line_global_code_" + selectedindex).text(globalcode);
        }
        else {
            //var rowindex = $("#table_pr >tbody >tr").length;
            var index = 0;
            if (typeof ($("#table_pr >tbody").find("tr:last").attr("id")) == "undefined") {
                index = 0;
            }
            else {
                var newrow = $("#table_pr >tbody").find("tr:last").attr("id").replace("tr_", "");
                index = parseInt(newrow) + 1;
            }

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

            var tr = "<tr id='tr_" + index + "'>";
            tr = tr + "<td style='display:none'>-1</td>";
            tr = tr + "<td style='display:none'>Active</td>";
            tr = tr + "<td style='display:none'>" + globalcode + "</td>";
            tr = tr + "<td style='display:none'><input type='text' class='form-control noborder' id='txt_line_pr_itemcode_" + index + "' readonly='readonly' placeholder='Item Code'​ value='" + itemcode +"'></td>";
            tr = tr + "<td style='text-align:center;' class='smart_table_border'><span class='input-group-addon input-group-addon-remove' onclick='remove_pr_line(" + index + ")'><i class='fa fa-fw fa-remove'></i></span></td>";
            tr = tr + "<td style='text-align:center;' class='smart_table_border'><input type='text' class='form-control noborder' id='txt_line_pr_itemname_" + index + "' placeholder='Description' value='" + itemcode + "-" + itemname +"'></td>";
            tr = tr + "<td style='text-align:center;' class='smart_table_border'><input type='number' style='text-align:center' class='form-control noborder' id='txt_line_pr_qty_" + index + "' placeholder='Quantity' value='0.00' onchange='change_linepr(" + index + ")'></td>";
            if (type == 4) {
                tr = tr + "<td style='text-align:center;display:none' class='smart_table_border'><select class='form-control' id='txtpa_pur_group' name='uom'>" + uomoption + "</select></td>";
            }
            else {
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txtpa_pur_group' name='uom'>" + uomoption + "</select></td>";
            }
            tr = tr + "<td style='text-align:center;display:none' class='smart_table_border'><input type='text' style='text-align:right' class='form-control noborder' id='txt_line_pr_price_" + index + "' placeholder='Unit Price' value='0.00'></td>";
            tr = tr + "<td style='text-align:center;display:none' class='smart_table_border'><input type='text' style='text-align:right' class='form-control noborder' id='txt_line_pr_linetotal_" + index + "' placeholder='Total' readonly='readonly' value='0.00'></td>";
            if (type == 4) {
                tr = tr + "<td style='text-align:center;display:none' class='smart_table_border'><select class='form-control' id='txtpa_pur_group' name='whs'>" + whsoption + "</select></td>";
            }
            else {
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txtpa_pur_group' name='whs'>" + whsoption + "</select></td>";
            }
            tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_ocrcode_" + index + "' name='ocrcode'​ onchange='txt_line_pr_costcenter_change(" + index + ",2)'>" + projectoption +"</select></td>";
            tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_ocrcode2_" + index + "' name='ocrcode2' onchange='txt_line_pr_costcenter_change(" + index + ",3)'></select></td>";
            tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_ocrcode3_" + index + "' name='ocrcode3' onchange='txt_line_pr_costcenter_change(" + index + ",4)'></select></td>";
            tr = tr + "<td style='text-align:center;display:none' class='smart_table_border'><select class='form-control' id='txt_line_pr_ocrcode4_" + index + "' name='ocrcode4'></select></td>";
            tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_mainwork_" + index + "' name='mainwork' onchange='txt_line_pr_work_change(" + index + ",1)'>" + mainworkoption +"</select></td>";
            tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_subwork_" + index + "' name='subwork' onchange='txt_line_pr_work_change(" + index + ",2)'></select></td>";
            tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_detailwork_" + index + "' name='detailwork'></select></td>";
            tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_pr_floor_work_" + index + "' name='floorwork'>" + floorwork +"</select></td>";
            tr = tr + "</tr>";

            $("#table_pr tbody").append(tr);
            selectedindex = -1;
            AddBlankPR(type);
        }
    }
}

//Saving Data to Database
function cmd_save_boq_pr(type) {
    list = [];
    dellist = [];
    allow = 0;
    lineno = 0;
    if ($("#txtrequester").val() == "") {
        ShowAlert("Requestor is required");
        allow = 1;
    }
    if ($("#txt_pr_docdate").val() == "" && allow==0) {
        ShowAlert("Posting Date is required");
        allow = 1;
    }
    if ($("#txt_pr_req_date").val() == "" && allow == 0) {
        ShowAlert("Required Date is required");
        allow = 1;
    }
    if ($('#table_pr > tbody  > tr').length == 0 && allow == 0) {
        ShowAlert("Please choose BOQ Information");
        allow = 1;
    }
    $('#table_pr > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(2)").text() != "Blank") {
            if (parseFloat(returnstringvalue($(this).find("td:eq(14) input[type='text']").val())) == 0) {
                ShowAlert("Quantity cannot be zero");
                allow = 1;
                return;
            }
        }
    });
    if (allow == 0) {
        var docdate = $('#txt_pr_docdate').val().trim().split("-");
        var reqdate = $('#txt_pr_req_date').val().trim().split("-");
        var head = {
            DocEntry: $("#txt_pr_dockey").val(),
            DocDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            ReqDate: reqdate[2] + "/" + reqdate[1] + "/" + reqdate[0],
            Requester: $("#txt_pr_requester").val(),
            RequestPur: $("#txt_pr_remark").val(),
            Ref: $("#txt_pr_ref_no").val(),
            IsBOQ: "Yes",
            CreatedBy: $("#txt_shared_userid").val(),
            BOQType: type
        };
        $('#table_pr > tbody  > tr').each(function (index, tr) {
            if ($(this).find("td:eq(2)").text() != "Blank") {
                var d = {
                    LineNum: index,
                    LineStatus: $(this).find("td:eq(2)").text(),
                    GlobalCode: $(this).find("td:eq(3)").text(),
                    ItemCode: $(this).find("td:eq(4)").text(),
                    OcrCode: $(this).find("td:eq(5)").text(),
                    OcrCode2: $(this).find("td:eq(6)").text(),
                    //OcrCode3: $(this).find("td:eq(6)").text(),
                    //OcrCode4: $(this).find("td:eq(7)").text(),
                    //MainworkCode: $(this).find("td:eq(8)").text(),
                    //SubWorkCode: $(this).find("td:eq(9)").text(),
                    //DetailWorkCode: $(this).find("td:eq(10)").text(),
                    //FloorWorkCode: $(this).find("td:eq(11)").text(),
                    //BOQType: type,
                    //ItemName: $(this).find("td:eq(13)").text(),
                    Quantity: returnstringvalue($(this).find("td:eq(14) input[type='text']").val()),
                    //UoMEntry: $(this).find("td:eq(15) select[name='uom']").val(),
                    //UPrice: '0.00',
                    //LineTotal: '0.00',
                    //IsBOQ: "Yes",
                    //WhsCode: $(this).find("td:eq(16) select[name='whs']").val()
                };
                list.push(d);
                lineno = lineno + 1;
            }
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/purpr/cmd_save_boq',
            data: JSON.stringify(
                {
                    'header': head,
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
function cmd_save_noeboq_pr(type) {
    list = [];
    dellist = [];
    allow = 0;
    lineno = 0;
    if ($("#txtrequester").val() == "") {
        ShowAlert("Requestor is required");
        allow = 1;
    }
    if ($("#txt_pr_docdate").val() == "" && allow == 0) {
        ShowAlert("Posting Date is required");
        allow = 1;
    }
    if ($("#txt_pr_req_date").val() == "" && allow == 0) {
        ShowAlert("Required Date is required");
        allow = 1;
    }
    if ($('#table_pr > tbody  > tr').length == 0 && allow == 0) {
        ShowAlert("Please choose BOQ Information");
        allow = 1;
    }
    $('#table_pr > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(1)").text() != "Blank") {
            if (parseFloat(returnstringvalue($(this).find("td:eq(6) input[type='number']").val())) == 0) {
                ShowAlert("Quantity cannot be zero");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(11) select[name='ocrcode']").val() == "" && allow == 0) {
                ShowAlert("Project cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(12) select[name='ocrcode2']").val() == "" && allow == 0) {
                ShowAlert("Zone/Block cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(13) select[name='ocrcode3']").val() == "" && allow == 0) {
                ShowAlert("Street cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(14) select[name='ocrcode4']").val() == "" && allow == 0) {
                ShowAlert("House cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(15) select[name='mainwork']").val() == "" && allow == 0) {
                ShowAlert("Main Work cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(16) select[name='subwork']").val() == "" && allow == 0) {
                ShowAlert("Sub Work cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(17) select[name='detailwork']").val() == "" && allow == 0) {
                ShowAlert("Detail Work cannot be blanked");
                allow = 1;
                return;
            }
            if ($(this).find("td:eq(18) select[name='floorwork']").val() == "" && allow == 0) {
                ShowAlert("Floor Work cannot be blanked");
                allow = 1;
                return;
            }
        }
    });
    if (allow == 0) {
        var docdate = $('#txt_pr_docdate').val().trim().split("-");
        var reqdate = $('#txt_pr_req_date').val().trim().split("-");
        var head = {
            DocEntry: $("#txt_pr_dockey").val(),
            DocDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            ReqDate: reqdate[2] + "/" + reqdate[1] + "/" + reqdate[0],
            Requester: $("#txt_pr_requester").val(),
            IsBOQ: "No",
            CreatedBy: $("#txt_shared_userid").val(),
            BOQType: type
        };
        $('#table_pr > tbody  > tr').each(function (index, tr) {
            if ($(this).find("td:eq(1)").text() != "Delete" || $(this).find("td:eq(1)").text() != "Blank") {
                var d = {
                    LineNum: $(this).find("td:eq(0)").text(),
                    LineStatus: $(this).find("td:eq(1)").text(),
                    GlobalCode: $(this).find("td:eq(2)").text(),
                    ItemCode: (type == "O" ? "" : $(this).find("td:eq(3) input[type='text']").val()),
                    AcctCode: (type == "O" ? $(this).find("td:eq(3) input[type='text']").val() : ""),
                    ItemName: $(this).find("td:eq(5) input[type='text']").val(),
                    Quantity: (type=="O" ? 1 : returnstringvalue($(this).find("td:eq(6) input[type='number']").val())),
                    UoMEntry: $(this).find("td:eq(7) select[name='uom']").val(),
                    UPrice: (type == "O" ? returnstringvalue($(this).find("td:eq(6) input[type='number']").val()) : "0.00"),
                    LineTotal: (type == "O" ? returnstringvalue($(this).find("td:eq(6) input[type='number']").val()) : "0.00"),
                    WhsCode: $(this).find("td:eq(10) select[name='whs']").val(),
                    OcrCode: $(this).find("td:eq(11) select[name='ocrcode']").val(),
                    OcrCode2: $(this).find("td:eq(12) select[name='ocrcode2']").val(),
                    OcrCode3: $(this).find("td:eq(13) select[name='ocrcode3']").val(),
                    OcrCode4: $(this).find("td:eq(14) select[name='ocrcode4']").val(),
                    MainworkCode: $(this).find("td:eq(15) select[name='mainwork']").val(),
                    SubWorkCode: $(this).find("td:eq(16) select[name='subwork']").val(),
                    DetailWorkCode: $(this).find("td:eq(17) select[name='detailwork']").val(),
                    FloorWorkCode: $(this).find("td:eq(18) select[name='floorwork']").val(),
                    BOQType: type,
                    IsBOQ: "No"
                };
            }
            list.push(d);
            lineno = lineno + 1;
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/purpr/cmd_save_boq_pr',
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
function cmd_pr_confirm_assignment() {
    list = [];
    $("#table_pr_assignment > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id;
            var d = {
                DocEntry: $("#tr_" + id).find("td:eq(0)").text(),
                LineNum: $("#tr_" + id).find("td:eq(1)").text(),
                AssignToUser: $("#tr_" + id).find("td:eq(10) select[name='newassign']").val(),
                AssignBy: $("#txt_shared_userid").val()
            };
            list.push(d);
        }
    });
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/purpr/cmd_pr_confirm_assignment',
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
function cmd_pr_approval(action) {
    list = [];
    $("#table_pr_action > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id;
            var d = {
                DocEntry: $("#tr_" + id).find("td:eq(0)").text(),
                DocStatus: $("#tr_" + id).find("td:eq(2) select[name='action']").val(),
                UpdatedBy: $("#txt_shared_userid").val()
            };
            list.push(d);
        }
    });
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/purpr/cmd_pr_approval',
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
function cmd_show_vendor() {
    $("#modal-vendor_list").modal('show');
    tr_pop_vendor_selected(-1);
}
function tr_pop_vendor_selected(selectedindex) {
    $("#table_pop_vendor_list > tbody > tr").each(function (index) {
        $("#tr_pop_vendor_" + (index + 1)).css("background-color", "white");
    });
    $("#tr_pop_vendor_" + selectedindex).css("background-color", "#e6f0ff");
    $("#txt_bp_selected_row").val(selectedindex);
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
