const Scanner = {};
module.exports = {
  Scanner
};

Scanner.getComponentExceptionSummary = function (req, res) {
  console.log("Log Exception summary in getComponentExceptionSummary")

  console.log(JSON.stringify(req.body, undefined, 2))
  // REMOVE THE BELOW DUMMY RETURN
  // return res.json({
  //   message: "Scanned Output"
  // })

  var request = require('request');

  var url = 'https://dumbledore.yodlee.com/capi/getComponentExceptionSummary';

  var options = {
    method: 'post',
    body: req.body,
    json: true,
    url: url
  }
  request(options, function (err, httpRes, body) {
    if (err) {
      console.error('error posting json: ', err)
      res.status(400).send(err)
    }
    var headers = httpRes.headers
    var statusCode = httpRes.statusCode
    console.log('headers: ', headers)
    console.log('statusCode: ', statusCode)
    console.log('body: ', body)
    res.send(body)
  })
};