const mongoose = require('mongoose');
var Schema = mongoose.Schema;


mongoose.connect("mongodb://lttse:web322a6@ds141621.mlab.com:41621/web322_a6", { useNewUrlParser: true });
var boardGameSchema = new Schema({
    Name: { type: String, unique: true },
    Genre: String,
    Players: Number,
    Standalone: Boolean,
    Manufacturer: String
});

var Bgames = mongoose.model("boardgames", boardGameSchema);



module.exports.getAllBoardGames = function () {

    return new Promise(function (resolve, reject) {

        Bgames.find({})
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


//create new variable to hold employees whom's isManager value is true
//if success, resolve will pass the information of managers array
module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {

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
        }).then(function (data) {
            if (data.length > 0) {
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
            if (data.length > 0) {
                resolve(data[0]);
            }
        })
            .catch(function (err) {
                reject("Unable to remove Employee #" + num);
            });
    });
};