'use strict';

const {
	CONFIG
} = require('../../config/config');
const jwt = require('jsonwebtoken');
const jwtKey = CONFIG.webTokenKey || '5ecret5@1t2oI8';
// For AD authentication
const ActiveDirectory = require('activedirectory');
const maxAge = parseInt(CONFIG.server.sessionTimeOut) || 6000;

const AUTH = {};
module.exports = {
	AUTH
};

AUTH.logout = function (options) {
	logger.INFO('Logging Out', options);
}; // logout

// Login to system using Yoldee credentials
AUTH.login = (req, res) => {
	const o = {
		username: req.body.email || '',
		password: req.body.password || ''
	};
	if (!o.username.trim() || !o.password.trim()) {
		res.status(401).send({
			message: 'INVALID_CREDENTIALS'
		});
	}

	authenticate(o)
		.then((output) => {
			if (output.token) {
				res.setHeader('x-access-token', output.token);
			}
			return res.json(output); // Note it is returing AUTH output

			/* // Now create or update User table if user exists for login count and last login time
			const UserModel = require('../models/user.model');
			const DB_CONNECTION = require('../database/database.js');
			const moment = require('moment');
			let {
				sAMAccountName,
				displayName
			} = output.details;

			UserModel.create({
				accountName: sAMAccountName.toLowerCase(),
				displayName
			}, function (err, result) {
				output.details.loginCount = result ? result.loginCount++ : 1; // For the first time creation result will be null as we are expecting last login result and not the newly created ones
				output.details.role = result ? result.role : 'unknown';
				if (!err) {
					return res.json(output); // Note it is returing AUTH output
				} else {
					return res.status(500).send(err); // 500 error
				}
			}); */
		})
		.catch((e) => {
			res.json({
				message: 'LOGIN_FAILURE',
				error: e
			});
		});
};

const authenticate = function (options) {
	let {
		username,
		password
	} = options;
	return new Promise((resolve, reject) => {
		if (!username || !password) {
			return reject({
				message: 'INVALID_CREDS'
			});
		}
		// let pTextPassword = new Buffer(password, 'base64').toString('utf8');
		let pTextPassword = password;
		let loginId = username;

		// Add domain to the userID
		// logger.WARN(new Date().toLocaleString() + ': LOGIN tried by : ' + loginId);
		username = username.replace(/@.*$/, '');
		username += '@yodlee.com';
		console.log(`${username} trying to login`);
		// if (!/@yodlee.com$/i.test(username)) {
		// }

		let opts = {
			url: CONFIG.server.ldapURL,
			baseDN: 'dc=corp,dc=yodlee,dc=com',
			username: username,
			password: pTextPassword,
			attributes: {
				user: [
					'cn',
					'displayName',
					'employeeID',
					'mail',
					'sAMAccountName',
					'whenCreated'
					// 'userPrincipalName',
					// 'lockoutTime',
					// 'pwdLastSet',
					// 'userAccountControl',
					// 'sn',
					// 'givenName',
					// 'initials',
					// 'comment',
					// 'description'
				]
			}
		};

		let ad = new ActiveDirectory(opts);
		ad.authenticate(username, pTextPassword, function (err, auth) {
			if (err) {
				// logger.WARN('Login Failed : ' + JSON.stringify(err));
				let message = 'INVALID_CREDENTIALS';
				if (err.code === 'ETIMEDOUT') {
					message = 'ETIMEDOUT';
				}
				console.log('Login Failed : ' + JSON.stringify(err));
				return reject({
					message
				});
			}

			let opts = {
				username: username,
				password: pTextPassword
			};

			if (auth) {
				ad.findUser(opts, username, function (err, details) {
					if (err) {
						// logger.WARN(username + ' : Login Failed: ' + JSON.stringify(err));
						console.log(username + ' : Login Failed: ' + JSON.stringify(err));
						return reject({
							message: 'INVALID_CREDS'
						});
					}

					if (!details) {
						// logger.WARN('User Details of ' + username + ' not found.');
						console.log('User Details of ' + username + ' not found.');
					} else {
						// logger.WARN(JSON.stringify(details));
						// logger.WARN("User details found");
					}
					console.log(new Date().toLocaleString() + ': LOGIN SUCCESS by : ' + loginId);
					// logger.WARN(new Date().toLocaleString() + ': LOGIN SUCCESS by : ' + loginId);

					// let csession = new Buffer(details.whenCreated + '-' + details.mail).toString('base64');
					// let dsession = new Buffer(details.whenCreated).toString('base64');
					// console.log(details);
					const expiryTime = 24; // in hours
					const token = jwt.sign(JSON.parse(JSON.stringify(details)), jwtKey, {
						expiresIn: expiryTime + 'h' // in hours
					});
					return resolve({
						message: 'LOGIN_SUCCESSFUL',
						details,
						token,
						expiryTime
					});

					// NOTE: First verify, and then decode
					// // verify a token symmetric
					// jwt.verify(token, jwtKey, function(err, decoded) {
					// 	console.log(decoded)
					// });
					// get the decoded payload ignoring signature, no secretOrPrivateKey needed
					// var decoded = jwt.decode(token);
				});
			} else {
				// logger.WARN(username + ' : Authentication failed!');
				console.log(username + ' : Authentication failed!');
				reject({
					message: 'INVALID_CREDS'
				});
			}
		}); // authenticate
	});
}; // Function login