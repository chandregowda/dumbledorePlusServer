'use strict';
const mongoose = require('mongoose');
// const DB_CONNECTION = require('../database/database.js');

const Schema = mongoose.Schema;
// let helper = require('../helper');

// "SORTABLE_IP": 172017022152,
// "ip": "172.17.22.152",
// "hostname": "APP-01",
// "environment": "production",
// "datacenter": "sc9",
// "type": "Front End",
// "port": 8843,
// "instance": 5,
// "component": "YSL",
// "cobrandGroup": "production",
// "build": "394-7b-npr",
// "processStartDate": "Fri Dec 22 2017",
// "processStartTime": "01:31:07",
// "userStartingProcess": "sdp",
// "deploymentMethod": "sdp",
// "jreNodeVersion": "jre1.7.0_65",
// "pid": 23876,
// "command": "somecommand",
// "timestamp": 1513935067000,
// "timeTakenToStart": "06m:38s",
// "successStatus": ""


var ProcessSchema = new Schema({
  "SORTABLE_IP": {
    type: Number,
    default: 0
  },
  "ip": {
    type: String,
    required: true
  },
  "pid": {
    type: Number,
    required: true
  },
  "component": {
    type: String,
    required: true
  },
  "instance": {
    type: Number,
    default: 0
  },
  "hostname": {
    type: String
  },
  "environment": {
    type: String,
    required: true
  },
  "datacenter": {
    type: String,
    required: true
  },
  "type": {
    type: String,
    required: true
  },
  "port": {
    type: Number,
    default: 0
  },
  "cobrandGroup": {
    type: String
  },
  "build": {
    type: String
  },
  "processStartDate": {
    type: String,
    required: true
  },
  "processStartTime": {
    type: String,
    required: true
  },
  "userStartingProcess": {
    type: String,
    required: true
  },
  "deploymentMethod": {
    type: String,
    required: true
  },
  "jreNodeVersion": {
    type: String,
    required: true
  },
  "command": {
    type: String,
    required: true
  },
  "timestamp": {
    type: Number,
    default: 0,
    required: true
  },
  "timeTakenToStart": {
    type: String
  },
  "successStatus": {
    type: String
  },
  "generatedOn": {
    type: Number,
    default: 0,
    required: true
  }
});

ProcessSchema.index({
  ip: 1,
  component: 1,
  instance: 1,
  port: 1
}, {
  unique: true
});

/**
 * Schema STATIC addition which works on entire Model
 */
ProcessSchema.statics = {
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
        "environment": 1,
        "datacenter": 1,
        "SORTABLE_IP": 1
      }
    }, callback)
  },
};

module.exports = mongoose.model('PROCESS', ProcessSchema);