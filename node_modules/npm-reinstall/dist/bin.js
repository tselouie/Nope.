#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var yargs = require("yargs");
var reinstall_1 = require("./reinstall");
var COMMAND = chalk_1.green('reinstall');
var repo = 'https://github.com/gluons/npm-reinstall';
var argv = yargs
    .usage("Usage: " + COMMAND + " [options] " + chalk_1.cyan('<package> ...'))
    .help()
    .alias('help', 'h')
    .version()
    .alias('version', 'V')
    .example(COMMAND, 'Reinstall all local packages in current working directory.')
    .boolean('global')
    .group('global', 'Dependency Options:')
    .alias('global', 'g')
    .describe('global', 'Reinstall global package')
    .example(COMMAND + " --global " + chalk_1.cyan('vue-cli'), "Reinstall " + chalk_1.cyan('vue-cli') + " globally")
    .boolean('save')
    .group('save', 'Dependency Options:')
    .alias('save', 'S')
    .describe('save', 'Reinstall package in dependencies')
    .example(COMMAND + " --save " + chalk_1.cyan('vue'), "Reinstall " + chalk_1.cyan('vue') + " as dependencies")
    .boolean('save-dev')
    .group('save-dev', 'Dependency Options:')
    .alias('save-dev', 'D')
    .describe('save-dev', 'Reinstall package in devDependencies')
    .example(COMMAND + " --save-dev " + chalk_1.cyan('vue-loader'), "Reinstall " + chalk_1.cyan('vue-loader') + " as devDependencies")
    .boolean('npm')
    .alias('npm', 'n')
    .describe('npm', 'Force to use NPM')
    .boolean('yarn')
    .alias('yarn', 'y')
    .describe('yarn', 'Force to use Yarn')
    .boolean('verbose')
    .alias('verbose', 'v')
    .describe('verbose', 'Display more information')
    .epilog("\u2B50 Star me at " + repo + " \uD83D\uDE03")
    .check(function (parsedArgv) {
    var npm = parsedArgv.npm;
    var yarn = parsedArgv.yarn;
    if (npm && yarn) {
        throw new Error("\u2139\uFE0F Arguments " + chalk_1.yellow('npm') + " and " + chalk_1.yellow('yarn') + " are mutually exclusive");
    }
    else {
        return true;
    }
})
    .argv;
reinstall_1.default(argv);
