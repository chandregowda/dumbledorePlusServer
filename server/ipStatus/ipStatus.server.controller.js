const {
  CONFIG
} = require('../../config/config');

const IpStatus = {};
module.exports = {
  IpStatus
};

const IpStatusModel = require('../models/ipStatus.model');

const fetch = require('node-fetch');

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
  let query = {}; // No filter
  IpStatusModel.get(query, function (err, result = {}) {

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