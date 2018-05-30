'use strict';
const mongoose = require('mongoose');
const UserModel = require('../models/user.model');
const DB_CONNECTION = require('../database/database.js');
const moment = require('moment');

const User = {};
module.exports = {
	User
};

// Create
// {
// 	"data": {
// 		"accountName": "cgowda",
// 		"displayName": "Chandre Gowda"
// 	}
// }

User.create = function (req, res) {
	console.log("Creating User with ", req.body.data)
	UserModel.create(req.body.data, function (err, result) {
		if (!err) {
			console.log("User Created")
			if (!result) {
				// First time user upsert not returning previous record
				// Fetch newly stored user data
				result = {
					message: 'NEW_USER',
					details: req.body.data
				}
			}
			return res.json(result);
		} else {
			return res.status(500).send(err); // 500 error
		}
	});
};

// Get
User.get = function (req, res) {
	let query = req.query.accountName && req.query.accountName.trim() ? {
		accountName: req.query.accountName.trim()
	} : {};
	if (req.query.id && req.query.id.trim()) {
		query._id = req.query.id.trim();
	}

	UserModel.get(query, function (err, result = {}) {
		if (!err) {
			if (!result) {
				result = {};
			}
			return res.json(result);
		} else {
			return res.status(500).send(err); // 500 error
		}
	});
};

// Delete
User.delete = function (req, res) {
	UserModel.removeById({
		_id: req.query.id,
		owner: req.query.owner
	}, function (err, result) {
		if (!err) {
			return res.json(result);
		} else {
			return res.status(500).send(err); // 500 error
		}
	});
};

// Update
User.update = function (req, res) {
	let query = req.query.id ? {
		_id: req.query.id
	} : {};
	UserModel.updateById(query, req.body, function (err, result) {
		if (!err) {
			return res.json(result);
		} else {
			return res.status(500).send(err); // 500 error
		}
	});
};