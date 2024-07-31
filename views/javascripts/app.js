var main = function() {
    "use strict";

    $.get("user", {}, function(response) {
        if (response["status"] == "success") {
            const message = response["message"];
            console.log(message);
            $(".getStarted").attr("href", "views/dashboard.html");
            $(".signIn").css("display", "none");
            $(".signedIn").text(message["name"].charAt(0));
            $(".signedIn").css("display", "inline");
        }
        else {
            $(".signedIn").css("display", "none");
            $(".signIn").css("display", "inline");
        }
        console.log(response["status"]);
    });
}

$(document).ready(main);