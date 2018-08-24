/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Louie Tse Student ID: 027168103 Date: August 5,2018
*
* Online (Heroku) Link: https://stormy-depths-10777.herokuapp.com/
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var express = require('express');
var clientSessions = require('client-sessions');
var exphbs = require('express-handlebars');
var fs = require('fs');
var multer = require('multer');
const path = require("path");


var emp = fs.readFileSync('./data/employees.json');
var dept = fs.readFileSync('./data/departments.json');
var empobj = JSON.parse(emp);
var deptobj = JSON.parse(dept);
var img = [];





var dataServiceAuth = require("./data-service-auth");
var dataService = require("./data-service.js");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.hbs', exphbs({
    extname: ".hbs",
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {
            console.log("active:", app.locals.activeRoute);
            console.log("url:", url);
            return '<li class="nav-item"' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
                
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


app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "web322_app_a6", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
// This is a helper middleware function that checks if a user is logged in
// we can use it in any route that we want to protect against unauthenticated access.
// A more advanced version of this would include checks for authorization as well after
// checking if the user is authenticated
function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

//use dataservice to initialize, if success;server will listen on HTTP_PORT
//dataService.initialize().then()
    dataServiceAuth.initialize()
    .then(() => {
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
app.get("/boardgames", (req, res) => {
    dataService.getAllBoardGames()
    .then(data => { res.render("boardgames", { boardgames: data }); })
    .catch(err => { res.render("boardgames", { boardgames: [] }); })
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    req.body.userAgent = req.get('User-Agent'); //enables checkUser to access userAgent of req.body
    dataServiceAuth.checkUser(req.body)
        .then((user) => {
            req.session.user = {
                userName: user.userName,// authenticated user's userName
                email: user.email,// authenticated user's email
                loginHistory: user.loginHistory // authenticated user's loginHistory
                
            }
            
            res.redirect('/players');
        })
        .catch((err) => {
            res.render("login", { errorMessage: err, userName: req.body.userName });
        });
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    dataServiceAuth.registerUser(req.body)
        .then(() => { res.render("register", { successMessage: "User created" }); })
        .catch((err) => { res.render("register", { errorMessage: err, userName: req.body.userName }); })

});

app.get("/userHistory", ensureLogin, (req, res) => {
    res.render("userHistory" );

});


app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/");
  });

app.get("/players/add", ensureLogin, (req, res) => {
    dataService.getDepartments()
        .then(data => { res.render("addEmployee", { departments: data }); })
        .catch(err => { res.render("addEmployee", { departments: [] }); })

});

app.post("/players/add", ensureLogin, (req, res) => {
    dataService.addEmployee(req.body);
    res.redirect('/players');

});
app.get("/departments/add", ensureLogin, (req, res) => {
    res.render("addDepartment");
});

app.post("/departments/add", ensureLogin, (req, res) => {
    dataService.addDepartment(req.body);
    res.redirect('/departments');

});

app.get("/department/:num", ensureLogin, (req, res) => {
    dataService.getDepartmentById(req.params.num)
        .then((data) => { res.render("department", { department: data }); })
        .catch(err => { res.status(404).send("Department Not Found"); });

});

app.post("/department/update", ensureLogin, (req, res) => {
    console.log(req.body);
    dataService.updateDepartment(req.body)
        .then(() => {
            res.redirect("/departments");
        });
});

app.get("/players", ensureLogin, (req, res) => {

    if (req.query.status) {
        dataService.getEmployeesByStatus(req.query.status)
            .then(data => { res.render("players", { employees: data }); })
            .catch(err => { res.render("players", { employees: {}, message: err }); })
    } else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
            .then(data => { res.render("players", { employees: data }); })
            .catch(err => { res.render("players", { employees: {}, message: err }); })
    }
    else if (req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager)
            .then(data => { res.render("players", { employees: data }); })
            .catch(err => { res.render("players", { employees: {}, message: err }); })
    }
    else {
        dataService.getAllEmployees()
            .then(data => { res.render("players", { employees: data }); })
            .catch(err => { res.render("players", { employees: {}, message: err }); })
    }
});


app.get("/departments", ensureLogin, (req, res) => {
    dataService.getDepartments()
        .then(data => { res.render("departments", { departments: data }); })
        .catch(err => { res.render("departments", { message: err }); })
});

app.get("/employee/:empNum", ensureLogin, (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    dataService.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(dataService.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});
app.get("/delete/:empNum", ensureLogin, (req, res) => {
    dataService.deleteEmployeeByNum(empNum)
        .then((data) => { res.redirect("/employees"); })
        .catch(err => { res.status(500).send("Unable to Remove Employee / Employee not found"); })
});
app.post("/employee/update", ensureLogin, (req, res) => {
    console.log(req.body);
    dataService.updateEmployee(req.body)
        .then(() => {
            res.redirect("/players");
        });
    // .catch((err) => { res.send({err}); });

});

// Img Routes 


app.get("/images/add", ensureLogin, (req, res) => {
    res.render("addImage");
});

app.post("/images/add", ensureLogin, upload.single("imageFile"), async (req, res) => {
    res.redirect("/images");
});

app.get("/images", ensureLogin, (req, res) => {
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
    res.render("images", { img });
});


//if status becomes 404 message returns page not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});




