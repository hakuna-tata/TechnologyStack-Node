const cluster = require('cluster');
const os = require('os');

const workerMap = {};

const registerMasterEvent = () => {
    if (!cluster.isMaster) return;

    cluster.on('fork', (worker) => {
        const { id, cpuId, process } = worker;
        console.log(`worker${id} fork success! pid: ${process.pid}, cpu: ${cpuId}`);

        workerMap[cpuId] = worker;

        worker.on('message', (msg) => {
            console.log('msg:', msg);
        });

        worker.send({
            cpuId,
            cmd: 'listen',
        })
    });

    cluster.on('disconnect', (worker) => {

    });

    cluster.on('exit', (worker) => {

    });
};

const workerMonitor = () => {
    console.log('start worker monitor....');
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

       require('./workerServier.js');

       if (cluster.isMaster && hadInspectArg) {
            process.emit('message', {
                cpuId: 0,
                cmd: 'listen'
            });
       }
    }
};

startServer();
