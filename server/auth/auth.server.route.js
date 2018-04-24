const { AUTH } = require('./auth.server.controller');

// API Server Endpoints
module.exports = function(router) {
	// Login to system using AD - Microsoft credentials
	router.post('/login', AUTH.login);
	router.post('/logout', AUTH.logout);
};
