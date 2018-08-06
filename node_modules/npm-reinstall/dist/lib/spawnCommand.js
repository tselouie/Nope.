"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spawn = require("cross-spawn");
/**
 * Spawn the command.
 *
 * @export
 * @param {string} command Command.
 * @param {string[]} args Command arguments.
 * @param {boolean} [verbose=false] Display more information.
 * @returns Promise of spawn.
 */
function spawnCommand(command, args, verbose) {
    if (verbose === void 0) { verbose = false; }
    // Verbose only NPM
    if (command.toLowerCase() === 'npm') {
        if (verbose) {
            args.push('--verbose');
        }
        else {
            args.push('--silent');
        }
    }
    return new Promise(function (resolve, reject) {
        var child = spawn(command, args, {
            stdio: verbose ? 'inherit' : 'pipe'
        });
        child.on('error', function (err) {
            reject(err);
        });
        child.on('close', function () {
            resolve();
        });
    });
}
exports.default = spawnCommand;
