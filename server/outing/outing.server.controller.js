'use strict';
const mongoose = require('mongoose');
const OutingModel = require('../models/outing.model');
const DB_CONNECTION = require('../database/database.js');
const moment = require('moment');

const Outing = {};
module.exports = {
  Outing
};

// Create
// {
// 	"data": {
// 		"accountName": "cgowda",
// 		"displayName": "Chandre Gowda"
// 	}
// }

Outing.create = function (req, res) {
  console.log("Creating Outing with ", req.body)
  OutingModel.create(req.body, function (err, result) {
    if (!err) {
      console.log("Outing Created")
      if (!result) {
        // First time outing upsert not returning previous record
        // Fetch newly stored outing data
        result = {
          message: 'NEW_USER',
          details: { ...req.body
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
Outing.get = function (req, res) {
  let query = req.query.accountName && req.query.accountName.trim() ? {
    accountName: req.query.accountName.trim()
  } : {};
  if (req.query.id && req.query.id.trim()) {
    query._id = req.query.id.trim();
  }

  OutingModel.get(query, function (err, result = {}) {
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
Outing.delete = function (req, res) {
  OutingModel.removeById({
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
Outing.update = function (req, res) {
  let query = req.query.id ? {
    _id: req.query.id
  } : {};
  OutingModel.updateById(query, req.body, function (err, result) {
    if (!err) {
      return res.json(result);
    } else {
      return res.status(500).send(err); // 500 error
    }
  });
};