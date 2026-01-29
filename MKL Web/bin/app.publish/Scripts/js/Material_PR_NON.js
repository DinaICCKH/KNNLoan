
function change_line_pr(rowindex) {
    var qty = $("#txt_line_qty_" + rowindex).val();
    $("#txt_line_qty_" + rowindex).val(convert2digit(qty));
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
                tr = tr + "<td><div class='form-group'><input type ='text' style='text-align:center' class='form-control form-control-inside' id='txt_line_qty_" + rowindex + "' placeholder = 'Qty' value='0.00' onchange='change_line_pr(" + rowindex + ")'></div></td>";
                tr = tr + "<td><div class='form-group'><select class='form-control' id='cbo_line_uom_" + rowindex + "'>" + option + "</select></div></td>";
                tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_price_" + rowindex + "' placeholder = 'Price' value='0.0000' onchange='change_line(" + rowindex + ")'></div></td>";
                tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_dis_per_" + rowindex + "' placeholder = 'Dis%' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
                tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_dis_amt_" + rowindex + "' placeholder = 'Dis Amt' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
                tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_line_total_" + rowindex + "' placeholder = 'Total' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
                
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
    //cmd_pr_filter_pop_boq_check_all();
}
function AddBlank() {
    var whs = "";
    var rowindex = "999";
    $("#table_whs > tbody >tr").each(function () {
        if ($("#cbo_ocrcode").val() == $(this).find("td:eq(4)").text()) {
            whs = whs + "<option value='" + $(this).find("td:eq(0)").text() + "'>" + $(this).find("td:eq(1)").text() + "</option>";
        }
    });
    tr = "<tr id='tr_line_" + rowindex + "'>";
    tr = tr + "<td></td>";
    tr = tr + "<td></td>";
    tr = tr + "<td><div class='input-group'><input type='text' class='form-control noborder' id='txt_line_itemname_" + rowindex + "' placeholder='Description' ><div class='input-group-addon'><i class='fa fa-industry text-info' onclick='cmd_show_Item_list(" + rowindex + ")' style='cursor:pointer'></i></div></div></td >";
    tr = tr + "<td><div class='form-group'><input type ='text' style='text-align:center' class='form-control form-control-inside' id='txt_line_qty_" + rowindex + "' placeholder = 'Qty' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td><div class='form-group'><select class='form-control' name='uom'></select></div></td>";
    tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_qty_" + rowindex + "' placeholder = 'Price' value='0.0000' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_qty_" + rowindex + "' placeholder = 'Dis%' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_qty_" + rowindex + "' placeholder = 'Dis Amt' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' class='form-control form-control-inside' id='txt_line_qty_" + rowindex + "' placeholder = 'Total' value='0.00' onchange='change_line(" + rowindex + ")'></div></td>";
    tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' id='txt_line_ocrcode2_" + rowindex + "' onchange='get_line_house_list(" + rowindex + ")'></select></td>";
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
    tr = tr + "<td style='display:none' id='line_detail_item_whs_code_" + rowindex + "'><select class='form-control form-control-insde' disabled name='name_line_detail_item_whs_code_" + rowindex + "' id='cbo_line_detail_item_whs_code_" + rowindex + "'>" + whs + "</select></td>";
    tr = tr + "</tr >";
    $("#table_line_item>tbody").append(tr);
}

//Save Data
function cmd_save_line_item(type,mode) {

    allow = 0;
    lineno = 0;
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
    if ($("#cbo_ocrcode").val() == "" ) {
        ShowAlert("Project is required");
        allow = 1;
    }

    $('#table_line_item > tbody  > tr').each(function (index, tr) {
        var detailid = $(this).attr('id').replace("tr_line_", "");
        if (detailid != "999") {
            if (parseFloat(convert2digit($("#txt_line_qty_" + detailid).val())) == 0) {
                allow = 7;
                return false;
            }
            if ($("#txt_line_ocrcode2_" + detailid).val() == "") {
                allow = 2;
                return false;
            }
            if ($("#txt_line_ocrcode3_" + detailid).val() == "") {
                allow = 3;
                return false;
            }
            if ($("#txt_line_main_work_" + detailid).val() == "") {
                allow = 4;
                return false;
            }
            if ($("#txt_line_sub_work_" + detailid).val() == "") {
                allow = 5;
                return false;
            }
            if ($("#txt_line_pr_floor_work_" + detailid).val() == "") {
                allow = 6;
                return false;
            }
        }
    });
    if (allow == 2) {
        ShowAlert("Block is required");
    }
    if (allow == 3) {
        ShowAlert("House is required");
    }
    if (allow == 4) {
        ShowAlert("Main work is required");
    }
    if (allow == 5) {
        ShowAlert("Sub Work is required");
    }
    if (allow == 6) {
        ShowAlert("Floor Work is required");
    }
    if (allow == 7) {
        ShowAlert("Quantity cannot be zero");
    }
    if (allow == 0) {
        var docdate = $('#txt_posting_date').val().trim().split("-");
        var reqdate = $('#txt_req_date').val().trim().split("-");
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
            IsBOQ: "No",
            CreatedBy: $("#txt_shared_userid").val(),
            BOQType: type,
            OcrCode: $("#cbo_ocrcode").val(),
        };
        $('#table_line_item > tbody  > tr').each(function (index, tr) {
            var detailid = $(this).attr('id').replace("tr_line_", "");
            if (detailid != "999") {
                var detail = {
                    LineNum: $("#td_line_num_" + detailid).text(),
                    ItemCode: $("#td_line_item_code_" + detailid).text(),
                    ItemName: $("#txt_line_itemname_" + detailid).val(),
                    Quantity: returnstringvalue($("#txt_line_qty_" + detailid).val()),
                    UoMEntry: $("#cbo_line_uom_" + detailid).val(),
                    UPrice: "0.00",
                    LineTotal: "0.00",
                    WhsCode: $("#cbo_line_detail_item_whs_code_" + detailid).val(),
                    LineStatus: "Active",
                    OcrCode: $("#cbo_ocrcode").val(),
                    OcrCode2: $("#txt_line_ocrcode2_" + detailid).val(),
                    OcrCode3: $("#txt_line_ocrcode3_" + detailid).val(),
                    MainworkCode: $("#txt_line_main_work_" + detailid).val(),
                    SubWorkCode: $("#txt_line_sub_work_" + detailid).val(),
                    FloorWorkCode: $("#txt_line_pr_floor_work_" + detailid).val(),
                    GlobalCode: $("#td_line_global_code_" + detailid).text(),
                    IsBOQ: "No",
                    BOQType: type,
                    UoMName: $("#cbo_line_uom_" + detailid +" option:selected").text(),
                };
                detail_list.push(detail);
            }
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/purpr/cmd_save_pr_detail',
            data: JSON.stringify(
                {
                    'header': head,
                    'detail': detail_list,
                    'deldetail': del_list
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

