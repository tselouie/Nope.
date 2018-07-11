/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Louie Tse Student ID: 027168103 Date: July 11,2018
*
* Online (Heroku) Link: https://desolate-cove-18106.herokuapp.com/
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var express = require('express');
var exphbs = require('express-handlebars');
var fs = require('fs');
var multer = require('multer');
const path = require("path");
var emp = fs.readFileSync('./data/employees.json');
var dept = fs.readFileSync('./data/departments.json');
var empobj = JSON.parse(emp);
var deptobj = JSON.parse(dept);
var img = [];


var dataService = require("./data-service.js");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.hbs', exphbs({
    extname: ".hbs",
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }



    }
}));
app.set('view engine', '.hbs');



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

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

//Get Routes

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/home", (req, res) => {
    res.render("home");
});
app.get("/about", (req, res) => {
    res.render("about");
});
app.get("/employees/add", (req, res) => {
    res.render("addEmployee");
});

app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body);
    res.redirect('/employees');

});

app.get("/employees", (req, res) => {

    if (req.query.status) {
        dataService.getEmployeesByStatus(req.query.status)
            .then(data => { res.render("employees", { employees: data }); })
            .catch(err => { res.render({ message: "no results" }); })
    } else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
            .then(data => { res.render("employees", { employees: data }); })
            .catch(err => { res.render({ message: "no results" }); })
    }
    else if (req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager)
            .then(data => { res.render("employees", { employees: data }); })
            .catch(err => { res.render({ message: "no results" }); })
    }
    else {
        dataService.getAllEmployees()
            .then(data => { res.render("employees", { employees: data }); })
            .catch(err => { res.render({ message: "no results" }); })
    }
});


app.get("/departments", (req, res) => {
    dataService.getDepartments()
        .then(data => { res.render("departments", { departments: data }); })
        .catch(err => { res.render({ message: "no results" }); })
});

app.get("/employee/:num", (req, res) => {
    dataService.getEmployeeByNum(req.params.num)
        .then((data) => {  res.render("employee", { employee: data[0], departments: deptobj }); })
        .catch(err => { res.render({ message: "no results" }); });

});

app.post("/employee/update", (req, res) => {
    console.log(req.body);
    dataService.updateEmployee(req.body)
    .then(() => {res.redirect("/employees");
});
   // .catch((err) => { res.send({err}); });

});
   
// Img Routes 


app.get("/images/add", (req, res) => {
    res.render("addImage");
});

app.post("/images/add", upload.single("imageFile"), async (req, res) => {
    res.redirect("/images");
});



app.get("/images", (req, res) => {
    var images = fs.readdir('./public/images/uploaded', function (err, items) {

        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                img[i] = items[i];
            }
        }
    });
    // for(var i = 0;i< img.length;i++){
    //     console.log("Current images" + img[i]);
    // }
    res.render("images", {img});
});


//if status becomes 404 message returns page not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});




