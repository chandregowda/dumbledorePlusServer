const {
  Ip
} = require('./ip.server.controller');

// API Server Endpoints
module.exports = function (router, tokenValidator) {
  /** DB Activities */
  router.post('/ip/get', tokenValidator, Ip.get);
  router.post('/ip/getAllIpDiskSpace', Ip.getAllIpDiskSpace);
  router.post('/ip/getSingleIpDiskSpace', Ip.getSingleIpDiskSpace);
};