'use strict';
const mongoose = require('mongoose');
const ExceptionModel = require('../models/exception.model');
const DB_CONNECTION = require('../database/database.js');
const request = require('request');
const utils = require('../utils');
const moment = require('moment');

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
  let environment = filters.environments ? filters.environments[0] : null;
  let datacenter = filters.datacenters ? filters.datacenters[0] : null;

  if (filters.logType === 'access') {
    url = 'https://dumbledore.yodlee.com/capi/getApiForManyInstance';
  }

  filters.environments = environment;
  filters.datacenters = datacenter;
  filters.environment = environment;
  filters.datacenter = datacenter;

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
    let accountName = filters.mailTo ? filters.mailTo.replace(/@.*$/, '') : 'unknown';
    let logDate = filters.searchDate || filters.logDate || moment().format('YYYY-MM-DD');
    let trackingID = Date.now();
    let logFolder = './public/logSummary/';
    let excelFileName = `${environment}_${datacenter}_${filters.logType}_${logDate}_${accountName}_${trackingID}.xlsx`;
    let saveOptions = {
      accountName,
      summary: result,
      excelFileName: logFolder + excelFileName,
      filters
    };
    if (result && result.length) {

      utils.writeToExcel({
        jsonData: result,
        folder: './public/logSummary/',
        filename: excelFileName
      }).then(outputExcelFile => {
        saveExceptionSummary(saveOptions).then(d => {
          console.log('Successfully saved Log Summary')
          res.send(saveOptions);
        }).catch(e => {
          console.log(e)
          return res.send(e)
        });
      }).catch(e => {
        console.log(e)
        return res.send(e)
      });
    }
    // }

  })
};