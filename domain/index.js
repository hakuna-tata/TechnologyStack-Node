const http = require('http');
const domain = require('domain');

var uid = 0;

const doRoute = (currentDomain) => {
    console.log(currentDomain);
    console.log(process.domain === currentDomain);
}

const domainRequest = (req, res) => {
    const d = domain.create();

    d.start =  Date.now();
    d._uid = ++uid;

    // 使用 process 监听 uncaughtException 捕获也可以
    d.on('error', (err) => {
        console.log(err);
        res.writeHead(500);
        res.end("server error\n");
    });

    d.add(req);
    d.add(res);

    d.run(() => {
        doRoute(d);
    });

    res.once('finish', () => {
       // 
    })
}

const server = http.createServer((req, res) => {
    domainRequest(req, res);
});

server.listen(8000, () => {
    console.log('listened 8000');
});
