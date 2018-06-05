'use strict';
const ExceptionModel = require('../models/exception.model');
const request = require('request');
const utils = require('../utils');

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

/**
 * 
 * content type should be : application/json
 * Raw Data should be as below - mailTo are COMMA separated
 * filename - should be exact path like '/var/log/jboss_instance-1/server.log'
 * searchString - text to search for like 'NullPointerException|ORA-'
 * numberOfLinesAfter - interger value like 5
 * numberOfLinesBefore - interger value like 10
 * 
 */
function getDetailedLog(req) {
  let apiName = "getDetailedLog";

  let options = utils.getOptions(req, apiName);

  if (req.body.ip && req.body.ip.trim()) {
    options += ` --ip='${req.body.ip}'`;
  }
  if (req.body.filename && req.body.filename.trim()) {
    options += ` --filename='${req.body.filename}'`;
  }
  if (req.body.searchString && req.body.searchString.trim()) {
    options += ` --searchString='${req.body.searchString}'`;
  }
  if (req.body.numberOfLinesBefore) {
    options += ` --numberOfLinesBefore='${req.body.numberOfLinesBefore}'`;
  }
  if (req.body.numberOfLinesAfter) {
    options += ` --numberOfLinesAfter='${req.body.numberOfLinesAfter}'`;
  }
  if (req.body.outputFileName) {
    options += ` --outputFileName='${req.body.outputFileName}'`;
  }
  if (req.body.logDate) {
    options += ` --logDate='${req.body.logDate}'`;
  }

  return new Promise((resolve, reject) => {
    utils.processCommand(apiName, options)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      })
  });
}; // Function getDetailedLog


Exception.generateExceptionLogFile = function (req, res) {
  console.log("Downloading Files for ", JSON.stringify(req.body, undefined, 2));

  let component = req.body.component.replace(/\s/g, '');
  let updatedIp = req.body.ip.replace(/\./g, '_');
  let generatedBy = (req.decoded && req.decoded.sAMAccountName) || 'unknown';
  let logType = /server/.test(req.body.filename) ? "server" : "core"; // [core|server]

  req.body.mailTo = generatedBy + '@yodlee.com';
  req.body.outputFileName = req.body.environment + '-' + req.body.datacenter + '-' + logType + '-' + updatedIp + '-' + req.body.instance + '-' + req.body.component.toUpperCase() + '-' + Date.now() + '-' + generatedBy + '.log.gz'; //+ '-'  + generatedBy + '-' + reason ;

  req.body.userSearchString = req.body.searchCriteria.userSearchString || req.body.searchCriteria.searchString ||
    "(xception|Could not open JDBC Connection|failed|Caused by|NoSuch|NoClassDef|\\bORA-|\\tat )+?";
  req.body.logDate = req.body.logDate || req.body.searchCriteria.logDate || (new Date()).toJSON().substring(0, 10);
  req.body.numberOfLinesBefore = req.body.numberOfLinesAfter = component === 'NODE' ? 5 : 3;


  getDetailedLog(req).then(result => {
    console.log("Extracted Log Stack trace for", JSON.stringify(req.body, undefined, 2));
    res.send(result);
  }).catch(e => {
    console.log(e);
    res.status(500).send(e);
  });
}

/* Exception.generateExceptionLogFile = function (req, res) {
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
} */