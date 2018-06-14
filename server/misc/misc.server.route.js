const {
  Misc
} = require('./misc.server.controller');

// API Server Endpoints
module.exports = function (router, tokenValidator) {
  /** DB Activities */
  router.post('/misc/getFile', tokenValidator, Misc.getFile);
};