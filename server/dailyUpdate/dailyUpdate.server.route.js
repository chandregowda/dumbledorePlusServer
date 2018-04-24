const { DailyUpdate } = require('./dailyUpdate.server.controller');

// API Server Endpoints
module.exports = function(router, tokenValidator) {
	/** DB Activities */
	router.post('/dailyUpdate/create', tokenValidator, DailyUpdate.create);
	router.post('/dailyUpdate/get', tokenValidator, DailyUpdate.get);
	router.post('/dailyUpdate/update', tokenValidator, DailyUpdate.update);
	router.post('/dailyUpdate/delete', tokenValidator, DailyUpdate.delete);
};
