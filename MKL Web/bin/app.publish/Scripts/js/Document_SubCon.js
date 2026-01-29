
var deldetail = [];
var delsummary = [];

function change_line_summary_brand(summaryid) {
    var brand = $("#txt_line_summary_brand_" + summaryid).val();
    var name_price = "name_detail_qty_" + summaryid;
    $("input[name=" + name_price + "]").each(function () {
        var detail_id = $(this).attr('id').replace("txt_line_detail_qty_", "");
        $("#line_detail_item_brand_" + detail_id).text(brand);
    });
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
                tr = tr + "<td style='display:none' id='td_pop_line_filer_base_ref_doc_" + i + "'>" + x.RefDocNum + "</td>";

                tr = tr + "<td id='td_pop_line_filer_base_doc_num_" + i + "'>" + x.DocNum + "</td>";
                tr = tr + "<td id='td_pop_line_filer_type_" + i + "'>" + x.Type + "</td>";
                tr = tr + "<td id='td_pop_line_filer_item_name_" + i + "'>" + x.ItemName + "</td>";
                tr = tr + "<td id='td_pop_line_filer_boq_qty_" + i + "'>" + convert2digit(x.Quantity) + "</td>";
                tr = tr + "<td id='td_pop_line_filer_ocrcode3_name_" + i + "'>" + x.OcrCode3Name + "</td>";
                tr = tr + "<td id='td_pop_line_filer_main_name_" + i + "'>" + x.MainWorkName + "</td>";
                tr = tr + "<td id='td_pop_line_filer_sub_name_" + i + "'>" + x.SubWorkName + "</td>";

                tr = tr + "<td style='display:none' id='td_pop_line_filer_base_entry_" + i + "'>" + x.DocEntry + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_base_line_" + i + "'>" + x.LineNum + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_base_obj_" + i + "'>" + $("#txt_copy_from").val() + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_globalcode_" + i + "'>" + x.GlobalCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_item_code_" + i + "'>" + x.ItemCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_brand_code_" + i + "'>" + x.ItemCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_brand_name_" + i + "'>" + x.ItemCode + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_uom_" + i + "'>" + x.UoMEntry + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_price_" + i + "'>" + x.UPrice + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_discountper_" + i + "'>" + x.DiscountPer + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_discountamt_" + i + "'>" + x.DiscountAmt + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_net_price_" + i + "'>" + x.NetPrice + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_price_af_dis_" + i + "'>" + x.PriceAftDisc + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_linetotal_" + i + "'>" + x.LineTotal + "</td>";
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
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term1_" + i + "'>" + x.Term1 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term2_" + i + "'>" + x.Term2 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term3_" + i + "'>" + x.Term3 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term4_" + i + "'>" + x.Term4 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term5_" + i + "'>" + x.Term5 + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_term6_" + i + "'>" + x.Term6 + "</td>";

                tr = tr + "<td style='display:none' id='td_pop_line_filer_pr_avil_qty_" + i + "'>" + returnstringvalue(x.BalanceQuantity) + "</td>";
                tr = tr + "<td style='display:none' id='td_pop_line_filer_doc_num_" + i + "'>" + x.RefDocNum + "</td>";

                tr = tr + "</tr>";
                $("#table_popup_document_list >tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function cmd_choose_document(action) {
    if (action == "Add") {
        $('#table_summary_detail >tbody>tr').remove();
    }
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
                BaseObj: $("#td_pop_line_filer_base_obj_" + id).text(),
                UoMEntry: $("#td_pop_line_filer_uom_" + id).text(),
                WhsCode: $("#td_pop_line_filer_whs_" + id).text(),
                GlobalCode: $("#td_pop_line_filer_globalcode_" + id).text(),
                ItemBrandCode: $("#td_pop_line_filer_brand_code_" + id).text(),
                ItemBrandName: $("#td_pop_line_filer_brand_name_" + id).text(),
                ItemCode: $("#td_pop_line_filer_item_code_" + id).text(),
                UgpEntry: $("#td_pop_line_filer_ugpentry_" + id).text(),
                ItemName: $("#td_pop_line_filer_item_name_" + id).text(),
                Quantity: $("#td_pop_line_filer_pr_avil_qty_" + id).text(),
                UPrice: $("#td_pop_line_filer_price_" + id).text(),
                DiscountPer: $("#td_pop_line_filer_discountper_" + id).text(),
                DiscountAmt: $("#td_pop_line_filer_discountamt_" + id).text(),
                NetPrice: $("#td_pop_line_filer_net_price_" + id).text(),
                PriceAfDis: $("#td_pop_line_filer_price_af_dis_" + id).text(),
                LineTotal: $("#td_pop_line_filer_linetotal_" + id).text(),
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
                Term1: $("#td_pop_line_filer_term1_" + id).text(),
                Term2: $("#td_pop_line_filer_term2_" + id).text(),
                Term3: $("#td_pop_line_filer_term3_" + id).text(),
                Term4: $("#td_pop_line_filer_term4_" + id).text(),
                Term5: $("#td_pop_line_filer_term5_" + id).text(),
                Term6: $("#td_pop_line_filer_term6_" + id).text(),
                BaseDocNum: $("#td_pop_line_filer_doc_num_" + id).text()
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
    var Uprice = 0;
    var Term = [];
    var uomname = "";
    var itembrandname = "";
    var checkReady = 0;
    var appendIndext = 0;
    for (i = 0; i < list_distinct_item.length; i++) {
        detailrowindex = 1;
        total_sub_qty = 0;
        option = "";
        counthouse = 0;
        housename = "";
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
                if (value.ItemCode == list_distinct_item[i]) {
                    $("#table_uom_group > tbody >tr").each(function () {
                        if ($(this).find("td:eq(0)").text() == value.UgpEntry) {
                            option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                    });
                    if (housename != value.OcrCode3) {
                        counthouse++;
                        housename = value.OcrCode3;
                    }
                    total_sub_qty = total_sub_qty + parseFloat(returnstringvalue(value.Quantity));
                    var data = data + "<tr name='name_tr_detail_" + headerrowindex + "' style='display:none' id='tr_detail_" + headerrowindex + "" + detailrowindex + "'>";
                    data = data + "<td><input type='checkbox' id='checkbox_line_detail_checkbox_" + headerrowindex + "" + detailrowindex + "' name='name_line_detail_checkbox_" + headerrowindex + "'></td>";
                    data = data + "<td style='display:none' >D</td>";
                    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_detail_document(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></i></td>"
                    data = data + "<td colspan='4'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.FloorName + "'></div></td>";
                    data = data + "<td colspan='2'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";

                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='BOQ Quantity' name='name_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Quantity) + "' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ",1)'></div></td>";
                    data = data + "<td style='display:none'><div class='form-group'><select class='form-control form-control-insde' disabled name='name_line_detail_uom_" + headerrowindex + "' id='cbo_line_detail_uom_" + headerrowindex + "" + detailrowindex + "'>" + option + "</select></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_price_" + headerrowindex + "' id='txt_line_detail_price_" + headerrowindex + "" + detailrowindex + "' placeholder='Price' value='" + convert4digit(value.UPrice) + "' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ",2)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' readonly='readonly' placeholder='Last Purcahse Price' value='" + convert4digit(value.LastPurchasePrice) + "' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";

                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_dis_per_" + headerrowindex + "' id='txt_line_detail_disc_per_" + headerrowindex + "" + detailrowindex + "' placeholder='Price' value='" + convert2digit(value.DiscountPer) + "' readonly='readonly' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ",3)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_dis_amt_" + headerrowindex + "' id='txt_line_detail_disc_amt_" + headerrowindex + "" + detailrowindex + "' placeholder='Price' value='" + convert2digit(value.DiscountAmt) + "' readonly='readonly' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ",4)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_total_amount_" + headerrowindex + "' readonly='readonly' id='txt_line_detail_total_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.LineTotal) + "'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_term1_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Term1) + "' onchange='change_line_detail_term(" + headerrowindex + "" + detailrowindex + ",1)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_term2_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Term2) + "' onchange='change_line_detail_term(" + headerrowindex + "" + detailrowindex + ",2)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_term3_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Term3) + "' onchange='change_line_detail_term(" + headerrowindex + "" + detailrowindex + ",3)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_term4_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Term4) + "' onchange='change_line_detail_term(" + headerrowindex + "" + detailrowindex + ",4)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_term5_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Term5) + "' onchange='change_line_detail_term(" + headerrowindex + "" + detailrowindex + ",5)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_term6_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Term6) + "' onchange='change_line_detail_term(" + headerrowindex + "" + detailrowindex + ",6)'></div></td>";
                    data = data + "<td style='display:none' name='name_detail_net_total_price_" + headerrowindex + "' id='txt_line_detail_net_total_price_" + headerrowindex + "" + detailrowindex + "'>" + convert4digit(value.NetPrice) + "</td>";
                    data = data + "<td style='display:none' name='name_detail_price_after_disc_" + headerrowindex + "' id='txt_line_detail_price_after_dis_" + headerrowindex + "" + detailrowindex + "'>" + convert4digit(value.PriceAftDisc) + "</td>";
                    data = data + "<td style='display:none'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_detail_term7_" + headerrowindex + "" + detailrowindex + "' value='0.00'></div></td>";
                    data = data + "<td style='display:none'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_detail_term8_" + headerrowindex + "" + detailrowindex + "' value='0.00'></div></td>";
                    data = data + "<td style='display:none'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_detail_term9_" + headerrowindex + "" + detailrowindex + "' value='0.00'></div></td>";
                    data = data + "<td style='display:none'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_detail_term10_" + headerrowindex + "" + detailrowindex + "' value='0.00'></div></td>";

                    data = data + "<td style='display:none'><div class='form-group'><select class='form-control form-control-insde' name='name_line_detail_whs_" + headerrowindex + "' id='cbo_line_detail_whs_" + headerrowindex + "" + detailrowindex + "'>" + whs + "</select></div></td>";
                    data = data + "<td style='display:none'>" + value.MainWorkName + "</td>";
                    data = data + "<td style='display:none'>" + value.SubWorkName + "</td>";
                    data = data + "<td style='display:none'>" + value.FloorName + "</td>";
                    data = data + "<td style='display:none' id='line_detail_base_entry_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseEntry + "</td>";
                    data = data + "<td style='display:none' id='line_detail_base_line_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseLine + "</td>";
                    data = data + "<td style='display:none' id='line_detail_base_obj_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseObj + "</td>";
                    data = data + "<td style='display:none' id='line_detail_line_num_" + headerrowindex + "" + detailrowindex + "'>-1</td>";

                    data = data + "<td style='display:none' id='line_detail_global_code_" + headerrowindex + "" + detailrowindex + "'>" + value.GlobalCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_uom_entry_" + headerrowindex + "" + detailrowindex + "'>" + value.UoMEntry + "</td>";
                    data = data + "<td style='display:none' id='line_detail_whs_code_" + headerrowindex + "" + detailrowindex + "'>" + value.WhsCode + "</td>";

                    data = data + "<td style='display:none' id='line_detail_item_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_name_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemName + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode2_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode2 + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode3_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode3 + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_main_code_" + headerrowindex + "" + detailrowindex + "'>" + value.MainworkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_sub_code_" + headerrowindex + "" + detailrowindex + "'>" + value.SubWorkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_floor_code_" + headerrowindex + "" + detailrowindex + "'>" + value.FloorWorkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_base_avil_qty_" + headerrowindex + "" + detailrowindex + "'>" + value.Quantity + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_base_doc_num_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseDocNum + "</td>";
                    data = data + "<td style='display:none' name='name_detail_item_brand_" + headerrowindex + "' id='line_detail_item_brand_" + headerrowindex + "" + detailrowindex + "'></td>";

                    data = data + "</tr>";
                    detailrowindex++;
                    itemname = value.ItemName;
                    Uprice = value.UPrice;
                    Term.push(value.Term1);
                    Term.push(value.Term2);
                    Term.push(value.Term3);
                    Term.push(value.Term4);
                    Term.push(value.Term5);
                    Term.push(value.Term6);
                    uomname = option;
                    itembrandname = value.ItemBrandName;

                    detailrowindex++;
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
            data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_summary_pq(" + headerrowindex + ")'></i></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' placeholder='Brand' id='txt_line_summary_brand_" + headerrowindex + "' onchange='change_line_summary_brand(" + headerrowindex + ")' ></div></td>";
            data = data + "<td colspan='3'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_item_name_" + headerrowindex + "' readonly='readonly' ></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_noofhouse_" + headerrowindex + "' value='0' readonly='readonly'  ></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_qty_" + headerrowindex + "' placeholder='Quantity' value='0.00' onchange='change_line_summary(" + headerrowindex + ",1)' ></div></td>";
            data = data + "<td style='display:none'><div class='form-group'><select class='form-control form-control-insde header-color' id='cbo_line_summary_uom_" + headerrowindex + "' onchange='change_line_summary(" + headerrowindex + ",8)'>" + option + "</select></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_price_" + headerrowindex + "' value='0.0000' onchange='change_line_summary(" + headerrowindex + ",2)' ></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_last_pur_" + headerrowindex + "' value='0.0000' readonly='readonly' ></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_dis_per_" + headerrowindex + "' value='0.00' onchange='change_line_summary(" + headerrowindex + ",3)'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_dis_amt_" + headerrowindex + "' value='0.00' onchange='change_line_summary(" + headerrowindex + ",4)'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_total_" + headerrowindex + "' value='0.00' readonly='readonly'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_term1_" + headerrowindex + "' value='0.00' onchange='change_line_summary_term(" + headerrowindex + ",1)'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_term2_" + headerrowindex + "' value='0.00' onchange='change_line_summary_term(" + headerrowindex + ",2)'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_term3_" + headerrowindex + "' value='0.00' onchange='change_line_summary_term(" + headerrowindex + ",3)'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_term4_" + headerrowindex + "' value='0.00' onchange='change_line_summary_term(" + headerrowindex + ",4)'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_term5_" + headerrowindex + "' value='0.00' onchange='change_line_summary_term(" + headerrowindex + ",5)'></div></td>";
            data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_term6_" + headerrowindex + "' value='0.00' onchange='change_line_summary_term(" + headerrowindex + ",6)'></div></td>";
            data = data + "<td style='display:none'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_term7_" + headerrowindex + "' value='0.00'></div></td>";
            data = data + "<td style='display:none'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_term8_" + headerrowindex + "' value='0.00'></div></td>";
            data = data + "<td style='display:none'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_term9_" + headerrowindex + "' value='0.00'></div></td>";
            data = data + "<td style='display:none'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_summary_term10_" + headerrowindex + "' value='0.00'></div></td>";
            data = data + "<td style='display:none' id='txt_line_summary_price_after_discount_" + headerrowindex + "'>0</td>";
            data = data + "<td style='display:none' id='txt_line_summary_vat_" + headerrowindex + "'>0</td>";
            data = data + "<td style='display:none' id='txt_line_summary_item_code_" + headerrowindex + "'>" + list_distinct_item[i] + "</td>";
            data = data + "<td style='display:none' id='txt_line_summary_line_num_" + headerrowindex + "'>-1</td>";
            data = data + "</tr>";
            $.each(list_selected_item, function (key, value) {
                option = "";
                if (value.ItemCode == list_distinct_item[i]) {

                    $("#table_uom_group > tbody >tr").each(function () {
                        if ($(this).find("td:eq(0)").text() == value.UgpEntry) {
                            option = option + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                        }
                    });
                    if (housename != value.OcrCode3) {
                        counthouse++;
                        housename = value.OcrCode3;
                    }
                    total_sub_qty = total_sub_qty + parseFloat(returnstringvalue(value.Quantity));
                    data = data + "<tr name='name_tr_detail_" + headerrowindex + "' style='display:none' id='tr_detail_" + headerrowindex + "" + detailrowindex + "'>";
                    data = data + "<td><input type='checkbox' id='checkbox_line_detail_checkbox_" + headerrowindex + "" + detailrowindex + "' name='name_line_detail_checkbox_" + headerrowindex + "'></td>";
                    data = data + "<td style='display:none' >D</td>";
                    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_detail_document(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></i></td>"
                    data = data + "<td colspan='4'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.FloorName + "'></div></td>";
                    data = data + "<td colspan='2'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='House Name' readonly='readonly' value='" + value.OcrCode3Name + "'></div></td>";

                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' placeholder='BOQ Quantity' name='name_detail_qty_" + headerrowindex + "' id='txt_line_detail_qty_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Quantity) + "' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ",1)'></div></td>";
                    data = data + "<td style='display:none'><div class='form-group'><select class='form-control form-control-insde' disabled name='name_line_detail_uom_" + headerrowindex + "' id='cbo_line_detail_uom_" + headerrowindex + "" + detailrowindex + "'>" + option + "</select></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_price_" + headerrowindex + "' id='txt_line_detail_price_" + headerrowindex + "" + detailrowindex + "' placeholder='Price' value='" + convert4digit(value.UPrice) + "' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ",2)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' readonly='readonly' placeholder='Last Purcahse Price' value='" + convert4digit(value.LastPurchasePrice) + "' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ")'></div></td>";

                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_dis_per_" + headerrowindex + "' id='txt_line_detail_disc_per_" + headerrowindex + "" + detailrowindex + "' placeholder='Price' value='" + convert2digit(value.DiscountPer) + "' readonly='readonly' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ",3)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_dis_amt_" + headerrowindex + "' id='txt_line_detail_disc_amt_" + headerrowindex + "" + detailrowindex + "' placeholder='Price' value='" + convert2digit(value.DiscountAmt) + "' readonly='readonly' onchange='change_line_detail(" + headerrowindex + "" + detailrowindex + "," + headerrowindex + ",4)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' name='name_detail_total_amount_" + headerrowindex + "' readonly='readonly' id='txt_line_detail_total_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.LineTotal) + "'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_term1_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Term1) + "' onchange='change_line_detail_term(" + headerrowindex + "" + detailrowindex + ",1)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_term2_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Term2) + "' onchange='change_line_detail_term(" + headerrowindex + "" + detailrowindex + ",2)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_term3_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Term3) + "' onchange='change_line_detail_term(" + headerrowindex + "" + detailrowindex + ",3)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_term4_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Term4) + "' onchange='change_line_detail_term(" + headerrowindex + "" + detailrowindex + ",4)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_term5_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Term5) + "' onchange='change_line_detail_term(" + headerrowindex + "" + detailrowindex + ",5)'></div></td>";
                    data = data + "<td><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde' id='txt_line_detail_term6_" + headerrowindex + "" + detailrowindex + "' value='" + convert2digit(value.Term6) + "' onchange='change_line_detail_term(" + headerrowindex + "" + detailrowindex + ",6)'></div></td>";
                    data = data + "<td style='display:none' name='name_detail_net_total_price_" + headerrowindex + "' id='txt_line_detail_net_total_price_" + headerrowindex + "" + detailrowindex + "'>" + convert4digit(value.NetPrice) + "</td>";
                    data = data + "<td style='display:none' name='name_detail_price_after_disc_" + headerrowindex + "' id='txt_line_detail_price_after_dis_" + headerrowindex + "" + detailrowindex + "'>" + convert4digit(value.PriceAftDisc) + "</td>";
                    data = data + "<td style='display:none'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_detail_term7_" + headerrowindex + "" + detailrowindex + "' value='0.00'></div></td>";
                    data = data + "<td style='display:none'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_detail_term8_" + headerrowindex + "" + detailrowindex + "' value='0.00'></div></td>";
                    data = data + "<td style='display:none'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_detail_term9_" + headerrowindex + "" + detailrowindex + "' value='0.00'></div></td>";
                    data = data + "<td style='display:none'><div class='form-group'><input type='text' style='text-align:right' class='form-control form-control-insde header-color' id='txt_line_detail_term10_" + headerrowindex + "" + detailrowindex + "' value='0.00'></div></td>";

                    data = data + "<td style='display:none'><div class='form-group'><select class='form-control form-control-insde' name='name_line_detail_whs_" + headerrowindex + "' id='cbo_line_detail_whs_" + headerrowindex + "" + detailrowindex + "'>" + whs + "</select></div></td>";
                    data = data + "<td style='display:none'>" + value.MainWorkName + "</td>";
                    data = data + "<td style='display:none'>" + value.SubWorkName + "</td>";
                    data = data + "<td style='display:none'>" + value.FloorName + "</td>";
                    data = data + "<td style='display:none' id='line_detail_base_entry_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseEntry + "</td>";
                    data = data + "<td style='display:none' id='line_detail_base_line_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseLine + "</td>";
                    data = data + "<td style='display:none' id='line_detail_base_obj_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseObj + "</td>";
                    data = data + "<td style='display:none' id='line_detail_line_num_" + headerrowindex + "" + detailrowindex + "'>-1</td>";

                    data = data + "<td style='display:none' id='line_detail_global_code_" + headerrowindex + "" + detailrowindex + "'>" + value.GlobalCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_uom_entry_" + headerrowindex + "" + detailrowindex + "'>" + value.UoMEntry + "</td>";
                    data = data + "<td style='display:none' id='line_detail_whs_code_" + headerrowindex + "" + detailrowindex + "'>" + value.WhsCode + "</td>";

                    data = data + "<td style='display:none' id='line_detail_item_code_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_name_" + headerrowindex + "" + detailrowindex + "'>" + value.ItemName + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode2_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode2 + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_ocrcode3_" + headerrowindex + "" + detailrowindex + "'>" + value.OcrCode3 + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_main_code_" + headerrowindex + "" + detailrowindex + "'>" + value.MainworkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_sub_code_" + headerrowindex + "" + detailrowindex + "'>" + value.SubWorkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_floor_code_" + headerrowindex + "" + detailrowindex + "'>" + value.FloorWorkCode + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_base_avil_qty_" + headerrowindex + "" + detailrowindex + "'>" + value.Quantity + "</td>";
                    data = data + "<td style='display:none' id='line_detail_item_base_doc_num_" + headerrowindex + "" + detailrowindex + "'>" + value.BaseDocNum + "</td>";
                    data = data + "<td style='display:none' name='name_detail_item_brand_" + headerrowindex + "' id='line_detail_item_brand_" + headerrowindex + "" + detailrowindex + "'></td>";

                    data = data + "</tr>";
                    detailrowindex++;
                    itemname = value.ItemName;
                    Uprice = value.UPrice;
                    Term.push(value.Term1);
                    Term.push(value.Term2);
                    Term.push(value.Term3);
                    Term.push(value.Term4);
                    Term.push(value.Term5);
                    Term.push(value.Term6);
                    uomname = option;
                    itembrandname = value.ItemBrandName;
                }
            });
            $("#table_summary_detail >tbody").append(data);
            $("#txt_line_summary_item_name_" + headerrowindex).val(itemname);
            $("#txt_line_summary_qty_" + headerrowindex).val(convert2digit(total_sub_qty));
            $("#txt_line_summary_price_" + headerrowindex).val(convert4digit(Uprice));
            $("#txt_line_summary_term1_" + headerrowindex).val(convert2digit(Term[0]));
            $("#txt_line_summary_term2_" + headerrowindex).val(convert2digit(Term[1]));
            $("#txt_line_summary_term3_" + headerrowindex).val(convert2digit(Term[2]));
            $("#txt_line_summary_term4_" + headerrowindex).val(convert2digit(Term[3]));
            $("#txt_line_summary_term5_" + headerrowindex).val(convert2digit(Term[4]));
            $("#txt_line_summary_term6_" + headerrowindex).val(convert2digit(Term[5]));
            $("#cbo_line_summary_uom_" + headerrowindex).append(uomname);
            $("#txt_line_summary_noofhouse_" + headerrowindex).val(counthouse);
            headerrowindex++;
        }
    }
    $("#modal_document").modal('hide');
    $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
        var index = $(this).attr('id').replace("td_summary_", "");
        if ($("#td_summary_is_Sumamry_" + index).text() == "Header") {
            update_summary_after_change_detail(index);
        }
    });
    sum_sub_summary_detail();
}


//Save Data
function cmd_save_summary_detail(type,boqtype) {
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
    var summaryid;
    var summary_index = 0;
    var detail_index = 0;
    $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
        var sum_term_summary = 0;
        var sum_term_detail = 0;
        if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text() == "S") {
            summary_index++;
            summaryid = $(this).attr('id').replace("td_summary_", "");
            sum_term_summary = parseFloat(returnstringvalue($("#txt_line_summary_term1_" + summaryid).val())) +
                parseFloat(returnstringvalue($("#txt_line_summary_term2_" + summaryid).val())) +
                parseFloat(returnstringvalue($("#txt_line_summary_term3_" + summaryid).val())) +
                parseFloat(returnstringvalue($("#txt_line_summary_term4_" + summaryid).val())) +
                parseFloat(returnstringvalue($("#txt_line_summary_term5_" + summaryid).val())) +
                parseFloat(returnstringvalue($("#txt_line_summary_term6_" + summaryid).val()));
            if (parseFloat(sum_term_summary) < 100) {
                allow = 10;
                return false;
            }
        }
        else {
            var detailid = $(this).attr('id').replace("tr_detail_", "");
            detail_index++;
            sum_term_detail = parseFloat(returnstringvalue($("#txt_line_detail_term1_" + detailid).val())) +
                parseFloat(returnstringvalue($("#txt_line_detail_term2_" + detailid).val())) +
                parseFloat(returnstringvalue($("#txt_line_detail_term3_" + detailid).val())) +
                parseFloat(returnstringvalue($("#txt_line_detail_term4_" + detailid).val())) +
                parseFloat(returnstringvalue($("#txt_line_detail_term5_" + detailid).val())) +
                parseFloat(returnstringvalue($("#txt_line_detail_term6_" + detailid).val()));
            if (parseFloat(sum_term_detail) < 100) {
                allow = 11;
                return false;
            }
        }
    });
    if (allow == 10) {
        ShowAlert("Term Summary is not equal 100% at [" + summary_index + "]");
    }
    if (allow == 11) {
        ShowAlert("Term Detail is not equal 100% at [" + detail_index + "]");
    }
    if (allow == 0) {
        $('#tbl_Remove_List > tbody  > tr').each(function (i, t) {
            var del = {
                DocEntry: $("#txt_dockey").val(),
                PQHLineNum: $("#HeadLine_" + i).text(),
                LineNum: $("#DetailLine_" + i).text()
            };
            del_list.push(del);
        });

        var docdate = $('#txt_posting_date').val().trim().split("-");
        var reqdate = $('#txt_due_date').val().trim().split("-");
        var head = {
            DocEntry: $("#txt_dockey").val(),
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
            TaxGroup: $("#cbo_tax_group").val(),
            CreatedBy: $("#txt_shared_userid").val(),
            OcrCode: $("#cbo_ocrcode").val(),
            Memo: $("#txt_remark").val(),
            PRNum: $("#txt_pr_ref").val(),
            IsBOQ: type,
            BOQType: boqtype
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
                    Quantity: returnstringvalue($("#txt_line_summary_qty_" + summaryid).val()),
                    UPrice: returnstringvalue($("#txt_line_summary_price_" + summaryid).val()),
                    PriceAftDisc: returnstringvalue($("#txt_line_summary_price_after_discount_" + summaryid).val()),
                    DisPer: returnstringvalue($("#txt_line_summary_dis_per_" + summaryid).val()),
                    DisAmount: returnstringvalue($("#txt_line_summary_dis_amt_" + summaryid).val()),
                    LineTotal: returnstringvalue($("#txt_line_summary_total_" + summaryid).val()),
                    Term1: returnstringvalue($("#txt_line_summary_term1_" + summaryid).val()),
                    Term2: returnstringvalue($("#txt_line_summary_term2_" + summaryid).val()),
                    Term3: returnstringvalue($("#txt_line_summary_term3_" + summaryid).val()),
                    Term4: returnstringvalue($("#txt_line_summary_term4_" + summaryid).val()),
                    Term5: returnstringvalue($("#txt_line_summary_term5_" + summaryid).val()),
                    Term6: returnstringvalue($("#txt_line_summary_term6_" + summaryid).val()),
                    Brand: $("#txt_line_summary_brand_" + summaryid).val()
                };
                summary_list.push(summary);
            }
            else {
                var detailid = $(this).attr('id').replace("tr_detail_", "");
                var detail = {
                    LineNum: $("#line_detail_line_num_" + detailid).text(),
                    PQHLineNum: summaryid,
                    BaseEntry: $("#line_detail_base_entry_" + detailid).text(),
                    BaseLine: $("#line_detail_base_line_" + detailid).text(),
                    BaseType: $("#line_detail_base_obj_" + detailid).text(),
                    ItemCode: $("#line_detail_item_code_" + detailid).text(),
                    ItemName: $("#line_detail_item_name_" + detailid).text(),
                    Quantity: returnstringvalue($("#txt_line_detail_qty_" + detailid).val()),
                    ApplyQuantity: "0.00",
                    UoMEntry: $("#line_detail_uom_entry_" + detailid).text(),
                    UPrice: returnstringvalue($("#txt_line_detail_price_" + detailid).val()),
                    DiscountPer: returnstringvalue($("#txt_line_detail_disc_per_" + detailid).val()),
                    DiscountAmt: returnstringvalue($("#txt_line_detail_disc_amt_" + detailid).val()),
                    LineTotal: returnstringvalue($("#txt_line_detail_total_" + detailid).val()),
                    WhsCode: $("#line_detail_whs_code_" + detailid).text(),
                    OcrCode: $("#cbo_ocrcode").val(),
                    OcrCode2: $("#line_detail_item_ocrcode2_" + detailid).text(),
                    OcrCode3: $("#line_detail_item_ocrcode3_" + detailid).text(),
                    MainworkCode: $("#line_detail_item_main_code_" + detailid).text(),
                    SubWorkCode: $("#line_detail_item_sub_code_" + detailid).text(),
                    FloorWorkCode: $("#line_detail_item_floor_code_" + detailid).text(),
                    GlobalCode: $("#line_detail_global_code_" + detailid).text(),
                    Term1: returnstringvalue($("#txt_line_detail_term1_" + detailid).val()),
                    Term2: returnstringvalue($("#txt_line_detail_term2_" + detailid).val()),
                    Term3: returnstringvalue($("#txt_line_detail_term3_" + detailid).val()),
                    Term4: returnstringvalue($("#txt_line_detail_term4_" + detailid).val()),
                    Term5: returnstringvalue($("#txt_line_detail_term5_" + detailid).val()),
                    Term6: returnstringvalue($("#txt_line_detail_term6_" + detailid).val()),
                    NetPrice: returnstringvalue($("#txt_line_detail_net_total_price_" + detailid).text()),
                    PriceAftDisc: returnstringvalue($("#txt_line_detail_price_after_dis_" + detailid).text()),
                    BaseDocNum: $("#line_detail_item_base_doc_num_" + detailid).text(),
                    Brand: $("#line_detail_item_brand_" + detailid).text()
                };
                detail_list.push(detail);
            }
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/purpq/cmd_save_summary_detail',
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
                    ShowAlert("Purchase Quotation was saved");
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
//PO
function cmd_save_po_summary_detail(type, boqtype) {
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
    var summaryid;
    var summary_index = 0;
    var detail_index = 0;
    $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
        var sum_term_summary = 0;
        var sum_term_detail = 0;
        if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text() == "S") {
            summary_index++;
            summaryid = $(this).attr('id').replace("td_summary_", "");
            sum_term_summary = parseFloat(returnstringvalue($("#txt_line_summary_term1_" + summaryid).val())) +
                parseFloat(returnstringvalue($("#txt_line_summary_term2_" + summaryid).val())) +
                parseFloat(returnstringvalue($("#txt_line_summary_term3_" + summaryid).val())) +
                parseFloat(returnstringvalue($("#txt_line_summary_term4_" + summaryid).val())) +
                parseFloat(returnstringvalue($("#txt_line_summary_term5_" + summaryid).val())) +
                parseFloat(returnstringvalue($("#txt_line_summary_term6_" + summaryid).val()));
            if (parseFloat(sum_term_summary) < 100) {
                allow = 10;
                return false;
            }
        }
        else {
            var detailid = $(this).attr('id').replace("tr_detail_", "");
            detail_index++;
            sum_term_detail = parseFloat(returnstringvalue($("#txt_line_detail_term1_" + detailid).val())) +
                parseFloat(returnstringvalue($("#txt_line_detail_term2_" + detailid).val())) +
                parseFloat(returnstringvalue($("#txt_line_detail_term3_" + detailid).val())) +
                parseFloat(returnstringvalue($("#txt_line_detail_term4_" + detailid).val())) +
                parseFloat(returnstringvalue($("#txt_line_detail_term5_" + detailid).val())) +
                parseFloat(returnstringvalue($("#txt_line_detail_term6_" + detailid).val()));
            if (parseFloat(sum_term_detail) < 100) {
                allow = 11;
                return false;
            }
        }
    });
    if (allow == 10) {
        ShowAlert("Term Summary is not equal 100% at [" + summary_index + "]");
    }
    if (allow == 11) {
        ShowAlert("Term Detail is not equal 100% at [" + detail_index + "]");
    }
    if (allow == 0) {
        $('#tbl_Remove_List > tbody  > tr').each(function (i, t) {
            var del = {
                DocEntry: $("#txt_dockey").val(),
                POHLineNum: $("#HeadLine_" + i).text(),
                LineNum: $("#DetailLine_" + i).text()
            };
            del_list.push(del);
        });
        var docdate = $('#txt_posting_date').val().trim().split("-");
        var reqdate = $('#txt_due_date').val().trim().split("-");
        var head = {
            DocEntry: $("#txt_dockey").val(),
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
            TaxGroup: $("#cbo_tax_group").val(),
            CreatedBy: $("#txt_shared_userid").val(),
            OcrCode: $("#cbo_ocrcode").val(),
            Memo: $("#txt_remark").val(),
            PRNum: $("#txt_pr_ref").val(),
            IsBOQ: type,
            BOQType: boqtype
        };
        $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
            if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text() == "S") {
                summaryid = $(this).attr('id').replace("td_summary_", "");
                var summary = {
                    LineNum: summaryid,
                    Brand: $("#txt_line_summary_brand_" + summaryid).text(),
                    ItemCode: $("#txt_line_summary_item_code_" + summaryid).text(),
                    ItemName: $("#txt_line_summary_item_name_" + summaryid).val(),
                    NoofHouse: $("#txt_line_summary_noofhouse_" + summaryid).val(),
                    Quantity: returnstringvalue($("#txt_line_summary_qty_" + summaryid).val()),
                    UPrice: returnstringvalue($("#txt_line_summary_price_" + summaryid).val()),
                    PriceAftDisc: returnstringvalue($("#txt_line_summary_price_after_discount_" + summaryid).text()),
                    DisPer: returnstringvalue($("#txt_line_summary_dis_per_" + summaryid).val()),
                    DisAmount: returnstringvalue($("#txt_line_summary_dis_amt_" + summaryid).val()),
                    LineTotal: returnstringvalue($("#txt_line_summary_total_" + summaryid).val()),
                    Term1: returnstringvalue($("#txt_line_summary_term1_" + summaryid).val()),
                    Term2: returnstringvalue($("#txt_line_summary_term2_" + summaryid).val()),
                    Term3: returnstringvalue($("#txt_line_summary_term3_" + summaryid).val()),
                    Term4: returnstringvalue($("#txt_line_summary_term4_" + summaryid).val()),
                    Term5: returnstringvalue($("#txt_line_summary_term5_" + summaryid).val()),
                    Term6: returnstringvalue($("#txt_line_summary_term6_" + summaryid).val()),
                    Brand: $("#txt_line_summary_brand_" + summaryid).val()
                };
                summary_list.push(summary);
            }
            else {
                var detailid = $(this).attr('id').replace("tr_detail_", "");
                var detail = {
                    LineNum: $("#line_detail_line_num_" + detailid).text(),
                    POHLineNum: summaryid,
                    BaseEntry: $("#line_detail_base_entry_" + detailid).text(),
                    BaseLine: $("#line_detail_base_line_" + detailid).text(),
                    BaseType: $("#line_detail_base_obj_" + detailid).text(),
                    ItemCode: $("#line_detail_item_code_" + detailid).text(),
                    ItemName: $("#line_detail_item_name_" + detailid).text(),
                    Quantity: returnstringvalue($("#txt_line_detail_qty_" + detailid).val()),
                    ApplyQuantity: "0.00",
                    UoMEntry: $("#line_detail_uom_entry_" + detailid).text(),
                    UPrice: returnstringvalue($("#txt_line_detail_price_" + detailid).val()),
                    DiscountPer: returnstringvalue($("#txt_line_detail_disc_per_" + detailid).val()),
                    DiscountAmt: returnstringvalue($("#txt_line_detail_disc_amt_" + detailid).val()),
                    LineTotal: returnstringvalue($("#txt_line_detail_total_" + detailid).val()),
                    WhsCode: $("#line_detail_whs_code_" + detailid).text(),
                    OcrCode: $("#cbo_ocrcode").val(),
                    OcrCode2: $("#line_detail_item_ocrcode2_" + detailid).text(),
                    OcrCode3: $("#line_detail_item_ocrcode3_" + detailid).text(),
                    MainworkCode: $("#line_detail_item_main_code_" + detailid).text(),
                    SubWorkCode: $("#line_detail_item_sub_code_" + detailid).text(),
                    FloorWorkCode: $("#line_detail_item_floor_code_" + detailid).text(),
                    GlobalCode: $("#line_detail_global_code_" + detailid).text(),
                    Term1: returnstringvalue($("#txt_line_detail_term1_" + detailid).val()),
                    Term2: returnstringvalue($("#txt_line_detail_term2_" + detailid).val()),
                    Term3: returnstringvalue($("#txt_line_detail_term3_" + detailid).val()),
                    Term4: returnstringvalue($("#txt_line_detail_term4_" + detailid).val()),
                    Term5: returnstringvalue($("#txt_line_detail_term5_" + detailid).val()),
                    Term6: returnstringvalue($("#txt_line_detail_term6_" + detailid).val()),
                    NetPrice: returnstringvalue($("#txt_line_detail_net_total_price_" + detailid).text().trim()),
                    PriceAftDisc: returnstringvalue($("#txt_line_detail_price_after_dis_" + detailid).text().trim()),
                    BaseDocNum: $("#line_detail_item_base_doc_num_" + detailid).text(),
                    Brand: $("#line_detail_item_brand_" + detailid).text()
                };
                detail_list.push(detail);
            }
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/purpo/cmd_save_summary_detail',
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
                    } else
                        if (data.status == "400") {
                            ShowAlert("Not found BOQ information for PR input");
                        } else
                            if (data.status == "500") {
                                ShowAlert("This Purchase Request No already integrated to SAP");
                            } else {
                                alert(data.Message);
                            }
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}