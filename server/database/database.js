/**
 * Database connection established in this file
 */
'use strict';

const { CONFIG } = require('../../config/config');

const mongoose = require('mongoose');

const connectionURL = CONFIG.database.url || 'mongodb://127.0.0.1:27017/sample';

// console.log('DB Connecting to URL: ', connectionURL);

// Establish DB connection
mongoose
	.connect(CONFIG.database.url)
	.then(() => {
		console.log('DB Connected successfully.');
	})
	.catch((e) => {
		console.log('Failed ot connect to DB', e);
	});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'DB Connection error'));

db.once('open', () => {
	console.log('Connection Opened with database.');
});

module.exports = { DB_CONNECTION: db };
