var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

app.use(express.static('public'));
// Routes

app.get("/home", (req, res) => {
    res.send("/views/home.html");
});
app.get("/about", (req, res) => {
    res.send("/views/about.html");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);