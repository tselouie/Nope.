var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var dataservice = require("dataservice.js");
var app = express();

app.use(express.static('public'));
// Routes

app.get("/", (req, res) => {
    res.sendFile('views/home.html' , { root : __dirname});
});
app.get("/home", (req, res) => {
    res.sendFile('views/home.html' , { root : __dirname});
});
app.get("/about", (req, res) => {
    res.sendFile('views/about.html' , { root : __dirname});
});
app.get("/employees", (req, res) => {
    res.send("test1 works");
});
app.get("/managers", (req, res) => {
    res.send("test2 works");
});
app.get("/departments", (req, res) => {
    res.send("test3 works");
});

//res.status(404).send("Page Not Found");

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);
console.log("Express http server listening on " + HTTP_PORT);