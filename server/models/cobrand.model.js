'use strict';
const mongoose = require('mongoose');
const DB_CONNECTION = require('../database/database.js');

const Schema = mongoose.Schema;

const CobrandSchema = new Schema({
  cobrandGroup: {
    type: String,
    required: true
  },
  cobrandName: {
    type: String,
    required: true
  },
  cobrandId: {
    type: String,
    required: true
  }
});
CobrandSchema.index({
  cobrandGroup: 1,
  cobrandName: 1,
  cobrandId: 1
}, {
  unique: true
});

/**
 * Schema STATIC addition which works on entire Model
 */
CobrandSchema.statics = {
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
    this.update(
      query, {
        $set: updateData
      },
      callback
    );
  },

  removeById: function (removeData, callback) {
    this.remove(removeData, callback);
  },

  create: function (data, callback) {
    var instance = new this(data);
    instance.save(callback);
  }
};

module.exports = mongoose.model('Cobrand', CobrandSchema);