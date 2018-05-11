'use strict';
const mongoose = require('mongoose');
const ExceptionModel = require('../models/exception.model');
const DB_CONNECTION = require('../database/database.js');
const request = require('request');

const Scanner = {};
module.exports = {
  Scanner
};

function saveExceptionSummary(body) {
  return new Promise((resolve, reject) => {
    ExceptionModel.create(body, function (err, result) {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
};

Scanner.getLogSummary = function (req, res) {
  // console.log("Log Exception summary in getLogSummary")

  let filters = req.body;
  // console.log(JSON.stringify(req.body, undefined, 2))
  // REMOVE THE BELOW DUMMY RETURN
  // return res.json({
  //   message: "Scanned Output"
  // })

  let url = 'https://dumbledore.yodlee.com/capi/getComponentExceptionSummary';
  if (filters.logType === 'access') {
    url = 'https://dumbledore.yodlee.com/capi/getApiForManyInstance';
    filters.environments = filters.environments ? filters.environments[0] : null;
    filters.datacenters = filters.datacenters ? filters.datacenters[0] : null;
  } else {
    filters.environment = filters.environments ? filters.environments[0] : null;
    filters.datacenter = filters.datacenters ? filters.datacenters[0] : null;
  }


  let requestTimeOut = 1000 * 60 * 60; // 1hr
  var options = {
    method: 'post',
    body: filters,
    json: true,
    url: url,
    timeout: requestTimeOut
  }


  request(options, function (err, httpRes, result) {
    if (err) {
      console.error('error posting json: ', err)
      res.status(400).send(err)
    }

    // if (filters.logType === 'access') {
    //   console.log("Have to save API result in DB");
    // } else {
    if (result && result.length) {
      saveExceptionSummary({
        accountName: filters.mailTo ? filters.mailTo.replace(/@.*$/, '') : 'unknown',
        summary: result,
        filters
      }).then(d => console.log('Successfully saved Log Summary')).catch(e => console.log(e))
    }
    // }

    res.send(result);
  })
};