const {
  CONFIG
} = require('../../config/config');

const IpStatus = {};
module.exports = {
  IpStatus
};

const fetch = require('node-fetch');

// const createExcel = (json) => {
//   return new Promise((resolve, reject) => {
//     const utils = require('../utils');
//     utils.writeToExcel({
//       jsonData: json,
//       folder: CONFIG.processDetailsFilePath,
//       filename: 'IpStatus.xlsx'
//     }).then(r => resolve(r)).catch(e => reject(e));
//   });
// }

IpStatus.retry = function (req, res) {
  console.log("Retrying Failed Ip's");
  // fetch('https://dumbledore.yodlee.com/newprocess/get', 
  fetch('https://dumbledore.yodlee.com/capi/retryFailedIp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(result => result.json())
    .then(json => {
      // console.log(json)
      console.log("Retry Failed IpStatus completed");
      // createExcel(json).then((r) => console.log(r)).catch(e => console.log(e));
      res.send(json);
    })
    .catch(err => console.error(err));
}

IpStatus.get = function (req, res) {
  console.log("Getting IpStatus details");
  // fetch('https://dumbledore.yodlee.com/newprocess/get', 
  fetch('https://dumbledore.yodlee.com/ipStatus/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(result => result.json())
    .then(json => {
      // console.log(json)
      console.log("Got IpStatus Details");
      // createExcel(json).then((r) => console.log(r)).catch(e => console.log(e));
      res.send(json);
    })
    .catch(err => console.error(err));
};