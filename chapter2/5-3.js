var fs = require('fs');

fs.stat('5-3.js', function (err, stats) {
    console.log(stats);
});