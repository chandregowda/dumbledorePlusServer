'use strict';
const mongoose = require('mongoose');
const DownloadModel = require('../models/download.model');
const DB_CONNECTION = require('../database/database.js');
const moment = require('moment');

const Download = {};
module.exports = {
  Download
};

Download.create = function (req, res) {
  console.log("Creating Download with ", req.body)
  DownloadModel.create(req.body, function (err, result) {
    if (!err) {
      console.log("Download Created")
      if (!result) {
        // First time downloads upsert not returning previous record
        // Fetch newly stored downloads data
        result = {
          message: 'NEW_DOWNLOAD',
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
Download.get = function (req, res) {
  let query = req.query.accountName && req.query.accountName.trim() ? {
    accountName: req.query.accountName.trim()
  } : {};
  if (req.query.id && req.query.id.trim()) {
    query._id = req.query.id.trim();
  }

  DownloadModel.get(query, function (err, result = {}) {
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
Download.delete = function (req, res) {
  DownloadModel.removeById({
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
Download.update = function (req, res) {
  let query = req.query.id ? {
    _id: req.query.id
  } : {};
  DownloadModel.updateById(query, req.body, function (err, result) {
    if (!err) {
      return res.json(result);
    } else {
      return res.status(500).send(err); // 500 error
    }
  });
};