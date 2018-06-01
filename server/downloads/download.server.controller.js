'use strict';
const DownloadModel = require('../models/download.model');

const Download = {};
module.exports = {
  Download
};

/*
{
"environment":"production",
"datacenter": "SC9",
"ip":"172.17.80.166",
"instance":11,
"component": "ALERTS",
"filename": "/var/log/jboss_instance-11/server.log.2018050404.2018050405.gz",
"extractedFile":"production-sc9-server-172_17_80_166-11-ALERTS-1525500876150-cgowda.log.gz",
"logFileDate":"2018-05-05",
"generatedBy":"cgowda"
}

*/
Download.create = function (req, res) {
  console.log("Creating Download with ", req.body)
  DownloadModel.create(req.body, function (err, result) {
    if (!err) {
      console.log("Download Created")
      if (!result) {
        // First time downloads upsert not returning previous record
        // Fetch newly stored downloads data
        result = {
          message: 'NEW_DOWNLOAD',
          details: req.body
        }
      }
      return res.json(result);
    } else {
      return res.status(500).send(err); // 500 error
    }
  });
};
// Get
Download.get = function (req, res) {
  let query = req.body.filename && req.body.filename.trim() ? {
    filename: req.body.filename.trim()
  } : {};
  if (req.body.ip && req.body.ip.trim()) {
    query.ip = req.body.ip.trim();
  }
  if (req.body.instance && parseInt(req.body.instance)) {
    query.instance = req.body.instance;
  }
  if (req.body.component && req.body.component.trim()) {
    query.component = req.body.component.trim();
  }

  DownloadModel.get(query, function (err, result = {}) {
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

// Delete
Download.delete = function (req, res) {
  DownloadModel.removeById({
    _id: req.query.id,
    owner: req.query.owner
  }, function (err, result) {
    if (!err) {
      return res.json(result);
    } else {
      return res.status(500).send(err); // 500 error
    }
  });
};

// Update
Download.update = function (req, res) {
  let query = req.query.id ? {
    _id: req.query.id
  } : {};
  DownloadModel.updateById(query, req.body, function (err, result) {
    if (!err) {
      return res.json(result);
    } else {
      return res.status(500).send(err); // 500 error
    }
  });
};