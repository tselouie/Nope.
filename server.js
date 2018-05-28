var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var fs = require('fs');
var emp = fs.readFileSync('./data/employees.json');
var dept = fs.readFileSync('./data/departments.json');
var empobj = JSON.parse(emp);

var dataservice = require("./data-service.js");
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
    dataservice.getAllEmployees()
    .then(data => {res.json(data);})
    .catch(err => {res.json(err);})
   
});
app.get("/managers", (req, res) => {
    dataservice.getManagers()
    .then(data =>{res.json(data);})
    .catch(err => {res.json(err);})

});
app.get("/departments", (req, res) => {
    dataservice.getDepartments()
    .then(data => {res.json(data);})
    .catch(err => {res.json(err);})
});


app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


// setup http server to listen on HTTP_PORT
dataservice.initialize().then(() => {
    app.listen(HTTP_PORT, function () {
        console.log("Express http server listening on " + HTTP_PORT);
    })
}).catch(() => {
    console.log("No Data Found");
});
