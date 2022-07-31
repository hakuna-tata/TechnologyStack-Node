process.on('uncaughtException', (error) => {
    console.log('uncaughtException: ', error);
});

process.on('unhandledRejection', (reason) => {
    console.log('unhandledRejection: ', reason);
});

try {
    setTimeout(() => {
        throw new Error('async throw error');
    })
} catch (e) {
    console.log('catch sync error:', e);
}

try {
    new Promise(() => {
        a();
    })
} catch (e) {
    console.log('catch sync error:', e);
}

// 全局不监听 uncaughtException 事件就不会执行
setTimeout(() => {
    console.log('执行');
})
