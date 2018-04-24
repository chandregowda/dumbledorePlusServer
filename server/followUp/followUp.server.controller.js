'use strict';
const mongoose = require('mongoose');
const FollowUpModel = require('../models/followup.model');
const DB_CONNECTION = require('../database/database.js');

const FollowUp = {};
module.exports = { FollowUp };

// Create
// {
// 	"createdAt": "1522261615021",
// 	"displayName": "Chandre Gowda",
// 	"obstacles": "dsfasdf",
// 	"teamRoom": "agni",
// 	"today": "dasdfasd",
// 	"accountName": "cgowda",
// 	"yesterday": "asdasdfas"
// }
FollowUp.create = function(req, res) {
	FollowUpModel.create(req.body, function(err, result) {
		if (!err) {
			return res.json(result);
		} else {
			return res.status(500).send(err); // 500 error
		}
	});
};

// Get
FollowUp.get = function(req, res) {
	// let query = req.query.id ? { _id: req.query.id } : {};
	let query = {};

	if (req.query.teamRoom && req.query.teamRoom.trim() !== '') {
		query.teamRoom = req.query.teamRoom;
	}
	if (req.query.status && req.query.status.trim() !== '') {
		query.status = req.query.status;
	}
	console.log('Query: ', query);
	FollowUpModel.get(query, function(err, result = {}) {
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
FollowUp.delete = function(req, res) {
	FollowUpModel.removeById({ _id: req.query.id, accountName: req.query.accountName }, function(err, result) {
		if (!err) {
			return res.json(result);
		} else {
			console.log(err);
			return res.status(500).send(err); // 500 error
		}
	});
};

// Update
FollowUp.update = function(req, res) {
	let query = req.query.id ? { _id: req.query.id } : {};
	FollowUpModel.updateById(query, req.body, function(err, result) {
		if (!err) {
			return res.json(result);
		} else {
			return res.status(500).send(err); // 500 error
		}
	});
};
