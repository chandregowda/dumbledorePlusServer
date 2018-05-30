const {
  IpStatus
} = require('./ipStatus.server.controller');

// API Server Endpoints
module.exports = function (router, tokenValidator) {
  /** DB Activities */
  router.post('/ipStatus/get', tokenValidator, IpStatus.get);
  router.post('/ipStatus/retry', tokenValidator, IpStatus.retry);
};