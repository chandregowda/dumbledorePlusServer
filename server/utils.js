// Helper function that can be used commonly across controllers
const fs = require("fs-extra");
const path = require("path");
const json2xls = require('json2xls');
const exec = require('child_process').exec;
const moment = require('moment');
const mkdirp = require('mkdirp');

const {
  CONFIG
} = require('../config/config');

function isValidIpAddress(ip) {
  return /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/.test(ip);
} // Function End

exports.pingServer = (ip) => {
  let waitSeconds = 3, // ping timeout
    cmd = `ping -c 3 -W ${waitSeconds} ${ip}`;

  return new Promise((resolve, reject) => {
    if (!isValidIpAddress(ip)) {
      reject("Invalid IP Address");
    }
    // console.log(`Pinging Server ${ip}`);
    exec(cmd, (error, stdout, stderr) => {
      // console.log(`PING Completed for ${cmd}`);
      if (stdout) {
        if ((JSON.stringify(stdout) || '').indexOf('0 received') !== -1) {
          reject(`${ip} Failed to PING`)
        }
        resolve(`${ip} PINGED successfully`);
      } else if (stderr) {
        console.log("STD ERR", JSON.stringify(stderr));
        reject('STDERR');
      } else if (error) {
        console.log("ERROR: ", JSON.stringify(error));
        reject('ERROR');
      }
    });
  });
}; // Function: pingServer

/**
 * @param {
 *  ip -> Required -> IP Address to connect
 *  command -> Required -> Command to execute in connected server
 *  connectionTimeOut -> Optional -> default to 3000
 *  enclosure -> Optional -> Should the command be enclosed in Single or Double quotes -> default to ", if single quote is required pass SINGLE_QUOTES as value
 * } options 
 * - return promise
 */
exports.executeCommand = (options) => {
  let connectionTimeOut = options.connectionTimeOut || 300; // wait for 5 minutes max
  let ConnectionAttempts = options.ConnectionAttempts || 2; // retry 2 times
  // let tempFile = `/tmp/capiTEMP_${Date.now()}_${parseInt(Math.random()*10000000)}`;
  let redirectToFile = (options.redirectOutputTo) ? ` > ${options.redirectOutputTo}` : '';

  const SSH_OPTIONS = `ssh -o ConnectionAttempts=${ConnectionAttempts} -o ConnectTimeout=${connectionTimeOut} -o BatchMode=yes -o PasswordAuthentication=no -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no `;

  // NOTE: SSH commands sent to the end server is enclosed with DOUBLE QUOTES, so need to escape that character if used
  let enclosure = options.enclosure && options.enclosure === 'SINGLE_QUOTES' ? "'" : '"'; // This should be double quotes by default or single qoute if overwritten
  let command = `${SSH_OPTIONS} ${options.ip} ${enclosure} ls >/dev/null; ${options.command} ${enclosure}  2>/dev/null | awk ' { gsub (/Role changed to.*/, ""); }1 ' | awk ' NF > 0 '  ${redirectToFile}`;
  if (redirectToFile) {
    command = `${SSH_OPTIONS} ${options.ip} ${enclosure} ls >/dev/null; ${options.command} ${enclosure}  2>/dev/null |  tail -n+2 ${redirectToFile} `;
  }

  return new Promise((resolve, reject) => {
    // "stdout maxbuffer exceeded" - to avoid this error set maxBugger to 5MB
    exports.pingServer(options.ip).then(d => {
      // console.log("SSH COMMAND :", command);
      // 5120000000 bytes
      exec(command, {
        maxBuffer: 1024 * 5000000
      }, (error, stdout, stderr) => {
        if (error) {
          console.log(`SSH ERROR: Something went wrong while executing ${command}: ${error}`);
          reject(error);
        } else {
          // stdout = stdout.replace(/Role changed to: Yodlee-restricted-role-logmntr/i, '');
          // console.log(`Got SSH Response for ${options.ip}`);
          stdout = stdout.replace(/\n$/, '');
          resolve(stdout);
        }
        // console.log("STD SSH ERROR:", stderr);
        // return reject(`SSH ERROR: ${command}`);
      });
    }).catch(e => {
      reject(e);
    });
  });
} // Function: executeCommand

exports.createFolder = function (folderName) {
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
  folder = './public/',
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
    let mail = req.cookies && req.cookies.mail ? req.cookies.mail : CONFIG.mailServerConfig.sendTo;
    options += ` --mailTo='${mail}'`;
  }

  let trackingId = Date.now();
  options += ` --trackingId=${trackingId}`;

  return options;
} // Function : getOptions;

/**
 * 
 * @param {mailTo, environments, datacenters, processInfo, <searchDate>} filters 
 * processInfo is object of process details that contain:
 *  ip, instance, component, deploymentMethod
 * @param apiFunctionHandler - promise Function
 */
exports.loopThroughInstance = (filters, apiName, apiFunctionHandler) => {
  console.log("Inside loopThroughInstance", JSON.stringify(filters, undefined, 2));
  let currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  let {
    mailTo,
    environments,
    datacenters,
    searchDate,
    searchString,
    processInfo,
    logType
  } = filters;

  console.log(`${currentTime} ${mailTo}: ${apiName} - Looping through ${processInfo.length} process`);

  return new Promise((resolve, reject) => {
    let trackingId = Date.now();

    let requestCount = 0;
    let responseCount = 0;
    let finalResult = [];

    processInfo.forEach((process) => {
      requestCount++;

      let {
        ip,
        instance,
        component,
        deploymentMethod
      } = process;

      let options = {
        mailTo,
        environments,
        datacenters,
        ip,
        instance,
        component,
        deploymentMethod,
        logDate: searchDate,
        searchString,
        trackingId,
        logType
      };

      console.log(
        `[${requestCount}]: Sending ${apiName} request for ${environments} ${datacenters} ${ip} ${instance} ${component} ${deploymentMethod}`
      );

      apiFunctionHandler(options).then(result => {
        responseCount++;
        // console.log(`[${trackingId}] : API SCAN Result :`, result);
        try {
          if (typeof result === 'string') {
            finalResult = finalResult.concat(JSON.parse(result));
          } else {
            finalResult = finalResult.concat(result);
          }
        } catch (e) {
          console.log(result);
          console.log(`Failed to convert JSON response for ${apiName} request for ${environments} ${datacenters} ${ip} ${instance} ${component} ${deploymentMethod}`);
          console.log(e);
        }
        checkForComplete();
      }).catch(e => {
        console.log(`Some error during ${apiName}`, e);
        responseCount++;
        checkForComplete();
      });
    }); // processInfo.forEach

    function checkForComplete() {
      // console.log(`[${responseCount}/${requestCount}]: [${trackingId}] : Total ${finalResult.length} API: ${apiName} `);
      if (responseCount >= requestCount) {
        resolve(finalResult);
      }
    }
  });
} // loopThroughInstance