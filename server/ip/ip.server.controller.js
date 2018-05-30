const {
  CONFIG
} = require('../../config/config');

const Ip = {};
module.exports = {
  Ip
};

const fetch = require('node-fetch');

const createExcel = (json) => {
  return new Promise((resolve, reject) => {
    const utils = require('../utils');
    utils.writeToExcel({
      jsonData: json,
      folder: CONFIG.processDetailsFilePath,
      filename: 'Ip.xlsx'
    }).then(r => resolve(r)).catch(e => reject(e));
  });
}

Ip.get = function (req, res) {
  console.log("Getting Ip details");
  // fetch('https://dumbledore.yodlee.com/newprocess/get', 
  fetch('https://dumbledore.yodlee.com/ip/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(result => result.json())
    .then(json => {
      // console.log(json)
      console.log("Got Ip Details");
      createExcel(json).then((r) => console.log(r)).catch(e => console.log(e));
      res.send(json);
    })
    .catch(err => console.error(err));
};