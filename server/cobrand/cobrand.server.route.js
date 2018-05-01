const {
  Cobrand
} = require('./cobrand.server.controller');

// API Server Endpoints
module.exports = function (router, tokenValidator) {
  /** DB Activities */
  router.post('/cobrand/get', tokenValidator, Cobrand.get);
  router.post('/cobrand/delete', tokenValidator, Cobrand.delete);
};