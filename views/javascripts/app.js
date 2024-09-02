var main = function() {
    "use strict";

    $.get("/user", {}, function(response) {
        if (response["status"] == "success") {
            const message = response["message"];
            $(".getStarted").attr("href", "views/dashboard.html");
            $(".signIn").css("display", "none");
            $(".signedIn").text(message["firstName"].charAt(0));
            $(".signedIn").css("display", "inline");
        }
        else {
            $(".signedIn").css("display", "none");
            $(".signIn").css("display", "inline");
        }
    });
}

$(document).ready(main);