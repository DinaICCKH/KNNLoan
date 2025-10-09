
function cbo_doc_id_change() {
    if ($("#cbo_doc_id").val() == "RTT" || $("#cbo_doc_id").val() == "RTTCL") {
        $("#lbl_from_amount").text("From %");
        $("#lbl_to_amount").text("To %");
    }
    else {
        $("#lbl_from_amount").text("From Amount");
        $("#lbl_to_amount").text("To Amount");
    }
}
function check_main_work_template(mainindex) {
    if ($("#chk_" + mainindex).is(':checked') == true) {
        $('.cls_' + mainindex).prop('checked', true);
    }
    else {
        $('.cls_' + mainindex).prop('checked', false);
    }
}
function Find_User() {
    $("#table_template_user >tbody >tr").each(function (index) {
        var text = $("#td_user_" + index).text().toLowerCase();
        if (text.replace(/\s+/g, '').indexOf($("#txt_find_user").val().replace(/\s+/g, '').toLowerCase()) == -1) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}
function Find_Stage_User() {
    $("#table_popup_user_list >tbody >tr").each(function (index) {
        var text = $("#tr_user_" + index).text().toLowerCase();
        if (text.replace(/\s+/g, '').indexOf($("#txt_pop_up_search_user").val().replace(/\s+/g, '').toLowerCase()) == -1) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

function Find_Stage() {
    $("#table_popup_approval_stage_list >tbody >tr").each(function (index) {
        var text = $("#td_stage_name_" + (index + 1)).text().toLowerCase();
        if (text.replace(/\s+/g, '').indexOf($("#txt_pop_up_search_approval_stage").val().replace(/\s+/g, '').toLowerCase()) == -1) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}
function Find_Template() {
    $("#table_popup_template_list >tbody >tr").each(function (index) {
        var text = $("#td_template_name_" + (index + 1)).text().toLowerCase();
        if (text.replace(/\s+/g, '').indexOf($("#txt_pop_up_search_approval_template").val().replace(/\s+/g, '').toLowerCase()) == -1) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

function show_stage() {
    $("#modal_stage_ist").modal('show');
}
function tr_approval_stage_click(rowindex) {
    $("#table_popup_approval_stage_list > tbody > tr").each(function (index) {
        $("#tr_approval_stage_" + (index + 1)).css("background-color", "white");
    });
    $("#tr_approval_stage_" + rowindex).css("background-color", "#e6f0ff");
    $("#txt_selected_approver_stage_index").val(rowindex);
}

function cmd_choose_stage() {
    var index = $("#txt_selected_approver_stage_index").val();
    $("#txt_stage_code").val($("#td_stage_code_" + index).text());
    $("#txt_app_name").val($("#td_stage_name_" + index).text());
    $("#cbo_fn_stock").val($("#td_fn_stock_" + index).text());
    $("#cbo_ocrcode").val($("#td_ocrcode_" + index).text());
    $("#cbo_department").val($("#td_department_" + index).text());

    $("#txt_selected_approver_stage_index").val("-1");
    $("#modal_stage_ist").modal('hide');

    $.ajax({
        url: '/getData/get_stage1',
        type: 'POST',
        data: { stagecode: $("#td_stage_code_" + index).text() },
        datatype: 'json',
        async: false,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#table_stage1>tbody>tr").remove();
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                var option = "";
                $("#cbo_app_order option").each(function () {
                    if (x.VisOrder == this.value) {
                        option = option + "<option value='" + this.value + "' selected>" + this.text + "</option>";
                    }
                    else {
                        option = option + "<option value='" + this.value + "'>" + this.text + "</option>";
                    }
                });
                var tr = "<tr id='tr_stage1_" + i + "'>";
                tr = tr + "<td><span onclick='cmd_stage_1_remove(" + i + ")' style='cursor:pointer'><i class='fa fa-remove text-danger'></i></span></td>";
                tr = tr + "<td><input type='text' class='form-control form-control-insde' readonly='readonly' id='txt_approver_" + i + "' placeholder='Approver' value='" + x.UserCode + "' ondblclick='cmd_show_stage_user(" + i + ")'></td>";
                tr = tr + "<td><select class='form-control form-control-insde form-group' id='cbo_app_order_" + i + "'>" + option + "</select></td>";
                tr = tr + "<td><input type='text' class='form-control form-control-insde' id='txt_description_" + i + "' placeholder='Description' value='" + x.Dscription + "' ></td>";
                option = "";
                $("#cbo_app_order option").each(function () {
                    if (x.Location == this.value) {
                        option = option + "<option value='" + this.value + "' selected>" + this.text + "</option>";
                    }
                    else {
                        option = option + "<option value='" + this.value + "'>" + this.text + "</option>";
                    }
                });
                tr = tr + "<td><select class='form-control form-control-insde form-group' id='cbo_app_location_" + i + "'>" + option + "</select></td>";
                tr = tr + "<td id='td_stage1_status_" + i + "' style='display:none'>Old</td>";
                tr = tr + "</tr>";
                $("#table_stage1>tbody").append(tr);
            }
            add_blank_stage1();
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
//function tr_stage1_click(rowindex) {
//    $("#txt_user_stage1_index").val(rowindex);
//}
function cmd_stage_1_remove(rowindex) {
    $("#td_stage1_status_" + rowindex).text("Deleted");
    $("#tr_stage1_" + rowindex).hide();
}
function add_blank_stage1() {
    var option = "", index = 0;
    $("#cbo_app_order option").each(function () {
        option = option + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    var lentbl = $("#table_stage1 > tbody > tr").length;
    if (lentbl > 0) {
        var lastId = $('#table_stage1 > tbody > tr:last').attr('id');
        if (lastId) {
            index = parseInt(lastId.replace("tr_stage1_", "")) + 1; 
        } else {
            index = 1;
        } 
    } else {
        index = 1;
    }
    var tr = "<tr id='tr_stage1_" + index + "'>";
    tr = tr + "<td><span onclick='cmd_stage_1_remove(" + i + ")' style='cursor:pointer'><i class='fa fa-remove text-danger' ></i></span></td>";
    tr = tr + "<td><input type='text' class='form-control form-control-insde' readonly='readonly' id='txt_approver_" + index + "' placeholder='Approver' value='' ondblclick='cmd_show_stage_user(" + index + ")'></td>";
    tr = tr + "<td><select class='form-control form-control-insde form-group' id='cbo_app_order_" + index + "'>" + option + "</select></td>";
    tr = tr + "<td><input type='text' class='form-control form-control-insde' id='txt_description_" + index + "' placeholder='Description'></td>";
    tr = tr + "<td><select class='form-control form-control-insde form-group' id='cbo_app_location_" + index + "'>" + option + "</select></td>";
    tr = tr + "<td id='td_stage1_status_" + index + "' style='display:none'>New</td>";
    tr = tr + "</tr>";
    $("#table_stage1>tbody").append(tr);
}
function cmd_show_stage_user(rowindex) {
    $("#txt_user_stage1_index").val(rowindex);
    $("#modal_user_ist").modal('show');
}
function tr_user_click(rowindex) {
    $("#table_popup_user_list > tbody > tr").each(function (index) {
        $("#tr_user_" + (index + 1)).css("background-color", "white");
    });
    $("#tr_user_" + rowindex).css("background-color", "#e6f0ff");
    $("#txt_selected_user_index").val(rowindex);
}
function cmd_choose_user() {
    var index = $("#txt_selected_user_index").val();
    var stage1_index = $("#txt_user_stage1_index").val();
    $("#txt_approver_" + stage1_index).val($("#td_user_code_" + index).text());
    $("#modal_user_ist").modal('hide');
    $("#txt_pop_up_search_user").val("");
    add_blank_stage1();
}
function cmd_new_stage() {
    location.reload();
}
function cmd_save_stage() {
    var list = [];
    var head = {
        AppStageCode: $("#txt_stage_code").val(),
        AppName: $("#txt_app_name").val(),
        AppDes: $("#txt_app_name").val(),
        FNStock: $("#cbo_fn_stock").val(),
        OcrCode: $("#cbo_ocrcode").val(),
        Department: $("#cbo_department").val()
    };

    $('#table_stage1 > tbody > tr').each(function (index, tr) {
        var $tr = $(tr); // wrap the row for scoped search

        var approver = $tr.find("input[id^='txt_approver_']").val();
        var status = $tr.find("td[id^='td_stage1_status_']").text(); // optional if you track status in a cell

        if (status !== "Deleted" && approver && approver.trim() !== "") {
            var d = {
                UserCode: approver,
                VisOrder: $tr.find("select[id^='cbo_app_order_']").val(),
                Dscription: $tr.find("input[id^='txt_description_']").val(),
                Location: $tr.find("select[id^='cbo_app_location_']").val()
            };
            list.push(d);
        }
    });


    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/admin/cmd_save_stage',
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
            }
        },
        failure: function (response) {
            $('#result').html(response);
        }
    });
}

//For Template
function cmd_choose_template_stage(ismanual) {
    var index = $("#txt_selected_approver_stage_index").val();
    if (ismanual == 1) {
        $("#txt_stage_code").val($("#td_stage_code_" + index).text());
    }
    $("#txt_stage_name").val($("#td_stage_name_" + index).text());
    $("#txt_selected_approver_stage_index").val("-1");
    $("#modal_stage_ist").modal('hide');

    $.ajax({
        url: '/getData/get_stage1',
        type: 'POST',
        data: { stagecode: $("#txt_stage_code").val() },
        datatype: 'json',
        async: false,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#txt_stage_name").val(data.stagename);
            $("#table_template_stage1>tbody>tr").remove();
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                var tr = "<tr id='tr_stage1_" + i + "'>";
                tr = tr + "<td><input type='text' class='form-control form-control-insde' readonly='readonly' placeholder='Approver' value='" + x.UserCode + "'></td>";
                tr = tr + "<td><input type='text' class='form-control form-control-insde' readonly='readonly' placeholder='Approver' value='" + x.VisOrder + "'></td>";
                tr = tr + "<td><input type='text' class='form-control form-control-insde' id='txt_description_" + x.VisOrder + "' placeholder='Description'></td>";
                tr = tr + "<td id='td_stage1_status_" + i + "' style='display:none'>Old</td>";
                tr = tr + "</tr>";
                $("#table_template_stage1>tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function show_template() {
    $("#modal_tempalte_list").modal('show');
}
function tr_template_click(rowindex) {

    $("#table_popup_template_list > tbody > tr").each(function (index) {
        $("#tr_template_" + (index + 1)).css("background-color", "white");
    });
    $("#tr_template_" + rowindex).css("background-color", "#e6f0ff");
    $("#txt_selected_template_index").val(rowindex);
}
function cmd_choose_template() {
    var index = $("#txt_selected_template_index").val();
    $("#txt_template_code").val($("#td_template_code_" + index).text());
    $("#txt_template_name").val($("#td_template_name_" + index).text());
    $("#cbo_doc_id").val($("#td_template_doc_id_" + index).text());
    $("#cbo_boq_type").val($("#td_template_boq_type_" + index).text());
    $("#cbo_type").val($("#td_template_boq_type_" + index).text());
    $("#cbo_is_boq").val($("#td_template_is_boq_" + index).text());
    $("#txt_from_amount").val(convert2digit($("#td_template_from_amt_" + index).text()));
    $("#txt_to_amount").val(convert2digit($("#td_template_to_amt_" + index).text()));
    $("#txt_stage_code").val($("#td_template_stage_code_" + index).text());

    $("#cbo_status").val($("#td_template_status_" + index).text());

    cmd_choose_template_stage(0);

    $("#modal_tempalte_list").modal('hide');
/*    load_template_project($("#txt_template_code").val());*/
    load_template_init($("#txt_template_code").val());
/*    load_template_mainwork($("#txt_template_code").val());*/
}
function load_template_init(tempid) {
    $.ajax({
        url: '/getData/get_template_init',
        type: 'POST',
        data: { tempid: tempid },
        datatype: 'json',
        async: false,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                if (x.Selected == "Y") {
                    $("#chk_" + x.UserCode).attr('checked', true);

                }
                else {
                    $("#chk_" + x.UserCode).attr('checked', false);
                }
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function load_template_project(tempid) {
    $.ajax({
        url: '/getData/get_template_project',
        type: 'POST',
        data: { tempid: tempid },
        datatype: 'json',
        async: false,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                if (x.Selected == "Y") {
                    $("#chk_" + x.PrcCode).attr('checked', true);

                }
                else {
                    $("#chk_" + x.PrcCode).attr('checked', false);
                }
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function load_template_mainwork(tempid) {
    $.ajax({
        url: '/getData/get_template_mainwork',
        type: 'POST',
        data: { tempid: tempid },
        datatype: 'json',
        async: false,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            for (i = 0; i < data.datamain.length; i++) {
                var x = data.datamain[i];
                if (x.U_FrgnName == "Y") {
                    $("#chk_" + x.Code).attr('checked', true);

                }
                else {
                    $("#chk_" + x.Code).attr('checked', false);
                }
            }
            for (i = 0; i < data.datasub.length; i++) {
                var x = data.datasub[i];
                if (x.U_FrgnName == "Y") {
                    $("#chk_" + x.Code).attr('checked', true);
                    $('input:checkbox[name=main_' + x.U_MainWork + ']').attr('checked', true);
                }
                else {
                    $("#chk_" + x.Code).attr('checked', false);
                }
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function cmd_new_template() {
    location.reload();
}
function change_amount() {
    var from = $("#txt_from_amount").val();
    var to = $("#txt_to_amount").val();

    $("#txt_from_amount").val(convert2digit(from));
    $("#txt_to_amount").val(convert2digit(to));
}
function cmd_save_tempate() {
    var pro_list = [];
    var init_list = [];
    var main_list = [];
    var allow = 0;
    if ($("#txt_stage_code").val() == "") {
        alert("Approval Stage is required");
        allow = 1;
    }
    if (allow == 0) {
        $("#table_project > tbody  > tr").find("input[type='checkbox']").each(function () {
            if (this.checked) {
                var id = this.id.replace("chk_", "");
                var d = {
                    AppTemplateID: $("#txt_template_code").val(),
                    OcrCode: id,
                };
                pro_list.push(d);
            }
        });
        $("#table_template_user > tbody  > tr").find("input[type='checkbox']").each(function () {
            if (this.checked) {
                var id = this.id.replace("chk_", "");
                var d = {
                    AppTemplateID: $("#txt_template_code").val(),
                    UserCode: id,
                };
                init_list.push(d);
            }
        });
        $("#table_mainwork > tbody  > tr").find("input[type='checkbox']").each(function () {
            if (this.checked) {
                var id = this.id.replace("chk_", "");
                var d = {
                    AppTemplateID: $("#txt_template_code").val(),
                    MainWorkCode: $("#td_mainwork_code_" + id).text(),
                    SubWorkCode: $("#td_submain_code_" + id).text(),
                };
                main_list.push(d);
            }
        });
        var head = {
            AppTemplateID: $("#txt_template_code").val(),
            DocID: $("#cbo_doc_id").val(),
            AppStageCode: $("#txt_stage_code").val(),
            DocStatus: $("#cbo_status").val(),
            FromAmt: returnstringvalue($("#txt_from_amount").val()),
            ToAmt: returnstringvalue($("#txt_to_amount").val()),
            Type: $("#cbo_type").val(),
            IsBOQ: $("#cbo_is_boq").val(),
            StoreName: $("#txt_store").val(),
            TemplateDesc: $("#txt_template_name").val(),
            CreatedBy: $("#txt_shared_userid").val(),
        };
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/admin/cmd_save_app_template',
            data: JSON.stringify(
                {
                    'header': head,
                    'project': pro_list,
                    'init': init_list,
                    'mainwork': main_list,
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
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
} 