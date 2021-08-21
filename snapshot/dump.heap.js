const http = require('http');
const { resolve } = require('path');
const { writeHeapSnapshot } = require('v8');

const PORT = 8000;
let snapshotIndex = 1; 

http.createServer((req, res) => {
    if (req.url === '/snapshot') {
        const writeFilename = resolve(__dirname, `./${snapshotIndex++}.${Date.now()}.heapsnapshot`);
        writeHeapSnapshot(writeFilename);
        
        res.end('take snapshot success!');
    }
}).listen(PORT);

