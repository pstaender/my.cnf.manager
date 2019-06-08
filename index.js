"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var os_1 = require("os");
var fs = require("fs");
var filename = path.resolve(os_1.homedir + "/.my.cnf.clients");
var myCnfFile = path.resolve(os_1.homedir + "/.my.cnf");
var DEFAULT_ENVIRONMENT = 'default';
function switchMyCnf(options) {
    if (options === void 0) { options = {
        environment: DEFAULT_ENVIRONMENT
    }; }
    var environment = options.environment;
    var environmentFound = false;
    var collectLines = false;
    var lines = ['[client]'];
    var values = {};
    var usingDefaultEnvironment = environment === DEFAULT_ENVIRONMENT;
    fs.readFileSync(filename)
        .toString()
        .split('\n')
        .forEach(function (line) {
        var matches = line.match(/\[(.+?)\]/);
        if (matches && matches[1]) {
            collectLines = [environment, DEFAULT_ENVIRONMENT].includes(matches[1]);
            if (collectLines &&
                !environmentFound &&
                matches[1] !== DEFAULT_ENVIRONMENT) {
                environmentFound = true;
            }
        }
        if (collectLines && matches === null) {
            var _a = line.split('='), key = _a[0], value = _a[1];
            values[key] = value || '';
        }
    });
    var myCnfFileContent = lines.concat(Object.keys(values)
        .filter(function (key) { return key; })
        .map(function (key) { return key + "=" + values[key]; })).join('\n') + '\n';
    if (environmentFound || usingDefaultEnvironment) {
        fs.writeFileSync(myCnfFile, myCnfFileContent);
        console.log("switched .my.cnf to " + environment);
    }
    else {
        console.error("environment " + environment + " not found");
        process.exit(1);
    }
}
exports.switchMyCnf = switchMyCnf;
//# sourceMappingURL=index.js.map