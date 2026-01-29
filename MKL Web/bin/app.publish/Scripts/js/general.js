var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
var TC = "";
function ShowError(Message) {
    var data = Message.split('@');
    var error = "";
    for (i = 0; i < data.length; i++) {
        if (error == "") {
            error = "<p>" + data[i] + "</p>";
        }
        else {
            if (data[i].indexOf("Available Request") != -1) {
                error = error + "<p style='color:red'><b>" + data[i] + "</b></p>";
            }
            else if (data[i].indexOf("Total Request") != -1) {
                error = error + "<p style='color:red'><b>" + data[i] + "</b></p>";
            }
            else if (data[i].indexOf("Over BOQ") != -1) {
                error = error + "<p style='color:red'><b>" + data[i] + "</b></p>";
            }
            else
                error = error + "<p>" + data[i] + "</p>";
        }
    }
    //alert(error);
    ShowAlert(error);
}
function get_last_payee(cardcode) {
    var lastpayee = "";
    $.ajax({
        url: "/getData/get_lastpayee",
        type: 'POST',
        data: { cardcode: cardcode },
        datatype: 'json',
        async: false,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            lastpayee = data.lastpayee;
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
    return lastpayee;
}
function check_user_hide_price(doctype, isboq, boqtype) {
    var hideprice = "N";
    doctype = $("#txt_frm").val();
    $.ajax({
        url: "/getData/check_user_hide_price",
        type: 'POST',
        data: { module: doctype, isboq: isboq, boqtype: boqtype },
        datatype: 'json',
        async: false,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.hide == "Y") {
                $(".hide_price").hide();
            }
            else {
                $(".hide_price").show();
            }
            if (data.Auth == "F") {
                $(".btnaction").show();
            }
            else if (data.Auth == "R") {
                $(".btnaction").hide();
            } else {
                $("#frm_edit").hide();
                $("#frm_no_auth").show();
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
    return hideprice;
}

function checkUser() {
    $.ajax({
        url: '/getData/checkUser',
        type: 'POST',
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status == "Expired") {
                var baseUrl = "/log/log";
                window.location.href = baseUrl;

            }
            else {
                if (data.changenext == "Y") {
                    $("#modal-changepwd").modal('show');
                    $("#cmd_close_change_password").hide();
                }
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}

function cmd_update_done_authorize() {
    var option = "";
    $.ajax({
        url: '/getData/cmd_update_done_authorize',
        type: 'POST',
        data: {},
        datatype: 'json',
        async: false,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
    return option;
}
$(document).ready(function () {
    $("#txt_pop_up_search_doc_num").keyup(function () {
        var checked = 'No';
        $("#table_popup_document_list >tbody >tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_boq_", "");
            var text = $("#td_pop_line_filer_base_doc_num_" + id).text().toLowerCase();

            if (text.replace(/\s+/g, '').indexOf($("#txt_pop_up_search_doc_num").val().replace(/\s+/g, '').toLowerCase()) == -1) {
                if ($("#check_pop_boq_" + id).is(":checked")) {
                    checked = 'Yes';
                } else {
                    $(this).hide();
                }
            } else {
                $(this).show();
            }
        });
        if (checked == 'Yes') {
            $("#th_popup_check").show();
            $("#th_popup_uncheck").hide();
        }
    });
    $("#txt_pop_up_search_item").keyup(function () {
        var checked = 'No';
        $("#table_popup_document_list >tbody >tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_boq_", "");
            var text = $("#td_pop_line_filer_item_name_" + id).text().toLowerCase() + $("#td_pop_line_filer_main_name_" + id).text().toLowerCase() + $("#td_pop_line_filer_floor_name_" + id).text().toLowerCase() + $("#td_pop_line_filer_ocrcode2_" + id).text().toLowerCase() + $("#td_pop_line_filer_ocrcode3_name_" + id).text().toLowerCase();
            if (text.replace(/\s+/g, '').indexOf($("#txt_pop_up_search_item").val().replace(/\s+/g, '').toLowerCase()) == -1) {
                if ($("#check_pop_boq_" + id).is(":checked")) {
                    checked = 'Yes';
                } else {
                    $(this).hide();
                }
            } else {
                $(this).show();
            }
        });
        if (checked == 'Yes') {
            $("#th_popup_check").show();
            $("#th_popup_uncheck").hide();
        }
    });
    $("#txt_pop_filter_vendor_name").keyup(function () {
        $("#table_pop_vendor_list >tbody >tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_vendor_", "");

            var text = $("#td_pop_vendor_vendor_code_" + id).text().toLowerCase() + $("#td_pop_vendor_vendor_name_" + id).text().toLowerCase() + $("#td_pop_vendor_fname_" + id).text().toLowerCase();

            if (text.replace(/\s+/g, '').indexOf($("#txt_pop_filter_vendor_name").val().replace(/\s+/g, '').toLowerCase()) == -1)
                $(this).hide();
            else
                $(this).show();
        });
    });

    $("#txt_pop_up_boq_search_item").keyup(function () {
        var checked = 'No';
        $("#table_popup_boq_list >tbody >tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_boq_", "");
            if (text.replace(/\s+/g, '').indexOf($("#txt_pop_up_boq_search_item").val().replace(/\s+/g, '').toLowerCase()) == -1) {
                if ($("#check_pop_boq_" + id).is(":checked")) {
                    checked = 'Yes';
                } else {
                    $(this).hide();
                }
            } else {
                $(this).show();
            }
        });
        if (checked == 'Yes') {
            $("#th_popup_check").show();
            $("#th_popup_uncheck").hide();
        }
    });
    $("#txt_pop_up_search_item").keyup(function () {////
        var checked = 'No';
        $("#table_popup_item_list>tbody>tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_master_", "");
            var text = $("#td_pop_master_item_code_" + id).text().toLowerCase() + $("#td_pop_master_item_name_" + id).text().toLowerCase();
            if (text.replace(/\s+/g, '').indexOf($("#txt_pop_up_search_item").val().replace(/\s+/g, '').toLowerCase()) == -1) {
                if ($("#check_pop_master_" + id).is(":checked")) {
                    checked = 'Yes';
                } else {
                    $(this).hide();
                }
            } else {
                $(this).show();
            }
        });
        if (checked == 'Yes') {
            $("#th_popup_master_check").show();
            $("#th_popup_master_uncheck").hide();
        }
    });

    $("#txt_pop_up_boq_search_item").keyup(function () {
        var checked = 'No';
        $("#table_popup_document_list>tbody>tr").each(function () {
            var id = $(this).attr('id').replace("tr_pop_boq_", "");
            var text = $("#boq_line_filer_parent_" + id).text().toLowerCase() + $("#boq_line_filer_parent_name_" + id).text().toLowerCase() + $("#boq_line_filer_goods_issue_num_" + id).text().toLowerCase() + $("#boq_line_filer_globalcode_" + id).text().toLowerCase() + $("#boq_line_filer_item_code_" + id).text().toLowerCase() + $("#boq_line_filer_item_name_" + id).text().toLowerCase()
                + $("#boq_line_filer_ocrcode3_name_" + id).text().toLowerCase() + $("#boq_line_filer_main_name_" + id).text().toLowerCase()
                + $("#boq_line_filer_sub_name_" + id).text().toLowerCase()
                + $("#boq_line_filer_floor_name_" + id).text().toLowerCase()
                + $("#boq_line_filer_boq_code_" + id).text().toLowerCase();
            if (text.replace(/\s+/g, '').indexOf($("#txt_pop_up_boq_search_item").val().replace(/\s+/g, '').toLowerCase()) == -1) {
                if ($("#check_pop_boq_" + id).is(":checked")) {
                    checked = 'Yes';
                } else {
                    $(this).hide();
                }
            } else {
                $(this).show();
            }
        });
        if (checked == 'Yes') {
            $("#th_popup_check").show();
            $("#th_popup_uncheck").hide();
        }
    });
    $("#txt_retention_search_as").keyup(function () {
        var checked = 'No';
        $("#table_line_item > tbody > tr").each(function () {
            var id = $(this).attr('id').replace("tr_line_", "");
            var text = $("#td_item_code_" + id).text().toLowerCase() + $("#td_item_name_" + id).text().toLowerCase() + $("#td_house_code_" + id).text().toLowerCase()
                + $("#td_main_work_" + id).text().toLowerCase() + $("#td_sub_work_name_" + id).text().toLowerCase() + $("#td_floor_work_" + id).text().toLowerCase()
                + $("#td_parent_code_" + id).text().toLowerCase() + $("#td_parent_name_" + id).text().toLowerCase();
            if (text.replace(/\s+/g, '').indexOf($("#txt_retention_search_as").val().replace(/\s+/g, '').toLowerCase()) == -1) {
                if ($("#check_" + id).is(":checked")) {
                    checked = 'Yes';
                } else {
                    $(this).hide();
                }
            } else {
                $(this).show();
            }
        });
        if (checked == 'Yes') {
            $("#th_check").show();
            $("#th_uncheck").hide();
        }
    });
    //$("#txt_pop_filter_vendor_name").keyup(function () {
    //    $("#table_pop_vendor_list>tbody>tr").each(function () {
    //        var id = $(this).attr('id').replace("tr_pop_vendor_", "");
    //        var text = $("#td_pop_vendor_vendor_code_" + id).text().toLowerCase() + $("#td_pop_vendor_vendor_name_" + id).text().toLowerCase();
    //        if (text.replace(/\s+/g, '').indexOf($("#txt_pop_filter_vendor_name").val().replace(/\s+/g, '').toLowerCase()) == -1)
    //            $(this).hide();
    //        else
    //            $(this).show();
    //    });
    //});
});

function cmd_Print(dockey, doctype) {
    var currentuser = $("#txt_shared_userid").val();
    if ($("#txt_current_system").val() == 'borey') {
        switch (doctype) {
            case "PR":
                window.open('http://172.27.0.5:881//Reports/Reports.aspx?type=2&CurrentUser=' + currentuser + '&DocEntry=' + dockey, '_blank');
                break;
            case "POL":
                window.open('http://172.27.0.5:881/Reports/Reports.aspx?type=1&DocEntry=' + dockey, '_blank');
                break;
            case "POM":
                window.open('http://172.27.0.5:881/Reports/Reports.aspx?type=3&CurrentUser=' + currentuser + '&DocEntry=' + dockey, '_blank');
                break;
            case "GRPO":
                window.open('http://172.27.0.5:881/Reports/Reports.aspx?type=4&DocEntry=' + dockey, '_blank');
                break;
            case "GR":
                window.open('http://172.27.0.5:881//Reports/Reports.aspx?type=5&DocEntry=' + dockey, '_blank');
                break;
            case "InvGI":
                window.open('http://172.27.0.5:881/Reports/Reports.aspx?type=6&DocEntry=' + dockey, '_blank');
                break;
            case "InvGR":
                window.open('http://172.27.0.5:881/Reports/Reports.aspx?type=7&DocEntry=' + dockey, '_blank');
                break;
            case "HOR":
                window.open('http://172.27.0.5:881/Reports/Reports.aspx?type=9&DocEntry=' + dockey, '_blank');
                window.open('http://172.27.0.5:881/Reports/Reports.aspx?type=10&DocEntry=' + dockey, '_blank');
                break;
            case "SAC":
                window.open('http://172.27.0.5:881/Reports/Reports.aspx?type=11&DocEntry=' + dockey, '_blank');
                break;
            case "SAC1":
                window.open('http://172.27.0.5:881/Reports/Reports.aspx?type=25&DocEntry=' + dockey, '_blank');
                break;
            case "subPR":
                window.open('http://172.27.0.5:881//Reports/Reports.aspx?type=12&CurrentUser=' + currentuser + '&DocEntry=' + dockey, '_blank');
                break;
            case "subPO":
                window.open('http://172.27.0.5:881//Reports/Reports.aspx?type=13&DocEntry=' + dockey, '_blank');
                break;
            case "ConGRPO":
                window.open('http://172.27.0.5:881//Reports/Reports.aspx?type=14&DocEntry=' + dockey, '_blank');
                break;
            case "SubGRPO":
                window.open('http://172.27.0.5:881//Reports/Reports.aspx?type=24&DocEntry=' + dockey, '_blank');
                break;
            case "InvTrn":
                window.open('http://172.27.0.5:881//Reports/Reports.aspx?type=27&DocEntry=' + dockey, '_blank');
                break;
        }
    } else {
        switch (doctype) {
            case "PR":
                window.open('http://172.27.0.5:801//Reports/Reports.aspx?type=2&CurrentUser=' + currentuser + '&DocEntry=' + dockey, '_blank');
                break;
            case "POL":
                window.open('http://172.27.0.5:801/Reports/Reports.aspx?type=1&DocEntry=' + dockey, '_blank');
                break;
            case "POM":
                window.open('http://172.27.0.5:801//Reports/Reports.aspx?type=3&CurrentUser=' + currentuser + '&DocEntry=' + dockey, '_blank');
                break;
            case "GRPO":
                window.open('http://172.27.0.5:801//Reports/Reports.aspx?type=4&DocEntry=' + dockey, '_blank');
                break;
            case "GR":
                window.open('http://172.27.0.5:801//Reports/Reports.aspx?type=5&DocEntry=' + dockey, '_blank');
                break;
            case "InvGI":
                window.open('http://172.27.0.5:801//Reports/Reports.aspx?type=6&DocEntry=' + dockey, '_blank');
                break;
            case "InvGR":
                window.open('http://172.27.0.5:801//Reports/Reports.aspx?type=7&DocEntry=' + dockey, '_blank');
                break;
            case "subPR":
                window.open('http://172.27.0.5:801//Reports/Reports.aspx?type=12&CurrentUser=' + currentuser + '&DocEntry=' + dockey, '_blank');
                break;
            case "subPO":
                window.open('http://172.27.0.5:801//Reports/Reports.aspx?type=13&DocEntry=' + dockey, '_blank');
                break;
            case "ConGRPO":
                window.open('http://172.27.0.5:801//Reports/Reports.aspx?type=14&DocEntry=' + dockey, '_blank');
                break;
            case "SubGRPO":
                window.open('http://172.27.0.5:801//Reports/Reports.aspx?type=24&DocEntry=' + dockey, '_blank');
                break;
            case "InvTrn":
                window.open('http://172.27.0.5:801//Reports/Reports.aspx?type=27&DocEntry=' + dockey, '_blank');
                break;
        }
    }
}
function cmd_Print_List(doctype, boqtype) {
    var port = '';
    if ($("#txt_current_system").val() == 'borey') {
        port = '881';
    } else {
        port = '801';
    }
    switch (doctype) {
        case "PRList":
            var ocrcode = $("#cbo_ocrcode").val();
            var creator = $("#txt_created_by").val();
            var currentuser = $("#txt_shared_userid").val();
            var requester = $("#txt_requester").val();
            var isboq = $("#cbo_isboq").val();
            var status = $("#cbo_status").val();
            var fdate = $("#txt_fdate").val();
            var tdate = $("#txt_tdate").val();
            var dd = '';
            if (fdate == "")
                dd = "01-Jan-1999";
            else
                dd = fdate;
            var f = dd.split('-');
            if (tdate == "")
                dd = "01-Jan-1999";
            else
                dd = tdate;
            var t = dd.split('-');
            var ffd = f[2] + "/" + f[1] + "/" + f[0];
            var ttd = t[2] + "/" + t[1] + "/" + t[0];
            window.open('http://172.27.0.5:' + port + '//Reports/Reports.aspx?type=16&OcrCode=' + ocrcode + '&CurrentUser=' + currentuser + '&CreateBy=' + creator + '&Requester=' + requester + '&Status=' + status + '&BOQType=' + boqtype + '&IsBOQ=' + isboq + '&fdate=' + ffd + '&tdate=' + ttd, '_blank');
            break;
        case "POList":
            var ocrcode = $("#cbo_ocrcode").val();
            var creator = $("#txt_created_by").val();
            var currentuser = $("#txt_shared_userid").val();
            var NumAtCard = $("#txt_requester").val();
            var isboq = $("#cbo_isboq").val();
            var status = $("#cbo_status").val();
            var fdate = $("#txt_fdate").val();
            var tdate = $("#txt_tdate").val();
            var dd = '';
            if (fdate == "")
                dd = "01-Jan-1999";
            else
                dd = fdate;
            var f = dd.split('-');
            if (tdate == "")
                dd = "01-Jan-1999";
            else
                dd = tdate;
            var t = dd.split('-');
            var ffd = f[2] + "/" + f[1] + "/" + f[0];
            var ttd = t[2] + "/" + t[1] + "/" + t[0];
            window.open('http://172.27.0.5:' + port + '//Reports/Reports.aspx?type=17&OcrCode=' + ocrcode + '&CurrentUser=' + currentuser + '&CreateBy=' + creator + '&NumAtCard=' + NumAtCard + '&Status=' + status + '&BOQType=' + boqtype + '&IsBOQ=' + isboq + '&fdate=' + ffd + '&tdate=' + ttd, '_blank');
            break;
        case "GRPOList":
            var ocrcode = $("#cbo_ocrcode").val();
            var creator = $("#txt_created_by").val();
            var currentuser = $("#txt_shared_userid").val();
            var CardCode = $("#txt_vendor").val();
            var Memo = $("#txt_memo").val();
            var status = $("#cbo_status").val();
            var fdate = $("#txt_fdate").val();
            var tdate = $("#txt_tdate").val();
            var dd = '';
            if (fdate == "")
                dd = "01-Jan-1999";
            else
                dd = fdate;
            var f = dd.split('-');
            if (tdate == "")
                dd = "01-Jan-1999";
            else
                dd = tdate;
            var t = dd.split('-');
            var ffd = f[2] + "/" + f[1] + "/" + f[0];
            var ttd = t[2] + "/" + t[1] + "/" + t[0];
            window.open('http://172.27.0.5:' + port + '//Reports/Reports.aspx?type=18&OcrCode=' + ocrcode + '&CurrentUser=' + currentuser + '&CreateBy=' + creator + '&CardCode=' + CardCode + '&Status=' + status + '&Memo=' + Memo + '&fdate=' + ffd + '&tdate=' + ttd + '&BOQType=' + boqtype, '_blank');
            break;
        case "LaborList":
            var ocrcode = $("#cbo_ocrcode").val();
            var creator = $("#txt_created_by").val();
            var currentuser = $("#txt_shared_userid").val();
            var CardCode = $("#txt_vendor").val();
            var Memo = $("#txt_memo").val();
            var status = $("#cbo_status").val();
            var fdate = $("#txt_fdate").val();
            var tdate = $("#txt_tdate").val();
            var dd = '';
            if (fdate == "")
                dd = "01-Jan-1999";
            else
                dd = fdate;
            var f = dd.split('-');
            if (tdate == "")
                dd = "01-Jan-1999";
            else
                dd = tdate;
            var t = dd.split('-');
            var ffd = f[2] + "/" + f[1] + "/" + f[0];
            var ttd = t[2] + "/" + t[1] + "/" + t[0];
            window.open('http://172.27.0.5:' + port + '//Reports/Reports.aspx?type=19&OcrCode=' + ocrcode + '&CurrentUser=' + currentuser + '&CreateBy=' + creator + '&CardCode=' + CardCode + '&Status=' + status + '&Memo=' + Memo + '&fdate=' + ffd + '&tdate=' + ttd, '_blank');
            break;
        case "InvGR":
            var ocrcode = $("#cbo_ocrcode").val();
            var creator = $("#txt_created_by").val();
            var currentuser = $("#txt_shared_userid").val();
            var CardCode = $("#txt_vendor").val();
            var Memo = $("#txt_memo").val();
            var status = $("#cbo_status").val();
            var fdate = $("#txt_fdate").val();
            var tdate = $("#txt_tdate").val();
            var dd = '';
            if (fdate == "")
                dd = "01-Jan-1999";
            else
                dd = fdate;
            var f = dd.split('-');
            if (tdate == "")
                dd = "01-Jan-1999";
            else
                dd = tdate;
            var t = dd.split('-');
            var ffd = f[2] + "/" + f[1] + "/" + f[0];
            var ttd = t[2] + "/" + t[1] + "/" + t[0];
            window.open('http://172.27.0.5:' + port + '//Reports/Reports.aspx?type=20&OcrCode=' + ocrcode + '&CurrentUser=' + currentuser + '&CreateBy=' + creator + '&CardCode=' + CardCode + '&Status=' + status + '&Memo=' + Memo + '&fdate=' + ffd + '&tdate=' + ttd + '&BOQType=' + boqtype, '_blank');
            break;
        case "InvGI":
            var ocrcode = $("#cbo_ocrcode").val();
            var creator = $("#txt_created_by").val();
            var currentuser = $("#txt_shared_userid").val();
            var status = $("#cbo_status").val();
            var isboq = $("#cbo_is_boq").val();
            var fdate = $("#txt_fdate").val();
            var tdate = $("#txt_tdate").val();
            var dd = '';
            if (fdate == "")
                dd = "01-Jan-1999";
            else
                dd = fdate;
            var f = dd.split('-');
            if (tdate == "")
                dd = "01-Jan-1999";
            else
                dd = tdate;
            var t = dd.split('-');
            var ffd = f[2] + "/" + f[1] + "/" + f[0];
            var ttd = t[2] + "/" + t[1] + "/" + t[0];
            window.open('http://172.27.0.5:' + port + '//Reports/Reports.aspx?type=21&OcrCode=' + ocrcode + '&CurrentUser=' + currentuser + '&CreateBy=' + creator + '&Status=' + status + '&IsBOQ=' + isboq + '&fdate=' + ffd + '&tdate=' + ttd, '_blank');
            break;
        case "GR":
            var ocrcode = $("#cbo_ocrcode").val();
            var creator = $("#txt_created_by").val();
            var currentuser = $("#txt_shared_userid").val();
            var CardCode = $("#txt_vendor").val();
            var Memo = $("#txt_memo").val();
            var status = $("#cbo_status").val();
            var fdate = $("#txt_fdate").val();
            var tdate = $("#txt_tdate").val();
            var dd = '';
            if (fdate == "")
                dd = "01-Jan-1999";
            else
                dd = fdate;
            var f = dd.split('-');
            if (tdate == "")
                dd = "01-Jan-1999";
            else
                dd = tdate;
            var t = dd.split('-');
            var ffd = f[2] + "/" + f[1] + "/" + f[0];
            var ttd = t[2] + "/" + t[1] + "/" + t[0];
            window.open('http://172.27.0.5:' + port + '//Reports/Reports.aspx?type=22&OcrCode=' + ocrcode + '&CurrentUser=' + currentuser + '&CreateBy=' + creator + '&CardCode=' + CardCode + '&Status=' + status + '&Memo=' + Memo + '&fdate=' + ffd + '&tdate=' + ttd + '&BOQType=' + boqtype, '_blank');
            break;
        case "InvTrn":
            var ocrcode = $("#cbo_ocrcode").val();
            var creator = $("#txt_created_by").val();
            var currentuser = $("#txt_shared_userid").val();
            var CardCode = $("#txt_vendor").val();
            var Memo = $("#txt_memo").val();
            var status = $("#cbo_status").val();
            var fdate = $("#txt_fdate").val();
            var tdate = $("#txt_tdate").val();
            var dd = '';
            if (fdate == "")
                dd = "01-Jan-1999";
            else
                dd = fdate;
            var f = dd.split('-');
            if (tdate == "")
                dd = "01-Jan-1999";
            else
                dd = tdate;
            var t = dd.split('-');
            var ffd = f[2] + "/" + f[1] + "/" + f[0];
            var ttd = t[2] + "/" + t[1] + "/" + t[0];
            window.open('http://172.27.0.5:' + port + '//Reports/Reports.aspx?type=23&OcrCode=' + ocrcode + '&CurrentUser=' + currentuser + '&CreateBy=' + creator + '&CardCode=' + CardCode + '&Status=' + status + '&Memo=' + Memo + '&fdate=' + ffd + '&tdate=' + ttd + '&BOQType=' + boqtype, '_blank');
            break;
        case "CliamReport":
            var project = $("#cbo_ocrcode").val();
            var block = $("#cbo_block").val();
            var fdate = $("#txt_fdate").val();
            var tdate = $("#txt_tdate").val();
            var cardcode = $("#txt_vendor_code").val();
            var createdby = $("#txt_created_by").val();
            var currentuser = $("#txt_shared_userid").val();
            var mydate = fdate.trim().split('-');
            fdate = mydate[2] + "/" + (months.indexOf(mydate[1].toLowerCase()) + 1) + "/" + mydate[0];
            mydate = tdate.trim().split('-');
            tdate = mydate[2] + "/" + (months.indexOf(mydate[1].toLowerCase()) + 1) + "/" + mydate[0];
            window.open('http://172.27.0.5:' + port + '//Reports/Reports.aspx?type=15&fdate=' + fdate + '&tdate=' + tdate + '&CurrentUser=' + currentuser + '&OcrCode=' + project + '&Block=' + block + '&CardCode=' + cardcode + '&CreateBy=' + createdby + '&OnlyTC=' + TC, '_blank');
            break;
    }
}
function cmd_view_report_claim(onlyTC, actionType) {
    TC = onlyTC;
    var project = $("#cbo_ocrcode").val();
    var block = $("#cbo_block").val();
    var fdate = $("#txt_fdate").val();
    var tdate = $("#txt_tdate").val();
    var cardcode = $("#txt_vendor_code").val();
    var createdby = $("#txt_created_by").val();
    if (project == "" || fdate == "" || tdate == "" || cardcode == "" || createdby == "") {
        ShowAlert("Project, Block, Vendor and Date can not empty!");
    } else {
        if (actionType == "print") {
            cmd_Print_List("CliamReport", "L");
        } else {
            $.ajax({
                url: '/getData/get_po_labor_report',
                type: 'POST',
                data: { Project: project, Block: block, OnlyTC: onlyTC, fdate: fdate, tdate: tdate, CardCode: cardcode, createdby: createdby },
                datatype: 'json',
                async: false,
                beforeSend: function () {
                    $("#loading").show();
                },
                complete: function () {
                    $("#loading").hide();
                },
                success: function (dt) {
                    $("#table_doc_list>tbody>tr").remove();
                    if (dt.data.length > 0) {
                        for (i = 0; i < dt.data.length; i++) {
                            var x = dt.data[i];
                            var data = "<tr>";
                            data = data + "<td style='width:3%;text-align:center;'>" + (parseInt(i) + 1) + "</td>";
                            data = data + "<td style='width:8%;text-align:center;'>" + x.DocNum + "</td>";
                            data = data + "<td style='width:8%;text-align:center;'>" + x.DocDate + "</td>";
                            data = data + "<td style='width:8%;text-align:center;'>" + x.DocStatus + "</td>";
                            data = data + "<td>" + x.CardName + "</td>";
                            data = data + "<td style='width:8%;text-align:center;'>" + x.CancelBy + "</td>";
                            data = data + "<td style='width:8%;text-align:center;'>" + x.CardCode + "</td>";
                            data = data + "<td style='width:8%;text-align:center;'>" + x.NumatCard + "</td>";
                            data = data + "<td style='width:8%;text-align:center;'>" + x.Memo + "</td>";
                            data = data + "<td style='width:10%;text-align:center;'>" + convert4digit(returnstringvalue(x.DocTotal)) + "</td>";
                            data = data + "</tr>";
                            $("#table_doc_list>tbody").append(data);
                        }
                    } else {
                        ShowAlert("No data found!");
                    }
                },
                error: function (error) {
                    alert('Error while read data => ' + error);
                }
            });
        }
    }
}

function get_Base_qty(ugpentry, uomentry) {
    var baseqty = 1;
    $("#table_uom_group > tbody >tr").each(function () {
        if ($(this).find("td:eq(0)").text() == ugpentry) {
            if ($(this).find("td:eq(1)").text() == uomentry) {
                baseqty = $(this).find("td:eq(4)").text();
                return false;
            }
        }
    });
    return baseqty;
}

function cmd_show_change_password() {
    $("#modal-changepwd").modal('show');
    $("#cmd_close_change_password").show();
}
function cmd_change_password() {
    var oldpwd = $("#txt_old_password").val();
    var newpwd = $("#txt_new_password").val();
    var confirmpwd = $("#txt_confirm_password").val();
    if (newpwd != confirmpwd) {
        ShowAlert("New Password and Confirmation is mismatched");
    }
    else {
        $.ajax({
            url: '/log/change_password',
            type: 'POST',
            data: {
                UserCode: $("#txt_shared_userid").val(), oldpwd: oldpwd, Pwd: newpwd
            },
            datatype: 'json',
            async: false,
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    $("#modal-changepwd").modal('hide');
                    $("#txt_old_password").val("");
                    $("#txt_new_password").val("");
                    $("#txt_confirm_password").val("");
                }
                else {
                    ShowAlert(data.status);
                }
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}
function get_default_bin(ItemCode, WhsCode) {
    var def_bin = "";
    $.ajax({
        url: '/getData/get_def_bin',
        type: 'POST',
        data: { ItemCode: ItemCode, WhsCode: WhsCode },
        datatype: 'json',
        async: false,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            def_bin = data.docnum;
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
    return def_bin;
}
function get_stock_onhand(itemcode, whscode, uomentry) {
    var onhand = 0;
    $.ajax({
        url: '/getData/get_stock_onhand',
        type: 'POST',
        data: { itemcode: itemcode, whscode: whscode, uomentry: uomentry },
        datatype: 'json',
        async: false,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            onhand = data.onhand;
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
    return onhand;
}
function get_bin_list_for_option(def_bin, whscode) {
    var option = "";
    if ($("#table_bin>tbody>tr").length > 0) {
        $("#table_bin>tbody>tr").each(function () {
            if ($(this).find("td:eq(3)").text() == whscode) {
                if ($(this).find("td:eq(0)").text() == def_bin) {
                    option = option + "<option value='" + $(this).find("td:eq(0)").text() + "' selected='selected'>" + $(this).find("td:eq(1)").text() + "</option>";
                }
                else {
                    option = option + "<option value='" + $(this).find("td:eq(0)").text() + "'>" + $(this).find("td:eq(1)").text() + "</option>";
                }
            }
        });
    }
    if ($("#table_grpo_bin>tbody>tr").length > 0) {
        $("#table_grpo_bin>tbody>tr").each(function () {
            if ($(this).find("td:eq(3)").text() == whscode) {
                if ($(this).find("td:eq(0)").text() == def_bin) {
                    option = option + "<option value='" + $(this).find("td:eq(0)").text() + "' selected='selected'>" + $(this).find("td:eq(1)").text() + "</option>";
                }
                else {
                    option = option + "<option value='" + $(this).find("td:eq(0)").text() + "'>" + $(this).find("td:eq(1)").text() + "</option>";
                }
            }
        });
    }

    return option;
}
function check_warehouse_manage_bin(whsid) {
    var bin = "N";
    $("#table_whs > tbody >tr").each(function () {
        if ($("#" + whsid).val() == $(this).find("td:eq(0)").text()) {
            bin = $(this).find("td:eq(3)").text();
        }
    });
    return bin;
}
function Load_Warehouse_List_Base_On_Project(projectid) {
    var whs = "";
    $("#table_whs > tbody >tr").each(function () {
        if ($("#" + projectid).val() == $(this).find("td:eq(4)").text()) {
            whs = whs + "<option value='" + $(this).find("td:eq(0)").text() + "'>" + $(this).find("td:eq(1)").text() + "</option>";
        }
    });
    return whs;
}
function tr_pop_boq_check(rowindex) {
    //$("#check_pop_boq_" + rowindex).prop("checked", true);
    if ($("#check_pop_boq_" + rowindex).is(':checked') == false) {
        $("#check_pop_boq_" + rowindex).prop("checked", true);
    }
    else {
        $("#check_pop_boq_" + rowindex).prop("checked", false);
    }
    $("#tr_pop_boq_" + rowindex).css("background-color", "#e6f0ff");

}
function cmd_choose_no_summary_document(doctype) {
    var isbin = "";
    var isbatch = "";
    if (doctype == "GRPO") {
        isbin = "Yes";
        isbatch = "Yes";
    }
    $('#table_line_item > tbody > tr:last').remove();
    var rowindex = 0;
    $('#table_line_item > tbody  > tr').each(function (index, tr) {
        var index = $(this).attr('id').replace("tr_line_", "");
        rowindex = index;//$(this).attr("id").replace("tr_po_head_", "");
    });
    rowindex++;
    var blockcode = "";
    $("#table_popup_document_list > tbody  > tr").find("input[type='checkbox']").each(function () {

        if (this.checked) {
            var id = $(this).attr('id').replace("check_pop_boq_", "");

            var whsoption = "";
            $("#table_whs > tbody>tr").each(function () {
                if ($(this).find("td:eq(4)").text() == $("#cbo_ocrcode").val()) {
                    if ($("#td_pop_line_filer_whs_" + id).text() == $(this).find("td:eq(0)").text()) {
                        whsoption = whsoption + "<option value='" + $(this).find("td:eq(0)").text() + "' selected='selected'>" + $(this).find("td:eq(1)").text() + "</option>";
                    }
                    else {
                        whsoption = whsoption + "<option value='" + $(this).find("td:eq(0)").text() + "'>" + $(this).find("td:eq(1)").text() + "</option>";
                    }
                }
            });
            //alert(whsoption);
            var block = "";
            $("#table_block > tbody>tr").each(function () {
                if ($("#td_pop_line_filer_ocrcode2_" + id).text() == $(this).find("td:eq(1)").text()) {
                    block = block + "<option value='" + $(this).find("td:eq(1)").text() + "' selected='selected'>" + $(this).find("td:eq(2)").text() + "</option>";
                    blockcode = $(this).find("td:eq(1)").text();
                }
                else {
                    block = block + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                }
            });

            //var block
            var upentry = $("#td_pop_line_filer_ugpentry_" + id).text();
            var uomoption = "";
            if (upentry == "-1") {
                uomoption = "<option value='-1'>" + $("#td_pop_line_filer_uom_name_" + id).text() + "</option>";
            }
            else {
                $("#table_uom_group >tbody>tr").each(function () {
                    if ($(this).find("td:eq(0)").text() == upentry) {
                        uomoption = uomoption + "<option value='" + $(this).find("td:eq(1)").text() + "'>" + $(this).find("td:eq(2)").text() + "</option>";
                    }
                });
            }
            tr = "<tr id='tr_line_" + rowindex + "'>";
            tr = tr + "<td><input type='checkbox' name='check' id='check_" + rowindex + "'></td>";
            if (doctype == "GR") {
                tr = tr + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_by_line(" + rowindex + ")'><i class='fa fa-fw fa-remove'></i></span></td>";
            }
            else {
                tr = tr + "<td><span class='input-group-addon input-group-addon-remove' onclick='remove_by_line_grpo_non(" + rowindex + ")'><i class='fa fa-fw fa-remove'></i></span></td>";
            }
            tr = tr + "<td><div class='input-group'><input type='text' class='form-control noborder' id='txt_line_itemname_" + rowindex + "' placeholder='Description' value='" + $("#td_pop_line_filer_item_name_" + id).text() + "'><div class='input-group-addon'><i class='fa fa-industry text-info' onclick='cmd_show_Item_list(" + rowindex + ")' style='cursor:pointer'></i></div></div></td >";

            if ($("#td_pop_line_filer_manage_by_" + id).text() == "N") {
                tr = tr + "<td><div class='form-group'><input type='text' style='text-align:left' class='form-control form-control-insde' id='txt_line_qty_" + rowindex + "' value='" + convert4digit($("#td_pop_line_filer_boq_qty_" + id).text()) + "' onchange='change_line(" + rowindex + ")'></div></td>";
            }
            else {
                tr = tr + "<td><div class='input-group'>";
                tr = tr + "<input type='text' style='text-align:left' class='form-control form-control-insde' id='txt_line_qty_" + rowindex + "' value='" + convert4digit($("#td_pop_line_filer_boq_qty_" + id).text()) + "' onchange='change_line(" + rowindex + ")'>";
                tr = tr + "<div class='input-group-addon'>";
                tr = tr + "<i class='fa fa-circle text-info' onclick='cmd_line_summary_show_manage_by_click(1)' style='cursor: pointer'></i>";
                tr = tr + "</div>";
                tr = tr + "</div></td>";
            }
            tr = tr + "<td><div class='form-group'><select class='form-control' disabled id='cbo_line_uom_" + rowindex + "'>" + uomoption + "</select></div></td>";
            tr = tr + "<td><div class='form-group'><input type ='text' readonly='readonly' class='form-control form-control-inside' id='txt_line_price_" + rowindex + "' placeholder = 'Price' value='" + convert4digit($("#td_pop_line_filer_uprice_" + id).text()) + "' onchange='change_line(" + rowindex + ")'></div></td>";
            if (doctype == "GR") {
                tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' readonly='readonly' class='form-control form-control-inside' id='txt_line_disc_per_" + rowindex + "' placeholder = 'Dis%' value='" + convert2digit($("#td_pop_line_filer_dis_per_" + id).text()) + "' onchange='change_line(" + rowindex + ")'></div></td>";
                tr = tr + "<td style='display:none'><div class='form-group'><input type ='text' readonly='readonly' class='form-control form-control-inside' id='txt_line_disc_amt_" + rowindex + "' placeholder = 'Dis Amt' value='" + convert2digit($("#td_pop_line_filer_dis_amt_" + id).text()) + "' onchange='change_line(" + rowindex + ")'></div></td>";
            }
            else {
                tr = tr + "<td><div class='form-group'><input type ='text' readonly='readonly' class='form-control form-control-inside' id='txt_line_disc_per_" + rowindex + "' placeholder = 'Dis%' value='" + convert2digit($("#td_pop_line_filer_dis_per_" + id).text()) + "' onchange='change_line(" + rowindex + ")'></div></td>";
                tr = tr + "<td><div class='form-group'><input type ='text' readonly='readonly' class='form-control form-control-inside' id='txt_line_disc_amt_" + rowindex + "' placeholder = 'Dis Amt' value='" + convert2digit($("#td_pop_line_filer_dis_amt_" + id).text()) + "' onchange='change_line(" + rowindex + ")'></div></td>";
            }
            tr = tr + "<td><div class='form-group'><input type ='text' readonly='readonly' class='form-control form-control-inside' id='txt_line_total_" + rowindex + "' placeholder = 'Total' value='" + convert2digit($("#td_pop_line_filer_line_total_" + id).text()) + "'></div></td>";

            ///alert(whsoption);

            tr = tr + "<td><div class='input-group'>";
            tr = tr + "<select class='form-control' id='cbo_line_whs_" + rowindex + "' onchange='change_line_whs(" + rowindex + ")'>" + whsoption + "</select>";
            tr = tr + "<div class='input-group-addon' style='display:none' id='dv_line_isbin_" + rowindex + "'>";
            tr = tr + "<i class='fa fa-circle text-info' style='cursor: pointer' onclick='cmd_line_summary_show_bin_location_click(" + rowindex + ")'></i>";
            tr = tr + "</div>";
            tr = tr + "</div></td>";

            if (doctype == "GR") {
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' disabled id='txt_line_ocrcode2_" + rowindex + "'><option value='" + $("#td_pop_line_filer_ocrcode2_" + id).text() + "'>" + $("#td_pop_line_filer_ocrcode2_name_" + id).text() + "</option></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' disabled id='txt_line_ocrcode3_" + rowindex + "'><option value='" + $("#td_pop_line_filer_ocrcode3_" + id).text() + "'>" + $("#td_pop_line_filer_ocrcode3_name_" + id).text() + "</option></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' disabled id='txt_line_ocrcode2_" + rowindex + "'><option value='" + $("#td_pop_line_filer_main_code_" + id).text() + "'>" + $("#td_pop_line_filer_main_name_" + id).text() + "</option></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' disabled id='txt_line_ocrcode2_" + rowindex + "'><option value='" + $("#td_pop_line_filer_sub_code_" + id).text() + "'>" + $("#td_pop_line_filer_sub_name_" + id).text() + "</option></select></td>";
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' disabled id='txt_line_ocrcode2_" + rowindex + "'><option value='" + $("#td_pop_line_filer_floor_code_" + id).text() + "'>" + $("#td_pop_line_filer_floor_name_" + id).text() + "</option></select></td>";
            }
            else {
                tr = tr + "<td style='text-align:center;' class='smart_table_border'><select class='form-control' disabled id='txt_line_ocrcode2_" + rowindex + "' onchange='get_line_house_list(" + rowindex + ")'>" + block + "</select></td>";
            }
            tr = tr + "<td style='display:none' id='td_line_base_entry_" + rowindex + "'>" + $("#td_pop_line_filer_base_entry_" + id).text() + "</td>";
            tr = tr + "<td style='display:none' id='td_line_base_line_" + rowindex + "'>" + $("#td_pop_line_filer_base_line_" + id).text() + "</td>";
            tr = tr + "<td style='display:none' id='td_line_base_obj_" + rowindex + "'>" + $("#td_pop_line_filer_base_obj_" + id).text() + "</td>";
            tr = tr + "<td style='display:none' id='td_line_line_num_" + rowindex + "'>-1</td>";

            //tr = tr + "<td style='display:none' id='td_line_line_status_" + rowindex + "'>Active</td>";
            tr = tr + "<td style='display:none' id='td_line_brand_code_" + rowindex + "'>" + $("#td_pop_line_filer_brand_code_" + id).text() + "</td>";
            tr = tr + "<td style='display:none' id='td_line_global_code_" + rowindex + "'>" + $("#td_pop_line_filer_globalcode_" + id).text() + "</td>";
            tr = tr + "<td style='display:none' id='td_line_item_code_" + rowindex + "'>" + $("#td_pop_line_filer_item_code_" + id).text() + "</td>";
            tr = tr + "<td style='display:none' id='td_line_item_name_" + rowindex + "'>" + $("#td_pop_line_filer_item_name_" + id).text() + "</td>";


            tr = tr + "<td style='display:none' id='td_line_cbo_ocrcode_" + rowindex + "'></td>";
            tr = tr + "<td style='display:none' id='td_line_ocrcode2_" + rowindex + "'>" + blockcode + "</td>";
            tr = tr + "<td style='display:none' id='td_line_ocrcode3_" + rowindex + "'>" + $("#td_pop_line_filer_ocrcode3_" + id).text() + "</td>";

            tr = tr + "<td style='display:none' id='td_line_main_code_" + rowindex + "'>" + $("#td_pop_line_filer_main_code_" + id).text() + "</td>";
            tr = tr + "<td style='display:none' id='td_line_sub_code_" + rowindex + "'>" + $("#td_pop_line_filer_sub_code_" + id).text() + "</td>";
            tr = tr + "<td style='display:none' id='td_line_floor_code_" + rowindex + "'>" + $("#td_pop_line_filer_floor_code_" + id).text() + "</td>";

            tr = tr + "<td style='display:none' id='td_line_ocrcode3_name_" + rowindex + "'>" + $("#td_pop_line_filer_ocrcode3_name_" + id).text() + "</td>";
            tr = tr + "<td style='display:none' id='td_line_floor_name_" + rowindex + "'>" + $("#td_pop_line_filer_floor_name_" + id).text() + "</td>";


            tr = tr + "<td style='display:none' id='td_line_price_after_dis_" + rowindex + "'>" + convert4digit($("#td_pop_line_filer_price_after_dis_" + id).text()) + "</td>";
            tr = tr + "<td style='display:none' id='td_line_net_total_price_" + rowindex + "'>" + convert4digit($("#td_pop_line_filer_net_price_" + id).text()) + "</td>";

            //tr = tr + "<td style='display:none' id='td_line_vat_amount_" + rowindex + "'>0</td>";
            //tr = tr + "<td style='display:none' id='td_line_ocrcode_" + rowindex + "'>" + $("#td_pop_line_filer_ocrcode_" + id).text() + "</td>";
            tr = tr + "<td style='display:none' id='td_line_is_batch_" + rowindex + "'>" + $("#td_pop_line_filer_manage_by_" + id).text() + "</td>";
            tr = tr + "<td style='display:none' id='td_line_enable_bin_" + rowindex + "'></td>";
            tr = tr + "<td style='display:none' id='td_line_detail_id_" + rowindex + "'>" + rowindex + "</td>";
            tr = tr + "<td style='display:none' id='td_line_avail_po_" + rowindex + "'>0</td>";

            tr = tr + "</tr >";
            $("#table_line_item>tbody").append(tr);
            var whs = $("#cbo_line_detail_whs_" + rowindex).val();

            $("#table_whs > tbody>tr").each(function () {
                if ($(this).find("td:eq(0)").text() == whs) {
                    if ($(this).find("td:eq(3)").text() == "Y") {
                        $("#dv_line_isbin_" + rowindex).show();
                        $("#line_detail_item_enable_bin_" + rowindex).text("Y");
                    }
                    else {
                        $("#dv_line_isbin_" + rowindex).hide();
                        $("#line_detail_item_enable_bin_" + rowindex).text("N");
                    }
                }
            });
            rowindex++;
        }
    });
    $("#modal_document").modal("hide");
    sum_no_summary_document();
    //cmd_line_summary_show_manage_by_click(0,'Update');
    AddBlank();
}
function change_line(rowindex) {
    var qty = returnstringvalue($("#txt_line_qty_" + rowindex).val());
    var price = returnstringvalue($("#txt_line_price_" + rowindex).val());
    var disper = returnstringvalue($("#txt_line_disc_per_" + rowindex).val());
    var disamt = returnstringvalue($("#txt_line_disc_amt_" + rowindex).val());
    var price_after_dis = returnstringvalue($("#td_line_price_after_dis_" + rowindex).text());

    var total = parseFloat(qty) * parseFloat(price_after_dis);

    $("#txt_line_qty_" + rowindex).val(convert4digit(qty));
    $("#txt_line_price_" + rowindex).val(convert4digit(price));
    $("#txt_line_disc_per_" + rowindex).val(convert2digit(disper));
    $("#txt_line_disc_amt_" + rowindex).val(convert2digit(disamt));
    $("#txt_line_total_" + rowindex).val(convert2digit(total));

    sum_no_summary_document();
}
function sum_no_summary_document() {
    var sum_sub_total = 0;
    $("#table_line_item>tbody>tr").each(function () {
        var id = $(this).attr('id').replace("tr_line_", "");
        if (id != "999") {
            var total = parseFloat(returnstringvalue($("#txt_line_qty_" + id).val())) * parseFloat(returnstringvalue($("#td_line_price_after_dis_" + id).text()));
            sum_sub_total = parseFloat(returnstringvalue(sum_sub_total)) + parseFloat(total);
        }
    });
    $("#txt_sub_total").val(convert2digit(sum_sub_total));
    sum_doc_total(sum_sub_total);
}
function check_document_summary_detail(summaryid) {
    $("#td_summary_check_all_" + summaryid).hide();
    $("#td_summary_uncheck_all_" + summaryid).show();
    var check_detail_name = "name_line_detail_checkbox_" + summaryid;
    $("input:checkbox[name=" + check_detail_name + "]").prop('checked', true);

}
function uncheck_document_summary_detail(summaryid) {
    $("#td_summary_check_all_" + summaryid).show();
    $("#td_summary_uncheck_all_" + summaryid).hide();
    var check_detail_name = "name_line_detail_checkbox_" + summaryid;
    $("input:checkbox[name=" + check_detail_name + "]").prop('checked', false);
}
function cmd_copy_from(type) {
    if (type == "PR") {
        $("#pop_h5").text("Purchase Request Filter");
        $("#lbl_doc_num").text("PR No");
        $("#txt_pop_up_search_doc_num").attr("placeholder", "PR No");
        $("#td_table_document").text("PR No");
    }
    if (type == "PQ") {
        $("#pop_h5").text("Purchase Quotation Filter");
        $("#lbl_doc_num").text("PQ No");
        $("#txt_pop_up_search_doc_num").attr("placeholder", "PQ No");
        $("#td_table_document").text("PQ No");
    }
    if (type == "PO") {
        $("#pop_h5").text("Purchase Order Filter");
        $("#lbl_doc_num").text("PO No");
        $("#txt_pop_up_search_doc_num").attr("placeholder", "PO No");
        $("#td_table_document").text("PO No");
    }
    if (type == "GRPO") {
        $("#pop_h5").text("Goods Receipt PO Filter");
        $("#lbl_doc_num").text("GRPO No");
        $("#txt_pop_up_search_doc_num").attr("placeholder", "GRPO No");
        $("#td_table_document").text("GRPO No");
    }
    if (type == "TRR") {
        $("#pop_h5").text("Transfer Request Filter");
        $("#lbl_doc_num").text("TRR No");
        $("#txt_pop_up_search_doc_num").attr("placeholder", "TRR No");
        $("#td_table_document").text("TRR No");
    }
    var allow = 0;
    if ($("#cbo_ocrcode").val() == "") {
        ShowAlert("Project is required");
        allow = 1;
    }
    //if ($("#txt_vendor_code").val() == "") {
    //    ShowAlert("Please choose vendor");
    //    allow = 2;
    //}
    if (allow == 0) {
        $("#modal_document").modal('show');
        $("#txt_copy_from").val(type);
        $("#table_popup_document_list >tbody >tr").remove();
        uncheck_pop_document_all();
    }
}

function cmd_remove_summary_detail_all_row() {
    $("#table_summary_detail > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var detail_id = this.id.replace("checkbox_line_detail_checkbox_", "");
            var summary_id = $(this).attr('name').replace("name_line_detail_checkbox_", "");
            cmd_line_remove_detail(detail_id, summary_id);
        }
    });
}
function cmd_remove_summary_detail_all_document_row() {
    $("#table_summary_detail > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var detail_id = this.id.replace("checkbox_line_detail_checkbox_", "");

            var summary_id = $(this).attr('name').replace("name_line_detail_checkbox_", "");
            cmd_line_remove_detail_document(detail_id, summary_id);
        }
    });
}

function cmd_check_all() {
    $("#th_check_all").hide();
    $("#th_uncheck_all").show();
    $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text() == "S") {
            summaryid = $(this).attr('id').replace("td_summary_", "");
            check_document_summary_detail(summaryid);
        }
    });
}
function cmd_uncheck_all() {
    $("#th_uncheck_all").hide();
    $("#th_check_all").show();
    $('#table_summary_detail > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text() == "S") {
            summaryid = $(this).attr('id').replace("td_summary_", "");
            uncheck_document_summary_detail(summaryid);
        }
    });
}

function returnstringvalue(val) {
    var x = "";
    try {
        x = val.replace(",", "");
        x = x.replace(",", "");
        x = x.replace(",", "");
        x = x.replace(",", "");
        x = x.replace(",", "");
    }
    catch (ex) { x = val; }
    return x;
}
function convert2digit(val) {
    if (val == "") {
        val = "0";
    }
    return parseFloat(returnstringvalue(val)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function convert4digit(val) {
    if (val == "") {
        val = "0";
    }
    var str = parseFloat(returnstringvalue(val)).toFixed(4).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //var index = str.indexOf(".");
    let position = str.indexOf(".");
    var x = str.substring(0, position);
    var y = str.substring(position + 1, str.Length);
    var r = x + '.' + y.replace(',', '');

    //var strval = str + "Index:" + index;
    return r;

}
function convert6digit(val) {
    if (val == "") {
        val = "0";
    }
    return parseFloat(returnstringvalue(val)).toFixed(6);
}
function cmd_line_show_detail(summaryid) {
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
function cmd_collapse_expand() {
    var btnText = $("#btnColExpand").text().trim();
    if (btnText == "Collapse") {
        $("#table_summary_detail > tbody  > tr").each(function () {
            if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text() == "S") {
                var summaryid = $(this).attr('id').replace("td_summary_", "");
                var detail = "name_tr_detail_" + summaryid;
                $("[name=" + detail + "]").hide();
                $("#td_is_summary_" + summaryid).text("H");
            }
        });
        $("#btnColExpand").text("Expand");
    } else {
        $("#table_summary_detail > tbody  > tr").each(function () {
            if ($(this).find("td:eq(1)").text() == "H" || $(this).find("td:eq(1)").text() == "S") {
                var summaryid = $(this).attr('id').replace("td_summary_", "");
                var detail = "name_tr_detail_" + summaryid;
                $("[name=" + detail + "]").show();
                $("#td_is_summary_" + summaryid).text("S");
            }
        });
        $("#btnColExpand").text("Collapse");
    }
}

function txt_doc_dis_per_change() {
    var subtotal = returnstringvalue($("#txt_sub_total").val());
    var dis_per = returnstringvalue(convert2digit($("#txt_doc_dis_per").val()));
    var dis_amt = parseFloat(subtotal) * (parseFloat(dis_per) / 100);
    $("#txt_doc_dis_amt").val(convert2digit(dis_amt));
    $("#txt_sub_total").val(convert2digit(subtotal));
    sum_doc_total(subtotal);
    $("#txt_doc_dis_per").val(convert2digit(dis_per));
}
function cmd_line_remove_summary(summaryid) {
    if ($("#td_line_summary_line_num_" + summaryid).text() != -1) {
        add_to_tbl_remove_by_summary(summaryid);
    }
    var namedetail = "name_tr_detail_" + summaryid;
    $("#td_summary_" + summaryid).remove();
    $("[name=" + namedetail + "]").remove();

    $("#td_batch_item_brand_" + summaryid).remove();
    $("#tr_batch_item_" + summaryid).remove();
    namedetail = "name_batch_item_" + summaryid;
    $("[name=" + namedetail + "]").remove();
    if ($("#table_summary_detail>tbody>tr").length == 0) {
        $("#txt_doc_dis_per").val("0.00");
        $("#txt_sub_total").val("0.00");
    }
    txt_doc_dis_per_change();
    change_line_summary(summaryid, 2);
}
function cmd_line_remove_detail(id, summaryid) {
    if ($("#line_detail_item_line_num_" + id).text() != -1) {
        add_to_tbl_remove($("#td_line_summary_line_num_" + summaryid).text(), $("#line_detail_item_line_num_" + id).text());
    }
    $("#tr_detail_" + id).remove();
    sum_detail_by_header_id(summaryid);
    if ($("input[name=name_line_detail_qty_" + summaryid + "]").length == 0) {
        $("#td_summary_" + summaryid).remove();
    }
    //change_line_summary_qty(summaryid, 1, isboq);
    txt_doc_dis_per_change();
}
function cmd_line_remove_detail_general_pr(id, summaryid) {
    if ($("#line_detail_item_line_num_" + id).text() != -1) {
        add_to_tbl_remove($("#td_line_summary_line_num_" + summaryid).text(), $("#line_detail_item_line_num_" + id).text());
    }
    $("#tr_detail_" + id).remove();
    sum_detail_by_header_id(summaryid);
    if ($("input[name=name_detail_qty_" + summaryid + "]").length == 0) {
        $("#td_summary_" + summaryid).remove();
    }
}
function cmd_line_remove_summary_pq(summaryid) {
    if ($("#txt_line_summary_line_num_" + summaryid).text() != -1) {
        add_to_tbl_remove_by_summary_pq(summaryid);
    }
    var namedetail = "name_tr_detail_" + summaryid;
    $("#td_summary_" + summaryid).remove();
    $("[name=" + namedetail + "]").remove();
    ReCalculate_detail_Total_for_Last_Line(summaryid);
    update_summary_after_change_detail(summaryid);
    txt_doc_dis_per_change();
}
function cmd_line_remove_detail_document(id, summaryid) {
    if ($("#line_detail_line_num_" + id).text() != -1) {
        add_to_tbl_remove($("#txt_line_summary_line_num_" + summaryid).text(), $("#line_detail_line_num_" + id).text());
    }
    $("#tr_detail_" + id).remove();
    if ($("input[name=name_detail_qty_" + summaryid + "]").length == 0) {
        $("#td_summary_" + summaryid).remove();
    }
    ReCalculate_detail_Total_for_Last_Line(summaryid);
    update_summary_after_change_detail(summaryid);
    txt_doc_dis_per_change();

}
function update_detail_by_summary_id(summaryid, qty, price, disper, disamt, price_after, type) {

    var name_qty_detail = "name_detail_qty_" + summaryid;

    var count_sub = $("input[name=" + name_qty_detail + "]").length;
    var index = 0;
    $("input[name=" + name_qty_detail + "]").each(function () {
        var detail_id = $(this).attr('id').replace("txt_line_detail_qty_", "");
        var detail_qty = 0;
        index++;
        detail_qty = returnstringvalue($("#txt_line_detail_qty_" + detail_id).val());

        var detail_price = returnstringvalue($("#txt_line_detail_price_" + detail_id).val());
        var price_after_discount = 0;
        switch (type) {
            case 1:
                $("#txt_line_detail_qty_" + detail_id).val(convert4digit(qty));
                break;
            case 2:
                $("#txt_line_detail_price_" + detail_id).val(convert4digit(price)).change();
                break;
            case 3:
                $("#txt_line_detail_disc_per_" + detail_id).val(convert2digit(disper));
                var detail_disper = returnstringvalue($("#txt_line_detail_disc_per_" + detail_id).val());
                disamt = parseFloat(detail_price) * (parseFloat(detail_disper) / 100);
                var discount_amount = (detail_qty * detail_price) * (parseFloat(detail_disper) / 100);
                $("#txt_line_detail_disc_amt_" + detail_id).val(convert2digit(discount_amount));

                break;
            case 4:
                $("#txt_line_detail_disc_per_" + detail_id).val(convert2digit(disper));
                var detail_dis_amt = (parseFloat(detail_qty) * parseFloat(detail_price)) * (parseFloat(disper) / 100);
                $("#txt_line_detail_disc_amt_" + detail_id).val(convert2digit(detail_dis_amt));
                var discountpercent = parseFloat(disper) / 100;
                break;
        }
        var detail_price = returnstringvalue($("#txt_line_detail_price_" + detail_id).val());
        var detail_dis = returnstringvalue($("#txt_line_detail_disc_per_" + detail_id).val());
        price_after_discount = parseFloat(detail_price) - (parseFloat(detail_price) * (parseFloat(detail_dis) / 100));
        if (parseFloat(price_after_discount) <= 0) {
            price_after_discount = detail_price;
        }

        $("#txt_line_detail_price_after_dis_" + detail_id).text(price_after_discount);
        var totalnet = convert4digit((parseFloat(returnstringvalue(detail_qty)) * parseFloat(returnstringvalue(price_after_discount))));
        $("#txt_line_detail_net_total_price_" + detail_id).text(totalnet);

        $("#txt_line_detail_total_" + detail_id).val(convert2digit(totalnet));

    });

    if (type == 1) {
        var sumqty_detail = 0;
        $("input[name=" + name_qty_detail + "]").each(function () {
            var detail_id = $(this).attr('id').replace("txt_line_detail_qty_", "");
            sumqty_detail = sumqty_detail + parseFloat(returnstringvalue($("#txt_line_detail_qty_" + detail_id).val()));
        });
        $("#txt_line_summary_qty_" + summaryid).val(convert4digit(sumqty_detail));
    }
}

function change_summary_qty_PO(summaryid) {
    //var sumDetail = 0, lastQty = 0;
    //var lastId = "";
    //var qty = returnstringvalue($("#txt_line_summary_qty_" + summaryid).val());
    //$("#txt_line_summary_qty_" + summaryid).val(convert4digit(qty));
    //namedetail = "name_detail_qty_" + summaryid;
    //var rowCounter = $("input[name=" + namedetail + "]").length;

    //var lineqty = parseFloat(qty) / parseFloat(rowCounter);
    //$("input[name=" + namedetail + "]").each(function () {
    //    $(this).val(convert4digit(lineqty)).change();
    //    sumDetail = parseFloat(returnstringvalue(sumDetail)) + parseFloat(returnstringvalue(convert4digit(lineqty)));
    //    lastId = $(this).attr('id');
    //});
    //setTimeout(
    //    function () {
    //        sumDetail = parseFloat(returnstringvalue(sumDetail)) - parseFloat(returnstringvalue(convert4digit(lineqty)));
    //        lastQty = parseFloat(returnstringvalue(qty)) - parseFloat(returnstringvalue(sumDetail));
    //        $("#" + lastId).val(convert4digit(lastQty)).change();                                                                                                                                                      
    //    }, 500
    //);

    var sumDetail = 0, lastQty = 0;
    var lastId = "";
    var qty = returnstringvalue($("#txt_line_summary_qty_" + summaryid).val());
    $("#txt_line_summary_qty_" + summaryid).val(convert4digit(qty));

    namedetail = "name_detail_qty_" + summaryid;

    $("input[name=" + namedetail + "]").each(function () {
        var detailid = $(this).attr('id').replace("txt_line_detail_qty_", "");
        var lineqty = $("#line_detail_item_base_avil_qty_" + detailid).val();
        if (parseFloat(lineqty) <= parseFloat(returnstringvalue(qty))) {
            $("#txt_line_detail_qty_" + detailid).val(convert4digit(lineqty));
            qty = parseFloat(qty) - parseFloat(lineqty);
        }
        else {
            $("#txt_line_detail_qty_" + detailid).val(convert4digit(qty));
            qty = 0;
        }
        change_line_qty(detailid, summaryid);
    });
}
function change_line_detail(detailid, summaryid, type) {
    var base_avil_qty = returnstringvalue($("#line_detail_item_base_avil_qty_" + detailid).val());
    var qty = returnstringvalue($("#txt_line_detail_qty_" + detailid).val());
    var base_avil = 0;
    if ($("#line_detail_item_base_avil_qty_" + detailid).val() == "") {
        base_avil = qty;
    }
    else {
        base_avil = returnstringvalue($("#line_detail_item_base_avil_qty_" + detailid).val());
    }
    if (parseFloat(qty) > parseFloat(base_avil) && parseFloat(base_avil) >= 0) {////check only when add mode and edit mode put -1 to condiction 
        ShowAlert("Inputted Quantity is greater than available quantity");
        qty = base_avil_qty;
        $("#txt_line_detail_qty_" + detailid).val(convert4digit(qty));
    }
    qty = returnstringvalue($("#txt_line_detail_qty_" + detailid).val());

    var price = returnstringvalue($("#txt_line_detail_price_" + detailid).val());
    var discper = returnstringvalue($("#txt_line_detail_disc_per_" + detailid).val());
    var discamt = returnstringvalue($("#txt_line_detail_disc_amt_" + detailid).val());
    var total = returnstringvalue($("#txt_line_detail_total_" + detailid).val());
    var price_after_discount = 0;

    $("#txt_line_detail_qty_" + detailid).val(convert4digit(qty));
    $("#txt_line_detail_price_" + detailid).val(convert4digit(price));
    $("#txt_line_detail_disc_per_" + detailid).val(convert2digit(discper));
    $("#txt_line_detail_disc_amt_" + detailid).val(convert2digit(discamt))
    $("#txt_line_detail_total_" + detailid).val(convert2digit(total));
    var toline = parseFloat(price) * parseFloat(qty);

    if (type == 3) {
        ///Change Dis %
        if (parseFloat(discper) == 0) {
            price_after_discount = price;
            $("#txt_line_detail_disc_amt_" + detailid).val(convert2digit(discper));
        }
        else {
            //price_after_discount = parseFloat(qty) * parseFloat(price);
            price_after_discount = parseFloat(price) - (price * (parseFloat(discper) / 100));
            discamt = (parseFloat(toline) * (parseFloat(discper) / 100));
            $("#txt_line_detail_disc_amt_" + detailid).val(convert2digit(discamt));
        }
    }
    else if (type == 4) {
        //Change Dis Amount
        if (parseFloat(discamt) == 0) {
            price_after_discount = price;
            $("#txt_line_detail_disc_per_" + detailid).val(convert2digit(discamt));
        }
        else {
            //price_after_discount = parseFloat(qty) * parseFloat(price);
            $("#txt_line_detail_disc_per_" + detailid).val("0.00");
            discper = (discamt / parseFloat(toline)) * 100;
            price_after_discount = parseFloat(price) - (price * (parseFloat(discper) / 100));
            $("#txt_line_detail_disc_per_" + detailid).val(convert2digit(discper));
        }
    }
    else {
        discamt = (parseFloat(toline) * (parseFloat(discper) / 100));
        $("#txt_line_detail_disc_amt_" + detailid).val(convert2digit(discamt));
        price_after_discount = parseFloat(price) - (parseFloat(price) * (parseFloat(discper) / 100));
    }

    $("#txt_line_detail_price_after_dis_" + detailid).text(price_after_discount);
    total = parseFloat(qty) * parseFloat(price_after_discount)
    total = convert4digit(total);
    var str = returnstringvalue(total).toString();
    var total2digit = str.slice(0, str.indexOf(".") + 3);

    $("#txt_line_detail_total_" + detailid).val(convert2digit(total2digit));
    $("#txt_line_detail_net_total_price_" + detailid).text(returnstringvalue(total));

    ReCalculate_detail_Total_for_Last_Line(summaryid);

    update_summary_after_change_detail(summaryid);

}
function change_line_detail_Service(detailid, summaryid, type) {
    var base_avil_qty = returnstringvalue($("#line_detail_item_base_avil_qty_" + detailid).val());
    var qty = returnstringvalue($("#txt_line_detail_qty_" + detailid).val());
    var base_avil = 0;
    if ($("#line_detail_item_base_avil_qty_" + detailid).val() == "") {
        base_avil = qty;
    }
    else {
        base_avil = returnstringvalue($("#line_detail_item_base_avil_qty_" + detailid).val());
    }
    if (parseFloat(qty) > parseFloat(base_avil) && parseFloat(base_avil) >= 0) {////check only when add mode and edit mode put -1 to condiction 
        ShowAlert("Inputted Quantity is greater than available quantity");
        qty = 0;
        $("#txt_line_detail_qty_" + detailid).val("0.00");
    }
    qty = returnstringvalue($("#txt_line_detail_qty_" + detailid).val());

    var price = returnstringvalue($("#txt_line_detail_price_" + detailid).val());
    var discper = returnstringvalue($("#txt_line_detail_disc_per_" + detailid).val());
    var discamt = returnstringvalue($("#txt_line_detail_disc_amt_" + detailid).val());
    var total = returnstringvalue($("#txt_line_detail_total_" + detailid).val());
    var price_after_discount = 0;

    $("#txt_line_detail_qty_" + detailid).val(convert4digit(qty));
    $("#txt_line_detail_price_" + detailid).val(convert4digit(price));
    $("#txt_line_detail_disc_per_" + detailid).val(convert2digit(discper));
    $("#txt_line_detail_disc_amt_" + detailid).val(convert2digit(discamt))
    $("#txt_line_detail_total_" + detailid).val(convert2digit(total));
    var toline = parseFloat(price) * parseFloat(qty);

    if (type == 3) {
        ///Change Dis %
        if (parseFloat(discper) == 0) {
            price_after_discount = price;
            $("#txt_line_detail_disc_amt_" + detailid).val(convert2digit(discper));
        }
        else {
            //price_after_discount = parseFloat(qty) * parseFloat(price);
            price_after_discount = parseFloat(price) - (price * (parseFloat(discper) / 100));
            discamt = (parseFloat(toline) * (parseFloat(discper) / 100));
            $("#txt_line_detail_disc_amt_" + detailid).val(convert2digit(discamt));
        }
    }
    else if (type == 4) {
        //Change Dis Amount
        if (parseFloat(discamt) == 0) {
            price_after_discount = price;
            $("#txt_line_detail_disc_per_" + detailid).val(convert2digit(discamt));
        }
        else {
            //price_after_discount = parseFloat(qty) * parseFloat(price);
            $("#txt_line_detail_disc_per_" + detailid).val("0.00");
            discper = (discamt / parseFloat(toline)) * 100;
            price_after_discount = parseFloat(price) - (price * (parseFloat(discper) / 100));
            $("#txt_line_detail_disc_per_" + detailid).val(convert2digit(discper));
        }
    }
    else {
        discamt = (parseFloat(toline) * (parseFloat(discper) / 100));
        $("#txt_line_detail_disc_amt_" + detailid).val(convert2digit(discamt));
        price_after_discount = parseFloat(price) - (parseFloat(price) * (parseFloat(discper) / 100));
    }

    $("#txt_line_detail_price_after_dis_" + detailid).text(price_after_discount);
    total = parseFloat(qty) * parseFloat(price_after_discount)
    total = convert4digit(total);
    var str = returnstringvalue(total).toString();
    var total2digit = str.slice(0, str.indexOf(".") + 3);

    $("#txt_line_detail_total_" + detailid).val(convert2digit(total2digit));
    $("#txt_line_detail_net_total_price_" + detailid).text(returnstringvalue(total));
    ReCalculate_detail_Total_for_Last_Line(summaryid);
}
function update_summary_after_change_detail(summaryid, type) {
    var total_qty = 0;
    var name_qty_detail = "name_detail_qty_" + summaryid;
    $("input[name=" + name_qty_detail + "]").each(function () {
        var detail_id = $(this).attr('id').replace("txt_line_detail_qty_", "");
        total_qty = parseFloat(total_qty) + parseFloat(returnstringvalue($("#txt_line_detail_qty_" + detail_id).val()));
    });
    $("#txt_line_summary_qty_" + summaryid).val(convert4digit(total_qty));
    var qty = returnstringvalue($("#txt_line_summary_qty_" + summaryid).val());
    var price = returnstringvalue($("#txt_line_summary_price_" + summaryid).val());
    var discper = returnstringvalue($("#txt_line_summary_dis_per_" + summaryid).val());
    var discamt = returnstringvalue($("#txt_line_summary_dis_amt_" + summaryid).val());
    var total = returnstringvalue($("#txt_line_summary_total_" + summaryid).val());
    var price_after_discount = 0;
    price_after_discount = parseFloat(price) - (price * (parseFloat(discper) / 100));

    $("#txt_line_summary_price_after_discount_" + summaryid).text(price_after_discount);
    total = parseFloat(qty) * parseFloat(price_after_discount)

    $("#txt_line_summary_total_" + summaryid).val(convert2digit(total));

    if ($(document).attr('title') == "New PO (Sub-Con BOQ)" || $(document).attr('title') == "New PO (Sub-Con NonBOQ)"
        || $(document).attr('title') == "Edit PO (Sub-Con BOQ)" || $(document).attr('title') == "Edit PO (Sub-Con Non-BOQ)"
        || $(document).attr('title') == "New Cancel Progress Claim(BOQ)" || $(document).attr('title') == "New Cancel Progress Claim(Non-BOQ)"
        || $(document).attr('title') == "Edit Cancel Progress Claim(Non-BOQ)" || $(document).attr('title') == "Edit Cancel Progress Claim(BOQ)") {
        house_counter(summaryid);
    }
}
function house_counter(headerindex) {
    var list_house_counter = [];
    var name_qty_detail = "name_detail_qty_" + headerindex;
    $("input[name=" + name_qty_detail + "]").each(function () {
        var detail_id = $(this).attr('id').replace("txt_line_detail_qty_", "");
        var house = {
            houseCode: $("#line_detail_item_ocrcode3_" + detail_id).text()
        };
        list_house_counter.push(house);
    });
    var list_distinct_house = list_house_counter.filter(function (house, i, list_house_counter) {
        return i == list_house_counter.indexOf(house);
    });
    if (list_distinct_house != null) {
        $("#txt_line_summary_noofhouse_" + headerindex).val(list_distinct_house.length)
    }
}
function ReCalculate_detail_Total_for_Last_Line(summaryid) {
    var name_qty_detail = "name_detail_qty_" + summaryid;
    var amount_after_4digit = 0.0000;
    var count_sub = $("input[name=" + name_qty_detail + "]").length;
    var index = 0;
    var sum_total = 0;
    $("input[name=" + name_qty_detail + "]").each(function () {
        index++;
        var detail_id = $(this).attr('id').replace("txt_line_detail_qty_", "");
        sum_total = parseFloat(returnstringvalue(sum_total)) + parseFloat(returnstringvalue($("#txt_line_detail_total_" + detail_id).val()));
    });
    $("#txt_line_summary_total_" + summaryid).val(convert2digit(sum_total));
    sum_sub_summary_detail();
}
function change_line_summary_whs(summaryid) {
    var name = "name_detail_whs_code_" + summaryid;
    var whscode = $("#cbo_line_summary_whs_" + summaryid).val();
    $("select[name=" + name + "]").each(function () {
        $(this).val(whscode);
    });
}
function change_line_summary(summaryid, type) {

    var qty = returnstringvalue($("#txt_line_summary_qty_" + summaryid).val());
    var price = returnstringvalue($("#txt_line_summary_price_" + summaryid).val());
    var discper = returnstringvalue($("#txt_line_summary_dis_per_" + summaryid).val());
    var discamt = returnstringvalue($("#txt_line_summary_dis_amt_" + summaryid).val());
    var total = returnstringvalue($("#txt_line_summary_total_" + summaryid).val());
    var price_after_discount = 0;

    $("#txt_line_summary_qty_" + summaryid).val(convert4digit(qty));
    $("#txt_line_summary_price_" + summaryid).val(convert4digit(price));
    $("#txt_line_summary_dis_per_" + summaryid).val(convert2digit(discper));
    $("#txt_line_summary_dis_amt_" + summaryid).val(convert2digit(discamt));
    var toline = parseFloat(price) * parseFloat(qty);

    if (type == 3) {
        ///Change Dis %
        if (parseFloat(discper) == 0) {
            price_after_discount = price;
            $("#txt_line_summary_dis_amt_" + summaryid).val("0.00");
        }
        else {
            //price_after_discount = parseFloat(qty) * parseFloat(price);
            price_after_discount = parseFloat(price) - ((price) * (parseFloat(discper) / 100));
            discamt = (parseFloat(toline) * (parseFloat(discper) / 100));
            $("#txt_line_summary_dis_amt_" + summaryid).val(convert2digit(discamt));
        }
    }
    else if (type == 4) {
        //Change Dis Amount
        if (parseFloat(discamt) == 0) {
            price_after_discount = price;
            $("#txt_line_summary_dis_per_" + summaryid).val("0.00");
        }
        else {
            //price_after_discount = parseFloat(qty) * parseFloat(price);
            $("#txt_line_summary_dis_per_" + summaryid).val("0.00");
            discper = (discamt / parseFloat(toline)) * 100;
            price_after_discount = parseFloat(price) - (price * (parseFloat(discper) / 100));
            $("#txt_line_summary_dis_per_" + summaryid).val(convert2digit(discper));
        }
    }
    else {
        discamt = (parseFloat(toline) * (parseFloat(discper) / 100));
        $("#txt_line_summary_dis_amt_" + summaryid).val(convert2digit(discamt));
        price_after_discount = parseFloat(price) - (parseFloat(price) * (parseFloat(discper) / 100));
    }

    $("#txt_line_summary_price_after_discount_" + summaryid).text(price_after_discount);

    total = parseFloat(qty) * parseFloat(price_after_discount);

    //alert(qty + "PRice=" + price + "Dis%=" + discper + "DisAmt=" + discamt + " After discount=" + price_after_discount + " total=" + total);

    $("#txt_line_summary_total_" + summaryid).val(convert2digit(total));
    $("#txt_line_summary_pr_total_" + summaryid).val(convert2digit(total));

    var name_qty_detail = "name_detail_qty_" + summaryid;
    var count_sub = $("input[name=" + name_qty_detail + "]").length;
    var newqty = parseFloat(returnstringvalue(qty)) / parseFloat(returnstringvalue(count_sub));
    update_detail_by_summary_id(summaryid, newqty, price, discper, discamt, price_after_discount, type);
    ReCalculate_detail_Total_for_Last_Line(summaryid);
    sum_sub_summary_detail();
    txt_doc_dis_per_change();
}

function add_to_tbl_remove(headLine, detailLine) {
    var index = $("#tbl_Remove_List >tbody >tr").length;
    var data = "<tr id='delelte_Line_" + index + "'>";
    data = data + "<td id='HeadLine_" + index + "'>" + headLine + "</td>";
    data = data + "<td id='DetailLine_" + index + "'>" + detailLine + "</td>";
    data = data + "</tr>";
    $("#tbl_Remove_List >tbody").append(data);
}
function add_to_tbl_remove_by_summary(summaryid) {
    var namedetail = "name_tr_detail_" + summaryid;
    $("[name=" + namedetail + "]").each(function () {
        var detail_id = $(this).attr('id').replace("tr_detail_", "");
        if ($("#line_detail_item_line_num_" + detail_id).text() != -1) {
            add_to_tbl_remove($("#td_line_summary_line_num_" + summaryid).text(), $("#line_detail_item_line_num_" + detail_id).text());
        }
    });
}
function add_to_tbl_remove_by_summary_pq(summaryid) {
    var namedetail = "name_tr_detail_" + summaryid;
    $("[name=" + namedetail + "]").each(function () {
        var detail_id = $(this).attr('id').replace("tr_detail_", "");
        if ($("#line_detail_line_num_" + detail_id).text() != -1) {
            add_to_tbl_remove($("#txt_line_summary_line_num_" + summaryid).text(), $("#line_detail_line_num_" + detail_id).text());
        }
    });
}

function change_line_detail_term(detailid, termindex) {
    var term1 = $("#txt_line_detail_term1_" + detailid).val();
    var term2 = $("#txt_line_detail_term2_" + detailid).val();
    var term3 = $("#txt_line_detail_term3_" + detailid).val();
    var term4 = $("#txt_line_detail_term4_" + detailid).val();
    var term5 = $("#txt_line_detail_term5_" + detailid).val();
    var term6 = $("#txt_line_detail_term6_" + detailid).val();
    var term7 = $("#txt_line_detail_term7_" + detailid).val();
    var term8 = $("#txt_line_detail_term8_" + detailid).val();
    var term9 = $("#txt_line_detail_term9_" + detailid).val();
    var term10 = $("#txt_line_detail_term10_" + detailid).val();
    var sumterm = parseFloat(term1) + parseFloat(term2) + parseFloat(term3) + parseFloat(term4) + parseFloat(term5) + parseFloat(term6) + parseFloat(term7) + parseFloat(term8) + parseFloat(term9) + parseFloat(term10);
    if (sumterm > 100) {
        ShowAlert("Total Term is over 100");
        $("#txt_line_detail_term" + termindex + "_" + detailid).val("0.00");
    }
    term1 = $("#txt_line_detail_term1_" + detailid).val();
    term2 = $("#txt_line_detail_term2_" + detailid).val();
    term3 = $("#txt_line_detail_term3_" + detailid).val();
    term4 = $("#txt_line_detail_term4_" + detailid).val();
    term5 = $("#txt_line_detail_term5_" + detailid).val();
    term6 = $("#txt_line_detail_term6_" + detailid).val();
    term7 = $("#txt_line_detail_term7_" + detailid).val();
    term8 = $("#txt_line_detail_term8_" + detailid).val();
    term9 = $("#txt_line_detail_term9_" + detailid).val();
    term10 = $("#txt_line_detail_term10_" + detailid).val();

    $("#txt_line_detail_term1_" + detailid).val(convert2digit(term1));
    $("#txt_line_detail_term2_" + detailid).val(convert2digit(term2));
    $("#txt_line_detail_term3_" + detailid).val(convert2digit(term3));
    $("#txt_line_detail_term4_" + detailid).val(convert2digit(term4));
    $("#txt_line_detail_term5_" + detailid).val(convert2digit(term5));
    $("#txt_line_detail_term6_" + detailid).val(convert2digit(term6));
    $("#txt_line_detail_term7_" + detailid).val(convert2digit(term7));
    $("#txt_line_detail_term8_" + detailid).val(convert2digit(term8));
    $("#txt_line_detail_term9_" + detailid).val(convert2digit(term9));
    $("#txt_line_detail_term10_" + detailid).val(convert2digit(term10));

}
function change_line_summary_term(summaryid, termindex) {
    var name_qty_detail = "name_detail_qty_" + summaryid;
    var term1 = returnstringvalue($("#txt_line_summary_term1_" + summaryid).val());
    var term2 = returnstringvalue($("#txt_line_summary_term2_" + summaryid).val());
    var term3 = returnstringvalue($("#txt_line_summary_term3_" + summaryid).val());
    var term4 = returnstringvalue($("#txt_line_summary_term4_" + summaryid).val());
    var term5 = returnstringvalue($("#txt_line_summary_term5_" + summaryid).val());
    var term6 = returnstringvalue($("#txt_line_summary_term6_" + summaryid).val());
    var term7 = returnstringvalue($("#txt_line_summary_term7_" + summaryid).val());
    var term8 = returnstringvalue($("#txt_line_summary_term8_" + summaryid).val());
    var term9 = returnstringvalue($("#txt_line_summary_term9_" + summaryid).val());
    var term10 = returnstringvalue($("#txt_line_summary_term10_" + summaryid).val());
    var sumterm = parseFloat(term1) + parseFloat(term2) + parseFloat(term3) + parseFloat(term4) + parseFloat(term5) + parseFloat(term6) + parseFloat(term7) + parseFloat(term8) + parseFloat(term9) + parseFloat(term10);
    if (sumterm > 100) {
        ShowAlert("Total Term is over 100");
        $("#txt_line_summary_term" + termindex + "_" + summaryid).val("0.00");
    }
    if (termindex > 1) {
        var preterm = termindex - 1;
        if (parseFloat(returnstringvalue($("#txt_line_summary_term" + preterm + "_" + summaryid).val())) == 0) {
            ShowAlert("You cannot skip Term(" + preterm + ")");
            $("#txt_line_summary_term" + termindex + "_" + summaryid).val("0.00");
        }
    }
    term1 = $("#txt_line_summary_term1_" + summaryid).val();
    term2 = $("#txt_line_summary_term2_" + summaryid).val();
    term3 = $("#txt_line_summary_term3_" + summaryid).val();
    term4 = $("#txt_line_summary_term4_" + summaryid).val();
    term5 = $("#txt_line_summary_term5_" + summaryid).val();
    term6 = $("#txt_line_summary_term6_" + summaryid).val();
    term7 = $("#txt_line_summary_term7_" + summaryid).val();
    term8 = $("#txt_line_summary_term8_" + summaryid).val();
    term9 = $("#txt_line_summary_term9_" + summaryid).val();
    term10 = $("#txt_line_summary_term10_" + summaryid).val();

    $("#txt_line_summary_term1_" + summaryid).val(convert2digit(term1));
    $("#txt_line_summary_term2_" + summaryid).val(convert2digit(term2));
    $("#txt_line_summary_term3_" + summaryid).val(convert2digit(term3));
    $("#txt_line_summary_term4_" + summaryid).val(convert2digit(term4));
    $("#txt_line_summary_term5_" + summaryid).val(convert2digit(term5));
    $("#txt_line_summary_term6_" + summaryid).val(convert2digit(term6));
    $("#txt_line_summary_term7_" + summaryid).val(convert2digit(term7));
    $("#txt_line_summary_term8_" + summaryid).val(convert2digit(term8));
    $("#txt_line_summary_term9_" + summaryid).val(convert2digit(term9));
    $("#txt_line_summary_term10_" + summaryid).val(convert2digit(term10));


    $("input[name=" + name_qty_detail + "]").each(function () {
        var detail_id = $(this).attr('id').replace("txt_line_detail_qty_", "");
        switch (termindex) {
            case 1:
                if ($("#txt_line_detail_term1_" + detail_id).css('background-color') != "rgb(255, 255, 0)") {
                    $("#txt_line_detail_term1_" + detail_id).val(convert2digit(term1));
                }
                break;
            case 2:
                if ($("#txt_line_detail_term2_" + detail_id).css('background-color') != "rgb(255, 255, 0)") {
                    $("#txt_line_detail_term2_" + detail_id).val(convert2digit(term2));
                }
                break;
            case 3:
                if ($("#txt_line_detail_term3_" + detail_id).css('background-color') != "rgb(255, 255, 0)") {
                    $("#txt_line_detail_term3_" + detail_id).val(convert2digit(term3));
                }
                break;
            case 4:
                if ($("#txt_line_detail_term4_" + detail_id).css('background-color') != "rgb(255, 255, 0)") {
                    $("#txt_line_detail_term4_" + detail_id).val(convert2digit(term4));
                }
                break;
            case 5:
                if ($("#txt_line_detail_term5_" + detail_id).css('background-color') != "rgb(255, 255, 0)") {
                    $("#txt_line_detail_term5_" + detail_id).val(convert2digit(term5));
                }
                break;
            case 6:
                if ($("#txt_line_detail_term6_" + detail_id).css('background-color') != "rgb(255, 255, 0)") {
                    $("#txt_line_detail_term6_" + detail_id).val(convert2digit(term6));
                }
                break;
            case 7:
                if ($("#txt_line_detail_term7_" + detail_id).css('background-color') != "rgb(255, 255, 0)") {
                    $("#txt_line_detail_term7_" + detail_id).val(convert2digit(term7));
                }
                break;
            case 8:
                if ($("#txt_line_detail_term8_" + detail_id).css('background-color') != "rgb(255, 255, 0)") {
                    $("#txt_line_detail_term8_" + detail_id).val(convert2digit(term8));
                }
                break;
            case 9:
                if ($("#txt_line_detail_term9_" + detail_id).css('background-color') != "rgb(255, 255, 0)") {
                    $("#txt_line_detail_term9_" + detail_id).val(convert2digit(term9));
                }
                break;
            case 10:
                if ($("#txt_line_detail_term10_" + detail_id).css('background-color') != "rgb(255, 255, 0)") {
                    $("#txt_line_detail_term10_" + detail_id).val(convert2digit(term10));
                }
                break;
        }
    });
}
function txt_doc_dis_per_change() {
    var subtotal = returnstringvalue($("#txt_sub_total").val());
    var dis_per = returnstringvalue($("#txt_doc_dis_per").val());
    var dis_amt = parseFloat(subtotal) * (parseFloat(dis_per) / 100);
    $("#txt_doc_dis_amt").val(convert2digit(dis_amt));
    $("#txt_sub_total").val(convert2digit(subtotal));
    sum_doc_total(subtotal);
    $("#txt_doc_dis_per").val(convert2digit(dis_per));
}
function txt_doc_dis_amt_change() {
    var subtotal = returnstringvalue($("#txt_sub_total").val());
    var dis_amt = returnstringvalue($("#txt_doc_dis_amt").val());
    var freight = returnstringvalue($("#txt_freight").val());

    var dis_per = (dis_amt / subtotal) * 100;
    $("#txt_doc_dis_per").val(convert2digit(dis_per));
    $("#txt_doc_dis_amt").val(convert2digit(dis_amt));
    $("#txt_freight").val(convert2digit(freight));
    var subtotal = returnstringvalue($("#txt_sub_total").val());
    sum_doc_total(subtotal);
    //txt_doc_dis_per_change();
}
function cbo_tax_group_change() {
    var vat10 = 0;
    if ($("#cbo_tax_group").val() == "VATIN10") {
        vat10 = 0.1;
    }
    var subtotal = returnstringvalue($("#txt_sub_total").val());
    var dis_amt = returnstringvalue($("#txt_doc_dis_amt").val());
    var total_after_disc = parseFloat(subtotal) - parseFloat(dis_amt);
    var tax_amt = total_after_disc * vat10;
    $("#txt_tax").val(convert2digit(tax_amt));
    sum_doc_total(subtotal);
}
function sum_sub_summary_detail() {
    var subtotal = 0;
    $("#table_summary_detail >tbody >tr").each(function () {
        var index = $(this).attr('id').replace("td_summary_", "");
        if ($("#td_summary_is_Sumamry_" + index).text() == "Header") {
            subtotal = parseFloat(subtotal) + parseFloat(returnstringvalue($("#txt_line_summary_total_" + index).val()));
        }
    });
    sum_doc_total(subtotal);
}
function sum_doc_total(subtotal) {
    $("#txt_sub_total").val(convert2digit(subtotal));
    var subtotal = returnstringvalue(subtotal);

    var dis_amount = returnstringvalue($("#txt_doc_dis_amt").val());
    var afterdisc = parseFloat(subtotal) - parseFloat(dis_amount);
    var vatsum = returnstringvalue($("#txt_tax").val());
    var freight = 0;
    freight = returnstringvalue($("#txt_freight").val());
    var doc_total = 0;
    doc_total = parseFloat(afterdisc) + parseFloat(freight) + parseFloat(vatsum);
    $("#txt_doc_total").val(convert2digit(doc_total));
}

function sum_detail_by_header_id(summaryid) {

    var namedetail = "name_line_detail_qty_" + summaryid;
    var sumQty = 0;
    $("input[name=" + namedetail + "]").each(function () {
        sumQty = sumQty + parseFloat(returnstringvalue($(this).val()));
    });
    $("#txt_line_summary_qty_" + summaryid).val(convert4digit(returnstringvalue(sumQty)));
}
function sum_detail_document_by_header_id(detail_id, summaryid) {
    //var namedetail = "name_detail_qty_" + summaryid;
    change_line_detail(detail_id, summaryid);
    //var detail_id = "";
    ////var sumQty = 0;
    //$("input[name=" + namedetail + "]").each(function () {
    //    //sumQty = sumQty + parseFloat(returnstringvalue($(this).val()));

    //});
    ////$("#txt_line_summary_qty_" + summaryid).val(convert2digit(sumQty));

}
function uncheck_all() {
    $('input:checkbox[name="check"]').prop('checked', false);
    $("#th_check").show();
    $("#th_uncheck").hide();
}
function check_all() {
    $('input:checkbox[name="check"]').prop('checked', true);
    $("#th_check").hide();
    $("#th_uncheck").show();
}
function cmd_remove_all_row() {
    $("#table_line_item > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("check_", "");
            remove_by_line(id);
        }
    });
    uncheck_all();
}
function remove_by_line(rowindex) {
    if ($("#td_line_num_" + rowindex).text() != -1) {
        add_to_tbl_remove(0, $("#td_line_num_" + rowindex).text());
    }
    $("#tr_line_" + rowindex).remove();
}
function check_pop_document_all() {
    //checkbox id=ck_pop_boq_boq_
    //checkbox name=pop_boq_chk
    //tr id=tr_pop_boq_
    //table id=table_popup_boq_list
    $("#table_popup_document_list >tbody >tr").each(function (index) {
        var id = $(this).attr('id').replace("tr_pop_boq_", "");
        //alert($("#tr_pop_boq_" + id).css('display') + " // " + $("#tr_pop_boq_" + id).is(":visible") + "//" + $(this).css("display"));
        if ($(this).css("display") == 'none') {
            $("#check_pop_boq_" + id).prop('checked', false);
        }
        else {
            $("#check_pop_boq_" + id).prop('checked', true);
        }
    });
    $("#th_popup_check").hide();
    $("#th_popup_uncheck").show();
}
function clear_document_line_project_change(doctype, boqtype) {
    $("#table_summary_detail > tbody >tr").remove();

    get_Doc_Number(doctype, boqtype);
}
function uncheck_pop_document_all() {
    //checkbox id=ck_pop_boq_
    //checkbox name=pop_boq_chk
    //tr id=tr_pop_boq_
    //table id=table_popup_boq_list
    $("#table_popup_document_list>tbody >tr").each(function (index) {
        if ($(this).css("display") == 'none') {
            $("#check_pop_boq_" + index).prop('checked', false);
        }
        else {
            $("#check_pop_boq_" + index).prop('checked', false);
        }
    });
    $("#th_popup_check").show();
    $("#th_popup_uncheck").hide();
}
function check_pop_master_data_all() {
    //checkbox id=check_pop_master_
    //checkbox name=pop_boq_chk
    //tr id=tr_pop_master_
    //table id=table_popup_item_list
    $("#table_popup_item_list >tbody >tr").each(function (index) {
        var id = $(this).attr('id').replace("tr_pop_master_", "");
        if ($("#tr_pop_master_" + id).css('display') == 'none') {
            $("#check_pop_master_" + id).prop('checked', false);
        }
        else {
            $("#check_pop_master_" + id).prop('checked', true);
        }
    });
    $("#th_popup_master_check").hide();
    $("#th_popup_master_uncheck").show();
}
function uncheck_pop_master_data_all() {
    //checkbox id=check_pop_master_
    //checkbox name=pop_boq_chk
    //tr id=tr_pop_master_
    //table id=table_popup_item_list
    $("#table_popup_item_list >tbody >tr").each(function (index) {
        var id = $(this).attr('id').replace("tr_pop_master_", "");
        if ($("#tr_pop_master_" + id).css('display') == 'none') {
            $("#check_pop_master_" + id).prop('checked', false);
        }
        else {
            $("#check_pop_master_" + id).prop('checked', false);
        }
    });
    $("#th_popup_master_check").show();
    $("#th_popup_master_uncheck").hide();
}

function check_pop_master_data_all_selected() {
    $("#table_popup_item_list_checked >tbody >tr").each(function (index) {
        var id = $(this).attr('id').replace("tr_pop_item_checked_", "");
        if ($("#tr_pop_item_checked_" + id).css('display') == 'none') {
            $("#td_pop_checked_check_box_" + id).prop('checked', false);
        }
        else {
            $("#td_pop_checked_check_box_" + id).prop('checked', true);
        }
    });
    $("#th_popup_master_check_selected").hide();
    $("#th_popup_master_uncheck_selected").show();
}
function uncheck_pop_master_data_all_selected() {
    $("#table_popup_item_list_checked >tbody >tr").each(function (index) {
        var id = $(this).attr('id').replace("tr_pop_item_checked_", "");
        if ($("#tr_pop_item_checked_" + id).css('display') == 'none') {
            $("#td_pop_checked_check_box_" + id).prop('checked', false);
        }
        else {
            $("#td_pop_checked_check_box_" + id).prop('checked', false);
        }
    });
    $("#th_popup_master_check_selected").show();
    $("#th_popup_master_uncheck_selected").hide();
}

function get_house_list(type, boqtype, isboq, doctype) {
    var proid = "cbo_ocrcode";
    var blockid = "cbo_ocrcode2";
    var houseid = "cbo_ocrcode3";
    if (type == 1) {
        $("#" + blockid).val("");
        $("#" + houseid).empty();
    }
    get_house_data(proid, blockid, houseid, isboq);
    get_Doc_Number(doctype, boqtype);

    if (doctype == 'InvGI' || doctype == 'InvGR') {
        option = get_Receiptient(doctype, $("#cbo_ocrcode").val());
        $("#cbo_receiptient").empty();
        $("#cbo_receiptient").append(option);
    }
    if (doctype == 'PR') {
        option = get_Receiptient(doctype, $("#cbo_ocrcode").val());
        $("#txt_requestor").empty();
        $("#txt_requestor").append(option);
    }
}
function get_house_list_service(type, boqtype, isboq, doctype) {
    var proid = "cbo_ocrcode";
    var blockid = "cbo_ocrcode2";
    var houseid = "cbo_ocrcode3";
    if (type == 1) {
        $("#" + blockid).val("00");
        $("#" + houseid).empty();
    }

    get_house_data_service(proid, blockid, houseid, isboq);
    get_Doc_Number(doctype, boqtype);

    if (doctype == 'InvGI' || doctype == 'InvGR') {
        option = get_Receiptient(doctype, $("#cbo_ocrcode").val());
        $("#cbo_receiptient").empty();
        $("#cbo_receiptient").append(option);
    }
    if (doctype == 'PR') {
        option = get_Receiptient(doctype, $("#cbo_ocrcode").val());
        $("#txt_requestor").empty();
        $("#txt_requestor").append(option);
    }
}
function txt_posting_date_change(doctype, boqtype) {
    get_Doc_Number(doctype, boqtype);
    if ((doctype == "PO" || doctype == "GRPO") && (boqtype == "M" || boqtype == "S")) {
        var docdate = $('#txt_posting_date').val().trim().split("-");
        var date = docdate[2] + "/" + docdate[1] + "/" + docdate[0];
        get_rate_by_date("KHR", date);
    }
}
function txt_posting_date_change_Service(doctype, boqtype) {
    get_Doc_Number(doctype, boqtype);
    var docdate = $('#txt_posting_date').val().trim().split("-");
    var date = docdate[2] + "/" + docdate[1] + "/" + docdate[0];
    get_rate_by_date("KHR", date);

}
function get_line_house_list(rowindex) {
    var proid = "txt_line_ocrcode_" + rowindex;
    var blockid = "txt_line_ocrcode2_" + rowindex;
    var houseid = "txt_line_ocrcode3_" + rowindex;
    get_house_data(proid, blockid, houseid);
}
function get_line_house_list_by_block(rowindex) {
    var proid = "cbo_ocrcode";
    var blockid = "txt_line_ocrcode2_" + rowindex;
    var houseid = "txt_line_ocrcode3_" + rowindex;
    get_house_data(proid, blockid, houseid);
}
function get_sub_work_list(boqtype) {
    var mainworkid = "cbo_main_work";
    var subworkid = "cbo_sub_work";
    get_work_data(mainworkid, subworkid, boqtype);
}
function get_line_sub_work_list(rowindex) {
    var mainworkid = "txt_line_main_work_" + rowindex;
    var subworkid = "txt_line_sub_work_" + rowindex;
    get_work_data(mainworkid, subworkid);
}
function set_default_boq() {
    uncheck_all();
    uncheck_pop_document_all();
    $("#txt_pop_up_boq_search_item").val("");
    $("#txt_pop_up_boq_search_item").focus();
}
function cmd_update_cost_all_row() {
    var ocrcode = "";
    var ocrcode2 = "";
    var ocrcode3 = "";
    var ocrcode4 = "";
    var mainworkoption = "";
    var subwork = "";
    var detailwork = "";
    var floorwork = "";
    ///projectoption = "<option value=''></option>";
    $("#cbo_ocrcode > option").each(function () {
        if (this.value == $("#cbo_ocrcode").val()) {
            ocrcode = ocrcode + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            ocrcode = ocrcode + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });
    $("#cbo_ocrcode2 > option").each(function () {
        if (this.value == $("#cbo_ocrcode2").val()) {
            ocrcode2 = ocrcode2 + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            ocrcode2 = ocrcode2 + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });
    $("#cbo_ocrcode3 > option").each(function () {
        if (this.value == $("#cbo_ocrcode3").val()) {
            ocrcode3 = ocrcode3 + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            ocrcode3 = ocrcode3 + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });

    //mainworkoption = "<option value=''></option>";
    $("#cbo_main_work > option").each(function () {
        if (this.value == $("#cbo_main_work").val()) {
            mainworkoption = mainworkoption + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            mainworkoption = mainworkoption + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });

    $("#cbo_sub_work > option").each(function () {
        if (this.value == $("#cbo_sub_work").val()) {
            subwork = subwork + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            subwork = subwork + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });

    ///worktype = "<option value=''></option>";
    $("#cbo_floor_work > option").each(function () {
        if (this.value == $("#cbo_floor_work").val()) {
            floorwork = floorwork + "<option value='" + this.value + "' selected>" + this.text + "</option>";
        }
        else {
            floorwork = floorwork + "<option value='" + this.value + "'>" + this.text + "</option>";
        }
    });


    $('#table_line_item > tbody  > tr').each(function (index, tr) {
        var id = tr.id.replace("tr_line_", "");
        if (id != "999") {
            $("#txt_line_ocrcode_" + id).empty();
            $("#txt_line_ocrcode_" + id).append(ocrcode);
            $("#txt_line_ocrcode2_" + id).empty();
            $("#txt_line_ocrcode2_" + id).append(ocrcode2);
            $("#txt_line_ocrcode3_" + id).empty();
            $("#txt_line_ocrcode3_" + id).append(ocrcode3);

            $("#txt_line_main_work_" + id).empty();
            $("#txt_line_main_work_" + id).append(mainworkoption);

            $("#txt_line_sub_work_" + id).empty();
            $("#txt_line_sub_work_" + id).append(subwork);

            $("#txt_line_floor_work_" + id).empty();
            $("#txt_line_floor_work_" + id).append(floorwork);

        }
    });
}
function cmd_show_Item_list(selectedrowIndex) {
    if ($("#cbo_ocrcode").val() == "") {
        ShowAlert("Project is required");
    } else {
        $("#txtselectrowindex").val(selectedrowIndex);
        $('input:checkbox[name="pop_master_chk"]').prop('checked', false);

        $("#modal_item_list").modal('show');
        uncheck_pop_master_data_all();
    }
}
//function cmd_show_Item_list_service(selectedrowIndex) {
//    if ($("#cbo_ocrcode").val() == "") {
//        ShowAlert("Project is required");
//    } else {
//        $("#txtselectrowindex").val(selectedrowIndex);
//        $('input:checkbox[name="pop_master_chk"]').prop('checked', false);

//        $("#modal_item_list").modal('show');
//        uncheck_pop_master_data_all();
//    }
//}
///For Vendor
function cmd_show_vendor() {
    if ($('#table_summary_detail > tbody  > tr').length > 0 && $("#txt_vendor_code").val() != "") {
        ShowAlert("Vendor need base from PO!");
    } else {
        $("#modal_vendor_list").modal('show');
        tr_pop_vendor_selected(-1);
    }
}
function tr_pop_vendor_selected(selectedindex) {
    $("#table_pop_vendor_list > tbody > tr").each(function (index) {
        $("#tr_pop_vendor_" + (index + 1)).css("background-color", "white");
    });
    $("#tr_pop_vendor_" + selectedindex).css("background-color", "#e6f0ff");
    $("#txt_bp_selected_row").val(selectedindex);
}
function cmd_pop_choose_vendor(checkCurrency) {
    var bprow = $("#txt_bp_selected_row").val();
    var bpcode = $("#td_pop_vendor_vendor_code_" + bprow).text();
    var bpname = $("#td_pop_vendor_vendor_name_" + bprow).text();
    $("#txt_vendor_code").val(bpcode);
    $("#txt_vendor_name").val(bpname);
    $("#modal_vendor_list").modal('hide');
    get_contact(bpcode);
    if (checkCurrency == 'checkCurr') {
        get_currency(bpcode);
    }
    $("#txt_payee").val(get_last_payee(bpcode));
}
function cmd_pop_choose_vendor_report() {
    var bprow = $("#txt_bp_selected_row").val();
    var bpcode = $("#td_pop_vendor_vendor_code_" + bprow).text();
    var bpname = $("#td_pop_vendor_vendor_name_" + bprow).text();
    $("#txt_vendor_code").val(bpcode);
    $("#txt_vendor_name").val(bpname);
    $("#modal_vendor_list").modal('hide');
}
//get data from database
function get_boq_cost_center(boqtype, type, ocrcode, ocrcode2, ocrcode3, maincode, subcode) {
    var option = "";
    $.ajax({
        url: '/getData/get_boq_cost_center_list',
        type: 'POST',
        data: { boqtype: boqtype, type: type, ocrcode: ocrcode, ocrcode2: ocrcode2, ocrcode3: ocrcode3, maincode: maincode, subwork: subcode },
        datatype: 'json',
        async: false,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            option = "<option value=''></option>";
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                option = option + "<option value='" + x.Code + "'>" + x.Name + "</option>";
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
    return option;
}
function get_boq_cost_center_service(boqtype, type, ocrcode, ocrcode2, ocrcode3, maincode, subcode) {
    var option = "";
    $.ajax({
        url: '/getData/get_boq_cost_center_list',
        type: 'POST',
        data: { boqtype: boqtype, type: type, ocrcode: ocrcode, ocrcode2: ocrcode2, ocrcode3: ocrcode3, maincode: maincode, subwork: subcode },
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
                option = option + "<option value='" + x.Code + "'>" + x.Name + "</option>";
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
    return option;
}
function get_Receiptient(DocType, Project) {
    var option = "";
    $.ajax({
        url: '/getData/get_Receiptient_list',
        type: 'POST',
        data: { DocType: DocType, Project: Project },
        datatype: 'json',
        async: false,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            option = "<option value=''></option>";
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                option = option + "<option value='" + x.Code + "'>" + x.Name + "</option>";
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
    return option;
}

function get_contact(cardcode) {
    $.ajax({
        url: '/getData/get_contact',
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
                options = options + "<option value='" + x.Cntctcode + "'>" + x.ENName + "</option>";
            }
            $("#cbo_vendor_contact").append(options);
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_currency(cardcode) {
    $.ajax({
        url: '/getData/get_currency',
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
            $("#cbo_currency").empty();
            options = ""
            options = options + "<option value=''></option>";
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                options = options + "<option value='" + x.CurrCode + "'>" + x.CurrName + "</option>";
                //if (x.CurrCode == "US$") {
                //    options = options + "<option selected value='" + x.CurrCode + "'>" + x.CurrName + "</option>";
                //} else {
                //    options = options + "<option value='" + x.CurrCode + "'>" + x.CurrName + "</option>";
                //}
            }
            $("#cbo_currency").append(options);
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_rate_by_date(currency, docdate) {
    $.ajax({
        url: '/getData/get_rate_by_date',
        type: 'POST',
        data: { curr: currency, DocDate: docdate },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#txt_rate").val(convert2digit(data.data));
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}

function get_house_data(proid, blockid, houseid, isboq) {
    $.ajax({
        url: '/getData/get_house_list',
        type: 'POST',
        data: { procode: $("#" + proid).val(), blockcode: $("#" + blockid).val(), isboq: isboq },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            var cbooption = "<option value=''></option>";
            if ($("#" + blockid).val() == "00") {
                cbooption = cbooption + "<option value='000'>General</option>";
            }
            else {
                if (isboq == "No") {
                    cbooption = cbooption + "<option value=''>All</option>";
                }
                for (i = 0; i < data.data.length; i++) {
                    var x = data.data[i];
                    cbooption = cbooption + "<option value='" + x.Code + "'>" + x.Name + "</option>";
                }
            }
            $("#" + houseid).empty();
            $("#" + houseid).append(cbooption);

        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_house_data_service(proid, blockid, houseid, isboq) {
    $.ajax({
        url: '/getData/get_house_list',
        type: 'POST',
        data: { procode: $("#" + proid).val(), blockcode: $("#" + blockid).val(), isboq: isboq },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            var cbooption;
            if ($("#" + blockid).val() == "00") {
                cbooption = cbooption + "<option value='000'>General</option>";
            }
            else {

                if (isboq == "No") {
                    cbooption = cbooption + "<option value=''>All</option>";
                }
                for (i = 0; i < data.data.length; i++) {
                    var x = data.data[i];
                    cbooption = cbooption + "<option value='" + x.Code + "'>" + x.Name + "</option>";
                }
            }
            $("#" + houseid).empty();
            $("#" + houseid).append(cbooption);

        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_work_data(mainworkid, subid, boqtype) {
    var mainwork = $("#" + mainworkid).val();
    $.ajax({
        url: '/getData/get_work_list',
        type: 'POST',
        data: { mainwork: mainwork, boqtype: boqtype },
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
            $("#" + subid).empty();
            $("#" + subid).append(cbooption);
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_Doc_Number(doctype, boqtype) {
    var found = 0;
    if (doctype == "PR") {
        if ($("#txt_pr_dockey").val() == "-1") {
            found = 1;
        }
    }
    else {
        if ($("#txt_dockey").val() == "-1") {
            found = 1;
        }
    }
    if (found == 1) {
        var url = "";
        var docdate = $('#txt_posting_date').val().trim().split("-");
        var date = docdate[2] + "/" + docdate[1] + "/" + docdate[0];
        var ocrcode = $("#cbo_ocrcode").val();
        $.ajax({
            url: '/getData/getDocNumber',
            type: 'POST',
            data: { doctype: doctype, boqtype: boqtype, docdate: date, ocrcode: ocrcode },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                $("#txt_doc_num").val(data.docnum);
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}
function txt_date_change_update_Batch(doctype, boqtype) {
    txt_posting_date_change(doctype, boqtype);
    $("#table_batch_item1 >tbody>tr").remove();
    ResetSelected_Background_Color_Issue(-1);
}
function check_reject_alert(action, doctype) {
    $("#txt_action_type").val(action);
    $("#txt_doc_type").val(doctype);
    $("#modal_reason_reject").modal('show');
}
function cmd_confirm_cancel() {
    $("#modal_reason_reject").modal('hide');
    var action = $("#txt_action_type").val();
    var doctype = $("#txt_doc_type").val();
    if ($("#txt_reason_reject").val() != "") {
        cmd_reject_with_reason(action, doctype);
    } else {
        ShowAlert("Reason cannot empty!!, Your rejection failed!");
    }
}
function cmd_reject_with_reason(action, doctype) {
    var docentry = "";
    var allow = 0;
    if (doctype == "PR") {
        docentry = $("#txt_pr_dockey").val();
    }
    else {
        docentry = $("#txt_dockey").val();
    }
    var head = {
        DocEntry: docentry,
        CreatedBy: $("#txt_shared_userid").val(),
        DocStatus: action,
        DocNum: doctype,
        CancelReason: $("#cbo_cancel_reason").val(),
        Memo: $("#txt_reason_reject").val()
    };
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/purpr/cmd_approver_action',
        data: JSON.stringify(
            {
                'header': head
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
                ShowAlert("Data was saved");
            }
        },
        failure: function (response) {
            $('#result').html(response);
        }
    });
}
function cmd_approver_action(action, doctype) {
    var docentry = "";
    var allow = 0;
    var canceldate = "";
    var text = "The Cancellation of a document cannot be reversed. Document status will be changed to 'Canceled'.";
    if (action == 'Cancelled' || action == 'Canceled') {
        if (confirm(text) == true) {
            if (doctype == "PR" || doctype == "GRPO" || doctype == "GR") {
                if ($("#cbo_cancel_reason").val() == "") {
                    allow = 1;
                    ShowAlert("Cancel Reason can not empty!");
                }
            }
            if (doctype == "GRPO" && allow == 0) {
                if ($("#txt_cancel_date").val() == "") {
                    allow = 2;
                    ShowAlert("Cancel Date can not empty!");
                } else {
                    var docdate = $('#txt_cancel_date').val().trim().split("-");
                    canceldate = docdate[2] + "/" + docdate[1] + "/" + docdate[0]
                }
            }
            if (doctype == "GR" && $('#txt_base_entry').val() == '-1' && allow == 0) {
                if ($("#txt_cancel_date").val() == "") {
                    allow = 2;
                    ShowAlert("Cancel Date can not empty!");
                } else {
                    var docdate = $('#txt_cancel_date').val().trim().split("-");
                    canceldate = docdate[2] + "/" + docdate[1] + "/" + docdate[0]
                }
            }
            if (allow == 0) {
                if (doctype == "PR") {
                    docentry = $("#txt_pr_dockey").val();
                }
                else {
                    docentry = $("#txt_dockey").val();
                }

                var head = {
                    DocEntry: docentry,
                    CreatedBy: $("#txt_shared_userid").val(),
                    DocStatus: action,
                    DocNum: doctype,
                    CancelReason: $("#cbo_cancel_reason").val(),
                    CancelDate: canceldate,
                    Memo: ""
                };
                $.ajax({
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    type: 'POST',
                    url: '/purpr/cmd_approver_action',
                    data: JSON.stringify(
                        {
                            'header': head
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
                            ShowAlert("Data was saved");
                        } else {
                            ShowError(data.Message);
                        }
                    },
                    failure: function (response) {
                        $('#result').html(response);
                    }
                });
            }
        }
    } else {
        if (doctype == "PR") {
            docentry = $("#txt_pr_dockey").val();
        }
        else {
            docentry = $("#txt_dockey").val();
        }
        var head = {
            DocEntry: docentry,
            CreatedBy: $("#txt_shared_userid").val(),
            DocStatus: action,
            DocNum: doctype,
            CancelReason: $("#cbo_cancel_reason").val(),
            Memo: ""
        };
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/purpr/cmd_approver_action',
            data: JSON.stringify(
                {
                    'header': head
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
                    ShowAlert("Data was saved");
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}
function change_currency_header() {
    if ($('#table_summary_detail > tbody  > tr').length > 0) {
        $("#table_summary_detail >tbody>tr").remove();
    }
}

//End PR
function change_summary_qty_non(summaryid) {
    //alert("change_summary_qty_non");
    var sumDetail = 0, lastQty = 0;
    var lastId = "";
    var qty = returnstringvalue($("#txt_line_summary_qty_" + summaryid).val());
    $("#txt_line_summary_qty_" + summaryid).val(convert4digit(qty));
    namedetail = "name_line_detail_qty_" + summaryid;
    var rowCounter = $("input[name=" + namedetail + "]").length;
    var lineqty = parseFloat(qty) / parseFloat(rowCounter);
    $("input[name=" + namedetail + "]").each(function () {
        var detailid = $(this).attr('id').replace("txt_line_detail_qty_", "");
        var lineqty = $("#line_detail_item_base_avil_qty_" + detailid).val();

        if (parseFloat(lineqty) <= parseFloat(returnstringvalue(qty))) {
            //$("#txt_line_detail_qty_" + detailid).css("background-color", "yellow");
            $("#txt_line_detail_qty_" + detailid).val(convert4digit(lineqty));
            qty = parseFloat(qty) - parseFloat(lineqty);
        }
        else {
            //$("#txt_line_detail_qty_" + detailid).css("background-color", "white");
            $("#txt_line_detail_qty_" + detailid).val(convert4digit(qty));
            qty = 0;
        }
        change_line_qty(detailid, 1);
        //$(this).val(convert4digit(lineqty)).change();
        //sumDetail = parseFloat(returnstringvalue(sumDetail)) + parseFloat(returnstringvalue(convert4digit(lineqty)));
        //lastId = $(this).attr('id');

    });
    //setTimeout(
    //    function () {
    //        sumDetail = parseFloat(returnstringvalue(sumDetail)) - parseFloat(returnstringvalue(convert4digit(lineqty)));
    //        lastQty = parseFloat(returnstringvalue(qty)) - parseFloat(returnstringvalue(sumDetail));
    //        $("#" + lastId).val(convert4digit(lastQty)).change();

    //        var Id = lastId.replace("txt_line_detail_qty_", "");
    //        var price = returnstringvalue($("#txt_line_detail_price_" + Id).val());
    //        $("#txt_line_detail_price_" + Id).val(convert4digit(price)).change();
    //    }, 500
    //);
}
function change_summary_qty_non_old(summaryid) {
    var sumDetail = 0, lastQty = 0;
    var lastId = "";
    var qty = returnstringvalue($("#txt_line_summary_qty_" + summaryid).val());
    $("#txt_line_summary_qty_" + summaryid).val(convert4digit(qty));
    namedetail = "name_detail_qty_" + summaryid;
    var rowCounter = $("input[name=" + namedetail + "]").length;
    var lineqty = parseFloat(qty) / parseFloat(rowCounter);
    $("input[name=" + namedetail + "]").each(function () {
        $(this).val(convert4digit(lineqty)).change();
        sumDetail = parseFloat(returnstringvalue(sumDetail)) + parseFloat(returnstringvalue(convert4digit(lineqty)));
        lastId = $(this).attr('id');
    });
    setTimeout(
        function () {
            sumDetail = parseFloat(returnstringvalue(sumDetail)) - parseFloat(returnstringvalue(convert4digit(lineqty)));
            lastQty = parseFloat(returnstringvalue(qty)) - parseFloat(returnstringvalue(sumDetail));
            $("#" + lastId).val(convert4digit(lastQty)).change();

            var Id = lastId.replace("txt_line_detail_qty_", "");
            var price = returnstringvalue($("#txt_line_detail_price_" + Id).val());
            $("#txt_line_detail_price_" + Id).val(convert4digit(price)).change();
        }, 500
    );
}
function change_summary_qty_non_gi(summaryid) {
    var sumDetail = 0, lastQty = 0;
    var lastId = "";
    var qty = returnstringvalue($("#txt_line_summary_qty_" + summaryid).val());
    $("#txt_line_summary_qty_" + summaryid).val(convert4digit(qty));
    namedetail = "name_line_detail_qty_" + summaryid;
    var rowCounter = $("input[name=" + namedetail + "]").length;
    var lineqty = parseFloat(qty) / parseFloat(rowCounter);
    $("input[name=" + namedetail + "]").each(function () {
        $(this).val(convert4digit(lineqty)).change();
        sumDetail = parseFloat(returnstringvalue(sumDetail)) + parseFloat(returnstringvalue(convert4digit(lineqty)));
        lastId = $(this).attr('id');
    });
    setTimeout(
        function () {
            sumDetail = parseFloat(returnstringvalue(sumDetail)) - parseFloat(returnstringvalue(convert4digit(lineqty)));
            lastQty = parseFloat(returnstringvalue(qty)) - parseFloat(returnstringvalue(sumDetail));
            $("#" + lastId).val(convert4digit(lastQty)).change();

            var Id = lastId.replace("txt_line_detail_qty_", "");
            var price = returnstringvalue($("#txt_line_detail_price_" + Id).val());
            $("#txt_line_detail_price_" + Id).val(convert4digit(price)).change();
        }, 500
    );
}
function get_wsh_string() {
    var whsoption = "";
    $("#table_whs > tbody>tr").each(function () {
        if ($(this).find("td:eq(4)").text() == $("#cbo_ocrcode").val()) {
            if ($(this).find("td:eq(0)").text() == $(this).find("td:eq(5)").text()) {
                whsoption = whsoption + "<option value='" + $(this).find("td:eq(0)").text() + "' selected>" + $(this).find("td:eq(0)").text() + "</option>";
            } else {
                whsoption = whsoption + "<option value='" + $(this).find("td:eq(0)").text() + "'>" + $(this).find("td:eq(0)").text() + "</option>";
            }
        }
    });
    return whsoption;
}
function get_whs_by_project() {
    $("#cbo_whs").empty();
    $("#cbo_whs").append(get_wsh_string());
}

//Attachment File
var fileData = new FormData();
var FileList = [];
function GetAttachmentFile(DocType) {
    $("#txtCheckFile").val("new");
    var fileUpload = $("#attachment_file").get(0);
    var files = fileUpload.files;
    for (var i = 0; i < files.length; i++) {
        fileData.append(files[i].name, files[i]);
    }
    for (var i = 0; i < files.length; i++) {
        FileList.push(files[i]);
    }
    AddAttachmentFile(DocType);
}
function AddAttachmentFile(DocType) {
    var Type = '', i = 1;
    if (DocType == 'PR')
        Type = '1';
    else if (DocType == 'PO')
        Type = '2';
    else if (DocType == 'GI')
        Type = '3';
    else if (DocType == 'GR')
        Type = '4';
    else if (DocType == 'GRPO')
        Type = '5';

    //$("#tbl_attachment_list > tbody").empty();
    var lentbl = $("#tbl_attachment_list > tbody > tr").length;
    if (lentbl > 0) {
        var i = $('#tbl_attachment_list > tbody > tr:last').attr('id').replace("att_row_id_", "");
        i = parseInt(i) + 1;
    } else {
        i = 1;
    }

    var dateAndTime = $("#dateAndTime").val().trim();
    $.each(FileList, function (index, files) {
        if (check_exist_file_name(files.name) == 1) {
            var savename = DocType + "_" + dateAndTime + "_" + $("#txt_shared_userid").val().trim() + "_" + (files.name).replaceAll("+", "_").replaceAll("-", "_").replaceAll(")", "_").replaceAll("(", "_").replaceAll("*", "_").replaceAll("&", "_").replaceAll("^", "_").replaceAll("%", "_").replaceAll("$", "_").replaceAll("#", "_").replaceAll("@", "_").replaceAll("!", "_").replaceAll("~", "_").replaceAll(" ", "_");
            var tr = "<tr id='att_row_id_" + i + "'>";
            tr = tr + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='cmd_line_remove_attachment(" + i + ")'></i></td>";
            tr = tr + "<td style='display:none'>" + (i + 1) + "</td>";
            tr = tr + "<td id='td_ori_name_" + i + "'>" + files.name + "</td>";
            tr = tr + "<td style='display:none'><input type='text' class='form-control' id='td_savename_" + i + "' value='" + savename + "'></td>";
            tr = tr + "<td style='color:blue;cursor:pointer;' onclick='attachmenViewer(" + Type + "," + i + ")'>View</td>";
            tr = tr + "<td style='color:blue;cursor:pointer;' onclick='attachmentDownload(" + Type + "," + i + ")'>Download</td>";
            tr = tr + "</tr>";
            $("#tbl_attachment_list > tbody").append(tr);
            i++;
        }
    });
}
function check_exist_file_name(fileName) {
    var found = 1;
    $("#tbl_attachment_list >tbody>tr").each(function () {
        var id = $(this).attr('id').replace("att_row_id_", "");
        var fName = $("#td_ori_name_" + id).text();
        if (fName == fileName) {
            found = 0;
            return false;
        }
        else {
            found = 1;
        }
    });
    return found;
}
function attachmenViewer(Type, i) {
    var DocType = '', DocKey = '';
    if (Type == 1) {
        DocType = "PR";
        DocKey = $("#txt_pr_dockey").val();
    }
    else if (Type == 2) {
        DocType = "PO";
        DocKey = $("#txt_dockey").val();
    }
    else if (Type == 3) {
        DocType = "GI";
        DocKey = $("#txt_dockey").val();
    }
    else if (Type == 4) {
        DocType = "GR";
        DocKey = $("#txt_dockey").val();
    }
    else if (Type == 5) {
        DocType = "GRPO";
        DocKey = $("#txt_dockey").val();
    }

    var saveName = '';
    var fileUpload = $("#attachment_file").get(0);
    var files = fileUpload.files;
    if ((DocKey == "-1" || $("#txt_DocStatus").val() == 'Rejected') && $("#txt_att_entry").val() == "-1") {
        SaveAttachment(DocType);
        saveName = $("#td_savename_" + i).val();
    } else {
        saveName = $("#td_savename_" + i).val();
    }

    var url = "/AttachmentFile/" + DocType + "/" + saveName;
    $("#img").attr("src", url);
    $("#modal-loadimage").modal('show');
    $("#txt_current_image_index").val(i);
    $("#txt_image_doc_type").val(DocType);
}
function attachmentDownload(Type, i) {
    var DocType = '', DocKey = '';
    if (Type == 1) {
        DocType = "PR";
        DocKey = $("#txt_pr_dockey").val();
    }
    else if (Type == 2) {
        DocType = "PO";
        DocKey = $("#txt_dockey").val();
    }
    else if (Type == 3) {
        DocType = "GI";
        DocKey = $("#txt_dockey").val();
    }
    else if (Type == 4) {
        DocType = "GR";
        DocKey = $("#txt_dockey").val();
    }
    else if (Type == 5) {
        DocType = "GRPO";
        DocKey = $("#txt_dockey").val();
    }

    var saveName = '';
    var fileUpload = $("#attachment_file").get(0);
    var files = fileUpload.files;
    if ((DocKey == "-1" || $("#txt_DocStatus").val() == 'Rejected') && $("#txt_att_entry").val() == "-1") {
        SaveAttachment(DocType);
        saveName = $("#td_savename_" + i).val();
    } else {
        saveName = $("#td_savename_" + i).val();
    }
    window.open("/GetData/DownloadAttachment?saveName=" + saveName + "&DocType=" + DocType, "_blank");
}
function cmd_image_move_action(action) {
    var currentindex = parseInt($("#txt_current_image_index").val());
    if (action == 1) {
        currentindex = currentindex - 1;
    }
    else {
        currentindex = currentindex + 1;
    }
    if (currentindex < 1) {
        currentindex = 1;
    } else if (currentindex > $('#tbl_attachment_list > tbody  > tr').length) {
        currentindex = $('#tbl_attachment_list > tbody  > tr').length;
    }

    $("#txt_current_image_index").val(currentindex);
    var saveName = saveName = $("#td_savename_" + currentindex).val();
    var url = "/AttachmentFile/" + $("#txt_image_doc_type").val() + "/" + saveName;
    $("#img").attr("src", url);
}
function SaveAttachment(DocType) {
    if (DocType == 'PR') {
        BaseEntry = $("#txt_pr_dockey").val();
    } else {
        BaseEntry = $("#txt_dockey").val();
    }
    ////// Attachment File
    fileData.append('DocType', DocType);
    fileData.append('DateAndTime', $("#dateAndTime").val().trim());
    fileData.append('UserID', $("#txt_shared_userid").val().trim());
    fileData.append('BaseEntry', BaseEntry);
    $.ajax({
        url: '/GetData/SaveAttachmentFile',
        type: "POST",
        contentType: false, // Not to set any content header  
        processData: false, // Not to process data  
        dataType: "json",
        data: fileData,
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        async: false,
        success: function (imp) {
            if (imp.status == 'OK') {
                $("#txt_att_entry").val(imp.Message);
            } else {
                alert(imp.Message);
            }
        },
        error: function (err) {
            alert(err);
        }
    });
}
function cmd_line_remove_attachment(index) {
    fileData.delete($("#td_ori_name_" + index).val());
    FileList.splice(index, 1);
    $("#att_row_id_" + index).remove();
}
//setting
function get_sub_work_by_main(rowId) {
    $.ajax({
        url: '/getData/get_sub_work_by_main',
        type: 'POST',
        data: { mainwork: $("#cbo_boq_mapping_main_work_" + rowId).val() },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status == "OK") {
                option = "<option value=''></option>";
                for (i = 0; i < data.data.length; i++) {
                    var x = data.data[i];
                    option = option + "<option value='" + x.Code + "'>" + x.Name + "</option>";
                }
                $("#cbo_boq_mapping_sub_work_" + rowId).empty();
                $("#cbo_boq_mapping_sub_work_" + rowId).append(option);
            }
            else {
                alert(data.Message);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}