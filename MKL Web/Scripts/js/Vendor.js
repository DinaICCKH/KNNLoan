function get_district_by_province_change(index) {
    var procode = $("#cbo_province_" + index).val();
    $.ajax({
        url: '/getData/get_district_by_province',
        type: 'POST',
        data: { procode: procode },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#cbo_district_" + index).empty();
            options = "<option value=''></option>";
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                options = options + "<option value='" + x.Code + "'>" + x.Name + "</option>";
            }
            $("#cbo_district_" + index).append(options);
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_commune_by_district_change(index) {
    var distcode = $("#cbo_district_" + index).val();
    $.ajax({
        url: '/getData/get_commune_by_district',
        type: 'POST',
        data: { districtcode: distcode },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            $("#cbo_commune_" + index).empty();
            options = "<option value=''></option>";
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                options = options + "<option value='" + x.Code + "'>" + x.U_Sangkat + "</option>";
            }
            $("#cbo_commune_" + index).append(options);
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function get_address_change(index) {
    var commcode = $("#cbo_commune_" + index).val();
    $.ajax({
        url: '/getData/get_address',
        type: 'POST',
        data: { commcode: commcode },
        datatype: 'json',
        beforeSend: function () {
            $("#loading").show();
        },
        complete: function () {
            $("#loading").hide();
        },
        success: function (data) {
            for (i = 0; i < data.data.length; i++) {
                var x = data.data[i];
                $("#txt_address_en_" + index).val(x.U_AddressEn);
                $("#txt_address_kh_" + index).val(x.U_AddressKh);
                $("#td_postal_" + index).text(x.Code);
            }
            addBlackAddress();
        },
        error: function (error) {
            alert('Error while read data => ' + error);
        }
    });
}
function txt_contact_enname_change(index) {
    var tr = $("#table_contact_person>tbody>tr:last");
    var id = tr.attr('id').replace("tr_contact_", "");
    if ($("#txt_contact_enname_" + id).val() != "") {
        addBlankContact();
    }
}
function addBlankContact() {
    var lastrow = 1;
    $("#table_contact_person>tbody>tr:last").each(function () {
        var id = $(this).attr('id').replace("tr_contact_", "");
        lastrow = id;
    });
    lastrow++;
    var prooption = "";
    $("#cbo_relationship > option").each(function () {
        prooption = prooption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });
    var data = "<tr tr id='tr_contact_" + lastrow + "'>";
    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='remove_contact_line(" + lastrow + ")'></i></td>";
    data = data + "<td  id='td_show_line_num_" + lastrow + "'>" + lastrow + "</td>";
    data = data + "<td><input type='text' class='form-control noborder' placeholder='EN Name' id='txt_contact_enname_" + lastrow + "'  onchange='txt_contact_enname_change(" + lastrow + ")'></td>";
    data = data + "<td><input type='text' class='form-control noborder' placeholder='KH Name' id='txt_contact_khname_" + lastrow + "'></td>";
    data = data + "<td><select class='form-control form-control-insde' id='cbo_contact_gender_" + lastrow + "'><option value='Male'>Male</option><option value='Female'>Female</option></select></td>";
    data = data + "<td><input type='text' class='form-control noborder' placeholder='ID/Password' id='txt_contact_id_" + lastrow + "'></td>";
    data = data + "<td><select class='form-control form-control-insde' id='cbo_contact_relationship_" + lastrow + "'>" + prooption + "</select></td>";

    data = data + "<td><input type='text' class='form-control noborder' placeholder='Address' id='txt_contact_address_" + lastrow + "'></td>";
    data = data + "<td><input type='text' class='form-control noborder' placeholder='Tel 1' id='txt_contact_tel1_" + lastrow + "'></td>";
    data = data + "<td><input type='text' class='form-control noborder' placeholder='Tel 2' id='txt_contact_tel2_" + lastrow + "'></td>";
    data = data + "<td><input type='text' class='form-control noborder' placeholder='E-Mail' id='txt_contact_mail_" + lastrow + "'></td>";
    data = data + "<td><input type='text' class='form-control noborder' placeholder='Telegram' id='txt_contact_telegram_" + lastrow + "'></td>";
    data = data + "<td><input type='text' class='form-control noborder' placeholder='Facebook' id='txt_contact_facebook_" + lastrow + "'></td>";
    data = data + "<td><input type='text' class='form-control noborder' placeholder='WhatsApp' id='txt_contact_whatapp_" + lastrow + "'></td>";
    data = data + "<td><input type='text' class='form-control noborder' placeholder='Line' id='txt_contact_line_" + lastrow + "'></td>";
    data = data + "<td style='display:none' id='td_contact_code_" + lastrow + "'>-1<td>";
    data = data + "<td style='display:none' id='td_status_" + lastrow + "'>New<td>";
    data = data + "</tr>";
    $("#table_contact_person>tbody").append(data);
}
function remove_contact_line(index) {
    //$("#tr_contact_" + index).remove();
    $("#td_status_" + index).text("Delete");
    $('#table_contact_person > tbody  > tr').each(function (index, tr) {
        var id = $(this).attr('id').replace("tr_contact_", "");
        if ($("#td_status_" + id).text() == "Delete") {
            $(this).hide();
        }
        else {
            $(this).show();
        }
    });
}
function addBlackAddress() {
    var lastrow = 1;
    $("#table_province>tbody>tr:last").each(function () {
        var id = $(this).attr('id').replace("tr_address_", "");
        lastrow = id;
    });
    lastrow++;
    var prooption = "";
    $("#cbo_province_list > option").each(function () {
        prooption = prooption + "<option value='" + this.value + "'>" + this.text + "</option>";
    });

    var data = "<tr tr id='tr_address_" + lastrow + "'>";
    data = data + "<td><i class='fa fa-fw fa-remove text-danger' style='cursor:pointer' onclick='remove_address_line(" + lastrow + ")'></i></td>"
    data = data + "<td id='td_show_line_num_" + lastrow + "'>" + lastrow + "</td>";
    data = data + "<td>";
    data = data + "<select class='form-control form-control-insde' id='cbo_add_type_" + lastrow + "'>";
    data = data + "<option value='B'>Bill To</option>";
    data = data + "<option value='S'>Ship To</option>";
    data = data + "</select></td>";
    data = data + "<td>";
    data = data + "<select class='form-control form-control-insde' id='cbo_province_" + lastrow + "' onchange='get_district_by_province_change(" + lastrow + ")'>" + prooption + "</select></td>";
    data = data + "<td>";
    data = data + "<select class='form-control form-control-insde' id='cbo_district_" + lastrow + "' onchange='get_commune_by_district_change(" + lastrow + ")'></select>";
    data = data + "</td>";
    data = data + "<td><select class='form-control form-control-insde' id='cbo_commune_" + lastrow + "' onchange='get_address_change(" + lastrow + ")'></select></td>";
    data = data + "<td><input type='text' class='form-control noborder' id='txt_address_en_" + lastrow + "' placeholder='Address EN'></td>";
    data = data + "<td><input type='text' class='form-control noborder' id='txt_address_kh_" + lastrow + "' placeholder='Address KH'></td>";
    data = data + "<td style='display:none' id='td_postal_" + lastrow + "'></td>";
    data = data + "<td style='display:none' id='td_line_num_" + lastrow + "'>-1</td>";
    data = data + "<td style='display:none' id='td_status_" + lastrow + "'>New</td>";
    data = data + "</tr>";
    $("#table_province>tbody").append(data);
}
function remove_address_line(index) {
    //$("#tr_address_" + index).remove();
    $("#td_status_" + index).text("Delete");
    var rowindex = 1;
    $('#table_province > tbody  > tr').each(function (index, tr) {
        var id = $(this).attr('id').replace("tr_address_", "");
        if ($("#td_status_" + id).text() == "Delete") {
            $(this).hide();
        }
        else {
            $(this).show();
            $("#td_show_line_num_" + id).text(rowindex);
            rowindex++;
        }
    });
}
function cbo_bp_group_change() {
    if ($("#cbo_bp_group").val() == "") {
        ShowAlert("Please choose Group");
    }
    else {
        $.ajax({
            url: '/getData/get_BPCode',
            type: 'POST',
            data: { cardtype: $("#cbo_bp_type").val(), groupcode: $("#cbo_bp_group").val() },
            datatype: 'json',
            beforeSend: function () {
                $("#loading").show();
            },
            complete: function () {
                $("#loading").hide();
            },
            success: function (data) {
                if (data.status == "OK") {
                    $("#txt_bp_code").val(data.docnum);
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
}

function cmd_remove_bp() {
    var head = {
        CardCode: $("#txt_bp_code").val()
    };
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/master/cmd_remove_bp',
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
                window.location.href = '/master/viewVendor';
            }
        },
        failure: function (response) {
            $('#result').html(response);
        }
    });
}
function cmd_save_bp() {
    allow = 0;
    lineno = 0;
    var address = [];
    var contact = [];
    if ($("#txt_bp_en_name").val() == "") {
        ShowAlert("EN Name is required");
        allow = 1;
    }
    if ($("#cbo_bp_group").val() == "" && allow == 0) {
        ShowAlert("Vendor Group is required");
        allow = 1;
    }
    if ($("#txt_tel1").val() == "" && allow == 0) {
        ShowAlert("Telephone 1 is required");
        allow = 1;
    }
    if (allow == 0) {
        var dob = ($('#txt_dbo').val() == "" ? "01-01-1999" : $('#txt_dbo').val()).split("-");
        var head = {
            CardType: $("#cbo_bp_type").val(),
            CardCode: $("#txt_bp_code").val(),
            CardName: $("#txt_bp_en_name").val(),
            FrgnName: $("#txt_bp_kh_name").val(),
            GroupCode: $("#cbo_bp_group").val(),
            Currency: $("#cbo_currency").val(),
            Tel1: $("#txt_tel1").val(),
            Tel2: $("#txt_tel2").val(),
            Email: $("#txt_mail").val(),
            IDNo: $("#txt_id").val(),
            Gender: $("#cbo_gender").val(),
            DOB: dob[2] + "/" + dob[1] + "/" + dob[0],
            Source: $("#cbo_source").val(),
            Pricelist: $("#cbo_price_list").val(),
            PaymentTerm: $("#cbo_payment_term").val(),
            CreditLimit: returnstringvalue($("#txt_credit_limit").val()),
            CreatedBy: $("#txt_shared_userid").val()
        };
        $('#table_province > tbody  > tr').each(function (index, tr) {
            var id = $(this).attr('id').replace("tr_address_", "");
            var detail = {
                CardCode: $("#txt_bp_code").val(),
                Linenum: $("#td_line_num_" + id).text(),
                Province: $("#cbo_province_" + id).val(),
                Khan: $("#cbo_district_" + id).val(),
                Sangkat: $("#cbo_commune_" + id).val(),
                FullAddressKH: $("#txt_address_en_" + id).val(),
                FullAddressEN: $("#txt_address_kh_" + id).val(),
                PostCode: $("#td_postal_" + id).text(),
                AddressType: $("#cbo_add_type_" + id).val(),
                Telegram: $("#td_status_" + id).text()
            };
            address.push(detail);
        });
        $('#table_contact_person > tbody  > tr').each(function (index, tr) {
            var id = $(this).attr('id').replace("tr_contact_", "");
            var detail = {
                Cntctcode: $("#td_contact_code_" + id).text(),
                CardCode: $("#txt_bp_code").val(),
                ENName: $("#txt_contact_enname_" + id).val(),
                KHName: $("#txt_contact_khname_" + id).val(),
                Gender: $("#cbo_contact_gender_" + id).val(),
                ID: $("#txt_contact_id_" + id).val(),
                Relationship: $("#cbo_contact_relationship_" + id).val(),
                Address: $("#txt_contact_address_" + id).val(),
                Tel1: $("#txt_contact_tel1_" + id).val(),
                Tel2: $("#txt_contact_tel2_" + id).val(),
                Email: $("#txt_contact_mail_" + id).val(),
                Telegram: $("#txt_contact_telegram_" + id).val(),
                Facebook: $("#txt_contact_facebook_" + id).val(),
                Whatapp: $("#txt_contact_whatapp_" + id).val(),
                Line: $("#txt_contact_line_" + id).val(),
                Status: $("#td_status_" + id).text()
            };
            contact.push(detail);
        });
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'POST',
            url: '/master/cmd_save_bp',
            data: JSON.stringify(
                {
                    'header': head,
                    'address': address,
                    'contact': contact
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
