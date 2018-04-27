const {
  Process
} = require('./process.server.controller');

// API Server Endpoints
module.exports = function (router, tokenValidator) {
  /** DB Activities */
  router.post('/process/get', tokenValidator, Process.get);
};