var exec = require('cordova/exec');

exports.execShell = function (cmd, success, error) {
    return new Promise(function (resolve, reject) {
        exec(function (result) {
            if (result) {
                if (result.endsWith('\r\n')) {
                    result = result.substr(0, result.length - 3);
                }
                if (result.endsWith('\n') || result.endsWith('\r')) {
                    result = result.substr(0, result.length - 1);
                }
            }
            resolve(result);
        }, function (err) {
            reject(err);
        }, 'OSXShellExec', 'exec', [cmd]);
    })
};

exports.readPlist = function (cmd) {
    return new Promise(function (resolve, reject) {
        exec(function (result) {
            resolve(result);
        }, function (err) {
            reject(err)
        }, 'OSXShellExec', 'readPlist', [cmd]);
    })
};

exports.savePlist = function (json, path) {
    return new Promise(function (resolve, reject) {
        exec(function (result) {
            resolve(result);
        }, function (err) {
            reject(err)
        }, 'OSXShellExec', 'savePlist', [json, path]);
    })
};

exports.readTextFile = function (path) {
    return new Promise(function (resolve, reject) {
        exec(function (result) {
            resolve(result);
        }, function (err) {
            reject(err)
        }, 'OSXShellExec', 'readTextFile', [path]);
    })
};

exports.saveTextFile = function (path, content) {
    return new Promise(function (resolve, reject) {
        exec(function (result) {
            resolve(result);
        }, function (err) {
            reject(err)
        }, 'OSXShellExec', 'saveTextFile', [path, content]);
    })
};

exports.getAppPath = function () {
    return new Promise(function (resolve, reject) {
        exec(function (result) {
            resolve(result);
        }, function (err) {
            reject(err)
        }, 'OSXShellExec', 'getAppPath', []);
    })
};
