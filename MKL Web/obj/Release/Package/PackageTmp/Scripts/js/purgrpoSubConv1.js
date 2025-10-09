

function line_grpo_sub_change(detailid, summaryid) {

    var poqty = $("#txt_line_detail_po_qty_" + detailid).val();
    var actqty = $("#txt_line_detail_act_qty_" + detailid).val();
    var lasttermnumber = $("#td_last_term_number_" + detailid).text();
    var total_claim = 0;
    for (i = 1; i < parseInt(lasttermnumber); i++) {

        total_claim = parseFloat(total_claim) + (parseFloat(poqty) * (parseFloat($("#txt_line_detail_term" + i + "_" + detailid).val()) / 100));
    }
    //var oldclaim = $("#txt_po_line_sub_qty_" + rowindex).val();
    var claimqty = parseFloat(returnstringvalue(actqty))-parseFloat(returnstringvalue(total_claim));
    

    if (claimqty < 0) {
        ShowAlert("Total Actual quantity is greater than PO quantity");
        $("#txt_line_detail_act_qty_" + detailid).val("0.00");
    }
    else {
        $("#txt_line_detail_qty_" + detailid).val(convert2digit(claimqty));
        $("#txt_line_detail_act_qty_" + detailid).val(convert2digit(actqty));
    }
    var claim_detail_id = "name_detail_act_qty_" + summaryid;
    var total_act_claim = 0;
    var total_claim = 0;

    $("input[name=" + claim_detail_id + "]").each(function () {
        var detail_id = $(this).attr('id').replace("txt_line_detail_act_qty_", "");
        total_act_claim = total_act_claim + parseFloat(returnstringvalue($("#txt_line_detail_act_qty_" + detail_id).val()));
        total_claim = total_claim + parseFloat(returnstringvalue($("#txt_line_detail_qty_" + detail_id).val()));
    });
    $("#txt_line_summary_act_qty_" + summaryid).val(convert2digit(total_act_claim));
    $("#txt_line_summary_qty_" + summaryid).val(convert2digit(total_claim));
}
function cmd_choose_po() {
    $('#table_summary_detail >tbody>tr').remove();
    var option = "";
    var whs = "";
    $("#table_whs > tbody >tr").each(function () {
        whs = whs + "<option value='" + $(this).find("td:eq(0)").text() + "'>" + $(this).find("td:eq(1)").text() + "</option>";
    });
    var list_distinct_item = [];
    var list_item = [];
    var list_selected_item = [];

    var list_pr_num = [];
    var list_pr_num_distinct = [];
    //collect data from selected boq
    $("#table_popup_document_list > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("check_pop_boq_", "");
            list_item.push($("#td_pop_line_filer_item_code_" + id).text());
            list_pr_num.push($("#td_pop_line_filer_base_ref_doc_" + id).text());
            var d = {
                BaseEntry: $("#td_pop_line_filer_base_entry_" + id).text(),
                BaseLine: $("#td_pop_line_filer_base_line_" + id).text(),
                BaseObj: "PO",
                DocEntry: "-1",
                LineNum: "-1",
                BrandName: $("#td_pop_line_filer_brand_name_" + id).text(),
                GlobalCode: $("#td_pop_line_filer_globalcode_" + id).text(),
                ItemCode: $("#td_pop_line_filer_item_code_" + id).text(),
                ItemName: $("#td_pop_line_filer_item_name_" + id).text(),
                Quantity: $("#td_pop_line_filer_boq_qty_" + id).text(),
                uom: $("#td_pop_line_filer_uom_" + id).text(),
                ugpentry: $("#td_pop_line_filer_ugpentry_" + id).text(),
                whs: $("#td_pop_line_filer_whs_" + id).text(),
                ocrcode: $("#td_pop_line_filer_ocrcode_" + id).text(),
                ocrcode2: $("#td_pop_line_filer_ocrcode2_" + id).text(),
                ocrcode3: $("#td_pop_line_filer_ocrcode3_" + id).text(),
                main_code: $("#td_pop_line_filer_main_code_" + id).text(),
                sub_code: $("#td_pop_line_filer_sub_code_" + id).text(),
                floor_code: $("#td_pop_line_filer_floor_code_" + id).text(),
                OcrCode3Name: $("#td_pop_line_filer_ocrcode3_name_" + id).text(),
                FloorName: $("#td_pop_line_filer_floor_name_" + id).text(),
                Term1: $("#td_pop_line_filer_term1_" + id).text(),
                Term2: $("#td_pop_line_filer_term2_" + id).text(),
                Term3: $("#td_pop_line_filer_term3_" + id).text(),
                Term4: $("#td_pop_line_filer_term4_" + id).text(),
                Term5: $("#td_pop_line_filer_term5_" + id).text(),
                Term6: $("#td_pop_line_filer_term6_" + id).text(),
                Term7: $("#td_pop_line_filer_term7_" + id).text(),
                Term8: $("#td_pop_line_filer_term8_" + id).text(),
                Term9: $("#td_pop_line_filer_term9_" + id).text(),
                Term10: $("#td_pop_line_filer_term10_" + id).text(),
                CompleteTerm1: $("#td_pop_line_filer_complete_term1_" + id).text(),
                CompleteTerm2: $("#td_pop_line_filer_complete_term2_" + id).text(),
                CompleteTerm3: $("#td_pop_line_filer_complete_term3_" + id).text(),
                CompleteTerm4: $("#td_pop_line_filer_complete_term4_" + id).text(),
                CompleteTerm5: $("#td_pop_line_filer_complete_term5_" + id).text(),
                CompleteTerm6: $("#td_pop_line_filer_complete_term6_" + id).text(),
                CompleteTerm7: $("#td_pop_line_filer_complete_term7_" + id).text(),
                CompleteTerm8: $("#td_pop_line_filer_complete_term8_" + id).text(),
                CompleteTerm9: $("#td_pop_line_filer_complete_term9_" + id).text(),
                CompleteTerm10: $("#td_pop_line_filer_complete_term10_" + id).text()
            };
            list_selected_item.push(d);
        }
    });
    var list_distinct_item = list_item.filter(function (item, i, list_item) {
        return i == list_item.indexOf(item);
    });

    var list_pr_num_distinct = list_pr_num.filter(function (item, i, list_pr_num) {
        return i == list_pr_num.indexOf(item);
    });

    var copyfrom_text = "";

    for (i = 0; i < list_pr_num_distinct.length; i++) {
        copyfrom_text = (copyfrom_text == "" ? list_pr_num_distinct[i] : copyfrom_text + "," + list_pr_num_distinct[i]);
    }
    $("#txt_pr_ref").val(copyfrom_text);

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
    var grpoqty = 0;
    var totalqty = 0;
    var itembrandname = "";
    var lasttermnumber = 0;
    var summary_qty = 0;
    var detail_qty = 0;
    var summary_po_qty = 0;
    var detail_po_qty = 0;

    for (i = 0; i < list_distinct_item.length; i++) {
        detailrowindex = 1;
        total_sub_qty = 0;
        option = "";
        counthouse = 0;
        housename = "";
        totalqty = 0;
        grpoqty = 0;
        summary_qty = 0;
        summary_po_qty = 0;

        var data = "<tr id='td_summary_" + headerrowindex + "' class='header-color'>";
        data = data + "<td id='td_summary_is_Sumamry_" + headerrowindex + "' style='display:none'>Header</td>";
        data = data + "<td style='display:none' id='td_is_summary_" + headerrowindex + "'>H</td>";
        data = data + "<td><i class='fa fa-circle text-danger' style='cursor:pointer;' id='td_summary_check_all_" + headerrowindex + "' onclick='check_document_summary_detail(" + headerrowindex + ")'></i><i class='fa fa-circle text-yellow' id='td_summary_uncheck_all_" + headerrowindex + "' style='cursor:pointer; display:none' onclick='uncheck_document_summary_detail(" + headerrowindex + ")'></i></td>";
        data = data + "<td><i class='fa fa-plus text-info' onclick='cmd_line_show_detail(" + headerrowindex + ")' style='cursor:pointer'></i></td>";
        data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_summary(" + headerrowindex + ")'></i></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' placeholder='Brand' id='txt_line_summary_brand_" + headerrowindex + "' readonly='readonly' ></div></td>";
        data = data + "<td colspan='3'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_item_name_" + headerrowindex + "'placeholder='Description' readonly='readonly' value=''></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_noofhouse_" + headerrowindex + "' readonly='readonly' placeholder='No.of House' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_po_qty_" + headerrowindex + "' readonly='readonly' ></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_qty_" + headerrowindex + "'  placeholder='Quantity' readonly='readonly' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_act_qty_" + headerrowindex + "' placeholder='Act.Qty' readonly='readonly' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_term1_" + headerrowindex + "' onchange='line_po_summary_change(" + headerrowindex + ",4)' readonly='readonly' placeholder='Term 1' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_term2_" + headerrowindex + "' onchange='line_po_summary_change(" + headerrowindex + ",5)' readonly='readonly'  placeholder='Term 2' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_term3_" + headerrowindex + "' onchange='line_po_summary_change(" + headerrowindex + ",6)' readonly='readonly' placeholder='Term 3' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_term4_" + headerrowindex + "' onchange='line_po_summary_change(" + headerrowindex + ",7)' readonly='readonly' placeholder='Term 4' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_term5_" + headerrowindex + "' onchange='line_po_summary_change(" + headerrowindex + ",8)' readonly='readonly' placeholder='Term 5' value='0.00'></div></td>";
        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_term6_" + headerrowindex + "' onchange='line_po_summary_change(" + headerrowindex + ",9)' readonly='readonly' placeholder='Term 6' value='0.00'></div></td>";
        data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term7_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",10)' readonly='readonly' placeholder='Term 7' value='0.00'></div></td>";
        data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term8_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",11)' readonly='readonly'  placeholder='Term 8' value='0.00'></div></td>";
        data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term9_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",12)' readonly='readonly' placeholder='Term 9' value='0.00'></div></td>";
        data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_po_line_summary_term10_" + rowindex + "' onchange='line_po_summary_change(" + rowindex + ",13)' readonly='readonly' placeholder='Term 10' value='0.00'></div></td>";
        data = data + "<td style='display:none' id='txt_line_summary_line_num_" + headerrowindex + "'>-1</td>";
        data = data + "<td style='display:none' id='txt_line_summary_item_code_" + headerrowindex + "'>" + list_distinct_item[i] + "</td>";
        data = data + "</tr>";
        $.each(list_selected_item, function (key, value) {
            detail_qty = 0;
            detail_po_qty = 0;
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
                        lasttermnumber = 1;
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
                        lasttermnumber = 2;
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
                        lasttermnumber = 3;
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
                        lasttermnumber = 4;
                    }
                }
                if (value.CompleteTerm5 == 'N') {
                    if (parseFloat(value.Term5) > 0) {
                        grpoqty = value.Quantity * (returnstringvalue(value.Term5) / 100);
                    }
                    if (parseFloat(value.Term6) > 0) {
                        islast = 1;
                    }
                    else {
                        islast = 0;
                        lasttermnumber = 5;
                    }
                    //islast = 5;
                }
                if (value.CompleteTerm6 == 'N') {
                    if (parseFloat(value.Term6) > 0) {
                        grpoqty = value.Quantity * (returnstringvalue(value.Term6) / 100);
                    }
                    if (parseFloat(value.Term7) > 0) {
                        islast = 1;
                    }
                    else {
                        islast = 0;
                        lasttermnumber = 6;
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

                data = data + "<tr name='name_tr_detail_" + headerrowindex + "' style='display:none' id='tr_detail_" + headerrowindex + "" + detailrowindex + "'>";
                data = data + "<td><input type='checkbox' id='checkbox_line_detail_checkbox_" + headerrowindex + "" + detailrowindex + "' name='name_line_detail_checkbox_" + headerrowindex + "'></td>";
                data = data + "<td style='display:none' >D</td>";
                data = data + "<td></td>";
                data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_detail_document(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></i></td>"
                data = data + "<td colspan='3'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.FloorName + "'></div></td>";
                data = data + "<td colspan='2'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_po_qty_" + headerrowindex + "' id='txt_line_detail_po_qty_" + headerrowindex + "" + detailrowindex + "' placeholder='PO Qty' value='" + convert2digit(value.Quantity) + "' readonly='readonly'></div></td>";
                detail_po_qty = parseFloat(value.Quantity);

                if (islast == 0) {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='name_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' placeholder='Claim Qty' value='0.00' readonly='readonly'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='name_detail_act_qty_" + headerrowindex + "' id='txt_line_detail_act_qty_" + headerrowindex + "" + detailrowindex + "' onchange='line_grpo_sub_change(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")' value='0.00'></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='name_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' placeholder='Claim Qty' value='" + convert2digit(grpoqty) + "' readonly='readonly'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='name_detail_act_qty_" + headerrowindex + "' id='txt_line_detail_act_qty_" + headerrowindex + "" + detailrowindex + "' value='0.00' readonly='readonly'></div></td>";
                    detail_qty = grpoqty;
                }
                data = data + "<td style='display:none'><input type='text' id='txt_line_detail_price_" + headerrowindex + "" + detailrowindex + "' value='0.00'></td>";
                data = data + "<td style='display:none'><input type='text' id='txt_line_detail_disc_per_" + headerrowindex + "" + detailrowindex + "' value='0.00'></td>";
                data = data + "<td style='display:none'><input type='text' id='txt_line_detail_disc_amt_" + headerrowindex + "" + detailrowindex + "' value='0.00'></td>";
                data = data + "<td style='display:none'><input type='text' id='txt_line_detail_total_" + headerrowindex + "" + detailrowindex + "' value='0.00'></td>";


                if (value.CompleteTerm1 == 'N') {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term2_" + headerrowindex + "' id='txt_line_detail_term1_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 2' value='" + convert2digit(value.Term1) + "' readonly='readonly' ></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term2_" + headerrowindex + "' id='txt_line_detail_term1_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 2' value='" + convert2digit(value.Term1) + "' readonly='readonly' ></div></td>";
                }

                if (value.CompleteTerm2 == 'N') {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term2_" + headerrowindex + "' id='txt_line_detail_term2_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 2' value='" + convert2digit(value.Term2) + "' readonly='readonly' ></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term2_" + headerrowindex + "' id='txt_line_detail_term2_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 2' value='" + convert2digit(value.Term2) + "' readonly='readonly' ></div></td>";
                }
                if (value.CompleteTerm3 == 'N') {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term3_" + headerrowindex + "' id='txt_line_detail_term3_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 3' value='" + convert2digit(value.Term3) + "' readonly='readonly' ></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term3_" + headerrowindex + "' id='txt_line_detail_term3_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 3' value='" + convert2digit(value.Term3) + "' readonly='readonly'></div></td>";
                }
                if (value.CompleteTerm4 == 'N') {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term4_" + headerrowindex + "' id='txt_line_detail_term4_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 4' value='" + convert2digit(value.Term4) + "' readonly='readonly' ></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term4_" + headerrowindex + "' id='txt_line_detail_term4_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 4' value='" + convert2digit(value.Term4) + "' readonly='readonly' ></div></td>";
                }
                if (value.CompleteTerm5 == 'N') {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term5_" + headerrowindex + "' id='txt_line_detail_term5_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 5' value='" + convert2digit(value.Term5) + "' readonly='readonly' ></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term5_" + headerrowindex + "' id='txt_line_detail_term5_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 5' value='" + convert2digit(value.Term5) + "' readonly='readonly' ></div></td>";
                }
                if (value.CompleteTerm6 == 'N') {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term6_" + headerrowindex + "' id='txt_line_detail_term6_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 6' value='" + convert2digit(value.Term6) + "' readonly='readonly' ></div></td>";
                }
                else {
                    data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' name='po_line_sub_term6_" + headerrowindex + "' id='txt_line_detail_term6_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 6' value='" + convert2digit(value.Term6) + "' readonly='readonly' ></div></td>";
                }
                data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term7_" + headerrowindex + "' id='txt_po_line_detail_term7_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 7' value='0.00'></div></td>";
                data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term7_" + headerrowindex + "' id='txt_po_line_detail_term8_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 8' value='0.00'></div></td>";
                data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term7_" + headerrowindex + "' id='txt_po_line_detail_term9_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 9' value='0.00'></div></td>";
                data = data + "<td style='display:none'><div class='form-group'><input type='text' class='form-control form-control-insde po_currrent_term' name='po_line_sub_term7_" + headerrowindex + "' id='txt_po_line_detail_term10_" + headerrowindex + "" + detailrowindex + "' placeholder='Term 10' value='0.00'></div></td>";
                data = data + "<td style='display:none'><input type='text' name='po_line_sub_net_price_" + headerrowindex + "' id='txt_po_line_detail_net_price_" + headerrowindex + "" + detailrowindex + "' value='0.00' /></td>";
                data = data + "<td style='display:none' id='td_last_term_number_" + headerrowindex + "" + detailrowindex + "'>" + lasttermnumber + "</td>";

                data = data + "<td style='display:none' id='td_po_line_grpo_detail_item_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemCode + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_item_name_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemName + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_brand_" + headerrowindex + "" + detailrowindex + "'>" + value.BrandName + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_global_code_" + headerrowindex + "" + detailrowindex + "'>" + value.GlobalCode + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_base_entry_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseEntry + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_base_line_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseLine + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_base_obj_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseObj + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_ocrcode_" + headerrowindex + "" + detailrowindex + "'>" + value.ocrcode + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_ocrcode2_" + headerrowindex + "" + detailrowindex + "'>" + value.ocrcode2 + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_ocrcode3_" + headerrowindex + "" + detailrowindex + "'>" + value.ocrcode3 + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_main_work_code_" + headerrowindex + "" + detailrowindex + "'>" + value.main_code + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_sub_work_code_" + headerrowindex + "" + detailrowindex + "'>" + value.sub_code + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_floor_code_" + headerrowindex + "" + detailrowindex + "'>" + value.floor_code + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_uom_" + headerrowindex + "" + detailrowindex + "'>" + value.uom + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_whs_" + headerrowindex + "" + detailrowindex + "'>" + value.whs + "</td>";
                data = data + "<td style='display:none' id='td_po_line_grpo_detail_line_num_" + headerrowindex + "" + detailrowindex + "'>-1</td>";
                data = data + "</tr>";
                lasttermnumber = 0;
                summary_qty = parseFloat(summary_qty) + parseFloat(detail_qty);
                summary_po_qty = parseFloat(summary_po_qty) + parseFloat(detail_po_qty);

            }
        });
        $("#table_summary_detail >tbody").append(data);
        $("#txt_line_summary_item_name_" + headerrowindex).val(itembrandname + "-" + itemname);
        $("#txt_line_summary_qty_" + headerrowindex).val(convert2digit(summary_qty));
        //$("#cbo_line_summary_uom_" + headerrowindex).append(uomname);
        $("#txt_po_line_summary_noofhouse_" + headerrowindex).val(counthouse);
        $("#txt_line_summary_po_qty_" + headerrowindex).val(convert2digit(summary_po_qty));
        headerrowindex++;
    }
    $("#modal_document").modal('hide');
}
function cmd_grpo_filter_pop_up_view(isboq,boqtype) {
    var itemgroup = $("#cbo_pop_up_search_sub_group").val();
    var itemdesc = $("#txt_pop_up_search_item").val();
    $.ajax({
        url: '/purgrpo/cmd_grpo_filter_pop_up_view',
        type: 'POST',
        data: { pon: $("#txt_pop_up_search_doc_num").val(), itemgroup: itemgroup, itemdesc: itemdesc, isBoq: isboq, BoqType: boqtype },
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
                var tr = "<tr id='tr_" + i + "'>";
                var tr = "<tr id='tr_pop_boq_" + i + "'>";
                tr = tr + "<td><input type='checkbox' name='chk' id='check_pop_boq_" + i + "'/></td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_base_ref_doc_" + i + "'>" + x.DocNum + "</td>";
                tr = tr + "<td id='td_pop_line_filer_base_doc_num_" + i + "'>" + x.DocNum + "</td>";
                tr = tr + "<td id='td_pop_line_filer_type_" + i + "'>" + x.BOQType + "</td>";
                tr = tr + "<td id='td_pop_line_filer_item_name_" + i + "'>" + x.ItemName + "</td>";
                tr = tr + "<td id='td_pop_line_filer_boq_qty_" + i + "'>" + convert2digit(x.BalanceQuantity) + "</td>";
                tr = tr + "<td id='td_pop_line_filer_ocrcode3_name_" + i + "'>" + x.OcrCode3Name + "</td>";
                tr = tr + "<td id='td_pop_line_filer_main_name_" + i + "'>" + x.MainWorkName + "</td>";
                tr = tr + "<td id='td_pop_line_filer_floor_name_" + i + "'>" + x.FloorName + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_base_entry_" + i + "'>" + x.DocEntry + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_base_line_" + i + "'>" + x.LineNum + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_base_obj_" + i + "'>" + $("#txt_copy_from").val() + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_globalcode_" + i + "'>" + x.GlobalCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_item_code_" + i + "'>" + x.ItemCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_brand_code_" + i + "'>" + x.ItemCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_brand_name_" + i + "'>" + x.ItemCode + "</td>";
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
                tr = tr + "<td style='display:none' id='td_pop_line_filer_boq_qty_" + i + "'>" + returnstringvalue(x.BalanceQuantity) + "</td>";

                tr = tr + "<td style='display:none' id='td_pop_line_filer_term1_" + i + "'>" + x.Term1 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term2_" + i + "'>" + x.Term2 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term3_" + i + "'>" + x.Term3 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term4_" + i + "'>" + x.Term4 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term5_" + i + "'>" + x.Term5 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term6_" + i + "'>" + x.Term6 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term7_" + i + "'>" + x.Term7 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term8_" + i + "'>" + x.Term8 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term9_" + i + "'>" + x.Term9 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term10_" + i + "'>" + x.Term10 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_complete_term1_" + i + "'>" + x.CompleteTerm1 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_complete_term2_" + i + "'>" + x.CompleteTerm2 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_complete_term3_" + i + "'>" + x.CompleteTerm3 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_complete_term4_" + i + "'>" + x.CompleteTerm4 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_complete_term5_" + i + "'>" + x.CompleteTerm5 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_complete_term6_" + i + "'>" + x.CompleteTerm6 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_complete_term7_" + i + "'>" + x.CompleteTerm7 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_complete_term8_" + i + "'>" + x.CompleteTerm8 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_complete_term9_" + i + "'>" + x.CompleteTerm9 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_complete_term10_" + i + "'>" + x.CompleteTerm10 + "</td>";

                tr = tr + "</tr>";
                $("#table_popup_document_list >tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}

//Save Data
function cmd_save_summary_detail(BOQType,isBOQ) {
    allow = 0;
    lineno = 0;
    var summary_list = [];
    var detail_list = [];
    var del_list = [];

    if ($("#txt_vendor_code").val() == "") {
        ShowAlert("Vendor Code is required");
        allow = 1;
    }
    if ($("#txt_vendor_name").val() == "") {
        ShowAlert("Vendor Name is required");
        allow = 1;
    }
    
    if ($('#table_summary_detail > tbody  > tr').length == 0 && allow == 0) {
        ShowAlert("Please choose BOQ Information");
        allow = 1;
    }
    $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text() == "S") {
            summaryid = $(this).attr('id').replace("td_summary_", "");
            if (parseFloat($("#txt_line_summary_qty_" + summaryid).val()) == 0) {
                allow = 10;
                return false;
            }
        }
        else {
            var detailid = $(this).attr('id').replace("tr_detail_", "");
            if (parseFloat($("#txt_line_detail_qty_" + detailid).val()) == 0) {
                allow = 11;
                return false;
            }
        }

    });
    if (allow == 10) {
        ShowAlert("Summary Claim Quantity cannot be zero");
    }
    if (allow == 11) {
        ShowAlert("Detail Claim Quantity cannot be zero");
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
        var docdate = $('#txt_posting_date').val().trim().split("-");
        var reqdate = $('#txt_due_date').val().trim().split("-");
        var summaryid;
        var head = {
            DocEntry: $("#txt_dockey").val(),
            DocDate: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
            ValidDate: reqdate[2] + "/" + reqdate[1] + "/" + reqdate[0],
            CardCode: $("#txt_vendor_code").val(),
            CardName: $("#txt_vendor_name").val(),
            ContactPer: $("#cbo_vendor_contact").val(),
            DocType: "I",
            SubTotal: "0.00",
            Discount: "0.00",
            DiscountPer: "0.00",
            VATAmt: "0.00",
            DocTotal: "0.00",
            TermCode: $("#cbo_payment_term").val(),
            TaxGroup: $("#cbo_tax_group").val(),
            CreatedBy: $("#txt_shared_userid").val(),
            OcrCode: $("#cbo_ocrcode").val(),
            Memo: $("#txt_remark").val(),
            PONum: $("#txt_pr_ref").val(),
            IsBOQ: isBOQ,
            BOQType: BOQType
        };
        $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
            if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text() == "S") {
                summaryid = $(this).attr('id').replace("td_summary_", "");
                if (parseFloat($("#txt_line_summary_qty_" + summaryid).val()) == 0) {
                    allow = 10;
                    return false;
                }
            }
            else {
                var detailid = $(this).attr('id').replace("tr_detail_", "");
                if (parseFloat($("#txt_line_detail_qty_" + detailid).val()) == 0) {
                    allow = 11;
                    return false;
                }
            }

        });

        $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
            if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text() == "S") {
                summaryid = $(this).attr('id').replace("td_summary_", "");
                var summary = {
                    LineNum: $("#txt_line_summary_line_num_" + summaryid).text(),
                    Brand: $("#txt_line_summary_brand_" + summaryid).text(),
                    ItemCode: $("#txt_line_summary_item_code_" + summaryid).text(),
                    ItemName: $("#txt_line_summary_item_name_" + summaryid).val(),
                    NoofHouse: $("#txt_line_summary_noofhouse_" + summaryid).val(),
                    POQty: returnstringvalue($("#txt_line_summary_po_qty_" + summaryid).val()),
                    Quantity: returnstringvalue($("#txt_line_summary_qty_" + summaryid).val()),
                    ActQty: returnstringvalue($("#txt_line_summary_act_qty_" + summaryid).val()),
                    UPrice: "0.00",
                    PriceAftDisc: "0.00",
                    DisPer: "0.00",
                    DisAmount: "0.00",
                    LineTotal: "0.00",
                    Term1: returnstringvalue($("#txt_line_summary_term1_" + summaryid).val()),
                    Term2: returnstringvalue($("#txt_line_summary_term2_" + summaryid).val()),
                    Term3: returnstringvalue($("#txt_line_summary_term3_" + summaryid).val()),
                    Term4: returnstringvalue($("#txt_line_summary_term4_" + summaryid).val()),
                    Term5: returnstringvalue($("#txt_line_summary_term5_" + summaryid).val()),
                    Term6: returnstringvalue($("#txt_line_summary_term6_" + summaryid).val()),
                    Term7: "0.00",
                    Term8: "0.00",
                    Term9: "0.00",
                    Term10: "0.00",
                };
                summary_list.push(summary);
            }
            else {
                var detailid = $(this).attr('id').replace("tr_detail_", "");
                var detail = {
                    LineNum: $("#line_detail_line_num_" + detailid).text(),
                    GRPOHLine: summaryid,
                    BaseEntry: $("#td_po_line_grpo_detail_base_entry_" + detailid).text(),
                    BaseLine: $("#td_po_line_grpo_detail_base_line_" + detailid).text(),
                    BaseType: $("#td_po_line_grpo_detail_base_obj_" + detailid).text(),
                    ItemCode: $("#td_po_line_grpo_detail_item_code_" + detailid).text(),
                    ItemName: $("#td_po_line_grpo_detail_item_name_" + detailid).text(),
                    POQty: $("#txt_line_detail_po_qty_" + detailid).val(),
                    Quantity: $("#txt_line_detail_qty_" + detailid).val(),
                    ActQty: $("#txt_line_detail_act_qty_" + detailid).val(),
                    ApplyQuantity: "0.00",
                    UoMEntry: $("#td_po_line_grpo_detail_uom_" + detailid).text(),
                    UPrice: "0.00",
                    DisPer: "0.00",
                    DisAmount: "0.00",
                    LineTotal: "0.00",
                    WhsCode: $("#td_po_line_grpo_detail_whs_" + detailid).text(),
                    OcrCode: $("#cbo_ocrcode").val(),
                    OcrCode2: $("#td_po_line_grpo_detail_ocrcode2_" + detailid).text(),
                    OcrCode3: $("#td_po_line_grpo_detail_ocrcode3_" + detailid).text(),
                    MainworkCode: $("#td_po_line_grpo_detail_main_work_code_" + detailid).text(),
                    SubWorkCode: $("#td_po_line_grpo_detail_sub_work_code_" + detailid).text(),
                    FloorWorkCode: $("#td_po_line_grpo_detail_floor_code_" + detailid).text(),
                    GlobalCode: $("#td_po_line_grpo_detail_global_code_" + detailid).text(),
                    Term1: returnstringvalue($("#txt_line_detail_term1_" + detailid).val()),
                    Term2: returnstringvalue($("#txt_line_detail_term2_" + detailid).val()),
                    Term3: returnstringvalue($("#txt_line_detail_term3_" + detailid).val()),
                    Term4: returnstringvalue($("#txt_line_detail_term4_" + detailid).val()),
                    Term5: returnstringvalue($("#txt_line_detail_term5_" + detailid).val()),
                    Term6: returnstringvalue($("#txt_line_detail_term6_" + detailid).val()),
                    NetPrice: "0.00",
                    PriceAftDisc: "0.00"
                };
                detail_list.push(detail);
            }
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/purgrpo/cmd_save_summary_detail',
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

