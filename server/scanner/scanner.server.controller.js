'use strict';
const ExceptionModel = require('../models/exception.model');
const request = require('request');
const utils = require('../utils');
const moment = require('moment');
const path = require('path');

const {
  CONFIG
} = require('../../config/config');

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
}

function getApiForManyInstance(filters) {
  console.log("Inside getApiForManyInstance", JSON.stringify(filters, undefined, 2));

  return new Promise((resolve, reject) => {
    resolve({
      message: 'Inside getApiForManyInstance'
    });
  });
}


function getExceptionSummaryOptions(query) {
  let options = "";
  // --component="RESTSERVER" --deploymentMethod="sdp" --ip='172.17.22.172' --instance="4"  --searchDate='2017-12-10' 
  if (query.component && typeof (query.component) === "string" && query.component.trim()) {
    options += ` --component='${query.component}'`;
  }
  if (query.deploymentMethod && typeof (query.deploymentMethod) === "string" && query.deploymentMethod.trim()) {
    options += ` --deploymentMethod='${query.deploymentMethod}'`;
  }
  if (query.ip && typeof (query.ip) === "string" && query.ip.trim()) {
    options += ` --ip='${query.ip}'`;
  }
  if (query.instance) {
    options += ` --instance=${query.instance}`;
  }
  if (query.searchDate && typeof (query.mailTo) === "string" && query.searchDate.trim()) {
    options += ` --searchDate='${query.searchDate}'`;
  }
  if (query.searchString && query.searchString.trim()) {
    let searchString = query.searchString;
    searchString = searchString.replace(/'/g, ".");
    options += ` --searchString='${searchString}'`;
  }
  if (query.logType && query.logType.trim()) {
    options += ` --logType='${query.logType}'`;
  }
  if (query.logPath && query.logPath.trim()) {
    options += ` --logPath='${query.logPath}'`;
  }
  return options;
} // Function getExceptionSummaryOptions

function getSingleInstanceExceptionSummary(params) {
  let trackingId = Date.now();

  let apiName = 'getExceptionSummaryForSingleInstance';

  let options = ` --${apiName} --trackingId=${trackingId}` + getExceptionSummaryOptions(params);

  return new Promise((resolve, reject) => {
    utils.processCommand(apiName, options)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

function getComponentExceptionSummary(filters) {
  console.log("Inside getComponentExceptionSummary", JSON.stringify(filters, undefined, 2));
  return new Promise((resolve, reject) => {
    let trackingId = Date.now();

    let {
      mailTo,
      environments,
      datacenters,
      searchDate,
      searchString,
      logType,
      logPath,
      processInfo
    } = filters;

    let requestCount = 0;
    let responseCount = 0;
    let finalResult = [];
    console.log("Number of Process to scan ...", processInfo.length);

    processInfo.forEach((process) => {
      requestCount++;
      let {
        ip,
        instance,
        component,
        deploymentMethod
      } = process;

      console.log(
        `[${requestCount}]: Sending Log Scan request for ${environments[0]} ${datacenters[0]} ${ip} ${instance} ${component} ${deploymentMethod}`
      );
      getSingleInstanceExceptionSummary({
          mailTo,
          searchDate,
          searchString,
          logType,
          logPath,
          ip,
          instance,
          component,
          deploymentMethod,
          environment: environments[0],
          datacenter: datacenters[0]
        })
        .then((result) => {
          responseCount++;
          console.log(`[${trackingId}]SCAN Result :`, JSON.stringify(result, undefined, 2));
          finalResult = finalResult.concat(JSON.parse(result));
          checkForComplete();
        })
        .catch((e) => {
          responseCount++;
          checkForComplete();
        });
    });

    function checkForComplete() {
      console.log(
        `[${responseCount}/${requestCount}]: [${trackingId}] [${finalResult.length}] Received Log Scan request`
      );
      if (responseCount >= requestCount) {
        resolve(finalResult);
      }
    }
  });
};

Scanner.getLogSummary = function (req, res) {
  let trackingId = Date.now();

  let filters = req.body;

  let environment = filters.environments ? filters.environments[0] : null;
  let datacenter = filters.datacenters ? filters.datacenters[0] : null;
  let accountName = filters.mailTo ? filters.mailTo.replace(/@.*$/, '') : (req.decoded.sAMAccountName || 'unknown');

  filters.environments = environment;
  filters.datacenters = datacenter;
  filters.environment = environment;
  filters.datacenter = datacenter;
  filters.mailTo = accountName;
  filters.trackingId = trackingId;

  let functionToCall = filters.logType === 'access' ? getApiForManyInstance : getComponentExceptionSummary;

  functionToCall(filters)
    .then((result) => {
      console.log('Response for log Summary received', result);
      let logDate = filters.searchDate || filters.logDate || moment().format('YYYY-MM-DD');
      let trackingID = Date.now();
      let logFolder = path.resolve(__dirname, '../../', CONFIG.LOGSUMMARY_FOLDER);
      let excelFileName = `${environment}_${datacenter}_${filters.logType}_${logDate}_${accountName}_${trackingID}.xlsx`;
      let saveOptions = {
        accountName,
        summary: result,
        excelFileName: logFolder + excelFileName,
        filters
      };
      if (result && result.length) {
        utils
          .writeToExcel({
            jsonData: result,
            folder: logFolder,
            filename: excelFileName
          })
          .then((outputExcelFile) => {
            console.log('Log Summary Excel File "', outputExcelFile, '" written');
            saveExceptionSummary(saveOptions)
              .then((d) => {
                console.log('Successfully saved Log Summary into DB');
                return res.send(saveOptions);
              })
              .catch((e) => {
                console.log(e);
                return res.send(e);
              });
          })
          .catch((e) => {
            console.log(e);
            return res.send(e);
          });
      }
    })
    .catch((e) => {
      console.log(e);
      console.error('Error scanning Logs: ', e);
      return res.status(400).send(e);
    });
}; // getLogSummary