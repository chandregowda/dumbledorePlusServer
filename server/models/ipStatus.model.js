'use strict';
const mongoose = require('mongoose');
// const DB_CONNECTION = require('../database/database.js');

const Schema = mongoose.Schema;
// let helper = require('../helper');

const IpStatusSchema = new Schema({
  "ip": {
    type: String,
    required: true,
    unique: true
  },
  "status": {
    type: String,
    default: 'FAILED'
  },
  "hostname": {
    type: String,
    default: 'unknown host'
  },
  "environment": {
    type: String,
    default: 'unknown env'
  },
  "datacenter": {
    type: String,
    default: 'unknown datacenter'
  },
  "type": {
    type: String,
    default: 'unknown type'
  },
  "createdOn": {
    type: Date,
    default: Date.now()
  }
});

IpStatusSchema.index({
  ip: 1
}, {
  unique: true
});

/**
 * Schema STATIC addition which works on entire Model
 */
IpStatusSchema.statics = {
  /**
   * Find all
   */
  get: function (query, callback) {
    // helper.logMessage("***************** IN DB MODEL IP GET **********");
    this.find(query, {}, {
      sort: {
        "_id": 1, // Sort by ascending order
      }
    }, callback)
  }
};


module.exports = mongoose.model('IpStatus', IpStatusSchema);