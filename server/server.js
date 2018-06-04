/**
 * Main file to start our node server
 */

'use strict';
const cluster = require('cluster'); // To fork the workers and make server more scalable and efficient
const {
	CONFIG
} = require('../config/config');

if (cluster.isMaster) {
	let numWorkers = require('os').cpus().length;
	if (CONFIG.server.MAX_NUMBER_OF_CPU && CONFIG.server.MAX_NUMBER_OF_CPU < numWorkers) {
		numWorkers = CONFIG.server.MAX_NUMBER_OF_CPU;
	}

	for (let i = 0; i < numWorkers; i++) {
		cluster.fork();
	}

	cluster.on('online', function (worker) {
		console.log('Worker ' + worker.process.pid + ' is online');
	});

	// If something goes wrong and the worker is killed, start new worker
	cluster.on('exit', function (worker, code, signal) {
		console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
		cluster.fork();
	});
} else {
	/**
	 * Child workers start here
	 */
	const cors = require('cors');
	const compression = require('compression');
	const bodyParser = require('body-parser');
	const parseurl = require('parseurl');
	const jwt = require('jsonwebtoken');
	const path = require('path');
	const fs = require('fs');

	const PUBLIC_FOLDER = path.resolve(__dirname, '..', CONFIG.PUBLIC_FOLDER);
	const DOWNLOADS_FOLDER = path.resolve(__dirname, '..', CONFIG.DOWNLOADS_FOLDER);
	const LOGSUMMARY_FOLDER = path.resolve(__dirname, '..', CONFIG.LOGSUMMARY_FOLDER);

	const express = require('express');
	let app = express();
	let router = express.Router();

	app.use(compression());
	app.use(cors());
	app.use(router);

	const numberOfDaysToCache = 0.5; // days
	const cacheTime = 86400000 * numberOfDaysToCache; // 1 days

	// Static folder to server index.html, logs and excels
	app.use(express.static(DOWNLOADS_FOLDER, {
		maxAge: cacheTime
	}));
	app.use(express.static(LOGSUMMARY_FOLDER, {
		maxAge: cacheTime
	}));
	app.use(express.static(PUBLIC_FOLDER, {
		maxAge: cacheTime
	}));

	app.use(function (req, res, next) {
		let ip = req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;

		let requestURL = parseurl(req);

		// console.log(username + " from " + ip + " requesting : " + JSON.stringify(requestURL));
		console.log((new Date()).toLocaleString() + " : " + ip + " requesting : " + requestURL.path);
		next();
	})

	const validateRequest = function (req, res, next) {
		// check header or url parameters or post parameters for token
		var token = req.headers['x-access-token'] || req.body.token || req.query.token;
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, CONFIG.webTokenKey, function (err, decoded) {
				if (err) {
					return res.json({
						success: false,
						message: 'Failed to authenticate token.'
					});
				} else {
					// if everything is good, save to request for use in other routes
					// console.log("Request :", decoded.displayName);
					let ip = req.headers['x-forwarded-for'] ||
						req.connection.remoteAddress ||
						req.socket.remoteAddress ||
						req.connection.socket.remoteAddress;

					let requestURL = parseurl(req);
					console.log((new Date()).toLocaleString() + " : " + decoded.displayName + " from " + ip + " requesting : " + requestURL.path);
					req.decoded = decoded;
					// console.log(JSON.stringify(req.decoded, undefined, 2));
					next();
				}
			});
		} else {
			// if there is no token
			// return an error
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}
	};

	// app.use(function(req, res, next) {
	// 	let requestURL = parseurl(req);
	// 	console.log(new Date().toLocaleString() + ` : Request for : ${requestURL}`);
	// 	next();
	// });

	router.use(bodyParser.json());
	router.use(
		bodyParser.urlencoded({
			extended: false
		})
	);

	/**load route file*/
	require('./routes/router')(router, validateRequest);

	app.use(function (req, res, next) {
		res.status(404);

		// respond with html page
		if (req.accepts('html')) {
			// res.render('404', { url: req.url });
			res.sendFile(path.resolve(PUBLIC_FOLDER, 'index.html'));
			return;
		}

		// respond with json
		if (req.accepts('json')) {
			res.send({
				error: 'Not found'
			});
			return;
		}

		// default to plain-text. send()
		res.type('txt').send('Not found');
	});

	if (CONFIG.server.protocol == 'https') {
		let _https = require('https');
		try {
			let privateKey = fs.readFileSync(path.resolve(CONFIG.server.private_key)).toString();
			let certificate = fs.readFileSync(path.resolve(CONFIG.server.certificate)).toString();
			let credentials = {
				key: privateKey,
				cert: certificate
			};
			let httpsServer = _https.createServer(credentials, app);
			httpsServer.listen(CONFIG.server.https_port || 443, (e) => {
				if (e) {
					return console.log('Failed to start server:', e);
				}
				console.log('HTTPS Server Started at port : ', CONFIG.server.https_port);
			});
			httpsServer.timeout = CONFIG.server.timeout;
		} catch (e) {
			console.log(e);
			console.log('Failed to load the privateKey and certificate');
		}
		// Listin to default HTTP port 80, and then redirect if user does not prefix URL with https
		/*	let httpServer = _http.createServer(function (req, res) {
					res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
					res.end();
			}).listen(80);*/
	} else {
		let _http = require('http');

		let httpServer = _http.createServer(app);
		let server = app.listen(CONFIG.server.port, (e) => {
			if (e) {
				return console.log('Failed to start server:', e);
			}
			console.log('HTTP Server Started at port : ', CONFIG.server.port);
		});
		server.timeout = CONFIG.server.timeout;

	}
}