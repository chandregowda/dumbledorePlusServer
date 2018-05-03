'use strict';
const mongoose = require('mongoose');
const DB_CONNECTION = require('../database/database.js');
const moment = require('moment');

const Schema = mongoose.Schema;
const OutingSchema = new Schema({
  accountName: {
    type: String,
    required: true,
    default: 'unknown'
  },
  displayName: {
    type: String,
    required: true,
    default: 'Unknown Name'
  },
  attending: {
    type: Boolean,
    default: true
  },
  contactNumber: {
    type: Number,
    default: '100'
  },
  pickupPoint: {
    type: String,
    required: true,
    default: 'Not Required'
  }
});
OutingSchema.index({
  accountName: 1
}, {
  unique: true
});

OutingSchema.statics = {
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
        "displayName": 1
      }
    }, callback)
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
    let updateObj = { ...data
    };
    this.findOneAndUpdate({
        accountName: updateObj.accountName
      },
      updateObj, {
        upsert: true,
        new: true // set it to false to get the old record
      },
      function (err, model) {
        return callback(err, model);
      }
    );
  }
};

module.exports = mongoose.model('Outing', OutingSchema);