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

Scanner.getComponentExceptionSummary = function (req, res) {
  // console.log("Log Exception summary in getComponentExceptionSummary")

  let filters = req.body;
  // console.log(JSON.stringify(req.body, undefined, 2))
  // REMOVE THE BELOW DUMMY RETURN
  // return res.json({
  //   message: "Scanned Output"
  // })


  var url = 'https://dumbledore.yodlee.com/capi/getComponentExceptionSummary';

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
    var headers = httpRes.headers
    var statusCode = httpRes.statusCode
    // console.log('headers: ', headers)
    // console.log('statusCode: ', statusCode)
    // console.log('result: ', result)
    // console.log(typeof (result));
    // let summary = "";
    // if (typeof (result) == 'object') {
    //   try {
    //     summary = JSON.stringify(JSON.parse(result));
    //   } catch (e) {
    //     console.log('JSON Conversion error', e)
    //   }
    // } else {
    //   summary = result;
    // }
    // console.log("SUMMARY: ", summary);

    saveExceptionSummary({
      accountName: filters.mailTo ? filters.mailTo.replace(/@.*$/, '') : 'unknown',
      summary: result,
      filters
    }).then(d => console.log('Successfully saved Exception Summary')).catch(e => console.log(e))

    res.send(result);
  })
};