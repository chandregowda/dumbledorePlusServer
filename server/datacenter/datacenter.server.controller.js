'use strict';
const mongoose = require('mongoose');
const DatacenterModel = require('../models/datacenter.model');
const DB_CONNECTION = require('../database/database.js');
const moment = require('moment');

const Datacenter = {};
module.exports = {
  Datacenter
};

// Create
// {
// 	"data": {
// 		"accountName": "cgowda",
// 		"displayName": "Chandre Gowda"
// 	}
// }

Datacenter.create = function (req, res) {
  console.log("Creating Datacenter with ", req.body.data)
  DatacenterModel.create(req.body.data, function (err, result) {
    if (!err) {
      console.log("Datacenter Created")
      if (!result) {
        // First time datacenter upsert not returning previous record
        // Fetch newly stored datacenter data
        result = {
          message: 'NEW_USER',
          details: { ...req.body.data
          }
        }
      }
      return res.json(result);
    } else {
      return res.status(500).send(err); // 500 error
    }
  });
};

// Get
Datacenter.get = function (req, res) {
  let query = req.query.accountName && req.query.accountName.trim() ? {
    accountName: req.query.accountName.trim()
  } : {};
  if (req.query.id && req.query.id.trim()) {
    query._id = req.query.id.trim();
  }

  DatacenterModel.get(query, function (err, result = {}) {
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
Datacenter.delete = function (req, res) {
  DatacenterModel.removeById({
    _id: req.query.id,
    owner: req.query.owner
  }, function (err, result) {
    if (!err) {
      return res.json(result);
    } else {
      return res.status(500).send(err); // 500 error
    }
  });
};

// Update
Datacenter.update = function (req, res) {
  let query = req.query.id ? {
    _id: req.query.id
  } : {};
  DatacenterModel.updateById(query, req.body, function (err, result) {
    if (!err) {
      return res.json(result);
    } else {
      return res.status(500).send(err); // 500 error
    }
  });
};