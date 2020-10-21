process.on('uncaughtException', (error, origin) => {
    console.log('捕获的异常: ',error);
    console.log('异常的来源:',origin);
})

try {
    setTimeout(() => {
        throw new Error('async throw error')
    })
} catch(e) {    
    console.log('catch:',e);
}

// 不用 uncaughtException 事件捕获就不会执行
setTimeout(() => {
    console.log('uncaughtException 事件捕获了就会执行')
})