$(document).ready(function() {
    getToppings();
});

$(document).on("keydown", function(e) {
    // capture the enter key and call submitTopping() if pressed
    var key = e.which || e.keyCode || e.charCode;
    if (key === 13) {
        addTopping();
    }
});

$(document).on("click", "#btnSubmit", function(e) {
    e.stopPropagation();
    e.preventDefault();
    addTopping();
});

function addTopping() {
    $.ajax({
        url: 'pizzapizza.php?action=addTopping',
        data: {
            topping: $("#topping").val()
        },
        success: function(result) {
            try {
                json = jQuery.parseJSON(result);
                console.log(json);
            } catch (e) {
                showError("Invalid JSON returned from server: " + result);
                return;
            }
            if (json["success"] === 0) {
                showError(json["errormsg"]);
            } else {
                $("#topping").val("");
                getToppings();
            }
        },
        error: function() {
            showError('Error Reaching pizzapizza.php');
        }
    });
}

function getToppings() {
    $.ajax({
        url: 'pizzapizza.php?action=getToppings',
        dataType:"JSON",
        success: function(json) {

            if (json["success"] === "0") {
                showError(json["errormsg"]);
            } else {
                console.log(json.toppings.length)
                if (json.toppings.length > 0) {
                    $("#listToppings").empty();
                    $.each(json.toppings, function(key, value) {
                        $("#listToppings").append("<li class='list-group-item d-flex justify-content-between align-items-center'><span>" + value + "</span><span class='badge badge-danger badge-pill' onClick='deleteTopping("+key+")' ><i class='fa fa-close'></i></span></li>");
                    });
                    $('p.hasToppings').show();
                    $('p.isEmpty').hide();
                } else {
                    $("#listToppings").empty();
                    $('p.hasToppings').hide();
                    $('p.isEmpty').show();
                }
            }
        },
        error: function() {
            showError('Error Reaching Server');
        }
    });
}

function deleteTopping(toppingId){
    console.log(toppingId);

    $.ajax({
        url: 'pizzapizza.php?action=deleteTopping&toppingId='+toppingId,
        dataType: 'JSON',
        success: function(result) {

            if(result.success === 0){
                showError(result.message);
            }else{
                getToppings();
            }
        },
        error: function(xhr) {
            console.log(xhr);
            showError('Error Reaching Server');
        }

    });

}

function showError(message) {
    alert("ERROR: " + message);
}