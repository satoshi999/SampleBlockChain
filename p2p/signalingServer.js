class SignalingServer{
  constructor() {
    const nodes = {};
    const http = require('http');
    const io = require('socket.io')();
    const express = require('express');
    const listen = () => {
      const app = express();
      const httpServer = http.createServer(app);
      io.listen(httpServer);
      httpServer.listen(3000);

      io.on('connection', (socket) => {
        console.log("connected socketid:" +socket.id);
        const parameter = socket.handshake.query;
        nodes[socket.id] = parameter.ip;
        _emit();
        socket.on('disconnect', () => {
          console.log('disconnect socketId:' + socket.id);
          delete nodes[socket.id];
          _emit();
        });
      });
    }
    const _emit = () => {
      io.emit('signaling nodes', JSON.stringify(nodes));
    }
    return {
      listen: listen
    }
  }
};

module.exports = new SignalingServer();
