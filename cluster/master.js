const cluster = require('cluster');

if(cluster.isMaster) {
    // 子进程
    function createWorker() {
        const worker = cluster.fork();
        // 没有回应的 ping 次数
        let missed = 0;

        const timer = setInterval(() => {
            if(missed === 3) {
                clearInterval(timer);
                console.log(worker.process.pid + ' has become a zombie!');
                process.kill(worker.process.pid);
                return;
            }
            // 心跳计算
            missed++;
            worker.send('ping#' + worker.process.pid);
        }, 10000);

        worker.on('message', (msg) => {
            if(msg === 'pong#' + worker.process.pid) {
                missed--;
            }
        })
        // 杀死子进程，清理timer
        worker.on('exit', () => {
            clearInterval(timer);
        });
    }

    for(let i = 0; i < require('os').cpus().length / 2; i++) {
        createWorker();
    }
    // 子进程挂了，重新启动一个子进程
    cluster.on('exit', () => {
        setTimeout(() => {
            createWorker();
        }, 5000)
    });

} else {
    // 当进程出现崩溃的错误
    process.on('uncaughtException', function (err) {
        // 写日志
        console.log(err);
        // 退出进程
        process.exit(1);
    });

    // 回应心跳信息
    process.on('message', function (msg) {
        if (msg == 'ping#' + process.pid) {
            process.send('pong#' + process.pid);
        }
    });

    // 内存使用过多退出进程
    if (process.memoryUsage().rss > 734003200) {
        process.exit(1);
    }

    require('./app.js');
}