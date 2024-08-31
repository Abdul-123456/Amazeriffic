const express = require("express");
const session = require('express-session');
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

selectQueryPromise = (query) => {
    return new Promise((resolve, reject) => {
        db.query(query,  (error, results) => {
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

jwtVerifyPromise = (cookie, token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(cookie, token, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            
            return resolve(decoded);
        });
    });
};

app.listen(PORT, () => console.log('Server running on port ' + PORT));
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: 'false'}));
app.use(express.json());

app.get("/", (req, res) => {
    res.redirect(path.join(__dirname, 'index.html'));
});

app.get("/completed", Verify, async (req, res) => {
    let str = "SELECT taskID,tagID,taskDesc,notes,timeCreated,completed FROM tasks WHERE userID = \'" + req.user["ID"] + "\' AND completed = 1;";
    try {
        const resultElements = await selectQueryPromise(str);
        res.json({status: "success", message: resultElements});
    } catch(e) {
        console.log(e);
        res.json({status: "failure", message: "An error occured please try again"});
    }
});

app.get("/tags", Verify, async (req, res) => {
    let str = "SELECT tagID,tagDesc,notes,timeCreated FROM tags WHERE userID = \'" + req.user["ID"] + "\';";
    try {
        const resultElements = await selectQueryPromise(str);
        res.json({status: "success", message: resultElements});
    } catch(e) {
        console.log(e);
        res.json({status: "failure", message: "An error occured please try again"});
    }
});

app.get("/tasks", Verify, async (req, res) => {
    let str = "SELECT taskID,tagID,taskDesc,notes,timeCreated,completed FROM tasks WHERE userID = \'" + req.user["ID"] + "\';";
    try {
        const resultElements = await selectQueryPromise(str);
        res.json({status: "success", message: resultElements});
    } catch(e) {
        console.log(e);
        res.json({status: "failure", message: "An error occured please try again"});
    }
});

app.get("/user", Verify, (req, res) => {
    res.json({status: "success", message: req.user});
});

app.post("/addTask", Verify, async (req, res) => {
    var str = "INSERT INTO tasks (userID, taskDesc) VALUES (\'" + req.user["ID"] + "\',\'" + req.body["task"] + "\');";
    try {
        const resultElements = await selectQueryPromise(str);
        res.json({status: "success", message: resultElements});
    } catch(e) {
        console.log(e);
        res.json({status: "failure", message: "An error occured please try again"});
    }
});

app.post("/auth/register", async (req, res) => {
    const {name, email, password, password_confirm} = req.body;
    let str = 'SELECT email FROM users WHERE email = \'' + email + "\';";
    try {
        const result = await selectQueryPromise(str);

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
            str = 'INSERT INTO users (name, email, password) VALUES (\'' + name + '\',\'' + email + '\',\'' + hashedPassword + '\');';
            try {
                const resultElements = await selectQueryPromise(str);
                res.json({status: "success", message: resultElements});
            } catch(e) {
                console.log(e);
                res.json({status: "failure", message: "An error occured please try again"});
            }
        }
    } catch(e) {
        console.log(e);
        res.json({status: "failure", message: "An error occured please try again"});
    }
});

app.post("/auth/login", async (req, res) => {
    const {email, password} = req.body;

    let str = "SELECT * FROM users WHERE email = \'" + email + "\';";
    try {
        const result = await selectQueryPromise(str);

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

            res.cookie('SessionID', token, options);
            res.redirect("/");
        }
    } catch(e) {
        console.log(e);
        res.json({status: "failure", message: "An error occured please try again"});
    }
});

app.post("/cmpTask", Verify, async (req, res) => {
    let tskId = req.body['taskId'];
    let str = "UPDATE tasks SET completed = 1 WHERE userID = \'" + req.user['ID'] + "\' AND taskID = \'" + tskId + "\';";
    try {
        const resultElements = await selectQueryPromise(str);
        res.json({status: "success", message: resultElements});
    } catch(e) {
        console.log(e);
        res.json({status: "failure", message: "An error occured please try again"});
    }
});

app.post("/delTask", Verify, async (req, res) => {
    let tskId = req.body["taskId"];
    let str = "DELETE FROM tasks WHERE taskID = \'" + tskId + "\' AND userID = \'" + req.user["ID"] + "\';";
    try {
        const resultElements = await selectQueryPromise(str);
        res.json({status: "success", message: resultElements});
    } catch(e) {
        console.log(e);
        res.json({status: "failure", message: "An error occured please try again"});
    }
});

app.post("/logout", Verify, async (req, res) => {
    const cookie = req.headers["cookie"].split("=")[1];
    var str = "INSERT INTO blacklist VALUES (\'" + cookie + "\');";
    try {
        result = await selectQueryPromise(str);
        res.setHeader('Clear-Site-Data', 'cookies');
        res.redirect("/");
    } catch (e) {
        console.log(e);
        res.json({status:"failure", message: "An Error Occurred. Please Try Again!"});
    }
});

app.post("/uncmpTask", Verify, async (req, res) => {
    let tskId = req.body['taskId'];
    let str = "UPDATE tasks SET completed = 0 WHERE userID = \'" + req.user['ID'] + "\' AND taskID = \'" + tskId + "\';";
    try {
        const resultElements = await selectQueryPromise(str);
        res.json({status: "success", message: resultElements});
    } catch(e) {
        console.log(e);
        res.json({status: "failure", message: "An error occured please try again"});
    }
});

async function Verify (req, res, next) {
    const authHeader = req.headers["cookie"];

    if (!authHeader) {
        return res.json({status: "failure", message: "Please login to perform the action!"});
    }
    const cookie = authHeader.split("=")[1];
    try {
        var str = "SELECT * FROM blacklist WHERE token = \'" + cookie + "\';";
        blacklist = await selectQueryPromise(str);
       if (blacklist.length != 0) {
            return res.json({status: "failure", message: "Please Login to Perform the Action!"});
        }
    } catch(e) {
        console.log(e);
        res.json({status: "failure", message: "An error occured please try again"});
    }
    try {
        const resultElements = await jwtVerifyPromise(cookie, process.env.ACCESS_TOKEN);

        let str = "SELECT * FROM users WHERE ID = \'" + resultElements.id + "\';";
        try {
            const result = await selectQueryPromise(str);
            const {password, ...data} = result[0];
            req.user = data;
            next();
        } catch(e) {
            console.log(e);
            res.json({status: "failure", message: "An error occured please try again"});
        }
    } catch(e) {
        console.log(e);
        res.json({status: "failure", message: "An error occured please try again"});
    }
}

