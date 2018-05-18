'use strict';
const mongoose = require('mongoose');
const ExceptionModel = require('../models/exception.model');
const DB_CONNECTION = require('../database/database.js');
const moment = require('moment');
const request = require('request');

const Exception = {};
module.exports = {
  Exception
};

// Get
Exception.get = function (req, res) {
  let query = req.query.accountName && req.query.accountName.trim() ? {
    accountName: req.query.accountName.trim()
  } : {};
  if (req.query.id && req.query.id.trim()) {
    query._id = req.query.id.trim();
  }

  ExceptionModel.get(query, function (err, result = {}) {
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
Exception.delete = function (req, res) {
  ExceptionModel.removeById({
    _id: req.query.id || req.body.accountName,
    accountName: req.query.accountName || req.body.accountName
  }, function (err, result) {
    if (!err) {
      return res.json(result);
    } else {
      return res.status(500).send(err); // 500 error
    }
  });
};

Exception.generateExceptionLogFile = function (req, res) {
  // console.log("Downloading Files for ", JSON.stringify(req.body, undefined, 2));

  let requestTimeOut = 1000 * 60 * 60; // 1hr
  var url = 'https://dumbledore.yodlee.com/generateExceptionLogFile';
  var options = {
    method: 'post',
    body: req.body,
    json: true,
    url: url,
    timeout: requestTimeOut
  }
  request(options, function (err, httpRes, result) {
    if (err) {
      console.error('error posting json: ', err)
      res.status(400).send(err)
    }
    res.send(result);
  });
  // return res.json(req.body)
}