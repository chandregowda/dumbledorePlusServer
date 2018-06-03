// Helper function that can be used commonly across controllers
let fs = require("fs-extra");
let path = require("path");
let json2xls = require('json2xls');
let exec = require('child_process').exec;
// const moment = require('moment');
let mkdirp = require('mkdirp');

const {
  CONFIG
} = require('../config/config');


exports.createFolder = function (folderName) {
  // Create temporary folder to save files
  // console.log("Creating folder:" + folderName);
  mkdirp(folderName, {
    mode: '0666' // Read and Write mode
  }, function (err, m) {
    if (err) {
      console.log("ERR: " + err, ' & Msg: ' + m);
    }
    return m;
  });
}; // Function : createFolder

exports.writeToExcel = function ({
  jsonData = {
    blank: 'nothing'
  },
  folder = './public/downloads',
  filename = './temp.xlsx',
  shouldCompress = false
}) {
  exports.createFolder(folder);

  return new Promise((resolve, reject) => {
    let xls = json2xls(jsonData);
    let xlsFileName = path.resolve(folder, filename);

    fs.writeFileSync(xlsFileName, xls, 'binary');

    if (shouldCompress) {
      let zipCmd = "gzip " + xlsFileName;
      // console.log("Compressing Excel File" + filename);
      exec(zipCmd, function (error, stdout, stderr) {
        if (error) {
          console.log("Failed to zip " + filename);
          return reject("Failed to zip " + filename);
        } else if (stderr) {
          console.log("Something went wrong to zip" + stderr);
          return reject("Something went wrong to zip" + stderr);
        } else {
          // console.log("Gzipped " + xlsFileName + " Excel successfully");
          return resolve(xlsFileName);
        }
      });
    }
    // console.log("Created" + xlsFileName + " Excel successfully")
    return resolve(xlsFileName)
  })
};

function callCapi(options) {
  const capiPath = CONFIG.capiPath || "/home/logmonitor/utils";
  const capiScript = path.resolve(capiPath, 'server/main.server.js');

  let command = `node --max_old_space_size=10000 ${capiScript} ${options} -vv `;
  let bufferSize = 1024 * 1024 * 1024; // 1 GB
  console.log(`Calling Script with command: ${command}`);
  return new Promise((resolve, reject) => {
    exec(command, {
      maxBuffer: bufferSize
    }, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      } else if (stderr.trim()) {
        return reject(stderr)
      } else {
        return resolve(stdout.replace(/^\n+|\n+$/g, ''));
      }
    });
  });
} // Function: callCapi

exports.processCommand = (apiName, options) => {
  let parameters = JSON.stringify(options);

  return new Promise((resolve, reject) => {
    console.log("Sending request to API: " + apiName);

    callCapi(options).then(response => {
      console.log(`API: ${apiName} completed successfully : ${parameters}`);
      resolve(response);
    }).catch(e => {
      console.log(`API: ${apiName} FAILED with error ${e} : ${parameters}`);
      reject(e);
    });
  });
} // Function: processCommand

exports.getOptions = (req, apiName) => {
  let options = ` --${apiName}`;

  if (req.body.datacenters && typeof (req.body.datacenters) === "string" && req.body.datacenters.trim()) {
    options += ` --datacenters='${req.body.datacenters}'`;
  }
  if (req.body.environments && typeof (req.body.environments) === "string" && req.body.environments.trim()) {
    options += ` --environments='${req.body.environments}'`;
  }
  if (req.body.mailTo && typeof (req.body.mailTo) === "string" && req.body.mailTo.trim()) {
    options += ` --mailTo='${req.body.mailTo}'`;
  } else {
    let mail = req.cookies.mail || CONFIG.mailServerConfig.sendTo;
    options += ` --mailTo='${mail}'`;
  }

  let trackingId = Date.now();
  options += ` --trackingId=${trackingId}`;

  return options;
} // Function : getOptions;