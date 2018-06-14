'use strict';
const utils = require('../utils');
const moment = require('moment');
const path = require('path');

const {
    CONFIG
} = require('../../config/config');

const Misc = {};
module.exports = {
    Misc
};

function fetchFilesFromServer(filters) {
    // console.log("Inside fetchFilesFromServer", JSON.stringify(filters, undefined, 2));

    return new Promise((resolve, reject) => {
        let command = ` cat ${filters.filename}`;
        utils.executeCommand({ command, ip: filters.ip }).then(r => resolve(r)).catch(e => {
            console.log(e);
            reject(e);
        })
    });
} // Function: fetchFilesFromServer

// API to scan Exception logs from either Core or Server Logs and also API for REST/YSL/NODE from Access Log
Misc.getFile = function (req, res) {
    let filters = req.body;

    fetchFilesFromServer(filters)
        .then((result) => {
            console.log('Response for getFile received');
            if (result) {
                return res.send(result);
            }
            return res.status(400).send(e);
        })
        .catch((e) => {
            console.error('Error Fetching Files: ', e);
            console.log(e);
            return res.status(400).send(e);
        });
}; // API: getFile
// End of Misc
