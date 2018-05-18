const {
  Exception
} = require('./exception.server.controller');

// API Server Endpoints
module.exports = function (router, tokenValidator) {
  /** DB Activities */
  router.post('/exception/get', tokenValidator, Exception.get);
  router.post('/exception/delete', tokenValidator, Exception.delete);
  router.post('/exception/generateExceptionLogFile', tokenValidator, Exception.generateExceptionLogFile);
};