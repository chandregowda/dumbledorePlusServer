'use strict';
const mongoose = require('mongoose');
const DB_CONNECTION = require('../database/database.js');

const Schema = mongoose.Schema;

const DatacenterSchema = new Schema({
	value: {
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true,
	},
	environment: {
		type: String,
		required: true
	}
});
DatacenterSchema.index({
	environment: 1,
	value: 1
}, {
	unique: true
});

/**
 * Schema STATIC addition which works on entire Model
 */
DatacenterSchema.statics = {
	/**
	 * Find one
	 */
	getOne: function (query, callback) {
		this.findOne(query, callback);
	},

	/**
	 * Find all
	 */
	get: function (query, callback) {
		this.find(query, callback);
	},

	updateById: function (query, updateData, callback) {
		this.update(query, {
			$set: updateData
		}, callback);
	},

	removeById: function (removeData, callback) {
		this.remove(removeData, callback);
	},

	create: function (data, callback) {
		var instance = new this(data);
		instance.save(callback);
	},
};

module.exports = mongoose.model('Datacenter', DatacenterSchema);