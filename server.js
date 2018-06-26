/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Louie Tse Student ID: 027168103 Date: June 17,2018
*
* Online (Heroku) Link: https://fathomless-journey-35230.herokuapp.com/
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var multer = require('multer');
const path = require("path");
var emp = fs.readFileSync('./data/employees.json');
var dept = fs.readFileSync('./data/departments.json');
var empobj = JSON.parse(emp);

var img = [];
var images = fs.readdir('./public/images/uploaded', function (err, items) {
    for (var i = 0; i < items.length; i++) {
        img[i] = items[i]
    }
});

var dataService = require("./data-service.js");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage });

app.use(express.static('public'));

//use dataservice to initialize, if success;server will listen on HTTP_PORT
dataService.initialize().then(() => {
    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, function () {
        console.log("Express http server listening on " + HTTP_PORT);
    })
}).catch(() => {
    console.log("No Data Found");
});


//Get Routes

app.get("/", (req, res) => {
    res.sendFile('views/home.html', { root: __dirname });
});
app.get("/home", (req, res) => {
    res.sendFile('views/home.html', { root: __dirname });
});
app.get("/about", (req, res) => {
    res.sendFile('views/about.html', { root: __dirname });
});
app.get("/employees/add", (req, res) => {
    res.sendFile('views/addEmployee.html', { root: __dirname });
});
app.get("/images/add", (req, res) => {
    res.sendFile('views/addImage.html', { root: __dirname });
});

app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body);
    res.redirect('/employees');

});

app.get("/employees", (req, res) => {

    if (req.query.status) {
        dataService.getEmployeesByStatus(req.query.status)
            .then(data => { res.json(data); })
            .catch(err => { res.json(err); })
    } else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
            .then(data => { res.json(data); })
            .catch(err => { res.json(err); })
    }
    else if (req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager)
            .then(data => { res.json(data); })
            .catch(err => { res.json(err); })
    }
    else {

        dataService.getAllEmployees()
            .then(data => { res.json(data); })
            .catch(err => { res.json(err); })
    }
});

app.get("/managers", (req, res) => {
    dataService.getManagers()
        .then(data => { res.json(data); })
        .catch(err => { res.json(err); })
});

app.get("/departments", (req, res) => {
    dataService.getDepartments()
        .then(data => { res.json(data); })
        .catch(err => { res.json(err); })
});


app.get("/employees/:num", (req, res) => {
    dataService.getEmployeeByNum(req.params.num)
        .then(data => { res.json(data); })
        .catch(err => { res.json(err); })
});

// Img Routes

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", (req, res) => {
    res.json({ images: img });
});


//if status becomes 404 message returns page not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});




