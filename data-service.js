
var empData = require('./data/employees.json');
var depData = require('./data/departments.json');
var fs = require("fs");


var employees = [];
var departments = [];


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
            reject("no results return");
        }
    });
}