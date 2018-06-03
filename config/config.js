var CONFIG = {
	appName: 'CAPI',
	server: {
		port: 3200,
		https_port: 443,
		MAX_NUMBER_OF_CPU: 1, // For cluster to use cores avaliable in box
		ldapURL: 'ldap://192.168.210.24:389',
		// ldapURL: 'ldap://192.168.227.27:389', // PRODUCTION
		protocol: 'http',
		timeout: 1000 * 60 * 60, // 1 hour minutes
		private_key: 'ssl/localhost/server.key',
		certificate: 'ssl/localhost/server.crt',
		publicKey: '3bc0caa8d3c248d7821d3ee483202175',
		sessionTimeOut: 900000, // 15 * 60 * 60 * 1000 -> 15 minutes
		proxyServer: '' // Set it to blank for Dev and QA box
		// proxyServer: 'http://172.18.7.250:3128' // This should be set to 'http://172.18.7.250:3128' for STAGE
	},
	processDetailsFilePath: './downloads/',
	webTokenKey: 'Agn18r@Hm05&C',

	// CAPI details
	capiPath: "/home/logmonitor/utils",

	// mailServerConfig is to send mail on Feedback
	mailServerConfig: {
		options: {
			host: '192.168.211.175', // QA or DEV
			// host:'172.17.26.31', // STAGE Server or sc-mailgw01.exo.yodlee.com
			port: '25',
			secureConnection: false
		},
		from: 'ABnC@yodlee.com', // Mail will be sent to user with this FROM Id
		sendTo: ['cgowda@yodlee.com'] // List of people to send mail on feedback arrival
	},
	// This is used if we have mongo server implementation (as of now ignore this)
	database: {
		url: 'mongodb://127.0.0.1:27017/dumbledore' // Change this to the Database Schema Name
	}
};
module.exports = {
	CONFIG
};