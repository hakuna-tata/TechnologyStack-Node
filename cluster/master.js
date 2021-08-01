const cluster = require('cluster');
const os = require('os');
const { fork } = require('child_process');


const registerMasterEvent = () => {
    if (!cluster.isMaster) return;

    cluster.on('fork', () => {
        console.log('fork worker success')
    });

    cluster.on('disconnect', () => {

    });

    cluster.on('exit', () => {

    });
};

const workerMonitor = () => {

};

const masterMonitor = () => {
    console.log('start master monitor ......');

    // fork();
};

const startServer = () => {
    const hadInspectArg = process.execArgv.join().indexOf('inspect') > -1 ? true: false;

    if (cluster.isMaster && !hadInspectArg) {
        console.log('start master process ......');

        os.cpus().forEach((item, index) => {
            const worker = cluster.fork(process.env);

            worker.cpuId = index;
        });

        registerMasterEvent();
        workerMonitor();
        require('./masterHttp');
        masterMonitor();

    } else {
       process.title = 'cluster/worker';
       console.log('start worker process ......');

       require('./workerHttp');
    }
};

startServer();
