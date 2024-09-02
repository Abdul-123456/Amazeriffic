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
        var firstName, lastName, email, password, confirmPassword;
        
        firstName = $("#firstName").val();
        lastName = $("#lastName").val();
        email = $("#emailReg").val();
        password = $("#passwordReg").val();
        confirmPassword = $("#passwordCon").val();

        if (firstName == "") {
            $(".fnLabel").text("First Name - Required");
            $(".fnLabel").css("color", "red");
            $("#passwordReg").val("");
            $("#passwordCon").val("");
        }
        else if ($(".fnLabel").css("color") != "black") {
            $(".fnLabel").css("color", "black");
            $(".fnLabel").text("First Name "); 
        }
        
        if (lastName == "") {
            $(".lnLabel").text("Last Name - Required");
            $(".lnLabel").css("color", "red");
            $("#passwordReg").val("");
            $("#passwordCon").val("");
        }
        else if ($(".lnLabel").css("color") != "black") {
            $(".lnLabel").css("color", "black");
            $(".lnLabel").text("Last Name "); 
        }
        
        if (email == "") {
            $(".eLabel").text("Email - Required");
            $(".eLabel").css("color", "red");
            $("#passwordReg").val("");
            $("#passwordCon").val("");
        }
        else if ($(".eLabel").css("color") != "black") {
            $(".eLabel").css("color", "black");
            $(".eLabel").text("Email "); 
        }
        
        if (password == "") {
            $(".pLabel").text("Password - Required");
            $(".pLabel").css("color", "red");
            $("#passwordReg").val("");
            $("#passwordCon").val("");
        }
        else if ($(".pLabel").css("color") != "black") {
            $(".pLabel").css("color", "black");
            $(".pLabel").text("Password "); 
        }
        
        if (confirmPassword == "") {
            $(".cpLabel").text("Confirm Password - Required");
            $(".cpLabel").css("color", "red");
            $("#passwordReg").val("");
            $("#passwordCon").val("");
        }
        else if ($(".cpLabel").css("color") != "black") {
            $(".cpLabel").css("color", "black");
            $(".cpLabel").text("Confirm Password "); 
        }

        if (password != confirmPassword) {
            $(".pLabel").text("Password - Passwords do not match");
            $(".pLabel").css("color", "red");
            $(".cpLabel").text("Confirm Password - Passwords do not match");
            $(".cpLabel").css("color", "red");
            $("#passwordReg").val("");
            $("#passwordCon").val("");
        }

        if (firstName != "") {
            if (lastName != "") {
                if (email != "") {
                    if (password != "") {
                        if (confirmPassword != "") {
                            if (password == confirmPassword) {
                                $.post("/auth/register", {
                                    'first_name' : firstName,
                                    'last_name' : lastName,
                                    'email' : email,
                                    'password' : password
                                },
                                (response) => {
                                    if (response['status'] == 'success') {
                                        location.replace('http://localhost:4000/views/login.html');
                                    }
                                    else if (response['message'] == 'This email is already in use') {
                                        $("#passwordReg").val("");
                                        $("#passwordCon").val("");
                                        $(".eLabel").text("Email - This Email is Already in Use");
                                        $(".eLabel").css("color", "red");
                                    }
                                    else {
                                        console.log(response['message']);
                                        setNotificationBar(0, "An Error Occurred. Please Try Again!");
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
        return false;
    });
}

$(document).ready(main);