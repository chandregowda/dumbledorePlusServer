const {
  Ip
} = require('./ip.server.controller');

// API Server Endpoints
module.exports = function (router, tokenValidator) {
  /** DB Activities */
  router.post('/ip/get', tokenValidator, Ip.get);
};