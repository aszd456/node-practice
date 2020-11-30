const http = require('http');

const server = http.createServer(function(req, res) {
    let data  = '';
	/**
	 * 当请求体数据到来时该事件被触发，该事件提供一个chunk参数，表示接收的数据
	 * @param {Object} chunk
	 */
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        let method = req.method;
        let url = req.url;
        let headers = JSON.stringify(req.headers);
        let httpVersion = req.httpVersion;
        res.writeHead(200,{
            'content-type': 'text/html'
        });
        let dataHtml = '<p>data:' + data + '</p>';
        let methodHtml = '<p>method:' + method + '</p>';
        let urlHtml = '<p>url:' + url + '</p>';
        let headersHtml = '<p>headers:' + headers + '</p>';
        let httpVersionHtml = '<p>httpVersion:' + httpVersion + '</p>';
        let resData = dataHtml + methodHtml + urlHtml + headersHtml + httpVersionHtml;
        res.end(resData);
    });
});
server.listen(3000, function() {
    console.log('listening port 3000');
});