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
function cmd_grpo_copy_from_po() {
    $("#modal-po-list").modal('show');
}
function cmd_grpo_filter_pop_up_check_all() {
    $('input:checkbox[name="chk"]').prop('checked', true);
    $("#th_check").hide();
    $("#th_uncheck").show();
}
function cmd_grpo_filter_pop_up_uncheck_all() {
    $('input:checkbox[name="chk"]').prop('checked', false);
    $("#th_uncheck").hide();
    $("#th_check").show();
}
function cmd_po_filter_pop_up_uncheck_all() {
    $('input:checkbox[name="chk"]').prop('checked', false);
    $("#th_uncheck").hide();
    $("#th_check").show();
}
function cmd_po_line_show_detail(rowindex) {
    var detail = "tr_po_sub_" + rowindex;
    if ($("#td_po_header_" + rowindex).text() == "H") {
        $("[name=" + detail + "]").show();
        $("#td_po_header_" + rowindex).text("S");
    }
    else {
        $("[name=" + detail + "]").hide();
        $("#td_po_header_" + rowindex).text("H");
    }
}
function cmd_po_line_remove_summary(rowindex) {
    var detail = "tr_po_sub_" + rowindex;
    $("#tr_po_head_" + rowindex).remove();
    $("[name=" + detail + "]").remove();

}
function cmd_po_line_remove_detail(id) {
    $("#tr_po_detail_" + id).remove();
}
function line_grpo_sub_change(rowindex,summaryid) {

    var poqty = $("#txt_po_line_sub_po_qty_" + rowindex).val();
    var actqty = $("#txt_po_line_sub_act_qty_" + rowindex).val();
    //var oldclaim = $("#txt_po_line_sub_qty_" + rowindex).val();
    var claimqty = parseFloat(returnstringvalue(poqty)) - parseFloat(returnstringvalue(actqty));
    if (claimqty < 0) {
        ShowAlert("Total Actual quantity is greater than PO quantity");
        $("#txt_po_line_sub_act_qty_" + rowindex).val("0.00");
    }
    else {
        $("#txt_po_line_sub_qty_" + rowindex).val(parseFloat(returnstringvalue(claimqty)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        $("#txt_po_line_sub_act_qty_" + rowindex).val(parseFloat(returnstringvalue(actqty)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }
    var claim_detail_id = "po_line_sub_act_qty_" + summaryid;
    var total_claim = 0;
    $("input[name=" + claim_detail_id + "]").each(function () {
        total_claim = total_claim + parseFloat(returnstringvalue($(this).val()));
    });
    $("#txt_po_line_summary_act_qty_" + summaryid).val(parseFloat(returnstringvalue(total_claim)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}
function line_grpo_summary_change(rowindex, type) {
    var actqtyname = "po_line_sub_act_qty_" + rowindex;
    var actqty = $("#txt_po_line_summary_act_qty_" + rowindex).val();
    $("#txt_po_line_summary_act_qty_" + rowindex).val(parseFloat(returnstringvalue(actqty)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    $("[name=" + actqtyname + "]").val(parseFloat(returnstringvalue(actqty)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    $("input[name=" + actqtyname + "]").each(function () {
        var act_detail_id = $(this).attr('id');
        var po_detail_id = act_detail_id.replace("txt_po_line_sub_act_qty", "txt_po_line_sub_po_qty");
        var claim_detail_id = act_detail_id.replace("txt_po_line_sub_act_qty", "txt_po_line_sub_qty");
        var po_detail_qty = $("#" + po_detail_id).val();
        var claim_detail_qty = parseFloat(returnstringvalue(po_detail_qty)) - parseFloat(returnstringvalue(actqty))
        $("#" + claim_detail_id).val(parseFloat(returnstringvalue(claim_detail_qty)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    });

}
function cmd_grpo_choose_po() {
    var list_distinct_item = [];
    var list_item = [];
    var list_selected_item = [];

    $("#table_po_pop_pr_list > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id;
            list_item.push($("#tr_" + id).find("td:eq(25)").text());
            var d = {
                DocEntry: $("#tr_" + id).find("td:eq(0)").text(),
                LineNum: $("#tr_" + id).find("td:eq(1)").text(),
                //AcctCode: $("#tr_" + id).find("td:eq(1)").text(),
                ItemCode: $("#tr_" + id).find("td:eq(25)").text(),
                ItemName: $("#tr_" + id).find("td:eq(26)").text(),
                Quantity: $("#tr_" + id).find("td:eq(2)").text(),
                OcrCode3Name: $("#tr_" + id).find("td:eq(27)").text(),
                FloorName: $("#tr_" + id).find("td:eq(31)").text(),
                Term1: $("#tr_" + id).find("td:eq(13)").text(),
                Term2: $("#tr_" + id).find("td:eq(14)").text(),
                Term3: $("#tr_" + id).find("td:eq(15)").text(),
                Term4: $("#tr_" + id).find("td:eq(16)").text(),
                Term5: $("#tr_" + id).find("td:eq(17)").text(),
                Term6: $("#tr_" + id).find("td:eq(18)").text(),
                Term7: $("#tr_" + id).find("td:eq(19)").text(),
                Term8: $("#tr_" + id).find("td:eq(20)").text(),
                Term9: $("#tr_" + id).find("td:eq(21)").text(),
                Term10: $("#tr_" + id).find("td:eq(22)").text(),
                CompleteTerm1: $("#tr_" + id).find("td:eq(3)").text(),
                CompleteTerm2: $("#tr_" + id).find("td:eq(4)").text(),
                CompleteTerm3: $("#tr_" + id).find("td:eq(5)").text(),
                CompleteTerm4: $("#tr_" + id).find("td:eq(6)").text(),
                CompleteTerm5: $("#tr_" + id).find("td:eq(7)").text(),
                CompleteTerm6: $("#tr_" + id).find("td:eq(8)").text(),
                CompleteTerm7: $("#tr_" + id).find("td:eq(9)").text(),
                CompleteTerm8: $("#tr_" + id).find("td:eq(10)").text(),
                CompleteTerm9: $("#tr_" + id).find("td:eq(11)").text(),
                CompleteTerm10: $("#tr_" + id).find("td:eq(12)").text(),
            };
            list_selected_item.push(d);
        }
    });

    var list_distinct_item = list_item.filter(function (item, i, list_item) {
        return i == list_item.indexOf(item);
    });

    var rowindex = 0;
    $('#table_po_line > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(0)").text() == "Header") {
            rowindex = $(this).attr("id").replace("tr_po_head_", "");
        }
    });
    rowindex++;

    var counthouse = 0;
    var itemname = "";
    var detailrowindex = 0;
    var housename = "";
    var grpoqty = 0;
    var totalqty = 0;
    var islast = 0;
    $("#table_po_line >tbody>tr").remove();
    for (i = 0; i < list_distinct_item.length; i++) {
        counthouse = 0;
        housename = "";
        totalqty = 0;
        grpoqty = 0;
        detailrowindex = 0;
        var data = "<tr id='tr_po_head_" + rowindex + "' class='header-color'>";
        data = data + "<td style='display:none'>Header</td>";
        data = data + "<td style='display:none' id='td_po_header_" + rowindex + "'>H</td>";
        data = data + "<td><i class='fa fa-plus text-info' onclick='cmd_po_line_show_detail(" + rowindex + ")' style='cursor:pointer'></i></td>";
        data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_po_line_remove_summary(" + rowindex + ")'></i></td>"
        data = data + "<td colspan='3'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_item_name_" + rowindex + "'placeholder='Description' readonly='readonly' value=''></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_noofhouse_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",3)' placeholder='No.of House' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_po_qty_" + rowindex + "' readonly='readonly' ></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_qty_" + rowindex + "'  placeholder='Quantity' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_act_qty_" + rowindex + "' onchange='line_grpo_summary_change(" + rowindex + ",2)' placeholder='Act.Qty' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term1_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",4)' readonly='readonly' placeholder='Term 1' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term2_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",5)' readonly='readonly'  placeholder='Term 2' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term3_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",6)' readonly='readonly' placeholder='Term 3' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term4_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",7)' readonly='readonly' placeholder='Term 4' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term5_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",8)' readonly='readonly' placeholder='Term 5' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term6_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",9)' readonly='readonly' placeholder='Term 6' value='0.00'></div></td>";
        data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term7_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",10)' readonly='readonly' placeholder='Term 7' value='0.00'></div></td>";
        data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term8_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",11)' readonly='readonly'  placeholder='Term 8' value='0.00'></div></td>";
        data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term9_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",12)' readonly='readonly' placeholder='Term 9' value='0.00'></div></td>";
        data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term10_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",13)' readonly='readonly' placeholder='Term 10' value='0.00'></div></td>";
        data = data + "<td style='display:none'></td>";
        data = data + "</tr>";
        $.each(list_selected_item, function (key, value) {
            if (value.ItemCode == list_distinct_item[i]) {
                //counthouse++;
                if (housename != value.OcrCode4Name) {
                    counthouse++;
                    housename = value.OcrCode4Name;
                }
                itemname = value.ItemName;
                detailrowindex++;
                islast = 0;
                if (value.CompleteTerm1 == 'N') {
                    if (parseFloat(value.Term1) > 0) {
                        grpoqty = value.Quantity * (returnstringvalue(value.Term1) / 100);
                    }
                    if (parseFloat(value.Term2) > 0) {
                        islast = 1;
                    }
                    else {
                        islast = 0;
                    }
                }
                if (value.CompleteTerm2 == 'N') {
                    if (parseFloat(value.Term2) > 0) {
                        grpoqty = value.Quantity * (returnstringvalue(value.Term2) / 100);
                    }
                    if (parseFloat(value.Term3) > 0) {
                        islast = 1;
                    }
                    else {
                        islast = 0;
                    }
                }
                if (value.CompleteTerm3 == 'N') {
                    if (parseFloat(value.Term3) > 0) {
                        grpoqty = value.Quantity * (returnstringvalue(value.Term3) / 100);
                    }
                    if (parseFloat(value.Term4) > 0) {
                        islast = 1;
                    }
                    else {
                        islast = 0;
                    }
                }
                if (value.CompleteTerm4 == 'N') {
                    if (parseFloat(value.Term4) > 0) {
                        grpoqty = value.Quantity * (returnstringvalue(value.Term4) / 100);
                    }
                    if (parseFloat(value.Term5) > 0) {
                        islast = 1;
                    }
                    else {
                        islast = 0;
                    }
                }
                if (value.CompleteTerm5 == 'N') {
                    if (parseFloat(value.Term5) > 0) {
                        grpoqty = value.Quantity * (returnstringvalue(value.Term5) / 100);
                    }
                    islast = 5;
                }
                if (value.CompleteTerm6 == 'N') {
                    if (parseFloat(value.Term6) > 0) {
                        grpoqty = value.Quantity * (returnstringvalue(value.Term6) / 100);
                    }
                }
                if (value.CompleteTerm7 == 'N') {
                    if (parseFloat(value.Term7) > 0) {
                        grpoqty = value.Quantity * (returnstringvalue(value.Term7) / 100);
                    }
                }
                if (value.CompleteTerm8 == 'N') {
                    if (parseFloat(value.Term8) > 0) {
                        grpoqty = value.Quantity * (returnstringvalue(value.Term8) / 100);
                    }
                }
                if (value.CompleteTerm9 == 'N') {
                    if (parseFloat(value.Term9) > 0) {
                        grpoqty = value.Quantity * (returnstringvalue(value.Term9) / 100);
                    }
                }
                if (value.CompleteTerm10 == 'N') {
                    if (parseFloat(value.Term10) > 0) {
                        grpoqty = value.Quantity * (returnstringvalue(value.Term10) / 100);
                    }
                }
                totalqty = parseFloat(totalqty) + parseFloat(returnstringvalue(grpoqty));

                data = data + "<tr name='tr_po_sub_" + rowindex + "' style='display:none' id='tr_po_detail_" + rowindex + "" + detailrowindex + "'>";
                data = data + "<td style='display:none'>Detail</td>";
                data = data + "<td style='display:none'>" + value.DocEntry + "</td>";
                data = data + "<td style='display:none'>" + value.LineNum + "</td>";
                data = data + "<td></td>"
                data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_po_line_remove_detail(" + +rowindex + "" + detailrowindex + ")'></i></td>"
                data = data + "<td colspan='2'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.FloorName + "'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' readonly='readonly' value=''></div></td>";
                data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_po_qty_" + rowindex + "' id='txt_po_line_sub_po_qty_" + rowindex + "" + detailrowindex + "' placeholder='PO Qty' value='" + parseFloat(returnstringvalue(value.Quantity)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_qty_" + rowindex + "' id='txt_po_line_sub_qty_" + rowindex + "" + detailrowindex + "' placeholder='Claim Qty' value='" + parseFloat(returnstringvalue(grpoqty)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly'></div></td>";

                if (islast == 0) {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_act_qty_" + rowindex + "' id='txt_po_line_sub_act_qty_" + rowindex + "" + detailrowindex + "' onchange='line_grpo_sub_change(" + rowindex + "" + detailrowindex + "," + rowindex +")' value='0.00'></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde'  id='txt_po_line_sub_act_qty_" + rowindex + "" + detailrowindex + "' value='0.00' readonly='readonly'></div></td>";
                }

                if (value.CompleteTerm1 == 'N') {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term1_" + rowindex + "' ​id='txt_po_line_sub_term1_" + rowindex + "" + detailrowindex + "' placeholder='Term 1' value='" + parseFloat(returnstringvalue(value.Term1)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly'></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term1_" + rowindex + "' ​id='txt_po_line_sub_term1_" + rowindex + "" + detailrowindex + "' placeholder='Term 1' value='" + parseFloat(returnstringvalue(value.Term1)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                }
                if (value.CompleteTerm2 == 'N') {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term2_" + rowindex + "' id='txt_po_line_sub_term2_" + rowindex + "" + detailrowindex + "' placeholder='Term 2' value='" + parseFloat(returnstringvalue(value.Term2)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term2_" + rowindex + "' id='txt_po_line_sub_term2_" + rowindex + "" + detailrowindex + "' placeholder='Term 2' value='" + parseFloat(returnstringvalue(value.Term2)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                }
                if (value.CompleteTerm3 == 'N') {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term3_" + rowindex + "' id='txt_po_line_sub_term3_" + rowindex + "" + detailrowindex + "' placeholder='Term 3' value='" + parseFloat(returnstringvalue(value.Term3)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term3_" + rowindex + "' id='txt_po_line_sub_term3_" + rowindex + "" + detailrowindex + "' placeholder='Term 3' value='" + parseFloat(returnstringvalue(value.Term3)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly'></div></td>";
                }
                if (value.CompleteTerm4 == 'N') {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term4_" + rowindex + "' id='txt_po_line_sub_term4_" + rowindex + "" + detailrowindex + "' placeholder='Term 4' value='" + parseFloat(returnstringvalue(value.Term4)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term4_" + rowindex + "' id='txt_po_line_sub_term4_" + rowindex + "" + detailrowindex + "' placeholder='Term 4' value='" + parseFloat(returnstringvalue(value.Term4)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                }
                if (value.CompleteTerm5 == 'N') {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term5_" + rowindex + "' id='txt_po_line_sub_term5_" + rowindex + "" + detailrowindex + "' placeholder='Term 5' value='" + parseFloat(returnstringvalue(value.Term5)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term5_" + rowindex + "' id='txt_po_line_sub_term5_" + rowindex + "" + detailrowindex + "' placeholder='Term 5' value='" + parseFloat(returnstringvalue(value.Term5)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                }
                if (value.CompleteTerm6 == 'N') {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term6_" + rowindex + "' id='txt_po_line_sub_term6_" + rowindex + "" + detailrowindex + "' placeholder='Term 6' value='" + parseFloat(returnstringvalue(value.Term6)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term6_" + rowindex + "' id='txt_po_line_sub_term6_" + rowindex + "" + detailrowindex + "' placeholder='Term 6' value='" + parseFloat(returnstringvalue(value.Term6)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                }
                data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term7_" + rowindex + "' id='txt_po_line_sub_term7_" + rowindex + "" + detailrowindex + "' placeholder='Term 7'></div></td>";
                data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term7_" + rowindex + "' id='txt_po_line_sub_term8_" + rowindex + "" + detailrowindex + "' placeholder='Term 7'></div></td>";
                data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term7_" + rowindex + "' id='txt_po_line_sub_term9_" + rowindex + "" + detailrowindex + "' placeholder='Term 7'></div></td>";
                data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term7_" + rowindex + "' id='txt_po_line_sub_term10_" + rowindex + "" + detailrowindex + "' placeholder='Term 7'></div></td>";
                //if (value.CompleteTerm7 == 'N') {
                //    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term7_" + rowindex + "' id='txt_po_line_sub_term7_" + rowindex + "" + detailrowindex + "' placeholder='Term 7' value='" + parseFloat(returnstringvalue(value.Term7)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                //}
                //else {
                //    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term7_" + rowindex + "' id='txt_po_line_sub_term7_" + rowindex + "" + detailrowindex + "' placeholder='Term 7' value='" + parseFloat(returnstringvalue(value.Term7)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                //}
                //if (value.CompleteTerm8 == 'N') {
                //    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term8_" + rowindex + "' id='txt_po_line_sub_term8_" + rowindex + "" + detailrowindex + "' placeholder='Term 8' value='" + parseFloat(returnstringvalue(value.Term8)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                //}
                //else {
                //    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term8_" + rowindex + "' id='txt_po_line_sub_term8_" + rowindex + "" + detailrowindex + "' placeholder='Term 8' value='" + parseFloat(returnstringvalue(value.Term8)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' readonly='readonly' ></div></td>";
                //}
                //if (value.CompleteTerm9 == 'N') {
                //    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term9_" + rowindex + "' id='txt_po_line_sub_term9_" + rowindex + "" + detailrowindex + "' placeholder='Term 9' value='" + parseFloat(returnstringvalue(value.Term9)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "'></div></td>";
                //}
                //else {
                //    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term9_" + rowindex + "' id='txt_po_line_sub_term9_" + rowindex + "" + detailrowindex + "' placeholder='Term 9' value='" + parseFloat(returnstringvalue(value.Term9)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                //}
                //if (value.CompleteTerm10 == 'N') {
                //    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term10_" + rowindex + "' id='txt_po_line_sub_term10_" + rowindex + "" + detailrowindex + "' placeholder='Term 10' value='" + parseFloat(returnstringvalue(value.Term10)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                //}
                //else {
                //    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term10_" + rowindex + "' id='txt_po_line_sub_term10_" + rowindex + "" + detailrowindex + "' placeholder='Term 10' value='" + parseFloat(returnstringvalue(value.Term10)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "' readonly='readonly' ></div></td>";
                //}
                data = data + "<td style='display:none'><input type='text' name='po_line_sub_net_price_" + rowindex + "' id='txt_po_line_sub_net_price_" + rowindex + "" + detailrowindex + "' /></td>";
                data = data + "</tr>";
            }
        });
        $("#table_po_line >tbody").append(data);
        $("#txt_po_line_item_name_" + rowindex).val(itemname);
        $("#txt_po_line_summary_noofhouse_" + rowindex).val(counthouse);
        $("#txt_po_line_summary_qty_" + rowindex).val(parseFloat(returnstringvalue(totalqty)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        rowindex++;
    }
    $("#modal-po-list").modal('hide');
    $("#table_po_pop_pr_list > tbody>tr").remove();
    cmd_po_filter_pop_up_uncheck_all();
}

//get data from databaseb
function cmd_grpo_filter_pop_up_view(isboq,boqtype) {
    var itemgroup = $("#cbo_po_pop_filter_item_group").val();
    var itemdesc = $("#txt_po_pop_filter_item_desc").val();
    $.ajax({
        url: '/purgrpo/cmd_grpo_filter_pop_up_view',
        type: 'POST',
        data: { pon: $("#txt_po_pop_filter_po_num").val(), itemgroup: itemgroup, itemdesc: itemdesc, isBoq: isboq, BoqType: boqtype },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#table_po_pop_pr_list >tbody>tr").remove();
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                var tr = "<tr id='tr_" + i + "'>";
                tr = tr + "<td style='display:none'>" + x.DocEntry + "</td>";
                tr = tr + "<td style='display:none'>" + x.LineNum + "</td>";
                tr = tr + "<td style='display:none'>" + returnstringvalue(x.Quantity) + "</td>";
                tr = tr + "<td style='display:none'>" + x.CompleteTerm1 + "</td>";
                tr = tr + "<td style='display:none'>" + x.CompleteTerm2 + "</td>";
                tr = tr + "<td style='display:none'>" + x.CompleteTerm3 + "</td>";
                tr = tr + "<td style='display:none'>" + x.CompleteTerm4 + "</td>";
                tr = tr + "<td style='display:none'>" + x.CompleteTerm5 + "</td>";
                tr = tr + "<td style='display:none'>" + x.CompleteTerm6 + "</td>";
                tr = tr + "<td style='display:none'>" + x.CompleteTerm7 + "</td>";
                tr = tr + "<td style='display:none'>" + x.CompleteTerm8 + "</td>";
                tr = tr + "<td style='display:none'>" + x.CompleteTerm9 + "</td>";
                tr = tr + "<td style='display:none'>" + x.CompleteTerm10 + "</td>";
                tr = tr + "<td style='display:none'>" + x.Term1 + "</td>";
                tr = tr + "<td style='display:none'>" + x.Term2 + "</td>";
                tr = tr + "<td style='display:none'>" + x.Term3 + "</td>";
                tr = tr + "<td style='display:none'>" + x.Term4 + "</td>";
                tr = tr + "<td style='display:none'>" + x.Term5 + "</td>";
                tr = tr + "<td style='display:none'>" + x.Term6 + "</td>";
                tr = tr + "<td style='display:none'>" + x.Term7 + "</td>";
                tr = tr + "<td style='display:none'>" + x.Term8 + "</td>";
                tr = tr + "<td style='display:none'>" + x.Term9 + "</td>";
                tr = tr + "<td style='display:none'>" + x.Term10 + "</td>";
                tr = tr + "<td><input type='checkbox' name='chk' id='" + i + "'/></td>";
                tr = tr + "<td>" + x.DocNum + "</td>";
                tr = tr + "<td style='display:none'>" + x.ItemCode + "</td>";
                tr = tr + "<td>" + x.ItemName + "</td>";
                tr = tr + "<td>" + x.OcrCode3Name + "</td>";
                tr = tr + "<td>" + x.MainWorkName + "</td>";
                tr = tr + "<td>" + x.SubWorkName + "</td>";
                tr = tr + "<td>" + x.DetailName + "</td>";
                tr = tr + "<td style='display:none'>" + x.FloorName + "</td>";
                tr = tr + "</tr>";
                $("#table_po_pop_pr_list >tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
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