const { User } = require('./user.server.controller');

// API Server Endpoints
module.exports = function(router, tokenValidator) {
	/** DB Activities */
	router.post('/user/create', User.create);
	router.post('/user/get', tokenValidator, User.get);
	router.post('/user/update', tokenValidator, User.update);
	router.post('/user/delete', tokenValidator, User.delete);
};
