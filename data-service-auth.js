const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    userName: { type: String, unique: true },
    password: String,
    email: String,
    loginHistory: [{ dateTime: Date, userAgent: String }]

});

let User;


module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://lttse:web322a6@ds141621.mlab.com:41621/web322_a6", { useNewUrlParser: true });
        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {

        if (userData.password === userData.password2) {

            bcrypt.genSalt(10, function (err, salt) { // Generate a "salt" using 10 rounds
                bcrypt.hash(userData.password, salt, function (err, hash) { // encrypt the password: "myPassword123"
                    if (err) {
                        reject("Error encrypting password");
                    } else {
                        userData.password = hash;
                      // userData.loginHistory.userAgent = navigator.userAgent;
                        let newUser = new User(userData);

                        newUser.save((err) => {
                            if (err) {
                                if (err.code == 11000) {
                                    reject("Username already taken");
                                }
                            } else {
                                console.log("User was saved to the web322_a6 collection");
                                resolve();
                            }
                        });
                    }
                });
            });
        } else {
            reject("Passwords do not match");
        };

    });
};


module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {
       

        User.find({ user: userData.user })
            .exec()
            .then((users) => {
                if (users.length == 0) {
                    reject(userData.userName + " not found");

                } else {
                  // console.log("this is user agent....: " + userData.navigator.userAgent);
                  // userData.loginHistory.userAgent = navigator.userAgent;
                    
                    bcrypt.compare(userData.password, users[0].password).then((res) => {
                        if (res === true) {
                            console.log("passwords are the same");
                            let login = { dateTime: (new Date()).toString(), userAgent: userData.userAgent};
                            users[0].loginHistory.push(login);

                            User.update(
                                { userName: users[0].userName },
                                { $set: { loginHistory: users[0].loginHistory } }
                            ).exec()
                                .then()

                            resolve(users[0]);
                        }
                    })
                }
            })
            .catch((err) => {
                reject("Unable to find " + userData.userName
                        + "\nError " + err);
            });
    });
};