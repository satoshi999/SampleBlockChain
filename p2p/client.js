class Client{
  constructor() {
    let socket;
    const connect = (ip) => {
      const constants = require('../config/constants');
      socket = require('socket.io-client').connect(`http://${ip}:5000`, {query: `ip=${constants.IP}`});
      socket.on('message', function(msg){
        console.log(msg);
      });
    }
    const send = (data) => {
      socket.emit('message', data);
    }
    return {
      connect: connect
    }
  }
}
module.exports = new Client();
