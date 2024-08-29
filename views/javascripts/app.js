var main = function() {
    "use strict";

    $.get("user", {}, function(response) {
        if (response["status"] == "success") {
            const message = response["message"];
            $(".getStarted").attr("href", "views/dashboard.html");
            $(".signIn").css("display", "none");
            $(".signedIn").text(message["name"].charAt(0));
            $(".signedIn").css("display", "inline");
        }
        else {
            $(".signedIn").css("display", "none");
            $(".signIn").css("display", "inline");
        }
    });

    // $("nav a").toArray().forEach((element) => {
    //     $(element).on("click", () => {
    //         if ($(element).is(":nth-child(1)")) {
    //             $.get("/", {page: 2});
    //         }
    //     });
    // });
}

$(document).ready(main);