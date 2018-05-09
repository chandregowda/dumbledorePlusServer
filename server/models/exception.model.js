'use strict';
const mongoose = require('mongoose');
const DB_CONNECTION = require('../database/database.js');
const moment = require('moment');

const Schema = mongoose.Schema;
const ExceptionSchema = new Schema({
  accountName: {
    type: String,
    required: true,
    default: 'unknown'
  },
  createdAt: {
    type: Number,
    default: moment().startOf('date')
  },
  summary: {
    type: Object,
    default: '{}'
  },
  filters: Object
});
ExceptionSchema.index({
  accountName: 1
});

ExceptionSchema.statics = {
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
    this.find(query, {}, {
      sort: {
        "_id": -1, // Sort by descending order
      },
      limit: 50
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

module.exports = mongoose.model('Exception', ExceptionSchema);