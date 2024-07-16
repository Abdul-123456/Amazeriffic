// var redis = require("redis"),
// client;

var main = function() {
    "use strict";

    //client = redis.createClient();

    var todos = [];
    //     "Finish writing this book",
    //     "Take Gracie to the park",
    //     "Answer emails",
    //     "Prep for Monday's class",
    //     "Make up some new ToDos",
    //     "Get Groceries"
    // ];
    var tags = [];

    var tagObject = [];

    $.getJSON("todos.json", function(todosObject) {
        todosObject.forEach(function(todo) {
            var desc = todo.description;
            todos.push(desc);
            todo.tags.forEach(function(tag) {
                var index = tags.indexOf(tag);
                if (index == -1) {
                    tags.push(tag);
                    var arr = []
                    arr.push(desc);
                    var obj = {"name" : tag, "toDos" : arr};
                    tagObject.push(obj);
                }
                else {
                    tagObject[index].toDos.push(desc);
                }
            });

        });
    });

    $(".tabs a span").toArray().forEach(function(element) {
        $(element).on("click", function() {
            $(".tabs a span").removeClass("active");
            $(element).addClass("active");
            $("main .content").empty();

            if ($(element).parent().is(":nth-child(1)")) {
                var $newUl = $("<ul>");
                console.log("FIRST TAB CLICKED!");
                for (var i=todos.length-1; i>=0; i--) {
                    $newUl.append($("<li>").text(todos[i]));                    
                }

                // $.post("todos", {}, function(response) {
                //     console.log("We posted and the server responded!");
                //     console.log(response);
                // });

                $("main .content").append($newUl);
            }
            else if ($(element).parent().is(":nth-child(2)")) {
                var $newUl = $("<ul>");
                console.log("SECOND TAB CLICKED!");
                todos.forEach(function(todo) {
                    $newUl.append($("<li>").text(todo));                    
                });
                $("main .content").append($newUl);
            }
            else if ($(element).parent().is(":nth-child(3)")) {
                var $input = $("<input>");
                var $add = $("<p>");
                $add.text("Add Task:");
                console.log("THIRD TAB CLICKED!");
                var $button = $("<button>");
                $button.text("+");

                $button.on("click", function() {
                    todos.push($input.val());
                    $input.val("");
                });

                $("main .content").append($add).append($input).append($button);
            }
            else if ($(element).parent().is(":nth-child(4)")) {
                console.log("FOURTH TAB CLICKED");
                console.log(tagObject);
                tagObject.forEach(function(element) {
                    console.log(element.name);
                    $("main .content").append($("<h1>").text(element.name));
                    var $newUl = $("<ul>");
                    element.toDos.forEach(function(todo) {
                        $newUl.append($("<li>").text(todo));
                    });
                    $("main .content").append($newUl);
                });
            }
            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(main);