var main = function() {
    "use strict";

    var setNotificationBar = (boolean, message) => {
        $(".notificationBar").empty();
        $(".notificationBar").append(message);
        
        if (boolean == 1) {
            $(".notificationBar").css("color", "green");
            $(".notificationBar").css("display", "block");
        }
        else {
            $(".notificationBar").css("color", "red");
            $(".notificationBar").css("display", "block"); 
        }
        
        setTimeout(() => {
            $(".notificationBar").css("display", "none");
        }, 10000);
    }

    $(".btn").on("click", function () {
        var email, password;
        
        email = $("#emailReg").val();
        password = $("#passwordReg").val();
        
        if (email == "") {
            $(".eLabel").text("Email - Required");
            $(".eLabel").css("color", "red");
            $("#passwordReg").val("");
        }
        else if ($(".eLabel").css("color") != "black") {
            $(".eLabel").css("color", "black");
            $(".eLabel").text("Email "); 
        }
        
        if (password == "") {
            $(".pLabel").text("Password - Required");
            $(".pLabel").css("color", "red");
            $("#passwordReg").val("");
        }
        else if ($(".pLabel").css("color") != "black") {
            $(".pLabel").css("color", "black");
            $(".pLabel").text("Password "); 
        }

        if (email != "") {
            if (password != "") {
                $.post("/auth/login", {
                    'email' : email,
                    'password' : password
                },
                (response) => {
                    if (response['status'] == 'success') {
                        location.replace('https://amazeriffic.co/views/dashboard.html');
                    }
                    else {
                        $("#passwordReg").val("");
                        $("#emailReg").val("");
                        console.log(response['message']);
                        setNotificationBar(0, response['message']);
                    }
                });
            }
        }
        return false;
    });
}

$(document).ready(main);