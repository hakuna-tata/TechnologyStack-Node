const net = require('net');
const DATA_MAX_LENGTH = 17;

const socket = new net.Socket();
let seq = 0; // 包序号

socket.connect({
  host: 'localhost',
  port: 8080,
});


// rpc调用请求包编码
const encode = (data) => {
  // 为了实现全双工通信，将数据包分为定长的包头和不定长的包体
  // 包头用来记载包的序号和包的长度
  const header = Buffer.alloc(4);
  const body = Buffer.alloc(2);

  body.writeInt16BE(String(data));
  header.writeInt16BE(String(seq));
  header.writeInt16BE(String(body.length), 2);

  // 包头和包体拼接发送
  const buffer = Buffer.concat([header, body]);

  console.log(`发送第${seq}个包，发送的索引值是${data}`);
  seq++;
  return buffer;
}

// rpc调用返回包解码
const decode = (buffer) => {
  const header = buffer.slice(0, 4);
  const seq = header.readInt16BE();

  const body = buffer.slice(4).toString();
  return {
    seq,
    data: body,
  }
}

// 检查一段buffer是不是一个完整的数据包
const checkIsComplete = (buffer) => {
  if(buffer.length < 4) return 0;
  // 从包头拿出包体长度数据
  const bodyLength = buffer.readInt16BE(2);
  return 4 + bodyLength;
}

let previousBuffer = null;
socket.on('data', (buffer) => {
  if(previousBuffer){
    buffer = Buffer.concat([previousBuffer, buffer]);
  }

  let completeLength = 0;
  while(completeLength = checkIsComplete(buffer)){
    // 切出每个包完整的长度
    const package = buffer.slice(0, completeLength);
    // 递归切分
    buffer = buffer.slice(completeLength);
    // 解析每个包
    const result = decode(package);
    console.log(`接收第: ${result.seq} 个包，接收的返回值是: ${result.data}`);
  }

  // 缓存数据不完整的包
  previousBuffer = buffer;
});

for (let k = 0; k < 100; k++) {
  id = Math.floor(Math.random() * DATA_MAX_LENGTH);
  socket.write(encode(id));
}