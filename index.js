const express = require("express");
const app = express();
const PORT  = process.env.PORT || 4000;

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

app.listen(PORT, () => console.log('Server running on port ' + PORT));