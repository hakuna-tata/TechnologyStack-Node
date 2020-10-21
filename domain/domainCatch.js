const http = require('http');
const domain = require('domain');

const handle = () => {
    const currentDomain = process.domain;

    setTimeout(() => {
        throw new Error('currentDomain error');

        currentDomain.res.writeHead(200);
        currentDomain.res.end("hello world\n");
    })
};

const server = http.createServer((req, res) => {
    const d = domain.create();

    // 使用 process 通过 uncaughtException 捕获也可以
    d.on('error', (error) => {
        console.log(error);
        res.writeHead(500);
        res.end("server error\n");
    })

    d.req = req;
    d.res = res;

    d.run(() => {
        handle();
    })
});

server.listen(8000, () => {
    console.log('listened 8000');
});
