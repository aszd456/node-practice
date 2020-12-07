var fs = require('fs');

//使用string写入文件
var str = new String('data to append');
fs.appendFile('message.txt', 'data to append', 'utf8', callback);

//使用buffer写入文件
var buf = new Buffer.from('data to append');
fs.appendFile('message.txt', buf, (err) => {
    if(err) throw err;
    console.log('The "data to append" was appended to file!');
});