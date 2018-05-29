/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Louie Tse Student ID: 027168103 Date: May 29,2018
*
* Online (Heroku) Link: https://desolate-citadel-95852.herokuapp.com/
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var fs = require('fs');
var emp = fs.readFileSync('./data/employees.json');
var dept = fs.readFileSync('./data/departments.json');
var empobj = JSON.parse(emp);

var dataService = require("./data-service.js");
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

//
app.get("/employees", (req, res) => {
    dataService.getAllEmployees()
    .then(data => {res.json(data);})
    .catch(err => {res.json(err);})
});

app.get("/managers", (req, res) => {
    dataService.getManagers()
    .then(data =>{res.json(data);})
    .catch(err => {res.json(err);})
});

app.get("/departments", (req, res) => {
    dataService.getDepartments()
    .then(data => {res.json(data);})
    .catch(err => {res.json(err);})
});

//if status becomes 404 message returns page not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


//use dataservice to initialize, if success;server will listen on HTTP_PORT
dataservice.initialize().then(() => {
    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, function () {
        console.log("Express http server listening on " + HTTP_PORT);
    })
}).catch(() => {
    console.log("No Data Found");
});
