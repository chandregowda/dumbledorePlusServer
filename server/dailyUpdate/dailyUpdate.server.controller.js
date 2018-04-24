'use strict';
const mongoose = require('mongoose');
const DailyUpdateModel = require('../models/dailyUpdate.model');
const DB_CONNECTION = require('../database/database.js');

const DailyUpdate = {};
module.exports = { DailyUpdate };

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
DailyUpdate.create = function(req, res) {
	DailyUpdateModel.create(req.body, function(err, result) {
		if (!err) {
			return res.json(result);
		} else {
			return res.status(500).send(err); // 500 error
		}
	});
};

// Get
DailyUpdate.get = function(req, res) {
	// let query = req.query.id ? { _id: req.query.id } : {};
	let query = {},
		rooomList = [ 'dummy' ]; // Make sure it wont fetch all rooms data

	if (req.query.accountName && req.query.accountName.trim()) {
		query.accountName = req.query.accountName.trim();
	}
	if (req.query.teamRooms && req.query.teamRooms.trim() !== '') {
		rooomList = req.query.teamRooms.split(',');
	}

	query.teamRoom = { $in: rooomList };

	if (parseInt(req.query.startDate) && parseInt(req.query.endDate)) {
		query.createdAt = {
			$gte: parseInt(req.query.startDate),
			$lte: parseInt(req.query.endDate)
		};
	} else if (parseInt(req.query.createdAt)) {
		query.createdAt = parseInt(req.query.createdAt);
	}

	console.log(query);
	DailyUpdateModel.get(query, function(err, result = {}) {
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
DailyUpdate.delete = function(req, res) {
	DailyUpdateModel.removeById({ _id: req.query.id, accountName: req.query.accountName }, function(err, result) {
		if (!err) {
			return res.json(result);
		} else {
			console.log(err);
			return res.status(500).send(err); // 500 error
		}
	});
};

// Update
DailyUpdate.update = function(req, res) {
	let query = req.query.id ? { _id: req.query.id } : {};
	DailyUpdateModel.updateById(query, req.body, function(err, result) {
		if (!err) {
			return res.json(result);
		} else {
			return res.status(500).send(err); // 500 error
		}
	});
};
