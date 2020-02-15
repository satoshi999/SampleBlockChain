class SignalingClient{
  constructor() {
    const client = require('./client');
    const constants = require('../config/constants');
    const connect = () => {
      const socket = require('socket.io-client').connect(`http://${process.env.SIG_SERVER}:3000`, {query: `ip=${constants.IP}`});
      socket.on('signaling nodes', function(nodes){
        const json = JSON.parse(nodes);
        for(let key in json) {
          const ip = json[key];
          console.log(`socketId:${key}, ip address:${ip}`);
          if(ip !== constants.IP) {
            client.connect(ip);
          }
        }
      });
    }
    return {
      connect: connect
    }
  }
};

module.exports = new SignalingClient();
