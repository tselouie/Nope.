"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var caniuseYarn = require("@danielbayerlein/caniuse-yarn");
var chalk_1 = require("chalk");
var hasYarn = require("has-yarn");
var mode_1 = require("./lib/mode");
var npm_1 = require("./lib/npm");
var yarn_1 = require("./lib/yarn");
var canIUseYarn = caniuseYarn();
/**
 * Run reinstall.
 *
 * @export
 * @param {yargs.Arguments} argv Yargs' argv.
 */
function reinstall(argv) {
    var yarnExists = hasYarn();
    var verbose = argv.verbose;
    var forceYarn = argv.yarn;
    var forceNPM = argv.npm;
    var runAll;
    var run;
    if (forceYarn) {
        runAll = yarn_1.YarnRunAll;
        run = yarn_1.YarnRun;
    }
    else if (forceNPM) {
        runAll = npm_1.NPMRunAll;
        run = npm_1.NPMRun;
    }
    else {
        runAll = (canIUseYarn && yarnExists) ? yarn_1.YarnRunAll : npm_1.NPMRunAll;
        // Only use NPM on global when it isn't forced to use Yarn.
        if (argv.global) {
            run = npm_1.NPMRun;
        }
        else {
            run = (canIUseYarn && yarnExists) ? yarn_1.YarnRun : npm_1.NPMRun;
        }
    }
    var errCatch = function (err) {
        var errString = err.stack ? err.stack : err.toString();
        console.error(chalk_1.red(errString));
    };
    if (argv._.length > 0) {
        if (argv.global) {
            run(mode_1.default.GLOBAL, argv._, verbose)
                .catch(errCatch);
        }
        else if (argv.save) {
            run(mode_1.default.SAVE, argv._, verbose)
                .catch(errCatch);
        }
        else if (argv.saveDev) {
            run(mode_1.default.SAVE_DEV, argv._, verbose)
                .catch(errCatch);
        }
    }
    else {
        runAll(verbose)
            .catch(errCatch);
    }
}
exports.default = reinstall;
