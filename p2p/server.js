class Server{
  constructor() {
    const http = require('http');
    const io = require('socket.io')();
    const express = require('express');

    const listen = () => {
      const app = express();
      const httpServer = http.createServer(app);
      io.listen(httpServer);
      httpServer.listen(5000);

      io.on('connection', (socket) =>{
        console.log("connected peer:" +socket.id);
        console.log("parameter:" + JSON.stringify(socket.handshake.query));
        socket.on('message', (data) =>{
          console.log('message peer:' + socket.id);
          io.emit('message', data);
        });
        socket.on('disconnect', () => {
          console.log('disconnect peer:' + socket.id);
        })
      });
    }
    return {
      listen: listen
    }
  }
};

module.exports = new Server();
