var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

app.use(express.static('public'));
// Routes

app.get("/home", (req, res) => {
    res.sendFile('web322-app/views/home.html');
});
app.get("/about", (req, res) => {
    res.sendFile('about.html');
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);
console.log("Express http server listening on " + HTTP_PORT);