const {
	Datacenter
} = require('./datacenter.server.controller');

// API Server Endpoints
module.exports = function (router, tokenValidator) {
	/** DB Activities */
	router.post('/datacenter/create', Datacenter.create);
	router.post('/datacenter/get', tokenValidator, Datacenter.get);
	router.post('/datacenter/update', tokenValidator, Datacenter.update);
	router.post('/datacenter/delete', tokenValidator, Datacenter.delete);
};