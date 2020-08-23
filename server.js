const net = require('net');
const { db } = require('./db');
const REQ_LENGTH = 6;

const encode = (seq, data) => {
  const header = Buffer.alloc(4);
  const body = Buffer.from(data);

  header.writeInt16BE(String(seq));
  header.writeInt16BE(String(body.length), 2);

  const buffer = Buffer.concat([header, body]);
  return buffer;
}

const decode = (buffer) => {
  const header = buffer.slice(0, 4);
  const seq = header.readInt16BE();

  const body = buffer.slice(4).readInt16BE();
  return {
    seq,
    data: body
  }
}

const checkIsComplete = (buffer) => {
  return buffer.length < REQ_LENGTH ? 0 : buffer.length;
}


const server = net.createServer((socket) => {

  let previousBuffer = null;
  socket.on('data', (buffer) => {
    if(previousBuffer){
      buffer = Buffer.concat([previousBuffer, buffer]);
    }
    
    while(checkIsComplete(buffer)){
      const package = buffer.slice(0, REQ_LENGTH);
      buffer = buffer.slice(REQ_LENGTH);
      
      const result = decode(package);
      socket.write(encode(result.seq, db[result.data]));
    }

    previousBuffer = buffer;
  })
})

server.listen(8080);