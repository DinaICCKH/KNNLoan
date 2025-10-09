
function cmd_line_change_house_show_detail(summaryid) {
    var detail = "name_tr_detail_" + summaryid;
    if ($("#td_is_summary_" + summaryid).text() == "H") {
        $("[name=" + detail + "]").show();
        $("#td_is_summary_" + summaryid).text("S");
    }
    else {
        $("[name=" + detail + "]").hide();
        $("#td_is_summary_" + summaryid).text("H");
    }
} 
function get_sales_change_price() {
    var pro = $("#cbo_sales_holdunit_project").val();
    var block = $("#cbo_sales_holdunit_block").val();
    var housecode = $("#txt_sales_holdunit_house_no").val();
    var subitemgroup = $("#cbo_sales_sub_item_group").val();
    var houseother = $("#cbo_sales_house_other").val();

    $.ajax({
        url: '/getDataSales/get_availabl_house_change_price',
        type: 'POST',
        data: { procode: pro, block: block, housecode: housecode, subitemgroup: subitemgroup, houseother: houseother },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (dt) {
            var list_item = [];

            $("#table_sales_change_price >tbody>tr").remove();
            for (i = 0; i < dt.data.length; i++) {
                var x = dt.data[i];
                list_item.push(x.U_SubGroup);
            }
            var list_distinct_item = list_item.filter(function (item, i, list_item) {
                return i == list_item.indexOf(item);
            });

            var headerrowindex = 0;

            var detailrowindex = 0;
            var subgroupname = "";
            for (i = 0; i < list_distinct_item.length; i++) {
                headerrowindex = i;
                detailrowindex = 1;
                var data = "<tr id='td_summary_" + headerrowindex + "' class='header-color'>";
                data = data + "<td id='td_summary_is_Sumamry_" + headerrowindex + "' style='display:none'>Header</td>";
                data = data + "<td style='display:none' id='td_is_summary_" + headerrowindex + "'>H</td>";
                data = data + "<td><i class='fa fa-circle text-danger' style='cursor:pointer;' id='td_summary_check_all_" + headerrowindex + "' onclick='check_document_summary_detail(" + headerrowindex + ")'></i><i class='fa fa-circle text-yellow' id='td_summary_uncheck_all_" + headerrowindex + "' style='cursor:pointer; display:none' onclick='uncheck_document_summary_detail(" + headerrowindex + ")'></i></td>";
                data = data + "<td><i class='fa fa-plus text-info' onclick='cmd_line_change_house_show_detail(" + headerrowindex + ")' style='cursor:pointer'></i></td>";
                data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='tr_remove_header_line(" + headerrowindex + ")'></i></td>";
                data = data + "<td colspan='3'><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_line_summary_sub_item_group_" + headerrowindex + "' placeholder='Sub Item Group' readonly='readonly'></div></td>";
                data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde header-color' id='txt_pop_special_payment_amount_" + headerrowindex + "' value=''  readonly='readonly'></div></td>";
                data = data + "<td colspan='7'></td>";
                data = data + "</tr>";
                for (j = 0; j < dt.data.length; j++) {
                    var x = dt.data[j];
                    if (x.U_SubGroup == list_distinct_item[i]) {
                        data = data + "<tr name='name_tr_detail_" + headerrowindex + "' style='display:none' id='tr_pr_detail_" + headerrowindex + "" + detailrowindex + "'>";
                        data = data + "<td><input type='checkbox'  style='cursor:pointer' id='checkbox_line_detail_checkbox_" + headerrowindex + "" + detailrowindex + "' name='name_line_detail_checkbox_" + headerrowindex + "'></td>";
                        data = data + "<td style='display:none'>D</td>";
                        data = data + "<td></td>";
                        data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='tr_remove_detail_line(" + headerrowindex + "," + detailrowindex + ")'></i></td>"
                        data = data + "<td>" + x.HouseCode + "</td>";
                        data = data + "<td>" + x.ItemName + "</td>";
                        data = data + "<td id='tr_price_change_old_price_" + headerrowindex + "" + detailrowindex + "'>" + convert2digit(x.HouseAmount) + "</td>";
                        data = data + "<td><div class='form-group'><input type='text' class='form-control form-control-insde' id='tr_price_change_new_price_" + headerrowindex + "" + detailrowindex + "' onchange='txt_new_price_change(" + headerrowindex + "," + detailrowindex + ")' value='0.00'></div></td>";
                        data = data + "<td><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' id='tr_price_change_lastupdate_" + headerrowindex + "" + detailrowindex + "' readonly='readonly' placeholder='Last Date' value='" + x.UpdatedDate +"' disabled></div></div></td>";
                        data = data + "<td><div class='input-group date'><div class='input-group-addon'><i class='fa fa-calendar'></i></div><input type='text' class='form-control pull-right datetime form-control-insde' id='tr_price_change_aff_date_" + headerrowindex + "" + detailrowindex + "' readonly='readonly' placeholder='Effective Date' value='" + x.currentDate+"'></div></div></td>";
                        data = data + "<td>" + x.OtherName + "</td>";
                        data = data + "<td>" + x.Project + "</td>";
                        data = data + "<td>" + x.ZoneName + "</td>";
                        data = data + "<td>" + x.U_Street + "</td>";
                        data = data + "<td>" + x.HouseNo + "</td>";
                        data = data + "<td style='display:none;' id='tr_price_change_itemcode_" + headerrowindex + "" + detailrowindex + "'>" + x.ItemCode + "</td>";
                        data = data + "</tr>";
                        subgroupname = x.SubGroupName;
                    }
                    detailrowindex++;
                }
                $("#table_sales_change_price >tbody").append(data);
                $("#txt_line_summary_sub_item_group_" + i).val(subgroupname);
                $('.datetime').datepicker({
                    autoclose: true,
                    format: 'd-M-yyyy'
                });
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}

function tr_remove_detail_line(headIndex, detailIndex) {
    $("#tr_pr_detail_" + headIndex + "" + detailIndex).remove();
}
function tr_remove_header_line(headIndex) {
    $("#td_summary_" + headIndex).remove();
    $("[name=name_tr_detail_" + headIndex + "]").remove();
}
function cmd_remove_all_checked_rows() {
    $("#table_sales_change_price > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("checkbox_line_detail_checkbox_", "");
            $("#tr_pr_detail_" + id).remove();
        }
    });
}
function txt_new_price_change(headIndex, detailIndex) {
    var new_price = returnstringvalue($("#tr_price_change_new_price_" + headIndex + "" + detailIndex).val());
    $("#tr_price_change_new_price_" + headIndex + "" + detailIndex).val(convert2digit(new_price));
}
function cmd_save_change_price() {
    if ($("#table_sales_change_price > tbody  > tr").length <= 0) {
        ShowAlert("No data to save!");
    } else {
        var pr_list = [];
        $("#table_sales_change_price > tbody  > tr").each(function () {
            if ($(this).find("td:eq(1)").text() == "D") {
                var detailIndex = this.id.replace("tr_pr_detail_", "");
                if (returnstringvalue($("#tr_price_change_new_price_" + detailIndex).val().trim()) > 0) {
                    var docdate = $('#tr_price_change_aff_date_' + detailIndex).val().trim().split("-");
                    var pr_Ch = {
                        DocEntry: '-1',
                        ItemCode: $("#tr_price_change_itemcode_" + detailIndex).text().trim(),
                        OldPrice: returnstringvalue($("#tr_price_change_old_price_" + detailIndex).text().trim()),
                        NewPrice: returnstringvalue($("#tr_price_change_new_price_" + detailIndex).val().trim()),
                        StartFrom: docdate[2] + "/" + docdate[1] + "/" + docdate[0],
                        UpdatedBy: $("#txt_shared_userid").val(),
                        DocStatus: "Approved",
                    }
                    pr_list.push(pr_Ch);
                }
            }
        });
        if (pr_list.length == 0) {
            ShowAlert("No price of Item updated!");
        } else {
            $.ajax({
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                type: 'POST',
                url: '/amendments/save_change_price',
                data: JSON.stringify(
                    {
                        'pr_List': pr_list
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
                        ShowAlert("Price of Item was saved");
                    } else {
                        ShowAlert("Error while saving updated!");
                    }
                },
                failure: function (response) {
                    $('#result').html(response);
                }
            });
        }
    }
}
