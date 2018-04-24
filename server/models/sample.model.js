/**
 * Sample DB schema
 */
'use strict';
const mongoose = require('mongoose');
const DB_CONNECTION = require('../database/database.js');

const Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
/**
* @module SampleUserSchema
* @description contain the details of user.
*/
const SampleUserSchema = new Schema({
	// user: ObjectId,
	firstname: { type: String, required: true },
	lastname: { type: String, default: '', trim: true, lowercase: true },
	description: String,
	age: { type: Number, min: 18, index: true },
	dob: Date,
	createdOn: { type: Date, default: Date.now },
	userId: {
		type: Number,
		index: {
			unique: true,
			dropDups: true
		}
	}
});
SampleUserSchema.index({ firstname: 1, dob: -1 }); // schema level
SampleUserSchema.set('autoIndex', false); // To imporve performance unset autoIndex

/**
 * You can set virtual field which does not exists in acutal Model, but can be used in queries
 * For Ex: Instead of concating 2 fields every time you can use virtual single filed
 *  > console.log(user.firstname + ' ' + user.lastname);
 * can be replaced with 
 *  > console.log(user.fullName);
 */
SampleUserSchema.virtual('fullName').get(function() {
	return this.name.first + ' ' + this.name.last;
});
SampleUserSchema.set('toJSON', { getters: true, virtuals: false }); // This is required if you nee

/**
 * Schema METHOD addition which works on INSTANCE level
 */
SampleUserSchema.methods.findAllUsersOfMyAge = function(cb) {
	console.log('Finding users of my Age: ', this.age);
	return this.model('SampleUser').find({ age: this.age }, cb);
};

/**
 * Schema STATIC addition which works on entire Model
 */
SampleUserSchema.statics = {
	/**
   * Find one uses
   */
	get: function(query, callback) {
		this.findOne(query, callback);
	},

	/**
   * Find all users
   */
	getAll: function(query, callback) {
		this.find(query, callback);
	},

	updateById: function(query, updateData, callback) {
		this.update(query, { $set: updateData }, callback);
	},

	removeById: function(removeData, callback) {
		this.remove(removeData, callback);
	},

	create: function(data, callback) {
		var company = new this(data);
		company.save(callback);
	}
};

/** 
 * The first argument is the singular name of the collection your model is for.
 * Mongoose automatically looks for the plural version of your model name.
 * For Ex: 'SampleUser' will be stored as 'sampleusers' in the Database.
 */
module.exports = mongoose.model('SampleUser', SampleUserSchema);
