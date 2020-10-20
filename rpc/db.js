const fs = require('fs');
const protobuf = require('protocol-buffers'); // 创建 package.json 下载依赖
 
const messages = protobuf(fs.readFileSync('./proto/mqq.proto'));
 
const buf1 = messages.Test.encode({
  num: 42,
  payload: 'hello world'
});

const buf2 = messages.AnotherOne.encode({
  list: [
    messages.FOO.BAR
  ]
})

console.log(messages);
console.log(buf1, '=======', buf2);

const buf3 = messages.Test.decode(buf1);
const buf4 = messages.AnotherOne.decode(buf2);
console.log(buf3, '=======', buf4);