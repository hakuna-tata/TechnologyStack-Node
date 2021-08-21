const cluster = require('cluster');
const os = require('os');

const workerMap = {};
const memoryLimit = 734003200;

const registerMasterEvent = () => {
    if (!cluster.isMaster) return;

    cluster.on('fork', (worker) => {
        const { cpuId, process } = worker;
        console.log(`worker${cpuId} fork success! pid: ${process.pid}`);

        workerMap[cpuId] = worker;

        worker.on('message', (msg) => {
            worker.msg = msg;
            worker.lastLiveTime = Date.now();
        });

        worker.send({
            cpuId,
            cmd: 'listen',
        })
    });

    cluster.on('disconnect', (worker) => {
        console.log(`worker${worker.cpuId} disconnect! pid: ${worker.process.pid}`);
    });

    cluster.on('exit', (worker) => {
        console.log(`worker${worker.cpuId} exit! pid: ${worker.process.pid}`);

        const restartWork = cluster.fork();
        restartWork.cpuId = worker.cpuId;
    });
};

const exitWorker = (worker) => {
    const { cpuId } = worker;

    if (workerMap[cpuId] === worker) {
        delete workerMap[cpuId]

        process.kill(worker.process.pid);
    }
};

const workerMonitor = () => {
    const checkWorkerAliveTimer = 10 * 1000;
    let checkWorkerAliveTimes = 0;

    setInterval(() => {
        checkWorkerAliveTimes += 1;

        Object.keys(workerMap).forEach((id) => {
            const worker = workerMap[id];

            worker.lastLiveTime = worker.lastLiveTime || Date.now();
            
             // 内存超限
             if (worker.msg) {
                const workerMemory =  worker.msg.memoryUsage;

                if (workerMemory && workerMemory.rss > memoryLimit) {
                    console.log(`worker${worker.cpuId} memory exceeded, pid: ${worker.process.pid}`)

                    exitWorker(worker);
                }
            }

            // 僵尸进程
            if (Date.now() - worker.lastLiveTime > checkWorkerAliveTimer * 3) {
                console.log(`worker${worker.cpuId} miss heartBeat, pid: ${worker.process.pid}`);

                exitWorker(worker);
            }
        });

    }, checkWorkerAliveTimer);
};

const startServer = () => {
    const hadInspectArg = process.execArgv.join().indexOf('inspect') > -1 ? true: false;

    if (cluster.isMaster && !hadInspectArg) {
        process.title = 'cluster/master';
        console.log('start master....');

        registerMasterEvent();

        os.cpus().forEach((item, index) => {
            const worker = cluster.fork();
            worker.cpuId = index;
        });
        
        workerMonitor();
        require('./masterServer.js');
    } else {
       console.log('start worker....');

       require('./workerServer.js');

       if (cluster.isMaster && hadInspectArg) {
            process.emit('message', {
                cpuId: 0,
                cmd: 'listen'
            });
       }
    }
};

startServer();
