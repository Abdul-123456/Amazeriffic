const express = require("express");
const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    res.json({"message":"You posted to the server!"});
});

app.post("/auth/register", function (req, res) {
    console.log(req);
    const {name, email, password, password_confirm} = req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error)
        }

        if (result.length > 0) {
            return res.json({message: 'This email is already in use'});
        }
        else if (password !== password_confirm) {
            console.log("password: " + password);
            console.log("password_confirm: " + password_confirm);
            return res.json({message: 'Passwords do not match!'});
        }
        else {
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(process.env.LATEST_USER_ID);
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
            return res.json({message: "Invalid email or password"});
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
            //console.log("Hello");
            res.redirect("/");
        }
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/user", Verify, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the your Dashboard!",
    });
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

function Verify (req, res, next) {
    const authHeader = req.headers["cookie"];
    if (!authHeader) {
        return res.json({message: "Please login to perform the action!"});
    }
    const cookie = authHeader.split("=")[1];

    jwt.verify(cookie, process.env.ACCESS_TOKEN, async function (error, decoded) {
        if (error) {
            return res.json({message: "Please login to perform the action!"});
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