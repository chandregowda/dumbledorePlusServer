const {
  Scanner
} = require('./scanner.server.controller');

// API Server Endpoints
module.exports = function (router, tokenValidator) {
  /** DB Activities */
  router.post('/scanner/getComponentExceptionSummary', tokenValidator, Scanner.getComponentExceptionSummary);
};