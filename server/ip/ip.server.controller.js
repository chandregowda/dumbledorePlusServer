const IpModel = require('../models/ip.model');

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
    const utils = require('../utils');
    // console.log(JSON.stringify(json, undefined, 2));
    utils.writeToExcel({
      jsonData: json,
      folder: CONFIG.processDetailsFilePath,
      filename
    }).then(r => resolve(r)).catch(e => reject(e));
  });
}

// Get
Ip.get = function (req, res) {
  let query = {}; // No filter
  IpModel.get(query, function (err, result = {}) {

    if (!err) {
      if (!result) {
        result = {};
      }
      let json = typeof result === 'string' ? JSON.parse(result) : result;
      let filename = (req.decoded.sAMAccountName || 'unknown') + '_IpDetails.xlsx';
      createExcel(filename, JSON.parse(JSON.stringify(json))).then((r) => console.log(r)).catch(e => console.log(e));
      return res.send(json);
    } else {
      return res.status(500).send(err); // 500 error
    }
  });
};