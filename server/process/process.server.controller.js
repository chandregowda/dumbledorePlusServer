const {
  CONFIG
} = require('../../config/config');
const ProcessModel = require('../models/process.model');

const Process = {};

module.exports = {
  Process
};

const fetch = require('node-fetch');

const createExcel = (filename, json) => {
  return new Promise((resolve, reject) => {
    const utils = require('../utils');
    // console.log(JSON.stringify(json, undefined, 2));
    utils.writeToExcel({
      jsonData: json,
      folder: CONFIG.processDetailsFilePath,
      filename
    }).then(r => resolve(r)).catch(e => reject(e));
  });
}

function fetchProcessDetails() {
  return new Promise((resolve, reject) => {
    let query = {}; // No filter
    ProcessModel.get(query, function (err, result = {}) {

      if (!err) {
        if (!result) {
          result = {};
        }
        resolve(result);
      } else {
        reject(err); // 500 error
      }
    });
  });
}

// Get
Process.get = function (req, res) {
  fetchProcessDetails().then(json => {
    let filename = (req.decoded.sAMAccountName || 'unknown') + '_ProcessDetails.xlsx';
    createExcel(filename, JSON.parse(JSON.stringify(json))).then((r) => console.log(r)).catch(e => console.log(e));
    return res.send(json);
  }).catch(e => {
    console.log(e);
    return res.status(500).send(e); // 500 error
  });
};
// let query = {}; // No filter
// ProcessModel.get(query, function (err, result = {}) {

//   if (!err) {
//     if (!result) {
//       result = {};
//     }

//     let json = typeof result === 'string' ? JSON.parse(result) : result;
//     let filename = (req.decoded.sAMAccountName || 'unknown') + '_ProcessDetails.xlsx';
//     createExcel(filename, JSON.parse(JSON.stringify(json))).then((r) => console.log(r)).catch(e => console.log(e));
//     return res.send(json);
//   } else {
//     return res.status(500).send(err); // 500 error
//   }
// });

// Get
Process.getAllProcess = function (req, res) {
  fetchProcessDetails().then(json => {
    return res.send(json);
  }).catch(e => {
    console.log(e);
    return res.status(500).send(e); // 500 error
  });
};