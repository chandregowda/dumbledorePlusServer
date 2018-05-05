const {
  Download
} = require('./download.server.controller');

// API Server Endpoints
module.exports = function (router, tokenValidator) {
  /** DB Activities */
  router.post('/download/create', Download.create);
  router.post('/download/get', tokenValidator, Download.get);
  router.post('/download/update', tokenValidator, Download.update);
  router.post('/download/delete', tokenValidator, Download.delete);
};