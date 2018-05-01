'use strict';
const mongoose = require('mongoose');
const CobrandModel = require('../models/cobrand.model');
const DB_CONNECTION = require('../database/database.js');
const moment = require('moment');
const request = require('request');

const Cobrand = {};
module.exports = {
  Cobrand
};

// Get
Cobrand.get = function (req, res) {
  console.log("Getting Cobrand Details...")
  let query = {}

  CobrandModel.get(query, function (err, result = {}) {
    if (!err) {
      if (!result) {
        result = {};
      }
      return res.json(result);
    } else {
      return res.status(500).send(err); // 500 error
    }
  });
};

// Delete
Cobrand.delete = function (req, res) {
  CobrandModel.removeById({
    _id: req.query.id
  }, function (err, result) {
    if (!err) {
      return res.json(result);
    } else {
      return res.status(500).send(err); // 500 error
    }
  });
};