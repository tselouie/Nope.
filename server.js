var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var emp = require('./data/employees');
var dept = require('./data/departments');
let managers = emp;

//var dataservice = require("data-service.js");
var app = express();


app.use(express.static('public'));

// Routes

app.get("/", (req, res) => {
    res.sendFile('views/home.html', { root: __dirname });
});
app.get("/home", (req, res) => {
    res.sendFile('views/home.html', { root: __dirname });
});
app.get("/about", (req, res) => {
    res.sendFile('views/about.html', { root: __dirname });
});
app.get("/employees", (req, res) => {
    res.json([emp]);
});
app.get("/managers", (req, res) => {
    var num = 0;

    for (var i = 0; i < 281; i++) {
        if (managers[i].isManager == false) {
             console.log(managers[i]);
            // console.log(num);
            managers.slice(i);
        }
        else {
            continue;
        }
    }


    res.json([managers]);
});
app.get("/departments", (req, res) => {
    res.json([dept]);
});

//res.status(404).send("Page Not Found");

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, function () {
    console.log("Express http server listening on " + HTTP_PORT);
});
