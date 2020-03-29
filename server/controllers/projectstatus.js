/**
 * Project:  valueinfinity-mvp
 * File:     /server/controllers/projectstatus.js
 * Created:  2019-05-28
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:
 */
"use strict";

// declaractions
const models = require("../models");
const logger = require("../util/logger")(__filename);
const callerType = "controller";

module.exports = {

  // List all statuses
  list(req, res) {
    return models.ProjectStatus.findAll({
    })
      .then(_s => {
        logger.debug(`${callerType} list -> successful, count: ${_s.length}`);
        res.status(201).send(_s);
      })
      .catch(error => {
        logger.error(`${callerType} list -> error: ${error.stack}`);
        res.status(400).send(error);
      });
  }
};
