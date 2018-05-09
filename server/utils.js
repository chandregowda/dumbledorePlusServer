// Helper function that can be used commonly across controllers
let fs = require("fs-extra");
let path = require("path");
let json2xls = require('json2xls');
let exec = require('child_process').exec;
// const moment = require('moment');
let mkdirp = require('mkdirp');

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
          return resolve("Gzipped " + xlsFileName + " Excel successfully");
        }
      });
    }
    // console.log("Created" + xlsFileName + " Excel successfully")
    return resolve("Created" + xlsFileName + " Excel successfully")
  })
};