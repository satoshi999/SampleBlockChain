const signalingServer = require('./p2p/signalingServer');
const signalingClient = require('./p2p/signalingClient');
const server = require('./p2p/server');
const client = require('./p2p/client');

signalingServer.listen();
signalingClient.connect(client);
server.listen();
