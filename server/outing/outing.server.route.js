const {
  Outing
} = require('./outing.server.controller');

// API Server Endpoints
module.exports = function (router, tokenValidator) {
  /** DB Activities */
  router.post('/outing/create', Outing.create);
  router.post('/outing/get', tokenValidator, Outing.get);
  router.post('/outing/update', tokenValidator, Outing.update);
  router.post('/outing/delete', tokenValidator, Outing.delete);
};