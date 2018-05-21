var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

app.use(express.static('public'));
// Routes

//response.writeHead(200, {'Content-Type': 'text/html'});

app.get("/", (req, res) => {
    res.sendFile('views/home.html' , { root : __dirname});
});

app.get("/home", (req, res) => {
    res.sendFile('views/home.html' , { root : __dirname});
});
app.get("/about", (req, res) => {
    res.sendFile('views/about.html' , { root : __dirname});
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);
console.log("Express http server listening on " + HTTP_PORT);