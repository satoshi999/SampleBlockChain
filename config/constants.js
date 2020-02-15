const os = require('os');
function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}

const ip = os.networkInterfaces();
console.log(`My ip address:` + ip['en0'][1].address);
define('IP', ip['en0'][1].address);
