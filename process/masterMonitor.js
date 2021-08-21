const http = require('http');

const PING_TIMEOUT = 5 * 1000;
const PING_INTERVAL = 30 * 1000;
const PING_RETRY_TIMES = 3;
let RETRY = 0;

const ping = (masterPort) => {
    return new Promise((resolve, reject) => {
        const req = http.request({
            host: '127.0.0.1' ,
            port: masterPort,
            path: '/ping#',
            method: 'GET',
            timeout: PING_TIMEOUT,
        }, (res) => {
            res.on('data', (chunk) => {
                resolve(chunk.toString());
            });

            res.on('error', () => {
                reject(new Error('pong# response error'));
            });
        });

        req.on('timeout', () => {
            reject(new Error('ping# request timeout'));
        });

        req.on('error', () => {
            reject(new Error('ping# request error'));
        });

        req.end();
    });
};


const monitor = async (masterPort) => {
    try {
        await ping(masterPort);

        setTimeout(monitor, PING_INTERVAL);
    } catch(_) {
        if (RETRY >= PING_RETRY_TIMES) {
            console.log(`ping# master fail! restart master...`);

            // restart master http
        } else {
            RETRY += 1;
            console.log(`ping# master fail! retry: ${RETRY}`);

            setTimeout(monitor, PING_INTERVAL);
        }
    }
};

const startMonitor = () => {
    process.title = 'cluster/master-monitor';

    const masterPid = process.argv[2];
    const masterPort = process.argv[3];

    if (!masterPid) {
        console.log('master pid not exist! exit monitor');

        return;
    }

    monitor(masterPort);
};

startMonitor();