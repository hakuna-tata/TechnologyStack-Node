const http = require('http');
const workerPort = 8888;
const methodMap = {};

const server = http.createServer((req, res) => {
    console.log('worker request url:', req.url);
});

const heartBeat = () => {
    process.send({
        cmd: 'heartBeat',
        memoryUsage: process.memoryUsage(),
    })
}

methodMap.listen = (cpuId) => {
    process.title = `cluster/worker/${cpuId}`;

    server.listen(workerPort,  () => {
        console.log(`worker http listen on 127.0.0.1:${workerPort}`);

        setInterval(heartBeat, 10000);
    });
}

process.on('message', (msg) => {
    if (!msg) return;
    
    if (!msg.cmd) return;

    console.log(`cpu${msg.cpuId} receive message, cmd: ${msg.cmd}`);

    methodMap[msg.cmd](msg.cpuId || 0);
});