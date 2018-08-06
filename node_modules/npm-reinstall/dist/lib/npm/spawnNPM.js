"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spawnCommand_1 = require("../spawnCommand");
/**
 * Spawn NPM command.
 *
 * @export
 * @param {string[]} args Command arguments.
 * @param {boolean} [verbose=false] Display more information.
 * @returns Promise of spawn.
 */
function spawnNPM(args, verbose) {
    if (verbose === void 0) { verbose = false; }
    return spawnCommand_1.default('npm', args, verbose);
}
exports.default = spawnNPM;
