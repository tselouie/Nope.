"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var ora = require("ora");
var createArgs_1 = require("../createArgs");
var mode_1 = require("../mode");
var spawnYarn_1 = require("./spawnYarn");
/**
 * Run installing some packages via Yarn.
 *
 * @export
 * @param {string} mode Installation mode.
 * @param {string[]} packages Package names.
 * @param {boolean} [verbose=false] Display more information.
 * @returns
 */
function run(mode, packages, verbose) {
    if (verbose === void 0) { verbose = false; }
    var spinner = ora({
        color: 'yellow'
    });
    var packagesAsString = chalk.cyan.bold(packages.join(' '));
    var installArgs = createArgs_1.createInstallArgs('yarn', mode, packages);
    var uninstallArgs = createArgs_1.createUninstallArgs('yarn', mode, packages);
    var endingInfo = '';
    switch (mode) {
        case mode_1.default.GLOBAL:
            endingInfo = 'globally';
            break;
        case mode_1.default.SAVE:
            endingInfo = 'dependencies';
            break;
        case mode_1.default.SAVE_DEV:
            endingInfo = 'devDependencies';
            break;
    }
    if (!verbose) {
        var prefix = (mode === mode_1.default.SAVE) || (mode === mode_1.default.SAVE_DEV) ? 'from ' : '';
        spinner.start("Uninstalling " + packagesAsString + " " + prefix + endingInfo + " ...");
    }
    return spawnYarn_1.default(uninstallArgs, verbose)
        .then(function () {
        if (!verbose) {
            var prefix = (mode === mode_1.default.SAVE) || (mode === mode_1.default.SAVE_DEV) ? 'as ' : '';
            spinner.text = "Installing " + packagesAsString + " " + prefix + endingInfo + " ...";
        }
        return spawnYarn_1.default(installArgs, verbose);
    })
        .then(function () {
        if (!verbose) {
            spinner.succeed(chalk.green('Finish reinstallation.'));
        }
        return Promise.resolve();
    });
}
exports.default = run;
