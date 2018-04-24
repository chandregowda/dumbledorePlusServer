const { Sample } = require('./sample.server.controller');

// API Server Endpoints
module.exports = function(router) {
	router.get('/sample-api/greet', Sample.greet); // Simple Message

	/** DB Activities */
	router.get('/sample-api/insertSampleRecord', Sample.insertSampleRecord);
	router.post('/sample-api/createSampleRecord', Sample.createSampleRecord);
	router.post('/sample-api/getSampleRecord', Sample.getSampleRecord);
	router.post('/sample-api/updateSampleRecord', Sample.updateSampleRecord);
	router.post('/sample-api/deleteSampleRecord', Sample.deleteSampleRecord);
};
