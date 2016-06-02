APIClient = function () {
    this.token = this.getCookie("token");
    this.baseUri = "http://localhost:49782";
    jQuery.support.cors = true;

    if (this.token == "") {
        $.get("Pages/login.html", function (result) {
            $("section#container").html(result)
        });
    }
    else {
        $.get("Pages/options.html", function (result) {
            $("section#container").html(result)
        });
    }
}

APIClient.prototype.setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

APIClient.prototype.getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

APIClient.prototype.authenticate = function () {
    var uri = this.baseUri + "/token";
    var postData = 'grant_type=password&username=' + $('#user-name').val() + '&password=' + $('#password').val();

    $.ajax({
        type: "POST",
        url: uri,
        data: postData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        processData: false,
        success: (function (ref) {
            return function (result) {
                ref.access_token = result.access_token;
                ref.setCookie("token", ref.access_token, 365);
                $.get("Pages/options.html", function (result) {
                    $("section#container").html(result)
                });
            }
        })(this),
        error: function (result, error) {
            var errorJSON = JSON.parse(result.responseText)
            alert(errorJSON.error_description);
        }
    });
}

APIClient.prototype.getLounges = function () {
    var uri = this.baseUri + "/api/v1/lounge";

    $.ajax({
        type: "GET",
        url: uri,
        headers: (function (ref) { return { "Authorization": "Bearer " + ref.token }; })(this),
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}

APIClient.prototype.getLounge = function () {
    var loungeId = $('#loungeId').val();
    var uri = this.baseUri + "/api/v1/lounge/" + loungeId;

    $.ajax({
        type: "GET",
        url: uri,
        headers: (function (ref) { return { "Authorization": "Bearer " + ref.token }; })(this),
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}

APIClient.prototype.getExtras = function () {
    var loungeId = $('#loungeIdE').val();
    var uri = this.baseUri + "/api/v1/lounge/" + loungeId + "/extra";

    $.ajax({
        type: "GET",
        url: uri,
        headers: (function (ref) { return { "Authorization": "Bearer " + ref.token }; })(this),
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}

APIClient.prototype.getLoungeAvailability = function () {
    var loungeId = $('#loungeIdA').val();
    var arrival = $('#arrival').val();
    var adults = $('#adults').val();
    var children = $('#children').val();
    var infants = $('#infants').val();
    var uri = this.baseUri + "/api/v1/lounge/" + loungeId + "/availability?arrival=" + arrival + "&adults=" + adults + "&children=" + children + "&infants=" + infants;

    $.ajax({
        type: "GET",
        url: uri,
        headers: (function (ref) { return { "Authorization": "Bearer " + ref.token }; })(this),
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}

APIClient.prototype.getLoungeOpeningTimes = function () {
    var loungeId = $('#loungeIdO').val();
    var day = $('#day').val();
    var uri = this.baseUri + "/api/v1/lounge/" + loungeId + "/times/" + day;

    $.ajax({
        type: "GET",
        url: uri,
        headers: (function (ref) { return { "Authorization": "Bearer " + ref.token }; })(this),
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}

APIClient.prototype.getLoungePrice = function () {
    var loungeId = $('#loungeIdP').val();
    var day = $('#dayP').val();
    var uri = this.baseUri + "/api/v1/lounge/" + loungeId + "/price/" + day;

    $.ajax({
        type: "GET",
        url: uri,
        headers: (function (ref) { return { "Authorization": "Bearer " + ref.token }; })(this),
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}

APIClient.prototype.createQuote = function () {
    var loungeId = $('#loungeIdQ').val();
    var flightTime = $('#flightTime').val();
    var adults = $('#adultsQ').val();
    var children = $('#childrenQ').val();
    var infants = $('#infantsQ').val();
    var uri = this.baseUri + "/api/v1/lounge/" + loungeId + "/quote?flightTime=" + flightTime + "&adults=" + adults + ((children != "") ? "&children=" + children : "") + ((infants != "") ? "&infants=" + infants : "");

    $.ajax({
        type: "POST",
        url: uri,
        headers: (function (ref) { return { "Authorization": "Bearer " + ref.token }; })(this),
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}

APIClient.prototype.addExtra = function () {
    var quoteId = $('#quoteId').val();
    var extraId = $('#extraId').val();
    var quantity = $('#quantity').val();
    var uri = this.baseUri + "/api/v1/lounge/quote/" + quoteId + "/extra/" + extraId + "?quantity=" + quantity;

    $.ajax({
        type: "POST",
        url: uri,
        headers: (function (ref) { return { "Authorization": "Bearer " + ref.token }; })(this),
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}

APIClient.prototype.updatePassengerInfo = function () {
    var quoteId = $('#quoteIdP').val();
    var uri = this.baseUri + "/api/v1/lounge/quote/" + quoteId + "/passengerinfo";
    var postData = {
        Email: $("#emailP").val(),
        Phone: $('#phoneP').val(),
        Title: $('#titleP').val(),
        FirstName: $('#firstNameP').val(),
        LastName: $('#lastNameP').val(),
    };

    $.ajax({
        type: "PUT",
        url: uri,
        headers: (function (ref) {
            return {
                "Authorization": "Bearer " + ref.token,
                "Content-Type": "application/json; charset=UTF-8"
            };
        })(this),
        data: JSON.stringify(postData),
        processData: false,
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}

APIClient.prototype.updateBillingInfo = function () {
    var quoteId = $('#quoteIdZ').val();
    var uri = this.baseUri + "/api/v1/lounge/quote/" + quoteId + "/billinginfo";
    var postData = {
        Title: $('#titleZ').val(),
        FirstName: $('#firstNameZ').val(),
        LastName: $('#lastNameZ').val(),
        Address: {
            Line1: $('#line1').val(),
            Line2: $('#line2').val(),
            City: $('#city').val(),
            Country: $('#country').val(),
            PostCode: $('#postCode').val()
        }
    };

    $.ajax({
        type: "PUT",
        url: uri,
        headers: (function (ref) {
            return {
                "Authorization": "Bearer " + ref.token,
                "Content-Type": "application/json; charset=UTF-8"
            };
        })(this),
        data: JSON.stringify(postData),
        processData: false,
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}

APIClient.prototype.confirmQuote = function () {
    var quoteId = $('#quoteIdC').val();
    var uri = this.baseUri + "/api/v1/lounge/quote/" + quoteId + "/confirm";
    var postData = {
        Email: $("#email").val(),
        Phone: $('#phone').val(),
        Title: $('#title').val(),
        FirstName: $('#firstName').val(),
        LastName: $('#lastName').val(),
    };

    $.ajax({
        type: "POST",
        url: uri,
        headers: (function (ref) {
            return {
                "Authorization": "Bearer " + ref.token,
                "Content-Type": "application/json; charset=UTF-8"
            };
        })(this),
        data: JSON.stringify(postData),
        processData: false,
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}

APIClient.prototype.getBooking = function () {
    var bookingRef = $('#bookingRef').val();
    var uri = this.baseUri + "/api/v1/lounge/booking/" + bookingRef;

    $.ajax({
        type: "GET",
        url: uri,
        headers: (function (ref) {
            return {
                "Authorization": "Bearer " + ref.token
            };
        })(this),
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}

APIClient.prototype.amendBooking = function () {
    var bookingRef = $('#bookingRefA').val();
    var uri = this.baseUri + "/api/v1/lounge/booking/" + bookingRef;

    $.ajax({
        type: "GET",
        url: uri,
        headers: (function (ref) {
            return {
                "Authorization": "Bearer " + ref.token
            };
        })(this),
        success: (function (ref) {
            return function (result) {
                result.Email = $("#emailA").val();
                result.Phone = $('#phoneA').val();
                result.Title = $('#titleA').val();
                result.FirstName = $('#firstNameA').val();
                result.LastName = $('#lastNameA').val();

                /*------------------------------------------
                 *          Actual Amend Call
                  ------------------------------------------*/
                $.ajax({
                    type: "PATCH",
                    url: uri,
                    data: JSON.stringify(result),
                    processData: false,
                    headers: (function (ref) {
                        return {
                            "Authorization": "Bearer " + ref.token,
                            "Content-Type": "application/json; charset=UTF-8"
                        };
                    })(ref),
                    success: (function (ref) {
                        return function (result) {
                            $("#results").html(JSON.stringify(result));
                        }
                    })(ref),
                    error: function (result, error) {
                        alert(result.responseText);
                    }
                });
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });

}

APIClient.prototype.deleteBooking = function () {
    var bookingRef = $('#bookingRefD').val();
    var uri = this.baseUri + "/api/v1/lounge/booking/" + bookingRef;

    $.ajax({
        type: "DELETE",
        url: uri,
        headers: (function (ref) {
            return {
                "Authorization": "Bearer " + ref.token
            };
        })(this),
        success: (function (ref) {
            return function (result) {
                $("#results").html(JSON.stringify(result));
            }
        })(this),
        error: function (result, error) {
            alert(result.responseText);
        }
    });
}