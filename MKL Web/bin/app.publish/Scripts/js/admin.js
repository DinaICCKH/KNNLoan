var found = 0;
var statusoption = "";
var list = [];
var currentpage = "";
var currentid = "";
var rowindex = 0;
var message = "";

function cbo_pricing_itemgroup_change() {
    var itemgroup = $("#cbo_itemgroup").val();
    var option = "";
    $("#cbo_sub_itemgroup").empty();
    option = "<option value=''></option>";
    $("#table_subitemgroup>tbody>tr").each(function (index) {
        if ($("#td_groupcode_" + index).text() == $("#cbo_itemgroup").val()) {
            option = option + "<option value='" + $("#td_subcode_" + index).text() + "'>" + $("#td_subname_" + index).text() + "</option>";
        }
    });
    $("#cbo_sub_itemgroup").append(option);

}
function cmd_update_itemprice() {
    var list = [];
    var d = {
        ItemGroup: $("#cbo_itemgroup").val(),
        SubItemCode: $("#cbo_sub_itemgroup").val(),
        Margin: $("#txt_margin_of_price").val(),
        UpdatedBy: $("#txt_shared_userid").val(),
        //DocCur: $("#cbo_currency").val()
    };
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/admin/cmd_updateprice',
        data: JSON.stringify(
            {
                'detail': d
            }),
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status == "OK") {
                ShowAlert("Data was updated!!!");
                location.reload();
            }
        },
        failure: function (response) {
            $('#result').html(response);
        }
    });
}
function cmd_show_item_list() {
    var allow = 0;
    if ($("#cbo_itemgroup").val() == "") {
        ShowAlert("Item Group is required");
        allow = 1;
    }
    //if ($("#cbo_currency").val() == "" && allow==0) {
    //    ShowAlert("Currency is required");
    //    allow = 2;
    //}
    if (allow == 0) {
        $.ajax({
            url: '/getData/show_item_list',
            type: 'POST',
            data: {
                itemgroup: $("#cbo_itemgroup").val(), subitemgroup: $("#cbo_sub_itemgroup").val()//, currency: $("#cbo_currency").val()
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
                $("#table_item_price>tbody>tr").remove();
                var margin_per = 0;
                for (i = 0; i < data.data.length; i++) {
                    var x = data.data[i];
                    var tr = "<tr id='tr_stage1_" + i + "'>";
                    tr = tr + "<td style='text-align:center;' id='td_itemcode_" + i + "'>" + x.ItemCode + "</td>";
                    tr = tr + "<td>" + x.ItemName + "</td>";
                    tr = tr + "<td style='text-align:center;'>" + x.DocNum + "</td>";
                    tr = tr + "<td style='text-align:center;'>" + x.CardCode + "</td>";
                    tr = tr + "<td style='text-align:right;' id='td_item_po_price_" + i + "'>" + convert4digit(x.UPrice) + "</td>";
                    tr = tr + "<td style='text-align:center;' id='td_item_uomname_" + i + "'>" + x.UoMName + "</td>";
                    tr = tr + "<td><input type='text' style='text-align:right;border:none;' class='form-control form-control-insde' id='txt_margin_perc_" + i + "' placeholder='Price' value='" + convert2digit(x.LineTotal) + "' onchange='txt_price_margin_change(" + i + ")' ></td>";
                    tr = tr + "<td style='text-align:right;' id='td_item_last_price_" + i + "'>" + convert4digit(x.UPrice) + "</td>";
                    tr = tr + "<td id='td_itemgroup_" + i + "' style='display:none'>" + x.ItemGroupCode + "</td>";
                    tr = tr + "<td id='td_subitemgroup_" + i + "' style='display:none'>" + x.SubWorkCode + "</td>";
                    tr = tr + "<td id='td_last_poentry_" + i + "' style='display:none'>" + x.DocEntry + "</td>";
                    tr = tr + "<td id='td_uomentry_" + i + "' style='display:none'>" + x.UoMEntry + "</td>";
                    tr = tr + "</tr>";
                    $("#table_item_price>tbody").append(tr);
                    txt_price_margin_change(i);
                    margin_per = x.LineTotal;
                }
                $("#txt_margin_of_price").val(convert2digit(margin_per));
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}
function txt_price_margin_change(index) {
    var price = returnstringvalue($("#td_item_po_price_" + index).text());
    var margin = returnstringvalue($("#txt_margin_perc_" + index).val());
    var lastprice = (parseFloat(margin) / 100) * parseFloat(price);
    $("#txt_margin_perc_" + index).val(convert2digit(margin));
    $("#td_item_last_price_" + index).text(convert4digit(parseFloat(price) + parseFloat(lastprice)));
}
function txt_change_margin() {
    var margin_per = $("#txt_margin_of_price").val();
    $("#txt_margin_of_price").val(convert2digit(margin_per));
    $('#table_item_price > tbody  > tr').each(function (index, tr) {
        $("#txt_margin_perc_" + index).val(convert2digit(margin_per)).change();
    });
}
function load_image(index) {
    var url = "/AttachmentFile/PR/" + $("#td_savename_" + index).val();
    alert(url);
    $("#img").attr("src", url);
    $("#modal-loadimage").modal('show');
}

///Client Action
function ShowAlert(mes) {
    $("#modal_p_alert").html(mes);
    $("#modal-alert").modal('show');
}
////Menu
function get_uom_group() {
    $.ajax({
        url: '/getData/get_uom_group',
        type: 'POST',
        data: {},
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#table_uom_group > tbody>tr").remove();
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                var tr = "<tr>";
                tr = tr + "<td>" + x.UgpEntry + "</td>";
                tr = tr + "<td>" + x.UomEntry + "</td>";
                tr = tr + "<td>" + x.UomName + "</td>";
                tr = tr + "<td>" + x.AltQty + "</td>";
                tr = tr + "<td>" + x.BaseQty + "</td>";
                tr = tr + "</tr>";
                $("#table_uom_group > tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_bin() {
    $.ajax({
        url: '/getData/get_bin',
        type: 'POST',
        data: {},
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#table_bin > tbody>tr").remove();
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                var tr = "<tr>";
                tr = tr + "<td>" + x.BinEntry + "</td>";
                tr = tr + "<td>" + x.BinCode + "</td>";
                tr = tr + "<td>" + x.BinDes + "</td>";
                tr = tr + "<td>" + x.WhsCode + "</td>";
                tr = tr + "<td>" + x.WhsName + "</td>";
                tr = tr + "</tr>";
                $("#table_bin > tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_whs() {
    $.ajax({
        url: '/getData/get_whs',
        type: 'POST',
        data: {},
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#table_whs > tbody>tr").remove();
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                var tr = "<tr>";
                tr = tr + "<td id='td_whs_whs_code_" + i + "'>" + x.WhsCode + "</td>";
                tr = tr + "<td id='td_whs_whs_name_" + i + "'>" + x.WhsName + "</td>";
                tr = tr + "<td id='td_whs_def_bin_" + i + "'>" + x.DefBinEntry + "</td>";
                tr = tr + "<td id='td_whs_enabled_" + i + "'>" + x.EnabledBin + "</td>";
                tr = tr + "<td id='td_whs_ocrcode_" + i + "'>" + x.OcrCode + "</td>";
                tr = tr + "<td id='td_whs_def_whs_" + i + "'>" + x.DefWhs + "</td>";
                tr = tr + "</tr>";
                $("#table_whs > tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function add_new_main_menu() {
    found = 0;
    $('#table_admin_main_menu > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(0) input[type='text']").val() == "") {
            found = 1;
            return false;
        }
    });
    if (found == 1) {
        ShowAlert("Menu Code cannot be blanked");
    }
    else {
        statusoption = "";
        $("#cboactiveinactive > option").each(function () {
            statusoption = statusoption + "<option value='" + this.value + "'>" + this.text + "</option>";
        });
        var tr = "<tr role='row' class='odd'>";
        tr = tr + "<td>";
        tr = tr + "<input type='text' class='form-control' placeholder='Menu Code'>";
        tr = tr + "</td>";
        tr = tr + "<td>";
        tr = tr + "<input type='text' class='form-control' placeholder='Menu Description'>";
        tr = tr + "</td>";
        tr = tr + "<td>";
        tr = tr + "<select class='form-control' name='status'>";
        tr = tr + statusoption;
        tr = tr + "</select>";
        tr = tr + "</td>";
        tr = tr + "</tr>";
        $("#table_admin_main_menu > tbody").append(tr);
    }
}
function add_new_sub_menu() {
    found = 0;
    $('#table_admin_sub_menu > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(0) input[type='text']").val() == "") {
            found = 1;
            return false;
        }
    });
    if (found == 1) {
        $("#modal_p_alert").text("Menu Code cannot be blanked");
        $("#modal-alert").modal('show');
    }
    else {
        statusoption = "";
        rowindex = $("#table_admin_sub_menu > tbody > tr").length + 1;
        $("#cboactiveinactive > option").each(function () {
            statusoption = statusoption + "<option value='" + this.value + "'>" + this.text + "</option>";
        });
        var mainmenu = "";
        mainmenu = mainmenu + "<option value=''></option>";
        $("#cbo_admin_sub_menu_main_menu > option").each(function () {
            mainmenu = mainmenu + "<option value='" + this.value + "'>" + this.text + "</option>";
        });

        var controller = "";
        controller = controller + "<option value=''></option>";
        $("#cbo_admin_sub_menu_controller > option").each(function () {
            controller = controller + "<option value='" + this.value + "'>" + this.text + "</option>";
        });

        var tr = "<tr role='row' class='odd'>";
        tr = tr + "<td style='display:none'><input type='text' class='form-control' placeholder='Sub Code' value='-1'></td>";
        tr = tr + "<td><input type='number' class='form-control' placeholder='Order'></td>";
        tr = tr + "<td><input type='text' class='form-control' placeholder='Menu Description'></td>";
        tr = tr + "<td><select class='form-control' name='main' id='cbo_admin_sub_menu_main_code_" + rowindex + "'>" + mainmenu + "</select></td>";
        tr = tr + "<td><select class='form-control' name='level' onchange='cbo_admin_sub_menu_change(1," + rowindex + ")' id='cbo_admin_sub_menu_under_level_action_" + rowindex + "'><option value='1'>1</option><option value='2'>2</option></select></td>";
        tr = tr + "<td><select class='form-control' name='under' id='cbo_admin_sub_menu_under_sub_action_" + rowindex + "'></select></td>";
        tr = tr + "<td><select class='form-control' name='controller' onchange='cbo_admin_sub_menu_change(2," + rowindex + ")' id='cbo_admin_sub_menu_link_to_action_" + rowindex + "'>" + controller + "</select></td>";
        tr = tr + "<td><select class='form-control' name='action' id='cbo_admin_sub_menu_link_action_" + rowindex + "'></select></td>";
        tr = tr + "<td><select class='form-control' name='status'>" + statusoption + "</select></td>";
        tr = tr + "</tr>";
        $("#table_admin_sub_menu > tbody").append(tr);
    }
}

///Controller
function add_new_controller() {
    found = 0;
    $('#table_admin_controller > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(0) input[type='text']").val() == "") {
            found = 1;
            return false;
        }
    });
    if (found == 1) {
        $("#modal_p_alert").text("Controller Code cannot be blanked");
        $("#modal-alert").modal('show');
    }
    else {
        statusoption = "";
        $("#cboactiveinactive > option").each(function () {
            statusoption = statusoption + "<option value='" + this.value + "'>" + this.text + "</option>";
        });
        var tr = "<tr role='row' class='odd'>";
        tr = tr + "<td>";
        tr = tr + "<input type='text' class='form-control' placeholder='Controller Code'>";
        tr = tr + "</td>";
        tr = tr + "<td>";
        tr = tr + "<input type='text' class='form-control' placeholder='Controller Description'>";
        tr = tr + "</td>";
        tr = tr + "<td>";
        tr = tr + "<select class='form-control' name='status'>";
        tr = tr + statusoption;
        tr = tr + "</select>";
        tr = tr + "</td>";
        tr = tr + "</tr>";
        $("#table_admin_controller > tbody").append(tr);
    }
}
function add_new_controller_action() {
    found = 0;
    $('#table_admin_controller_action > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(0) input[type='text']").val() == "") {
            found = 1;
            return false;
        }
    });
    if (found == 1) {
        $("#modal_p_alert").text("Controller Action Code cannot be blanked");
        $("#modal-alert").modal('show');
    }
    else {
        statusoption = "";
        $("#cboactiveinactive > option").each(function () {
            statusoption = statusoption + "<option value='" + this.value + "'>" + this.text + "</option>";
        });
        var controllerlist = "";
        $("#cbo_controller_action_controller > option").each(function () {
            controllerlist = controllerlist + "<option value='" + this.value + "'>" + this.text + "</option>";
        });

        var tr = "<tr role='row' class='odd'>";
        tr = tr + "<td>";
        tr = tr + "<input type='text' class='form-control' placeholder='Controller Code'>";
        tr = tr + "</td>";
        tr = tr + "<td>";
        tr = tr + "<input type='text' class='form-control' placeholder='Controller Description'>";
        tr = tr + "</td>";
        tr = tr + "<td>";
        tr = tr + "<select class='form-control' name='controller'>";
        tr = tr + controllerlist;
        tr = tr + "</select>";
        tr = tr + "</td>";
        tr = tr + "<td>";
        tr = tr + "<select class='form-control' name='status'>";
        tr = tr + statusoption;
        tr = tr + "</select>";
        tr = tr + "</td>";
        tr = tr + "</tr>";
        $("#table_admin_controller_action > tbody").append(tr);
    }
}

function confirm_yes() {
    switch (currentpage) {
        case "mainmenu":
            cmd_save_main_menu();
            break;
        case "submenu":
            cmd_save_sub_menu();
            break;
        case "controller":
            cmd_save_controller();
            break;
        case "controlleraction":
            cmd_save_controller_action();
            break;
        case "resetpassword":
            cmd_save_reset_password();
            break;
        case "user":
            cmd_save_user();
            break;
        case "permission":
            cmd_save_permission();
            break;
    }
    $("#modal-confirm").modal('hide');
}
function cmd_save_admin(page, id) {
    currentpage = page;
    currentid = id;
    if (page == "resetpassword") {
        $("#modal_p_confirm").text("Are you sure you want to Reset Password?");
    }
    else {
        $("#modal_p_confirm").text("After submitted, You cannot change");
    }
    $("#modal-confirm").modal('show');
}
function cmd_change_pwd(userid) {
    $("#modal-change_password").modal('show');
    $("#txt_change_user").val(userid);
}
///Getting Data from Database
function cbo_admin_sub_menu_change(type, rowindex) {
    var cboval = "";
    switch (type) {
        case 1:
            cboval = $("#cbo_admin_sub_menu_under_level_action_" + rowindex).val();
            break;
        case 2:
            cboval = $("#cbo_admin_sub_menu_link_to_action_" + rowindex).val();
            break;
    }
    $.ajax({
        url: '/admin/cbo_admin_sub_menu_change',
        type: 'POST',
        data: { type: type, code: cboval, maincode: $("#cbo_admin_sub_menu_main_code_" + rowindex).val() },
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
            if (type == 1) {
                $("#cbo_admin_sub_menu_under_sub_action_" + rowindex).empty();
                $("#cbo_admin_sub_menu_under_sub_action_" + rowindex).append(cbooption);
            }
            if (type == 2) {
                $("#cbo_admin_sub_menu_link_action_" + rowindex).empty();
                $("#cbo_admin_sub_menu_link_action_" + rowindex).append(cbooption);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function cbo_admin_check_user() {
    found = 0;
    message = "";
    if (found == 0) {
        $.ajax({
            url: '/admin/cbo_admin_check_user',
            type: 'POST',
            data: { UserCode: $("#txt_admin_usercode").val() },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "Exist") {
                    ShowAlert("User Code already exists");
                    $("#txt_admin_usercode").val("");
                    $("#txt_admin_usercode").focus();
                }
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}
///Saving Data to Database
///Controller Link
function cmd_save_controller() {
    list = [];
    $('#table_admin_controller > tbody  > tr').each(function (index, tr) {
        var d = {
            ControllerCode: $(this).find("td:eq(0) input[type='text']").val(),
            ControllerName: $(this).find("td:eq(1) input[type='text']").val(),
            DocStatus: $(this).find("td:eq(2) select[name='status']").val()
        };
        list.push(d);
    });
    if (found == 0) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/admin/cmd_save_controller',
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
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}
function cmd_save_controller_action() {
    list = [];
    $('#table_admin_controller_action > tbody  > tr').each(function (index, tr) {
        var d = {
            ActionCode: $(this).find("td:eq(0) input[type='text']").val(),
            Remark: $(this).find("td:eq(1) input[type='text']").val(),
            ControllerCode: $(this).find("td:eq(2) select[name='controller']").val(),
            DocStatus: $(this).find("td:eq(3) select[name='status']").val()
        };
        list.push(d);
    });
    if (found == 0) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/admin/cmd_save_controller_action',
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
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}
//Main Menu
function cmd_save_main_menu() {
    list = [];
    $('#table_admin_main_menu > tbody  > tr').each(function (index, tr) {
        var d = {
            MainCode: $(this).find("td:eq(0) input[type='text']").val(),
            MainName: $(this).find("td:eq(1) input[type='text']").val(),
            MainStatus: $(this).find("td:eq(2) select[name='status']").val()
        };
        list.push(d);
    });
    if (found == 0) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/admin/cmd_save_main_menu',
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
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}
function cmd_save_sub_menu() {
    list = [];
    $('#table_admin_sub_menu > tbody  > tr').each(function (index, tr) {
        var d = {
            SubCode: $(this).find("td:eq(0) input[type='text']").val(),
            VisOrder: $(this).find("td:eq(1) input[type='number']").val(),
            SubName: $(this).find("td:eq(2) input[type='text']").val(),
            MainCode: $(this).find("td:eq(3) select[name='main']").val(),
            Levels: $(this).find("td:eq(4) select[name='level']").val(),
            FatherCode: $(this).find("td:eq(5) select[name='under']").val(),
            ControllerCode: $(this).find("td:eq(6) select[name='controller']").val(),
            ControllerAction: $(this).find("td:eq(7) select[name='action']").val(),
            DocStatus: $(this).find("td:eq(8) select[name='status']").val()
        };
        list.push(d);
    });
    if (found == 0) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/admin/cmd_save_sub_menu',
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
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}
///User
var fileData = new FormData();
function esignature() {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById("img_user_signature").files[0]);
    oFReader.onload = function (oFREvent) {
        document.getElementById("img_preview").src = oFREvent.target.result;
    };
    var fileUpload = $("#img_user_signature").get(0);
    var files = fileUpload.files;
    for (var i = 0; i < files.length; i++) {
        fileData.append(files[i].name, files[i]);
    }
}
function cbo_admin_check_user() {
    found = 0;
    message = "";
    if (found == 0) {
        $.ajax({
            url: '/admin/cbo_admin_check_user',
            type: 'POST',
            data: { UserCode: $("#txt_admin_usercode").val() },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "Exist") {
                    ShowAlert("User Code already exists");
                    $("#txt_admin_usercode").val("");
                    $("#txt_admin_usercode").focus();
                }
            },
            error: function (error) {
                alert('Error while read data => ' + error);
            }
        });
    }
}
function cmd_save_user(type) {
    list = [];
    found = 0;
    message = "";
    var usrboq = [];
    if ($("#txt_admin_usercode").val() == "" && found == 0) {
        found = 1;
        message = "User Code cannot be blanked";
    }
    if ($("#txt_admin_fullname").val() == "" && found == 0) {
        found = 1;
        message = "User Full Name cannot be blanked";
    }
    if ($("#cbo_department").val() == "" && found == 0) {
        found = 1;
        message = "Department cannot be blanked";
    }
    if (found == 1) {
        ShowAlert(message);
    }
    if (found == 0) {
        var d = {
            UserCode: $("#txt_admin_usercode").val(),
            UserName: $("#txt_admin_fullname").val(),
            Phone1: $("#txt_admin_phone").val(),
            Email: $("#txt_admin_email").val(),
            Gender: $("#cbo_admin_gender").val(),
            Position: $("#txt_position").val(),
            Pwd: $("#txt_admin_password").val(),
            DepCode: $("#cbo_department").val(),
            ChangeNext: $("#cbo_next_change").val(),
            UserStatus: $("#cbo_user_status").val(),
            Addrss: type
        };
        $("#table_user > tbody  > tr").find("input[type='checkbox']").each(function () {
            if (this.checked) {
                var id = this.id.replace("chk_", "");
                var detail = {
                    OcrCode: $("#td_project_" + id).text(),
                    UserCode: $("#txt_admin_usercode").val()
                };
                list.push(detail);
            }
        });
        var d = {
            UserCode: $("#txt_admin_usercode").val(),
            UserName: $("#txt_admin_fullname").val(),
            Phone1: $("#txt_admin_phone").val(),
            Email: $("#txt_admin_email").val(),
            Gender: $("#cbo_admin_gender").val(),
            Position: $("#txt_position").val(),
            Pwd: $("#txt_admin_password").val(),
            DepCode: $("#cbo_department").val(),
            ChangeNext: $("#cbo_next_change").val(),
            AppRetension: $("#cbo_approve_retention").val(),
            UserStatus: $("#cbo_user_status").val(),
            Addrss: type
        };
        $('#table_boq_mapping > tbody  > tr').each(function (index, tr) {
            var indexId = $(this).attr('id').replace("tr_mapping_boq_", "");
            if ($("#cbo_boq_mapping_ocrcode2_" + indexId).val() != "" && $("#cbo_boq_mapping_sub_work_" + indexId).val() != "") {
                var boq = {
                    DocEntry: $("#txt_mapping_boq_entry_" + indexId).val(),
                    UsrCode: $("#txt_admin_usercode").val(),
                    OcrCode2: $("#cbo_boq_mapping_ocrcode2_" + indexId).val(),
                    MainWork: $("#cbo_boq_mapping_main_work_" + indexId).val(),
                    SubWork: $("#cbo_boq_mapping_sub_work_" + indexId).val()
                }
                usrboq.push(boq);
            }
        });

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/admin/cmd_save_user',
            data: JSON.stringify(
                {
                    'header': d,
                    'detail': list,
                    'usrBoqs': usrboq
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    save_signature($("#txt_admin_usercode").val());
                    location.reload();
                }
                else {
                    ShowAlert(data.Message);
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}
function save_signature(userid) {
    fileData.append('UserID', userid);
    $.ajax({
        url: '/admin/save_user_image',
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

        },
        error: function (err) {
            alert(err);
        }
    });
}
function cmd_save_reset_password() {
    if (found == 0) {
        $.ajax({
            url: '/admin/cmd_save_reset_password',
            type: 'POST',
            data: { usercode: $("#txt_change_user").val(), newpwd: $("#txt_new_pwd").val() },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    $("#modal-change_password").modal('hide');
                    ShowAlert("Changed new password is successfully");
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}
//Authorization
function find_user() {
    $("#table_user_list > tbody > tr").each(function (index) {

    });
}
function txt_pop_up_apply_user_Find_Stage_User() {
    $("#table_popup_user_list >tbody >tr").each(function (index) {
        var text = $("#td_user_name_" + index).text().toLowerCase();
        if (text.replace(/\s+/g, '').indexOf($("#txt_pop_up_apply_user").val().replace(/\s+/g, '').toLowerCase()) == -1) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}
function cmd_apply_all_auth() {
    $("#table_popup_user_list > tbody  > tr").find("input[type='checkbox']").each(function () {
        if (this.checked) {
            var id = this.id.replace("ck_", "");
            list = [];
            $('#table_auth > tbody  > tr').each(function (index, tr) {
                if ($(this).find("td:eq(0)").text() == "Sub") {
                    var smcode = $(this).find("td:eq(1)").text();
                    var d = {
                        UserCode: $("#td_user_code_" + id).text(),
                        SMCode: smcode,
                        Auth: $("#cbo_auth_" + smcode).val(),
                        HideAmount: $("#cbo_hide_" + smcode).val()
                    };
                    list.push(d);
                }
            });
            $.ajax({
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                type: 'POST',
                url: '/admin/cmd_save_user_auth',
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
                },
                failure: function (response) {
                    $('#result').html(response);
                }
            });
        }
    });
    $("#modal_user_ist").modal('hide');
}
function cmd_auth_copy_to(index) {
    $('.chk_auth').prop('checked', false);
    $("#modal_user_ist").modal('show');
    $("#td_auth_copy_from").text($("#td_user_name_" + index).text());
}
$(document).ready(function () {
    $("#txt_find_user").keyup(function () {
        var checked = 'No';
        $("#table_user_list >tbody >tr").each(function (index) {
            var text = $("#td_user_name_" + index).text().toLowerCase();
            if (text.replace(/\s+/g, '').indexOf($("#txt_find_user").val().replace(/\s+/g, '').toLowerCase()) == -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });
});
function cmd_add_sub_group() {
    var found = 0;
    var addall = 0;
    if ($("#txt_sub_group").val() == "") {
        addall = 0;
        $("#txt_sub_group > option").each(function () {
            var groupcode = this.value;
            $("#table_sub_group >tbody>tr").each(function (index) {
                if ($("#td_status_" + (index + 1)).text() == "Active") {
                    if (groupcode == $("#td_sub_group_" + (index + 1)).text()) {
                        found = 1;
                        return;
                    }
                }
            });
        });
    }
    else {
        addall = 1;
        $("#table_sub_group >tbody>tr").each(function (index) {
            if ($("#td_status_" + (index + 1)).text() == "Active") {
                if ($("#txt_sub_group").val() == $("#td_sub_group_" + (index + 1)).text()) {
                    found = 1;
                    return;
                }
            }
        });
    }
    if ($("#txt_user_code").val() == "") {
        found = 3;
    }
    if (found == 1) {
        alert("You cannot insert duplicate Sub Item Group");
    }
    if (found == 2) {
        alert("Sub Group cannot empty");
    }
    if (found == 3) {
        alert("User Code cannot empty");
    }
    if (found == 0) {

        var index = $("#table_sub_group >tbody>tr").length + 1;
        if (addall == 0) {
            $("#txt_sub_group > option").each(function () {
                if (this.value != "") {
                    var tr = "";
                    tr = tr + "<tr id='tr_sub-group_" + index + "'>";
                    tr = tr + "<td><i class='fa fa-fw fa-remove' onclick='cmd_remove_sub_group(" + index + ")'></i></td>";
                    tr = tr + "<td>" + $("#txt_user_code").val() + "</td>";
                    tr = tr + "<td>" + $('#txt_item_group  :selected').text() + "</td>";
                    tr = tr + "<td id='td_sub_group_" + index + "'>" + this.value + "</td>";
                    tr = tr + "<td>" + this.text; +"</td>";
                    tr = tr + "<td style='display:none' id='td_status_" + index + "'>Active</td>";
                    tr = tr + "<td style='display:none' id='td_item_group_" + index + "'>" + $("#txt_item_group").val() + "</td>";
                    tr = tr + "</tr>";
                    $("#table_sub_group >tbody").append(tr);
                    index++;
                }
            });
        }
        else {
            var tr = "";
            tr = tr + "<tr id='tr_sub-group_" + index + "'>";
            tr = tr + "<td><i class='fa fa-fw fa-remove' onclick='cmd_remove_sub_group(" + index + ")'></i></td>";
            tr = tr + "<td>" + $("#txt_user_code").val() + "</td>";
            tr = tr + "<td>" + $('#txt_item_group  :selected').text() + "</td>";
            tr = tr + "<td id='td_sub_group_" + index + "'>" + $("#txt_sub_group").val() + "</td>";
            tr = tr + "<td>" + $('#txt_sub_group :selected').text(); +"</td>";
            tr = tr + "<td style='display:none' id='td_status_" + index + "'>Active</td>";
            tr = tr + "<td style='display:none' id='td_item_group_" + index + "'>" + $("#txt_item_group").val() + "</td>";
            tr = tr + "</tr>";
            $("#table_sub_group >tbody").append(tr);
        }
    }
}
function cmd_remove_sub_group(rowindex) {
    $("#td_status_" + rowindex).text("Deleted");
    $("#tr_sub-group_" + rowindex).hide();
}
function cmd_save_user_group() {
    list = [];
    $("#table_sub_group >tbody>tr").each(function (index) {
        if ($("#td_status_" + (index + 1)).text() == "Active") {
            if ($("#txt_sub_group").val() == $("#td_sub_group_" + (index + 1)).text()) {
                found = 1;
                return;
            }
        }
    });

    $('#table_sub_group > tbody  > tr').each(function (index, tr) {
        var d = {
            UserCode: $("#txt_user_code").val(),
            ItemGroup: $("#td_item_group_" + (index + 1)).text(),
            SubGroup: $("#td_sub_group_" + (index + 1)).text(),
            DocStatus: $("#td_status_" + (index + 1)).text()
        };
        list.push(d);
    });
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/admin/cmd_save_user_group',
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
            }
        },
        failure: function (response) {
            $('#result').html(response);
        }
    });
}
function cbo_usercode_change() {
    $.ajax({
        url: '/admin/get_user_sub_group',
        type: 'POST',
        data: {
            usercode: $("#txt_user_code").val()
        },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#table_sub_group >tbody").empty();
            if (data.data.length > 0) {
                for (i = 0; i < data.data.length; i++) {
                    var x = data.data[i];
                    var tr = "";
                    tr = tr + "<tr id='tr_sub-group_" + (i + 1) + "'>";
                    tr = tr + "<td><i class='fa fa-fw fa-remove' onclick='cmd_remove_sub_group(" + (i + 1) + ")'></i></td>";
                    tr = tr + "<td>" + x.usercode + "</td>";
                    tr = tr + "<td>" + x.ItmsGrpNam + "</td>";
                    tr = tr + "<td id='td_sub_group_" + (i + 1) + "'>" + x.subgroup + "</td>";
                    tr = tr + "<td>" + x.SubName + "</td>";
                    tr = tr + "<td style='display:none' id='td_status_" + (i + 1) + "'>Active</td>";
                    tr = tr + "<td style='display:none' id='td_item_group_" + (i + 1) + "'>" + x.itemgroup + "</td>";
                    tr = tr + "</tr>";
                    $("#table_sub_group >tbody").append(tr);
                }
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function cbo_change_auth(smcode) {
    var auth = $("#cbo_auth_" + smcode).val();
    $(".auth_" + smcode).val(auth);
}
function cbo_change_hide(smcode) {
    var auth = $("#cbo_hide_" + smcode).val();
    $(".hide_" + smcode).val(auth);
}
function cmd_apply_all() {
    var user = $("#cbo_assignuser").val();
    $("#table_pr_list>tbody>tr").each(function (index) {
        $("#cbo_assignuser_" + index).val(user);

        $("#chk_" + index).prop('checked', true);
    });
}
function td_click(index) {
    if ($("#chk_" + index).prop('checked') == true) {
        $("#chk_" + index).prop('checked', false);
    }
    else {
        $("#chk_" + index).prop('checked', true);
    }
}
function get_pr_assignment() {
    var prno = $("#txt_pr_no").val();
    var itemgroup = $("#txt_item_group").val();
    var subgroup = $("#txt_sub_group").val();
    var itemdesc = $("#txt_item_desc").val();
    var fdate = $("#txt_fdate").val();
    var tdate = $("#txt_tdate").val().toLowerCase()

    $.ajax({
        url: '/getData/get_pr_assignment',
        type: 'POST',
        data: {
            prno: prno, fdate: fdate, tdate: tdate, itemgroup: itemgroup, subgroup: subgroup, itemdesc: itemdesc
        },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (dt) {
            $("#table_pr_list > tbody > tr").remove();
            var cbo = "<option value=''></option>";
            $("#cbo_assignuser > option").each(function () {
                cbo = cbo + " <option value='" + this.value + "'>" + this.text + "</option>";
            });
            for (i = 0; i < dt.data.length; i++) {
                var x = dt.data[i];
                var data = "<tr>";
                data = data + "<td onclick='td_click(" + i + ")'><input type='checkbox' disabled id='chk_" + i + "' /></td>";
                data = data + "<td id='td_doc_entry_" + i + "' style='display:none;'>" + x.DocEntry + "</td>";
                data = data + "<td id='td_line_no_" + i + "' style='display:none;'>" + x.LineNum + "</td>";
                data = data + "<td id='td_doc_num_" + i + "'>" + x.DocNum + "</td>";
                data = data + "<td>" + x.DocDate + "</td>";
                data = data + "<td>" + x.ReqDate + "</td>";
                data = data + "<td>" + x.Requester + "</td>";
                data = data + "<td>" + x.OcrCode + "</td>";
                data = data + "<td>" + x.IsBOQ + "</td>";
                data = data + "<td>" + x.ItmsGrpNam + "</td>";
                data = data + "<td>" + x.DetailName + "</td>";
                data = data + "<td>" + x.ItemCode + "</td>";
                data = data + "<td>" + x.ItemName + "</td>";
                data = data + "<td>" + x.DocStatus + "</td>";
                data = data + "<td>" + x.AssignToUser + "</td>";
                data = data + "<td><select id='cbo_assignuser_" + i + "' class='form-control form-control-insde'>" + cbo + "</select></td>";
                //data = data + "<td><button type='button' style='width:100%;' class='btn btn-danger btn-flat' onclick='cmd_update_assignment_show_user(" + i + ")'>Assignment</button></td>";
                //data = data + "<td style='display:none' id='td_item_group_code_" + i + "'>" + x.ItemGroupCode + "</td>";
                //data = data + "<td style='display:none' id='td_sub_item_group_code_" + i + "'>" + x.SubType + "</td>";
                data = data + "</tr>";
                $("#table_pr_list > tbody").append(data);
            }
            var index = $("#table_popup_user_list>tbody>tr").length;
            for (i = 0; i < dt.data1.length; i++) {
                var x = dt.data1[i];
                var tr = "<tr id='tr_user_" + index + "'>";
                tr = tr + "<td><i class='fa fa-remove text-danger' style='cursor:pointer;' onclick='cmd_remove_user_assignment(" + i + ")'></i></td>";
                tr = tr + "<td id='td_user_assignment_" + i + "'>" + $("#cbo_user").val() + "</td>";
                tr = tr + "<td>" + $("#cbo_user").val() + "</td>";
                tr = tr + "<td id='td_user_assignment_pr_no_" + i + "'>" + x.DocNum + "</td>";
                tr = tr + "<td id='td_user_assignment_item_group_" + i + "'>" + x.Requester + "</td>";
                tr = tr + "<td id='td_user_assignment_item_sub_group_" + i + "'>" + x.DocStatus + "</td>";
                tr = tr + "<td style='display:none' id='td_user_assignment_item_group_code_" + i + "'>" + x.CreatedBy + + "</td>";
                tr = tr + "<td style='display:none' id='td_user_assignment_item_sub_group_code_" + i + "'>" + x.IsBOQ + "</td>";
                tr = tr + "<td style='display:none' id='td_user_assignment_docentry_" + i + "'>" + x.DocEntry + "</td>";
                tr = tr + "</td>";
                $("#table_popup_user_list>tbody").append(tr);
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function cmd_update_assignment_show_user(index) {
    $("#modal_user_list").modal('show');
    $("#td_user_assignment_selected_row").text(index);
    $("#td_pop_pr_no").text($("#td_doc_num_" + index).text());
    $("#td_pop_item_group").text($("#td_line_item_group_" + index).text());
    $("#td_pop_sub_group").text($("#td_line_item_sub_group_" + index).text());

    $("#txt_hide_item_group_code").val($("#td_item_group_code_" + index).text());
    $("#txt_hide_sub_item_group_code").val($("#td_sub_item_group_code_" + index).text());
    $("#txt_hide_docEntry").val($("#td_doc_entry_" + index).text());

    var findstr = $("#td_doc_num_" + index).text() + $("#td_line_item_group_" + index).text() + $("#td_line_item_sub_group_" + index).text();
    hide_user_assignment(findstr);
}
function cmd_remove_user_assignment(index) {
    $("#tr_user_" + index).remove();
}
function cmd_cancel_user_assignment() {
    //var findstr = $("#td_pop_pr_no").text() + $("#td_pop_item_group").text() + $("#td_pop_sub_group").text();
    //remove_user_assignment(findstr);
    $("#modal_user_list").modal('hide');
}
function cmd_apply_user_assignment() {
    $("#modal_user_list").modal('hide');
    var findstr = $("#td_pop_pr_no").text() + $("#td_pop_item_group").text() + $("#td_pop_sub_group").text();
    var userfullname = "";
    $("#table_popup_user_list>tbody>tr").each(function () {
        var index = $(this).attr('id').replace("tr_user_", "");
        var user = $("#td_user_assignment_" + index).text();
        var prno = $("#td_user_assignment_pr_no_" + index).text();
        var group = $("#td_user_assignment_item_group_" + index).text();
        var subgroup = $("#td_user_assignment_item_sub_group_" + index).text();
        var str = prno + group + subgroup;
        if (str == findstr) {
            if (userfullname == "") {
                userfullname = $("#td_user_assignment_" + index).text();
            }
            else {
                userfullname = userfullname + "," + $("#td_user_assignment_" + index).text();
            }
        }
    });
    var selected_index = $("#td_user_assignment_selected_row").text();
    $("#td_full_user_assignment_" + selected_index).text(userfullname);
}
function remove_user_assignment(findstr) {
    // $("#cbo_user").val()
    var found = 0;
    $("#table_popup_user_list>tbody>tr").each(function () {
        var index = $(this).attr('id').replace("tr_user_", "");
        var user = $("#td_user_assignment_" + index).text();
        var prno = $("#td_user_assignment_pr_no_" + index).text();
        var group = $("#td_user_assignment_item_group_" + index).text();
        var subgroup = $("#td_user_assignment_item_sub_group_" + index).text();
        var str = prno + group + subgroup;
        if (str == findstr) {
            $(this).remove();
        }
    });
}
function cmd_add_user() {
    var str = $("#cbo_user").val() + $("#td_pop_pr_no").text() + $("#td_pop_item_group").text() + $("#td_pop_sub_group").text();
    if (check_existing_user_assignment(str) == 0) {
        var index = $("#table_popup_user_list>tbody>tr").length;
        var tr = "<tr id='tr_user_" + index + "'>";
        tr = tr + "<td><i class='fa fa-remove text-danger' style='cursor:pointer;' onclick='cmd_remove_user_assignment(" + index + ")'></i></td>";
        tr = tr + "<td id='td_user_assignment_" + index + "'>" + $("#cbo_user").val() + "</td>";
        tr = tr + "<td>" + $("#cbo_user").val() + "</td>";
        tr = tr + "<td id='td_user_assignment_pr_no_" + index + "'>" + $("#td_pop_pr_no").text() + "</td>";
        tr = tr + "<td id='td_user_assignment_item_group_" + index + "'>" + $("#td_pop_item_group").text() + "</td>";
        tr = tr + "<td id='td_user_assignment_item_sub_group_" + index + "'>" + $("#td_pop_sub_group").text() + "</td>";
        tr = tr + "<td style='display:none' id='td_user_assignment_item_group_code_" + index + "'>" + $("#txt_hide_item_group_code").val() + "</td>";
        tr = tr + "<td style='display:none' id='td_user_assignment_item_sub_group_code_" + index + "'>" + $("#txt_hide_sub_item_group_code").val() + "</td>";
        tr = tr + "<td style='display:none' id='td_user_assignment_docentry_" + index + "'>" + $("#txt_hide_docEntry").val() + "</td>";
        tr = tr + "</td>";
        $("#table_popup_user_list>tbody").append(tr);
    }
}
function hide_user_assignment(findstr) {
    // $("#cbo_user").val()
    var found = 0;
    $("#table_popup_user_list>tbody>tr").each(function () {
        var index = $(this).attr('id').replace("tr_user_", "");
        var user = $("#td_user_assignment_" + index).text();
        var prno = $("#td_user_assignment_pr_no_" + index).text();
        var group = $("#td_user_assignment_item_group_" + index).text();
        var subgroup = $("#td_user_assignment_item_sub_group_" + index).text();
        var str = prno + group + subgroup;
        if (str == findstr) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}
function check_existing_user_assignment(findstr) {
    // $("#cbo_user").val()
    var found = 0;
    $("#table_popup_user_list>tbody>tr").each(function () {
        var index = $(this).attr('id').replace("tr_user_", "");
        var user = $("#td_user_assignment_" + index).text();
        var prno = $("#td_user_assignment_pr_no_" + index).text();
        var group = $("#td_user_assignment_item_group_" + index).text();
        var subgroup = $("#td_user_assignment_item_sub_group_" + index).text();
        var str = user + prno + group + subgroup;
        if (str == findstr) {
            found = 1;
            return false;
        }
    });
    return found;
}
function cmd_update_assignment() {
    list = [];
    $("#table_pr_list > tbody  > tr").find("input[type='checkbox']").each(function (index) {
        //if (this.checked) {
        //    var d = {
        //        DocEntry: $("#td_doc_entry_" + index).text(),
        //        LineNum: $("#td_line_no_" + index).text(),
        //        AssignToUser: $("#td_full_user_assignment_" + index).text()
        //    };
        //    list.push(d);
        //}
        if ($("#cbo_assignuser_" + index).val() != "") {
            var d = {
                DocEntry: $("#td_doc_entry_" + index).text(),
                LineNum: $("#td_line_no_" + index).text(),
                AssignToUser: $("#cbo_assignuser_" + index).val()
            };
            list.push(d);
        }
    });
    var assignto = [];
    $("#table_popup_user_list > tbody  > tr").each(function (index) {
        var d = {
            DocEntry: $("#td_doc_entry_" + index).text(),
            UserId: $("#td_user_assignment_" + index).text(),
            ItemGroup: $("#td_user_assignment_item_group_code_" + index).text(),
            ItemSubGroup: $("#td_user_assignment_item_sub_group_code_" + index).text()
        };
        assignto.push(d);
    });
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/admin/cmd_update_assing_to',
        data: JSON.stringify(
            {
                'detail': list,
                'usr': assignto
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
//function get_sub_item_group_user() {
//    var itemgroup = $("#txt_sub_group").val();
//    $.ajax({
//        url: '/getData/get_sub_item_group_user',
//        type: 'POST',
//        data: { itemgroup: $("#txt_item_group").val(), subgroup: $("#txt_sub_group").val() },
//        datatype: 'json',
//        beforeSend: function () {
//            $("#loading").show();
//        },
//        complete: function () {
//            $("#loading").hide();
//        },
//        success: function (data) {
//            $("#table_user_group>tbody").empty();
//            if (data.data.length > 0) {
//                for (i = 0; i < data.data.length; i++) {
//                    var x = data.data[i];
//                    var tr = "";
//                    tr = tr + "<tr id='tr_sub-group_" + (i + 1) + "'>";
//                    tr = tr + "<td>" + x.usercode + "</td>";
//                    tr = tr + "<td>" + x.ItmsGrpNam + "</td>";
//                    tr = tr + "<td id='td_sub_group_" + (i + 1) + "'>" + x.subgroup + "</td>";
//                    tr = tr + "<td>" + x.SubName + "</td>";
//                    tr = tr + "</tr>";
//                    $("#table_user_group >tbody").append(tr);
//                }
//            }
//        },
//        error: function (error) {
//            alert('Error while read data => ' + error);
//        }
//    });
//}
function get_sub_item_group() {
    var itemgroup = $("#txt_item_group").val();
    $.ajax({
        url: '/getData/get_sub_item_group',
        type: 'POST',
        data: { groupcode: itemgroup },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#txt_sub_group").empty();
            var option = "<option value=''></option>";
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                option = option + "<option value='" + x.Code + "'>" + x.Name + "</option>";
            }
            $("#txt_sub_group").append(option);
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
    //get_sub_item_group_user();
}
function tr_auth_user(index) {
    var usercode = $("#td_user_code_" + index).text();
    $("#table_user_list > tbody > tr").each(function (index) {
        $("#tr_auth_" + index).css("background-color", "white");
    });
    $("#tr_auth_" + index).css("background-color", "Red");
    $("#txt_selected_user").val(usercode);
    $.ajax({
        url: '/admin/get_user_auth',
        type: 'POST',
        data: {
            usercode: usercode
        },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.data.length > 0) {
                for (i = 0; i < data.data.length; i++) {
                    var x = data.data[i];
                    $("#cbo_auth_" + x.SMCode).val(x.Auth);
                    $("#cbo_hide_" + x.SMCode).val(x.HideAmount);
                }
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function cmd_save_auth() {
    list = [];
    $('#table_auth > tbody  > tr').each(function (index, tr) {
        if ($(this).find("td:eq(0)").text() == "Sub") {
            var smcode = $(this).find("td:eq(1)").text();
            var d = {
                UserCode: $("#txt_selected_user").val(),
                SMCode: smcode,
                Auth: $("#cbo_auth_" + smcode).val(),
                HideAmount: $("#cbo_hide_" + smcode).val()
            };
            list.push(d);
        }
    });
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/admin/cmd_save_user_auth',
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
            }
        },
        failure: function (response) {
            $('#result').html(response);
        }
    });
}
function search_usergroup() {
    $("#table_user_group >tbody >tr").each(function (index) {
        var text = "";
        switch ($("#cbo_usergroup_usercode").val()) {
            case "User":
                text = $("#td_usercode_" + index).text().toLowerCase();
                break;
            case "GroupName":
                text = $("#td_groupname_" + index).text().toLowerCase();
                break;
            case "SubGroup":
                text = $("#td_subcode_" + index).text().toLowerCase();
                break;
            case "SubName":
                text = $("#td_subname_" + index).text().toLowerCase();
                break;
        }
        if (text.replace(/\s+/g, '').indexOf($("#txt_usergroup_find").val().replace(/\s+/g, '').toLowerCase()) == -1) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

function cbo_get_change_reason_mapping() {
    var dp = $("#cbo_department").val();
    var dc = $("#cbo_document").val();

    $('#tbl_reason_document > tbody  > tr').each(function (index, tr) {
        var indexId = $(this).attr('id').replace("tr_reason_row_", "");
        $("#td_apply_doc_" + indexId).removeAttr('checked');
        $("#td_auto_approve_" + indexId).removeAttr('checked');
    });

    if (dp != "" && dc != "") {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/admin/get_change_reason_mapping',
            data: JSON.stringify(
                {
                    'department': dp,
                    'document': dc
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    $('#tbl_reason_document > tbody  > tr').each(function (index, tr) {
                        var indexId = $(this).attr('id').replace("tr_reason_row_", "");
                        for (i = 0; i < data.data.length; i++) {
                            var x = data.data[i];
                            if ($("#td_reason_code_" + indexId).text() == x.ReasonCode) {
                                if (x.ApplyDoc == 'Y') {
                                    $("#td_apply_doc_" + indexId).attr('checked', 'checked');
                                } else {
                                    $("#td_apply_doc_" + indexId).removeAttr('checked');
                                }
                                if (x.AutoApprove == 'Y') {
                                    $("#td_auto_approve_" + indexId).attr('checked', 'checked');
                                } else {
                                    $("#td_auto_approve_" + indexId).removeAttr('checked');
                                }
                                return true;
                            }
                        }
                    });
                }
                else {
                    ShowAlert(data.Message);
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}
function cmd_update_reason_mapping() {
    var reaList = [];
    var dp = $("#cbo_department").val();
    var dc = $("#cbo_document").val();
    if (dp == "" || dc == "") {
        ShowAlert("Department and Document Type cannot empty!");
    } else {
        $('#tbl_reason_document > tbody  > tr').each(function (index, tr) {
            var indexId = $(this).attr('id').replace("tr_reason_row_", "");
            var rea = {
                DepartCode: dp,
                DocType: dc,
                ReasonCode: $("#td_reason_code_" + indexId).text(),
                ApplyDoc: $("#td_apply_doc_" + indexId).is(":checked") ? 'Y' : 'N',
                AutoApprove: $("#td_auto_approve_" + indexId).is(":checked") ? 'Y' : 'N'
            }
            reaList.push(rea);
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/admin/update_reason_mapping',
            data: JSON.stringify(
                {
                    'reasons': reaList
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    ShowAlert(data.Message);
                    location.reload();
                }
                else {
                    ShowAlert(data.Message);
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}

function read_detail_document(actType, rowId) {
    var docEntry = $("#td_doc_entry_" + rowId).text();
    var docType = $("#td_base_type_" + rowId).text();
    var boqType = $("#td_boq_type_" + rowId).text();
    var isBoq = $("#td_is_boq_" + rowId).text();
    var alertEntry = $("#td_alert_entry_" + rowId).text();
    var alertType = $("#td_noti_type_" + rowId).text();
    var currUser = $("#td_curen_user_" + rowId).text();
    $.ajax({
        url: '/admin/update_read_detail_document',
        type: 'POST',
        data: { actType: actType, AlertEntry: alertEntry, AlertType: alertType, CurrUser: currUser, BaseEntry: docEntry, BaseType: docType },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            if (data.status == "OK") {
                var baseUrl = "";
                if (docType == "PR") {
                    if (boqType == "M") {
                        if (isBoq == "Yes") {
                            baseUrl = "/purpr/editboqmatpr?key=" + docEntry;
                        }
                        else {
                            baseUrl = "/purpr/editnboqmatpr?key=" + docEntry;
                        }
                    }
                    else if (boqType == "S") {
                        if (isBoq == "Yes") {
                            baseUrl = "/purpr/editboqsubpr?key=" + docEntry;
                        }
                        else {
                            baseUrl = "/purpr/editnboqsubpr?key=" + docEntry;
                        }
                    }
                    else if (boqType == "A") {
                        baseUrl = "/purpr/editprservice?key=" + docEntry;
                    }
                    else if (boqType == "D") {
                        baseUrl = "/purpr/editprservice_direct?key=" + docEntry;
                    }

                }
                else if (docType == "PO") {
                    if (boqType == "M") {
                        if (isBoq == "Yes") {
                            baseUrl = "/purpo/editmatboqpo?key=" + docEntry;
                        }
                        else {
                            baseUrl = "/purpo/editmatnonboqpo?key=" + docEntry;
                        }
                    }
                    else if (boqType == "S") {
                        if (isBoq == "Yes") {
                            baseUrl = "/purpo/editsubboqpo?key=" + docEntry;
                        }
                        else {
                            baseUrl = "/purpo/editsubnonboqpo?key=" + docEntry;
                        }
                    }
                    else if (boqType == "A") {
                        baseUrl = "/purpo/editposervice?key=" + docEntry;
                    }
                    else if (boqType == "D") {
                        baseUrl = "/purpo/editposervice_direct?key=" + docEntry;
                    }
                    else if (boqType == "L") {
                        if (isBoq == "Yes") {
                            baseUrl = "/purpo/editlabboq?key=" + docEntry;
                        }
                        else {
                            baseUrl = "/purpo/editlaborboqpo?key=" + docEntry;
                        }
                    }
                }
                else if (docType == "GRPO") {
                    if (boqType == "M") {
                        if (isBoq == "Yes") {
                            baseUrl = "/purgrpo/editmatboqgrpo?key=" + docEntry;
                        }
                        else {
                            baseUrl = "/purgrpo/editmatnonboqgrpo?key=" + docEntry;
                        }
                    }
                    else if (boqType == "S") {
                        if (isBoq == "Yes") {
                            baseUrl = "/purgrpo/editsubboqgrpo?key=" + docEntry;
                        }
                        else {
                            baseUrl = "/purgrpo/editsubnongrpo?key=" + docEntry;
                        }
                    }
                    else if (boqType == "A") {
                        baseUrl = "/purgrpo/editgrposervice?key=" + docEntry;
                    }
                }
                else if (docType == "GR") {
                    if (boqType == "M") {
                        if (isBoq == "Yes") {
                            baseUrl = "/purgrt/editmatboqgrt?key=" + docEntry;
                        }
                        else {
                            baseUrl = "/purgrt/editmatnonboqgrt?key=" + docEntry;
                        }
                    }
                    else if (boqType == "S") {
                        if (isBoq == "Yes") {
                            baseUrl = "/purgrt/editsubboqgrt?key=" + docEntry;
                        }
                        else {
                            baseUrl = "/purgrt/editsubnongrt?key=" + docEntry;
                        }
                    }
                }
                else if (docType == "InvGI") {
                    if (boqType == "M") {
                        if (isBoq == "Yes") {
                            baseUrl = "/invgi/editboqgi?key=" + docEntry;
                        }
                        else {
                            baseUrl = "/invgi/editnongi?key=" + docEntry;
                        }
                    }
                }
                else if (docType == "InvGR") {
                    if (boqType == "M") {
                        if (isBoq == "Yes") {
                            baseUrl = "/invgr/editboqgr?key=" + docEntry;
                        }
                        else {
                            baseUrl = "/invgr/editnongr?key=" + docEntry;
                        }
                    }
                }
                else if (docType == "InvTR") {
                    baseUrl = "/invtrn/edittrn?key=" + docEntry;
                }
                else if (docType == "RTT") {
                    baseUrl = "/purpo/editretention?key=" + docEntry;
                }

                window.open(baseUrl, "_blank");
                location.reload();
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function cbo_alert_change_doc() {
    var cboDoc = $("#cbo_doc_id").val();

    $.ajax({
        url: '/admin/get_alert_setup',
        type: 'POST',
        data: {
            docID: cboDoc
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
                //$("#cbo_doc_id").val(data.DocID);
                $("#txt_list_after_read").val(data.AfterReaded);
                $("#txt_before_over_date").val(data.BeforeDate);
                if (data.data.length > 0) {
                    for (i = 0; i < data.data.length; i++) {
                        var x = data.data[i];
                        $("#chk_alert_" + x.UserCode).attr("checked", "checked");
                    }
                }
            }
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });

    if (cboDoc == "PR" || cboDoc == "PO" || cboDoc == "GRPO") {
        $("#div_Over_date").show();
    } else {
        $("#div_Over_date").hide();
    }
}
function cmd_save_alert_setup() {
    var list = [];
    var allow = 0;
    var docid = $("#cbo_doc_id").val();
    var afterRead = $("#txt_list_after_read").val();
    var beforDate = $("#txt_before_over_date").val();
    if (docid == "") {
        allow = 1;
        ShowAlert("Document cannot empty!");
    } else if (afterRead == "") {
        allow = 2;
        ShowAlert("[List After Read(Day)] cannot empty!");
    }
    else if (beforDate == "") {
        allow = 3;
        ShowAlert("[Before Over Due/Requiry Date(Day)] cannot empty!");
    }

    if (allow == 0) {
        var head = {
            DocID: $("#cbo_doc_id").val(),
            AfterReaded: $("#txt_list_after_read").val(),
            BeforeDate: $("#txt_before_over_date").val()
        };
        $("#table_user_list > tbody  > tr").find("input[type='checkbox']").each(function () {
            if (this.checked) {
                var id = this.id.replace("chk_alert_", "");
                var detail = {
                    UserCode: $("#td_usercode_" + id).text()
                };
                list.push(detail);
            }
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/admin/cmd_save_alert_setup',
            data: JSON.stringify(
                {
                    'head': head, 'detail': list
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

function add_row_user_mapping_boq(rowId) {
    var blocks = "<option value=''></option>";
    $("#cbo_block_list > option").each(function () {
        blocks = blocks + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    var mainwork = "<option value=''></option>";
    $("#cbo_main_work_list > option").each(function () {
        mainwork = mainwork + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    var subwork = "<option value=''></option>";
    var tr = "<tr id='tr_mapping_boq_" + rowId + "'>";
    tr = tr + "<td style='display:none'> <input type='checkbox' id='checkbox_line_detail_checkbox_" + rowId + "' disabled></td>";
    tr = tr + "<td style='display:none' id='tr_remove_id_" + rowId + "'><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='remove_row_user_mapping_boq(" + rowId + ")'></i></td>";
    tr = tr + "<td id='tr_unremove_id_" + rowId + "'><i class='fa fa-fw fa-remove text-danger' style='cursor:not-allowed'></i></td>";
    tr = tr + "<td><select class='form-control form-control-insde' id='cbo_boq_mapping_ocrcode2_" + rowId + "' onchange='check_add_row_user_mapping_boq()'>" + blocks + "</select></td>";
    tr = tr + "<td><select class='form-control form-control-insde' id='cbo_boq_mapping_main_work_" + rowId + "' onchange='get_sub_work_by_main(" + rowId + ")'>" + mainwork + "</td>";
    tr = tr + "<td><select class='form-control form-control-insde' id='cbo_boq_mapping_sub_work_" + rowId + "' onchange='check_add_row_user_mapping_boq()'>" + subwork + "</select></td>";
    tr = tr + "<td style='display:none'><input type='text' class='form-control noborder' id='txt_mapping_boq_entry_" + rowId + "' value='-1' readonly></td>";
    tr = tr + "</tr>";
    $("#table_boq_mapping >tbody").append(tr);
}
function check_add_row_user_mapping_boq() {
    var lentbl = $("#table_boq_mapping >tbody >tr").length;
    var index = 0;
    if (lentbl > 0) {
        var indexId = $('#table_boq_mapping > tbody > tr:last').attr('id').replace("tr_mapping_boq_", "");
        index = parseInt(indexId) + 1;
    } else {
        index = 1;
    }
    if (index > 1) {
        if ($("#cbo_boq_mapping_ocrcode2_" + indexId).val() != "" && $("#cbo_boq_mapping_sub_work_" + indexId).val() != "") {
            if (check_duplicate_row_user_mapping_boq(indexId) == "No") {
                $("#checkbox_line_detail_checkbox_" + indexId).removeAttr('disabled');
                $("#tr_remove_id_" + indexId).show();
                $("#tr_unremove_id_" + indexId).hide();
                add_row_user_mapping_boq(index);
            } else {
                ShowAlert("Duplicate BOQ Data!");
                $("#cbo_boq_mapping_ocrcode2_" + indexId).val("");
                $("#cbo_boq_mapping_sub_work_" + indexId).val("");
            }
        }
    }
}
function remove_row_user_mapping_boq(rowId) {
    var lentbl = $("#table_boq_mapping >tbody >tr").length;
    if (lentbl > 1) {
        $("#tr_mapping_boq_" + rowId).remove();
    }
}
function check_duplicate_row_user_mapping_boq(rowId) {
    var duplicate = "No";
    $('#table_boq_mapping > tbody  > tr').each(function (index, tr) {
        var indexId = $(this).attr('id').replace("tr_mapping_boq_", "");
        if (rowId != indexId) {
            if ($("#cbo_boq_mapping_ocrcode2_" + indexId).val() != "" && $("#cbo_boq_mapping_sub_work_" + indexId).val() != "") {
                var block = $("#cbo_boq_mapping_ocrcode2_" + indexId).val();
                var main = $("#cbo_boq_mapping_main_work_" + indexId).val();
                var sub = $("#cbo_boq_mapping_sub_work_" + indexId).val();
                if (block == $("#cbo_boq_mapping_ocrcode2_" + rowId).val() && main == $("#cbo_boq_mapping_main_work_" + rowId).val() && sub == $("#cbo_boq_mapping_sub_work_" + rowId).val()) {
                    duplicate = "Yes";
                    return false;
                }
            }
        }
    });

    return duplicate;
}
function cmd_get_user_boq_mapping_template() {
    var fileUpload = $("#file_input_id").get(0);
    var files = fileUpload.files;
    var fileData = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileData.append(files[i].name, files[i]);
    }
    $("#FileNameId").text(files[0].name);
    $.ajax({
        url: '/admin/SaveTemplateFile',
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
        success: function (imp) {
            if (imp.status == 'OK') {
                $("#table_boq_mapping >tbody").empty();
                for (i = 0; i < imp.data.length; i++) {
                    var x = imp.data[i];
                    var tr = "<tr tr id='tr_mapping_boq_" + i + "'>";
                    tr = tr + "< td style = 'display:none;' > <input type='checkbox' id='checkbox_line_detail_checkbox_" + i + "' disabled></td>";
                    tr = tr + "<td style='display:none' id='tr_remove_id_" + i + "'><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='remove_row_mapping_boq(" + i + ")'></i></td>";
                    tr = tr + "<td style='display:none' id='tr_unremove_id_" + i + "'><i class='fa fa-fw fa-remove text-danger' style='cursor:not-allowed'></i></td>";
                    tr = tr + "<td><input type='text' class='form-control noborder' placeholder='No' readonly value='" + (i + 1) + "'></td>";
                    tr = tr + "<td><input type='text' class='form-control noborder' placeholder='user Code' id='txt_user_code_" + i + "' readonly value='" + x.ChildCode + "'></td>";
                    tr = tr + "<td><input type='text' class='form-control noborder' placeholder='user Name' id='txt_user_name_" + i + "' readonly value='" + x.ChildName + "'></td>";
                    tr = tr + "<td><input type='text' class='form-control noborder' placeholder='House Code' id='cbo_boq_mapping_ocrcode2_" + i + "' readonly value='" + x.OcrCode2 + "'></td>";
                    tr = tr + "<td><input type='text' class='form-control noborder' placeholder='Main Work' readonly value='" + x.MainWorkName + "'></td>";
                    tr = tr + "<td><input type='text' class='form-control noborder' placeholder='Sub Work' readonly value='" + x.SubWorkName + "'></td>";
                    tr = tr + "<td><input type='text' class='form-control noborder' placeholder='Parent Code' id='txt_import_type_" + i + "' readonly value='" + x.ChildStatus + "'></td>";
                    tr = tr + "<td style='display:none;'><input type='text' class='form-control noborder' id='cbo_boq_mapping_main_work_" + i + "' readonly value='" + x.U_MainWork + "'></td>";
                    tr = tr + "<td style='display:none;'><input type='text' class='form-control noborder' id='cbo_boq_mapping_sub_work_" + i + "' readonly value='" + x.U_SubWork + "'></td>";
                    tr = tr + "<td style='display:none;'><input type='text' class='form-control noborder' id='txt_mapping_boq_entry_" + i + "' readonly value='-1'></td>";
                    tr = tr + "</tr>";
                    $("#table_boq_mapping >tbody").append(tr);
                }
            } else {
                alert(imp.msg);
            }
        },
        error: function (err) {
            alert(err);
        }
    });
}
function cmd_save_user_boq_mapping_import() {
    var boqmap = [];
    if ($("#table_boq_mapping >tbody >tr").length == 0) {
        ShowAlert("No data to import!");
    } else {
        $('#table_boq_mapping > tbody  > tr').each(function (index, tr) {
            var indexId = $(this).attr('id').replace("tr_mapping_boq_", "");
            if ($("#cbo_boq_mapping_ocrcode2_" + indexId).val() != "" && $("#cbo_boq_mapping_sub_work_" + indexId).val() != "") {
                var boq = {
                    DocEntry: $("#txt_mapping_boq_entry_" + indexId).val(),
                    UsrCode: $("#txt_user_code_" + indexId).val(),
                    OcrCode2: $("#cbo_boq_mapping_ocrcode2_" + indexId).val(),
                    MainWork: $("#cbo_boq_mapping_main_work_" + indexId).val(),
                    SubWork: $("#cbo_boq_mapping_sub_work_" + indexId).val(),
                    ImpType: $("#txt_import_type_" + indexId).val()
                }
                boqmap.push(boq);
            }
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/admin/save_boq_mapping_import',
            data: JSON.stringify(
                {
                    'boqmap': boqmap
                }),
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    ShowAlert(data.Message);
                    location.reload();
                }
                else {
                    ShowAlert(data.Message);
                }
            },
            failure: function (response) {
                $('#result').html(response);
            }
        });
    }
}