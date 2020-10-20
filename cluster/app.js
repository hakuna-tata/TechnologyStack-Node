const http = require('http');

http.createServer(function(req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(8000, () => {
    console.log('listened 8000');
    while(true) {}
});