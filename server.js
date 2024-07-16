var express = require("express"),
http = require("http"),
app = express();

app.use(express.static(__dirname+"/client"));

http.createServer(app).listen(3000);

app.post("/todos", function (req, res) {
    console.log("data has been posted to the server!");
    res.json({"message":"You posted to the server!"});
});

app.get("/hello", function(req, res) {
    res.send("Hello World!");
});

app.get("/goodbye", function(req, res) {
    res.send("Good Bye!");
});

app.get("todos.json", function(req, res) {
    res.json(toDos);
})