const IpModel = require('../models/ip.model');
const utils = require('../utils');

const {
  CONFIG
} = require('../../config/config');

const Ip = {};
module.exports = {
  Ip
};

const fetch = require('node-fetch');

const createExcel = (filename, json) => {
  return new Promise((resolve, reject) => {
    // console.log(JSON.stringify(json, undefined, 2));
    utils.writeToExcel({
      jsonData: json,
      folder: CONFIG.processDetailsFilePath,
      filename
    }).then(r => resolve(r)).catch(e => reject(e));
  });
}

function fetchDbDetails() {
  return new Promise((resolve, reject) => {
    let query = {}; // No filter
    IpModel.get(query, function (err, result = {}) {
      if (!err) {
        if (!result) {
          result = {};
        }
        resolve(result);
      } else {
        reject(err);
      }
    });
  })
}

// Get
Ip.get = function (req, res) {
  fetchDbDetails().then(json => {
    let filename = (req.decoded.sAMAccountName || 'unknown') + '_IpDetails.xlsx';
    createExcel(filename, JSON.parse(JSON.stringify(json))).then((r) => console.log(r)).catch(e => console.log(e));
    return res.send(json);
  }).catch(e => {
    console.log(e);
    return res.status(500).send(e); // 500 error
  });
};


/**
 * 
 * content type should be : application/json
 * Raw Data should be as below - all are comma separated
 {
	"datacenters" : "sc9, uk, idc, au, malaysia, canada",
	"environments" :"production, stage",
	"mailTo" : "cgowda@yodlee.com"
}
 */

function getAllIpDiskSpace(req) {
  let apiName = "disk";
  let options = utils.getOptions(req, apiName);
  return new Promise((resolve, reject) => {
    console.log("getAllIpDiskSpace with options", JSON.stringify(options, undefined, 2));
    utils.processCommand(apiName, options).then(response => {
      console.log("getAllIpDiskSpace: Response received...");
      resolve(response);
    }).catch(e => {
      console.log("getAllIpDiskSpace: ERROR...", e);
      reject(e);
    })
  });
}

Ip.getAllIpDiskSpace = function (req, res) {
  console.log("getAllIpDiskSpace");
  getAllIpDiskSpace(req).then(json => res.send(json)).catch(e => res.status(500).send(e));
}

Ip.getSingleIpDiskSpace = function (req, res) {

}