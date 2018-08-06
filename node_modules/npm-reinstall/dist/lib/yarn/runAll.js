"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var del = require("del");
var ora = require("ora");
var spawnYarn_1 = require("./spawnYarn");
/**
 * Run installing all packages via Yarn.
 *
 * @export
 * @param {boolean} [verbose=false] Display more information.
 * @returns Promise of run all.
 */
function runAll(verbose) {
    if (verbose === void 0) { verbose = false; }
    var spinner = ora({
        color: 'yellow'
    });
    spinner.start('Uninstalling all packages ...');
    return del('node_modules/') // Uninstalling.
        .then(function () {
        /*
         * If `verbose` is enable, no need to display installation message.
         */
        if (verbose) {
            spinner.stop();
        }
        else {
            spinner.text = 'Installing all packages ...';
        }
        return spawnYarn_1.default([], verbose); // Installing
    }, function (err) {
        spinner.fail(chalk_1.red('Uninstallation fail.')); // Display message when uninstallation fail.
        throw err;
    })
        .then(function () {
        if (!verbose) {
            spinner.succeed(chalk_1.green('Finish reinstallation.'));
        }
        return Promise.resolve();
    });
}
exports.default = runAll;
