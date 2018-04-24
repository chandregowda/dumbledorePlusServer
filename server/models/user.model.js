'use strict';
const mongoose = require('mongoose');
const DB_CONNECTION = require('../database/database.js');
const moment = require('moment');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
	accountName: { type: String, required: true, default: 'unknown' },
	displayName: { type: String, required: true, default: 'Unknown Name' },
	lastLogin: { type: Number, default: moment().format('x') },
	loginCount: { type: Number, default: -1 },
	role: { type: String, default: 'unknown' } // perf, app_qa, api_qa, app_dev, api_dev, pdm, yso
});
UserSchema.index({ accountName: 1 }, { unique: true });

UserSchema.statics = {
	/**
   * Find one
   */
	getOne: function(query, callback) {
		this.findOne(query, callback);
	},

	/**
   * Find all
   */
	get: function(query, callback) {
		this.find(query, callback);
	},

	updateById: function(query, updateData, callback) {
		this.update(query, { $set: updateData }, callback);
	},

	removeById: function(removeData, callback) {
		this.remove(removeData, callback);
	},

	create: function(data, callback) {
		let updateObj = { ...data, lastLogin: moment().format('x'), $inc: { loginCount: 1 } };
		this.findOneAndUpdate(
			{
				accountName: updateObj.accountName
			},
			updateObj,
			{
				upsert: true,
				new: false // get the old record by setting it to false, else you wil not get the lastlogin date
			},
			function(err, model) {
				return callback(err, model);
			}
		);
	}
};

module.exports = mongoose.model('User', UserSchema);
