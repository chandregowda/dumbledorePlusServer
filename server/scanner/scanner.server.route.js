const {
  Scanner
} = require('./scanner.server.controller');

// API Server Endpoints
module.exports = function (router, tokenValidator) {
  /** DB Activities */
  router.post('/scanner/getLogSummary', tokenValidator, Scanner.getLogSummary);
  router.post('/scanner/searchParamKeyInAllNodeInstances', tokenValidator, Scanner.searchParamKeyInAllNodeInstances);
};