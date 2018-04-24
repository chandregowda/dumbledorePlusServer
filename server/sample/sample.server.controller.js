'use strict';
const SampleUser = require('../models/sample.model');
const mongoose = require('mongoose');
const DB_CONNECTION = require('../database/database.js');

const Sample = {};
module.exports = { Sample };

/** Private Functions */
const getGreetingMessage = () => {
	return 'Welcome to sample app';
};

/** Public Functions */
Sample.greet = function(req, res) {
	res.send({ message: getGreetingMessage() });
};

/**
 * DB Sample Functions 
 */

// Add User
Sample.insertSampleRecord = function(req, res) {
	/**
   * Once we have our model, we can then instantiate it, and save it.
   */
	console.log('Inserting Sample record');
	let user = new SampleUser({
		firstname: 'First',
		lastname: 'last',
		age: 20,
		description: 'Something about this user',
		dob: new Date('05-Apr-1981'),
		createdOn: Date.now()
	});

	user.save(function(err) {
		if (!err) {
			console.log('Sample User inserted and saved!');
			// Now recheck users count?
			user.findAllUsersOfMyAge((ferr, users) => {
				if (!err) {
					console.log('Found users of my age including myself...');
					console.log(users);
					return res.send({ users: users, error: null });
				}
				return res.send({ message: 'ERROR: Failed to get back Sample Users!', error: ferr });
			});
		} else {
			return res.send({ message: 'ERROR: Failed to insert Sample User!', error: err });
		}
	});
};

// Delete User
Sample.deleteSampleRecord = function(req, res) {
	SampleUser.removeById({ _id: req.query.id }, function(err, result) {
		if (!err) {
			return res.json(result);
		} else {
			console.log(err);
			return res.status(500).send(err); // 500 error
		}
	});
};

// Update User
Sample.updateSampleRecord = function(req, res) {
	let query = req.query.id ? { _id: req.query.id } : {};
	SampleUser.updateById(query, req.body, function(err, result) {
		if (!err) {
			return res.json(result);
		} else {
			return res.status(500).send(err); // 500 error
		}
	});
};

// Get User
Sample.getSampleRecord = function(req, res) {
	let query = req.query.id ? { _id: req.query.id } : {};
	SampleUser.get(query, function(err, result) {
		if (!err) {
			return res.json(result);
		} else {
			return res.status(500).send(err); // 500 error
		}
	});
};

// Create User
Sample.createSampleRecord = function(req, res) {
	/* POST DATA:
  {
		"firstname": "Chandre",
		"lastname": "Gowda",
		"age": 37,
		"description": "Something about this user",
		"dob": "1981-04-05"
  }
  */

	SampleUser.create(req.body, function(err, result) {
		if (!err) {
			return res.json(result);
		} else {
			return res.status(500).send(err); // 500 error
		}
	});
};
