
var empData = require('./data/employees.json');
var depData = require('./data/departments.json');
var handleBars = require("handlebars");
var fs = require("fs");
var employees = [];
var departments = [];

//var compiledTemplate = handleBars.compile(employees);



//module.exports enables access from other js file.
//initialize renders the JSON files into their respective arrays if operations are a success
//if error at any time reject will pass error message
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {

        fs.readFile('./data/employees.json', (err, data) => {
            if (err) {
                reject("unable to read file");

            } else {
                employees = JSON.parse(data);
                fs.readFile('./data/departments.json', (err, data) => {
                    if (err) {
                        reject("unable to read file");
                    } else {
                        departments = JSON.parse(data);
                        resolve("files read successfully.");
                    }
                });
            }
        });
    });
};


module.exports.getAllEmployees = function () {
    return new Promise(function (resolve, reject) {

        if (employees.length > 0) {
            resolve(employees);
        } else {
            reject("no results returned");
        }
    });
};


module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {

        if (employeeData.isManager == null) {
            employeeData.isManager = false;
        }
        employeeData.employeeNum = employees.length + 1;

        if (employeeData.employeeNum) {
            resolve(employees.push(employeeData));
        } else {
            reject("unable to create employee");
        }
    });
};

//create new variable to hold employees whom's isManager value is true
//if success, resolve will pass the information of managers array
module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        var managers = [];
        if (employees.length > 0) {
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].isManager) {
                    managers.push(employees[i]);
                }
            }
        }
        if (managers.length != 0) {
            resolve(managers);
        } else {
            reject("no results returned");
        }
    });
};

module.exports.getDepartments = function () {
    return new Promise(function (resolve, reject) {

        if (departments.length > 0) {

            resolve(departments);
        } else {
            reject("no results returned");
        }
    });
}

module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        var employeeListByStatus = [];

        if (status == "Full Time") {
            for (var i = 0; i < employees.length; i++) {

                if (employees[i].status == "Full Time") {
                    employeeListByStatus.push(employees[i]);
                }
            }
        } else {
            for (var i = 0; i < employees.length; i++) {

                if (employees[i].status == "Part Time") {
                    employeeListByStatus.push(employees[i]);
                }
            }
        }

        if (employeeListByStatus.length > 0) {

            resolve(employeeListByStatus);
        } else {
            reject("no results returned");
        }
    });
}
module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        var employeeListByDept = [];
        if(department > 0 && department < 8){
        for (var i = 0; i < employees.length; i++) {

            if (employees[i].department == department) {
                employeeListByDept.push(employees[i]);
            }
        }
    }
        if (employeeListByDept.length > 0) {
       //     console.log(department);
            resolve(employeeListByDept);
        } else {
            reject("no results returned");
        }
    });
}
module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        var employeeListByManager = [];
        

        for (var i = 0; i < employees.length; i++) {

            if (employees[i].employeeManagerNum == manager) {
                employeeListByManager.push(employees[i]);
            }
        }
        if (employeeListByManager.length > 0) {

            resolve(employeeListByManager);
        } else {
            reject("no results returned");
        }
    });
}
module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var employee = [];

        for (var i = 0; i < employees.length; i++) {

            if (employees[i].employeeNum == num) {
                employee[0] = employees[i];
            }
        }
        if (employee.length > 0) {

            resolve(employee);
        } else {
            reject("no results returned");
        }
    });
}