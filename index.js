const express = require("express");
const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require("path");
const app = express();
const PORT  = process.env.PORT || 4000;

dotenv.config({path: './.env'});

db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("MySQL Connected!");
    }
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: 'false'}));
app.use(express.json());

app.post("/todos", function (req, res) {
    console.log("data has been posted to the server!");
    // console.log(req);
    res.json({"message":"You posted to the server!"});
});

app.post("/auth/register", function (req, res) {
    // console.log(req);
    const {name, email, password, password_confirm} = req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            return res.json({status: "failure", message: 'This email is already in use'});
        }
        else if (password !== password_confirm) {
            console.log("password: " + password);
            console.log("password_confirm: " + password_confirm);
            return res.json({status: 'failure', message: 'Passwords do not match!'});
        }
        else {
            let hashedPassword = await bcrypt.hash(password, 8);
            // console.log(process.env.LATEST_USER_ID);
            db.query('INSERT INTO users SET?', {name: name, email: email, password: hashedPassword}, (error, result) => {
                if (error) {
                    console.log(error);
                }
                else {
                    res.redirect("/");
                }
            });
        }
    });
});

app.post("/auth/login", function (req, res) {
    const {email, password} = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async function (error, result) {
        if (error) {
            console.log(error);
        }
        
        const comparePassword = await bcrypt.compare(password, result[0].password);
        if (!comparePassword) {
            return res.json({status: 'failure', message: "Invalid email or password"});
        }
        else {
            let payload = {id: result[0].ID};
            let token = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: '20m'});

            let options = {
                maxAge: 20*60*1000, //20 mins
                httpOnly: true,
                secure: true,
                sameSite: "None",
            };

            // console.log(res);
            res.cookie('SessionID', token, options);
            //console.log("Hello");
            res.redirect("/");
        }
    });
});

app.post("/addTask", Verify, (req, res) => {
    db.query("INSERT INTO tasks SET?", {userID: req.user["ID"], taskDesc: req.body["task"]}, async (error, result) => {
        if (error) {
            console.log(error);
            res.json({status: "failure", message: "Something went wrong please try again"});
        }
        else {
            res.json({status: 'success', message: result});
        }
    });
});

app.post("/delTask", Verify, (req, res) => {
    let tskId = req.body["taskId"];
    db.query("DELETE FROM tasks WHERE taskID = ? AND userID = ?", [tskId, req.user["ID"]], async (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            res.json({status: 'success', message: result});
        }
    });
});

app.post("/cmpTask", Verify, (req, res) => {
    let tskId = req.body['taskId'];
    db.query("UPDATE tasks SET completed = ? WHERE userID = ? AND taskID = ?", [1, req.user['ID'], tskId], async (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            res.json({status: 'success', message: result});
        }
    });
});

app.post("/uncmpTask", Verify, (req, res) => {
    let tskId = req.body['taskId'];
    db.query("UPDATE tasks SET completed = ? WHERE userID = ? AND taskID = ?", [0, req.user['ID'], tskId], async (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            res.json({status: 'success', message: result});
        }
    });
})

app.get("/", (req, res) => {
    res.redirect(path.join(__dirname, 'index.html'));
});

app.post("/logout", Verify, (req, res) => {
    let payload = {id: req.user["ID"]};
    let token = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: '.1s'});

    let options = {
        maxAge: 0, //20 mins
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };

    res.cookie('SessionID', token, options);
})

app.get("/user", Verify, (req, res) => {
    res.json({status: "success", message: req.user});
});

app.get("/tasks", Verify, (req, res) => {
    db.query("SELECT taskID,tagID,taskDesc,notes,timeCreated,completed FROM tasks WHERE userID = ?", [req.user["ID"]], async function (error, result) {
        if (error) {
            console.log(error);
        }
        else {
            res.json({status: "success", message: result});
        }
    });
});

app.get("/completed", Verify, (req, res) => {
    db.query("SELECT taskID,tagID,taskDesc,notes,timeCreated,completed FROM tasks WHERE userID = ? AND completed = 1", [req.user["ID"]], async function (error, result) {
        if (error) {
            console.log(error);
        }
        else {
            res.json({status: "success", message: result});
        }
    });
})

app.get("/tags", Verify, (req, res) => {
    db.query("SELECT tagID,tagDesc,notes,timeCreated FROM tags WHERE userID = ?", [req.user["ID"]], async function (error, result) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(result);
        }
    });
});

app.get("/hello", function(req, res) {
    res.send("Hello World!");
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const dt = new Date();
    console.log(dt.getTimezoneOffset());
});

app.get("/goodbye", function(req, res) {
    res.send("Good Bye!");
});

app.get("todos.json", function(req, res) {
    res.json(toDos);
});

function Verify (req, res, next) {
    const authHeader = req.headers["cookie"];
    if (!authHeader) {
        return res.json({status: "failure", message: "Please login to perform the action!"});
    }
    const cookie = authHeader.split("=")[1];

    jwt.verify(cookie, process.env.ACCESS_TOKEN, async function (error, decoded) {
        if (error) {
            return res.json({status: "failure", message: "Please login to perform the action!"});
        }

        db.query("SELECT * FROM users WHERE ID = ?", [decoded.id], async function (error, result) {
            if (error) {
                console.log(error);
            }

            const {password, ...data} = result[0];
            req.user = data;
            next();
        });
    });
}

// function loggedIn(req) {
//     console.log("HelloStarted");
//     const arr = [];
//     const authHeader = req.headers["cookie"];
//     if (!authHeader) {
//         console.log("First If Statement");
//         arr[0] = false;
//         arr[1] = "";
//         return arr;
//         // return [false, ""];
//     }
//     else {
//         const cookie = authHeader.split("=")[1];
//         jwt.verify(cookie, process.env.ACCESS_TOKEN, async function (error, decoded) {
//             if (error) {
//                 arr[0] = false;
//                 arr[1] = "";
//                 return arr;
//                 // return [false, ""];
//             }
//             else {
//                 db.query("SELECT * FROM users WHERE ID = ?", [decoded.id], async function (error, result) {
//                     if (error) {
//                         console.log(error);
//                         arr[0] = false;
//                         arr[1] = "";
//                         return arr;
//                         // return [false, ""];
//                     }
//                     else {
//                         console.log("Hello");
//                         arr[0] = true;
//                         arr[1] = false;
//                         return arr;
//                         //return [true, result[0]];
//                     }
//                 });                
//             }
//         });
//     }
// }