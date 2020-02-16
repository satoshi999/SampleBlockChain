class SignalingClient{
  constructor() {
    const client = require('./client');
    const connect = () => {
      const socket = require('socket.io-client').connect(`http://${process.env.BOOT_NODE}:3000`, {query: `ip=${process.env.IP}`});
      socket.on('signaling nodes', function(nodes){
        const json = JSON.parse(nodes);
        for(let key in json) {
          const ip = json[key];
          console.log(`socketId:${key}, ip address:${ip}`);
          if(ip !== process.env.IP) {
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
