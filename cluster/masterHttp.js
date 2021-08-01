const http = require('http');
const masterPort = 12888;

const server = http.createServer((req, res) => {
    console.log('master request url:', req.url);
});

console.log('start master http ......');

server.listen(masterPort, () => {
    console.log(`master http listen on 127.0.0.1:${masterPort}`)
});
