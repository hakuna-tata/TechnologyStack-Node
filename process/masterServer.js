const path = require('path');
const http = require('http');
const { fork } = require('child_process');
const masterPort = 12888;

const server = http.createServer((req, res) => {
    if (req.url === '/ping#') {
        res.end('pong#');
    }
});

const masterMonitor = () => {
    fork(path.resolve(__dirname, './masterMonitor.js'), [process.pid, masterPort], {
        silent: false,
    });
};

console.log('start master http....');
server.listen(masterPort, () => {
    console.log(`master http listen on 127.0.0.1:${masterPort}`);

    masterMonitor();
});
