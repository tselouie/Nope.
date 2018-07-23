const Sequelize = require('sequelize');
var sequelize = new Sequelize('d2pvlelr39u7m1', 'ydtdgdqiufrcei', '8d24345b38d9c8c203467d7ad376883b969c8877b1270d6809a97b6602219742', {
    host: 'ec2-50-19-86-139.compute-1.amazonaws.com',
    dialect: 'postgres',
    operatorsAliases: false,
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

// var empData = require('./data/employees.json');
// var depData = require('./data/departments.json');
// var handleBars = require('handlebars');
// var fs = require('fs');
// var employees = [];
// var departments = [];
//var compiledTemplate = handleBars.compile(employees);



//module.exports enables access from other js file.
//initialize renders the JSON files into their respective arrays if operations are a success
//if error at any time reject will pass error message
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(function () {
                console.log("Connection is Successful");
                resolve();
            }).catch(function (err) {
                reject('unable to sync the database', err);
            });


        // fs.readFile('./data/employees.json', (err, data) => {
        //     if (err) {
        //         reject("unable to read file");

        //     } else {
        //         employees = JSON.parse(data);
        //         fs.readFile('./data/departments.json', (err, data) => {
        //             if (err) {
        //                 reject("unable to read file");
        //             } else {
        //                 departments = JSON.parse(data);
        //                 resolve("files read successfully.");
        //             }
        //         });
        //     }
        // });

    });
};


module.exports.getAllEmployees = function () {
    return new Promise(function (resolve, reject) {
        Employee.findAll()
            .then(function (data) {
                if (data.length > 0) {
                    resolve(data);
                } else {
                    reject("no results returned");
                }
            }).catch(() => {
                reject("no results return");
            });
    })
};


// if (employees.length > 0) {
//     resolve(employees);
// } else {
//     reject("no results returned");
// }



module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var prop in employeeData) {
            if (employeeData[prop] == "") {
                employeeData[prop] = null;
            }
        }
        Employee.create(employeeData)
            .then(function () {
                resolve();
            })
            .catch(function (err) {
                reject("unable to create employee");
            });
    });
}
// if (employeeData.isManager == null) {
//     employeeData.isManager = false;
// }
// employeeData.employeeNum = employees.length + 1;

// if (employeeData.employeeNum) {
//     resolve(employees.push(employeeData));
// } else {
//     reject("unable to create employee");
// }


//create new variable to hold employees whom's isManager value is true
//if success, resolve will pass the information of managers array
module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        // var managers = [];
        // if (employees.length > 0) {
        //     for (var i = 0; i < employees.length; i++) {
        //         if (employees[i].isManager) {
        //             managers.push(employees[i]);
        //         }
        //     }
        // }
        // if (managers.length != 0) {
        //     resolve(managers);
        // } else {
        //     reject("no results returned");
        // }
        Employee.findAll({ where: { isManager: true } })
            .then(function (data) {

                resolve(data)
            })
            .catch(function (err) {
                reject("no results returned");
            });
    });
};
module.exports.getDepartments = function () {
    return new Promise(function (resolve, reject) {
        Department.findAll()
            .then(function (data) {
                if (data.length > 0) {
                    resolve(data);
                } else {
                    reject("no results returned");
                }
            }).catch(() => {
                reject("no results return");
            });
    })
};

// if (departments.length > 0) {

//     resolve(departments);
// } else {
//     reject("no results returned");
// }


module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({ where: { status: status } })
            .then(function (data) {

                resolve(data)
            })
            .catch(function (err) {
                reject("no results returned");
            });
    });
};
// var employeeListByStatus = [];

// if (status == "Full Time") {
//     for (var i = 0; i < employees.length; i++) {

//         if (employees[i].status == "Full Time") {
//             employeeListByStatus.push(employees[i]);
//         }
//     }
// } else {
//     for (var i = 0; i < employees.length; i++) {

//         if (employees[i].status == "Part Time") {
//             employeeListByStatus.push(employees[i]);
//         }
//     }
// }

// if (employeeListByStatus.length > 0) {

//     resolve(employeeListByStatus);
// } else {
//     reject("no results returned");
// }

module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({ where: { department: department } })
            .then(function (data) {

                resolve(data);
            })
            .catch(function (err) {
                reject("no results returned");
            });
    });
};
// var employeeListByDept = [];
// if (department > 0 && department < 8) {
//     for (var i = 0; i < employees.length; i++) {

//         if (employees[i].department == department) {
//             employeeListByDept.push(employees[i]);
//         }
//     }
// }
// if (employeeListByDept.length > 0) {
//     resolve(employeeListByDept);
// } else {
//     reject("no results returned");
// }

module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        Employee.findAll(
            { where: { employeeManagerNum: manager } })
            .then(function (data) {

                resolve(data)
            })
            .catch(function (err) {
                reject("no results returned");
            });
    });
};
// var employeeListByManager = [];

// for (var i = 0; i < employees.length; i++) {

//     if (employees[i].employeeManagerNum == manager) {
//         employeeListByManager.push(employees[i]);
//     }
// }
// if (employeeListByManager.length > 0) {

//     resolve(employeeListByManager);
// } else {
//     reject("no results returned");
// }

module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: { employeeNum: num }
        }).then((data) => {
            if (data.length > 0) {
                resolve(data[0]);
            }
        }).catch((err) => {
            reject("no results returned");
        });

    });

}
// var employee = [];

// for (var i = 0; i < employees.length; i++) {

//     if (employees[i].employeeNum == num) {
//         employee[0] = employees[i];
//     }
// }
// if (employee.length > 0) {

//     resolve(employee);
// } else {
//     reject("no results returned");
// }

module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var prop in employeeData) {
            if (employeeData[prop] == "") {
                employeeData[prop] = null;
            }
        }
        Employee.update(employeeData, {
            where: { employeeNum: employeeData.employeeNum }
        })
            .then(function () {
                resolve();
            })
            .catch(function (err) {
                reject("unable to update employee");
            });
    });
}
// for (var i = 0; i < employees.length; i++) { 
//     if (employees[i].employeeNum == employeeData.employeeNum) {
//         employees[i] = employeeData;
//         resolve();
//     }
// }

//dataService Department Fxn upgrades
module.exports.addDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {

        for (var prop in departmentData) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }
        Department.create(departmentData)
            .then(function () {
                resolve();
            })
            .catch(function (err) {
                reject("unable to create department");
            });
    });
}

module.exports.updateDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {

        for (var prop in departmentData) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }
        Department.update(departmentData, {
            where: { departmentId: departmentData.departmentId }
        })
            .then(function () {
                resolve();
            })
            .catch(function (err) {
                reject("unable to update department");
            });
    });
}

module.exports.getDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {
        Department.findAll({
            where: { departmentId: id }
        })  .then(function (data) {
            if(data.length > 0){
                resolve(data[0]);
            }          
        })
        .catch(function (err) {
            reject("no results returned");
        });
            
    });
}

//Delete employee

module.exports.deleteEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Employee.destroy({
            where: { employeeNum: num }
        }).then(function (data) {
            if(data.length > 0){
                resolve(data[0]);
            }          
        })
        .catch(function (err) {
            reject("Unable to remove Employee #" + num);
        });
    });
};