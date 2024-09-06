var main = function() {
    "use strict";

    function checkLogin() {
        $.get("/user", {}, (response) => {
            if (response["status"] != "success") {
                location.replace("https://amazeriffic.co/views/register.html");
            }
            else {
                console.log("logged in!");
            }
        });
    }

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
        }, 5000);
    }

    checkLogin();
    setInterval(checkLogin, 10000);

    $(".logout").on("click", () => {
        $.post("/logout", {});
    });

    $(".tabs a").toArray().forEach(function(element) {
        $(element).on("click", function() {
            $(".tabs a").removeClass("active");
            $(element).addClass("active");
            $("main .content").empty();

            if ($(element).attr("class")[0] == 'n') {
                console.log("FIRST TAB CLICKED!");

                $.get("/tasks", {}, function(response) {
                    if (response["status"] == "success") {
                        for (let i=response["message"].length-1; i>=0; i--) {
                            if (response["message"][i]['completed'] == 1) {
                                continue;
                            }

                            var className = "task" + i;
                            var taskDiv = $("<div>");
                            taskDiv.attr("id", "task");
                            taskDiv.addClass("task"+i);
                            taskDiv.text(response["message"][i]["taskDesc"]);
                            
                            var delBtn = $("<button>");
                            delBtn.attr("id", "delBtn");
                            delBtn.attr("title", "Delete Task");
                            delBtn.append("&#10539;");

                            delBtn.on("click", () => {
                                $.post("/delTask", {taskId: response["message"][i]["taskID"]}, (res) => {
                                    if (res['status'] == 'success') {
                                        className = ".task" + i;
                                        $(className).remove();
                                        setNotificationBar(1, "Task Deleted");
                                    }
                                    else {
                                        console.log(response['message']);
                                        setNotificationBar(0, "Couldn\'t Delete Task. Please Try Again!");
                                    }
                                });
                            });

                            var cmpBtn = $("<button>");
                            cmpBtn.attr("id", "cmpltBtn");
                            cmpBtn.attr("title", "Mark Completed");
                            cmpBtn.append("&#10003;");

                            cmpBtn.on("click", () => {
                                $.post("/cmpTask", {taskId: response["message"][i]["taskID"]}, (res) => {
                                    if (res['status'] == 'success') {
                                        className = ".task" + i;
                                        $(className).remove();
                                        setNotificationBar(1, "Task Marked Complete!");
                                    }
                                    else {
                                        console.log(res['message']);
                                        setNotificationBar(0, "Couldn\'t Complete Task. Please Try Again!");
                                    }
                                });
                            });

                            taskDiv.append(delBtn);
                            taskDiv.append(cmpBtn);

                            $("main .content").append(taskDiv);
                        }
                    }
                    else {
                        console.log(response['message']);
                        setNotificationBar(0, "An Error Occurred. Please Try Again!");
                    }
                });
            }
            else if ($(element).attr("class")[0] == 'o') {
                console.log("SECOND TAB CLICKED!");
                
                $.get("/tasks", {}, function(response) {
                    if (response["status"] == "success") {
                        for (let i=0; i<response["message"].length; i++) {
                            if (response["message"][i]['completed'] == 1) {
                                continue;
                            }

                            var className = "task" + i;
                            var taskDiv = $("<div>");
                            taskDiv.attr("id", "task");
                            taskDiv.addClass(className);
                            taskDiv.text(response["message"][i]["taskDesc"]);
                            
                            var delBtn = $("<button>");
                            delBtn.attr("id", "delBtn");
                            delBtn.attr("title", "Delete Task");
                            delBtn.append("&#10539;");
                            delBtn.on("click", () => {
                                $.post("/delTask", {taskId: response["message"][i]["taskID"]}, (res) => {
                                    if (res['status'] == 'success') {
                                        className = ".task" + i;
                                        $(className).remove();
                                        setNotificationBar(1, "Task Deleted");
                                    }
                                    else {
                                        console.log(res['message']);
                                        setNotificationBar(0, "Couldn\'t Delete Task. Please Try Again!");
                                    }
                                });
                            });

                            var cmpBtn = $("<button>");
                            cmpBtn.attr("id", "cmpltBtn");
                            cmpBtn.attr("title", "Mark Completed");
                            cmpBtn.append("&#10003;");

                            cmpBtn.on("click", () => {
                                $.post("/cmpTask", {taskId: response["message"][i]["taskID"]}, (res) => {
                                    if (res['status'] == 'success') {
                                        className = ".task" + i;
                                        $(className).remove();
                                        setNotificationBar(1, "Task Marked Complete!");
                                    }
                                    else {
                                        console.log(res['message']);
                                        setNotificationBar(0, "Couldn\'t Complete Task. Please Try Again!");
                                    }
                                });
                            });

                            taskDiv.append(delBtn);
                            taskDiv.append(cmpBtn);

                            $("main .content").append(taskDiv);
                        }
                    }
                    else {
                        console.log(response['message']);
                        setNotificationBar(0, "An Error Occurred. Please Try Again!");
                    }
                });
            }
            else if ($(element).attr("class")[0] == 'a') {
                var $input = $("<input>");
                var $add = $("<p>");
                $add.text("Add Task:");
                console.log("THIRD TAB CLICKED!");
                var $button = $("<button>");
                $button.text("+");

                $button.on("click", function() {
                    let taskInput = $input.val();
                    
                    $.post("/addTask", {task: taskInput}, (response) => {
                        if (response['status'] == 'success') {
                            $input.val("");
                            setNotificationBar(1, "Task Added!");
                        }
                        else {
                            setNotificationBar(0, "Couldn't Add Task. Please Try Again!");
                        }
                    });
                });

                $("main .content").append($add).append($input).append($button);
            }
            else if ($(element).attr("class")[0] == 'c') {
                console.log("FIFTH TAB CLICKED!");

                $.get("/completed", {}, function(response) {
                    if (response["status"] == "success") {
                        for (let i=response["message"].length-1; i>=0; i--) {
                            let className = "task" + i;
                            var taskDiv = $("<div>");
                            taskDiv.attr("id", "task");
                            taskDiv.addClass(className);
                            taskDiv.text(response["message"][i]["taskDesc"]);
                            
                            var delBtn = $("<button>");
                            delBtn.attr("id", "delBtn");
                            delBtn.attr("title", "Delete Task");
                            delBtn.append("&#10539;");
                            delBtn.on("click", () => {
                                $.post("/delTask", {taskId: response["message"][i]["taskID"]}, (res) => {
                                    if (res['status'] == 'success') {
                                        className = ".task" + i;
                                        $(className).remove();
                                        setNotificationBar(1, "Task Deleted");
                                    }
                                    else {
                                        console.log(res['message']);
                                        setNotificationBar(0, "Couldn\'t Delete Task. Please Try Again!");
                                    }
                                });
                            });

                            var cmpBtn = $("<button>");
                            cmpBtn.attr("id", "incmpltBtn");
                            cmpBtn.attr("title", "Mark Incomplete");
                            cmpBtn.append("&Oslash;");

                            cmpBtn.on("click", () => {
                                $.post("/uncmpTask", {taskId: response["message"][i]["taskID"]}, (res) => {
                                    if (res['status'] == 'success') {
                                        className = ".task" + i;
                                        $(className).remove();
                                        setNotificationBar(1, "Task Marked Incomplete!");
                                    }
                                    else {
                                        console.log(res['message']);
                                        setNotificationBar(0, "Couldn\'t Perform the Action. Please Try Again!");
                                    }
                                });
                            });

                            taskDiv.append(delBtn);
                            taskDiv.append(cmpBtn);

                            $("main .content").append(taskDiv);
                        }
                    }
                    else {
                        console.log(response['message']);
                        setNotificationBar(0, "An Error Occurred. Please Try Again!");
                    }
                });
            }
            return false;
        });
    });
};

$(document).ready(main);