/**
 * This file is used to configure various module routes
 * 
 */

module.exports = function (router, tokenValidator) {
	// API Server Endpoints
	// require('../mail/mail.server.route')(router);
	require('../auth/auth.server.route')(router);
	require('../user/user.server.route')(router, tokenValidator);
	require('../datacenter/datacenter.server.route')(router, tokenValidator);
	require('../process/process.server.route')(router, tokenValidator);
	require('../ip/ip.server.route')(router, tokenValidator);
	require('../ipStatus/ipStatus.server.route')(router, tokenValidator);
	require('../scanner/scanner.server.route')(router, tokenValidator);
	require('../exception/exception.server.route')(router, tokenValidator);
	require('../cobrand/cobrand.server.route')(router, tokenValidator);
	require('../downloads/download.server.route')(router, tokenValidator);
	require('../misc/misc.server.route')(router, tokenValidator);
};