const { FollowUp } = require('./followUp.server.controller');

// API Server Endpoints
module.exports = function(router, tokenValidator) {
	/** DB Activities */
	router.post('/followUp/create', tokenValidator, FollowUp.create);
	router.post('/followUp/get', tokenValidator, FollowUp.get);
	// router.post('/followUp/update', tokenValidator, FollowUp.update);
	// router.post('/followUp/delete', tokenValidator, FollowUp.delete);
};
