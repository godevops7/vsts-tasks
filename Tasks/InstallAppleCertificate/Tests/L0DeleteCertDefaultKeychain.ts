import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fs = require('fs');

let taskPath = path.join(__dirname, '..', 'postinstallcert.js');
let tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput('keychain', 'default');
tr.setInput('deleteCert', 'true');

process.env['AGENT_VERSION'] = '2.116.0';
process.env['VSTS_TASKVARIABLE_APPLE_CERTIFICATE_KEYCHAIN'] = '/usr/lib/login.keychain';
process.env['VSTS_TASKVARIABLE_APPLE_CERTIFICATE_SHA1HASH'] = 'SHA1HASHOFP12CERTIFICATE';
process.env['HOME'] = '/users/test';

tr.registerMock('fs', {
    readFileSync: fs.readFileSync,
    statSync: fs.statSync,
    writeFileSync: function (filePath, contents) {
    }
});

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "which": {
        "security": "/usr/bin/security"
    },
    "checkPath": {
        "/usr/bin/security": true
    },
    "exec": {
        "/usr/bin/security delete-certificate -Z SHA1HASHOFP12CERTIFICATE /usr/lib/login.keychain": {
            "code": 0,
            "stdout": "deleted keychain"
        }
    }
};
tr.setAnswers(a);

tr.run();

