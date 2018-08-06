"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var updateNotifier = require("update-notifier");
var pkg = require('../package.json');
/**
 * Update notifier.
 *
 * @export
 */
function notifier() {
    updateNotifier({
        pkg: pkg,
        updateCheckInterval: 1000 * 60 * 60 // 1 hour
    });
}
exports.default = notifier;
