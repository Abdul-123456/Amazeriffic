var main = function() {
    "use strict";

    $.get("/user", {}, function(response) {
        console.log(response);
        if (response["status"] == "success") {}
        else {
            location.replace("http://localhost:4000/views/register.html");
        }
    });

    $(".logout").on("click", () => {
        $.post("/logout", {});
    });

    $(".tabs a").toArray().forEach(function(element) {
        $(element).on("click", function() {
            $(".tabs a").removeClass("active");
            $(element).addClass("active");
            $("main .content").empty();

            if ($(element).is(":nth-child(1)")) {
                console.log("FIRST TAB CLICKED!");

                $.get("/tasks", {}, function(response) {
                    if (response["status"] == "success") {
                        for (let i=response["message"].length-1; i>=0; i--) {
                            if (response["message"][i]['completed'] == 1) {
                                continue;
                            }

                            var taskDiv = $("<div>");
                            taskDiv.attr("id", "task");
                            taskDiv.text(response["message"][i]["taskDesc"]);
                            
                            var delBtn = $("<button>");
                            delBtn.attr("id", "delBtn");
                            delBtn.attr("title", "Delete Task");
                            delBtn.append("&#10539;");

                            delBtn.on("click", () => {
                                $.post("/delTask", {taskId: response["message"][i]["taskID"]}, (res) => {
                                    console.log(res["status"]);
                                    if (res['status'] == 'success') {
                                        $(".newest").trigger("click");
                                    }
                                    else {

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
                                        $(".newest").trigger("click");
                                    }
                                    else {
                                        
                                    }
                                });
                            });

                            taskDiv.append(delBtn);
                            taskDiv.append(cmpBtn);

                            $("main .content").append(taskDiv);
                        }
                    }
                });
            }
            else if ($(element).is(":nth-child(3)")) {
                console.log("SECOND TAB CLICKED!");
                
                $.get("/tasks", {}, function(response) {
                    if (response["status"] == "success") {
                        for (let i=0; i<response["message"].length; i++) {
                            if (response["message"][i]['completed'] == 1) {
                                continue;
                            }

                            var taskDiv = $("<div>");
                            taskDiv.attr("id", "task");
                            taskDiv.text(response["message"][i]["taskDesc"]);
                            
                            var delBtn = $("<button>");
                            delBtn.attr("id", "delBtn");
                            delBtn.attr("title", "Delete Task");
                            delBtn.append("&#10539;");

                            delBtn.on("click", () => {
                                $.post("/delTask", {taskId: response["message"][i]["taskID"]}, (res) => {
                                    console.log(res["status"]);
                                    if (res['status'] == 'success') {
                                        $(".oldest").trigger("click");
                                    }
                                    else {

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
                                        $(".oldest").trigger("click");
                                    }
                                    else {
                                        
                                    }
                                });
                            });

                            taskDiv.append(delBtn);
                            taskDiv.append(cmpBtn);

                            $("main .content").append(taskDiv);
                        }
                    }
                });
            }
            else if ($(element).is(":nth-child(5)")) {
                var $input = $("<input>");
                var $add = $("<p>");
                $add.text("Add Task:");
                console.log("THIRD TAB CLICKED!");
                var $button = $("<button>");
                $button.text("+");

                $button.on("click", function() {
                    let taskInput = $input.val();
                    
                    $.post("/addTask", {task: taskInput}, (response) => {
                        if (response['status'] == 'success') {}
                        else {
                            location.replace("http://localhost:4000/views/register.html") 
                        }
                    });
                    
                    $input.val("");
                });

                $("main .content").append($add).append($input).append($button);
            }
            else if ($(element).is(":nth-child(7)")) {
                console.log("FOURTH TAB CLICKED");
                // console.log(tagObject);
                // tagObject.forEach(function(element) {
                //     console.log(element.name);
                //     $("main .content").append($("<h1>").text(element.name));
                //     var $newUl = $("<ul>");
                //     element.toDos.forEach(function(todo) {
                //         $newUl.append($("<li>").text(todo));
                //     });
                //     $("main .content").append($newUl);
                // });
            }
            if ($(element).is(":nth-child(9)")) {
                console.log("FIFTH TAB CLICKED!");

                $.get("/completed", {}, function(response) {
                    if (response["status"] == "success") {
                        for (let i=response["message"].length-1; i>=0; i--) {
                            var taskDiv = $("<div>");
                            taskDiv.attr("id", "task");
                            taskDiv.text(response["message"][i]["taskDesc"]);
                            
                            var delBtn = $("<button>");
                            delBtn.attr("id", "delBtn");
                            delBtn.attr("title", "Delete Task");
                            delBtn.append("&#10539;");

                            delBtn.on("click", () => {
                                $.post("/delTask", {taskId: response["message"][i]["taskID"]}, (res) => {
                                    console.log(res["status"]);
                                    if (res['status'] == 'success') {
                                        $(".completed").trigger("click");
                                    }
                                    else {

                                    }
                                });
                            });

                            var cmpBtn = $("<button>");
                            cmpBtn.attr("id", "cmpltBtn");
                            cmpBtn.attr("title", "Mark Uncomplete");
                            cmpBtn.append("&Oslash;");

                            cmpBtn.on("click", () => {
                                $.post("/uncmpTask", {taskId: response["message"][i]["taskID"]}, (res) => {
                                    if (res['status'] == 'success') {
                                        $(".completed").trigger("click");
                                    }
                                    else {
                                        
                                    }
                                });
                            });

                            taskDiv.append(delBtn);
                            taskDiv.append(cmpBtn);

                            $("main .content").append(taskDiv);
                        }
                    }
                });
            }
            return false;
        });
    });
};

$(document).ready(main);