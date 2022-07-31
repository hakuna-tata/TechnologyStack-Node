const http = require('http');
const domain = require('domain');

const doRoute = (d) => {
    console.log(process.domain === d);

    const reqId = parseInt(d.req.url.substr(1));
    d.reqId = reqId;

    setTimeout(() => {
        if (reqId === 3) {
            throw new Error('test error domain context')
        }

        d.res.end(`test success domain context: ${d.reqId}`)
    }, (5 - reqId) * 1000)
}

const domainRequest = (req, res) => {
    let d = domain.create();

    d.start = Date.now();
    d.req = req;
    d.res = res;

    // 显示绑定
    d.add(req);
    d.add(res);

    // 使用 uncaughtException 捕获也可以, 参考 ./globalCatch.js 文件
    d.on('error', (err) => {
        console.log(err);
        // 当前上下文，并不会出现串台
        const curDomain = process.domain;

        curDomain.res.writeHead(500);
        curDomain.res.end(`server error: ${curDomain.reqId}`);
    });

    res.once('finish', () => {
        res.removeAllListeners('finish');

        d.remove(req);
        d.remove(res);
        req = null;
        res = null;
        d = null;
    })

    d.run(() => {
        doRoute(d);
    });
}

const server = http.createServer((req, res) => {
    domainRequest(req, res);
});

server.listen(8000, () => {
    console.log('listened 8000');
});
