'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IpSchema = new Schema({
  "SORTABLE_IP": {
    type: Number,
    required: true,
    unique: true
  },
  "ip": {
    type: String,
    required: true,
    unique: true
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
  "hostname": {
    type: String,
    default: 'unknown host'
  },
  "processes": {
    type: Number,
    default: 0
  },
  "os": {
    type: String,
    default: 'unknown os'
  },
  "kernel": {
    type: String,
    default: 'unknown kernel'
  },
  "NumberOfCpu": {
    type: Number,
    default: 0
  },
  "bios": {
    type: String,
    default: 'unknown bios'
  },
  "MemTotal": {
    type: String,
    default: 'unknown MemTotal'
  },
  "createdOn": {
    type: Date,
    default: Date.now()
  }
});

IpSchema.index({
  ip: 1
}, {
  unique: true
});

/**
 * Schema STATIC addition which works on entire Model
 */
IpSchema.statics = {
  /**
   * Find all
   */
  get: function (query, callback) {
    this.find(query, {}, {
      sort: {
        "environment": 1,
        "datacenter": 1,
        "SORTABLE_IP": 1
      }
    }, callback)
  }
};

module.exports = mongoose.model('IpDetail', IpSchema);