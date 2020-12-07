'use strict';

const async_hooks = require('async_hooks');
const fs = require('fs');

let indent = 0;
async_hooks.createHook({
    init(asyncId, type, triggerAsyncId) {
        const eid = async_hooks.executionAsyncId();
        const indentStr = ' '.repeat(indent);
        fs.writeSync(
            1,
            `${indentStr}${type}(${asyncId}):` +
            ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
    },
    before(asyncId) {
        const indentStr = ' '.repeat(indent);
        fs.writeSync(1, `${indentStr}before:  ${asyncId}\n`);
        indent += 2;
    },
    after(asyncId) {
        indent -= 2;
        const indentStr = ' '.repeat(indent);
        fs.writeSync(1, `${indentStr}after:   ${asyncId}\n`);
    },
    destroy(asyncId) {
        const indentStr = ' '.repeat(indent);
        fs.writeSync(1, `${indentStr}destroy: ${asyncId}\n`);
    },
}).enable();

fs.readFile("a.txt", 'utf8', function(err, data){
});

fs.readFile("b.txt", 'utf8', function(err, data){
});

fs.readFile("a.txt", 'utf8', function(err, data){
    fs.readFile("b.txt", 'utf8', function(err, data){
    });
});

fs.readFile("a.txt", function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

fs.readFile("b.txt", function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});