'use strict';
const mongoose = require('mongoose');
const DB_CONNECTION = require('../database/database.js');
const moment = require('moment');

const Schema = mongoose.Schema;
const DownloadSchema = new Schema({
  environment: {
    type: String,
    required: true
  },
  datacenter: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  instance: {
    type: Number,
    required: true
  },
  component: {
    type: String,
    default: true
  },
  extractedFile: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  logFileDate: {
    type: String,
    required: true
  },
  generatedBy: {
    type: String,
    required: true
  }
});
DownloadSchema.index({
  ip: 1,
  instance: 1,
  component: 1
}, {
  unique: false
});

DownloadSchema.statics = {
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
    var instance = new this(data);
    instance.save(callback);
  }

  // create: function (data, callback) {
  //   let updateObj = { ...data
  //   };
  //   this.findOneAndUpdate({
  //       accountName: updateObj.accountName
  //     },
  //     updateObj, {
  //       upsert: true,
  //       new: true // set it to false to get the old record
  //     },
  //     function (err, model) {
  //       return callback(err, model);
  //     }
  //   );
  // }
};

module.exports = mongoose.model('Download', DownloadSchema);